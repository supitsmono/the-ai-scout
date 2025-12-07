#!/usr/bin/env python3
"""Add pipeline_stage field to existing models table."""
from app.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("PRAGMA table_info(models)"))
        columns = [row[1] for row in result]
        
        if 'pipeline_stage' not in columns:
            conn.execute(text("ALTER TABLE models ADD COLUMN pipeline_stage TEXT"))
            conn.commit()
            print("✅ Added pipeline_stage column")
        else:
            print("✅ pipeline_stage column already exists")
        
except Exception as e:
    print(f"❌ Error: {e}")

