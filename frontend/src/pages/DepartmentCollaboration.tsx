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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              Department Collaboration
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E8F0FE] text-[#1A73E8] rounded-full uppercase">
              Inter-Agency Channels
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Dedicated project-linked discussion threads and official coordination action notes.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
          <MessageSquareShare className="w-10 h-10 text-[#5F6368] mx-auto mb-2" />
          <h3 className="text-base font-black text-[#202124]">No Active Coordination Threads</h3>
          <p className="text-xs text-[#5F6368] mt-1 max-w-md mx-auto">
            Collaboration threads open automatically when coordination proposals are created.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Proposals Selector */}
          <div className="p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0]">
              Active Project Channels
            </h2>
            <div className="space-y-2.5 max-h-[550px] overflow-y-auto">
              {proposals.map((p) => {
                const isSelected = p.id === selectedProposalId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProposalId(p.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[#E8F0FE]/60 border-[#1A73E8] ring-1 ring-[#1A73E8]'
                        : 'bg-[#F8F9FA] border-[#DADCE0] hover:bg-white hover:border-[#1A73E8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A73E8] font-bold">{p.proposal_code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white border border-[#DADCE0] text-[#5F6368]">
                        {p.status}
                      </span>
                    </div>
                    <p className="font-bold text-[#202124] line-clamp-1">{p.title}</p>
                    <p className="text-[11px] text-[#5F6368]">
                      Corridor: <strong>{p.primary_request?.road_name}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (2 spans): Thread Conversation Canvas */}
          <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-2xl border border-[#DADCE0] shadow-xs overflow-hidden">
            {/* Thread Header */}
            {selectedProposal && (
              <div className="p-4 sm:p-5 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full">
                      {selectedProposal.proposal_code}
                    </span>
                    <span className="text-xs font-bold text-[#202124] truncate">
                      {selectedProposal.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5F6368] mt-1">
                    Coordinating: {selectedProposal.primary_request?.department_name} &amp; {selectedProposal.secondary_request?.department_name}
                  </p>
                </div>
                <div className="text-right text-[11px] text-[#5F6368] hidden sm:block font-medium">
                  Window: {selectedProposal.proposed_start_date} to {selectedProposal.proposed_end_date}
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#F8F9FA]/40">
              {discussions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#5F6368] text-xs">
                  <p className="font-bold text-[#202124]">No messages in this coordination thread yet.</p>
                  <p className="text-[11px] mt-1">Start by adding site inspection or timing notes below.</p>
                </div>
              ) : (
                discussions.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 shadow-2xs ${
                      msg.is_coordination_note
                        ? 'bg-[#FEF7E0] border-[#FBBC04]/40 text-[#7A4B04]'
                        : 'bg-white border-[#DADCE0] text-[#202124]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-black/5">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: msg.department_color || '#1A73E8' }}
                        />
                        <span className="font-bold text-[#202124]">{msg.user_name}</span>
                        <span className="text-[11px] text-[#5F6368] font-medium">
                          ({msg.department_name.replace(' Department', '')})
                        </span>
                        {msg.is_coordination_note && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEF7E0] text-[#7A4B04] border border-[#FBBC04]/40 uppercase">
                            Official Note
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5F6368]">
                        {new Date(msg.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#DADCE0] bg-white space-y-3">
              <div className="flex items-center space-x-2 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer text-[#5F6368] font-bold">
                  <input
                    type="checkbox"
                    checked={isCoordNote}
                    onChange={(e) => setIsCoordNote(e.target.checked)}
                    className="rounded text-[#1A73E8] focus:ring-0"
                  />
                  <span>Tag as Official Coordination Note</span>
                </label>
              </div>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Type inter-agency note, site constraint, or work handover update..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
                />
                <button
                  type="submit"
                  disabled={posting || !newMessage.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl disabled:opacity-50 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
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
