import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  CalendarCheck,
  HardHat,
  Hammer,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  PlusCircle,
  Sparkles,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api/client';
import { DashboardSummary } from '../types';
import { useAuth } from '../context/AuthContext';

export const Overview: React.FC = () => {
  const { user, isDepartmentUser, isAdmin } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const res = await api.getDashboardSummary();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading urban infrastructure metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
        <p className="font-semibold">Unable to load dashboard data</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Municipal Excavation Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time urban road excavation visibility and inter-agency coordination for Pune.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isDepartmentUser && (
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Submit Request
            </Link>
          )}
          <Link
            to="/conflicts"
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
            Active Conflicts ({data.active_conflicts})
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
            GIS Map
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (6 key metrics from Section 7) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Total Requests */}
        <div
          onClick={() => navigate('/requests')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600">
            <span className="text-xs font-semibold text-slate-500">Total Requests</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{data.total_requests}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all departments</p>
        </div>

        {/* Metric 2: Awaiting Approval */}
        <div
          onClick={() => navigate('/requests?status=Submitted')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-500">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {data.requests_awaiting_approval}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting admin decision</p>
        </div>

        {/* Metric 3: Detected Conflicts */}
        <div
          onClick={() => navigate('/conflicts')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-red-500">
            <span className="text-xs font-semibold text-slate-500">Detected Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{data.active_conflicts}</div>
          <p className="text-[11px] text-slate-400 mt-1">Spatial & temporal clashes</p>
        </div>

        {/* Metric 4: Coordination Opportunities */}
        <div
          onClick={() => navigate('/coordination')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600">
            <span className="text-xs font-semibold text-slate-500">Coord Opportunities</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {data.coordination_opportunities}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Feasible joint windows</p>
        </div>

        {/* Metric 5: Active Excavation Projects */}
        <div
          onClick={() => navigate('/requests?status=In Progress')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-xs font-semibold text-slate-500">Active Works</span>
            <HardHat className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data.active_excavation_projects}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">In progress or scheduled</p>
        </div>

        {/* Metric 6: Projects Awaiting Restoration */}
        <div
          onClick={() => navigate('/history')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600">
            <span className="text-xs font-semibold text-slate-500">Restoration Pending</span>
            <Hammer className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">
            {data.projects_awaiting_restoration}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Civil works completed</p>
        </div>
      </div>

      {/* Featured End-to-End Scenario Card (Request A + Request B) */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded uppercase tracking-wider">
                Evaluation Scenario
              </span>
              <span className="text-xs text-blue-200">Central Avenue (FC Road) Conflict</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Water Pipeline Repair & 11kV Power Cable Trench Overlap
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Infrasync detected simultaneous excavation requests by PMC Water Supply (Oct 15–18) and MSEDCL Electricity (Oct 17–20).
              Unified proposal <span className="font-semibold text-white">PROP-2026-001</span> consolidates trenching into a single 4-day shared window, saving estimated ₹38,400 in duplicate asphalt restoration charges.
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to="/coordination"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors shadow"
            >
              Review Coordinated Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Split: High-Priority Conflicts & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Requests & High Priority Conflicts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Requests Table */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Excavation Requests
              </h2>
              <Link
                to="/requests"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                View all ({data.total_requests}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2.5">Code</th>
                    <th className="pb-2.5">Department</th>
                    <th className="pb-2.5">Road Corridor</th>
                    <th className="pb-2.5">Dates</th>
                    <th className="pb-2.5">Priority</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent_requests.slice(0, 5).map((req: any) => (
                    <tr
                      key={req.id}
                      onClick={() => navigate(`/requests/${req.id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 font-semibold text-blue-600">{req.request_code}</td>
                      <td className="py-2.5">
                        <span className="flex items-center space-x-1.5 font-medium text-slate-800">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: req.department_color || '#2563EB' }}
                          />
                          <span className="truncate max-w-[120px]">
                            {req.department_name.replace(' Department', '')}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 font-medium text-slate-700 truncate max-w-[150px]">
                        {req.road_name}
                      </td>
                      <td className="py-2.5 text-slate-500 whitespace-nowrap">
                        {new Date(req.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            req.priority === 'Emergency'
                              ? 'bg-red-100 text-red-700'
                              : req.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : req.status === 'Submitted'
                              ? 'bg-blue-100 text-blue-700'
                              : req.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* High Priority Conflicts List */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Active Conflict Alerts
                </h2>
              </div>
              <Link
                to="/conflicts"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center"
              >
                View all ({data.active_conflicts}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {data.recent_conflicts.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">No active conflicts detected.</p>
              ) : (
                data.recent_conflicts.slice(0, 3).map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/conflicts')}
                    className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 hover:border-blue-400 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                        {c.conflict_category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {c.road_name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {c.explanation}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                      <span>Clashing: {c.request_a?.dept} vs {c.request_b?.dept}</span>
                      <span className="text-blue-600 font-semibold flex items-center">
                        Resolve & Coordinate <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Department Workload & Upcoming Schedules */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Department Excavation Volume
            </h2>
            <div className="space-y-3">
              {data.department_breakdown.map((d: any) => {
                const percentage = data.total_requests > 0
                  ? Math.round((d.count / data.total_requests) * 100)
                  : 0;
                return (
                  <div key={d.department_id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {d.department_name.replace(' Department', '')}
                      </span>
                      <span className="font-bold text-slate-700">
                        {d.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, 5)}%`,
                          backgroundColor: d.color || '#2563EB'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Schedules */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Excavations
              </h2>
              <Link to="/coordination" className="text-xs font-semibold text-blue-600">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {data.upcoming_schedules.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">No scheduled work recorded.</p>
              ) : (
                data.upcoming_schedules.slice(0, 3).map((s: any) => (
                  <div key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="text-blue-600">{s.schedule_code}</span>
                      <span className="text-slate-500">
                        {new Date(s.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900 truncate">{s.title}</p>
                    <p className="text-[11px] text-slate-500">{s.road_name}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Info Box on Savings */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Civic Expenditure Impact
            </div>
            <p className="text-xl font-bold text-emerald-950 mt-1">
              ₹{(data.estimated_potential_savings_inr || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
              Potential savings identified from combining duplicate road milling and asphalt restoration through Infrasync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
