from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.model import ModelResponse


class MessageBase(BaseModel):
    sender: str  # "agency" | "model"
    text: str


class MessageOut(MessageBase):
    id: int
    timestamp: datetime

    # Pydantic v2 config
    model_config = ConfigDict(from_attributes=True)


class ChatOut(BaseModel):
    id: int
    model_id: int
    last_message: Optional[str] = None
    last_timestamp: Optional[datetime] = None
    unread_count: int
    model: Optional[ModelResponse] = None  # Include full model data

    # Pydantic v2 config
    model_config = ConfigDict(from_attributes=True)
