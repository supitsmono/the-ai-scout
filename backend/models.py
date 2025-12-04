from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import secrets

db = SQLAlchemy()

VALID_STAGES = ["incoming", "shortlisted", "contacted", "scouted", "archived"]


class Agency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    apply_slug = db.Column(
        db.String(64),
        unique=True,
        nullable=False,
        default=lambda: secrets.token_urlsafe(8)
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Model(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    agency_id = db.Column(db.Integer, db.ForeignKey("agency.id"), nullable=False)

    # PERSONAL INFORMATION
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255))
    age = db.Column(db.Integer)
    city = db.Column(db.String(120))

    instagram = db.Column(db.String(255))
    tiktok = db.Column(db.String(255))

    # MEASUREMENTS
    height_cm = db.Column(db.Integer)
    chest_cm = db.Column(db.Integer)
    waist_cm = db.Column(db.Integer)
    hips_cm = db.Column(db.Integer)

    # PORTFOLIO IMAGES
    photo_1 = db.Column(db.String(500))
    photo_2 = db.Column(db.String(500))
    photo_3 = db.Column(db.String(500))
    photo_4 = db.Column(db.String(500))

    # NOTES
    notes = db.Column(db.Text)

    # AI
    ai_score = db.Column(db.Integer)
    ai_category = db.Column(db.String(20))

    # PIPELINE STAGE
    stage = db.Column(db.String(50), default="incoming")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "agency_id": self.agency_id,

            "name": self.name,
            "email": self.email,
            "age": self.age,
            "city": self.city,

            "instagram": self.instagram,
            "tiktok": self.tiktok,

            "height_cm": self.height_cm,
            "chest_cm": self.chest_cm,
            "waist_cm": self.waist_cm,
            "hips_cm": self.hips_cm,

            "photo_1": self.photo_1,
            "photo_2": self.photo_2,
            "photo_3": self.photo_3,
            "photo_4": self.photo_4,

            "notes": self.notes,

            "ai_score": self.ai_score,
            "ai_category": self.ai_category,

            "stage": self.stage,
            "created_at": self.created_at.isoformat(),
        }
