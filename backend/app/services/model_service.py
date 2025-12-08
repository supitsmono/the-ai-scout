from typing import List, Optional, Tuple, Dict
from sqlalchemy.sql import func
from sqlalchemy import or_

from sqlalchemy.orm import Session

from app.schemas.model import ModelCreate
from app.models.model import Model
from app.models.chat import Chat
from app.services.chat_service import create_chat_for_model
from app.services import ai_service


def create_model(db: Session, data: ModelCreate) -> Model:
    """
    Create a new model and automatically classify with AI.
    """
    # If manual category override provided, use it
    if data.ai_category:
        initial_status = data.ai_category
        ai_category = data.ai_category
        ai_score = None
        ai_reasons = None
    else:
        # Prepare data for AI classification
        model_data: Dict = {
            "age": data.age,
            "height_cm": data.height_cm,
            "measurements": {},  # TODO: Add if measurements are provided
            "photos": [],  # TODO: Add if photos are provided
            "motivation": "",  # TODO: Add if motivation is provided
        }
        
        # Classify with AI
        ai_result = ai_service.classify_model(model_data)
        
        initial_status = ai_result["category"]
        ai_category = ai_result["category"]
        ai_score = ai_result["score"]
        ai_reasons = ai_result["reasons"]
    
    # Set initial pipeline stage based on AI category or default to "applied"
    initial_pipeline_stage = ai_category if ai_category in ["perfectFit", "goodFit", "lowPotential"] else "applied"
    
    new_model = Model(
        name=data.name,
        age=data.age,
        height_cm=data.height_cm,
        country=data.country,
        status=initial_status,  # Set status based on AI category
        ai_category=ai_category,
        ai_score=ai_score,
        ai_reasons=ai_reasons,
        ai_analysis_date=func.now() if ai_category else None,
        pipeline_stage=initial_pipeline_stage,
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model


def get_all_models(
    db: Session,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    search: Optional[str] = None,
    ai_category: Optional[str] = None,
    status: Optional[str] = None,
    country: Optional[str] = None,
    age_min: Optional[int] = None,
    age_max: Optional[int] = None,
    height_min: Optional[int] = None,
    height_max: Optional[int] = None,
    exclude_contacted: bool = True,
    sort_by: Optional[str] = "id",
    sort_order: Optional[str] = "desc"
) -> Tuple[List[Model], int]:
    """
    Get models with pagination, filtering, and sorting.
    By default, excludes contacted models (they should be in Chats).
    Returns (models, total_count).
    """
    query = db.query(Model)
    
    # Exclude contacted models by default (unless explicitly filtering for them)
    if exclude_contacted and status != "contacted" and ai_category != "contacted":
        query = query.filter(Model.status != "contacted")
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Model.name.ilike(search_term)) |
            (Model.country.ilike(search_term))
        )
    
    if ai_category:
        # Filter by ai_category OR status (for backward compatibility)
        # Use OR condition to match either field
        query = query.filter(
            or_(
                Model.ai_category == ai_category,
                Model.status == ai_category
            )
        )
    
    # Only apply status filter if it's different from ai_category (to avoid double filtering)
    if status and status != ai_category:
        query = query.filter(Model.status == status)
    
    if country:
        query = query.filter(Model.country.ilike(f"%{country}%"))
    
    # Age range filtering
    if age_min is not None:
        query = query.filter(Model.age >= age_min)
    if age_max is not None:
        query = query.filter(Model.age <= age_max)
    
    # Height range filtering
    if height_min is not None:
        query = query.filter(Model.height_cm >= height_min)
    if height_max is not None:
        query = query.filter(Model.height_cm <= height_max)
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply sorting
    sort_column = getattr(Model, sort_by, Model.id)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # Apply pagination
    if offset is not None:
        query = query.offset(offset)
    if limit is not None:
        query = query.limit(limit)
    
    models = query.all()
    return models, total_count


def get_model(db: Session, model_id: int) -> Optional[Model]:
    return db.query(Model).filter(Model.id == model_id).first()


def contact_model(
    db: Session,
    model_id: int,
    agency_id: Optional[int] = None,
) -> Tuple[Model, Chat]:
    """
    Zet een model op 'contacted' en maakt een chat aan.
    """
    model = get_model(db, model_id=model_id)
    if not model:
        raise ValueError("Model not found")

    # status updaten
    model.status = "contacted"
    db.add(model)

    # chat aanmaken (commit gebeurt in create_chat_for_model)
    chat = create_chat_for_model(db, model_id=model.id, agency_id=agency_id)

    # model opnieuw refreshen zodat status zeker up-to-date is
    db.refresh(model)

    return model, chat
