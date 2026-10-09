import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Hammer,
  HardHat,
  MapPin,
  ShieldCheck,
  Building2,
  MessageSquare,
  FileCheck2,
  Phone,
  User,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin, isDepartmentUser } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Administrative Review Modal state
  const [reviewAction, setReviewAction] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('');

  // Restoration Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyStatus, setVerifyStatus] = useState<'Verified Satisfactory' | 'Rework Required'>('Verified Satisfactory');
  const [inspectorName, setInspectorName] = useState(user?.name || 'Er. Aniruddha Pawaskar');
  const [verifyNotes, setVerifyNotes] = useState('');

  // Record Completion Modal State
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [contractorName, setContractorName] = useState('');
  const [restoredSurface, setRestoredSurface] = useState('Bituminous Asphalt (Hot Mix)');
  const [qualityRating, setQualityRating] = useState<number>(4);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getRequestDetail(Number(id));
      setRequest(data);
      setNewStatus(data.status);
    } catch (err: any) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAdminReview = async () => {
    if (!reviewAction || !request) return;
    try {
      setSubmittingReview(true);
      await api.reviewRequest(request.id, {
        action: reviewAction,
        notes: reviewNotes,
      });
      setReviewAction(null);
      setReviewNotes('');
      await fetchDetail();
    } catch (err: any) {
      alert(`Error updating review: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!request || newStatus === request.status) return;
    try {
      await api.updateRequestStatus(request.id, {
        status: newStatus,
        notes: `Manual status transition by ${user?.name}`,
      });
      await fetchDetail();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRecordCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    try {
      await api.recordRestorationCompletion({
        request_id: request.id,
        completion_date: new Date().toISOString().split('T')[0],
        contractor_name: contractorName,
        road_surface_restored: restoredSurface,
        restoration_quality_rating: qualityRating,
      });
      setShowCompletionModal(false);
      await fetchDetail();
    } catch (err: any) {
      alert(`Error recording completion: ${err.message}`);
    }
  };

  const handleVerifyRestoration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    try {
      await api.verifyRestoration(request.id, {
        verification_status: verifyStatus,
        inspection_date: new Date().toISOString().split('T')[0],
        inspector_name: inspectorName,
        verification_notes: verifyNotes,
      });
      setShowVerifyModal(false);
      await fetchDetail();
    } catch (err: any) {
      alert(`Error verifying restoration: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
        <p className="font-bold">Error loading request details</p>
        <p className="text-xs mt-1">{error}</p>
        <Link to="/requests" className="mt-3 inline-block text-xs font-bold text-rose-700 underline">
          Back to list
        </Link>
      </div>
    );
  }

  const lifecycleStages = [
    'Submitted',
    'Under Review',
    'Approved',
    'Scheduled',
    'In Progress',
    'Completed',
    'Restoration Pending',
    'Restoration Verified',
  ];
  const currentStageIndex = lifecycleStages.indexOf(request.status);

  return (
    <div className="space-y-6">
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

      {/* Main Header Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-blue-600">
                {request.request_code}
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: request.department_color || '#2563EB' }}
              />
              <span className="text-xs font-bold text-slate-700">
                {request.department_name}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  request.priority === 'Emergency'
                    ? 'bg-red-100 text-red-700'
                    : request.priority === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {request.priority}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{request.title}</h1>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {request.road_name} ({request.locality})
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                request.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'Submitted'
                  ? 'bg-blue-100 text-blue-800'
                  : request.status === 'Scheduled'
                  ? 'bg-indigo-100 text-indigo-800'
                  : request.status === 'In Progress'
                  ? 'bg-amber-100 text-amber-800'
                  : request.status === 'Restoration Verified'
                  ? 'bg-teal-100 text-teal-800'
                  : request.status === 'Restoration Pending'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Status: {request.status}
            </span>
          </div>
        </div>

        {/* Lifecycle Tracker */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Excavation Lifecycle State Machine
          </p>
          <div className="flex items-center justify-between overflow-x-auto py-2">
            {lifecycleStages.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              return (
                <div key={stage} className="flex items-center flex-1 min-w-[100px] last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isPast
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 text-center font-medium ${
                        isCurrent ? 'font-bold text-blue-600' : 'text-slate-500'
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                  {idx < lifecycleStages.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detected Conflicts Alert Banner */}
      {request.conflicts && request.conflicts.length > 0 && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Active Spatial / Temporal Conflicts Detected ({request.conflicts.length})</span>
          </div>
          <div className="space-y-3">
            {request.conflicts.map((c: any) => (
              <div
                key={c.id}
                className="p-3.5 bg-white rounded-lg border border-rose-200 text-xs space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700">{c.conflict_category}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Rule: {c.matching_rule}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{c.explanation}</p>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Recommendation: </span>
                  {c.recommended_action}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">
                    Clashes with: <strong className="text-slate-800">{c.conflicting_request?.request_code}</strong> ({c.conflicting_request?.title})
                  </span>
                  <Link
                    to="/coordination"
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Open Coordination Proposal <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Specifications & Restoration/History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Project Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Work Type</span>
                <span className="font-semibold text-slate-900">{request.work_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Proposed Window</span>
                <span className="font-semibold text-slate-900">
                  {request.proposed_start_date} to {request.proposed_end_date}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Duration</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {request.expected_duration_days} Days
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Excavation Dimensions</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {request.excavation_length_meters}m length × {request.excavation_depth_meters}m depth
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Coordinates</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Estimated Civil Cost</span>
                <span className="font-semibold text-slate-900">
                  ₹{(request.estimated_cost || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-slate-400 text-xs block font-medium mb-1">
                Technical Reason & Justification
              </span>
              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                {request.reason_description}
              </p>
            </div>

            {request.supporting_notes && (
              <div className="pt-1">
                <span className="text-slate-400 text-xs block font-medium mb-1">
                  Supporting Notes & Traffic Advisory
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  {request.supporting_notes}
                </p>
              </div>
            )}
          </div>

          {/* Road Restoration Status Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Hammer className="w-4 h-4 text-purple-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Road Surface Restoration Tracking
                </h2>
              </div>
              {request.restoration ? (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    request.restoration.verification_status === 'Verified Satisfactory'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {request.restoration.verification_status}
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400">
                  Awaiting Excavation Completion
                </span>
              )}
            </div>

            {request.restoration ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block">Restoration Contractor</span>
                    <span className="font-semibold text-slate-900">{request.restoration.contractor_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Surface Material</span>
                    <span className="font-semibold text-slate-900">{request.restoration.road_surface_restored}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Completion Date</span>
                    <span className="font-semibold text-slate-900">{request.restoration.completion_date}</span>
                  </div>
                  {request.restoration.inspector_name && (
                    <div>
                      <span className="text-slate-400 block">Inspecting Engineer</span>
                      <span className="font-semibold text-slate-900">{request.restoration.inspector_name}</span>
                    </div>
                  )}
                  {request.restoration.restoration_quality_rating && (
                    <div>
                      <span className="text-slate-400 block">Pavement Quality Rating</span>
                      <span className="font-semibold text-amber-500 font-mono">
                        {'★'.repeat(request.restoration.restoration_quality_rating)} ({request.restoration.restoration_quality_rating}/5)
                      </span>
                    </div>
                  )}
                </div>

                {request.restoration.verification_notes && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Municipal Inspector Notes:
                    </span>
                    <p className="mt-0.5 text-slate-800">{request.restoration.verification_notes}</p>
                  </div>
                )}

                {/* Admin Verify Button */}
                {isAdmin && request.restoration.verification_status !== 'Verified Satisfactory' && (
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                  >
                    Inspect & Certify Restoration
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center space-y-2">
                <p>Road surface reinstatement has not yet been recorded for this project.</p>
                {isDepartmentUser && ['In Progress', 'Completed', 'Scheduled'].includes(request.status) && (
                  <button
                    onClick={() => setShowCompletionModal(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
                  >
                    Record Civil Completion & Contractor
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Audit Trail / Status History */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Audit Trail & Status History
            </h2>
            <div className="space-y-2.5">
              {request.status_history?.map((h: any) => (
                <div key={h.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      Changed to <span className="text-blue-600">{h.to_status}</span> by {h.changed_by}
                    </p>
                    <p className="text-[11px] text-slate-500">{h.notes}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(h.created_at).toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Administrative Actions & Contact */}
        <div className="space-y-6">
          {/* Admin Decision Actions */}
          {isAdmin && (
            <div className="p-5 bg-slate-900 text-white rounded-xl shadow-md space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Municipal Review Actions</span>
              </div>
              <p className="text-xs text-slate-300">
                You are authenticated as Municipal Administrator with right-of-way decision authority.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setReviewAction('approve')}
                  className="px-3 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Approve Request
                </button>
                <button
                  onClick={() => setReviewAction('reject')}
                  className="px-3 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => setReviewAction('return')}
                  className="px-3 py-2 text-xs font-bold text-slate-900 bg-amber-400 rounded-lg hover:bg-amber-300"
                >
                  Return for Correction
                </button>
                <button
                  onClick={() => setReviewAction('hold')}
                  className="px-3 py-2 text-xs font-bold text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700"
                >
                  Place On Hold
                </button>
              </div>

              {/* Status progression quick dropdown */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Manual Status Override:
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Restoration Pending">Restoration Pending</option>
                    <option value="Restoration Verified">Restoration Verified</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Operational Contact Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Department Contact
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-800">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{request.contact_person}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{request.contact_phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.department_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Review Modal */}
      {reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {reviewAction} Decision
            </h3>
            <p className="text-xs text-slate-600">
              Provide formal decision notes for {request.request_code}. The submitting department will receive immediate notification.
            </p>
            <textarea
              rows={3}
              placeholder="Enter municipal administrative decision notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setReviewAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminReview}
                disabled={submittingReview}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {submittingReview ? 'Recording...' : 'Submit Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Civil Completion</h3>
            <form onSubmit={handleRecordCompletion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contractor / Execution Firm</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M/s Pune Infra Projects Ltd."
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Road Surface Restored</label>
                <select
                  value={restoredSurface}
                  onChange={(e) => setRestoredSurface(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Bituminous Asphalt (Hot Mix)">Bituminous Asphalt (Hot Mix)</option>
                  <option value="Concrete Paving Blocks">Concrete Paving Blocks</option>
                  <option value="Cold Mix Temporary Patch">Cold Mix Temporary Patch</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality Self-Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={qualityRating}
                  onChange={(e) => setQualityRating(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Save Completion Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Restoration Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Certify Road Restoration</h3>
            <form onSubmit={handleVerifyRestoration} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
                <select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  <option value="Verified Satisfactory">Verified Satisfactory (Flush & Level)</option>
                  <option value="Rework Required">Rework Required (Uneven / Depression)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Inspector Name</label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Inspection Notes</label>
                <textarea
                  rows={3}
                  placeholder="Surface level flush with existing asphalt; core density test passed."
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Certify Pavement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
