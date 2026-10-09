from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ExcavationRequest, Road, Department

router = APIRouter(prefix="/map", tags=["GIS Map"])

@router.get("/projects")
def get_map_projects(
    department_id: Optional[int] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    road_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ExcavationRequest)
    
    if department_id:
        query = query.filter(ExcavationRequest.department_id == department_id)
    if priority and priority != "All":
        query = query.filter(ExcavationRequest.priority == priority)
    if status and status != "All":
        query = query.filter(ExcavationRequest.status == status)
    if road_id:
        query = query.filter(ExcavationRequest.road_id == road_id)

    requests = query.all()
    
    features = []
    for r in requests:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [r.longitude, r.latitude]
            },
            "properties": {
                "id": r.id,
                "request_code": r.request_code,
                "title": r.title,
                "department_id": r.department_id,
                "department_name": r.department.name if r.department else "",
                "department_code": r.department.code if r.department else "",
                "department_color": r.department.color if r.department else "#2563EB",
                "road_name": r.road.name if r.road else r.locality,
                "locality": r.locality,
                "work_type": r.work_type,
                "priority": r.priority,
                "status": r.status,
                "proposed_start_date": r.proposed_start_date.isoformat(),
                "proposed_end_date": r.proposed_end_date.isoformat(),
                "duration_days": r.expected_duration_days,
                "length_meters": r.excavation_length_meters,
                "contact_person": r.contact_person,
                "contact_phone": r.contact_phone,
                "reason": r.reason_description[:120] + "..." if len(r.reason_description) > 120 else r.reason_description
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features,
        "total_count": len(features)
    }
