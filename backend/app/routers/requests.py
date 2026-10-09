import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    ExcavationRequest, Road, Department, User,
    ConflictMatch, StatusHistory, RestorationRecord, Notification
)
from ..schemas import (
    ExcavationRequestCreate, ExcavationRequestUpdate,
    ReviewPayload, StatusUpdatePayload
)
from ..auth import get_current_user, require_department_user, require_admin
from ..conflict_engine import detect_conflicts_for_request

router = APIRouter(prefix="/requests", tags=["Excavation Requests"])

@router.get("")
def list_requests(
    department_id: Optional[int] = Query(None),
    road_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    work_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ExcavationRequest)
    
    if department_id:
        query = query.filter(ExcavationRequest.department_id == department_id)
    if road_id:
        query = query.filter(ExcavationRequest.road_id == road_id)
    if status and status != "All":
        query = query.filter(ExcavationRequest.status == status)
    if priority and priority != "All":
        query = query.filter(ExcavationRequest.priority == priority)
    if work_type and work_type != "All":
        query = query.filter(ExcavationRequest.work_type == work_type)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (ExcavationRequest.title.ilike(search_filter)) |
            (ExcavationRequest.request_code.ilike(search_filter)) |
            (ExcavationRequest.locality.ilike(search_filter))
        )

    requests = query.order_by(ExcavationRequest.created_at.desc()).all()
    
    result = []
    for r in requests:
        active_conflicts = db.query(ConflictMatch).filter(
            ((ConflictMatch.request_a_id == r.id) | (ConflictMatch.request_b_id == r.id)),
            ConflictMatch.status == "Active"
        ).count()
        
        result.append({
            "id": r.id,
            "request_code": r.request_code,
            "title": r.title,
            "department_id": r.department_id,
            "department_name": r.department.name if r.department else "",
            "department_code": r.department.code if r.department else "",
            "department_color": r.department.color if r.department else "#2563EB",
            "road_id": r.road_id,
            "road_name": r.road.name if r.road else "",
            "locality": r.locality,
            "work_type": r.work_type,
            "reason_description": r.reason_description,
            "proposed_start_date": r.proposed_start_date.isoformat(),
            "expected_duration_days": r.expected_duration_days,
            "proposed_end_date": r.proposed_end_date.isoformat(),
            "excavation_length_meters": r.excavation_length_meters,
            "excavation_depth_meters": r.excavation_depth_meters,
            "priority": r.priority,
            "estimated_restoration_days": r.estimated_restoration_days,
            "contact_person": r.contact_person,
            "contact_phone": r.contact_phone,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "supporting_notes": r.supporting_notes,
            "status": r.status,
            "created_by_user_id": r.created_by_user_id,
            "created_by_name": r.created_by.name if r.created_by else "",
            "estimated_cost": r.estimated_cost,
            "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat(),
            "active_conflicts_count": active_conflicts
        })
    return result

@router.post("", status_code=status.HTTP_201_CREATED)
def create_request(
    payload: ExcavationRequestCreate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    # Enforce department consistency for department_users
    if current_user.role == "department_user" and current_user.department_id != payload.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot submit excavation request on behalf of another department."
        )

    # Validate road exists
    road = db.query(Road).filter(Road.id == payload.road_id).first()
    if not road:
        raise HTTPException(status_code=400, detail="Invalid road_id specified.")

    # Calculate proposed end date
    proposed_end = payload.proposed_start_date + datetime.timedelta(days=payload.expected_duration_days - 1)

    # Generate sequential unique request code
    total_count = db.query(ExcavationRequest).count()
    request_code = f"REQ-2026-{str(total_count + 1).zfill(3)}"

    new_request = ExcavationRequest(
        request_code=request_code,
        title=payload.title,
        department_id=payload.department_id,
        road_id=payload.road_id,
        locality=payload.locality,
        work_type=payload.work_type,
        reason_description=payload.reason_description,
        proposed_start_date=payload.proposed_start_date,
        expected_duration_days=payload.expected_duration_days,
        proposed_end_date=proposed_end,
        excavation_length_meters=payload.excavation_length_meters,
        excavation_depth_meters=payload.excavation_depth_meters,
        priority=payload.priority,
        estimated_restoration_days=payload.estimated_restoration_days,
        contact_person=payload.contact_person,
        contact_phone=payload.contact_phone,
        latitude=payload.latitude,
        longitude=payload.longitude,
        supporting_notes=payload.supporting_notes,
        status="Submitted",  # Directly submitted or draft
        created_by_user_id=current_user.id,
        estimated_cost=payload.estimated_cost or 50000.0
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # Log initial status history
    history = StatusHistory(
        request_id=new_request.id,
        from_status="None",
        to_status="Submitted",
        changed_by_user_id=current_user.id,
        notes="Excavation request submitted into Infrasync registry."
    )
    db.add(history)
    db.commit()

    # Trigger real-time deterministic conflict detection
    conflicts = detect_conflicts_for_request(new_request, db, auto_save=True)

    # Generate notification for admin
    notif = Notification(
        user_id=None,
        department_id=6,  # Municipal Road Dept
        title=f"New Excavation Request: {new_request.request_code}",
        message=f"{new_request.department.name} submitted '{new_request.title}' on {road.name}. {len(conflicts)} potential conflict(s) detected.",
        related_request_id=new_request.id,
        type="INFO"
    )
    db.add(notif)
    db.commit()

    return {
        "message": "Excavation request created and analyzed successfully.",
        "request_id": new_request.id,
        "request_code": new_request.request_code,
        "conflicts_detected": len(conflicts)
    }

@router.get("/{id}")
def get_request_detail(id: int, db: Session = Depends(get_db)):
    r = db.query(ExcavationRequest).filter(ExcavationRequest.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Excavation request not found.")

    # Fetch conflicts
    conflicts_query = db.query(ConflictMatch).filter(
        ((ConflictMatch.request_a_id == r.id) | (ConflictMatch.request_b_id == r.id)),
        ConflictMatch.status == "Active"
    ).all()
    
    conflicts_list = []
    for c in conflicts_query:
        other_id = c.request_b_id if c.request_a_id == r.id else c.request_a_id
        other_req = db.query(ExcavationRequest).filter(ExcavationRequest.id == other_id).first()
        conflicts_list.append({
            "id": c.id,
            "conflict_category": c.conflict_category,
            "severity": c.severity,
            "matching_rule": c.matching_rule,
            "distance_meters": c.distance_meters,
            "days_difference": c.days_difference,
            "explanation": c.explanation,
            "recommended_action": c.recommended_action,
            "status": c.status,
            "conflicting_request": {
                "id": other_req.id if other_req else None,
                "request_code": other_req.request_code if other_req else "",
                "title": other_req.title if other_req else "",
                "department_name": other_req.department.name if other_req and other_req.department else "",
                "department_color": other_req.department.color if other_req and other_req.department else "#2563EB",
                "proposed_start_date": other_req.proposed_start_date.isoformat() if other_req else "",
                "proposed_end_date": other_req.proposed_end_date.isoformat() if other_req else "",
                "status": other_req.status if other_req else ""
            }
        })

    # Fetch status history
    history_records = db.query(StatusHistory).filter(
        StatusHistory.request_id == r.id
    ).order_by(StatusHistory.created_at.asc()).all()
    history_list = [
        {
            "id": h.id,
            "from_status": h.from_status,
            "to_status": h.to_status,
            "changed_by": h.changed_by.name if h.changed_by else "System",
            "notes": h.notes,
            "created_at": h.created_at.isoformat()
        }
        for h in history_records
    ]

    # Fetch restoration record if exists
    restoration_data = None
    if r.restoration_record:
        rr = r.restoration_record
        restoration_data = {
            "id": rr.id,
            "completion_date": rr.completion_date.isoformat(),
            "contractor_name": rr.contractor_name,
            "road_surface_restored": rr.road_surface_restored,
            "restoration_quality_rating": rr.restoration_quality_rating,
            "inspection_date": rr.inspection_date.isoformat() if rr.inspection_date else None,
            "inspector_name": rr.inspector_name,
            "verification_status": rr.verification_status,
            "verification_notes": rr.verification_notes,
            "verified_by": rr.verified_by.name if rr.verified_by else None,
            "verified_at": rr.verified_at.isoformat() if rr.verified_at else None
        }

    return {
        "id": r.id,
        "request_code": r.request_code,
        "title": r.title,
        "department_id": r.department_id,
        "department_name": r.department.name if r.department else "",
        "department_code": r.department.code if r.department else "",
        "department_color": r.department.color if r.department else "#2563EB",
        "road_id": r.road_id,
        "road_name": r.road.name if r.road else "",
        "road_code": r.road.road_code if r.road else "",
        "locality": r.locality,
        "work_type": r.work_type,
        "reason_description": r.reason_description,
        "proposed_start_date": r.proposed_start_date.isoformat(),
        "expected_duration_days": r.expected_duration_days,
        "proposed_end_date": r.proposed_end_date.isoformat(),
        "excavation_length_meters": r.excavation_length_meters,
        "excavation_depth_meters": r.excavation_depth_meters,
        "priority": r.priority,
        "estimated_restoration_days": r.estimated_restoration_days,
        "contact_person": r.contact_person,
        "contact_phone": r.contact_phone,
        "latitude": r.latitude,
        "longitude": r.longitude,
        "supporting_notes": r.supporting_notes,
        "status": r.status,
        "created_by_user_id": r.created_by_user_id,
        "created_by_name": r.created_by.name if r.created_by else "",
        "estimated_cost": r.estimated_cost,
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat(),
        "conflicts": conflicts_list,
        "status_history": history_list,
        "restoration": restoration_data
    }

@router.patch("/{id}")
def update_request(
    id: int,
    payload: ExcavationRequestUpdate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    r = db.query(ExcavationRequest).filter(ExcavationRequest.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found.")

    # Permissions check: only creator department or admin can edit
    if current_user.role == "department_user" and r.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Unauthorized to edit another department's request.")

    if r.status not in ["Draft", "Submitted", "Returned"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot edit request in '{r.status}' state. Only Draft, Submitted, or Returned requests are editable."
        )

    # Apply updates
    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(r, field, val)

    # Recalculate end date if start date or duration changed
    if payload.proposed_start_date or payload.expected_duration_days:
        r.proposed_end_date = r.proposed_start_date + datetime.timedelta(days=r.expected_duration_days - 1)

    r.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(r)

    # Re-run conflict detection
    detect_conflicts_for_request(r, db, auto_save=True)

    return {"message": "Request updated successfully", "request_id": r.id}

@router.post("/{id}/review")
def review_request(
    id: int,
    payload: ReviewPayload,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    r = db.query(ExcavationRequest).filter(ExcavationRequest.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found.")

    old_status = r.status
    action_map = {
        "approve": "Approved",
        "reject": "Rejected",
        "return": "Returned",
        "hold": "On Hold"
    }
    new_status = action_map[payload.action]
    r.status = new_status
    r.updated_at = datetime.datetime.utcnow()
    db.commit()

    # Log history
    history = StatusHistory(
        request_id=r.id,
        from_status=old_status,
        to_status=new_status,
        changed_by_user_id=current_user.id,
        notes=payload.notes or f"Administrative review decision: {new_status}"
    )
    db.add(history)

    # Notification for department
    notif = Notification(
        user_id=r.created_by_user_id,
        department_id=r.department_id,
        title=f"Request {r.request_code}: {new_status}",
        message=f"Administrator has set status to {new_status}. Notes: {payload.notes or 'None'}",
        related_request_id=r.id,
        type="APPROVAL"
    )
    db.add(notif)
    db.commit()

    return {"message": f"Request status updated to {new_status}", "new_status": new_status}

@router.post("/{id}/status")
def update_project_status(
    id: int,
    payload: StatusUpdatePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    r = db.query(ExcavationRequest).filter(ExcavationRequest.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found.")

    # Department or Admin
    if current_user.role == "viewer":
        raise HTTPException(status_code=403, detail="Viewers cannot change project statuses.")
    if current_user.role == "department_user" and r.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Cannot alter status for another department's project.")

    old_status = r.status
    r.status = payload.status
    r.updated_at = datetime.datetime.utcnow()
    db.commit()

    history = StatusHistory(
        request_id=r.id,
        from_status=old_status,
        to_status=payload.status,
        changed_by_user_id=current_user.id,
        notes=payload.notes or f"Project progressed to {payload.status}"
    )
    db.add(history)
    db.commit()

    return {"message": f"Status updated to {payload.status}", "status": payload.status}
