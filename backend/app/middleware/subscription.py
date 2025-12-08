"""
Subscription check middleware
Ensures user has active subscription before accessing protected routes
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.middleware.admin import get_current_user_from_token


def require_active_subscription(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to require active subscription
    Admins bypass this check
    """
    # Admins always have access
    if current_user.is_admin:
        return current_user
    
    # Check if subscription is active
    if current_user.subscription_status == "active":
        return current_user
    
    # Check if trial is still valid
    if current_user.subscription_status == "trial":
        if current_user.trial_ends_at and current_user.trial_ends_at > datetime.utcnow():
            return current_user
        else:
            # Trial expired, update status
            current_user.subscription_status = "expired"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Trial period has expired. Please upgrade your subscription."
            )
    
    # Subscription is cancelled or expired
    if current_user.subscription_status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Your subscription has been cancelled. Please reactivate to continue."
        )
    
    if current_user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Your subscription has expired. Please upgrade to continue."
        )
    
    # Unknown status
    raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail="Subscription required to access this resource."
    )

