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
        
        # Create 30 dummy models with variety
        import random
        
        first_names = [
            "Sophia", "Emma", "Mila", "Ava", "Isabella", "Olivia", "Charlotte", "Amelia",
            "Harper", "Evelyn", "Abigail", "Emily", "Ella", "Elizabeth", "Camila", "Luna",
            "Sofia", "Avery", "Mia", "Aria", "Scarlett", "Victoria", "Madison", "Luna",
            "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey"
        ]
        
        last_names = [
            "Berg", "Li", "Rossi", "Johnson", "Martinez", "Chen", "Williams", "Brown",
            "Garcia", "Miller", "Davis", "Rodriguez", "Wilson", "Moore", "Taylor", "Anderson",
            "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez",
            "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker"
        ]
        
        countries = [
            "Netherlands", "China", "Italy", "USA", "Spain", "Singapore", "France", "Germany",
            "UK", "Canada", "Australia", "Brazil", "Japan", "South Korea", "Sweden", "Norway",
            "Denmark", "Belgium", "Switzerland", "Austria", "Poland", "Portugal", "Greece", "Turkey",
            "Mexico", "Argentina", "Chile", "India", "Thailand", "Philippines"
        ]
        
        categories = ["perfectFit", "goodFit", "lowPotential"]
        category_weights = [0.3, 0.4, 0.3]  # 30% perfect, 40% good, 30% low
        
        dummy_models = []
        for i in range(30):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            # Avoid duplicates by checking if name already exists
            full_name = f"{first_name} {last_name}"
            while any(m.name == full_name for m in dummy_models):
                last_name = random.choice(last_names)
                full_name = f"{first_name} {last_name}"
            
            age = random.randint(18, 28)
            height = random.randint(165, 185)
            country = random.choice(countries)
            category = random.choices(categories, weights=category_weights)[0]
            
            dummy_models.append(
                Model(
                    name=full_name,
                    age=age,
                    height_cm=height,
                    country=country,
                    status=category,
                    ai_category=category
                )
            )
        
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
