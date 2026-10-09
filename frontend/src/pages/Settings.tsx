import React from 'react';
import {
  GraduationCap,
  Users,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Server,
  Database
} from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Information &amp; Academic PBL Profile
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Project-Based Learning documentation, software architecture, and design thinking framework.
        </p>
      </div>

      {/* College Project Meta Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>MIT School of Computing • Department of Computer Science &amp; Engineering</span>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight">
            INFRASYNC — AI-POWERED URBAN ROAD EXCAVATION COORDINATION SYSTEM
          </h2>
          <p className="text-amber-400 font-semibold text-sm italic mt-1">
            “Coordinate infrastructure work before the road is dug.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Faculty Guide</span>
            <span className="font-bold text-white text-sm">Dr. Tejaswani Bhosale</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Class / Group ID</span>
            <span className="font-bold text-amber-300 text-sm font-mono">SY904</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Student Development Team</span>
            <span className="font-bold text-white">
              Prathamesh • Chaitanya • Sharvari • Shravani
            </span>
          </div>
        </div>
      </div>

      {/* Design Thinking Process (Stage 1 to Stage 5) */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>The 5 Stages of Design Thinking Applied to Urban Road Excavation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Stage 1: Empathize */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800 uppercase block w-fit">
              Stage 1: Empathize
            </span>
            <h3 className="font-bold text-slate-900">Stakeholder Pain Points</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Mapped uncoordinated planning between Water, Electricity, Gas, Telecom, and Road departments causing repeated asphalt cutting and public traffic chaos.
            </p>
          </div>

          {/* Stage 2: Define */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-100 text-indigo-800 uppercase block w-fit">
              Stage 2: Define
            </span>
            <h3 className="font-bold text-slate-900">Problem Statement</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Lack of a centralized right-of-way registry leads to fresh asphalt repaving being dug up days later by adjacent utility agencies.
            </p>
          </div>

          {/* Stage 3: Ideate */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 text-purple-800 uppercase block w-fit">
              Stage 3: Ideate
            </span>
            <h3 className="font-bold text-slate-900">Coordination Engine</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Conceptualized deterministic spatial proximity, temporal interval overlap detection, and explainable joint scheduling windows.
            </p>
          </div>

          {/* Stage 4: Prototype */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 uppercase block w-fit">
              Stage 4: Prototype
            </span>
            <h3 className="font-bold text-slate-900">Infrasync Full-Stack</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Engineered connected FastAPI backend, SQLite/PostgreSQL relational schema, React UI, and OpenStreetMap GIS with 15+ verified Pune corridors.
            </p>
          </div>

          {/* Stage 5: Test */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-800 uppercase block w-fit">
              Stage 5: Test
            </span>
            <h3 className="font-bold text-slate-900">Automated Verification</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Validated end-to-end with 13 automated Pytest test cases covering collision algorithms, sequential windows, and restoration audits.
            </p>
          </div>
        </div>
      </div>

      {/* Implemented Features vs Future Scope Matrix */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Engineering Scope Matrix: Implemented Prototype vs. Future Research Scope
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Column 1: Implemented Functionality */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fully Operational &amp; Tested In Prototype</span>
            </div>

            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Role-Based Access Control (Municipal Admin, Department Officer, Citizen Viewer)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Deterministic Haversine Spatial Collision Matrix (&lt;150m road proximity)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Sequential Excavation Prevention Rule (flags works within 14-day window on same road)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Explainable Joint Scheduling &amp; Feasibility Recommendation Engine</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Interactive OpenStreetMap Leaflet GIS with Pune Corridor Overlays</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Distinct Road Restoration Lifecycle &amp; Municipal Pavement Inspection Certification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Inter-Agency Collaboration Discussion Threads &amp; In-App Notification Center</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Future Scope */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-600 font-bold">
              <Clock className="w-4 h-4" />
              <span>Planned Future Industry Enhancements</span>
            </div>

            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-mono">→</span>
                <span>Live Google Maps / TomTom Traffic Congestion API integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-mono">→</span>
                <span>IoT Road Surface Vibration &amp; Pavement Settlement Sensors</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-mono">→</span>
                <span>Satellite Synthetic Aperture Radar (InSAR) ground subsidence detection</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-mono">→</span>
                <span>Production SMS Gateway (e.g. CDAC / Gov SMS) integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-mono">→</span>
                <span>Full Digital Twin 3D BIM Subsurface Pipe Modeling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
