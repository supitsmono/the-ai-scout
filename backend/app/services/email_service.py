"""
Email service for sending emails (mock implementation for development)
In production, replace with real email service (SendGrid, AWS SES, etc.)
"""
import os
from datetime import datetime


class EmailService:
    """Mock email service for development"""
    
    @staticmethod
    def send_verification_email(email: str, token: str):
        """Send email verification email"""
        verification_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token={token}"
        
        # In development, just log to console
        print("\n" + "="*60)
        print("📧 EMAIL VERIFICATION (MOCK)")
        print("="*60)
        print(f"To: {email}")
        print(f"Subject: Verify your AI Scout account")
        print(f"\nClick the link below to verify your email:")
        print(f"{verification_url}")
        print("="*60 + "\n")
        
        # In production, use real email service:
        # sendgrid_client.send_mail(
        #     to_email=email,
        #     subject="Verify your AI Scout account",
        #     html_content=f"<a href='{verification_url}'>Verify Email</a>"
        # )
    
    @staticmethod
    def send_password_reset_email(email: str, token: str):
        """Send password reset email"""
        reset_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password/{token}"
        
        # In development, just log to console
        print("\n" + "="*60)
        print("📧 PASSWORD RESET (MOCK)")
        print("="*60)
        print(f"To: {email}")
        print(f"Subject: Reset your AI Scout password")
        print(f"\nClick the link below to reset your password:")
        print(f"{reset_url}")
        print(f"\nThis link expires in 1 hour.")
        print("="*60 + "\n")
        
        # In production, use real email service:
        # sendgrid_client.send_mail(
        #     to_email=email,
        #     subject="Reset your AI Scout password",
        #     html_content=f"<a href='{reset_url}'>Reset Password</a>"
        # )


# Convenience functions
def send_verification_email(email: str, token: str):
    """Send email verification email"""
    EmailService.send_verification_email(email, token)


def send_password_reset_email(email: str, token: str):
    """Send password reset email"""
    EmailService.send_password_reset_email(email, token)

