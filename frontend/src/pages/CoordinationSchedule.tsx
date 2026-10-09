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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              Coordination &amp; Unified Scheduling
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E8F0FE] text-[#1A73E8] rounded-full uppercase">
              Decision-Support Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Transparent inter-agency scheduling to consolidate separate excavations into single shared road-digging windows.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
          <CalendarClock className="w-10 h-10 text-[#5F6368] mx-auto mb-2" />
          <h3 className="text-base font-black text-[#202124]">No Coordination Proposals Yet</h3>
          <p className="text-xs text-[#5F6368] mt-1 max-w-md mx-auto">
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
                className={`p-6 bg-white rounded-2xl border transition-all shadow-xs space-y-5 ${
                  isConfirmed ? 'border-[#CEEAD6] bg-[#E6F4EA]/20' : 'border-[#DADCE0]'
                }`}
              >
                {/* Proposal Title & Status Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-[#DADCE0]">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full">
                        {p.proposal_code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isConfirmed
                            ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                            : p.status === 'Accepted by Departments'
                            ? 'bg-[#E8F0FE] text-[#1A73E8]'
                            : 'bg-[#FEF7E0] text-[#7A4B04]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-[#202124] tracking-tight">{p.title}</h2>
                    <p className="text-xs text-[#5F6368]">
                      Coordinating Corridor:{' '}
                      <strong className="text-[#202124]">{p.primary_request?.road_name}</strong>
                    </p>
                  </div>

                  {/* Feasibility & Estimated Savings Pills matching Roomie pill treatments */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="px-3.5 py-2 rounded-2xl bg-[#E8F0FE] border border-[#DADCE0] text-center">
                      <span className="block text-[10px] font-bold text-[#1A73E8] uppercase">
                        Feasibility Score
                      </span>
                      <span className="text-base font-black text-[#1A73E8]">
                        {p.feasibility_score}%
                      </span>
                    </div>

                    <div className="px-3.5 py-2 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] text-center">
                      <span className="block text-[10px] font-bold text-[#137333] uppercase">
                        Estimated Savings
                      </span>
                      <span className="text-base font-black text-[#137333]">
                        ₹{(p.estimated_savings_inr || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Coordinated Window Timeline Visualizer */}
                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#DADCE0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#202124] flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#1A73E8]" />
                      Recommended Shared Excavation Corridor
                    </span>
                    <span className="text-[#202124] font-bold">
                      {p.proposed_start_date} → {p.proposed_end_date} ({p.combined_duration_days} Days)
                    </span>
                  </div>

                  <p className="text-xs text-[#5F6368] leading-relaxed font-medium">
                    {p.shared_excavation_window_desc}
                  </p>
                </div>

                {/* The Two Consolidated Requests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Primary Request */}
                  <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#1A73E8]">{p.primary_request?.request_code}</span>
                      <span className="text-[#5F6368]">{p.primary_request?.work_type}</span>
                    </div>
                    <p className="font-bold text-[#202124] truncate">{p.primary_request?.title}</p>
                    <p className="text-[#202124] font-medium">
                      Agency: <strong>{p.primary_request?.department_name}</strong>
                    </p>
                    <p className="text-[#5F6368] text-[11px]">
                      Proposed Window: {p.primary_request?.proposed_start_date} to {p.primary_request?.proposed_end_date}
                    </p>
                  </div>

                  {/* Secondary Request */}
                  <div className="p-4 rounded-2xl bg-white border border-[#DADCE0] shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#1A73E8]">{p.secondary_request?.request_code}</span>
                      <span className="text-[#5F6368]">{p.secondary_request?.work_type}</span>
                    </div>
                    <p className="font-bold text-[#202124] truncate">{p.secondary_request?.title}</p>
                    <p className="text-[#202124] font-medium">
                      Agency: <strong>{p.secondary_request?.department_name}</strong>
                    </p>
                    <p className="text-[#5F6368] text-[11px]">
                      Proposed Window: {p.secondary_request?.proposed_start_date} to {p.secondary_request?.proposed_end_date}
                    </p>
                  </div>
                </div>

                {/* Department Decisions & Admin Confirmation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#DADCE0] text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#5F6368]">Agency Responses:</span>
                    {p.decisions.length === 0 ? (
                      <span className="text-[#5F6368] italic font-medium">Awaiting departmental reviews</span>
                    ) : (
                      p.decisions.map((d) => (
                        <span
                          key={d.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.decision === 'Accept'
                              ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                              : 'bg-[#FCE8E6] text-[#EA4335]'
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
                        className="px-4 py-2 text-xs font-bold text-[#202124] bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer"
                      >
                        Submit Agency Decision
                      </button>
                    )}

                    {/* Admin confirm button */}
                    {isAdmin && !isConfirmed && (
                      <button
                        onClick={() => openAdminConfirmModal(p)}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#34A853] hover:bg-[#2D8E47] rounded-2xl shadow-xs cursor-pointer"
                      >
                        Confirm Unified Schedule
                      </button>
                    )}

                    {isConfirmed && (
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#34A853]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#DADCE0] p-6 space-y-4">
            <h3 className="text-base font-black text-[#202124]">Submit Department Review</h3>
            <p className="text-xs text-[#5F6368]">
              State whether your agency accepts the consolidated excavation window or requests modification.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionChoice('Accept')}
                className={`py-2.5 rounded-2xl text-xs font-bold border cursor-pointer ${
                  decisionChoice === 'Accept'
                    ? 'bg-[#34A853] text-white border-[#34A853]'
                    : 'bg-white text-[#202124] border-[#DADCE0]'
                }`}
              >
                Accept Window
              </button>
              <button
                type="button"
                onClick={() => setDecisionChoice('Request Changes')}
                className={`py-2.5 rounded-2xl text-xs font-bold border cursor-pointer ${
                  decisionChoice === 'Request Changes'
                    ? 'bg-[#FBBC04] text-[#202124] border-[#FBBC04]'
                    : 'bg-white text-[#202124] border-[#DADCE0]'
                }`}
              >
                Change Dates
              </button>
              <button
                type="button"
                onClick={() => setDecisionChoice('Reject')}
                className={`py-2.5 rounded-2xl text-xs font-bold border cursor-pointer ${
                  decisionChoice === 'Reject'
                    ? 'bg-[#EA4335] text-white border-[#EA4335]'
                    : 'bg-white text-[#202124] border-[#DADCE0]'
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
              className="w-full p-3 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setVotingProposalId(null)}
                className="px-4 py-2 text-xs font-bold text-[#5F6368] bg-slate-100 rounded-2xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl cursor-pointer"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Confirm Schedule Modal */}
      {confirmProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#DADCE0] p-6 space-y-4">
            <div className="flex items-center space-x-2 text-[#34A853]">
              <ShieldCheck className="w-5 h-5 text-[#34A853]" />
              <h3 className="text-base font-black text-[#202124]">
                Confirm Unified Excavation Schedule
              </h3>
            </div>
            <p className="text-xs text-[#5F6368] leading-relaxed">
              As Municipal Administrator, approving this proposal will lock the coordinated excavation window, update statuses to <strong>Scheduled</strong>, and publish municipal traffic advisories.
            </p>

            <form onSubmit={handleAdminConfirm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#202124] mb-1">Confirmed Start Date</label>
                  <input
                    type="date"
                    required
                    value={confirmedStartDate}
                    onChange={(e) => setConfirmedStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DADCE0] rounded-2xl font-medium text-[#202124]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#202124] mb-1">Confirmed End Date</label>
                  <input
                    type="date"
                    required
                    value={confirmedEndDate}
                    onChange={(e) => setConfirmedEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DADCE0] rounded-2xl font-medium text-[#202124]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#202124] mb-1">Municipal Traffic Advisory</label>
                <input
                  type="text"
                  required
                  value={trafficAdvisory}
                  onChange={(e) => setTrafficAdvisory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202124] mb-1">Commissioner Order &amp; Administrative Notes</label>
                <textarea
                  rows={2}
                  required
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DADCE0] rounded-2xl text-[#202124]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setConfirmProposal(null)}
                  className="px-4 py-2 text-xs font-bold text-[#5F6368] bg-slate-100 rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirming}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#34A853] hover:bg-[#2D8E47] rounded-2xl disabled:opacity-50 cursor-pointer"
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
