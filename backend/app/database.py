from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Get database URL from settings
DATABASE_URL = settings.get_database_url()

# Engine configuration
if "sqlite" in DATABASE_URL.lower():
    # SQLite configuration (development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL configuration (production)
    # Connection pooling for better performance
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=3600,  # Recycle connections after 1 hour
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency voor routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
