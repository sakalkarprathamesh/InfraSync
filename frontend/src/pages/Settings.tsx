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
      <div className="pb-2 border-b border-[#DADCE0]">
        <h1 className="text-2xl font-black text-[#202124] tracking-tight">
          System Information &amp; Academic PBL Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
          Project-Based Learning documentation, software architecture, and design thinking framework.
        </p>
      </div>

      {/* College Project Meta Card matching Roomie dark banner */}
      <div className="p-6 sm:p-8 bg-[#202124] text-white rounded-3xl border border-[#3C4043] shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-[#34A853] text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#34A853]" />
          <span>MIT School of Computing • Department of Computer Science &amp; Engineering</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            INFRASYNC — AI-POWERED URBAN ROAD EXCAVATION COORDINATION SYSTEM
          </h2>
          <p className="text-[#FBBC04] font-bold text-sm italic mt-1">
            “Coordinate infrastructure work before the road is dug.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#3C4043] text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Faculty Guide</span>
            <span className="font-bold text-white text-sm">Dr. Tejaswani Bhosale</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Class / Group ID</span>
            <span className="font-bold text-[#FBBC04] text-sm">SY904</span>
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
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DADCE0] shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#202124] uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-[#FBBC04]" />
          <span>The 5 Stages of Design Thinking Applied to Urban Road Excavation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Stage 1: Empathize */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#E8F0FE] text-[#1A73E8] uppercase block w-fit">
              Stage 1: Empathize
            </span>
            <h3 className="font-bold text-[#202124]">Stakeholder Pain Points</h3>
            <p className="text-[#5F6368] text-[11px] leading-relaxed">
              Mapped uncoordinated planning between Water, Electricity, Gas, Telecom, and Road departments causing repeated asphalt cutting and public traffic chaos.
            </p>
          </div>

          {/* Stage 2: Define */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#E8F0FE] text-[#1A73E8] uppercase block w-fit">
              Stage 2: Define
            </span>
            <h3 className="font-bold text-[#202124]">Problem Statement</h3>
            <p className="text-[#5F6368] text-[11px] leading-relaxed">
              Lack of a centralized right-of-way registry leads to fresh asphalt repaving being dug up days later by adjacent utility agencies.
            </p>
          </div>

          {/* Stage 3: Ideate */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FEF7E0] text-[#7A4B04] uppercase block w-fit">
              Stage 3: Ideate
            </span>
            <h3 className="font-bold text-[#202124]">Coordination Engine</h3>
            <p className="text-[#5F6368] text-[11px] leading-relaxed">
              Conceptualized deterministic spatial proximity, temporal interval overlap detection, and explainable joint scheduling windows.
            </p>
          </div>

          {/* Stage 4: Prototype */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#E6F4EA] text-[#137333] uppercase block w-fit">
              Stage 4: Prototype
            </span>
            <h3 className="font-bold text-[#202124]">Infrasync Full-Stack</h3>
            <p className="text-[#5F6368] text-[11px] leading-relaxed">
              Engineered connected FastAPI backend, relational schema, React UI with Roomie design tokens, and OpenStreetMap GIS with 15+ verified Pune corridors.
            </p>
          </div>

          {/* Stage 5: Test */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FCE8E6] text-[#EA4335] uppercase block w-fit">
              Stage 5: Test
            </span>
            <h3 className="font-bold text-[#202124]">Automated Verification</h3>
            <p className="text-[#5F6368] text-[11px] leading-relaxed">
              Validated end-to-end with 13 automated Pytest test cases covering collision algorithms, sequential windows, and restoration audits.
            </p>
          </div>
        </div>
      </div>

      {/* Implemented Features vs Future Scope Matrix */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DADCE0] shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider pb-2 border-b border-[#DADCE0]">
          Engineering Scope Matrix: Implemented Prototype vs. Future Research Scope
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Column 1: Implemented Functionality */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#137333] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
              <span>Fully Operational &amp; Tested In Prototype</span>
            </div>

            <ul className="space-y-2.5 text-[#202124]">
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Role-Based Access Control (Municipal Admin, Department Officer, Citizen Viewer)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Deterministic Haversine Spatial Collision Matrix (&lt;150m road proximity)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Sequential Excavation Prevention Rule (flags works within 14-day window on same road)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Explainable Joint Scheduling &amp; Feasibility Recommendation Engine</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Interactive OpenStreetMap Leaflet GIS with Pune Corridor Overlays</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Distinct Road Restoration Lifecycle &amp; Municipal Pavement Inspection Certification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#34A853] font-bold">✓</span>
                <span>Inter-Agency Collaboration Discussion Threads &amp; In-App Notification Center</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Future Scope */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#5F6368] font-bold">
              <Clock className="w-4 h-4 text-[#5F6368]" />
              <span>Planned Future Industry Enhancements</span>
            </div>

            <ul className="space-y-2.5 text-[#5F6368]">
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">→</span>
                <span>Live Google Maps / TomTom Traffic Congestion API integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">→</span>
                <span>IoT Road Surface Vibration &amp; Pavement Settlement Sensors</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">→</span>
                <span>Satellite Synthetic Aperture Radar (InSAR) ground subsidence detection</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">→</span>
                <span>Production SMS Gateway (e.g. CDAC / Gov SMS) integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">→</span>
                <span>Full Digital Twin 3D BIM Subsurface Pipe Modeling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
