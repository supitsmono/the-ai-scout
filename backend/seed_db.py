"""
Seed script to populate database with dummy models for development.
Run this script to add test data to your database.
"""
from app.database import SessionLocal
from app.models.model import Model

def seed_database(force=False):
    db = SessionLocal()
    
    try:
        # Check if models already exist
        existing_count = db.query(Model).count()
        if existing_count > 0 and not force:
            print(f"Database already has {existing_count} models. Skipping seed.")
            print("Use force=True to re-seed anyway.")
            return
        
        if force and existing_count > 0:
            print(f"⚠️  Force mode: Re-seeding database (existing {existing_count} models will remain)")
        
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
            Model(
                name="Isabella Martinez",
                age=23,
                height_cm=175,
                country="Spain",
                status="perfectFit",
                ai_category="perfectFit"
            ),
            Model(
                name="Olivia Chen",
                age=18,
                height_cm=172,
                country="Singapore",
                status="goodFit",
                ai_category="goodFit"
            ),
        ]
        
        for model in dummy_models:
            db.add(model)
        
        db.commit()
        print(f"✅ Successfully seeded {len(dummy_models)} models to database!")
        print("\nModels added:")
        for model in dummy_models:
            print(f"  - {model.name} (ID: {model.id}, Status: {model.status}, AI Category: {model.ai_category})")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv or "-f" in sys.argv
    print("🌱 Seeding database with dummy models...")
    if force:
        print("⚠️  Force mode enabled - adding models even if database is not empty")
    seed_database(force=force)
