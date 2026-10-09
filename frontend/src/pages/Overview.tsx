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
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#5F6368] font-bold">Loading urban infrastructure metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-[#FCE8E6] border border-[#F28B82] rounded-2xl text-[#EA4335]">
        <p className="font-bold text-sm">Unable to load dashboard data</p>
        <p className="text-xs mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-1.5 text-xs font-bold bg-[#EA4335] text-white rounded-2xl hover:bg-[#C5221F] cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <h1 className="text-2xl font-black text-[#202124] tracking-tight">
            Municipal Excavation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Real-time urban road excavation visibility and inter-agency coordination for Pune.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
          {isDepartmentUser && (
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Submit Request
            </Link>
          )}
          <Link
            to="/conflicts"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#202124] bg-white border border-[#DADCE0] hover:border-[#EA4335] hover:bg-[#F8F9FA] rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 mr-1.5 text-[#EA4335]" />
            Active Conflicts ({data.active_conflicts})
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#202124] bg-white border border-[#DADCE0] hover:border-[#1A73E8] hover:bg-[#F8F9FA] rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 mr-1.5 text-[#1A73E8]" />
            GIS Map
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (6 key metrics from Section 7) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Total Requests */}
        <div
          onClick={() => navigate('/requests')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#1A73E8] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#1A73E8]">
            <span className="text-xs font-bold text-[#5F6368]">Total Requests</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#202124] mt-2">{data.total_requests}</div>
          <p className="text-[11px] text-[#5F6368] mt-1">Across 6 departments</p>
        </div>

        {/* Metric 2: Awaiting Approval */}
        <div
          onClick={() => navigate('/requests?status=Submitted')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#FBBC04] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#7A4B04]">
            <span className="text-xs font-bold text-[#5F6368]">Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#7A4B04] mt-2">
            {data.requests_awaiting_approval}
          </div>
          <p className="text-[11px] text-[#5F6368] mt-1">Awaiting admin review</p>
        </div>

        {/* Metric 3: Detected Conflicts */}
        <div
          onClick={() => navigate('/conflicts')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#EA4335] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#EA4335]">
            <span className="text-xs font-bold text-[#5F6368]">Detected Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-[#EA4335]" />
          </div>
          <div className="text-2xl font-black text-[#EA4335] mt-2">{data.active_conflicts}</div>
          <p className="text-[11px] text-[#5F6368] mt-1">Spatial & temporal</p>
        </div>

        {/* Metric 4: Coordination Opportunities */}
        <div
          onClick={() => navigate('/coordination')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#1A73E8] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#1A73E8]">
            <span className="text-xs font-bold text-[#5F6368]">Coord Opportunities</span>
            <CalendarCheck className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="text-2xl font-black text-[#1A73E8] mt-2">
            {data.coordination_opportunities}
          </div>
          <p className="text-[11px] text-[#5F6368] mt-1">Feasible joint windows</p>
        </div>

        {/* Metric 5: Active Excavation Projects */}
        <div
          onClick={() => navigate('/requests?status=In Progress')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#34A853] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#34A853]">
            <span className="text-xs font-bold text-[#5F6368]">Active Works</span>
            <HardHat className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#202124] mt-2">
            {data.active_excavation_projects}
          </div>
          <p className="text-[11px] text-[#5F6368] mt-1">In progress or scheduled</p>
        </div>

        {/* Metric 6: Projects Awaiting Restoration */}
        <div
          onClick={() => navigate('/history')}
          className="p-4 bg-white rounded-2xl border border-[#DADCE0] shadow-xs hover:border-[#7A4B04] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5F6368] group-hover:text-[#7A4B04]">
            <span className="text-xs font-bold text-[#5F6368]">Restoration Pending</span>
            <Hammer className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#7A4B04] mt-2">
            {data.projects_awaiting_restoration}
          </div>
          <p className="text-[11px] text-[#5F6368] mt-1">Civil works completed</p>
        </div>
      </div>

      {/* Featured End-to-End Scenario Card matching Roomie's dark highlight banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#202124] text-white shadow-md border border-[#3C4043]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#FBBC04] text-[#202124] rounded-full uppercase tracking-wider">
                Evaluation Scenario
              </span>
              <span className="text-xs text-slate-300 font-medium">Central Avenue (FC Road Corridor) Conflict</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Water Pipeline Repair &amp; 11kV Power Cable Trench Overlap
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Infrasync detected simultaneous excavation requests by PMC Water Supply (Oct 15–18) and MSEDCL Electricity (Oct 17–20).
              Unified proposal <span className="font-bold text-white">PROP-2026-001</span> consolidates trenching into a single 4-day shared window, saving estimated ₹38,400 in duplicate asphalt restoration charges.
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to="/coordination"
              className="px-5 py-2.5 text-xs font-bold text-[#202124] bg-[#FBBC04] hover:bg-[#F9AB00] rounded-2xl transition-colors shadow-xs cursor-pointer"
            >
              Review Coordinated Schedule →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Split: High-Priority Conflicts & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Requests & High Priority Conflicts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Requests Table */}
          <div className="p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Recent Excavation Requests
              </h2>
              <Link
                to="/requests"
                className="text-xs font-bold text-[#1A73E8] hover:underline flex items-center"
              >
                View all ({data.total_requests}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DADCE0] text-[#5F6368] font-bold">
                    <th className="pb-2.5">Code</th>
                    <th className="pb-2.5">Department</th>
                    <th className="pb-2.5">Road Corridor</th>
                    <th className="pb-2.5">Dates</th>
                    <th className="pb-2.5">Priority</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DADCE0]/50">
                  {data.recent_requests.slice(0, 5).map((req: any) => (
                    <tr
                      key={req.id}
                      onClick={() => navigate(`/requests/${req.id}`)}
                      className="hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 font-bold text-[#1A73E8]">{req.request_code}</td>
                      <td className="py-2.5">
                        <span className="flex items-center space-x-1.5 font-bold text-[#202124]">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: req.department_color || '#1A73E8' }}
                          />
                          <span className="truncate max-w-[120px]">
                            {req.department_name.replace(' Department', '')}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 font-medium text-[#202124] truncate max-w-[150px]">
                        {req.road_name}
                      </td>
                      <td className="py-2.5 text-[#5F6368] whitespace-nowrap">
                        {new Date(req.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            req.priority === 'Emergency'
                              ? 'bg-[#FCE8E6] text-[#EA4335]'
                              : req.priority === 'High'
                              ? 'bg-[#FEF7E0] text-[#7A4B04]'
                              : 'bg-slate-100 text-[#5F6368]'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            req.status === 'Approved'
                              ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                              : req.status === 'Submitted'
                              ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#DADCE0]'
                              : req.status === 'In Progress'
                              ? 'bg-[#FEF7E0] text-[#7A4B04]'
                              : 'bg-slate-100 text-[#5F6368]'
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
          <div className="p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#EA4335]" />
                <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                  Active Conflict Alerts
                </h2>
              </div>
              <Link
                to="/conflicts"
                className="text-xs font-bold text-[#EA4335] hover:underline flex items-center"
              >
                View all ({data.active_conflicts}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {data.recent_conflicts.length === 0 ? (
                <p className="text-xs text-[#5F6368] py-3 text-center">No active conflicts detected.</p>
              ) : (
                data.recent_conflicts.slice(0, 3).map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/conflicts')}
                    className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:bg-white cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE8E6] text-[#EA4335] uppercase">
                        {c.conflict_category}
                      </span>
                      <span className="text-[11px] font-bold text-[#5F6368]">
                        {c.road_name}
                      </span>
                    </div>
                    <p className="text-xs text-[#202124] font-medium leading-relaxed">
                      {c.explanation}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#DADCE0]/60 text-[11px] text-[#5F6368]">
                      <span>Clashing: {c.request_a?.dept} vs {c.request_b?.dept}</span>
                      <span className="text-[#1A73E8] font-bold flex items-center">
                        Resolve &amp; Coordinate <ArrowRight className="w-3 h-3 ml-1" />
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
          <div className="p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-4">
              Department Excavation Volume
            </h2>
            <div className="space-y-3.5">
              {data.department_breakdown.map((d: any) => {
                const percentage = data.total_requests > 0
                  ? Math.round((d.count / data.total_requests) * 100)
                  : 0;
                return (
                  <div key={d.department_id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#202124] truncate max-w-[180px]">
                        {d.department_name.replace(' Department', '')}
                      </span>
                      <span className="font-bold text-[#5F6368]">
                        {d.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F8F9FA] border border-[#DADCE0]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(percentage, 5)}%`,
                          backgroundColor: d.color || '#1A73E8'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Schedules */}
          <div className="p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Upcoming Excavations
              </h2>
              <Link to="/coordination" className="text-xs font-bold text-[#1A73E8]">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {data.upcoming_schedules.length === 0 ? (
                <p className="text-xs text-[#5F6368] py-3 text-center">No scheduled work recorded.</p>
              ) : (
                data.upcoming_schedules.slice(0, 3).map((s: any) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#202124]">
                      <span className="text-[#1A73E8]">{s.schedule_code}</span>
                      <span className="text-[#5F6368] font-medium">
                        {new Date(s.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="font-bold text-[#202124] truncate">{s.title}</p>
                    <p className="text-[11px] text-[#5F6368]">{s.road_name}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Info Box on Savings matching Roomie green success treatment */}
          <div className="p-5 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333]">
            <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-[#137333]">
              <TrendingDown className="w-4 h-4 text-[#34A853]" />
              Civic Expenditure Impact
            </div>
            <p className="text-2xl font-black text-[#137333] mt-1.5">
              ₹{(data.estimated_potential_savings_inr || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#137333] mt-1 leading-relaxed font-medium">
              Potential savings identified from combining duplicate road milling and asphalt restoration through Infrasync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
