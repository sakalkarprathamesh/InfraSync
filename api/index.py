import os
import sys

# Read internal Vercel service mesh binding if present
backend_url = os.environ.get("BACKEND_URL")

if backend_url:
    # Vercel Multi-Service Mode: Proxy requests across internal service binding to 'backend'
    import httpx
    from fastapi import FastAPI, Request, Response

    app = FastAPI(
        title="Infrasync API Gateway Service",
        description="Public API Gateway service routing to internal backend service"
    )

    client = httpx.AsyncClient(base_url=backend_url.rstrip("/"), timeout=60.0)

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
    async def proxy_to_backend(request: Request, path: str = ""):
        # Normalize target path to preserve /api prefix for backend routers
        cleaned_path = path.lstrip("/")
        if not cleaned_path:
            target_path = "/api"
        elif cleaned_path.startswith("api/"):
            target_path = f"/{cleaned_path}"
        else:
            target_path = f"/api/{cleaned_path}"

        url = httpx.URL(path=target_path, query=request.url.query.encode("utf-8"))
        headers = dict(request.headers)
        headers.pop("host", None)
        content = await request.body()
        req = client.build_request(
            request.method,
            url,
            headers=headers,
            content=content,
        )
        res = await client.send(req, stream=True)
        return Response(
            content=await res.aread(),
            status_code=res.status_code,
            headers=dict(res.headers),
        )
else:
    # Standalone / Local Monorepo Mode: Direct in-process execution
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if ROOT_DIR not in sys.path:
        sys.path.insert(0, ROOT_DIR)

    from backend.app.main import app, ensure_seeded
    ensure_seeded()
