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
    
    # AI Classification breakdown
    ai_breakdown = db.query(
        Model.ai_category,
        func.count(Model.id).label('count')
    ).group_by(Model.ai_category).all()
    
    ai_stats = {category or "unclassified": count for category, count in ai_breakdown}
    
    # Pipeline stage breakdown
    pipeline_breakdown = db.query(
        Model.pipeline_stage,
        func.count(Model.id).label('count')
    ).group_by(Model.pipeline_stage).all()
    
    pipeline_stats = {stage or "applied": count for stage, count in pipeline_breakdown}
    
    return {
        "total_models": total_models,
        "total_chats": total_chats,
        "active_chats": active_chats,
        "ai_classification": ai_stats,
        "pipeline_stages": pipeline_stats,
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
    """Get detailed AI classification statistics"""
    classifications = db.query(
        Model.ai_category,
        func.count(Model.id).label('count')
    ).group_by(Model.ai_category).all()
    
    total_classified = sum(count for _, count in classifications if _ is not None)
    total_models = db.query(Model).count()
    
    return {
        "breakdown": [
            {"category": category or "unclassified", "count": count}
            for category, count in classifications
        ],
        "total_classified": total_classified,
        "total_models": total_models,
        "classification_rate": (total_classified / total_models * 100) if total_models > 0 else 0,
    }


@router.get("/pipeline-flow")
def get_pipeline_flow(db: Session = Depends(get_db)):
    """Get pipeline flow statistics"""
    stages = [
        "applied",
        "reviewing",
        "perfectFit",
        "goodFit",
        "interview",
        "selected",
        "rejected",
    ]
    
    stats = {}
    for stage in stages:
        if stage == "applied":
            count = db.query(Model).filter(
                (Model.pipeline_stage == stage) | (Model.pipeline_stage == None)
            ).count()
        else:
            count = db.query(Model).filter(Model.pipeline_stage == stage).count()
        stats[stage] = count
    
    # Calculate conversion rates
    total_applied = stats.get("applied", 0)
    conversion_rates = {}
    if total_applied > 0:
        conversion_rates["to_reviewing"] = (stats.get("reviewing", 0) / total_applied * 100)
        conversion_rates["to_perfect_fit"] = (stats.get("perfectFit", 0) / total_applied * 100)
        conversion_rates["to_selected"] = (stats.get("selected", 0) / total_applied * 100)
    
    return {
        "stages": stats,
        "conversion_rates": conversion_rates,
    }

