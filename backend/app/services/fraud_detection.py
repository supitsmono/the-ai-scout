from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
import re

# Optional imports - only if user model exists
try:
    from app.models.user import User, SignupAttempt, IPBlocklist
    USER_MODEL_AVAILABLE = True
except ImportError:
    USER_MODEL_AVAILABLE = False
    User = None
    SignupAttempt = None
    IPBlocklist = None


class FraudDetectionService:
    """Service for detecting and preventing free trial abuse"""
    
    # Disposable email domains (common ones - extend this list)
    DISPOSABLE_EMAIL_DOMAINS = [
        "10minutemail.com", "tempmail.com", "guerrillamail.com",
        "mailinator.com", "throwaway.email", "temp-mail.org"
    ]
    
    # Max signups per IP per 24 hours
    MAX_SIGNUPS_PER_IP = 2
    
    # Max signups per email (should be 1, but allow for typos)
    MAX_SIGNUPS_PER_EMAIL = 1
    
    @staticmethod
    def check_email_exists(db: Session, email: str) -> bool:
        """Check if email already exists"""
        return db.query(User).filter(User.email == email.lower()).first() is not None
    
    @staticmethod
    def check_disposable_email(email: str) -> bool:
        """Check if email is from a disposable email service"""
        domain = email.split("@")[-1].lower()
        return domain in FraudDetectionService.DISPOSABLE_EMAIL_DOMAINS
    
    @staticmethod
    def check_ip_rate_limit(db: Session, ip_address: str) -> Tuple[bool, Optional[str]]:
        """
        Check if IP has exceeded rate limit
        Returns: (is_allowed, reason_if_blocked)
        """
        if not USER_MODEL_AVAILABLE or not IPBlocklist:
            return True, None
        
        # Check if IP is permanently blocked
        blocked = db.query(IPBlocklist).filter(
            and_(
                IPBlocklist.ip_address == ip_address,
                or_(
                    IPBlocklist.blocked_until.is_(None),
                    IPBlocklist.blocked_until > datetime.utcnow()
                )
            )
        ).first()
        
        if blocked:
            return False, f"IP blocked: {blocked.reason}"
        
        # Check recent signup attempts from this IP
        since = datetime.utcnow() - timedelta(hours=24)
        recent_attempts = db.query(SignupAttempt).filter(
            and_(
                SignupAttempt.ip_address == ip_address,
                SignupAttempt.created_at >= since,
                SignupAttempt.success == True
            )
        ).count()
        
        if recent_attempts >= FraudDetectionService.MAX_SIGNUPS_PER_IP:
            return False, f"Rate limit exceeded: {recent_attempts} signups in last 24 hours"
        
        return True, None
    
    @staticmethod
    def check_email_rate_limit(db: Session, email: str) -> Tuple[bool, Optional[str]]:
        """Check if email has been used before"""
        email_lower = email.lower()
        
        # Check if user already exists
        if FraudDetectionService.check_email_exists(db, email_lower):
            return False, "Email already registered"
        
        # Check recent signup attempts with this email
        since = datetime.utcnow() - timedelta(days=7)
        recent_attempts = db.query(SignupAttempt).filter(
            and_(
                SignupAttempt.email == email_lower,
                SignupAttempt.created_at >= since,
                SignupAttempt.success == True
            )
        ).count()
        
        if recent_attempts >= FraudDetectionService.MAX_SIGNUPS_PER_EMAIL:
            return False, "Email has already been used for a free trial"
        
        return True, None
    
    @staticmethod
    def check_device_fingerprint(db: Session, device_fingerprint: str) -> Tuple[bool, Optional[str]]:
        """Check if device fingerprint has been used recently"""
        if not device_fingerprint:
            return True, None
        
        since = datetime.utcnow() - timedelta(days=7)
        recent_signups = db.query(SignupAttempt).filter(
            and_(
                SignupAttempt.device_fingerprint == device_fingerprint,
                SignupAttempt.created_at >= since,
                SignupAttempt.success == True
            )
        ).count()
        
        if recent_signups >= 1:
            return False, "This device has already been used for a free trial"
        
        return True, None
    
    @staticmethod
    def check_agency_name_similarity(db: Session, agency_name: str) -> Tuple[bool, Optional[str]]:
        """
        Check for similar agency names (fuzzy matching)
        This is a simple implementation - consider using fuzzywuzzy for better matching
        """
        agency_lower = agency_name.lower().strip()
        
        # Get all existing agency names
        existing_agencies = db.query(User.agency_name).all()
        
        for (existing_name,) in existing_agencies:
            existing_lower = existing_name.lower().strip()
            
            # Exact match
            if agency_lower == existing_lower:
                return False, "Agency name already exists"
            
            # Similarity check (simple - can be improved)
            # Check if one contains the other (with some length threshold)
            if len(agency_lower) > 5 and len(existing_lower) > 5:
                if agency_lower in existing_lower or existing_lower in agency_lower:
                    # Flag for manual review instead of blocking
                    return True, "similar_agency_name"
        
        return True, None
    
    @staticmethod
    def record_signup_attempt(
        db: Session,
        email: str,
        ip_address: str,
        device_fingerprint: Optional[str] = None,
        user_agent: Optional[str] = None,
        success: bool = False,
        blocked_reason: Optional[str] = None
    ) -> SignupAttempt:
        """Record a signup attempt for tracking"""
        attempt = SignupAttempt(
            email=email.lower(),
            ip_address=ip_address,
            device_fingerprint=device_fingerprint,
            user_agent=user_agent,
            success=success,
            blocked_reason=blocked_reason
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return attempt
    
    @staticmethod
    def block_ip(db: Session, ip_address: str, reason: str, blocked_until: Optional[datetime] = None):
        """Block an IP address"""
        existing = db.query(IPBlocklist).filter(IPBlocklist.ip_address == ip_address).first()
        
        if existing:
            existing.reason = reason
            existing.blocked_until = blocked_until
        else:
            blocked = IPBlocklist(
                ip_address=ip_address,
                reason=reason,
                blocked_until=blocked_until
            )
            db.add(blocked)
        
        db.commit()
    
    @staticmethod
    def validate_signup(
        db: Session,
        email: str,
        ip_address: str,
        agency_name: str,
        device_fingerprint: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Comprehensive signup validation
        Returns: (is_valid, error_message)
        """
        # Check disposable email
        if FraudDetectionService.check_disposable_email(email):
            FraudDetectionService.record_signup_attempt(
                db, email, ip_address, device_fingerprint, user_agent,
                success=False, blocked_reason="disposable_email"
            )
            return False, "Disposable email addresses are not allowed"
        
        # Check email rate limit
        email_allowed, email_reason = FraudDetectionService.check_email_rate_limit(db, email)
        if not email_allowed:
            FraudDetectionService.record_signup_attempt(
                db, email, ip_address, device_fingerprint, user_agent,
                success=False, blocked_reason=email_reason
            )
            return False, email_reason or "Email not allowed"
        
        # Check IP rate limit
        ip_allowed, ip_reason = FraudDetectionService.check_ip_rate_limit(db, ip_address)
        if not ip_allowed:
            FraudDetectionService.record_signup_attempt(
                db, email, ip_address, device_fingerprint, user_agent,
                success=False, blocked_reason=ip_reason
            )
            return False, ip_reason or "IP rate limit exceeded"
        
        # Check device fingerprint
        device_allowed, device_reason = FraudDetectionService.check_device_fingerprint(db, device_fingerprint)
        if not device_allowed:
            FraudDetectionService.record_signup_attempt(
                db, email, ip_address, device_fingerprint, user_agent,
                success=False, blocked_reason=device_reason
            )
            return False, device_reason or "Device already used"
        
        # Check agency name similarity (warning only, don't block)
        agency_allowed, agency_reason = FraudDetectionService.check_agency_name_similarity(db, agency_name)
        if agency_reason == "similar_agency_name":
            # Log for manual review but allow signup
            pass
        
        return True, None

