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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Conflict Detection Engine
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded uppercase">
              Deterministic GIS Matrix
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time cross-departmental spatial and temporal collision detection across Pune corridors.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <div className="w-3.5 h-3.5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning Corridors...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Run Real-Time Conflict Scan
              </>
            )}
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{analysisResult}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center space-x-3">
          <div>
            <label className="font-semibold text-slate-600 mr-2">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Severities</option>
              <option value="High">High (Immediate Action)</option>
              <option value="Medium">Medium (Coordination Opportunity)</option>
              <option value="Low">Low / Advisory</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-600 mr-2">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Categories</option>
              <option value="Direct Spatial & Temporal Overlap">Direct Spatial & Temporal Overlap</option>
              <option value="Nearby Sequential Excavation">Nearby Sequential Excavation</option>
              <option value="Potential Coordination Opportunity">Potential Coordination Opportunity</option>
              <option value="Emergency Priority Warning">Emergency Priority Warning</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{conflicts.length}</span> active conflict alerts
        </div>
      </div>

      {/* Conflicts Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : conflicts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Road Conflicts Detected</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
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
                className={`p-5 bg-white rounded-xl border transition-all shadow-sm space-y-4 ${
                  isHigh ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                {/* Conflict Category & Rule Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        c.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : c.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.conflict_category}
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {c.road_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                    <span>Proximity: {c.distance_meters}m</span>
                    {c.days_difference > 0 && <span>Gap: {c.days_difference} days</span>}
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">
                      {c.matching_rule}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Request Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Request A Box */}
                  <div
                    onClick={() => navigate(`/requests/${c.request_a?.id}`)}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-blue-600 font-mono">{c.request_a?.request_code}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border text-slate-600">
                        {c.request_a?.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{c.request_a?.title}</p>
                    <p className="text-slate-600 font-medium flex items-center space-x-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.request_a?.department_color || '#2563EB' }}
                      />
                      <span>{c.request_a?.department_name}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Window: {c.request_a?.proposed_start_date} to {c.request_a?.proposed_end_date}
                    </p>
                  </div>

                  {/* Request B Box */}
                  <div
                    onClick={() => navigate(`/requests/${c.request_b?.id}`)}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-blue-600 font-mono">{c.request_b?.request_code}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border text-slate-600">
                        {c.request_b?.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{c.request_b?.title}</p>
                    <p className="text-slate-600 font-medium flex items-center space-x-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.request_b?.department_color || '#D97706' }}
                      />
                      <span>{c.request_b?.department_name}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Window: {c.request_b?.proposed_start_date} to {c.request_b?.proposed_end_date}
                    </p>
                  </div>
                </div>

                {/* Explanation & Actionable Recommendation */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg text-amber-900 leading-relaxed">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-800 mb-0.5">
                      Collision Explanation:
                    </strong>
                    {c.explanation}
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-lg text-blue-950 leading-relaxed">
                    <strong className="block text-[11px] uppercase tracking-wider text-blue-800 mb-0.5">
                      Decision-Support Recommendation:
                    </strong>
                    {c.recommended_action}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <Link
                    to="/coordination"
                    className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
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
