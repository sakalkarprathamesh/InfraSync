from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import (
    ExcavationRequest, ConflictMatch, CoordinationProposal,
    RestorationRecord, Department, Schedule, Notification
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # 1. Total Requests
    total_requests = db.query(ExcavationRequest).count()

    # 2. Awaiting Approval (Submitted, Under Review)
    requests_awaiting_approval = db.query(ExcavationRequest).filter(
        ExcavationRequest.status.in_(["Submitted", "Under Review"])
    ).count()

    # 3. Detected Conflicts (Active)
    active_conflicts = db.query(ConflictMatch).filter(
        ConflictMatch.status == "Active"
    ).count()

    # 4. Coordination Opportunities (Proposals or high score opportunities)
    coordination_opportunities = db.query(CoordinationProposal).filter(
        CoordinationProposal.status.in_(["Draft", "Pending Review", "Accepted by Departments"])
    ).count()

    # 5. Active Excavation Projects (In Progress, Scheduled)
    active_excavation_projects = db.query(ExcavationRequest).filter(
        ExcavationRequest.status.in_(["In Progress", "Scheduled"])
    ).count()

    # 6. Projects Awaiting Restoration (Restoration Pending or Completed)
    projects_awaiting_restoration = db.query(ExcavationRequest).filter(
        ExcavationRequest.status.in_(["Restoration Pending", "Completed"])
    ).count()

    # 7. Restoration Verified Count
    restoration_verified_count = db.query(ExcavationRequest).filter(
        ExcavationRequest.status == "Restoration Verified"
    ).count()

    # 8. Estimated Potential Cost Savings
    proposals = db.query(CoordinationProposal).all()
    potential_savings = sum([p.estimated_savings_inr or 0.0 for p in proposals])

    # 9. Department-wise Breakdown
    dept_breakdown = []
    departments = db.query(Department).all()
    for d in departments:
        req_count = db.query(ExcavationRequest).filter(ExcavationRequest.department_id == d.id).count()
        dept_breakdown.append({
            "department_id": d.id,
            "department_name": d.name,
            "department_code": d.code,
            "color": d.color,
            "count": req_count
        })

    # 10. Status Breakdown
    status_counts = db.query(
        ExcavationRequest.status, func.count(ExcavationRequest.id)
    ).group_by(ExcavationRequest.status).all()
    status_breakdown = [{"status": s[0], "count": s[1]} for s in status_counts]

    # 11. Recent Requests
    recent_requests_query = db.query(ExcavationRequest).order_by(
        ExcavationRequest.created_at.desc()
    ).limit(6).all()
    recent_requests = []
    for r in recent_requests_query:
        recent_requests.append({
            "id": r.id,
            "request_code": r.request_code,
            "title": r.title,
            "department_name": r.department.name if r.department else "",
            "department_color": r.department.color if r.department else "#2563EB",
            "road_name": r.road.name if r.road else r.locality,
            "locality": r.locality,
            "priority": r.priority,
            "status": r.status,
            "start_date": r.proposed_start_date.isoformat(),
            "end_date": r.proposed_end_date.isoformat(),
            "created_at": r.created_at.isoformat()
        })

    # 12. Recent High-Priority Conflicts
    conflicts_query = db.query(ConflictMatch).filter(
        ConflictMatch.status == "Active"
    ).order_by(ConflictMatch.created_at.desc()).limit(5).all()
    recent_conflicts = []
    for c in conflicts_query:
        req_a = db.query(ExcavationRequest).filter(ExcavationRequest.id == c.request_a_id).first()
        req_b = db.query(ExcavationRequest).filter(ExcavationRequest.id == c.request_b_id).first()
        recent_conflicts.append({
            "id": c.id,
            "conflict_category": c.conflict_category,
            "severity": c.severity,
            "matching_rule": c.matching_rule,
            "explanation": c.explanation,
            "recommended_action": c.recommended_action,
            "road_name": req_a.road.name if req_a and req_a.road else "Corridor",
            "request_a": {
                "id": req_a.id if req_a else None,
                "code": req_a.request_code if req_a else "",
                "dept": req_a.department.name if req_a and req_a.department else "",
                "color": req_a.department.color if req_a and req_a.department else "#2563EB"
            },
            "request_b": {
                "id": req_b.id if req_b else None,
                "code": req_b.request_code if req_b else "",
                "dept": req_b.department.name if req_b and req_b.department else "",
                "color": req_b.department.color if req_b and req_b.department else "#D97706"
            }
        })

    # 13. Upcoming Excavations / Schedules
    schedules_query = db.query(Schedule).order_by(Schedule.confirmed_start_date.asc()).limit(5).all()
    upcoming_schedules = []
    for s in schedules_query:
        req = s.request
        upcoming_schedules.append({
            "id": s.id,
            "schedule_code": s.schedule_code,
            "request_code": req.request_code if req else "",
            "title": req.title if req else "",
            "road_name": req.road.name if req and req.road else "",
            "start_date": s.confirmed_start_date.isoformat(),
            "end_date": s.confirmed_end_date.isoformat(),
            "status": s.status,
            "traffic_advisory": s.traffic_advisory
        })

    # 14. Recent Notifications
    notifs_query = db.query(Notification).order_by(Notification.created_at.desc()).limit(6).all()
    recent_notifications = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
            "related_request_id": n.related_request_id,
            "related_proposal_id": n.related_proposal_id
        }
        for n in notifs_query
    ]

    return {
        "total_requests": total_requests,
        "requests_awaiting_approval": requests_awaiting_approval,
        "active_conflicts": active_conflicts,
        "coordination_opportunities": coordination_opportunities,
        "active_excavation_projects": active_excavation_projects,
        "projects_awaiting_restoration": projects_awaiting_restoration,
        "restoration_verified_count": restoration_verified_count,
        "estimated_potential_savings_inr": potential_savings,
        "department_breakdown": dept_breakdown,
        "status_breakdown": status_breakdown,
        "recent_requests": recent_requests,
        "recent_conflicts": recent_conflicts,
        "upcoming_schedules": upcoming_schedules,
        "recent_notifications": recent_notifications
    }
