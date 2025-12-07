from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.model import Model
from app.models.chat import Chat

router = APIRouter()


# ============================================
# UPDATE STATUS DIRECT
# ============================================
@router.patch("/models/{model_id}/status")
def update_status(model_id: int, status: str, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    model.status = status
    db.commit()

    return {
        "message": "Status updated",
        "model_id": model.id,
        "new_status": model.status
    }


# ============================================
# FAVORITE TOGGLE
# ============================================
@router.patch("/models/{model_id}/favorite")
def toggle_favorite(model_id: int, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    if model.status == "favorite":
        model.status = "active"
    else:
        model.status = "favorite"

    db.commit()

    return {
        "message": "Favorite toggled",
        "model_id": model.id,
        "new_status": model.status
    }


# ============================================
# REJECT MODEL
# ============================================
@router.patch("/models/{model_id}/reject")
def reject_model(model_id: int, db: Session = Depends(get_db)):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    model.status = "rejected"
    db.commit()

    return {
        "message": "Model rejected",
        "model_id": model.id,
        "new_status": "rejected"
    }


# ============================================
# CONTACT MODEL FLOW (Phase 2 MAIN FEATURE)
# ============================================
@router.post("/models/{model_id}/contact")
def contact_model(model_id: int, db: Session = Depends(get_db)):
    """
    Wanneer een agency op 'Contact Model' klikt:

    ✔ 1. Model status → contacted
    ✔ 2. Chat wordt aangemaakt
    ✔ 3. Model gaat naar Contacted tab
    ✔ 4. Chat ID wordt teruggegeven
    """

    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=404, 
            detail=f"Model with ID {model_id} not found in database. Please refresh the page or check if the model exists."
        )

    # Only contact if not already contacted
    if model.status == "contacted":
        # Check if chat already exists
        existing_chat = db.query(Chat).filter(Chat.model_id == model_id).first()
        if existing_chat:
            return {
                "message": "Model already contacted",
                "model_id": model.id,
                "chat_id": existing_chat.id,
                "status": model.status
            }
        raise HTTPException(status_code=400, detail="Model already contacted")

    # STEP 1 — Update model status
    model.status = "contacted"
    db.add(model)

    # STEP 2 — Create chat entry
    chat = Chat(
        model_id=model_id,
        agency_id=None,     # later koppelen aan echte agency
        is_open=True
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)
    db.refresh(model)

    return {
        "message": "Model contacted successfully",
        "model_id": model.id,
        "chat_id": chat.id,
        "status": model.status
    }


# ============================================
# GET ALL CONTACTED MODELS (For Contacted Tab)
# ============================================
@router.get("/models/contacted")
def get_contacted_models(db: Session = Depends(get_db)):
    contacted = db.query(Model).filter(Model.status == "contacted").all()
    return contacted
