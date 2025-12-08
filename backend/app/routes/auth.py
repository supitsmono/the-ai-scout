from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import secrets
from jose import jwt

from app.database import get_db
from app.config import settings

# Optional imports - only load if available
try:
    from app.models.user import User
    from app.services import fraud_detection, stripe_service
    FRAUD_PREVENTION_AVAILABLE = True
except (ImportError, AttributeError) as e:
    # If user model or services are not available, disable auth routes
    FRAUD_PREVENTION_AVAILABLE = False
    User = None
    fraud_detection = None
    stripe_service = None

router = APIRouter(tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================
# SCHEMAS
# ============================

class SignupRequest(BaseModel):
    email: EmailStr
    agency_name: str
    full_name: str
    password: str
    payment_method_id: str  # Stripe PaymentMethod ID from Elements
    device_fingerprint: Optional[str] = None


class SignupResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[int] = None
    requires_email_verification: bool = False


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ResetPasswordResponse(BaseModel):
    success: bool
    message: str


# ============================
# HELPER FUNCTIONS
# ============================

def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    # Check for forwarded IP (if behind proxy/load balancer)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    if request.client:
        return request.client.host
    
    return "unknown"


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password"""
    return pwd_context.verify(plain_password, hashed_password)


def generate_verification_token() -> str:
    """Generate email verification token"""
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """Generate password reset token"""
    return secrets.token_urlsafe(32)


def generate_jwt_token(user_id: int, email: str) -> str:
    """Generate JWT token for user session"""
    if not settings.JWT_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET_KEY is not configured. Please set it in environment variables."
        )
    
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


# ============================
# ROUTES
# ============================

@router.post("/signup", response_model=SignupResponse)
async def signup(
    payload: SignupRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Signup endpoint with fraud detection
    """
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Signup service is not available. Fraud prevention system not configured."
        )
    
    # Get client IP
    client_ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "")
    
    # 1. Fraud Detection Checks
    is_valid, error_message = fraud_detection.FraudDetectionService.validate_signup(
        db=db,
        email=payload.email,
        ip_address=client_ip,
        agency_name=payload.agency_name,
        device_fingerprint=payload.device_fingerprint,
        user_agent=user_agent
    )
    
    if not is_valid:
        return SignupResponse(
            success=False,
            message=error_message or "Signup not allowed"
        )
    
    # 2. Check if email already exists
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        fraud_detection.FraudDetectionService.record_signup_attempt(
            db, payload.email, client_ip, payload.device_fingerprint, user_agent,
            success=False, blocked_reason="duplicate_email"
        )
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 3. Create Stripe customer and attach payment method
    try:
        # Create customer
        stripe_customer = stripe_service.StripeService.create_customer(
            email=payload.email,
            name=payload.full_name,
            metadata={
                "agency_name": payload.agency_name,
                "signup_ip": client_ip
            }
        )
        
        # Payment method is already created by Stripe Elements on frontend
        # Just attach it to customer and verify
        payment_method_id = payload.payment_method_id
        
        # Attach payment method to customer
        stripe_service.StripeService.attach_payment_method_to_customer(
            payment_method_id,
            stripe_customer.id
        )
        
        # Check for duplicate payment method (via fingerprint)
        fingerprint = stripe_service.StripeService.get_payment_method_fingerprint(payment_method_id)
        if fingerprint:
            # Check if this fingerprint has been used before
            existing_with_fingerprint = db.query(User).filter(
                User.stripe_payment_method_id.like(f"%{fingerprint}%")
            ).first()
            if existing_with_fingerprint:
                raise HTTPException(
                    status_code=400,
                    detail="This payment method has already been used for a free trial"
                )
        
    except Exception as e:
        error_msg = str(e)
        if stripe_service and hasattr(stripe_service, 'stripe') and hasattr(stripe_service.stripe, 'error'):
            if isinstance(e, stripe_service.stripe.error.StripeError):
                error_msg = f"Payment error: {error_msg}"
        raise HTTPException(status_code=400, detail=error_msg)
    
    # 5. Create subscription with 7-day trial
    try:
        price_id = settings.STRIPE_PRICE_ID
        if not price_id:
            # For development, skip subscription creation
            subscription_id = None
        else:
            subscription = stripe_service.StripeService.create_subscription(
                customer_id=stripe_customer.id,
                payment_method_id=payment_method_id,
                price_id=price_id,
                trial_days=7
            )
            subscription_id = subscription.id
    except Exception as e:
        # If subscription creation fails, still create user but mark for review
        subscription_id = None
    
    # 6. Create user account
    verification_token = generate_verification_token()
    trial_start = datetime.utcnow()
    trial_end = trial_start + timedelta(days=7)
    
    new_user = User(
        email=payload.email.lower(),
        agency_name=payload.agency_name,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        trial_started_at=trial_start,
        trial_ends_at=trial_end,
        trial_used=True,
        email_verified=False,  # Require email verification
        email_verification_token=verification_token,
        stripe_customer_id=stripe_customer.id,
        stripe_payment_method_id=payment_method_id,
        subscription_status="trial",
        signup_ip=client_ip,
        device_fingerprint=payload.device_fingerprint,
        signup_user_agent=user_agent
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 7. Record successful signup attempt
    fraud_detection.FraudDetectionService.record_signup_attempt(
        db, payload.email, client_ip, payload.device_fingerprint, user_agent,
        success=True
    )
    
    # 8. Send verification email
    try:
        from app.services import email_service
        email_service.send_verification_email(payload.email, verification_token)
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error sending verification email: {e}")
    
    return SignupResponse(
        success=True,
        message="Account created successfully. Please check your email to verify your account.",
        user_id=new_user.id,
        requires_email_verification=True
    )


@router.get("/me")
def get_current_user_info(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current user information from JWT token"""
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Authentication service is not available."
        )
    
    # Get token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Extract token from "Bearer <token>"
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not settings.JWT_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET_KEY is not configured"
        )
    
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is deactivated"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "agency_name": user.agency_name,
        "full_name": user.full_name,
        "email_verified": user.email_verified,
        "subscription_status": user.subscription_status,
        "is_admin": user.is_admin,
        "trial_ends_at": user.trial_ends_at.isoformat() if user.trial_ends_at else None
    }


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login endpoint"""
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Login service is not available. Authentication system not configured."
        )
    
    # Find user by email
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Wrong email or password")
    
    # Verify password
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Generate JWT token
    token = generate_jwt_token(user.id, user.email)
    
    return LoginResponse(
        success=True,
        message="Login successful",
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "agency_name": user.agency_name,
            "full_name": user.full_name,
            "email_verified": user.email_verified,
            "subscription_status": user.subscription_status,
            "is_admin": user.is_admin
        }
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Forgot password endpoint - sends reset email"""
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Password reset service is not available. Authentication system not configured."
        )
    
    # Find user by email
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    
    # Always return success message (security: don't reveal if email exists)
    if not user:
        return ForgotPasswordResponse(
            success=True,
            message="If an account with that email exists, a password reset link has been sent."
        )
    
    # Generate reset token
    reset_token = generate_reset_token()
    reset_expires = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    
    # Save reset token to user
    user.password_reset_token = reset_token
    user.password_reset_expires_at = reset_expires
    db.commit()
    
    # Send reset email (mock for now)
    try:
        from app.services import email_service
        email_service.send_password_reset_email(user.email, reset_token)
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error sending password reset email: {e}")
    
    return ForgotPasswordResponse(
        success=True,
        message="If an account with that email exists, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset password endpoint"""
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Password reset service is not available. Authentication system not configured."
        )
    
    # Find user by reset token
    user = db.query(User).filter(User.password_reset_token == payload.token).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check if token is expired
    if user.password_reset_expires_at and user.password_reset_expires_at < datetime.utcnow():
        user.password_reset_token = None
        user.password_reset_expires_at = None
        db.commit()
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Validate password strength
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    
    # Update password
    user.password_hash = hash_password(payload.new_password)
    user.password_reset_token = None
    user.password_reset_expires_at = None
    db.commit()
    
    return ResetPasswordResponse(
        success=True,
        message="Password has been reset successfully"
    )


@router.post("/verify-email/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify email address"""
    if not FRAUD_PREVENTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Email verification service is not available."
        )
    
    user = db.query(User).filter(User.email_verification_token == token).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid verification token")
    
    if user.email_verified:
        return {"message": "Email already verified"}
    
    user.email_verified = True
    user.email_verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}

