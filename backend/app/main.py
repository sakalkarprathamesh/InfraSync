from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import (
    auth, departments, dashboard, requests,
    conflicts, coordination, map as map_router,
    history, restoration, discussions,
    notifications, analytics, resources
)

# Initialize database schema & seed demonstration data
_db_initialized = False

def ensure_seeded():
    global _db_initialized
    if not _db_initialized:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
        _db_initialized = True

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed initial demonstration data
    ensure_seeded()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Centralized decision-support & coordination platform for urban road excavation management in Pune, Maharashtra.",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(departments.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(requests.router, prefix=settings.API_V1_STR)
app.include_router(conflicts.router, prefix=settings.API_V1_STR)
app.include_router(coordination.router, prefix=settings.API_V1_STR)
app.include_router(map_router.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(restoration.router, prefix=settings.API_V1_STR)
app.include_router(discussions.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "institution": "MIT School of Computing, CSE",
        "status": "Operational",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Infrasync API Gateway"}
