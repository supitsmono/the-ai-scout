from sqlalchemy.orm import Session
from app.schemas.model import ModelCreate
from app.models.model import Model

def create_model(db: Session, data: ModelCreate):
    new_model = Model(
        name=data.name,
        age=data.age,
        height_cm=data.height_cm,
        country=data.country
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model

def get_all_models(db: Session):
    return db.query(Model).all()
