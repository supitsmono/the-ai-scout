#!/usr/bin/env python3
"""Add is_archived column to chats table if it doesn't exist."""
from app.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("PRAGMA table_info(chats)"))
        columns = [row[1] for row in result]
        
        if 'is_archived' not in columns:
            conn.execute(text("ALTER TABLE chats ADD COLUMN is_archived BOOLEAN DEFAULT 0"))
            conn.commit()
            print("✅ Added is_archived column to chats table")
        else:
            print("✅ is_archived column already exists")
except Exception as e:
    print(f"❌ Error: {e}")

