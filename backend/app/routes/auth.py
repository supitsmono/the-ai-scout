from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
import secrets
import os

from app.database import get_db

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
    card_number: str
    expiry_date: str  # MM/YY format
    cvv: str
    cardholder_name: str
    device_fingerprint: str | None = None


class SignupResponse(BaseModel):
    success: bool
    message: str
    user_id: int | None = None
    requires_email_verification: bool = False


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
    
    # 3. Parse expiry date
    try:
        month, year = payload.expiry_date.split("/")
        expiry_month = int(month)
        expiry_year = int(year)
    except:
        raise HTTPException(status_code=400, detail="Invalid expiry date format")
    
    # 4. Create Stripe customer and payment method
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
        
        # Create payment method
        payment_method = stripe_service.StripeService.create_payment_method(
            card_number=payload.card_number,
            expiry_month=expiry_month,
            expiry_year=expiry_year,
            cvc=payload.cvv,
            cardholder_name=payload.cardholder_name
        )
        
        # Attach payment method to customer
        stripe_service.StripeService.attach_payment_method_to_customer(
            payment_method.id,
            stripe_customer.id
        )
        
        # Check for duplicate payment method (via fingerprint)
        fingerprint = stripe_service.StripeService.get_payment_method_fingerprint(payment_method.id)
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
        price_id = os.getenv("STRIPE_PRICE_ID", "")  # Set this in your .env
        if not price_id:
            # For development, skip subscription creation
            subscription_id = None
        else:
            subscription = stripe_service.StripeService.create_subscription(
                customer_id=stripe_customer.id,
                payment_method_id=payment_method.id,
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
        stripe_payment_method_id=payment_method.id,
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
    
    # 8. Send verification email (implement this)
    # send_verification_email(payload.email, verification_token)
    
    return SignupResponse(
        success=True,
        message="Account created successfully. Please check your email to verify your account.",
        user_id=new_user.id,
        requires_email_verification=True
    )


@router.post("/verify-email/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify email address"""
    user = db.query(User).filter(User.email_verification_token == token).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid verification token")
    
    if user.email_verified:
        return {"message": "Email already verified"}
    
    user.email_verified = True
    user.email_verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}

