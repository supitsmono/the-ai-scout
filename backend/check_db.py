"""
Quick script to check database contents
"""
from app.database import SessionLocal
from app.models.model import Model

db = SessionLocal()

try:
    count = db.query(Model).count()
    print(f"📊 Total models in database: {count}")
    
    if count > 0:
        print("\nModels:")
        models = db.query(Model).all()
        for m in models:
            print(f"  - ID {m.id}: {m.name} ({m.country}) - Status: {m.status}, AI: {m.ai_category}")
    else:
        print("\n⚠️  No models found! Run: python seed_db.py")
finally:
    db.close()

