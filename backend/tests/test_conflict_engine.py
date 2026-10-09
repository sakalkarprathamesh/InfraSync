import datetime
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Department, Road, ExcavationRequest, User
from app.conflict_engine import detect_conflicts_for_request, haversine_distance_meters

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Create dummy departments
    d1 = Department(name="Water Dept", code="WATER", contact_person="P1", phone="123", email="w@test.com", color="#2563EB")
    d2 = Department(name="Power Dept", code="ELECTRICITY", contact_person="P2", phone="456", email="p@test.com", color="#D97706")
    session.add_all([d1, d2])

    # Create dummy road
    r1 = Road(name="Central Avenue", road_code="CA-01", locality="Shivaji Nagar", ward="W1", length_km=2.0, surface_type="Asphalt", importance_tier="Tier 1", latitude=18.5246, longitude=73.8415)
    r2 = Road(name="Baner Road", road_code="BR-01", locality="Baner", ward="W2", length_km=4.0, surface_type="Asphalt", importance_tier="Tier 1", latitude=18.5590, longitude=73.7868)
    session.add_all([r1, r2])

    # Create dummy user
    u = User(name="Test Admin", email="admin@test.com", hashed_password="xyz", role="admin", is_active=True)
    session.add(u)
    session.commit()

    yield session
    session.close()

def test_haversine_calculation():
    # Distance between points on Central Avenue ~100m
    d = haversine_distance_meters(18.5246, 73.8415, 18.5250, 73.8418)
    assert 40.0 < d < 80.0

def test_direct_spatial_and_temporal_overlap(test_db):
    # Request A: Oct 15 - Oct 18 on Central Avenue
    req_a = ExcavationRequest(
        request_code="REQ-TEST-A",
        title="Water Pipeline Repair",
        department_id=1,
        road_id=1,
        locality="Shivaji Nagar",
        work_type="Water Pipeline",
        reason_description="Repairing leak",
        proposed_start_date=datetime.date(2026, 10, 15),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 18),
        excavation_length_meters=20.0,
        excavation_depth_meters=1.5,
        priority="High",
        contact_person="Ramesh",
        contact_phone="9999",
        latitude=18.5246,
        longitude=73.8415,
        status="Approved",
        created_by_user_id=1
    )
    test_db.add(req_a)
    test_db.commit()

    # Request B: Oct 17 - Oct 20 on Central Avenue (overlaps Oct 17-18)
    req_b = ExcavationRequest(
        request_code="REQ-TEST-B",
        title="Power Cable Repair",
        department_id=2,
        road_id=1,
        locality="Shivaji Nagar",
        work_type="Cable Installation",
        reason_description="Cable maintenance",
        proposed_start_date=datetime.date(2026, 10, 17),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 20),
        excavation_length_meters=25.0,
        excavation_depth_meters=1.0,
        priority="Medium",
        contact_person="Sandeep",
        contact_phone="8888",
        latitude=18.5248,
        longitude=73.8416,
        status="Submitted",
        created_by_user_id=1
    )
    test_db.add(req_b)
    test_db.commit()

    conflicts = detect_conflicts_for_request(req_b, test_db, auto_save=True)
    assert len(conflicts) == 1
    assert conflicts[0].conflict_category == "Direct Spatial & Temporal Overlap"
    assert conflicts[0].severity == "High"
    assert "RULE_SPATIAL_TEMPORAL_OVERLAP" in conflicts[0].matching_rule

def test_sequential_excavation_detection(test_db):
    # Request A: Oct 15 - Oct 18 on Central Avenue
    req_a = ExcavationRequest(
        request_code="REQ-TEST-A",
        title="Water Pipeline",
        department_id=1,
        road_id=1,
        locality="Shivaji Nagar",
        work_type="Water Pipeline",
        reason_description="Repairing leak",
        proposed_start_date=datetime.date(2026, 10, 15),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 18),
        excavation_length_meters=20.0,
        excavation_depth_meters=1.5,
        priority="Medium",
        contact_person="Ramesh",
        contact_phone="9999",
        latitude=18.5246,
        longitude=73.8415,
        status="Approved",
        created_by_user_id=1
    )
    test_db.add(req_a)
    test_db.commit()

    # Request C: Oct 24 - Oct 27 (6 days after Req A finishes on same road!)
    req_c = ExcavationRequest(
        request_code="REQ-TEST-C",
        title="Telecom Duct",
        department_id=2,
        road_id=1,
        locality="Shivaji Nagar",
        work_type="Cable Installation",
        reason_description="Optical cable",
        proposed_start_date=datetime.date(2026, 10, 24),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 27),
        excavation_length_meters=15.0,
        excavation_depth_meters=0.8,
        priority="Low",
        contact_person="Pooja",
        contact_phone="7777",
        latitude=18.5246,
        longitude=73.8415,
        status="Submitted",
        created_by_user_id=1
    )
    test_db.add(req_c)
    test_db.commit()

    conflicts = detect_conflicts_for_request(req_c, test_db, auto_save=True)
    assert len(conflicts) == 1
    assert conflicts[0].conflict_category == "Nearby Sequential Excavation"
    assert conflicts[0].days_difference == 6

def test_no_conflict_on_different_roads(test_db):
    # Request on Central Avenue
    req_a = ExcavationRequest(
        request_code="REQ-TEST-A",
        title="Water Pipeline",
        department_id=1,
        road_id=1,
        locality="Shivaji Nagar",
        work_type="Water Pipeline",
        reason_description="Repairing leak",
        proposed_start_date=datetime.date(2026, 10, 15),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 18),
        excavation_length_meters=20.0,
        excavation_depth_meters=1.5,
        priority="Medium",
        contact_person="Ramesh",
        contact_phone="9999",
        latitude=18.5246,
        longitude=73.8415,
        status="Approved",
        created_by_user_id=1
    )
    test_db.add(req_a)
    test_db.commit()

    # Request on Baner Road (several kilometers away)
    req_far = ExcavationRequest(
        request_code="REQ-TEST-FAR",
        title="Baner Power Cable",
        department_id=2,
        road_id=2,  # Baner Road
        locality="Baner",
        work_type="Cable Installation",
        reason_description="Baner cable",
        proposed_start_date=datetime.date(2026, 10, 16),
        expected_duration_days=3,
        proposed_end_date=datetime.date(2026, 10, 19),
        excavation_length_meters=15.0,
        excavation_depth_meters=0.8,
        priority="Low",
        contact_person="Pooja",
        contact_phone="7777",
        latitude=18.5590,
        longitude=73.7868,
        status="Submitted",
        created_by_user_id=1
    )
    test_db.add(req_far)
    test_db.commit()

    conflicts = detect_conflicts_for_request(req_far, test_db, auto_save=True)
    assert len(conflicts) == 0
