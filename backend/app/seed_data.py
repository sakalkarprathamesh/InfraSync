import datetime
from sqlalchemy.orm import Session
from .models import (
    Department, User, Road, ExcavationRequest, ConflictMatch,
    CoordinationProposal, CoordinationDecision, Schedule, StatusHistory,
    RestorationRecord, ProjectDiscussion, Notification, SharedResource
)
from .auth import get_password_hash
from .conflict_engine import detect_conflicts_for_request
from .scheduling_engine import evaluate_coordination_feasibility

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Department).first():
        print("Database already contains data. Skipping full seed.")
        return

    print("Seeding Infrasync database with realistic Pune demonstration data...")

    # 1. DEPARTMENTS
    departments = [
        Department(
            name="PMC Water Supply Department",
            code="WATER",
            contact_person="Er. Ramesh Deshmukh (Executive Engineer)",
            phone="+91 20 2550 1001",
            email="water@infrasync.gov.in",
            color="#2563EB",  # Blue
            description="Responsible for urban municipal water distribution pipelines, feeder mains, and valve maintenance across Pune."
        ),
        Department(
            name="MSEDCL Electricity Distribution",
            code="ELECTRICITY",
            contact_person="Er. Sandeep Kulkarni (Superintending Engineer)",
            phone="+91 20 2605 2002",
            email="power@infrasync.gov.in",
            color="#D97706",  # Amber/Yellow
            description="Manages high-voltage underground cables, 11kV distribution lines, and street sub-station power connectivity."
        ),
        Department(
            name="MNGL Natural Gas Limited",
            code="GAS",
            contact_person="Rajesh Sharma (City Gas Distribution Lead)",
            phone="+91 20 2561 3003",
            email="gas@infrasync.gov.in",
            color="#EA580C",  # Orange
            description="Lays and inspects medium-density polyethylene (MDPE) pipelines for piped domestic and commercial natural gas."
        ),
        Department(
            name="Telecom & OFC Infrastructure",
            code="TELECOM",
            contact_person="Pooja Mehta (Urban Fiber Operations Head)",
            phone="+91 20 2712 4004",
            email="telecom@infrasync.gov.in",
            color="#9333EA",  # Purple
            description="Deploys micro-trench optical fiber cables (OFC) and 5G small-cell duct infrastructure."
        ),
        Department(
            name="PMC Drainage & Sewage Department",
            code="SEWAGE",
            contact_person="Er. Vikas Gaikwad (Chief Drainage Engineer)",
            phone="+91 20 2550 5005",
            email="sewage@infrasync.gov.in",
            color="#0D9488",  # Teal
            description="Maintains stormwater drains, underground drainage trunk mains, and manhole chamber restoration."
        ),
        Department(
            name="PMC Road & Infrastructure Department",
            code="ROAD",
            contact_person="Er. Aniruddha Pawaskar (Chief Road Engineer)",
            phone="+91 20 2550 6006",
            email="road@infrasync.gov.in",
            color="#1E293B",  # Deep Navy/Slate
            description="Constructs asphalt and concrete roads, monitors right-of-way permissions, and certifies surface reinstatement."
        ),
    ]
    for d in departments:
        db.add(d)
    db.commit()

    # 2. USERS (Password for all demo accounts is their role standard password)
    users = [
        User(
            name="Dr. Sanjeev Joshi (Municipal Commissioner / Admin)",
            email="admin@infrasync.gov.in",
            hashed_password=get_password_hash("Admin@123"),
            role="admin",
            department_id=6,  # Road dept / Central administration
            designation="Chief Municipal Administrator",
            is_active=True
        ),
        User(
            name="Er. Ramesh Deshmukh (Water Supply Officer)",
            email="water@infrasync.gov.in",
            hashed_password=get_password_hash("Water@123"),
            role="department_user",
            department_id=1,
            designation="Executive Engineer (Water)",
            is_active=True
        ),
        User(
            name="Er. Sandeep Kulkarni (Power Grid Officer)",
            email="power@infrasync.gov.in",
            hashed_password=get_password_hash("Power@123"),
            role="department_user",
            department_id=2,
            designation="Divisional Power Engineer",
            is_active=True
        ),
        User(
            name="Rajesh Sharma (MNGL Gas Project Lead)",
            email="gas@infrasync.gov.in",
            hashed_password=get_password_hash("Gas@123"),
            role="department_user",
            department_id=3,
            designation="Pipeline Project Manager",
            is_active=True
        ),
        User(
            name="Pooja Mehta (Telecom Infrastructure Manager)",
            email="telecom@infrasync.gov.in",
            hashed_password=get_password_hash("Telecom@123"),
            role="department_user",
            department_id=4,
            designation="Telecom Network Lead",
            is_active=True
        ),
        User(
            name="Siddharth Patwardhan (Public / Citizen Observer)",
            email="viewer@infrasync.gov.in",
            hashed_password=get_password_hash("Viewer@123"),
            role="viewer",
            department_id=None,
            designation="Civic Forum Representative",
            is_active=True
        ),
    ]
    for u in users:
        db.add(u)
    db.commit()

    # 3. ROADS (Pune, Maharashtra verified corridors)
    roads = [
        Road(
            name="Central Avenue (FC Road)",
            road_code="PUN-RD-001",
            locality="Shivaji Nagar",
            ward="Shivaji Nagar - Ghole Road Ward No. 14",
            length_km=2.4,
            surface_type="Asphalt",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.5246,
            longitude=73.8415
        ),
        Road(
            name="Jangali Maharaj (JM) Road",
            road_code="PUN-RD-002",
            locality="Shivaji Nagar",
            ward="Shivaji Nagar Ward No. 13",
            length_km=2.1,
            surface_type="Concrete Paving",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.5312,
            longitude=73.8446
        ),
        Road(
            name="Karve Road",
            road_code="PUN-RD-003",
            locality="Kothrud",
            ward="Kothrud Ward No. 11",
            length_km=4.2,
            surface_type="Asphalt",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.5028,
            longitude=73.8183
        ),
        Road(
            name="Senapati Bapat Road",
            road_code="PUN-RD-004",
            locality="Model Colony",
            ward="Aundh - Model Colony Ward No. 8",
            length_km=2.8,
            surface_type="Asphalt",
            importance_tier="Tier 2 Commercial Corridor",
            latitude=18.5362,
            longitude=73.8300
        ),
        Road(
            name="Baner Road",
            road_code="PUN-RD-005",
            locality="Baner",
            ward="Baner - Balewadi Ward No. 9",
            length_km=4.5,
            surface_type="Asphalt",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.5590,
            longitude=73.7868
        ),
        Road(
            name="Aundh Main Road (Bremen Chowk to DP Road)",
            road_code="PUN-RD-006",
            locality="Aundh",
            ward="Aundh Ward No. 7",
            length_km=3.1,
            surface_type="Asphalt",
            importance_tier="Tier 2 Urban Connector",
            latitude=18.5580,
            longitude=73.8073
        ),
        Road(
            name="Viman Nagar Main Road",
            road_code="PUN-RD-007",
            locality="Viman Nagar",
            ward="Nagar Road - Vadgaon Sheri Ward No. 3",
            length_km=1.9,
            surface_type="Paver Blocks & Asphalt",
            importance_tier="Tier 2 Commercial Corridor",
            latitude=18.5679,
            longitude=73.9143
        ),
        Road(
            name="Magarpatta Road",
            road_code="PUN-RD-008",
            locality="Hadapsar",
            ward="Hadapsar Ward No. 21",
            length_km=3.6,
            surface_type="Asphalt",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.5158,
            longitude=73.9272
        ),
        Road(
            name="Sinhagad Road",
            road_code="PUN-RD-009",
            locality="Parvati - Wadgaon",
            ward="Sinhagad Road Ward No. 19",
            length_km=5.8,
            surface_type="Asphalt",
            importance_tier="Tier 1 Major Arterial",
            latitude=18.4901,
            longitude=73.8340
        ),
        Road(
            name="Koregaon Park North Main Road",
            road_code="PUN-RD-010",
            locality="Koregaon Park",
            ward="Dhole Patil Road Ward No. 5",
            length_km=2.2,
            surface_type="Asphalt",
            importance_tier="Tier 2 Commercial Corridor",
            latitude=18.5364,
            longitude=73.8938
        ),
    ]
    for r in roads:
        db.add(r)
    db.commit()

    # 4. EXCAVATION REQUESTS (Including Request A and Request B for End-to-End Demo)
    # Using consistent demonstration dates around mid October
    base_year = 2026
    
    # Request A (Required Scenario: Water Supply, Central Avenue, Oct 15-18, Approved)
    req_a = ExcavationRequest(
        request_code="REQ-2026-001",
        title="Central Avenue 400mm Feeder Water Pipeline Repair & Valve Upgradation",
        department_id=1,  # Water
        road_id=1,        # Central Avenue (FC Road)
        locality="Shivaji Nagar",
        work_type="Water Pipeline",
        reason_description="Urgent replacement of age-corroded 400mm cast iron main water valve near Goodluck Chowk to resolve low pressure complaints across Deccan.",
        proposed_start_date=datetime.date(base_year, 10, 15),
        expected_duration_days=3,
        proposed_end_date=datetime.date(base_year, 10, 18),
        excavation_length_meters=25.0,
        excavation_depth_meters=2.2,
        priority="High",
        estimated_restoration_days=2,
        contact_person="Er. Ramesh Deshmukh",
        contact_phone="+91 98220 12345",
        latitude=18.5246,
        longitude=73.8415,
        supporting_notes="Valve pit excavation of 3m x 2m. Traffic diversion proposed to one side of carriage way.",
        status="Approved",
        created_by_user_id=2,  # water user
        estimated_cost=65000.0,
    )
    db.add(req_a)

    # Request B (Required Scenario: Electricity, Central Avenue, Oct 17-20, Submitted)
    req_b = ExcavationRequest(
        request_code="REQ-2026-002",
        title="Central Avenue 11kV Underground Power Cable Fault Rectification",
        department_id=2,  # Electricity
        road_id=1,        # Central Avenue (FC Road)
        locality="Shivaji Nagar",
        work_type="Cable Installation",
        reason_description="Rectification of underground 11kV feeder line insulation breakdown between Goodluck Cafe and Ferguson College main gate.",
        proposed_start_date=datetime.date(base_year, 10, 17),
        expected_duration_days=3,
        proposed_end_date=datetime.date(base_year, 10, 20),
        excavation_length_meters=30.0,
        excavation_depth_meters=1.2,
        priority="Medium",
        estimated_restoration_days=2,
        contact_person="Er. Sandeep Kulkarni",
        contact_phone="+91 98220 23456",
        latitude=18.5248,  # Within 25 meters of Request A on Central Avenue!
        longitude=73.8416,
        supporting_notes="Trench width 0.6m. Cable laying requires power shutdown block during night hours.",
        status="Submitted",
        created_by_user_id=3,  # power user
        estimated_cost=55000.0,
    )
    db.add(req_b)

    # Other realistic seeded requests across Pune
    requests_data = [
        # REQ-003: Sequential Excavation case on Karve Road (Gas pipeline followed closely by Telecom)
        ExcavationRequest(
            request_code="REQ-2026-003",
            title="Karve Road MDPE Natural Gas Pipeline Grid Extension",
            department_id=3,  # Gas
            road_id=3,        # Karve Road
            locality="Kothrud",
            work_type="Gas Pipeline",
            reason_description="Laying 125mm MDPE gas supply pipe to supply domestic PNG connections near Paud Phata junction.",
            proposed_start_date=datetime.date(base_year, 10, 22),
            expected_duration_days=4,
            proposed_end_date=datetime.date(base_year, 10, 26),
            excavation_length_meters=45.0,
            excavation_depth_meters=1.5,
            priority="Medium",
            estimated_restoration_days=2,
            contact_person="Rajesh Sharma",
            contact_phone="+91 98220 34567",
            latitude=18.5028,
            longitude=73.8183,
            supporting_notes="Non-destructive HDD method wherever possible.",
            status="Approved",
            created_by_user_id=4,
            estimated_cost=80000.0,
        ),
        # REQ-004: Sequential clash with REQ-003 (Starts 4 days after REQ-003 finishes on Karve Road!)
        ExcavationRequest(
            request_code="REQ-2026-004",
            title="Karve Road 5G Micro-duct Optical Fiber Trenching",
            department_id=4,  # Telecom
            road_id=3,        # Karve Road
            locality="Kothrud",
            work_type="Cable Installation",
            reason_description="Deploying high-speed telecom fiber backhaul for upcoming 5G cell tower deployment along Karve Road corridor.",
            proposed_start_date=datetime.date(base_year, 10, 30),
            expected_duration_days=3,
            proposed_end_date=datetime.date(base_year, 11, 2),
            excavation_length_meters=40.0,
            excavation_depth_meters=0.9,
            priority="Low",
            estimated_restoration_days=1,
            contact_person="Pooja Mehta",
            contact_phone="+91 98220 45678",
            latitude=18.5030,
            longitude=73.8185,
            supporting_notes="Micro-trenching 100mm width.",
            status="Submitted",
            created_by_user_id=5,
            estimated_cost=42000.0,
        ),
        # REQ-005: Emergency Excavation on Senapati Bapat Road
        ExcavationRequest(
            request_code="REQ-2026-005",
            title="Senapati Bapat Road Major Trunk Water Pipeline Burst Repair",
            department_id=1,  # Water
            road_id=4,        # SB Road
            locality="Model Colony",
            work_type="Emergency",
            reason_description="Emergency rupture in 600mm treated water distribution line flooding roadway opposite ICC Trade Tower. Immediate isolation and pipe replacement required.",
            proposed_start_date=datetime.date(base_year, 10, 10),
            expected_duration_days=2,
            proposed_end_date=datetime.date(base_year, 10, 12),
            excavation_length_meters=15.0,
            excavation_depth_meters=2.5,
            priority="Emergency",
            estimated_restoration_days=2,
            contact_person="Er. Ramesh Deshmukh",
            contact_phone="+91 98220 12345",
            latitude=18.5362,
            longitude=73.8300,
            supporting_notes="Emergency road lane closure notified to Pune Traffic Police.",
            status="In Progress",
            created_by_user_id=2,
            estimated_cost=95000.0,
        ),
        # REQ-006: Baner Road Drainage Reconstruction (Scheduled)
        ExcavationRequest(
            request_code="REQ-2026-006",
            title="Baner Road Stormwater Drainage Invert Deepening & Culvert Overhaul",
            department_id=5,  # Sewage & Drainage
            road_id=5,        # Baner Road
            locality="Baner",
            work_type="Drainage",
            reason_description="Culvert widening to prevent monsoon water-logging near Balewadi High Street junction.",
            proposed_start_date=datetime.date(base_year, 10, 18),
            expected_duration_days=5,
            proposed_end_date=datetime.date(base_year, 10, 23),
            excavation_length_meters=50.0,
            excavation_depth_meters=2.8,
            priority="High",
            estimated_restoration_days=3,
            contact_person="Er. Vikas Gaikwad",
            contact_phone="+91 98220 56789",
            latitude=18.5590,
            longitude=73.7868,
            supporting_notes="Requires heavy earth excavator (JCB 3DX) and precast concrete slab installation.",
            status="Scheduled",
            created_by_user_id=1,
            estimated_cost=120000.0,
        ),
        # REQ-007: Completed project awaiting road restoration
        ExcavationRequest(
            request_code="REQ-2026-007",
            title="Aundh Main Road Gas Distribution Chamber Installation",
            department_id=3,  # Gas
            road_id=6,        # Aundh Main Road
            locality="Aundh",
            work_type="Gas Pipeline",
            reason_description="Underground control valve chamber installed near Bremen Chowk.",
            proposed_start_date=datetime.date(base_year, 10, 1),
            expected_duration_days=3,
            proposed_end_date=datetime.date(base_year, 10, 4),
            excavation_length_meters=12.0,
            excavation_depth_meters=1.6,
            priority="Medium",
            estimated_restoration_days=2,
            contact_person="Rajesh Sharma",
            contact_phone="+91 98220 34567",
            latitude=18.5580,
            longitude=73.8073,
            supporting_notes="Excavation and backfilling completed. Awaiting final PMC asphalt paving certification.",
            status="Restoration Pending",
            created_by_user_id=4,
            estimated_cost=48000.0,
        ),
        # REQ-008: Fully Restored and Verified Project (Historical record)
        ExcavationRequest(
            request_code="REQ-2026-008",
            title="JM Road Smart City Sensor Duct Laying",
            department_id=4,  # Telecom
            road_id=2,        # JM Road
            locality="Shivaji Nagar",
            work_type="Cable Installation",
            reason_description="Smart traffic signal synchronization sensor ducting.",
            proposed_start_date=datetime.date(base_year, 9, 15),
            expected_duration_days=2,
            proposed_end_date=datetime.date(base_year, 9, 17),
            excavation_length_meters=18.0,
            excavation_depth_meters=0.8,
            priority="Low",
            estimated_restoration_days=1,
            contact_person="Pooja Mehta",
            contact_phone="+91 98220 45678",
            latitude=18.5312,
            longitude=73.8446,
            supporting_notes="Completed on schedule. Bituminous mastic asphalt reinstatement inspected and verified.",
            status="Restoration Verified",
            created_by_user_id=5,
            estimated_cost=35000.0,
        ),
        # REQ-009: Viman Nagar Sewage Manhole Reconstruction (Under Review)
        ExcavationRequest(
            request_code="REQ-2026-009",
            title="Viman Nagar Main Road Chamber Collapsed Silt Extraction",
            department_id=5,  # Sewage
            road_id=7,        # Viman Nagar
            locality="Viman Nagar",
            work_type="Sewage Repair",
            reason_description="Collapsed brick masonry manhole repair near Phoenix Mall connector.",
            proposed_start_date=datetime.date(base_year, 10, 19),
            expected_duration_days=3,
            proposed_end_date=datetime.date(base_year, 10, 22),
            excavation_length_meters=8.0,
            excavation_depth_meters=3.0,
            priority="Medium",
            estimated_restoration_days=2,
            contact_person="Er. Vikas Gaikwad",
            contact_phone="+91 98220 56789",
            latitude=18.5679,
            longitude=73.9143,
            supporting_notes="Deep dewatering pump required on site.",
            status="Under Review",
            created_by_user_id=1,
            estimated_cost=58000.0,
        ),
        # REQ-010: Magarpatta Road Power Sub-station Line Augmentation (Draft)
        ExcavationRequest(
            request_code="REQ-2026-010",
            title="Magarpatta Road Cybercity IT Park HT Feeder Augmentation",
            department_id=2,  # Electricity
            road_id=8,        # Magarpatta Road
            locality="Hadapsar",
            work_type="Cable Installation",
            reason_description="Draft plan to lay additional 22kV feeder line to accommodate data center load demand.",
            proposed_start_date=datetime.date(base_year, 11, 5),
            expected_duration_days=4,
            proposed_end_date=datetime.date(base_year, 11, 9),
            excavation_length_meters=60.0,
            excavation_depth_meters=1.4,
            priority="Medium",
            estimated_restoration_days=2,
            contact_person="Er. Sandeep Kulkarni",
            contact_phone="+91 98220 23456",
            latitude=18.5158,
            longitude=73.9272,
            supporting_notes="Internal departmental drafting stage. Preliminary survey completed.",
            status="Draft",
            created_by_user_id=3,
            estimated_cost=85000.0,
        ),
        # REQ-011: Sinhagad Road Water Supply Valve Testing (Completed)
        ExcavationRequest(
            request_code="REQ-2026-011",
            title="Sinhagad Road Rajaram Bridge Junction Air Valve Installation",
            department_id=1,  # Water
            road_id=9,        # Sinhagad Road
            locality="Parvati",
            work_type="Water Pipeline",
            reason_description="Installed air-relief kinetic valve on 700mm bulk water supply conduit.",
            proposed_start_date=datetime.date(base_year, 9, 25),
            expected_duration_days=2,
            proposed_end_date=datetime.date(base_year, 9, 27),
            excavation_length_meters=10.0,
            excavation_depth_meters=2.0,
            priority="Medium",
            estimated_restoration_days=1,
            contact_person="Er. Ramesh Deshmukh",
            contact_phone="+91 98220 12345",
            latitude=18.4901,
            longitude=73.8340,
            supporting_notes="Mechanical installation completed; road patch cold mix applied.",
            status="Completed",
            created_by_user_id=2,
            estimated_cost=38000.0,
        ),
        # REQ-012: Koregaon Park OFC Maintenance (Approved)
        ExcavationRequest(
            request_code="REQ-2026-012",
            title="KP North Main Road Lane 5 Broadband Fiber Duct Relocation",
            department_id=4,  # Telecom
            road_id=10,       # Koregaon Park
            locality="Koregaon Park",
            work_type="Cable Installation",
            reason_description="Relocating telecom duct away from roadside tree root system.",
            proposed_start_date=datetime.date(base_year, 10, 25),
            expected_duration_days=2,
            proposed_end_date=datetime.date(base_year, 10, 27),
            excavation_length_meters=22.0,
            excavation_depth_meters=1.0,
            priority="Low",
            estimated_restoration_days=1,
            contact_person="Pooja Mehta",
            contact_phone="+91 98220 45678",
            latitude=18.5364,
            longitude=73.8938,
            supporting_notes="Hand-digging near tree basin to preserve arbor roots.",
            status="Approved",
            created_by_user_id=5,
            estimated_cost=30000.0,
        ),
        # REQ-013: Central Avenue Planned Road Resurfacing (Road Dept)
        ExcavationRequest(
            request_code="REQ-2026-013",
            title="Central Avenue (FC Road) Milling & Bituminous Surface Overhaul",
            department_id=6,  # Road Dept
            road_id=1,        # Central Avenue
            locality="Shivaji Nagar",
            work_type="Road Maintenance",
            reason_description="Annual major surface relaying of 50mm Dense Bituminous Macadam (DBM) and wearing course.",
            proposed_start_date=datetime.date(base_year, 10, 24),
            expected_duration_days=4,
            proposed_end_date=datetime.date(base_year, 10, 28),
            excavation_length_meters=200.0,
            excavation_depth_meters=0.1,
            priority="High",
            estimated_restoration_days=1,
            contact_person="Er. Aniruddha Pawaskar",
            contact_phone="+91 98220 67890",
            latitude=18.5247,
            longitude=73.8417,
            supporting_notes="Critical: All utility departments must complete underground utility work before this resurfacing begins!",
            status="Under Review",
            created_by_user_id=1,
            estimated_cost=350000.0,
        ),
        # REQ-014: Baner Road OFC network (Nearby to REQ-006 drainage)
        ExcavationRequest(
            request_code="REQ-2026-014",
            title="Baner Road High Street Fiber Duct Trenching",
            department_id=4,  # Telecom
            road_id=5,        # Baner Road
            locality="Baner",
            work_type="Cable Installation",
            reason_description="Optical fiber trenching on northern footpath of Baner Road.",
            proposed_start_date=datetime.date(base_year, 10, 20),
            expected_duration_days=3,
            proposed_end_date=datetime.date(base_year, 10, 23),
            excavation_length_meters=35.0,
            excavation_depth_meters=1.0,
            priority="Medium",
            estimated_restoration_days=1,
            contact_person="Pooja Mehta",
            contact_phone="+91 98220 45678",
            latitude=18.5592,
            longitude=73.7870,
            supporting_notes="Coordinates coincide with stormwater culvert project.",
            status="Submitted",
            created_by_user_id=5,
            estimated_cost=45000.0,
        ),
        # REQ-015: Historical Completed & Verified
        ExcavationRequest(
            request_code="REQ-2026-015",
            title="JM Road Drainage Catchpit Reconstruction",
            department_id=5,  # Sewage & Drainage
            road_id=2,        # JM Road
            locality="Shivaji Nagar",
            work_type="Drainage",
            reason_description="Replaced broken RCC drainage chamber covers near Sambhaji Park.",
            proposed_start_date=datetime.date(base_year, 8, 10),
            expected_duration_days=2,
            proposed_end_date=datetime.date(base_year, 8, 12),
            excavation_length_meters=6.0,
            excavation_depth_meters=1.8,
            priority="Medium",
            estimated_restoration_days=1,
            contact_person="Er. Vikas Gaikwad",
            contact_phone="+91 98220 56789",
            latitude=18.5310,
            longitude=73.8444,
            supporting_notes="Road patch repaved and certified by Road Inspection team.",
            status="Restoration Verified",
            created_by_user_id=1,
            estimated_cost=28000.0,
        ),
    ]

    for req in requests_data:
        db.add(req)
    db.commit()

    # 5. RESTORATION RECORDS FOR COMPLETED PROJECTS
    restorations = [
        # REQ-007 (Restoration Pending)
        RestorationRecord(
            request_id=req_a.id + 6,  # REQ-007
            completion_date=datetime.date(base_year, 10, 4),
            contractor_name="M/s Shree Swami Samarth Infrastructure Ltd.",
            road_surface_restored="Cold Mix Temporary Patch",
            restoration_quality_rating=3,
            inspection_date=datetime.date(base_year, 10, 6),
            inspector_name="Er. Nilesh Patil (Junior Engineer, PMC)",
            verification_status="Pending Inspection",
            verification_notes="Backfilling consolidated; permanent asphalt hot-mix wearing course pending municipal laboratory core test.",
            verified_by_user_id=None,
            verified_at=None
        ),
        # REQ-008 (Restoration Verified)
        RestorationRecord(
            request_id=req_a.id + 7,  # REQ-008
            completion_date=datetime.date(base_year, 9, 17),
            contractor_name="Eagle Infra Pune Pvt Ltd",
            road_surface_restored="Bituminous Asphalt (Hot Mix)",
            restoration_quality_rating=5,
            inspection_date=datetime.date(base_year, 9, 20),
            inspector_name="Er. Aniruddha Pawaskar (Chief Road Engineer)",
            verification_status="Verified Satisfactory",
            verification_notes="Surface level aligns flush with existing pavement. Skid resistance and water runoff slope verified.",
            verified_by_user_id=1,  # admin
            verified_at=datetime.datetime(base_year, 9, 20, 16, 30)
        ),
        # REQ-015 (Restoration Verified)
        RestorationRecord(
            request_id=req_a.id + 14,  # REQ-015
            completion_date=datetime.date(base_year, 8, 12),
            contractor_name="Pune Civic Works Consortium",
            road_surface_restored="Concrete Paver Block & Bitumen",
            restoration_quality_rating=4,
            inspection_date=datetime.date(base_year, 8, 15),
            inspector_name="Er. Nilesh Patil (Junior Engineer, PMC)",
            verification_status="Verified Satisfactory",
            verification_notes="All catchpits securely flush with kerbstone; no depression detected.",
            verified_by_user_id=1,
            verified_at=datetime.datetime(base_year, 8, 15, 11, 45)
        ),
    ]
    for rest in restorations:
        db.add(rest)
    db.commit()

    # 6. RUN DETECT CONFLICT ENGINE FOR SEEDED PROJECTS
    all_requests = db.query(ExcavationRequest).all()
    for req in all_requests:
        detect_conflicts_for_request(req, db, auto_save=True)

    # 7. SEED COORDINATION PROPOSAL FOR REQUIRED SCENARIO (Request A + Request B)
    # Evaluate feasibility and create candidate proposal
    eval_res = evaluate_coordination_feasibility(req_a, req_b)
    
    proposal = CoordinationProposal(
        proposal_code="PROP-2026-001",
        title="Central Avenue Unified Water & Underground Power Cable Coordination",
        primary_request_id=req_a.id,
        secondary_request_id=req_b.id,
        lead_department_id=1,  # Water
        proposed_start_date=eval_res["recommended_start_date"],
        proposed_end_date=eval_res["recommended_end_date"],
        combined_duration_days=eval_res["combined_duration_days"],
        shared_excavation_window_desc=eval_res["shared_excavation_window_desc"],
        feasibility_score=eval_res["feasibility_score"],
        estimated_savings_inr=eval_res["estimated_savings_inr"],
        status="Pending Review",
        admin_decision_notes="Under administrative review. Recommended for joint trenching on 15 Oct to minimize disruption on FC Road."
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    # 8. SEED COLLABORATION DISCUSSIONS
    discussions = [
        ProjectDiscussion(
            request_id=req_a.id,
            coordination_proposal_id=proposal.id,
            user_id=2,  # Water user
            message="Water Department is ready to begin valve pit excavation on Oct 15 at 07:00 AM. We can accommodate MSEDCL cable laying along the outer edge of the trench on Oct 16 afternoon.",
            is_coordination_note=True
        ),
        ProjectDiscussion(
            request_id=req_b.id,
            coordination_proposal_id=proposal.id,
            user_id=3,  # Power user
            message="MSEDCL field team inspected the FC Road site today. We concur with joint trenching. Power shut-down block scheduled for Oct 16 between 11:00 PM and 04:00 AM.",
            is_coordination_note=True
        ),
        ProjectDiscussion(
            request_id=req_a.id,
            coordination_proposal_id=proposal.id,
            user_id=1,  # Admin
            message="Municipal road monitoring cell recommends completing joint backfilling by Oct 18 noon, ahead of weekend high-traffic hours on FC Road.",
            is_coordination_note=True
        ),
    ]
    for disc in discussions:
        db.add(disc)

    # 9. SEED SHARED RESOURCES (Section 13)
    resources = [
        SharedResource(
            department_id=1,  # Water
            resource_name="JCB 3DX Heavy Excavator & Breaker Attachment",
            resource_type="Machinery",
            quantity="1 Unit",
            availability_window_start=datetime.date(base_year, 10, 15),
            availability_window_end=datetime.date(base_year, 10, 22),
            contact_person="Er. Ramesh Deshmukh (+91 98220 12345)",
            notes="Equipped with pneumatic rock breaker; available for shared trenching on Central Avenue."
        ),
        SharedResource(
            department_id=2,  # Electricity
            resource_name="High-Output Mobile Dewatering Sludge Pump (10 HP)",
            resource_type="Machinery",
            quantity="2 Units",
            availability_window_start=datetime.date(base_year, 10, 14),
            availability_window_end=datetime.date(base_year, 10, 25),
            contact_person="Er. Sandeep Kulkarni (+91 98220 23456)",
            notes="Ideal for waterlogged trenches during excavation."
        ),
        SharedResource(
            department_id=6,  # Road
            resource_name="Rapid Asphalt Compaction Roller & Patch Crew",
            resource_type="Restoration Team",
            quantity="1 Team (8 Personnel + Tandem Roller)",
            availability_window_start=datetime.date(base_year, 10, 17),
            availability_window_end=datetime.date(base_year, 10, 31),
            contact_person="Er. Aniruddha Pawaskar (+91 98220 67890)",
            notes="Can deploy immediately post-utility backfill for single-pass asphalt reinstatement."
        ),
        SharedResource(
            department_id=4,  # Telecom
            resource_name="Underground Cable Fault & Utility Locator (GPR Radar)",
            resource_type="Technical Personnel",
            quantity="1 Specialist Team",
            availability_window_start=datetime.date(base_year, 10, 12),
            availability_window_end=datetime.date(base_year, 10, 30),
            contact_person="Pooja Mehta (+91 98220 45678)",
            notes="High precision Ground Penetrating Radar to map subsurface utilities before excavation."
        ),
    ]
    for res in resources:
        db.add(res)

    # 10. SEED STATUS HISTORY
    history_entries = [
        StatusHistory(
            request_id=req_a.id,
            from_status="Draft",
            to_status="Submitted",
            changed_by_user_id=2,
            notes="Request submitted by Water Supply department.",
            created_at=datetime.datetime(base_year, 10, 2, 10, 15)
        ),
        StatusHistory(
            request_id=req_a.id,
            from_status="Submitted",
            to_status="Under Review",
            changed_by_user_id=1,
            notes="Under review by Municipal Road Engineering Cell.",
            created_at=datetime.datetime(base_year, 10, 3, 11, 30)
        ),
        StatusHistory(
            request_id=req_a.id,
            from_status="Under Review",
            to_status="Approved",
            changed_by_user_id=1,
            notes="Approved subject to joint coordination with electrical cable work.",
            created_at=datetime.datetime(base_year, 10, 5, 14, 0)
        ),
        StatusHistory(
            request_id=req_b.id,
            from_status="Draft",
            to_status="Submitted",
            changed_by_user_id=3,
            notes="Submitted by MSEDCL for urgent 11kV cable repair.",
            created_at=datetime.datetime(base_year, 10, 6, 9, 45)
        ),
    ]
    for h in history_entries:
        db.add(h)

    # 11. SEED SYSTEM NOTIFICATIONS
    notifs = [
        Notification(
            user_id=1,
            department_id=None,
            title="Cross-Department Conflict on Central Avenue",
            message="Water Pipeline repair (REQ-2026-001) and Underground Cable repair (REQ-2026-002) have overlapping excavation windows on Central Avenue. Coordination Proposal PROP-2026-001 generated.",
            related_request_id=req_b.id,
            related_proposal_id=proposal.id,
            type="CONFLICT",
            is_read=False
        ),
        Notification(
            user_id=2,
            department_id=1,
            title="Coordination Proposal Received: PROP-2026-001",
            message="A joint coordination proposal has been proposed between Water Supply and MSEDCL on Central Avenue (Oct 15 - 18). Please review and submit your decision.",
            related_request_id=req_a.id,
            related_proposal_id=proposal.id,
            type="PROPOSAL",
            is_read=False
        ),
        Notification(
            user_id=3,
            department_id=2,
            title="Coordination Proposal Received: PROP-2026-001",
            message="A joint coordination proposal has been proposed between Water Supply and MSEDCL on Central Avenue (Oct 15 - 18). Please review and submit your decision.",
            related_request_id=req_b.id,
            related_proposal_id=proposal.id,
            type="PROPOSAL",
            is_read=False
        ),
        Notification(
            user_id=1,
            department_id=6,
            title="Road Restoration Inspection Pending: Aundh Main Road",
            message="Excavation REQ-2026-007 completed on Aundh Main Road. Awaiting municipal asphalt verification inspection.",
            related_request_id=req_a.id + 6,
            type="RESTORATION",
            is_read=False
        ),
    ]
    for n in notifs:
        db.add(n)

    db.commit()
    print("Database seeding completed successfully with 15+ projects, conflicts, proposals, and history.")
