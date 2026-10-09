import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# ----------------- Auth & User Schemas -----------------
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    department_id: Optional[int] = None
    designation: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime
    department_name: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- Department Schemas -----------------
class DepartmentBase(BaseModel):
    name: str
    code: str
    contact_person: str
    phone: str
    email: str
    color: str
    description: Optional[str] = None

class DepartmentOut(DepartmentBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Road Schemas -----------------
class RoadBase(BaseModel):
    name: str
    road_code: str
    locality: str
    ward: str
    length_km: float
    surface_type: str
    importance_tier: str
    latitude: float
    longitude: float

class RoadOut(RoadBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Excavation Request Schemas -----------------
class ExcavationRequestCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    department_id: int
    road_id: int
    locality: str
    work_type: str
    reason_description: str = Field(..., min_length=10)
    proposed_start_date: datetime.date
    expected_duration_days: int = Field(..., gt=0, le=365)
    excavation_length_meters: float = Field(..., gt=0)
    excavation_depth_meters: float = Field(..., gt=0)
    priority: str = Field("Medium", pattern="^(Low|Medium|High|Emergency)$")
    estimated_restoration_days: int = Field(2, ge=1)
    contact_person: str
    contact_phone: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    supporting_notes: Optional[str] = None
    estimated_cost: Optional[float] = 50000.0

class ExcavationRequestUpdate(BaseModel):
    title: Optional[str] = None
    road_id: Optional[int] = None
    locality: Optional[str] = None
    work_type: Optional[str] = None
    reason_description: Optional[str] = None
    proposed_start_date: Optional[datetime.date] = None
    expected_duration_days: Optional[int] = None
    excavation_length_meters: Optional[float] = None
    excavation_depth_meters: Optional[float] = None
    priority: Optional[str] = None
    estimated_restoration_days: Optional[int] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    supporting_notes: Optional[str] = None
    estimated_cost: Optional[float] = None

class StatusUpdatePayload(BaseModel):
    status: str
    notes: Optional[str] = None

class ReviewPayload(BaseModel):
    action: str = Field(..., pattern="^(approve|reject|return|hold)$")
    notes: Optional[str] = None

class ExcavationRequestOut(BaseModel):
    id: int
    request_code: str
    title: str
    department_id: int
    road_id: int
    locality: str
    work_type: str
    reason_description: str
    proposed_start_date: datetime.date
    expected_duration_days: int
    proposed_end_date: datetime.date
    excavation_length_meters: float
    excavation_depth_meters: float
    priority: str
    estimated_restoration_days: int
    contact_person: str
    contact_phone: str
    latitude: float
    longitude: float
    supporting_notes: Optional[str] = None
    status: str
    created_by_user_id: int
    estimated_cost: Optional[float] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    # Nested fields
    department_name: Optional[str] = None
    department_code: Optional[str] = None
    department_color: Optional[str] = None
    road_name: Optional[str] = None
    created_by_name: Optional[str] = None
    active_conflicts_count: Optional[int] = 0

    class Config:
        from_attributes = True

# ----------------- Conflict Schemas -----------------
class ConflictMatchOut(BaseModel):
    id: int
    request_a_id: int
    request_b_id: int
    conflict_category: str
    severity: str
    distance_meters: float
    days_difference: int
    matching_rule: str
    explanation: str
    recommended_action: str
    status: str
    created_at: datetime.datetime
    
    # Nested request previews
    request_a_code: Optional[str] = None
    request_a_title: Optional[str] = None
    request_a_dept: Optional[str] = None
    request_a_dates: Optional[str] = None
    
    request_b_code: Optional[str] = None
    request_b_title: Optional[str] = None
    request_b_dept: Optional[str] = None
    request_b_dates: Optional[str] = None
    
    road_name: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- Coordination Proposal Schemas -----------------
class CoordinationProposalCreate(BaseModel):
    title: str
    primary_request_id: int
    secondary_request_id: int
    lead_department_id: int
    proposed_start_date: datetime.date
    proposed_end_date: datetime.date
    combined_duration_days: int
    shared_excavation_window_desc: str
    feasibility_score: float = 85.0
    estimated_savings_inr: float = 40000.0

class CoordinationDecisionCreate(BaseModel):
    decision: str = Field(..., pattern="^(Accept|Reject|Request Changes)$")
    comments: Optional[str] = None

class CoordinationConfirmPayload(BaseModel):
    confirmed_start_date: datetime.date
    confirmed_end_date: datetime.date
    admin_notes: Optional[str] = None
    traffic_advisory: Optional[str] = None

class CoordinationProposalOut(BaseModel):
    id: int
    proposal_code: str
    title: str
    primary_request_id: int
    secondary_request_id: int
    lead_department_id: int
    lead_department_name: Optional[str] = None
    proposed_start_date: datetime.date
    proposed_end_date: datetime.date
    combined_duration_days: int
    shared_excavation_window_desc: str
    feasibility_score: float
    estimated_savings_inr: Optional[float] = None
    status: str
    admin_decision_notes: Optional[str] = None
    confirmed_schedule_id: Optional[int] = None
    created_at: datetime.datetime
    
    primary_request: Optional[ExcavationRequestOut] = None
    secondary_request: Optional[ExcavationRequestOut] = None
    decisions: Optional[List[dict]] = []

    class Config:
        from_attributes = True

# ----------------- Schedule Schemas -----------------
class ScheduleOut(BaseModel):
    id: int
    schedule_code: str
    request_id: int
    coordination_proposal_id: Optional[int] = None
    confirmed_start_date: datetime.date
    confirmed_end_date: datetime.date
    status: str
    traffic_advisory: Optional[str] = None
    confirmed_by_admin_id: int
    confirmed_by_name: Optional[str] = None
    confirmed_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Restoration Record Schemas -----------------
class RestorationRecordCreate(BaseModel):
    request_id: int
    completion_date: datetime.date
    contractor_name: str
    road_surface_restored: str
    restoration_quality_rating: Optional[int] = Field(None, ge=1, le=5)

class RestorationVerifyPayload(BaseModel):
    verification_status: str = Field(..., pattern="^(Verified Satisfactory|Rework Required)$")
    inspection_date: datetime.date
    inspector_name: str
    verification_notes: Optional[str] = None

class RestorationRecordOut(BaseModel):
    id: int
    request_id: int
    completion_date: datetime.date
    contractor_name: str
    road_surface_restored: str
    restoration_quality_rating: Optional[int] = None
    inspection_date: Optional[datetime.date] = None
    inspector_name: Optional[str] = None
    verification_status: str
    verification_notes: Optional[str] = None
    verified_by_user_id: Optional[int] = None
    verified_by_name: Optional[str] = None
    verified_at: Optional[datetime.datetime] = None
    created_at: datetime.datetime
    
    request_code: Optional[str] = None
    request_title: Optional[str] = None
    road_name: Optional[str] = None
    department_name: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- Discussion Schemas -----------------
class DiscussionCreate(BaseModel):
    request_id: Optional[int] = None
    coordination_proposal_id: Optional[int] = None
    message: str = Field(..., min_length=2)
    is_coordination_note: bool = False

class DiscussionOut(BaseModel):
    id: int
    request_id: Optional[int] = None
    coordination_proposal_id: Optional[int] = None
    user_id: int
    user_name: Optional[str] = None
    user_department: Optional[str] = None
    message: str
    is_coordination_note: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Notification Schemas -----------------
class NotificationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    department_id: Optional[int] = None
    title: str
    message: str
    related_request_id: Optional[int] = None
    related_proposal_id: Optional[int] = None
    type: str
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Shared Resource Schemas -----------------
class SharedResourceCreate(BaseModel):
    department_id: int
    resource_name: str
    resource_type: str
    quantity: str
    availability_window_start: datetime.date
    availability_window_end: datetime.date
    contact_person: str
    notes: Optional[str] = None

class SharedResourceOut(BaseModel):
    id: int
    department_id: int
    department_name: Optional[str] = None
    resource_name: str
    resource_type: str
    quantity: str
    availability_window_start: datetime.date
    availability_window_end: datetime.date
    contact_person: str
    notes: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ----------------- Dashboard & Analytics Schemas -----------------
class DashboardSummary(BaseModel):
    total_requests: int
    requests_awaiting_approval: int
    active_conflicts: int
    coordination_opportunities: int
    active_excavation_projects: int
    projects_awaiting_restoration: int
    restoration_verified_count: int
    estimated_potential_savings_inr: float
    department_breakdown: List[dict]
    recent_requests: List[dict]
    recent_conflicts: List[dict]
    upcoming_schedules: List[dict]
    recent_notifications: List[dict]
