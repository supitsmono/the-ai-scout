from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelOut

router = APIRouter()


# ============================================
# GET ALL MODELS (LIST ALL)
# ============================================
@router.get("/", response_model=List[ModelOut])
def list_models(db: Session = Depends(get_db)):
    models = db.query(Model).all()
    return models


# ============================================
# CREATE NEW MODEL
# ============================================
@router.post("/", response_model=ModelOut)
def create_model(payload: ModelCreate, db: Session = Depends(get_db)):
    new_model = Model(
        name=payload.name,
        age=payload.age,
        height_cm=payload.height_cm,
        country=payload.country,
        status="active"
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model


# ============================================
# GET SINGLE MODEL BY ID
# ============================================
@router.get("/{model_id}", response_model=ModelOut)
def get_model(model_id: int, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model


# ============================================
# FILTER MODELS BY STATUS
# ============================================
@router.get("/status/{status}", response_model=List[ModelOut])
def get_by_status(status: str, db: Session = Depends(get_db)):
    valid_statuses = [
        "active", "strongFit", "shortlist", 
        "lowFit", "favorite", "rejected", "contacted"
    ]

    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    models = db.query(Model).filter(Model.status == status).all()
    return models


# ============================================
# GET FAVORITES
# ============================================
@router.get("/favorites/list", response_model=List[ModelOut])
def get_favorites(db: Session = Depends(get_db)):
    models = db.query(Model).filter(Model.status == "favorite").all()
    return models


# ============================================
# GET REJECTED MODELS
# ============================================
@router.get("/rejected/list", response_model=List[ModelOut])
def get_rejected(db: Session = Depends(get_db)):
    models = db.query(Model).filter(Model.status == "rejected").all()
    return models


# ============================================
# SEARCH MODELS BY NAME (SMART SEARCH)
# ============================================
@router.get("/search/", response_model=List[ModelOut])
def search_models(query: str, db: Session = Depends(get_db)):
    models = (
        db.query(Model)
        .filter(Model.name.ilike(f"%{query}%"))
        .all()
    )
    return models
