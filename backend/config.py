import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Central application configuration loaded from environment variables."""

    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///enzymepredict.db")
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        # Render provides postgres:// prefixed URLs, but SQLAlchemy 1.4+ requires postgresql://
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"
    # In production, CORS_ORIGINS should be a single URL or comma-separated list
    raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    CORS_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
