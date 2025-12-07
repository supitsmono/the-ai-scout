from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.model import Model
from app.schemas.model import ModelResponse

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])


@router.get("/stages", response_model=List[dict])
def get_pipeline_stages():
    """Get all available pipeline stages with metadata (excludes contacted - those go to Chats)"""
    return [
        {
            "key": "applied",
            "label": "Applied",
            "description": "New applications (AI classified)",
            "color": "gray",
        },
        {
            "key": "reviewing",
            "label": "Reviewing",
            "description": "Under agency review",
            "color": "blue",
        },
        {
            "key": "perfectFit",
            "label": "Perfect Fit",
            "description": "AI classified as perfect fit",
            "color": "green",
        },
        {
            "key": "goodFit",
            "label": "Good Fit",
            "description": "AI classified as good fit",
            "color": "yellow",
        },
        {
            "key": "interview",
            "label": "Interview",
            "description": "Scheduled/conducted interview",
            "color": "indigo",
        },
        {
            "key": "selected",
            "label": "Selected",
            "description": "Model selected for projects",
            "color": "emerald",
        },
        {
            "key": "rejected",
            "label": "Rejected",
            "description": "Not a fit",
            "color": "red",
        },
    ]


@router.get("/{stage}", response_model=List[ModelResponse])
def get_models_by_stage(stage: str, db: Session = Depends(get_db)):
    """Get all models in a specific pipeline stage (excludes contacted models - those are in Chats)"""
    valid_stages = [
        "applied",
        "reviewing",
        "perfectFit",
        "goodFit",
        "interview",
        "selected",
        "rejected",
    ]
    
    if stage not in valid_stages:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Must be one of: {', '.join(valid_stages)}")
    
    # Exclude contacted models from pipeline - they should be in Chats
    base_query = db.query(Model).filter(Model.status != "contacted")
    
    # For "applied" stage, include models with null pipeline_stage or "applied"
    if stage == "applied":
        models = base_query.filter(
            (Model.pipeline_stage == stage) | (Model.pipeline_stage == None)
        ).all()
    else:
        models = base_query.filter(Model.pipeline_stage == stage).all()
    
    return models


@router.patch("/models/{model_id}/stage")
def update_model_stage(
    model_id: int,
    stage: str = Query(..., description="Pipeline stage to move model to"),
    db: Session = Depends(get_db),
):
    """Move a model to a different pipeline stage (cannot move to 'contacted' - use contact endpoint)"""
    valid_stages = [
        "applied",
        "reviewing",
        "perfectFit",
        "goodFit",
        "interview",
        "selected",
        "rejected",
    ]
    
    if stage not in valid_stages:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Must be one of: {', '.join(valid_stages)}. Use contact endpoint to contact a model.")
    
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model.pipeline_stage = stage
    db.commit()
    db.refresh(model)
    
    return {
        "message": "Pipeline stage updated",
        "model_id": model.id,
        "new_stage": model.pipeline_stage,
    }


@router.get("/stats", response_model=dict)
def get_pipeline_stats(db: Session = Depends(get_db)):
    """Get statistics for each pipeline stage (excludes contacted models)"""
    stages = [
        "applied",
        "reviewing",
        "perfectFit",
        "goodFit",
        "interview",
        "selected",
        "rejected",
    ]
    
    # Base query excludes contacted models
    base_query = db.query(Model).filter(Model.status != "contacted")
    
    stats = {}
    for stage in stages:
        if stage == "applied":
            # Include models with null pipeline_stage in "applied"
            count = base_query.filter(
                (Model.pipeline_stage == stage) | (Model.pipeline_stage == None)
            ).count()
        else:
            count = base_query.filter(Model.pipeline_stage == stage).count()
        stats[stage] = count
    
    return stats

