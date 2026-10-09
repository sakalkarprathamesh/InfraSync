from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Notification, User
from ..auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def list_notifications(
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Notification)
    
    # Filter: if user is admin, can see all or admin-targeted. If department user, sees dept & user targeted.
    if current_user.role == "department_user":
        query = query.filter(
            (Notification.user_id == current_user.id) |
            (Notification.department_id == current_user.department_id) |
            (Notification.department_id == None)
        )
    elif current_user.role == "viewer":
        query = query.filter((Notification.user_id == current_user.id) | (Notification.type == "INFO"))

    if unread_only:
        query = query.filter(Notification.is_read == False)

    notifs = query.order_by(Notification.created_at.desc()).limit(50).all()
    
    unread_count = query.filter(Notification.is_read == False).count()

    results = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "related_request_id": n.related_request_id,
            "related_proposal_id": n.related_proposal_id,
            "created_at": n.created_at.isoformat()
        }
        for n in notifs
    ]

    return {
        "notifications": results,
        "unread_count": unread_count
    }

@router.patch("/{id}/read")
def mark_notification_read(id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found.")
    n.is_read = True
    db.commit()
    return {"message": "Notification marked as read."}

@router.post("/mark-all-read")
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Notification).filter(Notification.is_read == False)
    if current_user.role == "department_user":
        query = query.filter(
            (Notification.user_id == current_user.id) |
            (Notification.department_id == current_user.department_id)
        )
    query.update({Notification.is_read: True}, synchronize_session=False)
    db.commit()
    return {"message": "All notifications marked as read."}
