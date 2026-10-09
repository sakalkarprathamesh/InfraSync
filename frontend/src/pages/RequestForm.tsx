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
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Requests Registry
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <FilePlus className="w-4 h-4" />
            <span>PMC Right-of-Way Registry</span>
          </div>
          <h1 className="text-xl font-bold mt-1">Submit Road Excavation Request</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Register your department’s planned utility trenching. Infrasync will automatically scan for overlapping works and calculate candidate coordination windows.
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Validation Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Basic Project Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              1. Project Details & Sponsoring Agency
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Excavation Request Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Avenue 400mm Feeder Water Pipeline Leak Repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Utility Agency <span className="text-red-500">*</span>
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  disabled={user?.role === 'department_user'}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {user?.role === 'department_user' && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Locked to your authenticated department persona.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Type of Infrastructure Work <span className="text-red-500">*</span>
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Justification & Scope <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the technical reason for road excavation, existing utility failure, or public service urgency..."
                  value={reasonDescription}
                  onChange={(e) => setReasonDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & GIS Coordinates */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>2. Location & Spatial Alignment (Pune GIS)</span>
              <span className="text-[10px] font-normal text-slate-500">Auto-calibrated for verified Pune roads</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Road Corridor <span className="text-red-500">*</span>
                </label>
                <select
                  value={roadId}
                  onChange={(e) => handleRoadChange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  {roads.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.road_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Locality / Municipal Ward <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Priority Rating <span className="text-red-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Low">Low (Scheduled Improvement)</option>
                  <option value="Medium">Medium (Standard Routine)</option>
                  <option value="High">High (Impending Outage)</option>
                  <option value="Emergency">Emergency (Active Pipeline Rupture / Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Latitude (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Longitude (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Civil Cost (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Temporal Planning & Excavation Dimensions */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              3. Temporal Windows & Trench Dimensions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposed Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={proposedStartDate}
                  onChange={(e) => setProposedStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={expectedDurationDays}
                  onChange={(e) => setExpectedDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trench Length (Meters) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={excavationLengthMeters}
                  onChange={(e) => setExcavationLengthMeters(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Excavation Depth (Meters)
                </label>
                <input
                  type="number"
                  min="0.2"
                  max="10"
                  step="0.1"
                  value={excavationDepthMeters}
                  onChange={(e) => setExcavationDepthMeters(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Site Contact & Restoration Notes */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              4. Operational Contact & Site Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Road Restoration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={estimatedRestorationDays}
                  onChange={(e) => setEstimatedRestorationDays(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supporting Notes / Traffic Management Plan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traffic diversion proposed to single lane; night-work block requested."
                  value={supportingNotes}
                  onChange={(e) => setSupportingNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Conflicts...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Submit & Scan Conflicts
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Post-Submission Result Modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Request Registered!</h3>
                <p className="text-xs text-slate-500 font-mono">{submissionResult.requestCode}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Deterministic Conflict Engine:</span>
                <span className="font-bold text-slate-900">Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Clashing Projects Detected:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    submissionResult.conflictsDetected > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {submissionResult.conflictsDetected} Alert(s)
                </span>
              </div>
            </div>

            {submissionResult.conflictsDetected > 0 ? (
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 leading-relaxed">
                Inter-departmental overlap found! You can review the conflict matching breakdown or proceed directly to coordination scheduling.
              </p>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                No spatial or temporal clashes detected on this corridor for the specified timeframe.
              </p>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => navigate(`/requests/${submissionResult.requestId}`)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                View Request
              </button>
              <button
                onClick={() => navigate('/conflicts')}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
