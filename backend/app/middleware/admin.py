"""
Admin authentication middleware
Requires admin role for protected routes
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from app.database import get_db
from app.models.user import User
from app.config import settings


def get_current_user(token: str = None) -> User:
    """
    Get current user from JWT token
    This is a helper function that can be used by require_admin
    """
    from fastapi import Header
    from typing import Optional
    
    # In actual usage, token comes from Authorization header
    # This is just the signature - actual implementation in routes
    pass


def require_admin(
    current_user_id: int = None,
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to require admin role
    Usage: @router.get("/admin/users", dependencies=[Depends(require_admin)])
    
    Note: This should be used with get_current_user from auth routes
    """
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = db.query(User).filter(User.id == current_user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return user


def get_current_user_from_token(
    authorization: str = None,
    db: Session = Depends(get_db)
) -> User:
    """
    Extract user from JWT token in Authorization header
    Returns User object or raises HTTPException
    """
    from fastapi import Header
    from typing import Optional
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Extract token from "Bearer <token>"
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not settings.JWT_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT_SECRET_KEY not configured"
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
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    return user


def require_admin_user(
    current_user: User = Depends(get_current_user_from_token)
) -> User:
    """
    Dependency that requires admin role
    Combines authentication and admin check
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user

