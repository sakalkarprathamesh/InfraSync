from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Department, Road, ExcavationRequest

router = APIRouter(tags=["Departments & Roads"])

@router.get("/departments")
def list_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    result = []
    for d in departments:
        req_count = db.query(ExcavationRequest).filter(ExcavationRequest.department_id == d.id).count()
        result.append({
            "id": d.id,
            "name": d.name,
            "code": d.code,
            "contact_person": d.contact_person,
            "phone": d.phone,
            "email": d.email,
            "color": d.color,
            "description": d.description,
            "project_count": req_count
        })
    return result

@router.get("/roads")
def list_roads(db: Session = Depends(get_db)):
    roads = db.query(Road).all()
    result = []
    for r in roads:
        req_count = db.query(ExcavationRequest).filter(ExcavationRequest.road_id == r.id).count()
        result.append({
            "id": r.id,
            "name": r.name,
            "road_code": r.road_code,
            "locality": r.locality,
            "ward": r.ward,
            "length_km": r.length_km,
            "surface_type": r.surface_type,
            "importance_tier": r.importance_tier,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "project_count": req_count
        })
    return result
