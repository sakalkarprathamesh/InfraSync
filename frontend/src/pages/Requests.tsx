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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <h1 className="text-2xl font-black text-[#202124] tracking-tight">
            Excavation Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Registry of all planned, submitted, approved, and active road excavation activities.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRequests}
            className="p-2.5 text-[#5F6368] bg-white border border-[#DADCE0] rounded-2xl hover:bg-[#F8F9FA] hover:text-[#202124] transition-colors shadow-xs cursor-pointer"
            title="Refresh requests"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isDepartmentUser && (
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Submit Request
            </Link>
          )}
        </div>
      </div>

      {/* Filter Toolbar matching Roomie rounded style */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#5F6368]" />
            <input
              type="text"
              placeholder="Search by request code, title, locality, or road corridor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#202124] hover:bg-[#3C4043] rounded-2xl transition-colors shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#DADCE0]/60 text-xs">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] text-xs font-medium focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
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
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] text-xs font-medium focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
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
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] text-xs font-medium focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
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
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Work Type
            </label>
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] text-xs font-medium focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
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
      <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-[#5F6368] text-xs space-y-2">
            <p className="font-bold text-[#202124] text-sm">No excavation requests found</p>
            <p>Try adjusting your filters or search keywords.</p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#202124] rounded-2xl font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] border-b border-[#DADCE0] text-[#5F6368] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Road &amp; Locality</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Length</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DADCE0]/50">
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requests/${r.id}`)}
                    className="hover:bg-[#E8F0FE]/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-[#1A73E8] whitespace-nowrap">
                      {r.request_code}
                      {(r.active_conflicts_count ?? 0) > 0 && (
                        <span
                          className="ml-1.5 inline-flex items-center text-[10px] font-bold text-[#EA4335] bg-[#FCE8E6] border border-[#F28B82] rounded-full px-2 py-0.2"
                          title="Active conflict detected with this project"
                        >
                          <AlertTriangle className="w-3 h-3 mr-0.5 text-[#EA4335]" />
                          {r.active_conflicts_count}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#202124] max-w-xs truncate">
                      {r.title}
                      <span className="block text-[11px] text-[#5F6368] truncate font-normal">
                        {r.work_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center space-x-1.5 font-bold text-[#202124]">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: r.department_color || '#1A73E8' }}
                        />
                        <span className="truncate max-w-[130px]">
                          {r.department_name.replace(' Department', '')}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#202124]">
                      <p className="font-bold text-[#202124]">{r.road_name}</p>
                      <p className="text-[11px] text-[#5F6368]">{r.locality}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#5F6368]">
                      <span className="font-medium text-[#202124]">
                        {new Date(r.proposed_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-slate-400"> to </span>
                      <span className="font-medium text-[#202124]">
                        {new Date(r.proposed_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="block text-[10px] text-[#5F6368]">({r.expected_duration_days} days)</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#202124] font-semibold">
                      {r.excavation_length_meters}m
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          r.priority === 'Emergency'
                            ? 'bg-[#FCE8E6] text-[#EA4335]'
                            : r.priority === 'High'
                            ? 'bg-[#FEF7E0] text-[#7A4B04]'
                            : r.priority === 'Medium'
                            ? 'bg-[#E8F0FE] text-[#1A73E8]'
                            : 'bg-slate-100 text-[#5F6368]'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'Approved'
                            ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                            : r.status === 'Submitted'
                            ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#DADCE0]'
                            : r.status === 'Scheduled'
                            ? 'bg-[#E8F0FE] text-[#1A73E8]'
                            : r.status === 'In Progress'
                            ? 'bg-[#FEF7E0] text-[#7A4B04]'
                            : r.status === 'Restoration Verified'
                            ? 'bg-[#E6F4EA] text-[#137333]'
                            : r.status === 'Restoration Pending'
                            ? 'bg-[#FEF7E0] text-[#7A4B04]'
                            : 'bg-slate-100 text-[#5F6368]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center text-[#1A73E8] font-bold hover:underline">
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
