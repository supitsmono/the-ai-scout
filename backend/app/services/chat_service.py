from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.models.message import Message
from app.models.model import Model


def get_chat(db: Session, chat_id: int) -> Optional[Chat]:
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        # Load model data
        chat.model = db.query(Model).filter(Model.id == chat.model_id).first()
    return chat


def list_chats(db: Session) -> List[Chat]:
    chats = db.query(Chat).order_by(Chat.last_timestamp.desc()).all()
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
    chat.unread_count += 1  # later differentiëren per user

    db.add(msg)
    db.add(chat)
    db.commit()
    db.refresh(msg)
    db.refresh(chat)

    return msg
