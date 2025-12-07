from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


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

    # Pydantic v2 config
    model_config = ConfigDict(from_attributes=True)
