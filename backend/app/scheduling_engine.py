import datetime
from typing import Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from .models import ExcavationRequest, CoordinationProposal, Department, Road

def evaluate_coordination_feasibility(
    req_a: ExcavationRequest,
    req_b: ExcavationRequest
) -> Dict[str, Any]:
    """
    Evaluates rule-based feasibility of combining or co-scheduling two excavation requests.
    Returns:
    - feasibility_score (0 - 100)
    - recommended_start_date
    - recommended_end_date
    - combined_duration_days
    - window_explanation
    - technical_compatibility_notes
    - estimated_savings_inr
    """
    reasons = []
    constraints = []
    
    # 1. Base score
    score = 80.0
    
    # 2. Road check
    if req_a.road_id == req_b.road_id:
        score += 10.0
        reasons.append("Identical road corridor allows unified traffic barricading and single trench reinstatement.")
    else:
        score -= 20.0
        constraints.append("Projects are on nearby streets rather than identical road alignment.")

    # 3. Work Type Compatibility Matrix
    # Compatible: (Water + Gas), (Water + Electricity), (Telecom + Electricity)
    # Incompatible or high risk: Heavy drainage reconstruction with delicate optical fiber without depth separation
    deep_digging_types = ["Sewage Repair", "Drainage", "Water Pipeline"]
    shallow_digging_types = ["Cable Installation", "Telecom", "Gas Pipeline"]
    
    if req_a.work_type in deep_digging_types and req_b.work_type in shallow_digging_types:
        score += 5.0
        reasons.append(
            f"Staged vertical execution feasible: {req_a.work_type} (depth {req_a.excavation_depth_meters}m) "
            f"can be laid beneath {req_b.work_type} (depth {req_b.excavation_depth_meters}m) prior to backfill."
        )
    elif req_a.work_type == req_b.work_type:
        score += 5.0
        reasons.append(f"Similar utility profiles ({req_a.work_type}) permit shared excavation equipment and trenching team.")
    else:
        reasons.append("Different utility types require designated utility separation safety clearance.")

    # 4. Priority impact
    if req_a.priority == "Emergency" or req_b.priority == "Emergency":
        score -= 15.0
        constraints.append("Emergency priority project imposes strict urgency; coordination window must not delay emergency intervention.")

    # 5. Calculate candidate coordinated window
    # Proposed dates
    start_a, end_a = req_a.proposed_start_date, req_a.proposed_end_date
    start_b, end_b = req_b.proposed_start_date, req_b.proposed_end_date
    
    # Shared optimal window:
    # Start on the earliest proposed date (or max if already partially approved), end when both finishes
    shared_start = min(start_a, start_b)
    # Combined duration can be parallel or slightly staggered
    # If both works can execute simultaneously with staged utility bedding:
    max_duration = max(req_a.expected_duration_days, req_b.expected_duration_days)
    # Add 1 buffer day for multi-agency handoff inspection if both exceed 2 days
    combined_days = max_duration + (1 if req_a.expected_duration_days > 2 and req_b.expected_duration_days > 2 else 0)
    shared_end = shared_start + datetime.timedelta(days=combined_days - 1)

    # 6. Cost Savings Estimation
    # Separate excavation means two independent road cuttings, two backfills, two asphalt repavings.
    # Single coordinated excavation saves approximately 35% of total combined restoration and digging costs.
    cost_a = req_a.estimated_cost or 50000.0
    cost_b = req_b.estimated_cost or 50000.0
    combined_individual_cost = cost_a + cost_b
    estimated_savings = round(combined_individual_cost * 0.32, 2)  # ~32% civic savings

    score = max(10.0, min(98.0, score))

    explanation = (
        f"Recommendation: Consolidate {req_a.department.name if req_a.department else 'Dept A'} and "
        f"{req_b.department.name if req_b.department else 'Dept B'} within a unified {combined_days}-day window "
        f"from {shared_start.strftime('%d %b %Y')} to {shared_end.strftime('%d %b %Y')}. "
        + " ".join(reasons)
    )

    if constraints:
        explanation += " Unresolved Operational Constraints: " + "; ".join(constraints)

    return {
        "feasibility_score": score,
        "recommended_start_date": shared_start,
        "recommended_end_date": shared_end,
        "combined_duration_days": combined_days,
        "shared_excavation_window_desc": explanation,
        "estimated_savings_inr": estimated_savings,
        "constraints": constraints,
        "reasons": reasons
    }
