import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    CoordinationProposal, CoordinationDecision, Schedule,
    ExcavationRequest, User, Department, StatusHistory, Notification
)
from ..schemas import (
    CoordinationProposalCreate, CoordinationDecisionCreate,
    CoordinationConfirmPayload
)
from ..auth import get_current_user, require_admin, require_department_user
from ..scheduling_engine import evaluate_coordination_feasibility

router = APIRouter(prefix="/coordination-proposals", tags=["Coordination & Scheduling"])

@router.get("")
def list_proposals(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CoordinationProposal)
    if status and status != "All":
        query = query.filter(CoordinationProposal.status == status)
    proposals = query.order_by(CoordinationProposal.created_at.desc()).all()
    
    result = []
    for p in proposals:
        req_a = p.primary_request
        req_b = p.secondary_request
        decisions = [
            {
                "id": d.id,
                "department_name": d.department.name if d.department else "",
                "department_color": d.department.color if d.department else "#2563EB",
                "user_name": d.user.name if d.user else "",
                "decision": d.decision,
                "comments": d.comments,
                "created_at": d.created_at.isoformat()
            }
            for d in p.decisions
        ]
        
        result.append({
            "id": p.id,
            "proposal_code": p.proposal_code,
            "title": p.title,
            "primary_request_id": p.primary_request_id,
            "secondary_request_id": p.secondary_request_id,
            "lead_department_id": p.lead_department_id,
            "lead_department_name": p.lead_department.name if p.lead_department else "",
            "proposed_start_date": p.proposed_start_date.isoformat(),
            "proposed_end_date": p.proposed_end_date.isoformat(),
            "combined_duration_days": p.combined_duration_days,
            "shared_excavation_window_desc": p.shared_excavation_window_desc,
            "feasibility_score": p.feasibility_score,
            "estimated_savings_inr": p.estimated_savings_inr,
            "status": p.status,
            "admin_decision_notes": p.admin_decision_notes,
            "confirmed_schedule_id": p.confirmed_schedule_id,
            "created_at": p.created_at.isoformat(),
            "primary_request": {
                "id": req_a.id if req_a else None,
                "request_code": req_a.request_code if req_a else "",
                "title": req_a.title if req_a else "",
                "department_name": req_a.department.name if req_a and req_a.department else "",
                "department_color": req_a.department.color if req_a and req_a.department else "#2563EB",
                "road_name": req_a.road.name if req_a and req_a.road else "",
                "proposed_start_date": req_a.proposed_start_date.isoformat() if req_a else "",
                "proposed_end_date": req_a.proposed_end_date.isoformat() if req_a else "",
                "status": req_a.status if req_a else ""
            },
            "secondary_request": {
                "id": req_b.id if req_b else None,
                "request_code": req_b.request_code if req_b else "",
                "title": req_b.title if req_b else "",
                "department_name": req_b.department.name if req_b and req_b.department else "",
                "department_color": req_b.department.color if req_b and req_b.department else "#D97706",
                "road_name": req_b.road.name if req_b and req_b.road else "",
                "proposed_start_date": req_b.proposed_start_date.isoformat() if req_b else "",
                "proposed_end_date": req_b.proposed_end_date.isoformat() if req_b else "",
                "status": req_b.status if req_b else ""
            },
            "decisions": decisions
        })
    return result

@router.post("", status_code=status.HTTP_201_CREATED)
def create_proposal(
    payload: CoordinationProposalCreate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    req_a = db.query(ExcavationRequest).filter(ExcavationRequest.id == payload.primary_request_id).first()
    req_b = db.query(ExcavationRequest).filter(ExcavationRequest.id == payload.secondary_request_id).first()
    if not req_a or not req_b:
        raise HTTPException(status_code=400, detail="Invalid primary or secondary request IDs.")

    # Generate proposal code
    count = db.query(CoordinationProposal).count()
    proposal_code = f"PROP-2026-{str(count + 1).zfill(3)}"

    proposal = CoordinationProposal(
        proposal_code=proposal_code,
        title=payload.title,
        primary_request_id=payload.primary_request_id,
        secondary_request_id=payload.secondary_request_id,
        lead_department_id=payload.lead_department_id,
        proposed_start_date=payload.proposed_start_date,
        proposed_end_date=payload.proposed_end_date,
        combined_duration_days=payload.combined_duration_days,
        shared_excavation_window_desc=payload.shared_excavation_window_desc,
        feasibility_score=payload.feasibility_score,
        estimated_savings_inr=payload.estimated_savings_inr,
        status="Pending Review"
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    # Notify secondary department
    notif = Notification(
        department_id=req_b.department_id,
        title=f"Coordination Proposal: {proposal.proposal_code}",
        message=f"{req_a.department.name} initiated joint excavation proposal on {req_a.road.name}. Please review.",
        related_proposal_id=proposal.id,
        type="PROPOSAL"
    )
    db.add(notif)
    db.commit()

    return {"message": "Coordination proposal created successfully.", "proposal_id": proposal.id}

@router.get("/{id}")
def get_proposal_detail(id: int, db: Session = Depends(get_db)):
    p = db.query(CoordinationProposal).filter(CoordinationProposal.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found.")
    
    # Also recalculate live feasibility evaluation
    feasibility_eval = evaluate_coordination_feasibility(p.primary_request, p.secondary_request)
    
    return {
        "id": p.id,
        "proposal_code": p.proposal_code,
        "title": p.title,
        "primary_request_id": p.primary_request_id,
        "secondary_request_id": p.secondary_request_id,
        "lead_department_id": p.lead_department_id,
        "lead_department_name": p.lead_department.name if p.lead_department else "",
        "proposed_start_date": p.proposed_start_date.isoformat(),
        "proposed_end_date": p.proposed_end_date.isoformat(),
        "combined_duration_days": p.combined_duration_days,
        "shared_excavation_window_desc": p.shared_excavation_window_desc,
        "feasibility_score": p.feasibility_score,
        "estimated_savings_inr": p.estimated_savings_inr,
        "status": p.status,
        "admin_decision_notes": p.admin_decision_notes,
        "confirmed_schedule_id": p.confirmed_schedule_id,
        "created_at": p.created_at.isoformat(),
        "evaluation_details": feasibility_eval,
        "primary_request": {
            "id": p.primary_request.id,
            "request_code": p.primary_request.request_code,
            "title": p.primary_request.title,
            "department_id": p.primary_request.department_id,
            "department_name": p.primary_request.department.name,
            "department_color": p.primary_request.department.color,
            "road_name": p.primary_request.road.name,
            "work_type": p.primary_request.work_type,
            "proposed_start_date": p.primary_request.proposed_start_date.isoformat(),
            "proposed_end_date": p.primary_request.proposed_end_date.isoformat(),
            "status": p.primary_request.status,
            "cost": p.primary_request.estimated_cost
        },
        "secondary_request": {
            "id": p.secondary_request.id,
            "request_code": p.secondary_request.request_code,
            "title": p.secondary_request.title,
            "department_id": p.secondary_request.department_id,
            "department_name": p.secondary_request.department.name,
            "department_color": p.secondary_request.department.color,
            "road_name": p.secondary_request.road.name,
            "work_type": p.secondary_request.work_type,
            "proposed_start_date": p.secondary_request.proposed_start_date.isoformat(),
            "proposed_end_date": p.secondary_request.proposed_end_date.isoformat(),
            "status": p.secondary_request.status,
            "cost": p.secondary_request.estimated_cost
        },
        "decisions": [
            {
                "id": d.id,
                "department_name": d.department.name if d.department else "",
                "user_name": d.user.name if d.user else "",
                "decision": d.decision,
                "comments": d.comments,
                "created_at": d.created_at.isoformat()
            }
            for d in p.decisions
        ]
    }

@router.post("/{id}/decision")
def submit_department_decision(
    id: int,
    payload: CoordinationDecisionCreate,
    current_user: User = Depends(require_department_user),
    db: Session = Depends(get_db)
):
    p = db.query(CoordinationProposal).filter(CoordinationProposal.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    dept_id = current_user.department_id or p.lead_department_id

    decision = CoordinationDecision(
        proposal_id=p.id,
        department_id=dept_id,
        user_id=current_user.id,
        decision=payload.decision,
        comments=payload.comments
    )
    db.add(decision)
    
    # Check if both departments have now accepted
    p.decisions.append(decision)
    accepted_count = sum(1 for d in p.decisions if d.decision == "Accept")
    if accepted_count >= 2:
        p.status = "Accepted by Departments"

    db.commit()

    return {"message": f"Decision '{payload.decision}' recorded successfully."}

@router.post("/{id}/confirm")
def confirm_coordinated_schedule(
    id: int,
    payload: CoordinationConfirmPayload,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Municipal Administrator confirms the coordinated schedule.
    Updates proposal to 'Confirmed by Admin', creates Schedule records for both projects,
    advances requests to 'Scheduled', and logs status history.
    """
    p = db.query(CoordinationProposal).filter(CoordinationProposal.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    req_a = p.primary_request
    req_b = p.secondary_request

    # Create Schedule record for Request A
    sched_code_a = f"SCH-2026-{req_a.request_code.split('-')[-1]}"
    schedule_a = Schedule(
        schedule_code=sched_code_a,
        request_id=req_a.id,
        coordination_proposal_id=p.id,
        confirmed_start_date=payload.confirmed_start_date,
        confirmed_end_date=payload.confirmed_end_date,
        status="Scheduled",
        traffic_advisory=payload.traffic_advisory or f"Unified excavation window confirmed on {req_a.road.name}.",
        confirmed_by_admin_id=current_user.id
    )
    db.add(schedule_a)

    # Create Schedule record for Request B
    sched_code_b = f"SCH-2026-{req_b.request_code.split('-')[-1]}"
    schedule_b = Schedule(
        schedule_code=sched_code_b,
        request_id=req_b.id,
        coordination_proposal_id=p.id,
        confirmed_start_date=payload.confirmed_start_date,
        confirmed_end_date=payload.confirmed_end_date,
        status="Scheduled",
        traffic_advisory=payload.traffic_advisory or f"Unified excavation window confirmed on {req_b.road.name}.",
        confirmed_by_admin_id=current_user.id
    )
    db.add(schedule_b)

    # Update Request statuses
    for req in [req_a, req_b]:
        old_status = req.status
        req.status = "Scheduled"
        history = StatusHistory(
            request_id=req.id,
            from_status=old_status,
            to_status="Scheduled",
            changed_by_user_id=current_user.id,
            notes=f"Confirmed under Unified Coordination Proposal {p.proposal_code}. Window: {payload.confirmed_start_date} to {payload.confirmed_end_date}."
        )
        db.add(history)

    # Update proposal
    p.status = "Confirmed by Admin"
    p.admin_decision_notes = payload.admin_notes or "Confirmed by Municipal Commissioner for joint trenching."
    
    db.commit()
    db.refresh(schedule_a)
    p.confirmed_schedule_id = schedule_a.id
    db.commit()

    # Generate notifications
    for dept_id in [req_a.department_id, req_b.department_id]:
        notif = Notification(
            department_id=dept_id,
            title=f"Schedule Confirmed: {p.proposal_code}",
            message=f"Administrator confirmed joint excavation window ({payload.confirmed_start_date} to {payload.confirmed_end_date}) on {req_a.road.name}.",
            related_proposal_id=p.id,
            type="SCHEDULE"
        )
        db.add(notif)
    db.commit()

    return {
        "message": "Coordinated schedule confirmed successfully.",
        "proposal_status": p.status,
        "confirmed_start_date": payload.confirmed_start_date.isoformat(),
        "confirmed_end_date": payload.confirmed_end_date.isoformat()
    }
