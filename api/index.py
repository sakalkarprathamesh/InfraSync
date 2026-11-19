import os
import sys
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(
    title="Infrasync API Gateway Service",
    version="1.0.0",
    description="Public API Gateway service routing to internal backend service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistent async HTTP client for proxying to internal backend service
_client: httpx.AsyncClient = None

def get_proxy_client(base_url: str) -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(base_url=base_url.rstrip("/"), timeout=60.0)
    return _client

# Optional in-process fallback for local monorepo execution
_in_process_app = None
try:
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if ROOT_DIR not in sys.path:
        sys.path.insert(0, ROOT_DIR)
    from backend.app.main import app as _backend_app, ensure_seeded
    ensure_seeded()
    _in_process_app = _backend_app
except Exception:
    pass

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def route_api_request(request: Request, path: str = ""):
    backend_url = os.environ.get("BACKEND_URL")

    # Mode 1: Proxy over Vercel internal service mesh to 'backend' service
    if backend_url:
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

        client = get_proxy_client(backend_url)
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

    # Mode 2: In-process fallback when running in a combined monorepo environment
    if _in_process_app:
        cleaned_path = path.lstrip("/")
        scope = dict(request.scope)
        if not cleaned_path:
            scope["path"] = "/api"
        elif not cleaned_path.startswith("api/"):
            scope["path"] = f"/api/{cleaned_path}"
        else:
            scope["path"] = f"/{cleaned_path}"

        response_body = []
        response_status = 200
        response_headers = []

        async def send(message):
            nonlocal response_status, response_headers, response_body
            if message["type"] == "http.response.start":
                response_status = message["status"]
                response_headers = message.get("headers", [])
            elif message["type"] == "http.response.body":
                response_body.append(message.get("body", b""))

        await _in_process_app(scope, request.receive, send)
        return Response(
            content=b"".join(response_body),
            status_code=response_status,
            headers={k.decode("latin1"): v.decode("latin1") for k, v in response_headers}
        )

    # Mode 3: Standalone operational ping
    return {
        "service": "api",
        "status": "online",
        "path": path,
        "backend_binding": "unbound"
    }
