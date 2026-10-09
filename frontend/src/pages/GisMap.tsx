import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  ExternalLink,
  Info,
  Calendar,
  Building2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';
import { Department } from '../types';

export const GisMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centered on Pune City (FC Road / Shivaji Nagar area)
    const map = L.map(mapContainerRef.current, {
      center: [18.5284, 73.8440],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pune Municipal GIS',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Fetch Departments & GeoJSON Projects
  const loadData = async () => {
    try {
      setLoading(true);
      const [depts, geojson] = await Promise.all([
        api.getDepartments(),
        api.getMapProjects(),
      ]);
      setDepartments(depts);
      setProjectsData(geojson.features || []);
    } catch (err) {
      console.error('Error loading GIS map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3. Render markers whenever projectsData or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = projectsData.filter((feat) => {
      const p = feat.properties;
      if (selectedDept !== 'All' && String(p.department_id) !== selectedDept) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (selectedPriority !== 'All' && p.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchRoad = p.road_name.toLowerCase().includes(q);
        const matchLocality = p.locality.toLowerCase().includes(q);
        if (!matchTitle && !matchRoad && !matchLocality) return false;
      }
      return true;
    });

    filtered.forEach((feat) => {
      const coords = feat.geometry.coordinates; // [lon, lat]
      const p = feat.properties;
      const lat = coords[1];
      const lon = coords[0];

      // Custom circular SVG marker with department color
      const markerHtml = `
        <div style="
          background-color: ${p.department_color || '#2563EB'};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          cursor: pointer;
        ">
          ${p.department_code?.charAt(0) || '•'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lon], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 4px;">
          <div style="font-weight: bold; color: #2563EB; font-family: monospace;">${p.request_code}</div>
          <div style="font-weight: 700; color: #0F172A; margin: 2px 0 4px 0;">${p.title}</div>
          <div style="color: #475569; margin-bottom: 2px;"><strong>Corridor:</strong> ${p.road_name}</div>
          <div style="color: #475569; margin-bottom: 2px;"><strong>Dept:</strong> ${p.department_name}</div>
          <div style="color: #475569; margin-bottom: 4px;"><strong>Dates:</strong> ${p.proposed_start_date} to ${p.proposed_end_date}</div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px;">
            <span style="background: #E2E8F0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${p.status}</span>
            <span style="color: #2563EB; font-weight: bold; font-size: 11px;">Click to view</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedFeature(feat);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [projectsData, selectedDept, selectedStatus, selectedPriority, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSearchQuery('');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([18.5284, 73.8440], 13);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              GIS Interactive Excavation Map
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              Pune OpenStreetMap GIS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic visualization of ongoing, scheduled, and proposed right-of-way excavations across Pune.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Map
          </button>
        </div>
      </div>

      {/* Map Filter Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Search Road or Locality
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Central Avenue, Baner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Department Filter
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
            Project Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Submitted">Submitted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Restoration Pending">Restoration Pending</option>
            <option value="Restoration Verified">Restoration Verified</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Priority Tier
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="All">All Priorities</option>
            <option value="Emergency">Emergency Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Map & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leaflet Map Canvas (3 spans) */}
        <div className="lg:col-span-3 h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Department Legend Overlay in bottom-left */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200/90 shadow-md max-w-xs text-[11px]">
            <span className="font-bold text-slate-800 block mb-1.5">Department Legend:</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {departments.map((d) => (
                <div key={d.id} className="flex items-center space-x-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate text-slate-700 font-medium">
                    {d.name.split(' ')[1] || d.code}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 border-t pt-1">
              * Demonstration data mapped to verified Pune road alignments.
            </p>
          </div>
        </div>

        {/* Selected Project Inspector Card (1 span) */}
        <div className="h-[520px] p-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Inspector
            </h2>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {selectedFeature ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 block">
                  {selectedFeature.properties.request_code}
                </span>
                <h3 className="font-bold text-slate-900 mt-0.5">
                  {selectedFeature.properties.title}
                </h3>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-bold flex items-center space-x-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedFeature.properties.department_color }}
                    />
                    <span>{selectedFeature.properties.department_name.replace(' Department', '')}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Corridor:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedFeature.properties.road_name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-slate-100">
                    {selectedFeature.properties.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Priority:</span>
                  <span className="font-bold">{selectedFeature.properties.priority}</span>
                </div>

                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 font-medium">Duration:</span>
                  <span>{selectedFeature.properties.duration_days} Days ({selectedFeature.properties.length_meters}m)</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Window:</span>
                  <span>
                    {selectedFeature.properties.proposed_start_date} to {selectedFeature.properties.proposed_end_date}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Scope:</span>
                <p className="mt-0.5 text-slate-700 leading-relaxed text-[11px]">
                  {selectedFeature.properties.reason}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/requests/${selectedFeature.properties.id}`)}
                  className="w-full py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1 shadow-sm"
                >
                  <span>Open Full Specifications</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs px-4">
              <MapPin className="w-8 h-8 mb-2 text-slate-300 animate-bounce" />
              <p className="font-semibold text-slate-700">Click Any Map Marker</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Select an excavation pin on the map to inspect project specifications and coordination status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
