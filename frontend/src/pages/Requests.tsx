import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { ExcavationRequest, Department, Road } from '../types';
import { useAuth } from '../context/AuthContext';

export const Requests: React.FC = () => {
  const { user, isDepartmentUser } = useAuth();
  const [requests, setRequests] = useState<ExcavationRequest[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');

  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDept !== 'All') params.department_id = selectedDept;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedPriority !== 'All') params.priority = selectedPriority;
      if (selectedWorkType !== 'All') params.work_type = selectedWorkType;

      const data = await api.getRequests(params);
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initMetadata() {
      try {
        const [deptsData, roadsData] = await Promise.all([
          api.getDepartments(),
          api.getRoads()
        ]);
        setDepartments(deptsData);
        setRoads(roadsData);
      } catch (err) {
        console.error('Failed to load departments/roads metadata:', err);
      }
    }
    initMetadata();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [selectedDept, selectedStatus, selectedPriority, selectedWorkType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedWorkType('All');
  };

  return (
    <div className="space-y-6">
      {/* Header & New Request button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Excavation Requests
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Registry of all planned, submitted, approved, and active road excavation activities.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchRequests}
            className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh requests"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isDepartmentUser && (
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Submit Request
            </Link>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by request code, title, locality, or road name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.replace(' Department', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Restoration Pending">Restoration Pending</option>
              <option value="Restoration Verified">Restoration Verified</option>
              <option value="Returned">Returned</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Work Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Work Type
            </label>
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Work Types</option>
              <option value="Water Pipeline">Water Pipeline</option>
              <option value="Cable Installation">Cable Installation</option>
              <option value="Gas Pipeline">Gas Pipeline</option>
              <option value="Drainage">Drainage</option>
              <option value="Sewage Repair">Sewage Repair</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 text-sm">No excavation requests found</p>
            <p className="mt-1">Try adjusting your filters or search keywords.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Road & Locality</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-blue-600 whitespace-nowrap">
                      {r.request_code}
                      {(r.active_conflicts_count ?? 0) > 0 && (
                        <span
                          className="ml-1.5 inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.2"
                          title="Active conflict detected with this project"
                        >
                          <AlertTriangle className="w-3 h-3 mr-0.5 text-red-500" />
                          {r.active_conflicts_count}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {r.title}
                      <span className="block text-[11px] text-slate-500 truncate font-normal">
                        {r.work_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center space-x-1.5 font-medium text-slate-800">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: r.department_color || '#2563EB' }}
                        />
                        <span className="truncate max-w-[130px]">
                          {r.department_name.replace(' Department', '')}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      <p className="font-medium text-slate-800">{r.road_name}</p>
                      <p className="text-[11px] text-slate-400">{r.locality}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <span>
                        {new Date(r.proposed_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-slate-400"> to </span>
                      <span>
                        {new Date(r.proposed_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="block text-[10px] text-slate-400">({r.expected_duration_days} days)</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono">
                      {r.excavation_length_meters}m
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          r.priority === 'Emergency'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : r.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : r.priority === 'Medium'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          r.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : r.status === 'Scheduled'
                            ? 'bg-indigo-100 text-indigo-800'
                            : r.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'Restoration Verified'
                            ? 'bg-teal-100 text-teal-800'
                            : r.status === 'Restoration Pending'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
                        View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
