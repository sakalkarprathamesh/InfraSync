import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import RestorationRecord, ExcavationRequest, User, StatusHistory, Notification
from ..schemas import RestorationRecordCreate, RestorationVerifyPayload
from ..auth import get_current_user, require_admin, require_department_user

router = APIRouter(prefix="/restoration", tags=["Road Restoration"])

@router.get("/records")
def list_restoration_records(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RestorationRecord)
    if status_filter and status_filter != "All":
        query = query.filter(RestorationRecord.verification_status == status_filter)
    records = query.order_by(RestorationRecord.created_at.desc()).all()

    results = []
    for r in records:
        req = r.request
        results.append({
            "id": r.id,
            "request_id": r.request_id,
            "request_code": req.request_code if req else "",
            "request_title": req.title if req else "",
            "road_name": req.road.name if req and req.road else "",
            "locality": req.locality if req else "",
            "department_name": req.department.name if req and req.department else "",
            "department_color": req.department.color if req and req.department else "#2563EB",
            "completion_date": r.completion_date.isoformat(),
            "contractor_name": r.contractor_name,
            "road_surface_restored": r.road_surface_restored,
            "restoration_quality_rating": r.restoration_quality_rating,
            "inspection_date": r.inspection_date.isoformat() if r.inspection_date else None,
            "inspector_name": r.inspector_name,
            "verification_status": r.verification_status,
            "verification_notes": r.verification_notes,
            "verified_by_name": r.verified_by.name if r.verified_by else None,
            "verified_at": r.verified_at.isoformat() if r.verified_at else None,
            "created_at": r.created_at.isoformat()
        })
    return results

@router.post("/record", status_code=status.HTTP_201_CREATED)
def record_excavation_completion(
    payload: RestorationRecordCreate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    """
    Department records that civil excavation and backfilling is complete,
    moving project status to 'Restoration Pending'.
    """
    req = db.query(ExcavationRequest).filter(ExcavationRequest.id == payload.request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found.")

    # Check if restoration record already exists
    existing = db.query(RestorationRecord).filter(RestorationRecord.request_id == req.id).first()
    if existing:
        existing.completion_date = payload.completion_date
        existing.contractor_name = payload.contractor_name
        existing.road_surface_restored = payload.road_surface_restored
        existing.restoration_quality_rating = payload.restoration_quality_rating
        rec = existing
    else:
        rec = RestorationRecord(
            request_id=req.id,
            completion_date=payload.completion_date,
            contractor_name=payload.contractor_name,
            road_surface_restored=payload.road_surface_restored,
            restoration_quality_rating=payload.restoration_quality_rating,
            verification_status="Pending Inspection"
        )
        db.add(rec)

    old_status = req.status
    req.status = "Restoration Pending"
    
    # Add history
    history = StatusHistory(
        request_id=req.id,
        from_status=old_status,
        to_status="Restoration Pending",
        changed_by_user_id=current_user.id,
        notes=f"Civil excavation complete by {payload.contractor_name}. Awaiting road surface inspection."
    )
    db.add(history)

    # Notify Road dept & Admin
    notif = Notification(
        department_id=6,  # Road dept
        title=f"Restoration Inspection Required: {req.request_code}",
        message=f"{req.department.name} completed work on {req.road.name}. Ready for asphalt restoration inspection.",
        related_request_id=req.id,
        type="RESTORATION"
    )
    db.add(notif)
    db.commit()

    return {"message": "Excavation completion and restoration logged successfully.", "record_id": rec.id}

@router.post("/verify/{request_id}")
def verify_road_restoration(
    request_id: int,
    payload: RestorationVerifyPayload,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Municipal inspector or Administrator verifies the quality of road surface reinstatement.
    """
    req = db.query(ExcavationRequest).filter(ExcavationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found.")

    rec = db.query(RestorationRecord).filter(RestorationRecord.request_id == req.id).first()
    if not rec:
        # Create record if not existed yet
        rec = RestorationRecord(
            request_id=req.id,
            completion_date=datetime.date.today(),
            contractor_name="Municipal Road Inspection Team",
            road_surface_restored="Bituminous Asphalt Reinstatement",
            verification_status=payload.verification_status
        )
        db.add(rec)

    rec.verification_status = payload.verification_status
    rec.inspection_date = payload.inspection_date
    rec.inspector_name = payload.inspector_name
    rec.verification_notes = payload.verification_notes
    rec.verified_by_user_id = current_user.id
    rec.verified_at = datetime.datetime.utcnow()

    old_status = req.status
    if payload.verification_status == "Verified Satisfactory":
        req.status = "Restoration Verified"
    else:
        req.status = "Restoration Pending"  # Rework required

    # Status history
    history = StatusHistory(
        request_id=req.id,
        from_status=old_status,
        to_status=req.status,
        changed_by_user_id=current_user.id,
        notes=f"Inspection by {payload.inspector_name}: {payload.verification_status}. Notes: {payload.verification_notes}"
    )
    db.add(history)

    # Notify department
    notif = Notification(
        department_id=req.department_id,
        title=f"Restoration {payload.verification_status}: {req.request_code}",
        message=f"Pavement quality inspected on {req.road.name}: {payload.verification_status}.",
        related_request_id=req.id,
        type="RESTORATION"
    )
    db.add(notif)
    db.commit()

    return {
        "message": f"Restoration record updated to '{payload.verification_status}'.",
        "new_request_status": req.status
    }
