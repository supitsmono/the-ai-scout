from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List
from collections import defaultdict

from app.database import get_db
from app.models.model import Model
from app.models.chat import Chat

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    """Get comprehensive analytics overview"""
    total_models = db.query(Model).count()
    total_chats = db.query(Chat).count()
    active_chats = db.query(Chat).filter(Chat.is_open == True).count()
    
    # AI Classification breakdown (only categories used in dashboard tabs)
    valid_categories = ["perfectFit", "goodFit", "lowPotential"]
    ai_breakdown = db.query(
        Model.ai_category,
        func.count(Model.id).label('count')
    ).filter(Model.ai_category.in_(valid_categories)).group_by(Model.ai_category).all()
    
    ai_stats = {category: count for category, count in ai_breakdown}
    
    return {
        "total_models": total_models,
        "total_chats": total_chats,
        "active_chats": active_chats,
        "ai_classification": ai_stats,
    }


@router.get("/countries")
def get_country_breakdown(db: Session = Depends(get_db)):
    """Get breakdown of models by country"""
    country_stats = db.query(
        Model.country,
        func.count(Model.id).label('count')
    ).group_by(Model.country).order_by(func.count(Model.id).desc()).all()
    
    return {
        "countries": [
            {"country": country or "Unknown", "count": count}
            for country, count in country_stats
        ]
    }


@router.get("/age-distribution")
def get_age_distribution(db: Session = Depends(get_db)):
    """Get age distribution of models"""
    # Group by age ranges
    age_ranges = {
        "18-20": db.query(Model).filter(Model.age >= 18, Model.age <= 20).count(),
        "21-25": db.query(Model).filter(Model.age >= 21, Model.age <= 25).count(),
        "26-30": db.query(Model).filter(Model.age >= 26, Model.age <= 30).count(),
        "31-35": db.query(Model).filter(Model.age >= 31, Model.age <= 35).count(),
        "36+": db.query(Model).filter(Model.age >= 36).count(),
    }
    
    return {
        "age_ranges": age_ranges,
        "average_age": db.query(func.avg(Model.age)).scalar() or 0,
        "min_age": db.query(func.min(Model.age)).scalar() or 0,
        "max_age": db.query(func.max(Model.age)).scalar() or 0,
    }


@router.get("/ai-classification")
def get_ai_classification_stats(db: Session = Depends(get_db)):
    """Get detailed AI classification statistics - only shows categories used in dashboard"""
    # Only get categories that exist in dashboard tabs
    valid_categories = ["perfectFit", "goodFit", "lowPotential"]
    
    classifications = db.query(
        Model.ai_category,
        func.count(Model.id).label('count')
    ).filter(Model.ai_category.in_(valid_categories)).group_by(Model.ai_category).all()
    
    total_classified = sum(count for _, count in classifications)
    total_models = db.query(Model).count()
    
    # Count unclassified models (null or not in valid categories)
    unclassified_count = total_models - total_classified
    
    return {
        "breakdown": [
            {"category": category, "count": count}
            for category, count in classifications
        ],
        "total_classified": total_classified,
        "unclassified_count": unclassified_count,
        "total_models": total_models,
        "classification_rate": (total_classified / total_models * 100) if total_models > 0 else 0,
    }


@router.get("/pipeline-flow")
def get_pipeline_flow(db: Session = Depends(get_db)):
    """Get pipeline flow statistics - only shows AI classification categories used in dashboard"""
    # Only show AI categories that are actually used in the dashboard tabs
    # Dashboard uses: all, perfectFit, goodFit, lowPotential (no unclassified tab)
    ai_categories = ["perfectFit", "goodFit", "lowPotential"]
    
    stats = {}
    total_models = db.query(Model).count()
    
    # Get counts for each AI category (only the ones that exist in dashboard tabs)
    for category in ai_categories:
        count = db.query(Model).filter(Model.ai_category == category).count()
        stats[category] = count
    
    # Calculate percentages based on total models
    percentages = {}
    if total_models > 0:
        for category, count in stats.items():
            percentages[category] = (count / total_models * 100)
    
    return {
        "categories": stats,
        "percentages": percentages,
        "total_models": total_models,
    }


@router.get("/engagement")
def get_engagement_stats(db: Session = Depends(get_db)):
    """Get engagement statistics - contact rate, active chats, etc."""
    total_models = db.query(Model).count()
    contacted_models = db.query(Model).filter(Model.status == "contacted").count()
    total_chats = db.query(Chat).count()
    active_chats = db.query(Chat).filter(Chat.is_open == True).count()
    archived_chats = db.query(Chat).filter(Chat.is_archived == True).count()
    
    # Calculate contact rate
    contact_rate = (contacted_models / total_models * 100) if total_models > 0 else 0
    
    # Get total messages count
    from app.models.message import Message
    total_messages = db.query(Message).count()
    
    return {
        "total_models": total_models,
        "contacted_models": contacted_models,
        "contact_rate": contact_rate,
        "total_chats": total_chats,
        "active_chats": active_chats,
        "archived_chats": archived_chats,
        "total_messages": total_messages,
        "avg_messages_per_chat": (total_messages / total_chats) if total_chats > 0 else 0,
    }

