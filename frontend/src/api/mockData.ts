import {
  DemoUser,
  Department,
  Road,
  DashboardSummary,
  ExcavationRequest,
  ConflictMatch,
  CoordinationProposal,
  RestorationRecord,
  SharedResource,
  NotificationItem
} from '../types';

export const MOCK_DEMO_USERS: DemoUser[] = [
  {
    id: 1,
    name: "Dr. Sanjeev Joshi (Municipal Commissioner / Admin)",
    email: "admin@infrasync.gov.in",
    role: "admin",
    department_name: "Pune Municipal Corporation (Central Admin)",
    department_code: "ADMIN",
    department_color: "#1E293B",
    designation: "Chief Municipal Administrator",
    demo_password: "Admin@123"
  },
  {
    id: 2,
    name: "Er. Ramesh Deshmukh (Water Supply Officer)",
    email: "water@infrasync.gov.in",
    role: "department_user",
    department_name: "PMC Water Supply Department",
    department_code: "WATER",
    department_color: "#2563EB",
    designation: "Executive Engineer (Water)",
    demo_password: "Water@123"
  },
  {
    id: 3,
    name: "Er. Sandeep Kulkarni (Power Grid Officer)",
    email: "power@infrasync.gov.in",
    role: "department_user",
    department_name: "MSEDCL Electricity Distribution",
    department_code: "ELECTRICITY",
    department_color: "#D97706",
    designation: "Divisional Power Engineer",
    demo_password: "Power@123"
  },
  {
    id: 4,
    name: "Rajesh Sharma (MNGL Gas Project Lead)",
    email: "gas@infrasync.gov.in",
    role: "department_user",
    department_name: "MNGL Natural Gas Limited",
    department_code: "GAS",
    department_color: "#EA580C",
    designation: "Pipeline Project Manager",
    demo_password: "Gas@123"
  },
  {
    id: 5,
    name: "Pooja Mehta (Telecom Infrastructure Manager)",
    email: "telecom@infrasync.gov.in",
    role: "department_user",
    department_name: "Telecom & OFC Infrastructure",
    department_code: "TELECOM",
    department_color: "#9333EA",
    designation: "Urban Fiber Operations Head",
    demo_password: "Telecom@123"
  },
  {
    id: 6,
    name: "Siddharth Patwardhan (Public / Citizen Observer)",
    email: "viewer@infrasync.gov.in",
    role: "viewer",
    department_name: "Civic Forum & Citizen Oversight",
    department_code: "CITIZEN",
    department_color: "#059669",
    designation: "Public Citizen Observer",
    demo_password: "Viewer@123"
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: "PMC Water Supply Department",
    code: "WATER",
    contact_person: "Er. Ramesh Deshmukh",
    phone: "+91 20 2550 1001",
    email: "water@infrasync.gov.in",
    color: "#2563EB",
    description: "Urban municipal water distribution pipelines, feeder mains, and valve maintenance.",
    project_count: 5
  },
  {
    id: 2,
    name: "MSEDCL Electricity Distribution",
    code: "ELECTRICITY",
    contact_person: "Er. Sandeep Kulkarni",
    phone: "+91 20 2605 2002",
    email: "power@infrasync.gov.in",
    color: "#D97706",
    description: "High-voltage underground cables, 11kV distribution lines, and street sub-stations.",
    project_count: 4
  },
  {
    id: 3,
    name: "MNGL Natural Gas Limited",
    code: "GAS",
    contact_person: "Rajesh Sharma",
    phone: "+91 20 2561 3003",
    email: "gas@infrasync.gov.in",
    color: "#EA580C",
    description: "Medium-density polyethylene (MDPE) pipelines for piped domestic and commercial gas.",
    project_count: 3
  },
  {
    id: 4,
    name: "Telecom & OFC Infrastructure",
    code: "TELECOM",
    contact_person: "Pooja Mehta",
    phone: "+91 20 2712 4004",
    email: "telecom@infrasync.gov.in",
    color: "#9333EA",
    description: "Micro-trench optical fiber cables (OFC) and 5G small-cell duct infrastructure.",
    project_count: 4
  },
  {
    id: 5,
    name: "PMC Drainage & Sewage Department",
    code: "SEWAGE",
    contact_person: "Anand Shinde",
    phone: "+91 20 2550 5005",
    email: "sewage@infrasync.gov.in",
    color: "#0284C7",
    description: "Stormwater drains, underground drainage trunk mains, and culverts.",
    project_count: 3
  },
  {
    id: 6,
    name: "PMC Road & Infrastructure Department",
    code: "ROAD",
    contact_person: "Er. Aniruddha Pawaskar",
    phone: "+91 20 2550 6006",
    email: "road@infrasync.gov.in",
    color: "#1E293B",
    description: "Asphalt overlay, road quality sign-off, and surface restoration verification.",
    project_count: 2
  }
];

export const MOCK_ROADS: Road[] = [
  { id: 1, name: "Central Avenue (FC Road)", road_code: "PUN-RD-001", locality: "Shivaji Nagar", ward: "Ward No. 14", length_km: 2.4, surface_type: "Asphalt", importance_tier: "Tier 1 Major Arterial", latitude: 18.5246, longitude: 73.8415, project_count: 4 },
  { id: 2, name: "Jangali Maharaj (JM) Road", road_code: "PUN-RD-002", locality: "Shivaji Nagar", ward: "Ward No. 13", length_km: 2.1, surface_type: "Concrete Paving", importance_tier: "Tier 1 Major Arterial", latitude: 18.5312, longitude: 73.8446, project_count: 2 },
  { id: 3, name: "Karve Road", road_code: "PUN-RD-003", locality: "Kothrud", ward: "Ward No. 11", length_km: 4.2, surface_type: "Asphalt", importance_tier: "Tier 1 Major Arterial", latitude: 18.5028, longitude: 73.8183, project_count: 3 },
  { id: 4, name: "Senapati Bapat Road", road_code: "PUN-RD-004", locality: "Model Colony", ward: "Ward No. 8", length_km: 2.8, surface_type: "Asphalt", importance_tier: "Tier 2 Commercial Corridor", latitude: 18.5362, longitude: 73.8300, project_count: 2 },
  { id: 5, name: "Baner Road", road_code: "PUN-RD-005", locality: "Baner", ward: "Ward No. 9", length_km: 4.5, surface_type: "Asphalt", importance_tier: "Tier 1 Major Arterial", latitude: 18.5590, longitude: 73.7868, project_count: 3 },
  { id: 6, name: "Aundh Main Road", road_code: "PUN-RD-006", locality: "Aundh", ward: "Ward No. 7", length_km: 3.1, surface_type: "Asphalt", importance_tier: "Tier 2 Urban Connector", latitude: 18.5580, longitude: 73.8073, project_count: 2 },
  { id: 7, name: "Viman Nagar Main Road", road_code: "PUN-RD-007", locality: "Viman Nagar", ward: "Ward No. 3", length_km: 1.9, surface_type: "Paver Blocks", importance_tier: "Tier 2 Commercial Corridor", latitude: 18.5679, longitude: 73.9143, project_count: 2 },
  { id: 8, name: "Magarpatta Road", road_code: "PUN-RD-008", locality: "Hadapsar", ward: "Ward No. 21", length_km: 3.6, surface_type: "Asphalt", importance_tier: "Tier 1 Major Arterial", latitude: 18.5158, longitude: 73.9272, project_count: 2 }
];

export const MOCK_REQUESTS: ExcavationRequest[] = [
  {
    id: 1,
    request_code: "REQ-2026-001",
    title: "FC Road Central Feeder Water Main Replacement",
    department_id: 1,
    department_name: "PMC Water Supply Department",
    department_code: "WATER",
    department_color: "#2563EB",
    road_id: 1,
    road_name: "Central Avenue (FC Road)",
    locality: "Shivaji Nagar",
    work_type: "Water Pipeline Replacement",
    reason_description: "Replacement of aging 300mm cast-iron pipeline with high-density polyethylene (HDPE) main to prevent chronic leakage.",
    proposed_start_date: "2026-10-15",
    expected_duration_days: 4,
    proposed_end_date: "2026-10-18",
    excavation_length_meters: 120,
    excavation_depth_meters: 1.8,
    priority: "High",
    estimated_restoration_days: 2,
    contact_person: "Er. Ramesh Deshmukh",
    contact_phone: "+91 20 2550 1001",
    latitude: 18.5246,
    longitude: 73.8415,
    status: "Approved",
    created_by_user_id: 2,
    created_by_name: "Er. Ramesh Deshmukh",
    estimated_cost: 320000,
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-05T14:30:00Z",
    active_conflicts_count: 1
  },
  {
    id: 2,
    request_code: "REQ-2026-002",
    title: "11kV Underground Power Feeder Augmentation",
    department_id: 2,
    department_name: "MSEDCL Electricity Distribution",
    department_code: "ELECTRICITY",
    department_color: "#D97706",
    road_id: 1,
    road_name: "Central Avenue (FC Road)",
    locality: "Shivaji Nagar",
    work_type: "Underground Power Cable Laying",
    reason_description: "Laying twin 11kV cross-linked polyethylene (XLPE) underground cables to meet increased peak commercial power demand.",
    proposed_start_date: "2026-10-17",
    expected_duration_days: 4,
    proposed_end_date: "2026-10-20",
    excavation_length_meters: 95,
    excavation_depth_meters: 1.2,
    priority: "High",
    estimated_restoration_days: 2,
    contact_person: "Er. Sandeep Kulkarni",
    contact_phone: "+91 20 2605 2002",
    latitude: 18.5249,
    longitude: 73.8419,
    status: "Approved",
    created_by_user_id: 3,
    created_by_name: "Er. Sandeep Kulkarni",
    estimated_cost: 280000,
    created_at: "2026-10-02T11:15:00Z",
    updated_at: "2026-10-06T09:45:00Z",
    active_conflicts_count: 1
  },
  {
    id: 3,
    request_code: "REQ-2026-003",
    title: "Karve Road 5G Telecom Duct Infrastructure",
    department_id: 4,
    department_name: "Telecom & OFC Infrastructure",
    department_code: "TELECOM",
    department_color: "#9333EA",
    road_id: 3,
    road_name: "Karve Road",
    locality: "Kothrud",
    work_type: "OFC Micro-Trenching",
    reason_description: "Micro-trench deployment of quad-duct optical fiber conduits for 5G network backhaul rollout.",
    proposed_start_date: "2026-11-05",
    expected_duration_days: 5,
    proposed_end_date: "2026-11-09",
    excavation_length_meters: 350,
    excavation_depth_meters: 0.6,
    priority: "Medium",
    estimated_restoration_days: 1,
    contact_person: "Pooja Mehta",
    contact_phone: "+91 20 2712 4004",
    latitude: 18.5028,
    longitude: 73.8183,
    status: "Scheduled",
    created_by_user_id: 5,
    created_by_name: "Pooja Mehta",
    estimated_cost: 175000,
    created_at: "2026-10-08T15:20:00Z",
    updated_at: "2026-10-12T11:00:00Z",
    active_conflicts_count: 0
  },
  {
    id: 4,
    request_code: "REQ-2026-004",
    title: "Baner Road City Gas Distribution Network",
    department_id: 3,
    department_name: "MNGL Natural Gas Limited",
    department_code: "GAS",
    department_color: "#EA580C",
    road_id: 5,
    road_name: "Baner Road",
    locality: "Baner",
    work_type: "MDPE Gas Pipeline",
    reason_description: "Laying 125mm MDPE piped natural gas line to connect newly commissioned residential towers.",
    proposed_start_date: "2026-11-12",
    expected_duration_days: 6,
    proposed_end_date: "2026-11-17",
    excavation_length_meters: 220,
    excavation_depth_meters: 1.5,
    priority: "Medium",
    estimated_restoration_days: 2,
    contact_person: "Rajesh Sharma",
    contact_phone: "+91 20 2561 3003",
    latitude: 18.5590,
    longitude: 73.7868,
    status: "Submitted",
    created_by_user_id: 4,
    created_by_name: "Rajesh Sharma",
    estimated_cost: 210000,
    created_at: "2026-10-10T12:00:00Z",
    updated_at: "2026-10-10T12:00:00Z",
    active_conflicts_count: 0
  }
];

export const MOCK_CONFLICTS: ConflictMatch[] = [
  {
    id: 1,
    conflict_category: "Direct Trench Overlap & Temporal Collision",
    severity: "High",
    distance_meters: 38,
    days_difference: 2,
    matching_rule: "Rule 1: Spatial Proximity (<150m) & Overlapping Date Interval",
    explanation: "PMC Water Supply (REQ-2026-001) and MSEDCL Power (REQ-2026-002) plan excavation on the identical corridor segment of Central Avenue with overlapping schedules. Uncoordinated work will result in cutting the newly resurfaced asphalt twice.",
    recommended_action: "Consolidate into single shared trenching corridor (Oct 15–18, 2026) with lead utility PMC Water.",
    status: "Active",
    created_at: "2026-10-02T11:15:30Z",
    road_name: "Central Avenue (FC Road)",
    request_a: {
      id: 1,
      request_code: "REQ-2026-001",
      title: "FC Road Central Feeder Water Main",
      department_name: "PMC Water Supply Department",
      department_code: "WATER",
      department_color: "#2563EB",
      proposed_start_date: "2026-10-15",
      proposed_end_date: "2026-10-18",
      status: "Approved"
    },
    request_b: {
      id: 2,
      request_code: "REQ-2026-002",
      title: "11kV Underground Power Feeder",
      department_name: "MSEDCL Electricity Distribution",
      department_code: "ELECTRICITY",
      department_color: "#D97706",
      proposed_start_date: "2026-10-17",
      proposed_end_date: "2026-10-20",
      status: "Approved"
    }
  }
];

export const MOCK_PROPOSALS: CoordinationProposal[] = [
  {
    id: 1,
    proposal_code: "PROP-2026-001",
    title: "FC Road Unified Multi-Utility Trenching Schedule",
    primary_request_id: 1,
    secondary_request_id: 2,
    lead_department_id: 1,
    lead_department_name: "PMC Water Supply Department",
    proposed_start_date: "2026-10-15",
    proposed_end_date: "2026-10-18",
    combined_duration_days: 4,
    shared_excavation_window_desc: "Shared right-of-way window on FC Road. PMC Water opens deeper trench (1.8m) on Oct 15. MSEDCL lays upper electrical conduits (1.2m) on Oct 17. Single joint backfill and asphalt repaving executed Oct 18.",
    feasibility_score: 94,
    estimated_savings_inr: 38400,
    status: "Accepted by Departments",
    admin_decision_notes: "Recommended for formal municipal authorization. Saves ₹38,400 in civic asphalt fees and avoids 4 days of duplicate traffic diversion.",
    confirmed_schedule_id: 1,
    created_at: "2026-10-03T10:00:00Z",
    primary_request: MOCK_REQUESTS[0],
    secondary_request: MOCK_REQUESTS[1],
    decisions: [
      {
        id: 1,
        department_name: "PMC Water Supply Department",
        department_color: "#2563EB",
        user_name: "Er. Ramesh Deshmukh",
        decision: "Accept",
        comments: "Water department accepts lead role. Trench depth accommodates 300mm HDPE main with 600mm buffer for power ducts.",
        created_at: "2026-10-04T11:00:00Z"
      },
      {
        id: 2,
        department_name: "MSEDCL Electricity Distribution",
        department_color: "#D97706",
        user_name: "Er. Sandeep Kulkarni",
        decision: "Accept",
        comments: "Power distribution team aligns cable pulling crew to begin Oct 17. Shared trenching approved.",
        created_at: "2026-10-05T09:30:00Z"
      }
    ]
  }
];

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  total_requests: 15,
  requests_awaiting_approval: 3,
  active_conflicts: 1,
  coordination_opportunities: 4,
  active_excavation_projects: 5,
  projects_awaiting_restoration: 2,
  restoration_verified_count: 8,
  estimated_potential_savings_inr: 124500,
  department_breakdown: [
    { department_id: 1, department_name: "PMC Water Supply", department_code: "WATER", color: "#2563EB", count: 5 },
    { department_id: 2, department_name: "MSEDCL Electricity", department_code: "ELECTRICITY", color: "#D97706", count: 4 },
    { department_id: 3, department_name: "MNGL Natural Gas", department_code: "GAS", color: "#EA580C", count: 3 },
    { department_id: 4, department_name: "Telecom & OFC", department_code: "TELECOM", color: "#9333EA", count: 4 },
    { department_id: 5, department_name: "PMC Drainage", department_code: "SEWAGE", color: "#0284C7", count: 3 },
    { department_id: 6, department_name: "PMC Road Works", department_code: "ROAD", color: "#1E293B", count: 2 }
  ],
  status_breakdown: [
    { status: "Approved", count: 6 },
    { status: "Scheduled", count: 4 },
    { status: "In Progress", count: 2 },
    { status: "Submitted", count: 3 },
    { status: "Restoration Verified", count: 8 }
  ],
  recent_requests: MOCK_REQUESTS,
  recent_conflicts: MOCK_CONFLICTS,
  upcoming_schedules: [
    {
      id: 1,
      schedule_code: "SCH-2026-001",
      request_code: "REQ-2026-001 / REQ-2026-002",
      title: "FC Road Joint Utility Excavation Corridor",
      road_name: "Central Avenue (FC Road)",
      start_date: "2026-10-15T00:00:00",
      end_date: "2026-10-18T23:59:59",
      status: "Confirmed",
      traffic_advisory: "Northbound lane diversion between Goodluck Chowk and Ferguson College Gate. Speed limit 20 km/h."
    },
    {
      id: 2,
      schedule_code: "SCH-2026-002",
      request_code: "REQ-2026-003",
      title: "Karve Road 5G Optical Fiber Conduit Laying",
      road_name: "Karve Road",
      start_date: "2026-11-05T00:00:00",
      end_date: "2026-11-09T23:59:59",
      status: "Confirmed",
      traffic_advisory: "Night work only (11:00 PM to 05:00 AM). Minimal daytime traffic disturbance."
    }
  ],
  recent_notifications: [
    {
      id: 1,
      title: "Conflict Resolved into Shared Proposal",
      message: "Coordination proposal PROP-2026-001 accepted by Water and Electricity departments on FC Road.",
      type: "coordination",
      is_read: false,
      related_proposal_id: 1,
      created_at: "2026-10-05T10:00:00Z"
    },
    {
      id: 2,
      title: "Restoration Verified",
      message: "Road surface restoration on Senapati Bapat Road certified satisfactory by Municipal Road Inspector.",
      type: "restoration",
      is_read: true,
      related_request_id: 1,
      created_at: "2026-10-04T16:30:00Z"
    }
  ]
};

export const MOCK_RESTORATIONS: RestorationRecord[] = [
  {
    id: 1,
    request_id: 1,
    request_code: "REQ-2026-001",
    request_title: "FC Road Central Feeder Water Main Replacement",
    road_name: "Central Avenue (FC Road)",
    locality: "Shivaji Nagar",
    department_name: "PMC Water Supply Department",
    department_color: "#2563EB",
    completion_date: "2026-10-18",
    contractor_name: "M/s Shinde Infrastructure Pvt Ltd",
    road_surface_restored: "Dense Bituminous Macadam (DBM) + Bituminous Concrete (BC) 40mm overlay",
    restoration_quality_rating: 4.8,
    inspection_date: "2026-10-20",
    inspector_name: "Er. Aniruddha Pawaskar (PMC Road Dept)",
    verification_status: "Verified Satisfactory",
    verification_notes: "Core density test passed (98.5% compaction). Surface level flush with existing carriage way. Right of way reopened.",
    verified_by_name: "Er. Aniruddha Pawaskar",
    verified_at: "2026-10-20T16:00:00Z",
    created_at: "2026-10-18T18:00:00Z"
  }
];

export const MOCK_SHARED_RESOURCES: SharedResource[] = [
  {
    id: 1,
    department_id: 6,
    department_name: "PMC Road & Infrastructure Department",
    department_color: "#1E293B",
    resource_name: "JCB 3DX Heavy Excavator & Backhoe Loader",
    resource_type: "Heavy Machinery",
    quantity: "2 Units",
    availability_window_start: "2026-10-15",
    availability_window_end: "2026-10-25",
    contact_person: "Er. Nitin Jadhav (+91 20 2550 6007)",
    notes: "Available for pooled multi-agency trenching on central ward arterial roads.",
    created_at: "2026-10-01T10:00:00Z"
  },
  {
    id: 2,
    department_id: 2,
    department_name: "MSEDCL Electricity Distribution",
    department_color: "#D97706",
    resource_name: "Subsurface Ground Penetrating Radar (GPR) Utility Locator",
    resource_type: "Detection Equipment",
    quantity: "1 High-Precision Unit",
    availability_window_start: "2026-10-10",
    availability_window_end: "2026-11-30",
    contact_person: "Er. Sandeep Kulkarni (+91 20 2605 2002)",
    notes: "Detects live underground gas, water pipes, and cables before mechanical digging starts.",
    created_at: "2026-10-02T11:00:00Z"
  }
];
