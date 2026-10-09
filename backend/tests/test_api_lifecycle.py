import datetime
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.seed_data import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    db = SessionLocal()
    seed_database(db)
    db.close()

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_and_auth_flow():
    # Login as admin
    res = client.post("/api/auth/login", json={
        "email": "admin@infrasync.gov.in",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

    token = data["access_token"]
    # Check /me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "admin@infrasync.gov.in"

def test_dashboard_summary():
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_requests"] >= 10
    assert data["active_conflicts"] >= 1
    assert data["coordination_opportunities"] >= 1
    assert len(data["department_breakdown"]) >= 5
    assert len(data["recent_requests"]) > 0

def test_requests_listing():
    res = client.get("/api/requests")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 10
    # Verify Request A and Request B exist
    req_codes = [i["request_code"] for i in items]
    assert "REQ-2026-001" in req_codes
    assert "REQ-2026-002" in req_codes

def test_conflicts_listing():
    res = client.get("/api/conflicts?status=Active")
    assert res.status_code == 200
    conflicts = res.json()
    assert len(conflicts) > 0
    # There should be at least one Direct Spatial & Temporal Overlap conflict
    categories = [c["conflict_category"] for c in conflicts]
    assert any("Direct Spatial" in cat or "Potential Coordination" in cat for cat in categories)

def test_coordination_proposals():
    res = client.get("/api/coordination-proposals")
    assert res.status_code == 200
    proposals = res.json()
    assert len(proposals) >= 1
    p = proposals[0]
    assert "PROP-2026-001" in p["proposal_code"]
    assert p["feasibility_score"] > 50

def test_map_geojson_endpoint():
    res = client.get("/api/map/projects")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 10
    # Check valid coordinate bounds for Pune (lat ~18.5, lon ~73.8)
    for feat in data["features"]:
        coords = feat["geometry"]["coordinates"]
        lon, lat = coords[0], coords[1]
        assert 73.0 < lon < 74.5
        assert 18.0 < lat < 19.5

def test_restoration_records():
    res = client.get("/api/restoration/records")
    assert res.status_code == 200
    records = res.json()
    assert len(records) >= 2
    # Verify at least one pending inspection and one verified
    statuses = [r["verification_status"] for r in records]
    assert "Pending Inspection" in statuses
    assert "Verified Satisfactory" in statuses
