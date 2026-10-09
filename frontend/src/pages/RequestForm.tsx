import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FilePlus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { Department, Road } from '../types';
import { useAuth } from '../context/AuthContext';

export const RequestForm: React.FC = () => {
  const { user, isDepartmentUser } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(user?.department_id || 1);
  const [roadId, setRoadId] = useState<number>(1);
  const [locality, setLocality] = useState('Shivaji Nagar');
  const [workType, setWorkType] = useState('Water Pipeline');
  const [reasonDescription, setReasonDescription] = useState('');
  const [proposedStartDate, setProposedStartDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [expectedDurationDays, setExpectedDurationDays] = useState<number>(3);
  const [excavationLengthMeters, setExcavationLengthMeters] = useState<number>(20);
  const [excavationDepthMeters, setExcavationDepthMeters] = useState<number>(1.5);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [estimatedRestorationDays, setEstimatedRestorationDays] = useState<number>(2);
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState('+91 98220 00000');
  const [latitude, setLatitude] = useState<number>(18.5246);
  const [longitude, setLongitude] = useState<number>(73.8415);
  const [supportingNotes, setSupportingNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(50000);

  // Success modal / post-submission alert state
  const [submissionResult, setSubmissionResult] = useState<{
    requestCode: string;
    conflictsDetected: number;
    requestId: number;
  } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [deptsData, roadsData] = await Promise.all([
          api.getDepartments(),
          api.getRoads(),
        ]);
        setDepartments(deptsData);
        setRoads(roadsData);
        if (user?.department_id) {
          setDepartmentId(user.department_id);
        } else if (deptsData.length > 0) {
          setDepartmentId(deptsData[0].id);
        }
        if (roadsData.length > 0) {
          setRoadId(roadsData[0].id);
          setLocality(roadsData[0].locality);
          setLatitude(roadsData[0].latitude);
          setLongitude(roadsData[0].longitude);
        }
      } catch (err) {
        console.error('Failed to load form metadata:', err);
      } finally {
        setLoadingMetadata(false);
      }
    }
    init();
  }, [user]);

  // When road changes, auto-fill locality and representative coordinates
  const handleRoadChange = (id: number) => {
    setRoadId(id);
    const r = roads.find((item) => item.id === id);
    if (r) {
      setLocality(r.locality);
      setLatitude(r.latitude);
      setLongitude(r.longitude);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (expectedDurationDays <= 0) {
      setError('Expected duration must be at least 1 day.');
      return;
    }
    if (excavationLengthMeters <= 0) {
      setError('Excavation length must be greater than zero.');
      return;
    }
    if (reasonDescription.trim().length < 10) {
      setError('Please provide a substantive technical justification (min 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        department_id: Number(departmentId),
        road_id: Number(roadId),
        locality,
        work_type: workType,
        reason_description: reasonDescription,
        proposed_start_date: proposedStartDate,
        expected_duration_days: Number(expectedDurationDays),
        excavation_length_meters: Number(excavationLengthMeters),
        excavation_depth_meters: Number(excavationDepthMeters),
        priority,
        estimated_restoration_days: Number(estimatedRestorationDays),
        contact_person: contactPerson,
        contact_phone: contactPhone,
        latitude: Number(latitude),
        longitude: Number(longitude),
        supporting_notes: supportingNotes || undefined,
        estimated_cost: Number(estimatedCost),
      };

      const res = await api.createRequest(payload);
      setSubmissionResult({
        requestCode: res.request_code,
        conflictsDetected: res.conflicts_detected,
        requestId: res.request_id,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit excavation request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMetadata) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Requests Registry
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#DADCE0] shadow-xs overflow-hidden">
        {/* Form Header matching Roomie dark banner */}
        <div className="p-6 sm:p-8 bg-[#202124] text-white">
          <div className="flex items-center space-x-2 text-[#FBBC04] text-xs font-bold uppercase tracking-wider">
            <FilePlus className="w-4 h-4" />
            <span>PMC Right-of-Way Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tight">Submit Road Excavation Request</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Register your department’s planned utility trenching. Infrasync will automatically scan for overlapping works and calculate candidate coordination windows.
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-[#FCE8E6] border border-[#F28B82] rounded-2xl text-xs text-[#EA4335] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#EA4335] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Validation Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Basic Project Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0]">
              1. Project Details &amp; Sponsoring Agency
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Excavation Request Title <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Avenue 400mm Feeder Water Pipeline Leak Repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Department / Utility Agency <span className="text-[#EA4335]">*</span>
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  disabled={user?.role === 'department_user'}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:ring-2 focus:ring-[#1A73E8]/20"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {user?.role === 'department_user' && (
                  <p className="text-[10px] text-[#5F6368] mt-1 font-medium">
                    Locked to your authenticated department persona.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Type of Infrastructure Work <span className="text-[#EA4335]">*</span>
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:ring-2 focus:ring-[#1A73E8]/20"
                >
                  <option value="Water Pipeline">Water Pipeline Repair / Laying</option>
                  <option value="Cable Installation">Underground Power / OFC Cable</option>
                  <option value="Gas Pipeline">Natural Gas (MDPE) Pipeline</option>
                  <option value="Drainage">Stormwater Drainage / Culvert Overhaul</option>
                  <option value="Sewage Repair">Underground Drainage Trunk Main</option>
                  <option value="Road Maintenance">Road Milling / Asphalt Resurfacing</option>
                  <option value="Emergency">Emergency Critical Repair</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Technical Justification &amp; Scope <span className="text-[#EA4335]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the technical reason for road excavation, existing utility failure, or public service urgency..."
                  value={reasonDescription}
                  onChange={(e) => setReasonDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & GIS Coordinates */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0] flex items-center justify-between">
              <span>2. Location &amp; Spatial Alignment (Pune GIS)</span>
              <span className="text-[10px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full">
                Auto-Calibrated for Pune
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Road Corridor <span className="text-[#EA4335]">*</span>
                </label>
                <select
                  value={roadId}
                  onChange={(e) => handleRoadChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
                >
                  {roads.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.road_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Locality / Ward <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Priority Rating <span className="text-[#EA4335]">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-semibold"
                >
                  <option value="Low">Low (Scheduled Improvement)</option>
                  <option value="Medium">Medium (Standard Routine)</option>
                  <option value="High">High (Impending Outage)</option>
                  <option value="Emergency">Emergency (Active Pipeline Rupture / Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Latitude (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Longitude (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Estimated Civil Cost (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Temporal Windows & Trench Dimensions */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0]">
              3. Temporal Windows &amp; Trench Dimensions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Proposed Start Date <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={proposedStartDate}
                  onChange={(e) => setProposedStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Expected Duration (Days) <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={expectedDurationDays}
                  onChange={(e) => setExpectedDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Trench Length (Meters) <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={excavationLengthMeters}
                  onChange={(e) => setExcavationLengthMeters(parseFloat(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Excavation Depth (Meters)
                </label>
                <input
                  type="number"
                  min="0.2"
                  max="10"
                  step="0.1"
                  value={excavationDepthMeters}
                  onChange={(e) => setExcavationDepthMeters(parseFloat(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Site Contact & Restoration Notes */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0]">
              4. Operational Contact &amp; Site Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Site Contact Person <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Site Contact Phone <span className="text-[#EA4335]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Estimated Road Restoration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={estimatedRestorationDays}
                  onChange={(e) => setEstimatedRestorationDays(parseInt(e.target.value) || 2)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#202124] mb-1.5">
                  Supporting Notes / Traffic Management Plan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traffic diversion proposed to single lane; night-work block requested."
                  value={supportingNotes}
                  onChange={(e) => setSupportingNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#DADCE0]">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="px-5 py-2.5 text-xs font-bold text-[#5F6368] bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Conflicts...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#FBBC04]" />
                  Submit &amp; Scan Conflicts
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Post-Submission Result Modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#DADCE0] p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#202124]">Request Registered!</h3>
                <p className="text-xs text-[#1A73E8] font-bold">{submissionResult.requestCode}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#5F6368] font-medium">Deterministic Conflict Engine:</span>
                <span className="font-bold text-[#202124]">Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5F6368] font-medium">Clashing Projects Detected:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold ${
                    submissionResult.conflictsDetected > 0
                      ? 'bg-[#FEF7E0] text-[#7A4B04]'
                      : 'bg-[#E6F4EA] text-[#137333]'
                  }`}
                >
                  {submissionResult.conflictsDetected} Alert(s)
                </span>
              </div>
            </div>

            {submissionResult.conflictsDetected > 0 ? (
              <p className="text-xs text-[#7A4B04] bg-[#FEF7E0] p-3 rounded-2xl border border-[#FBBC04]/40 leading-relaxed font-medium">
                Inter-departmental overlap found! You can review the conflict matching breakdown or proceed directly to coordination scheduling.
              </p>
            ) : (
              <p className="text-xs text-[#137333] bg-[#E6F4EA] p-3 rounded-2xl border border-[#CEEAD6] leading-relaxed font-medium">
                No spatial or temporal clashes detected on this corridor for the specified timeframe.
              </p>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => navigate(`/requests/${submissionResult.requestId}`)}
                className="flex-1 py-2.5 text-xs font-bold text-[#202124] bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer"
              >
                View Request
              </button>
              <button
                onClick={() => navigate('/conflicts')}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl cursor-pointer"
              >
                Inspect Conflicts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
