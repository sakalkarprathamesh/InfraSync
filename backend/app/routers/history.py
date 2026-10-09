from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models import ExcavationRequest, Road, Department, RestorationRecord, CoordinationProposal

router = APIRouter(prefix="/history", tags=["Excavation History"])

@router.get("")
def list_history(
    department_id: Optional[int] = Query(None),
    road_id: Optional[int] = Query(None),
    work_type: Optional[str] = Query(None),
    restoration_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ExcavationRequest)
    
    # History includes completed, restoration pending, restoration verified, and scheduled
    if department_id:
        query = query.filter(ExcavationRequest.department_id == department_id)
    if road_id:
        query = query.filter(ExcavationRequest.road_id == road_id)
    if work_type and work_type != "All":
        query = query.filter(ExcavationRequest.work_type == work_type)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (ExcavationRequest.title.ilike(s)) |
            (ExcavationRequest.request_code.ilike(s)) |
            (ExcavationRequest.locality.ilike(s))
        )

    records = query.order_by(ExcavationRequest.proposed_start_date.desc()).all()
    
    results = []
    for r in records:
        rest_status = "Not Initiated"
        contractor = None
        quality_rating = None
        if r.restoration_record:
            rest_status = r.restoration_record.verification_status
            contractor = r.restoration_record.contractor_name
            quality_rating = r.restoration_record.restoration_quality_rating

        if restoration_status and restoration_status != "All":
            if rest_status != restoration_status:
                continue

        # Check if coordinated
        coord_status = "Independent Excavation"
        linked_proposal = db.query(CoordinationProposal).filter(
            ((CoordinationProposal.primary_request_id == r.id) | (CoordinationProposal.secondary_request_id == r.id)),
            CoordinationProposal.status == "Confirmed by Admin"
        ).first()
        if linked_proposal:
            coord_status = f"Coordinated ({linked_proposal.proposal_code})"

        results.append({
            "id": r.id,
            "request_code": r.request_code,
            "title": r.title,
            "department_name": r.department.name if r.department else "",
            "department_color": r.department.color if r.department else "#2563EB",
            "road_name": r.road.name if r.road else r.locality,
            "locality": r.locality,
            "work_type": r.work_type,
            "start_date": r.proposed_start_date.isoformat(),
            "end_date": r.proposed_end_date.isoformat(),
            "length_meters": r.excavation_length_meters,
            "depth_meters": r.excavation_depth_meters,
            "status": r.status,
            "coordination_status": coord_status,
            "restoration_status": rest_status,
            "contractor_name": contractor,
            "quality_rating": quality_rating,
            "estimated_cost": r.estimated_cost
        })

    return results

@router.get("/frequently-excavated-roads")
def get_frequently_excavated_roads(db: Session = Depends(get_db)):
    """Calculates roads with highest excavation incidence."""
    roads = db.query(Road).all()
    stats = []
    for road in roads:
        total_excavations = db.query(ExcavationRequest).filter(ExcavationRequest.road_id == road.id).count()
        total_length = db.query(func.sum(ExcavationRequest.excavation_length_meters)).filter(
            ExcavationRequest.road_id == road.id
        ).scalar() or 0.0
        
        departments_involved = db.query(
            func.count(func.distinct(ExcavationRequest.department_id))
        ).filter(ExcavationRequest.road_id == road.id).scalar() or 0

        stats.append({
            "road_id": road.id,
            "road_name": road.name,
            "locality": road.locality,
            "length_km": road.length_km,
            "importance_tier": road.importance_tier,
            "surface_type": road.surface_type,
            "excavation_count": total_excavations,
            "total_meters_dug": round(total_length, 1),
            "distinct_departments_count": departments_involved,
            "re_excavation_risk": "High" if total_excavations >= 3 else ("Moderate" if total_excavations == 2 else "Low")
        })

    # Sort descending by excavation count
    stats.sort(key=lambda x: x["excavation_count"], reverse=True)
    return stats
