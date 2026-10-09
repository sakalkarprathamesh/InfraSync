from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ProjectDiscussion, User, ExcavationRequest, CoordinationProposal
from ..schemas import DiscussionCreate, DiscussionOut
from ..auth import get_current_user

router = APIRouter(prefix="/discussions", tags=["Department Collaboration"])

@router.get("")
def list_discussions(
    request_id: Optional[int] = None,
    coordination_proposal_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProjectDiscussion)
    if request_id:
        query = query.filter(ProjectDiscussion.request_id == request_id)
    if coordination_proposal_id:
        query = query.filter(ProjectDiscussion.coordination_proposal_id == coordination_proposal_id)
        
    messages = query.order_by(ProjectDiscussion.created_at.asc()).all()
    
    results = []
    for m in messages:
        u = m.user
        results.append({
            "id": m.id,
            "request_id": m.request_id,
            "coordination_proposal_id": m.coordination_proposal_id,
            "user_id": m.user_id,
            "user_name": u.name if u else "Anonymous",
            "user_role": u.role if u else "",
            "department_name": u.department.name if u and u.department else "Administration",
            "department_color": u.department.color if u and u.department else "#1E293B",
            "message": m.message,
            "is_coordination_note": m.is_coordination_note,
            "created_at": m.created_at.isoformat()
        })
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def post_discussion_message(
    payload: DiscussionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not payload.request_id and not payload.coordination_proposal_id:
        raise HTTPException(status_code=400, detail="Must link discussion to a request or coordination proposal.")

    new_msg = ProjectDiscussion(
        request_id=payload.request_id,
        coordination_proposal_id=payload.coordination_proposal_id,
        user_id=current_user.id,
        message=payload.message,
        is_coordination_note=payload.is_coordination_note
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return {
        "message": "Message posted successfully.",
        "id": new_msg.id,
        "created_at": new_msg.created_at.isoformat()
    }
