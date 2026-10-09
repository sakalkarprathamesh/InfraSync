import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, Date, DateTime,
    ForeignKey, Table, Enum
)
from sqlalchemy.orm import relationship
from .database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True)
    code = Column(String(50), nullable=False, unique=True)  # WATER, ELECTRICITY, GAS, TELECOM, SEWAGE, ROAD
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    color = Column(String(20), nullable=False, default="#2563EB")  # Hex color for badges and map markers
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="department")
    requests = relationship("ExcavationRequest", back_populates="department")
    shared_resources = relationship("SharedResource", back_populates="department")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # admin, department_user, viewer
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    designation = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    department = relationship("Department", back_populates="users")
    requests_created = relationship("ExcavationRequest", back_populates="created_by")
    status_history_entries = relationship("StatusHistory", back_populates="changed_by")
    notifications = relationship("Notification", back_populates="user")
    discussions = relationship("ProjectDiscussion", back_populates="user")


class Road(Base):
    __tablename__ = "roads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    road_code = Column(String(50), nullable=False, unique=True)
    locality = Column(String(100), nullable=False, index=True)
    ward = Column(String(100), nullable=False)
    length_km = Column(Float, nullable=False, default=1.0)
    surface_type = Column(String(50), default="Asphalt")  # Asphalt, Concrete, Paver Blocks
    importance_tier = Column(String(50), default="Tier 1 Major Arterial")  # Tier 1, Tier 2, Local
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    requests = relationship("ExcavationRequest", back_populates="road")


class ExcavationRequest(Base):
    __tablename__ = "excavation_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(50), nullable=False, unique=True, index=True)
    title = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    road_id = Column(Integer, ForeignKey("roads.id"), nullable=False)
    locality = Column(String(100), nullable=False)
    work_type = Column(String(100), nullable=False)  # Water Pipeline, Cable Installation, Gas Pipeline, Sewage Repair, Drainage, Road Maintenance, Emergency
    reason_description = Column(Text, nullable=False)
    
    proposed_start_date = Column(Date, nullable=False)
    expected_duration_days = Column(Integer, nullable=False)
    proposed_end_date = Column(Date, nullable=False)
    
    excavation_length_meters = Column(Float, nullable=False, default=10.0)
    excavation_depth_meters = Column(Float, nullable=False, default=1.5)
    priority = Column(String(50), nullable=False, default="Medium")  # Low, Medium, High, Emergency
    estimated_restoration_days = Column(Integer, nullable=False, default=2)
    
    contact_person = Column(String(100), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    supporting_notes = Column(Text, nullable=True)
    
    status = Column(String(50), nullable=False, default="Draft")
    # Allowed statuses: Draft, Submitted, Under Review, Approved, Scheduled, In Progress, Completed, Restoration Pending, Restoration Verified, Returned, Rejected, On Hold
    
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    estimated_cost = Column(Float, nullable=True, default=50000.0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    department = relationship("Department", back_populates="requests")
    road = relationship("Road", back_populates="requests")
    created_by = relationship("User", back_populates="requests_created")
    
    status_history = relationship("StatusHistory", back_populates="request", cascade="all, delete-orphan")
    restoration_record = relationship("RestorationRecord", back_populates="request", uselist=False, cascade="all, delete-orphan")
    discussions = relationship("ProjectDiscussion", back_populates="request", cascade="all, delete-orphan")
    schedules = relationship("Schedule", back_populates="request", cascade="all, delete-orphan")


class ConflictMatch(Base):
    __tablename__ = "conflict_matches"

    id = Column(Integer, primary_key=True, index=True)
    request_a_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    request_b_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    
    conflict_category = Column(String(100), nullable=False)
    # Direct Spatial & Temporal Overlap, Potential Coordination Opportunity, Nearby Sequential Excavation, Emergency Priority Warning
    severity = Column(String(50), nullable=False)  # High, Medium, Low, Advisory
    distance_meters = Column(Float, nullable=False, default=0.0)
    days_difference = Column(Integer, nullable=False, default=0)
    
    matching_rule = Column(String(150), nullable=False)
    explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String(50), default="Active")  # Active, Resolved, Coordinated, Dismissed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    request_a = relationship("ExcavationRequest", foreign_keys=[request_a_id])
    request_b = relationship("ExcavationRequest", foreign_keys=[request_b_id])


class CoordinationProposal(Base):
    __tablename__ = "coordination_proposals"

    id = Column(Integer, primary_key=True, index=True)
    proposal_code = Column(String(50), nullable=False, unique=True, index=True)
    title = Column(String(255), nullable=False)
    lead_department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    
    primary_request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    secondary_request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    
    proposed_start_date = Column(Date, nullable=False)
    proposed_end_date = Column(Date, nullable=False)
    combined_duration_days = Column(Integer, nullable=False)
    shared_excavation_window_desc = Column(Text, nullable=False)
    
    feasibility_score = Column(Float, nullable=False, default=85.0)  # 0 to 100
    estimated_savings_inr = Column(Float, nullable=True, default=45000.0)
    
    status = Column(String(50), nullable=False, default="Pending Review")
    # Draft, Pending Review, Accepted by Departments, Confirmed by Admin, Rejected, Cancelled
    
    admin_decision_notes = Column(Text, nullable=True)
    confirmed_schedule_id = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    primary_request = relationship("ExcavationRequest", foreign_keys=[primary_request_id])
    secondary_request = relationship("ExcavationRequest", foreign_keys=[secondary_request_id])
    lead_department = relationship("Department", foreign_keys=[lead_department_id])
    decisions = relationship("CoordinationDecision", back_populates="proposal", cascade="all, delete-orphan")
    discussions = relationship("ProjectDiscussion", back_populates="proposal", cascade="all, delete-orphan")


class CoordinationDecision(Base):
    __tablename__ = "coordination_decisions"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("coordination_proposals.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    decision = Column(String(50), nullable=False)  # Accept, Reject, Request Changes
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    proposal = relationship("CoordinationProposal", back_populates="decisions")
    department = relationship("Department")
    user = relationship("User")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    schedule_code = Column(String(50), nullable=False, unique=True, index=True)
    request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    coordination_proposal_id = Column(Integer, ForeignKey("coordination_proposals.id"), nullable=True)
    
    confirmed_start_date = Column(Date, nullable=False)
    confirmed_end_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default="Scheduled")  # Scheduled, Active, Completed, Rescheduled
    traffic_advisory = Column(Text, nullable=True)
    
    confirmed_by_admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    confirmed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    request = relationship("ExcavationRequest", back_populates="schedules")
    confirmed_by = relationship("User")


class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False)
    from_status = Column(String(50), nullable=False)
    to_status = Column(String(50), nullable=False)
    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    request = relationship("ExcavationRequest", back_populates="status_history")
    changed_by = relationship("User", back_populates="status_history_entries")


class RestorationRecord(Base):
    __tablename__ = "restoration_records"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=False, unique=True)
    
    completion_date = Column(Date, nullable=False)
    contractor_name = Column(String(150), nullable=False)
    road_surface_restored = Column(String(100), nullable=False)  # Bituminous, Concrete Paving, Cold Mix
    restoration_quality_rating = Column(Integer, nullable=True)  # 1 to 5 stars
    
    inspection_date = Column(Date, nullable=True)
    inspector_name = Column(String(100), nullable=True)
    verification_status = Column(String(50), nullable=False, default="Pending Inspection")
    # Pending Inspection, Verified Satisfactory, Rework Required
    
    verification_notes = Column(Text, nullable=True)
    verified_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    request = relationship("ExcavationRequest", back_populates="restoration_record")
    verified_by = relationship("User")


class ProjectDiscussion(Base):
    __tablename__ = "project_discussions"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("excavation_requests.id"), nullable=True)
    coordination_proposal_id = Column(Integer, ForeignKey("coordination_proposals.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    message = Column(Text, nullable=False)
    is_coordination_note = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    request = relationship("ExcavationRequest", back_populates="discussions")
    proposal = relationship("CoordinationProposal", back_populates="discussions")
    user = relationship("User", back_populates="discussions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    related_request_id = Column(Integer, nullable=True)
    related_proposal_id = Column(Integer, nullable=True)
    type = Column(String(50), nullable=False, default="INFO")
    # CONFLICT, APPROVAL, PROPOSAL, DECISION, SCHEDULE, RESTORATION, INFO
    
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")


class SharedResource(Base):
    __tablename__ = "shared_resources"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    resource_name = Column(String(150), nullable=False)
    resource_type = Column(String(100), nullable=False)  # Machinery, Work Crew, Technical Personnel, Inspection Support, Restoration Team
    quantity = Column(String(50), nullable=False)
    
    availability_window_start = Column(Date, nullable=False)
    availability_window_end = Column(Date, nullable=False)
    contact_person = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    department = relationship("Department", back_populates="shared_resources")
