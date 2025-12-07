from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.chat import ChatOut, MessageOut
from app.services.chat_service import (
    list_chats,
    get_chat,
    list_messages,
    send_message
)

router = APIRouter()


# GET ALL CHATS (Inbox)
@router.get("/", response_model=list[ChatOut])
def get_chats(db: Session = Depends(get_db)):
    return list_chats(db)


# GET ONE CHAT
@router.get("/{chat_id}", response_model=ChatOut)
def get_chat_route(chat_id: int, db: Session = Depends(get_db)):
    chat = get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


# GET MESSAGES OF CHAT
@router.get("/{chat_id}/messages", response_model=list[MessageOut])
def get_chat_messages(chat_id: int, db: Session = Depends(get_db)):
    messages = list_messages(db, chat_id)
    return messages


# SEND MESSAGE
@router.post("/{chat_id}/send-message", response_model=MessageOut)
def send_message_route(
    chat_id: int,
    sender: str,
    text: str,
    db: Session = Depends(get_db)
):
    msg = send_message(db, chat_id, sender, text)
    if not msg:
        raise HTTPException(status_code=404, detail="Chat not found")
    return msg
