# AI Scout

**Full-stack scouting platform for model agencies** — applicants submit a profile, agencies review, classify and chat with them in one three-panel workspace.

![Python](https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00)
![Stripe](https://img.shields.io/badge/Stripe-subscriptions-635BFF?logo=stripe&logoColor=white)

## What it does

- **Public application flow** (`/apply`) — candidates submit measurements, photos and socials
- **Agency workspace** — three-panel layout (lists · detail · chat) with shared state via a React context
- **Automatic classification** — rule-based service that tags and scores incoming applicants
- **In-app chat** between agency and applicant
- **Pipeline stages & archiving** for moving applicants from first look to signed
- **Accounts & billing** — signup, email verification, password reset, Stripe subscriptions, admin panel
- **Abuse protection** — rate limiting, security middleware and a fraud-detection service

## Architecture

```
frontend/   Next.js 14 (App Router) + Tailwind + Radix UI
backend/    FastAPI · SQLAlchemy · Pydantic
  app/routes/       auth, models, chats, ai, stripe, admin, analytics
  app/services/     classification, chat, email, stripe, webhooks, fraud detection
  app/middleware/   rate limiting, subscription gating, admin, security headers
```

SQLite in development, PostgreSQL (Railway) in production.

## Run locally

```bash
# backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# frontend
cd frontend && npm install && npm run dev   # http://localhost:3000
```

## Status

Work in progress. Analytics view is a placeholder and the auth router is currently disabled in `main.py` while it's being stabilised.

---

Built by [Miguel](https://github.com/supitsmono) with an AI-assisted workflow: I own the product, architecture and decisions; AI coding tools write most of the code.
