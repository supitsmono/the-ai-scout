# Database Seeding

## Quick Start

To populate the database with dummy models for development:

```bash
cd backend
python seed_db.py
```

Or if using the virtual environment:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python seed_db.py
```

## What it does

- Adds 4 dummy models matching the frontend dummy data
- Only runs if database is empty (won't duplicate)
- Models: Sophia Berg, Emma Li, Mila Rossi, Ava Johnson

## After seeding

1. Start your backend: `uvicorn app.main:app --reload`
2. Start your frontend: `npm run dev`
3. The dashboard will now load real data from the backend!

