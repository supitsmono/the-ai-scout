from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.models.chat import Chat
from app.models.message import Message
from app.models.model import Model


def get_chat(db: Session, chat_id: int) -> Optional[Chat]:
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        # Load model data
        chat.model = db.query(Model).filter(Model.id == chat.model_id).first()
    return chat


def list_chats(db: Session, include_archived: bool = False) -> List[Chat]:
    query = db.query(Chat)
    if not include_archived:
        query = query.filter(Chat.is_archived == False)
    chats = query.order_by(Chat.last_timestamp.desc()).all()
    # Load model data for each chat
    for chat in chats:
        chat.model = db.query(Model).filter(Model.id == chat.model_id).first()
    return chats


def list_messages(db: Session, chat_id: int) -> List[Message]:
    return (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.timestamp)
        .all()
    )


def create_chat_for_model(
    db: Session,
    model_id: int,
    agency_id: Optional[int] = None,
) -> Chat:
    """
    Maakt een nieuwe chat aan voor een model (en later agency).
    """
    chat = Chat(
        model_id=model_id,
        agency_id=agency_id,
        is_open=True,
    )
    db.add(chat)
    # commit commit alles wat al in deze Session zit
    db.commit()
    db.refresh(chat)
    return chat


def send_message(
    db: Session,
    chat_id: int,
    sender: str,
    text: str,
) -> Message:
    """
    Stuurt een bericht in een bestaande chat en update de chat-meta.
    Unread count wordt alleen verhoogd voor berichten van het model (niet agency).
    """
    chat = get_chat(db, chat_id)
    if not chat:
        raise ValueError("Chat not found")

    msg = Message(
        chat_id=chat_id,
        sender=sender,
        text=text,
    )

    chat.last_message = text
    chat.last_timestamp = func.now()
    
    # Alleen unread count verhogen als het model een bericht stuurt (niet agency)
    if sender == "model":
        chat.unread_count += 1
    # Als agency stuurt, blijft unread_count hetzelfde (agency heeft al gelezen)

    db.add(msg)
    db.add(chat)
    db.commit()
    db.refresh(msg)
    db.refresh(chat)

    return msg
