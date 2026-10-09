import React, { useState, useEffect } from 'react';
import {
  MessageSquareShare,
  Send,
  Building2,
  Calendar,
  FileText,
  Sparkles,
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { ProjectDiscussion, CoordinationProposal, ExcavationRequest } from '../types';
import { useAuth } from '../context/AuthContext';

export const DepartmentCollaboration: React.FC = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<CoordinationProposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [discussions, setDiscussions] = useState<ProjectDiscussion[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCoordNote, setIsCoordNote] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);

  useEffect(() => {
    async function loadProposals() {
      try {
        setLoading(true);
        const data = await api.getProposals();
        setProposals(data);
        if (data.length > 0) {
          setSelectedProposalId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load proposals for collaboration:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProposals();
  }, []);

  const fetchDiscussions = async (propId: number) => {
    try {
      const msgs = await api.getDiscussions({ coordination_proposal_id: propId });
      setDiscussions(msgs);
    } catch (err) {
      console.error('Failed to load discussions:', err);
    }
  };

  useEffect(() => {
    if (selectedProposalId) {
      fetchDiscussions(selectedProposalId);
    }
  }, [selectedProposalId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProposalId) return;

    try {
      setPosting(true);
      await api.postDiscussion({
        coordination_proposal_id: selectedProposalId,
        message: newMessage.trim(),
        is_coordination_note: isCoordNote,
      });
      setNewMessage('');
      await fetchDiscussions(selectedProposalId);
    } catch (err: any) {
      alert(`Error posting message: ${err.message}`);
    } finally {
      setPosting(false);
    }
  };

  const selectedProposal = proposals.find((p) => p.id === selectedProposalId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Department Collaboration
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded uppercase">
              Inter-Agency Channels
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Dedicated project-linked discussion threads and official coordination action notes.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <MessageSquareShare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Active Coordination Threads</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Collaboration threads open automatically when coordination proposals are created.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Proposals Selector */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Active Project Coordination Channels
            </h2>
            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {proposals.map((p) => {
                const isSelected = p.id === selectedProposalId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProposalId(p.id)}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-blue-600 font-bold">{p.proposal_code}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-white border text-slate-700">
                        {p.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Corridor: <strong>{p.primary_request?.road_name}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (2 spans): Thread Conversation Canvas */}
          <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Thread Header */}
            {selectedProposal && (
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {selectedProposal.proposal_code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedProposal.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Coordinating: {selectedProposal.primary_request?.department_name} &amp; {selectedProposal.secondary_request?.department_name}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-600 hidden sm:block">
                  Window: {selectedProposal.proposed_start_date} to {selectedProposal.proposed_end_date}
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
              {discussions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                  <p>No messages posted in this coordination thread yet.</p>
                  <p className="text-[11px] mt-1">Start by adding site inspection or timing notes below.</p>
                </div>
              ) : (
                discussions.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      msg.is_coordination_note
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800'
                    } shadow-xs`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-black/5">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: msg.department_color || '#2563EB' }}
                        />
                        <span className="font-bold text-slate-900">{msg.user_name}</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({msg.department_name.replace(' Department', '')})
                        </span>
                        {msg.is_coordination_note && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 uppercase">
                            Official Note
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={isCoordNote}
                    onChange={(e) => setIsCoordNote(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Tag as Official Coordination Note</span>
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type inter-agency note, site constraint, or work handover update..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={posting || !newMessage.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
