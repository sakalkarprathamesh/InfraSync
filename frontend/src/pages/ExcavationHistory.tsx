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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              Excavation &amp; Restoration History
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E8F0FE] text-[#1A73E8] rounded-full uppercase">
              Municipal Archive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Audit archive of past excavations, repeat road cutting trends, and certified surface reinstatements.
          </p>
        </div>
      </div>

      {/* Frequently Excavated Roads Hotspot Analysis */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-[#EA4335]" />
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
            Repeated Road Digging Hotspot Analysis
          </h2>
        </div>
        <p className="text-xs text-[#5F6368]">
          Identifies corridors subject to repeated trenching across multiple utilities. Infrasync highlights these roads to mandate joint coordination prior to permitting future works.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {frequentRoads.slice(0, 5).map((fr) => (
            <div
              key={fr.road_id}
              className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                fr.re_excavation_risk === 'High'
                  ? 'bg-[#FCE8E6] border-[#F28B82] text-[#EA4335]'
                  : fr.re_excavation_risk === 'Moderate'
                  ? 'bg-[#FEF7E0] border-[#FBBC04]/40 text-[#7A4B04]'
                  : 'bg-[#F8F9FA] border-[#DADCE0] text-[#202124]'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="truncate max-w-[120px] text-[#202124]">{fr.road_name.split('(')[0]}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    fr.re_excavation_risk === 'High'
                      ? 'bg-white text-[#EA4335]'
                      : 'bg-white text-[#7A4B04]'
                  }`}
                >
                  {fr.re_excavation_risk} Risk
                </span>
              </div>
              <p className="text-[11px] text-[#5F6368] font-medium">
                {fr.excavation_count} Excavations ({fr.total_meters_dug}m total)
              </p>
              <p className="text-[10px] text-[#5F6368]">
                {fr.distinct_departments_count} Distinct Utilities Involved
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5F6368]" />
            <input
              type="text"
              placeholder="Search history by code, title, or locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#DADCE0]/60 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
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
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Road Corridor
            </label>
            <select
              value={selectedRoad}
              onChange={(e) => setSelectedRoad(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
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
            <label className="block text-[11px] font-bold text-[#5F6368] mb-1">
              Restoration Status
            </label>
            <select
              value={selectedRestoration}
              onChange={(e) => setSelectedRestoration(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DADCE0] rounded-2xl text-[#202124] font-medium"
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
      <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-16 text-center text-[#5F6368] text-xs">
            <p className="font-bold text-[#202124] text-sm">No historical records match filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] border-b border-[#DADCE0] text-[#5F6368] font-bold uppercase tracking-wider text-[11px]">
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
              <tbody className="divide-y divide-[#DADCE0]/50">
                {historyItems.map((h) => (
                  <tr key={h.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1A73E8] whitespace-nowrap">
                      {h.request_code}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#202124] max-w-xs truncate">
                      {h.title}
                      <span className="block text-[11px] text-[#5F6368] font-normal">{h.work_type}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center space-x-1.5 font-bold text-[#202124]">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: h.department_color || '#1A73E8' }}
                        />
                        <span>{h.department_name.replace(' Department', '')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#202124]">
                      <p className="font-bold text-[#202124]">{h.road_name}</p>
                      <p className="text-[11px] text-[#5F6368]">{h.locality}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#5F6368]">
                      {h.start_date} → {h.end_date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#202124] font-semibold">
                      {h.length_meters}m
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          h.coordination_status.includes('Coordinated')
                            ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                            : 'bg-slate-100 text-[#5F6368]'
                        }`}
                      >
                        {h.coordination_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          h.restoration_status === 'Verified Satisfactory'
                            ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                            : h.restoration_status === 'Pending Inspection'
                            ? 'bg-[#FEF7E0] text-[#7A4B04]'
                            : 'bg-slate-100 text-[#5F6368]'
                        }`}
                      >
                        {h.restoration_status}
                      </span>
                      {h.quality_rating && (
                        <span className="block text-[10px] text-[#FBBC04] mt-0.5 font-bold">
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
