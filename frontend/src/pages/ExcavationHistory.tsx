import React, { useState, useEffect } from 'react';
import {
  History,
  Building2,
  Calendar,
  Search,
  Hammer,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';
import { Department, Road } from '../types';

export const ExcavationHistory: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [frequentRoads, setFrequentRoads] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRoad, setSelectedRoad] = useState('All');
  const [selectedRestoration, setSelectedRestoration] = useState('All');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDept !== 'All') params.department_id = selectedDept;
      if (selectedRoad !== 'All') params.road_id = selectedRoad;
      if (selectedRestoration !== 'All') params.restoration_status = selectedRestoration;

      const [histData, freqData] = await Promise.all([
        api.getHistory(params),
        api.getFrequentlyExcavatedRoads(),
      ]);
      setHistoryItems(histData);
      setFrequentRoads(freqData);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [depts, rds] = await Promise.all([api.getDepartments(), api.getRoads()]);
        setDepartments(depts);
        setRoads(rds);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [selectedDept, selectedRoad, selectedRestoration]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Excavation & Restoration History
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 rounded uppercase">
              Municipal Archive
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit archive of past excavations, repeat road cutting trends, and certified surface reinstatements.
          </p>
        </div>
      </div>

      {/* Frequently Excavated Roads Hotspot Analysis (Section 17) */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Repeated Road Digging Hotspot Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Identifies corridors subject to repeated trenching across multiple utilities. Infrasync highlights these roads to mandate joint coordination prior to permitting future works.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {frequentRoads.slice(0, 5).map((fr) => (
            <div
              key={fr.road_id}
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                fr.re_excavation_risk === 'High'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : fr.re_excavation_risk === 'Moderate'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="truncate max-w-[120px]">{fr.road_name.split('(')[0]}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    fr.re_excavation_risk === 'High'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {fr.re_excavation_risk} Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {fr.excavation_count} Excavations ({fr.total_meters_dug}m total)
              </p>
              <p className="text-[10px] text-slate-500">
                {fr.distinct_departments_count} Distinct Utilities Involved
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history by code, title, or locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.replace(' Department', '')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Road Corridor
            </label>
            <select
              value={selectedRoad}
              onChange={(e) => setSelectedRoad(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Roads</option>
              {roads.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Restoration Status
            </label>
            <select
              value={selectedRestoration}
              onChange={(e) => setSelectedRestoration(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Restoration States</option>
              <option value="Verified Satisfactory">Verified Satisfactory</option>
              <option value="Pending Inspection">Pending Inspection</option>
              <option value="Not Initiated">Not Initiated</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 text-sm">No historical records match filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Corridor</th>
                  <th className="py-3 px-4">Timeframe</th>
                  <th className="py-3 px-4">Extent</th>
                  <th className="py-3 px-4">Coordination</th>
                  <th className="py-3 px-4">Restoration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyItems.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {h.request_code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {h.title}
                      <span className="block text-[11px] text-slate-400 font-normal">{h.work_type}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center space-x-1.5 font-medium text-slate-800">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: h.department_color || '#2563EB' }}
                        />
                        <span>{h.department_name.replace(' Department', '')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      <p className="font-medium text-slate-800">{h.road_name}</p>
                      <p className="text-[11px] text-slate-400">{h.locality}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                      {h.start_date} → {h.end_date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono">
                      {h.length_meters}m
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          h.coordination_status.includes('Coordinated')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {h.coordination_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.restoration_status === 'Verified Satisfactory'
                            ? 'bg-teal-100 text-teal-800'
                            : h.restoration_status === 'Pending Inspection'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {h.restoration_status}
                      </span>
                      {h.quality_rating && (
                        <span className="block text-[10px] text-amber-500">
                          {'★'.repeat(h.quality_rating)}
                        </span>
                      )}
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
