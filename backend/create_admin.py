#!/usr/bin/env python3
"""
Script to create an admin account
Usage: python create_admin.py [--email EMAIL] [--password PASSWORD] [--name NAME]
"""
import sys
import os
import secrets
import getpass
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine
from app.models.user import User, Base
from app.routes.auth import hash_password
from datetime import datetime, timedelta


def create_admin_account(email: str, password: str, full_name: str = "Admin User"):
    """Create an admin account"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_user = db.query(User).filter(User.email == email.lower()).first()
        if existing_user:
            if existing_user.is_admin:
                print(f"❌ Admin account with email {email} already exists!")
                return False
            else:
                # Upgrade existing user to admin
                print(f"⚠️  User {email} exists. Upgrading to admin...")
                existing_user.is_admin = True
                existing_user.role = "admin"
                db.commit()
                print(f"✅ User {email} has been upgraded to admin!")
                return True
        
        # Create new admin user
        admin_user = User(
            email=email.lower(),
            agency_name="System Administration",
            full_name=full_name,
            password_hash=hash_password(password),
            is_admin=True,
            role="admin",
            is_active=True,
            email_verified=True,  # Admin accounts don't need email verification
            subscription_status="active",  # Admins have active subscription
            trial_used=True,
            trial_started_at=datetime.utcnow(),
            trial_ends_at=None,  # No expiration for admins
            created_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Admin account created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {full_name}")
        print(f"   User ID: {admin_user.id}")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin account: {e}")
        return False
    finally:
        db.close()


def generate_secure_password(length: int = 16) -> str:
    """Generate a secure random password"""
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Create an admin account for The AI Scout")
    parser.add_argument("--email", type=str, help="Admin email address")
    parser.add_argument("--password", type=str, help="Admin password (will prompt if not provided)")
    parser.add_argument("--name", type=str, default="Admin User", help="Admin full name")
    parser.add_argument("--generate-password", action="store_true", help="Generate a secure random password")
    
    args = parser.parse_args()
    
    # Get email
    if args.email:
        email = args.email
    else:
        email = input("Enter admin email: ").strip()
        if not email:
            print("❌ Email is required!")
            sys.exit(1)
    
    # Get password
    if args.generate_password:
        password = generate_secure_password()
        print(f"Generated password: {password}")
        print("⚠️  Save this password securely!")
    elif args.password:
        password = args.password
    else:
        password = getpass.getpass("Enter admin password: ")
        if not password:
            print("❌ Password is required!")
            sys.exit(1)
        
        password_confirm = getpass.getpass("Confirm password: ")
        if password != password_confirm:
            print("❌ Passwords do not match!")
            sys.exit(1)
    
    # Create admin account
    success = create_admin_account(email, password, args.name)
    
    if success:
        print("\n🎉 Admin account setup complete!")
        print("You can now log in to the admin dashboard.")
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()

