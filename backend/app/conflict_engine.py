import math
import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from .models import ExcavationRequest, ConflictMatch, Road, Department, Notification
from .config import settings

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in meters."""
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def detect_conflicts_for_request(
    request: ExcavationRequest,
    db: Session,
    auto_save: bool = True
) -> List[ConflictMatch]:
    """
    Compares the given request against all active / planned projects in the database.
    Evaluates spatial and temporal conditions deterministically.
    Returns detected conflict matches.
    """
    # Active/planned project statuses that can conflict
    candidate_statuses = [
        "Submitted", "Under Review", "Approved", "Scheduled", "In Progress"
    ]
    
    # Query candidates excluding the current request itself
    candidates = db.query(ExcavationRequest).filter(
        ExcavationRequest.id != request.id,
        ExcavationRequest.status.in_(candidate_statuses)
    ).all()
    
    detected_conflicts: List[ConflictMatch] = []
    
    # Remove existing active conflict records for this request to avoid duplicate stale entries
    if auto_save:
        db.query(ConflictMatch).filter(
            (ConflictMatch.request_a_id == request.id) | (ConflictMatch.request_b_id == request.id)
        ).delete(synchronize_session=False)
        db.commit()

    start_a = request.proposed_start_date
    end_a = request.proposed_end_date

    for cand in candidates:
        # 1. SPATIAL CHECK
        same_road = (request.road_id == cand.road_id)
        dist_m = haversine_distance_meters(
            request.latitude, request.longitude,
            cand.latitude, cand.longitude
        )
        is_spatially_close = same_road or (dist_m <= settings.PROXIMITY_DISTANCE_METERS)
        
        if not is_spatially_close:
            continue  # Far away on different roads, no conflict

        # 2. TEMPORAL CHECK
        start_b = cand.proposed_start_date
        end_b = cand.proposed_end_date
        
        # Check date overlap
        has_overlap = (max(start_a, start_b) <= min(end_a, end_b))
        
        days_gap = 0
        if not has_overlap:
            if start_b > end_a:
                days_gap = (start_b - end_a).days
            else:
                days_gap = (start_a - end_b).days

        is_sequential = (not has_overlap) and (days_gap <= settings.SEQUENTIAL_WINDOW_DAYS)

        # 3. CONFLICT CATEGORIZATION & EXPLANATION
        conflict = None

        req_dept_name = request.department.name if request.department else f"Dept #{request.department_id}"
        cand_dept_name = cand.department.name if cand.department else f"Dept #{cand.department_id}"
        road_name = request.road.name if request.road else request.locality

        # Case A: Emergency Priority Warning
        if (request.priority == "Emergency" or cand.priority == "Emergency") and (has_overlap or days_gap <= 5):
            emergency_req = request if request.priority == "Emergency" else cand
            conflict = ConflictMatch(
                request_a_id=request.id,
                request_b_id=cand.id,
                conflict_category="Emergency Priority Warning",
                severity="High",
                distance_meters=round(dist_m, 1),
                days_difference=days_gap if not has_overlap else 0,
                matching_rule="RULE_EMERGENCY_OVERRIDE",
                explanation=(
                    f"CRITICAL: Emergency excavation by '{emergency_req.department.name if emergency_req.department else 'agency'}' "
                    f"intersects with planned infrastructure activity on {road_name}. "
                    f"Immediate municipal review required to prevent disruption of critical utility services."
                ),
                recommended_action=(
                    "Convene immediate emergency field coordination. Evaluate if planned work can be deferred or "
                    "piggybacked during emergency excavation corridor closure."
                ),
                status="Active"
            )
        
        # Case B: Direct Spatial & Temporal Overlap
        elif has_overlap:
            overlap_days = (min(end_a, end_b) - max(start_a, start_b)).days + 1
            # Check if same department or cross department
            if request.department_id == cand.department_id:
                severity = "Medium"
                category = "Potential Coordination Opportunity"
                explanation = (
                    f"Intra-departmental scheduling overlap: {req_dept_name} has scheduled two works "
                    f"('{request.title}' and '{cand.title}') on {road_name} during the same window ({overlap_days} overlapping days). "
                    f"Coordinate internal workforce to consolidate trenching."
                )
            else:
                severity = "High"
                category = "Direct Spatial & Temporal Overlap"
                explanation = (
                    f"Cross-departmental excavation clash: {req_dept_name} ('{request.title}') and "
                    f"{cand_dept_name} ('{cand.title}') plan excavation on {road_name} with {overlap_days} days "
                    f"of simultaneous excavation. Uncoordinated execution will cause severe traffic blockades "
                    f"and risks utility cable/pipe damage."
                )

            conflict = ConflictMatch(
                request_a_id=request.id,
                request_b_id=cand.id,
                conflict_category=category,
                severity=severity,
                distance_meters=round(dist_m, 1),
                days_difference=0,
                matching_rule="RULE_SPATIAL_TEMPORAL_OVERLAP",
                explanation=explanation,
                recommended_action=(
                    f"Formulate a unified excavation schedule between {req_dept_name} and {cand_dept_name}. "
                    f"Propose a shared work window to execute underground utility installation concurrently before road resurfacing."
                ),
                status="Active"
            )

        # Case C: Nearby Sequential Excavation (Road freshly paved then dug up again!)
        elif is_sequential:
            conflict = ConflictMatch(
                request_a_id=request.id,
                request_b_id=cand.id,
                conflict_category="Nearby Sequential Excavation",
                severity="Medium",
                distance_meters=round(dist_m, 1),
                days_difference=days_gap,
                matching_rule="RULE_SEQUENTIAL_RE_EXCAVATION_PREVENTION",
                explanation=(
                    f"Prevent Repeated Road Digging: {req_dept_name} proposes excavation on {road_name} just "
                    f"{days_gap} day(s) apart from {cand_dept_name}'s scheduled work. "
                    f"Executing separately means {road_name} would be restored and re-excavated within two weeks, "
                    f"causing wasted municipal restoration expenditure and double citizen disruption."
                ),
                recommended_action=(
                    f"Synchronize schedules: align {req_dept_name}'s work to coincide with or immediately precede "
                    f"{cand_dept_name}'s excavation window, so single asphalt restoration can restore both utility interventions."
                ),
                status="Active"
            )

        if conflict:
            detected_conflicts.append(conflict)
            if auto_save:
                db.add(conflict)

    if auto_save:
        db.commit()
        for c in detected_conflicts:
            db.refresh(c)
            
            # Generate notification for involved departments
            notif = Notification(
                department_id=request.department_id,
                title=f"Conflict Alert: {request.request_code}",
                message=(
                    f"Detected {c.conflict_category} with request #{c.request_b_id} on {request.road.name if request.road else request.locality}. "
                    f"Action: {c.recommended_action}"
                ),
                related_request_id=request.id,
                type="CONFLICT"
            )
            db.add(notif)
        db.commit()

    return detected_conflicts
