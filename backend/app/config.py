"""
Configuration management for the application.
All environment variables should be loaded here.
"""
import os
from typing import List

class Settings:
    """Application settings loaded from environment variables"""
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./theaiscout.db" if ENVIRONMENT == "development" else ""
    )
    
    # JWT
    # For development, use a default secret key if not set
    # In production, this MUST be set via environment variable
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret-key-change-in-production-Xp1lmXU1vwFroNQDt5hvjpvEMrSrYO73ac-wgwLIDns" if ENVIRONMENT == "development" else ""
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", FRONTEND_URL).split(",")
        if origin.strip()
    ]
    
    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_PRICE_ID: str = os.getenv("STRIPE_PRICE_ID", "")
    
    # Email
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@aiscout.com")
    EMAIL_SERVICE: str = os.getenv("EMAIL_SERVICE", "mock")  # mock, sendgrid, etc.
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    
    # Security
    ALLOWED_HOSTS: List[str] = [
        host.strip()
        for host in os.getenv("ALLOWED_HOSTS", "").split(",")
        if host.strip()
    ]
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds
    
    # Auth Rate Limiting (stricter)
    AUTH_RATE_LIMIT_REQUESTS: int = int(os.getenv("AUTH_RATE_LIMIT_REQUESTS", "5"))
    AUTH_RATE_LIMIT_WINDOW: int = int(os.getenv("AUTH_RATE_LIMIT_WINDOW", "60"))  # seconds
    
    @classmethod
    def validate(cls) -> None:
        """Validate that all required settings are present"""
        errors = []
        
        if cls.ENVIRONMENT == "production":
            if not cls.DATABASE_URL or "sqlite" in cls.DATABASE_URL.lower():
                errors.append("DATABASE_URL must be set to PostgreSQL in production")
            
            if not cls.JWT_SECRET_KEY:
                errors.append("JWT_SECRET_KEY is required in production")
            
            if not cls.FRONTEND_URL or "localhost" in cls.FRONTEND_URL:
                errors.append("FRONTEND_URL must be set to production URL")
        
        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")
    
    @classmethod
    def get_database_url(cls) -> str:
        """Get database URL, handling Railway PostgreSQL format"""
        db_url = cls.DATABASE_URL
        
        # Railway provides DATABASE_URL in format: postgresql://user:pass@host:port/dbname
        # But SQLAlchemy might need postgresql+psycopg2://
        if db_url.startswith("postgresql://") and "+" not in db_url:
            # Convert to postgresql+psycopg2:// for SQLAlchemy
            db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        
        return db_url

# Create settings instance
settings = Settings()

# Validate settings on import (only in production)
if settings.ENVIRONMENT == "production":
    settings.validate()

