import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Play,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
  Sparkles,
  Filter,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api/client';
import { ConflictMatch } from '../types';
import { useAuth } from '../context/AuthContext';

export const ConflictDetection: React.FC = () => {
  const { user, isDepartmentUser } = useAuth();
  const navigate = useNavigate();

  const [conflicts, setConflicts] = useState<ConflictMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'Active' };
      if (selectedSeverity !== 'All') params.severity = selectedSeverity;
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const data = await api.getConflicts(params);
      setConflicts(data);
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, [selectedSeverity, selectedCategory]);

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisResult(null);
      const res = await api.analyzeConflicts();
      setAnalysisResult(res.message);
      await fetchConflicts();
    } catch (err: any) {
      alert(`Error during analysis: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              Conflict Detection Engine
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#FCE8E6] text-[#EA4335] rounded-full uppercase">
              Deterministic GIS Matrix
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Real-time cross-departmental spatial and temporal collision detection across Pune corridors.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-[#202124] hover:bg-[#3C4043] rounded-2xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <div className="w-3.5 h-3.5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning Corridors...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current text-[#FBBC04]" />
                Run Real-Time Conflict Scan
              </>
            )}
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="p-4 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] text-xs text-[#137333] flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#34A853] flex-shrink-0" />
          <span className="font-medium">{analysisResult}</span>
        </div>
      )}

      {/* Filter Toolbar matching Roomie card */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs text-xs">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="font-bold text-[#5F6368]">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
            >
              <option value="All">All Severities</option>
              <option value="High">High (Immediate Action)</option>
              <option value="Medium">Medium (Coordination Opportunity)</option>
              <option value="Low">Low / Advisory</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-bold text-[#5F6368]">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Direct Spatial & Temporal Overlap">Direct Spatial &amp; Temporal Overlap</option>
              <option value="Nearby Sequential Excavation">Nearby Sequential Excavation</option>
              <option value="Potential Coordination Opportunity">Potential Coordination Opportunity</option>
              <option value="Emergency Priority Warning">Emergency Priority Warning</option>
            </select>
          </div>
        </div>

        <div className="text-[#5F6368] font-medium">
          Showing <span className="font-bold text-[#202124]">{conflicts.length}</span> active conflict alerts
        </div>
      </div>

      {/* Conflicts Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : conflicts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DADCE0] shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-[#34A853] mx-auto mb-2" />
          <h3 className="text-base font-black text-[#202124]">No Road Conflicts Detected</h3>
          <p className="text-xs text-[#5F6368] mt-1 max-w-md mx-auto">
            All submitted projects on Pune corridors have non-overlapping schedules or are situated on distinct road segments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((c) => {
            const isHigh = c.severity === 'High';
            return (
              <div
                key={c.id}
                className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all shadow-xs space-y-4 ${
                  isHigh ? 'border-[#F28B82] ring-1 ring-[#F28B82]/30' : 'border-[#DADCE0]'
                }`}
              >
                {/* Conflict Category & Rule Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DADCE0]">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        c.severity === 'High'
                          ? 'bg-[#FCE8E6] text-[#EA4335]'
                          : c.severity === 'Medium'
                          ? 'bg-[#FEF7E0] text-[#7A4B04]'
                          : 'bg-[#E8F0FE] text-[#1A73E8]'
                      }`}
                    >
                      {c.conflict_category}
                    </span>
                    <span className="text-xs font-bold text-[#202124] flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#1A73E8]" />
                      {c.road_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-[#5F6368] font-mono">
                    <span>Proximity: {c.distance_meters}m</span>
                    {c.days_difference > 0 && <span>Gap: {c.days_difference} days</span>}
                    <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-[#5F6368]">
                      {c.matching_rule}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Request Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Request A Box */}
                  <div
                    onClick={() => navigate(`/requests/${c.request_a?.id}`)}
                    className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] hover:border-[#1A73E8] hover:bg-white cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#1A73E8] font-bold">{c.request_a?.request_code}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#DADCE0] text-[#5F6368]">
                        {c.request_a?.status}
                      </span>
                    </div>
                    <p className="font-bold text-[#202124] truncate">{c.request_a?.title}</p>
                    <p className="text-[#202124] font-medium flex items-center space-x-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.request_a?.department_color || '#1A73E8' }}
                      />
                      <span>{c.request_a?.department_name}</span>
                    </p>
                    <p className="text-[11px] text-[#5F6368]">
                      Window: {c.request_a?.proposed_start_date} to {c.request_a?.proposed_end_date}
                    </p>
                  </div>

                  {/* Request B Box */}
                  <div
                    onClick={() => navigate(`/requests/${c.request_b?.id}`)}
                    className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] hover:border-[#1A73E8] hover:bg-white cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#1A73E8] font-bold">{c.request_b?.request_code}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#DADCE0] text-[#5F6368]">
                        {c.request_b?.status}
                      </span>
                    </div>
                    <p className="font-bold text-[#202124] truncate">{c.request_b?.title}</p>
                    <p className="text-[#202124] font-medium flex items-center space-x-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.request_b?.department_color || '#FBBC04' }}
                      />
                      <span>{c.request_b?.department_name}</span>
                    </p>
                    <p className="text-[11px] text-[#5F6368]">
                      Window: {c.request_b?.proposed_start_date} to {c.request_b?.proposed_end_date}
                    </p>
                  </div>
                </div>

                {/* Explanation & Actionable Recommendation */}
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 bg-[#FEF7E0] border border-[#FBBC04]/40 rounded-2xl text-[#7A4B04] leading-relaxed">
                    <strong className="block text-[11px] uppercase tracking-wider text-[#7A4B04] mb-0.5">
                      Collision Explanation:
                    </strong>
                    {c.explanation}
                  </div>

                  <div className="p-3.5 bg-[#E8F0FE] border border-[#DADCE0] rounded-2xl text-[#1A73E8] leading-relaxed">
                    <strong className="block text-[11px] uppercase tracking-wider text-[#1A73E8] mb-0.5">
                      Decision-Support Recommendation:
                    </strong>
                    {c.recommended_action}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <Link
                    to="/coordination"
                    className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl transition-all shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Coordinate Joint Schedule
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
