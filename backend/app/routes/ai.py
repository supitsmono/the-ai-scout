from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.database import get_db
from app.models.model import Model
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["AI Classification"])


@router.post("/classify/{model_id}")
def classify_model_by_id(model_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger AI classification for an existing model.
    """
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Prepare model data for classification
    model_data = {
        "age": model.age or 0,
        "height_cm": model.height_cm or 0,
        "measurements": {},  # TODO: Add measurements to model if needed
        "photos": [],  # TODO: Add photos to model if needed
        "motivation": "",  # TODO: Add motivation to model if needed
    }
    
    # Classify
    result = ai_service.classify_model(model_data)
    
    # Update model with classification results
    model.ai_score = result["score"]
    model.ai_category = result["category"]
    model.ai_analysis_date = func.now()
    model.ai_reasons = result["reasons"]
    
    # Update status based on AI category
    if model.status == "active" or model.status is None:
        model.status = result["category"]
    
    db.commit()
    db.refresh(model)
    
    return {
        "message": "Model classified successfully",
        "model_id": model.id,
        "category": result["category"],
        "reasons": result["reasons"],
        # Note: score is not returned to frontend
    }


@router.post("/classify")
def classify_from_data(model_data: dict, db: Session = Depends(get_db)):
    """
    Classify a model from provided data (used during apply flow).
    Returns classification result without saving to database.
    """
    result = ai_service.classify_model(model_data)
    
    return {
        "category": result["category"],
        "reasons": result["reasons"],
        # Note: score is not returned to frontend
    }

