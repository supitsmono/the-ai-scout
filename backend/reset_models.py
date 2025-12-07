"""
Reset models to their original status for testing.
This will reset all models back to their original status from the seed data.
Also removes all chats to start fresh.
"""
from app.database import SessionLocal
from app.models.model import Model
from app.models.chat import Chat

def reset_models():
    db = SessionLocal()
    
    try:
        # Delete all chats first
        chats_deleted = db.query(Chat).delete()
        print(f"🗑️  Deleted {chats_deleted} chats")
        
        # Reset models to their original status
        status_map = {
            1: "perfectFit",  # Sophia Berg
            2: "goodFit",     # Emma Li
            3: "lowPotential", # Mila Rossi
            4: "active",      # Ava Johnson
        }
        
        for model_id, original_status in status_map.items():
            model = db.query(Model).filter(Model.id == model_id).first()
            if model:
                model.status = original_status
                db.add(model)
                print(f"✅ Reset {model.name} (ID: {model.id}) to status: {original_status}")
        
        db.commit()
        print(f"\n✅ Successfully reset {len(status_map)} models!")
        
        # Show current status
        print("\nCurrent models:")
        models = db.query(Model).all()
        for model in models:
            print(f"  ID {model.id}: {model.name} - Status: {model.status}")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Error resetting models: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🔄 Resetting models to original status...")
    reset_models()
