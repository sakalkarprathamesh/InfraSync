import datetime
import pytest
from app.models import ExcavationRequest, Department, Road
from app.scheduling_engine import evaluate_coordination_feasibility

def test_scheduling_feasibility_evaluation():
    d1 = Department(id=1, name="Water Supply", code="WATER")
    d2 = Department(id=2, name="Electricity", code="ELECTRICITY")
    r1 = Road(id=1, name="Central Avenue", road_code="CA-01", locality="Shivaji Nagar", ward="W1", length_km=2.0, surface_type="Asphalt", importance_tier="Tier 1", latitude=18.5246, longitude=73.8415)

    req_a = ExcavationRequest(
        id=1,
        request_code="REQ-001",
        title="Water Pipeline",
        department_id=1,
        road_id=1,
        work_type="Water Pipeline",
        proposed_start_date=datetime.date(2026, 10, 15),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 18),
        priority="High",
        department=d1,
        road=r1,
        estimated_cost=65000.0,
        excavation_depth_meters=2.2
    )

    req_b = ExcavationRequest(
        id=2,
        request_code="REQ-002",
        title="Power Cable",
        department_id=2,
        road_id=1,
        work_type="Cable Installation",
        proposed_start_date=datetime.date(2026, 10, 17),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 20),
        priority="Medium",
        department=d2,
        road=r1,
        estimated_cost=55000.0,
        excavation_depth_meters=1.2
    )

    result = evaluate_coordination_feasibility(req_a, req_b)

    assert result["feasibility_score"] >= 80.0
    assert result["recommended_start_date"] == datetime.date(2026, 10, 15)
    assert result["combined_duration_days"] >= 3
    assert result["estimated_savings_inr"] > 30000.0
    assert "Consolidate" in result["shared_excavation_window_desc"]
