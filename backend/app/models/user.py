from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """User/Agency account model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    agency_name = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    
    # Trial tracking
    trial_started_at = Column(DateTime(timezone=True), nullable=True)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    trial_used = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Email verification
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True)
    
    # Password reset
    password_reset_token = Column(String, nullable=True, index=True)
    password_reset_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Payment
    stripe_customer_id = Column(String, nullable=True, index=True)
    stripe_payment_method_id = Column(String, nullable=True)
    subscription_status = Column(String, default="trial")  # trial, active, cancelled, expired
    
    # Admin & Roles
    is_admin = Column(Boolean, default=False, nullable=False)
    role = Column(String, default="agency", nullable=False)  # admin, agency
    
    # Fraud prevention tracking
    signup_ip = Column(String, nullable=True)
    device_fingerprint = Column(String, nullable=True)
    signup_user_agent = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SignupAttempt(Base):
    """Track signup attempts for fraud detection"""
    __tablename__ = "signup_attempts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    ip_address = Column(String, index=True, nullable=False)
    device_fingerprint = Column(String, index=True, nullable=True)
    user_agent = Column(Text, nullable=True)
    success = Column(Boolean, default=False)
    blocked_reason = Column(String, nullable=True)  # duplicate_email, rate_limit, fraud_detected, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class IPBlocklist(Base):
    """Blocked IP addresses"""
    __tablename__ = "ip_blocklist"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True, index=True, nullable=False)
    reason = Column(String, nullable=True)
    blocked_until = Column(DateTime(timezone=True), nullable=True)  # None = permanent
    created_at = Column(DateTime(timezone=True), server_default=func.now())

