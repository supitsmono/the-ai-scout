from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from app.schemas.model import ModelCreate
from app.models.model import Model
from app.models.chat import Chat
from app.services.chat_service import create_chat_for_model


def create_model(db: Session, data: ModelCreate) -> Model:
    new_model = Model(
        name=data.name,
        age=data.age,
        height_cm=data.height_cm,
        country=data.country,
        # status laat je default ("active") pakken vanuit het model
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model


def get_all_models(db: Session) -> List[Model]:
    return db.query(Model).all()


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
