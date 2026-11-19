import {
  MOCK_DEMO_USERS,
  MOCK_DEPARTMENTS,
  MOCK_ROADS,
  MOCK_REQUESTS,
  MOCK_CONFLICTS,
  MOCK_PROPOSALS,
  MOCK_DASHBOARD_SUMMARY,
  MOCK_RESTORATIONS,
  MOCK_SHARED_RESOURCES
} from './mockData';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || ((import.meta as any).env?.VITE_API_BASE as string) || (
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://127.0.0.1:8000/api'
    : '/api'
);

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('infrasync_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

async function withFallback<T>(apiFn: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await apiFn();
  } catch (err) {
    console.warn(`[Infrasync API] Backend offline or unreachable. Using demonstration data.`, err);
    return fallbackData;
  }
}

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    try {
      return await request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (err) {
      // Fallback demo authentication
      const matched = MOCK_DEMO_USERS.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      ) || MOCK_DEMO_USERS[0];

      const profile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        department_id: matched.id === 1 ? 6 : matched.id === 6 ? null : matched.id - 1,
        department_name: matched.department_name,
        designation: matched.designation
      };
      localStorage.setItem('infrasync_demo_profile', JSON.stringify(profile));

      return {
        access_token: `mock-token-${matched.id}-${Date.now()}`,
        token_type: 'bearer',
        user: profile
      };
    }
  },

  getMe: async () => {
    try {
      return await request<any>('/auth/me');
    } catch (err) {
      const stored = localStorage.getItem('infrasync_demo_profile');
      if (stored) {
        try { return JSON.parse(stored); } catch (_) {}
      }
      return {
        id: 1,
        name: MOCK_DEMO_USERS[0].name,
        email: MOCK_DEMO_USERS[0].email,
        role: MOCK_DEMO_USERS[0].role,
        department_id: 6,
        department_name: MOCK_DEMO_USERS[0].department_name,
        designation: MOCK_DEMO_USERS[0].designation
      };
    }
  },

  getDemoUsers: () => withFallback(
    () => request<any[]>('/auth/demo-users'),
    MOCK_DEMO_USERS
  ),

  // Dashboard
  getDashboardSummary: () => withFallback(
    () => request<any>('/dashboard/summary'),
    MOCK_DASHBOARD_SUMMARY
  ),

  // Departments & Roads
  getDepartments: () => withFallback(
    () => request<any[]>('/departments'),
    MOCK_DEPARTMENTS
  ),

  getRoads: () => withFallback(
    () => request<any[]>('/roads'),
    MOCK_ROADS
  ),

  // Requests
  getRequests: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return withFallback(
      () => request<any[]>(`/requests${qs}`),
      MOCK_REQUESTS
    );
  },

  getRequestDetail: (id: number) => withFallback(
    () => request<any>(`/requests/${id}`),
    MOCK_REQUESTS.find((r) => r.id === Number(id)) || MOCK_REQUESTS[0]
  ),

  createRequest: async (data: any) => {
    try {
      return await request<any>('/requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      return {
        request_code: `REQ-2026-00${MOCK_REQUESTS.length + 1}`,
        conflicts_detected: 1,
        request_id: MOCK_REQUESTS.length + 1
      };
    }
  },

  updateRequest: (id: number, data: any) => withFallback(
    () => request<any>(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    { ...MOCK_REQUESTS[0], ...data }
  ),

  reviewRequest: (id: number, payload: { action: string; notes?: string }) => withFallback(
    () => request<any>(`/requests/${id}/review`, { method: 'POST', body: JSON.stringify(payload) }),
    { success: true }
  ),

  updateRequestStatus: (id: number, payload: { status: string; notes?: string }) => withFallback(
    () => request<any>(`/requests/${id}/status`, { method: 'POST', body: JSON.stringify(payload) }),
    { success: true }
  ),

  // Conflicts
  getConflicts: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return withFallback(
      () => request<any[]>(`/conflicts${qs}`),
      MOCK_CONFLICTS
    );
  },

  analyzeConflicts: () => withFallback(
    () => request<any>('/conflicts/analyze', { method: 'POST' }),
    { conflicts_found: 1 }
  ),

  resolveConflict: (id: number, status: string = 'Resolved') => withFallback(
    () => request<any>(`/conflicts/${id}/resolve?status_val=${status}`, { method: 'POST' }),
    { success: true }
  ),

  // Coordination Proposals
  getProposals: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return withFallback(
      () => request<any[]>(`/coordination-proposals${qs}`),
      MOCK_PROPOSALS
    );
  },

  getProposalDetail: (id: number) => withFallback(
    () => request<any>(`/coordination-proposals/${id}`),
    MOCK_PROPOSALS.find((p) => p.id === Number(id)) || MOCK_PROPOSALS[0]
  ),

  createProposal: (data: any) => withFallback(
    () => request<any>('/coordination-proposals', { method: 'POST', body: JSON.stringify(data) }),
    MOCK_PROPOSALS[0]
  ),

  submitProposalDecision: (id: number, payload: { decision: string; comments?: string }) => withFallback(
    () => request<any>(`/coordination-proposals/${id}/decision`, { method: 'POST', body: JSON.stringify(payload) }),
    { success: true }
  ),

  confirmProposalSchedule: (id: number, payload: any) => withFallback(
    () => request<any>(`/coordination-proposals/${id}/confirm`, { method: 'POST', body: JSON.stringify(payload) }),
    { success: true }
  ),

  // GIS Map
  getMapProjects: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return withFallback(
      () => request<any>(`/map/projects${qs}`),
      {
        type: 'FeatureCollection',
        features: MOCK_REQUESTS.map((r) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [r.longitude, r.latitude]
          },
          properties: {
            id: r.id,
            request_code: r.request_code,
            title: r.title,
            department_name: r.department_name,
            department_color: r.department_color,
            road_name: r.road_name,
            locality: r.locality,
            priority: r.priority,
            status: r.status,
            start_date: r.proposed_start_date,
            end_date: r.proposed_end_date,
            active_conflicts: r.active_conflicts_count || 0
          }
        }))
      }
    );
  },

  // Excavation History
  getHistory: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return withFallback(
      () => request<any[]>(`/history${qs}`),
      MOCK_REQUESTS
    );
  },

  getFrequentlyExcavatedRoads: () => withFallback(
    () => request<any[]>('/history/frequently-excavated-roads'),
    [
      { road_id: 1, road_name: "Central Avenue (FC Road)", locality: "Shivaji Nagar", excavation_count: 4, days_dug: 14, last_excavated: "2026-10-18" },
      { road_id: 3, road_name: "Karve Road", locality: "Kothrud", excavation_count: 3, days_dug: 11, last_excavated: "2026-09-22" }
    ]
  ),

  // Road Restoration
  getRestorationRecords: (statusFilter?: string) => {
    const qs = statusFilter ? `?status_filter=${statusFilter}` : '';
    return withFallback(
      () => request<any[]>(`/restoration/records${qs}`),
      MOCK_RESTORATIONS
    );
  },

  recordRestorationCompletion: (data: any) => withFallback(
    () => request<any>('/restoration/record', { method: 'POST', body: JSON.stringify(data) }),
    { success: true }
  ),

  verifyRestoration: (requestId: number, data: any) => withFallback(
    () => request<any>(`/restoration/verify/${requestId}`, { method: 'POST', body: JSON.stringify(data) }),
    { success: true }
  ),

  // Discussions
  getDiscussions: (params: { request_id?: number; coordination_proposal_id?: number }) => {
    const qs = '?' + new URLSearchParams(params as any).toString();
    return withFallback(
      () => request<any[]>(`/discussions${qs}`),
      [
        {
          id: 1,
          user_name: "Er. Ramesh Deshmukh",
          user_role: "department_user",
          department_name: "PMC Water Supply Department",
          department_color: "#2563EB",
          message: "Trench depth finalized at 1.8m. MSEDCL power conduits can sit at 1.2m depth with standard concrete separator tile.",
          is_coordination_note: true,
          created_at: "2026-10-04T12:00:00Z"
        }
      ]
    );
  },

  postDiscussion: (data: any) => withFallback(
    () => request<any>('/discussions', { method: 'POST', body: JSON.stringify(data) }),
    { success: true }
  ),

  // Notifications
  getNotifications: (unreadOnly: boolean = false) => withFallback(
    () => request<any>(`/notifications?unread_only=${unreadOnly}`),
    MOCK_DASHBOARD_SUMMARY.recent_notifications
  ),

  markNotificationRead: (id: number) => withFallback(
    () => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    { success: true }
  ),

  markAllNotificationsRead: () => withFallback(
    () => request<any>('/notifications/mark-all-read', { method: 'POST' }),
    { success: true }
  ),

  // Analytics
  getAnalyticsSummary: () => withFallback(
    () => request<any>('/analytics/summary'),
    {
      total_requests: 15,
      total_conflicts_prevented: 6,
      potential_savings_inr: 124500,
      active_corridors: 4,
      verified_restorations: 8
    }
  ),

  // Shared Resources
  getResources: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return withFallback(
      () => request<any[]>(`/resources${qs}`),
      MOCK_SHARED_RESOURCES
    );
  },

  createResource: (data: any) => withFallback(
    () => request<any>('/resources', { method: 'POST', body: JSON.stringify(data) }),
    MOCK_SHARED_RESOURCES[0]
  )
};
