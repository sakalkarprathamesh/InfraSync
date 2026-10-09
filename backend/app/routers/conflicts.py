from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ConflictMatch, ExcavationRequest
from ..conflict_engine import detect_conflicts_for_request

router = APIRouter(prefix="/conflicts", tags=["Conflict Detection"])

@router.get("")
def list_conflicts(
    status: Optional[str] = Query("Active"),
    severity: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    road_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ConflictMatch)
    if status and status != "All":
        query = query.filter(ConflictMatch.status == status)
    if severity and severity != "All":
        query = query.filter(ConflictMatch.severity == severity)
    if category and category != "All":
        query = query.filter(ConflictMatch.conflict_category == category)

    conflicts = query.order_by(ConflictMatch.created_at.desc()).all()
    
    result = []
    for c in conflicts:
        req_a = db.query(ExcavationRequest).filter(ExcavationRequest.id == c.request_a_id).first()
        req_b = db.query(ExcavationRequest).filter(ExcavationRequest.id == c.request_b_id).first()
        
        if road_id:
            if not ((req_a and req_a.road_id == road_id) or (req_b and req_b.road_id == road_id)):
                continue

        result.append({
            "id": c.id,
            "conflict_category": c.conflict_category,
            "severity": c.severity,
            "distance_meters": c.distance_meters,
            "days_difference": c.days_difference,
            "matching_rule": c.matching_rule,
            "explanation": c.explanation,
            "recommended_action": c.recommended_action,
            "status": c.status,
            "created_at": c.created_at.isoformat(),
            "road_name": req_a.road.name if req_a and req_a.road else (req_b.road.name if req_b and req_b.road else "Road"),
            "request_a": {
                "id": req_a.id if req_a else None,
                "request_code": req_a.request_code if req_a else "",
                "title": req_a.title if req_a else "",
                "department_name": req_a.department.name if req_a and req_a.department else "",
                "department_code": req_a.department.code if req_a and req_a.department else "",
                "department_color": req_a.department.color if req_a and req_a.department else "#2563EB",
                "proposed_start_date": req_a.proposed_start_date.isoformat() if req_a else "",
                "proposed_end_date": req_a.proposed_end_date.isoformat() if req_a else "",
                "status": req_a.status if req_a else ""
            },
            "request_b": {
                "id": req_b.id if req_b else None,
                "request_code": req_b.request_code if req_b else "",
                "title": req_b.title if req_b else "",
                "department_name": req_b.department.name if req_b and req_b.department else "",
                "department_code": req_b.department.code if req_b and req_b.department else "",
                "department_color": req_b.department.color if req_b and req_b.department else "#D97706",
                "proposed_start_date": req_b.proposed_start_date.isoformat() if req_b else "",
                "proposed_end_date": req_b.proposed_end_date.isoformat() if req_b else "",
                "status": req_b.status if req_b else ""
            }
        })
    return result

@router.post("/analyze")
def trigger_conflict_analysis(db: Session = Depends(get_db)):
    """Re-analyzes all submitted/approved/scheduled requests in system."""
    active_requests = db.query(ExcavationRequest).filter(
        ExcavationRequest.status.in_(["Submitted", "Under Review", "Approved", "Scheduled", "In Progress"])
    ).all()
    
    total_found = 0
    for req in active_requests:
        matches = detect_conflicts_for_request(req, db, auto_save=True)
        total_found += len(matches)
        
    return {
        "message": f"Conflict analysis completed across {len(active_requests)} active projects.",
        "active_conflicts_count": total_found
    }

@router.post("/{id}/resolve")
def resolve_conflict(id: int, status_val: str = "Resolved", db: Session = Depends(get_db)):
    c = db.query(ConflictMatch).filter(ConflictMatch.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Conflict not found.")
    c.status = status_val
    db.commit()
    return {"message": f"Conflict marked as {status_val}."}
