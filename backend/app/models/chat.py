from sqlalchemy import Column, Integer, Boolean, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("models.id"))
    agency_id = Column(Integer, nullable=True)  # later koppelen
    is_open = Column(Boolean, default=True)

    # NEW
    last_message = Column(String, nullable=True)
    last_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    unread_count = Column(Integer, default=0)
