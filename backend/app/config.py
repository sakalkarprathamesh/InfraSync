import os

class Settings:
    PROJECT_NAME: str = "Infrasync — AI-Powered Urban Road Excavation Coordination System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "infrasync-secret-key-pbl-mit-sy904-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:////tmp/infrasync.db" if os.getenv("VERCEL") else "sqlite:///./infrasync.db"
    )
    
    # Conflict Detection Parameters
    PROXIMITY_DISTANCE_METERS: float = 150.0  # Within 150m is treated as spatial proximity
    SEQUENTIAL_WINDOW_DAYS: int = 14  # Within 14 days on same road is treated as sequential excavation
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

settings = Settings()
