from sqlalchemy import Column, Integer, String
from app.database import Base

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    height_cm = Column(Integer)
    country = Column(String)

    status = Column(String, default="active")  # NEW
