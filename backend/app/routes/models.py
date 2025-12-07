from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.model import (
    ModelCreate,
    ModelResponse,
    ModelContactResponse,
)
from app.services import model_service

router = APIRouter(tags=["models"])


@router.get("/", response_model=List[ModelResponse])
def list_models(db: Session = Depends(get_db)):
    models = model_service.get_all_models(db)
    return models


@router.post("/", response_model=ModelResponse)
def create_model(
    payload: ModelCreate,
    db: Session = Depends(get_db),
):
    return model_service.create_model(db, payload)

# Note: Contact endpoint is in status.py to avoid route conflicts
