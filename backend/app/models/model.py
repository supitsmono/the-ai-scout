from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    height_cm = Column(Integer)
    country = Column(String)

    status = Column(String, default="active")  # NEW
    
    # AI Classification fields
    ai_score = Column(Float, nullable=True)  # 0.0 to 1.0, internal use only
    ai_category = Column(String, nullable=True)  # "perfectFit", "goodFit", "lowPotential"
    ai_analysis_date = Column(DateTime(timezone=True), nullable=True)
    ai_reasons = Column(JSON, nullable=True)  # Array of reason strings
    
    # Pipeline stage
    pipeline_stage = Column(String, nullable=True)  # "applied", "reviewing", "perfectFit", "goodFit", "contacted", "interview", "selected", "rejected"
