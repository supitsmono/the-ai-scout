from typing import Optional, List
from datetime import datetime

from pydantic import BaseModel


class ModelCreate(BaseModel):
    name: str
    age: int
    height_cm: int
    country: str
    ai_category: Optional[str] = None  # Optional manual override


class ModelResponse(BaseModel):
    id: int
    name: str
    age: int
    height_cm: int
    country: str
    status: str
    ai_category: Optional[str] = None  # "perfectFit", "goodFit", "lowPotential"
    ai_reasons: Optional[List[str]] = None  # Reasons for classification
    # Note: ai_score is NOT included - internal use only

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2


class ModelContactResponse(BaseModel):
    model: ModelResponse
    chat_id: int


class PaginatedModelsResponse(BaseModel):
    models: List[ModelResponse]
    total: int
    page: int
    limit: int
    offset: int
