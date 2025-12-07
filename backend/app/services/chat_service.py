from sqlalchemy.orm import Session
from app.models.chat import Chat
from app.models.message import Message


def get_chat(db: Session, chat_id: int):
    return db.query(Chat).filter(Chat.id == chat_id).first()


def list_chats(db: Session):
    return db.query(Chat).order_by(Chat.last_timestamp.desc()).all()


def list_messages(db: Session, chat_id: int):
    return db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.timestamp).all()


def send_message(db: Session, chat_id: int, sender: str, text: str):
    chat = get_chat(db, chat_id)
    if not chat:
        return None

    msg = Message(
        chat_id=chat_id,
        sender=sender,
        text=text
    )

    chat.last_message = text
    chat.unread_count += 1  # later per user onderscheiden

    db.add(msg)
    db.add(chat)
    db.commit()
    db.refresh(msg)
    db.refresh(chat)

    return msg
