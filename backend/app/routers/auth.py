from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Department
from ..schemas import Token, LoginRequest, UserOut
from ..auth import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is deactivated")
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "id": user.id})
    dept_name = user.department.name if user.department else None
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department_id": user.department_id,
            "department_name": dept_name,
            "designation": user.designation
        }
    }

@router.get("/me")
def get_current_profile(current_user: User = Depends(get_current_user)):
    dept_name = current_user.department.name if current_user.department else None
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department_id": current_user.department_id,
        "department_name": dept_name,
        "designation": current_user.designation
    }

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Returns list of pre-configured demo users for easy testing and evaluation."""
    users = db.query(User).all()
    demo_list = []
    # Password mappings for demo ease
    password_map = {
        "admin@infrasync.gov.in": "Admin@123",
        "water@infrasync.gov.in": "Water@123",
        "power@infrasync.gov.in": "Power@123",
        "gas@infrasync.gov.in": "Gas@123",
        "telecom@infrasync.gov.in": "Telecom@123",
        "viewer@infrasync.gov.in": "Viewer@123",
    }
    for u in users:
        demo_list.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "department_name": u.department.name if u.department else "Municipal Administration / Citizen",
            "department_code": u.department.code if u.department else "ADMIN",
            "department_color": u.department.color if u.department else "#1E293B",
            "designation": u.designation,
            "demo_password": password_map.get(u.email, "Admin@123")
        })
    return demo_list
