"""
Seed script to populate database with dummy models for development.
Run this script to add test data to your database.
"""
from app.database import SessionLocal
from app.models.model import Model

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if models already exist
        existing_count = db.query(Model).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} models. Skipping seed.")
            return
        
        # Create dummy models matching the frontend dummy data
        dummy_models = [
            Model(
                name="Sophia Berg",
                age=21,
                height_cm=176,
                country="Netherlands",
                status="perfectFit",
                ai_category="perfectFit"
            ),
            Model(
                name="Emma Li",
                age=19,
                height_cm=170,
                country="China",
                status="goodFit",
                ai_category="goodFit"
            ),
            Model(
                name="Mila Rossi",
                age=22,
                height_cm=173,
                country="Italy",
                status="lowPotential",
                ai_category="lowPotential"
            ),
            Model(
                name="Ava Johnson",
                age=20,
                height_cm=174,
                country="USA",
                status="active",
                ai_category=None
            ),
        ]
        
        for model in dummy_models:
            db.add(model)
        
        db.commit()
        print(f"✅ Successfully seeded {len(dummy_models)} models to database!")
        print("\nModels added:")
        for model in dummy_models:
            print(f"  - {model.name} (ID: {model.id}, Status: {model.status})")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding database with dummy models...")
    seed_database()

