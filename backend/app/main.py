from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import config after loading .env
from app.config import settings
from app.database import Base, engine

# Import all routes
from app.routes import models, status, chats, ai

# Import all models to ensure tables are created
from app.models import model, chat, message

# Import auth routes (now enabled for signup)
AUTH_AVAILABLE = True
from app.routes import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="The AI Scout Backend",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if settings.DEBUG else None,
)

# ============================
# SECURITY MIDDLEWARE
# ============================
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# CORS must be added before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# Rate limiting (if enabled)
if settings.RATE_LIMIT_ENABLED:
    app.add_middleware(RateLimitMiddleware)

# ============================
# ROUTES REGISTEREN
# ============================

# Models (CRUD + filtering)
app.include_router(models.router, prefix="/models", tags=["Models"])

# Status updates + Contact flow
app.include_router(status.router, tags=["Status & Contact"])

# Chats (Inbox, messages, send-message)
app.include_router(chats.router, prefix="/chats", tags=["Chats"])

# AI Classification
app.include_router(ai.router, tags=["AI Classification"])

# Pipeline
from app.routes import pipeline
app.include_router(pipeline.router, tags=["Pipeline"])

# Analytics
from app.routes import analytics
app.include_router(analytics.router, tags=["Analytics"])

# Authentication (optional - only if fraud prevention is set up)
if AUTH_AVAILABLE and auth:
    app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Admin routes
from app.routes import admin
app.include_router(admin.router, tags=["Admin"])

# Stripe webhook routes
from app.routes import stripe
app.include_router(stripe.router, prefix="/stripe", tags=["Stripe"])

# ============================
# ROOT ENDPOINT
# ============================
@app.get("/")
def root():
    return {"message": "FastAPI backend running!", "phase": "2"}
