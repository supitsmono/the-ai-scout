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
def get_chats(
    include_archived: bool = False,
    db: Session = Depends(get_db)
):
    """Get all chats, optionally including archived ones"""
    return list_chats(db, include_archived=include_archived)


# GET CHAT BY MODEL ID
@router.get("/by-model/{model_id}", response_model=ChatOut)
def get_chat_by_model_id(model_id: int, db: Session = Depends(get_db)):
    """Get chat for a specific model"""
    from app.models.chat import Chat
    chat = db.query(Chat).filter(Chat.model_id == model_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found for this model")
    # Load model data
    from app.models.model import Model
    chat.model = db.query(Model).filter(Model.id == model_id).first()
    return chat


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


# MARK CHAT AS READ (reset unread count)
@router.post("/{chat_id}/mark-read")
def mark_chat_as_read(chat_id: int, db: Session = Depends(get_db)):
    """Mark all messages in a chat as read (reset unread_count to 0)"""
    from app.models.chat import Chat
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat.unread_count = 0
    db.add(chat)
    db.commit()
    
    return {"message": "Chat marked as read", "chat_id": chat_id}


# ARCHIVE CHAT
@router.post("/{chat_id}/archive")
def archive_chat(chat_id: int, db: Session = Depends(get_db)):
    """Archive a chat (doesn't delete, just hides it)"""
    from app.models.chat import Chat
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat.is_archived = True
    db.add(chat)
    db.commit()
    
    return {"message": "Chat archived", "chat_id": chat_id}


# UNARCHIVE CHAT
@router.post("/{chat_id}/unarchive")
def unarchive_chat(chat_id: int, db: Session = Depends(get_db)):
    """Unarchive a chat"""
    from app.models.chat import Chat
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat.is_archived = False
    db.add(chat)
    db.commit()
    
    return {"message": "Chat unarchived", "chat_id": chat_id}


# DELETE CHAT (and model)
@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    """
    Delete a chat and the associated model permanently.
    WARNING: This will delete the model from the system!
    """
    from app.models.chat import Chat
    from app.models.model import Model
    from app.models.message import Message
    
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    model_id = chat.model_id
    
    # Delete all messages in the chat
    db.query(Message).filter(Message.chat_id == chat_id).delete()
    
    # Delete the chat
    db.delete(chat)
    
    # Delete the model
    model = db.query(Model).filter(Model.id == model_id).first()
    if model:
        db.delete(model)
    
    db.commit()
    
    return {
        "message": "Chat and model deleted permanently",
        "chat_id": chat_id,
        "model_id": model_id
    }
