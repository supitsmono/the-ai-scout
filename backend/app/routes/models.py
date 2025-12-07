from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.model import (
    ModelCreate,
    ModelResponse,
    ModelContactResponse,
    PaginatedModelsResponse,
)
from app.services import model_service

router = APIRouter(tags=["models"])


@router.get("/", response_model=PaginatedModelsResponse)
def list_models(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name or country"),
    ai_category: Optional[str] = Query(None, description="Filter by AI category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    country: Optional[str] = Query(None, description="Filter by country"),
    exclude_contacted: bool = Query(True, description="Exclude contacted models (default: True)"),
    sort_by: str = Query("id", description="Sort field (id, name, country, age)"),
    sort_order: str = Query("desc", description="Sort order (asc, desc)"),
    db: Session = Depends(get_db),
):
    """
    Get paginated list of models with filtering and sorting.
    By default, excludes contacted models (they should be accessed via Chats endpoint).
    """
    offset = (page - 1) * limit
    models, total = model_service.get_all_models(
        db=db,
        limit=limit,
        offset=offset,
        search=search,
        ai_category=ai_category,
        status=status,
        country=country,
        exclude_contacted=exclude_contacted,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    
    return PaginatedModelsResponse(
        models=models,
        total=total,
        page=page,
        limit=limit,
        offset=offset,
    )


@router.post("/", response_model=ModelResponse)
def create_model(
    payload: ModelCreate,
    db: Session = Depends(get_db),
):
    return model_service.create_model(db, payload)


@router.get("/{model_id}", response_model=ModelResponse)
def get_model(
    model_id: int,
    db: Session = Depends(get_db),
):
    """Get a single model by ID"""
    model = model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

# Note: Contact endpoint is in status.py to avoid route conflicts
