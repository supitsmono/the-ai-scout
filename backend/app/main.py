from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all routes
from app.routes import models, status, chats

app = FastAPI(
    title="The AI Scout Backend",
    version="2.0.0",
)

# ============================
# CORS — Frontend toegang
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# ROUTES REGISTEREN
# ============================

# Models (CRUD + filtering)
app.include_router(models.router, prefix="/models", tags=["Models"])

# Status updates + Contact flow
app.include_router(status.router, tags=["Status & Contact"])

# Chats (Inbox, messages, send-message)
app.include_router(chats.router, prefix="/chats", tags=["Chats"])

# ============================
# ROOT ENDPOINT
# ============================
@app.get("/")
def root():
    return {"message": "FastAPI backend running!", "phase": "2"}
