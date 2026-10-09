from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SharedResource, Department, User
from ..schemas import SharedResourceCreate
from ..auth import get_current_user, require_department_user

router = APIRouter(prefix="/resources", tags=["Shared Resources"])

@router.get("")
def list_resources(department_id: Optional[int] = None, resource_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SharedResource)
    if department_id:
        query = query.filter(SharedResource.department_id == department_id)
    if resource_type and resource_type != "All":
        query = query.filter(SharedResource.resource_type == resource_type)
        
    items = query.order_by(SharedResource.availability_window_start.asc()).all()
    
    results = []
    for r in items:
        results.append({
            "id": r.id,
            "department_id": r.department_id,
            "department_name": r.department.name if r.department else "",
            "department_color": r.department.color if r.department else "#2563EB",
            "resource_name": r.resource_name,
            "resource_type": r.resource_type,
            "quantity": r.quantity,
            "availability_window_start": r.availability_window_start.isoformat(),
            "availability_window_end": r.availability_window_end.isoformat(),
            "contact_person": r.contact_person,
            "notes": r.notes,
            "created_at": r.created_at.isoformat()
        })
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def create_resource(
    payload: SharedResourceCreate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    dept_id = current_user.department_id or payload.department_id
    res = SharedResource(
        department_id=dept_id,
        resource_name=payload.resource_name,
        resource_type=payload.resource_type,
        quantity=payload.quantity,
        availability_window_start=payload.availability_window_start,
        availability_window_end=payload.availability_window_end,
        contact_person=payload.contact_person,
        notes=payload.notes
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return {"message": "Shared resource logged successfully.", "id": res.id}
