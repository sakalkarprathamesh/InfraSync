const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://127.0.0.1:8000/api'
  : '/api';

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

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<any>('/auth/me'),
  getDemoUsers: () => request<any[]>('/auth/demo-users'),

  // Dashboard
  getDashboardSummary: () => request<any>('/dashboard/summary'),

  // Departments & Roads
  getDepartments: () => request<any[]>('/departments'),
  getRoads: () => request<any[]>('/roads'),

  // Requests
  getRequests: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>(`/requests${qs}`);
  },
  getRequestDetail: (id: number) => request<any>(`/requests/${id}`),
  createRequest: (data: any) =>
    request<any>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRequest: (id: number, data: any) =>
    request<any>(`/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  reviewRequest: (id: number, payload: { action: string; notes?: string }) =>
    request<any>(`/requests/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateRequestStatus: (id: number, payload: { status: string; notes?: string }) =>
    request<any>(`/requests/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Conflicts
  getConflicts: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>(`/conflicts${qs}`);
  },
  analyzeConflicts: () =>
    request<any>('/conflicts/analyze', {
      method: 'POST',
    }),
  resolveConflict: (id: number, status: string = 'Resolved') =>
    request<any>(`/conflicts/${id}/resolve?status_val=${status}`, {
      method: 'POST',
    }),

  // Coordination Proposals
  getProposals: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return request<any[]>(`/coordination-proposals${qs}`);
  },
  getProposalDetail: (id: number) => request<any>(`/coordination-proposals/${id}`),
  createProposal: (data: any) =>
    request<any>('/coordination-proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitProposalDecision: (id: number, payload: { decision: string; comments?: string }) =>
    request<any>(`/coordination-proposals/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  confirmProposalSchedule: (id: number, payload: { confirmed_start_date: string; confirmed_end_date: string; admin_notes?: string; traffic_advisory?: string }) =>
    request<any>(`/coordination-proposals/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // GIS Map
  getMapProjects: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any>(`/map/projects${qs}`);
  },

  // Excavation History
  getHistory: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>(`/history${qs}`);
  },
  getFrequentlyExcavatedRoads: () => request<any[]>('/history/frequently-excavated-roads'),

  // Road Restoration
  getRestorationRecords: (statusFilter?: string) => {
    const qs = statusFilter ? `?status_filter=${statusFilter}` : '';
    return request<any[]>(`/restoration/records${qs}`);
  },
  recordRestorationCompletion: (data: any) =>
    request<any>('/restoration/record', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyRestoration: (requestId: number, data: any) =>
    request<any>(`/restoration/verify/${requestId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Discussions
  getDiscussions: (params: { request_id?: number; coordination_proposal_id?: number }) => {
    const qs = '?' + new URLSearchParams(params as any).toString();
    return request<any[]>(`/discussions${qs}`);
  },
  postDiscussion: (data: any) =>
    request<any>('/discussions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: (unreadOnly: boolean = false) =>
    request<any>(`/notifications?unread_only=${unreadOnly}`),
  markNotificationRead: (id: number) =>
    request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () =>
    request<any>('/notifications/mark-all-read', {
      method: 'POST',
    }),

  // Analytics
  getAnalyticsSummary: () => request<any>('/analytics/summary'),

  // Shared Resources
  getResources: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>(`/resources${qs}`);
  },
  createResource: (data: any) =>
    request<any>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
