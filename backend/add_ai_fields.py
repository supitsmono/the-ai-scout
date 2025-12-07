#!/usr/bin/env python3
"""Add AI classification fields to existing models table."""
from app.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Check if columns exist
        result = conn.execute(text("PRAGMA table_info(models)"))
        columns = [row[1] for row in result]
        
        if 'ai_score' not in columns:
            conn.execute(text("ALTER TABLE models ADD COLUMN ai_score REAL"))
            print("✅ Added ai_score column")
        else:
            print("✅ ai_score column already exists")
        
        if 'ai_category' not in columns:
            conn.execute(text("ALTER TABLE models ADD COLUMN ai_category TEXT"))
            print("✅ Added ai_category column")
        else:
            print("✅ ai_category column already exists")
        
        if 'ai_analysis_date' not in columns:
            conn.execute(text("ALTER TABLE models ADD COLUMN ai_analysis_date DATETIME"))
            print("✅ Added ai_analysis_date column")
        else:
            print("✅ ai_analysis_date column already exists")
        
        if 'ai_reasons' not in columns:
            conn.execute(text("ALTER TABLE models ADD COLUMN ai_reasons TEXT"))
            print("✅ Added ai_reasons column")
        else:
            print("✅ ai_reasons column already exists")
        
        conn.commit()
        print("\n✅ All AI fields added successfully!")
        
except Exception as e:
    print(f"❌ Error: {e}")

