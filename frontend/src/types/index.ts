export type UserRole = 'admin' | 'department_user' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department_id: number | null;
  department_name: string | null;
  designation?: string;
}

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department_name: string;
  department_code: string;
  department_color: string;
  designation: string;
  demo_password: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  contact_person: string;
  phone: string;
  email: string;
  color: string;
  description?: string;
  project_count: number;
}

export interface Road {
  id: number;
  name: string;
  road_code: string;
  locality: string;
  ward: string;
  length_km: number;
  surface_type: string;
  importance_tier: string;
  latitude: number;
  longitude: number;
  project_count: number;
}

export type RequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Restoration Pending'
  | 'Restoration Verified'
  | 'Returned'
  | 'Rejected'
  | 'On Hold';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface ExcavationRequest {
  id: number;
  request_code: string;
  title: string;
  department_id: number;
  department_name: string;
  department_code: string;
  department_color: string;
  road_id: number;
  road_name: string;
  locality: string;
  work_type: string;
  reason_description: string;
  proposed_start_date: string;
  expected_duration_days: number;
  proposed_end_date: string;
  excavation_length_meters: number;
  excavation_depth_meters: number;
  priority: PriorityLevel;
  estimated_restoration_days: number;
  contact_person: string;
  contact_phone: string;
  latitude: number;
  longitude: number;
  supporting_notes?: string;
  status: RequestStatus;
  created_by_user_id: number;
  created_by_name: string;
  estimated_cost?: number;
  created_at: string;
  updated_at: string;
  active_conflicts_count?: number;
}

export interface ConflictMatch {
  id: number;
  conflict_category: string;
  severity: 'High' | 'Medium' | 'Low' | 'Advisory';
  distance_meters: number;
  days_difference: number;
  matching_rule: string;
  explanation: string;
  recommended_action: string;
  status: string;
  created_at: string;
  road_name: string;
  request_a: {
    id: number;
    request_code: string;
    title: string;
    department_name: string;
    department_code: string;
    department_color: string;
    proposed_start_date: string;
    proposed_end_date: string;
    status: string;
  };
  request_b: {
    id: number;
    request_code: string;
    title: string;
    department_name: string;
    department_code: string;
    department_color: string;
    proposed_start_date: string;
    proposed_end_date: string;
    status: string;
  };
}

export interface CoordinationProposal {
  id: number;
  proposal_code: string;
  title: string;
  primary_request_id: number;
  secondary_request_id: number;
  lead_department_id: number;
  lead_department_name: string;
  proposed_start_date: string;
  proposed_end_date: string;
  combined_duration_days: number;
  shared_excavation_window_desc: string;
  feasibility_score: number;
  estimated_savings_inr?: number;
  status: string;
  admin_decision_notes?: string;
  confirmed_schedule_id?: number;
  created_at: string;
  primary_request: any;
  secondary_request: any;
  decisions: Array<{
    id: number;
    department_name: string;
    department_color?: string;
    user_name: string;
    decision: 'Accept' | 'Reject' | 'Request Changes';
    comments?: string;
    created_at: string;
  }>;
}

export interface Schedule {
  id: number;
  schedule_code: string;
  request_code: string;
  title: string;
  road_name: string;
  start_date: string;
  end_date: string;
  status: string;
  traffic_advisory?: string;
}

export interface RestorationRecord {
  id: number;
  request_id: number;
  request_code: string;
  request_title: string;
  road_name: string;
  locality: string;
  department_name: string;
  department_color: string;
  completion_date: string;
  contractor_name: string;
  road_surface_restored: string;
  restoration_quality_rating?: number;
  inspection_date?: string;
  inspector_name?: string;
  verification_status: 'Pending Inspection' | 'Verified Satisfactory' | 'Rework Required';
  verification_notes?: string;
  verified_by_name?: string;
  verified_at?: string;
  created_at: string;
}

export interface ProjectDiscussion {
  id: number;
  request_id?: number;
  coordination_proposal_id?: number;
  user_id: number;
  user_name: string;
  user_role: string;
  department_name: string;
  department_color: string;
  message: string;
  is_coordination_note: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_request_id?: number;
  related_proposal_id?: number;
  created_at: string;
}

export interface SharedResource {
  id: number;
  department_id: number;
  department_name: string;
  department_color: string;
  resource_name: string;
  resource_type: string;
  quantity: string;
  availability_window_start: string;
  availability_window_end: string;
  contact_person: string;
  notes?: string;
  created_at: string;
}

export interface DashboardSummary {
  total_requests: number;
  requests_awaiting_approval: number;
  active_conflicts: number;
  coordination_opportunities: number;
  active_excavation_projects: number;
  projects_awaiting_restoration: number;
  restoration_verified_count: number;
  estimated_potential_savings_inr: number;
  department_breakdown: Array<{
    department_id: number;
    department_name: string;
    department_code: string;
    color: string;
    count: number;
  }>;
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  recent_requests: any[];
  recent_conflicts: any[];
  upcoming_schedules: any[];
  recent_notifications: any[];
}
