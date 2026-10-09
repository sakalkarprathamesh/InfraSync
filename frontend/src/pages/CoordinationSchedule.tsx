import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { CoordinationProposal } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoordinationSchedule: React.FC = () => {
  const { user, isAdmin, isDepartmentUser } = useAuth();
  const [proposals, setProposals] = useState<CoordinationProposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Department Decision modal
  const [votingProposalId, setVotingProposalId] = useState<number | null>(null);
  const [decisionChoice, setDecisionChoice] = useState<'Accept' | 'Reject' | 'Request Changes'>('Accept');
  const [decisionComment, setDecisionComment] = useState('');

  // Admin Confirmation modal
  const [confirmProposal, setConfirmProposal] = useState<CoordinationProposal | null>(null);
  const [confirmedStartDate, setConfirmedStartDate] = useState('');
  const [confirmedEndDate, setConfirmedEndDate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [trafficAdvisory, setTrafficAdvisory] = useState('');
  const [confirming, setConfirming] = useState<boolean>(false);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await api.getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleSubmitDecision = async () => {
    if (!votingProposalId) return;
    try {
      await api.submitProposalDecision(votingProposalId, {
        decision: decisionChoice,
        comments: decisionComment,
      });
      setVotingProposalId(null);
      setDecisionComment('');
      await fetchProposals();
    } catch (err: any) {
      alert(`Error recording decision: ${err.message}`);
    }
  };

  const handleAdminConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmProposal) return;
    try {
      setConfirming(true);
      await api.confirmProposalSchedule(confirmProposal.id, {
        confirmed_start_date: confirmedStartDate,
        confirmed_end_date: confirmedEndDate,
        admin_notes: adminNotes,
        traffic_advisory: trafficAdvisory,
      });
      setConfirmProposal(null);
      await fetchProposals();
    } catch (err: any) {
      alert(`Error confirming schedule: ${err.message}`);
    } finally {
      setConfirming(false);
    }
  };

  const openAdminConfirmModal = (p: CoordinationProposal) => {
    setConfirmProposal(p);
    setConfirmedStartDate(p.proposed_start_date);
    setConfirmedEndDate(p.proposed_end_date);
    setAdminNotes(`Confirmed by Municipal Administration for shared trenching on ${p.primary_request?.road_name || 'corridor'}.`);
    setTrafficAdvisory(`Single-lane traffic diversion active between 10:00 PM and 06:00 AM on ${p.primary_request?.road_name || 'road'}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Coordination & Unified Scheduling
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              Decision-Support Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Transparent inter-agency scheduling to consolidate separate excavations into single shared road-digging windows.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <CalendarClock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Coordination Proposals Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Proposals are generated when overlapping excavation requests are identified on the same road corridor.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((p) => {
            const isConfirmed = p.status === 'Confirmed by Admin';
            return (
              <div
                key={p.id}
                className={`p-6 bg-white rounded-xl border transition-all shadow-sm space-y-5 ${
                  isConfirmed ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                {/* Proposal Title & Status Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {p.proposal_code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Accepted by Departments'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{p.title}</h2>
                    <p className="text-xs text-slate-500">
                      Coordinating Corridor:{' '}
                      <strong className="text-slate-800">{p.primary_request?.road_name}</strong>
                    </p>
                  </div>

                  {/* Feasibility & Estimated Savings Pills */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-center">
                      <span className="block text-[10px] font-bold text-blue-700 uppercase">
                        Feasibility Score
                      </span>
                      <span className="text-base font-bold text-blue-900">
                        {p.feasibility_score}%
                      </span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                      <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                        Estimated Savings
                      </span>
                      <span className="text-base font-bold text-emerald-900">
                        ₹{(p.estimated_savings_inr || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Coordinated Window Timeline Visualizer */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      Recommended Shared Excavation Corridor
                    </span>
                    <span className="font-mono text-slate-600 font-bold">
                      {p.proposed_start_date} → {p.proposed_end_date} ({p.combined_duration_days} Days)
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {p.shared_excavation_window_desc}
                  </p>
                </div>

                {/* The Two Consolidated Requests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Primary Request */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">{p.primary_request?.request_code}</span>
                      <span className="text-slate-500">{p.primary_request?.work_type}</span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{p.primary_request?.title}</p>
                    <p className="text-slate-600">
                      Agency: <strong>{p.primary_request?.department_name}</strong>
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      Proposed Window: {p.primary_request?.proposed_start_date} to {p.primary_request?.proposed_end_date}
                    </p>
                  </div>

                  {/* Secondary Request */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">{p.secondary_request?.request_code}</span>
                      <span className="text-slate-500">{p.secondary_request?.work_type}</span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{p.secondary_request?.title}</p>
                    <p className="text-slate-600">
                      Agency: <strong>{p.secondary_request?.department_name}</strong>
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      Proposed Window: {p.secondary_request?.proposed_start_date} to {p.secondary_request?.proposed_end_date}
                    </p>
                  </div>
                </div>

                {/* Department Decisions & Admin Confirmation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-600">Agency Responses:</span>
                    {p.decisions.length === 0 ? (
                      <span className="text-slate-400 italic">Awaiting departmental reviews</span>
                    ) : (
                      p.decisions.map((d) => (
                        <span
                          key={d.id}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.decision === 'Accept'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {d.department_name.split(' ')[0]}: {d.decision}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Department user review button */}
                    {isDepartmentUser && !isConfirmed && (
                      <button
                        onClick={() => setVotingProposalId(p.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        Submit Agency Decision
                      </button>
                    )}

                    {/* Admin confirm button */}
                    {isAdmin && !isConfirmed && (
                      <button
                        onClick={() => openAdminConfirmModal(p)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                      >
                        Confirm Unified Schedule
                      </button>
                    )}

                    {isConfirmed && (
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Unified Schedule Confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Department Decision Modal */}
      {votingProposalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Submit Department Review</h3>
            <p className="text-xs text-slate-500">
              State whether your agency accepts the consolidated excavation window or requests modification.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionChoice('Accept')}
                className={`py-2 rounded-lg text-xs font-bold border ${
                  decisionChoice === 'Accept'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Accept Window
              </button>
              <button
                type="button"
                onClick={() => setDecisionChoice('Request Changes')}
                className={`py-2 rounded-lg text-xs font-bold border ${
                  decisionChoice === 'Request Changes'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Change Dates
              </button>
              <button
                type="button"
                onClick={() => setDecisionChoice('Reject')}
                className={`py-2 rounded-lg text-xs font-bold border ${
                  decisionChoice === 'Reject'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Reject Joint Work
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Comments or operational constraints (e.g. night shut-down requirements)..."
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setVotingProposalId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Confirm Schedule Modal */}
      {confirmProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                Confirm Unified Excavation Schedule
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As Municipal Administrator, approving this proposal will lock the coordinated excavation window, update statuses to <strong>Scheduled</strong>, and publish municipal traffic advisories.
            </p>

            <form onSubmit={handleAdminConfirm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirmed Start Date</label>
                  <input
                    type="date"
                    required
                    value={confirmedStartDate}
                    onChange={(e) => setConfirmedStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirmed End Date</label>
                  <input
                    type="date"
                    required
                    value={confirmedEndDate}
                    onChange={(e) => setConfirmedEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipal Traffic Advisory</label>
                <input
                  type="text"
                  required
                  value={trafficAdvisory}
                  onChange={(e) => setTrafficAdvisory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Commissioner Order & Administrative Notes</label>
                <textarea
                  rows={2}
                  required
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setConfirmProposal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirming}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {confirming ? 'Confirming...' : 'Confirm & Authorize Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
