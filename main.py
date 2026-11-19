import os
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Infrasync Root Orchestrator",
    version="1.0.0",
    description="Central coordination and service orchestration for Infrasync"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root_info():
    backend_url = os.environ.get("BACKEND_URL")
    return {
        "service": "app",
        "description": "Infrasync Multi-Service Root Orchestrator",
        "status": "Operational",
        "backend_binding": "connected" if backend_url else "local_or_unbound"
    }

@app.get("/health")
async def health_check():
    backend_url = os.environ.get("BACKEND_URL")
    backend_status = "unbound"
    if backend_url:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(backend_url.rstrip("/") + "/")
                backend_status = "connected" if res.status_code == 200 else f"status_{res.status_code}"
        except Exception as e:
            backend_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "service": "app",
        "backend_binding": backend_status
    }
