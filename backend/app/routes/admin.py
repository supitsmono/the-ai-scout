"""
Admin routes for user management, statistics, and system administration
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User, SignupAttempt, IPBlocklist
from app.middleware.admin import require_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============================
# SCHEMAS
# ============================

class UserResponse(BaseModel):
    id: int
    email: str
    agency_name: str
    full_name: str
    is_active: bool
    is_admin: bool
    role: str
    email_verified: bool
    subscription_status: str
    trial_started_at: Optional[datetime]
    trial_ends_at: Optional[datetime]
    trial_used: bool
    stripe_customer_id: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    role: Optional[str] = None
    email_verified: Optional[bool] = None
    subscription_status: Optional[str] = None


class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    trial_users: int
    active_subscriptions: int
    cancelled_subscriptions: int
    expired_subscriptions: int
    new_users_today: int
    new_users_this_week: int
    new_users_this_month: int
    unverified_users: int
    admin_users: int


class SignupAttemptResponse(BaseModel):
    id: int
    email: str
    ip_address: str
    device_fingerprint: Optional[str]
    success: bool
    blocked_reason: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================
# USER MANAGEMENT
# ============================

@router.get("/users", response_model=List[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    subscription_status: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """List all users with optional filters"""
    query = db.query(User)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                User.email.ilike(search_term),
                User.agency_name.ilike(search_term),
                User.full_name.ilike(search_term)
            )
        )
    
    if subscription_status:
        query = query.filter(User.subscription_status == subscription_status)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    update_data: UserUpdateRequest,
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Update user (activate/deactivate, change role, etc.)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from removing their own admin status
    if user_id == admin.id and update_data.is_admin is False:
        raise HTTPException(
            status_code=400,
            detail="Cannot remove your own admin status"
        )
    
    # Update fields
    if update_data.is_active is not None:
        user.is_active = update_data.is_active
    if update_data.is_admin is not None:
        user.is_admin = update_data.is_admin
    if update_data.role is not None:
        user.role = update_data.role
    if update_data.email_verified is not None:
        user.email_verified = update_data.email_verified
    if update_data.subscription_status is not None:
        user.subscription_status = update_data.subscription_status
    
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user_id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.post("/users/{user_id}/reset-trial")
def reset_trial(
    user_id: int,
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Reset trial for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.trial_started_at = datetime.utcnow()
    user.trial_ends_at = datetime.utcnow() + timedelta(days=7)
    user.trial_used = True
    user.subscription_status = "trial"
    
    db.commit()
    db.refresh(user)
    return {"message": "Trial reset successfully", "trial_ends_at": user.trial_ends_at}


@router.post("/users/{user_id}/extend-trial")
def extend_trial(
    user_id: int,
    days: int = Query(7, ge=1, le=365),
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Extend trial period for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.trial_ends_at:
        user.trial_ends_at = user.trial_ends_at + timedelta(days=days)
    else:
        user.trial_ends_at = datetime.utcnow() + timedelta(days=days)
    
    if user.subscription_status == "expired":
        user.subscription_status = "trial"
    
    db.commit()
    db.refresh(user)
    return {"message": f"Trial extended by {days} days", "trial_ends_at": user.trial_ends_at}


# ============================
# STATISTICS
# ============================

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    month_start = today_start - timedelta(days=30)
    
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    trial_users = db.query(func.count(User.id)).filter(User.subscription_status == "trial").scalar()
    active_subscriptions = db.query(func.count(User.id)).filter(User.subscription_status == "active").scalar()
    cancelled_subscriptions = db.query(func.count(User.id)).filter(User.subscription_status == "cancelled").scalar()
    expired_subscriptions = db.query(func.count(User.id)).filter(User.subscription_status == "expired").scalar()
    new_users_today = db.query(func.count(User.id)).filter(User.created_at >= today_start).scalar()
    new_users_this_week = db.query(func.count(User.id)).filter(User.created_at >= week_start).scalar()
    new_users_this_month = db.query(func.count(User.id)).filter(User.created_at >= month_start).scalar()
    unverified_users = db.query(func.count(User.id)).filter(User.email_verified == False).scalar()
    admin_users = db.query(func.count(User.id)).filter(User.is_admin == True).scalar()
    
    return AdminStatsResponse(
        total_users=total_users or 0,
        active_users=active_users or 0,
        trial_users=trial_users or 0,
        active_subscriptions=active_subscriptions or 0,
        cancelled_subscriptions=cancelled_subscriptions or 0,
        expired_subscriptions=expired_subscriptions or 0,
        new_users_today=new_users_today or 0,
        new_users_this_week=new_users_this_week or 0,
        new_users_this_month=new_users_this_month or 0,
        unverified_users=unverified_users or 0,
        admin_users=admin_users or 0
    )


# ============================
# LOGS
# ============================

@router.get("/logs/signup-attempts", response_model=List[SignupAttemptResponse])
def get_signup_attempts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    success: Optional[bool] = Query(None),
    blocked_reason: Optional[str] = Query(None),
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Get signup attempt logs"""
    query = db.query(SignupAttempt)
    
    if success is not None:
        query = query.filter(SignupAttempt.success == success)
    
    if blocked_reason:
        query = query.filter(SignupAttempt.blocked_reason == blocked_reason)
    
    attempts = query.order_by(SignupAttempt.created_at.desc()).offset(skip).limit(limit).all()
    return attempts


@router.get("/logs/blocked-ips")
def get_blocked_ips(
    admin: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Get blocked IP addresses"""
    blocked_ips = db.query(IPBlocklist).order_by(IPBlocklist.created_at.desc()).all()
    return [
        {
            "id": ip.id,
            "ip_address": ip.ip_address,
            "reason": ip.reason,
            "blocked_until": ip.blocked_until,
            "created_at": ip.created_at
        }
        for ip in blocked_ips
    ]

