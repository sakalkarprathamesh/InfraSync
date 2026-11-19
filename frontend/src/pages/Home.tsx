import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  CalendarClock,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 1. Hero Section matching Roomie's exact visual layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badge matching Roomie */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FE] border border-[#DADCE0] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="text-[#202124]">
              Welcome to{' '}
              <span className="font-black text-sm tracking-normal capitalize inline-block text-[#123B70]">
                Infrasync
              </span>
            </span>
          </div>

          {/* Heading matching Roomie's exact scale */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#202124] tracking-tight leading-tight">
            One Road. Many <span className="text-[#1A73E8]">Utilities.</span> One Coordinated{' '}
            <span className="text-[#1A73E8]">Plan.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl mx-auto font-normal">
            Coordinate planned excavations across utility departments, identify overlapping work,
            and plan shared schedules before roads are dug repeatedly.
          </p>

          {/* CTA Buttons matching Roomie */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/coordination"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Coordination</span>
            </Link>

            <button
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-[#DADCE0] text-[#202124] font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>How It Works</span>
            </button>

            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3.5 text-[#5F6368] hover:text-[#202124] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore GIS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Utility Category Shortcuts matching Roomie's exact 4/6 card grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 max-w-5xl mx-auto">
            <Link
              to="/requests?department_id=1"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">💧</div>
              <div className="text-xs font-bold text-[#202124]">Water Supply</div>
              <div className="text-[11px] text-[#5F6368]">Pipeline mains</div>
            </Link>

            <Link
              to="/requests?department_id=2"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">⚡</div>
              <div className="text-xs font-bold text-[#202124]">Electricity</div>
              <div className="text-[11px] text-[#5F6368]">MSEDCL 11kV</div>
            </Link>

            <Link
              to="/requests?department_id=4"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">📡</div>
              <div className="text-xs font-bold text-[#202124]">Telecom</div>
              <div className="text-[11px] text-[#5F6368]">5G fiber ducts</div>
            </Link>

            <Link
              to="/requests?department_id=3"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🔥</div>
              <div className="text-xs font-bold text-[#202124]">Gas Pipeline</div>
              <div className="text-[11px] text-[#5F6368]">MNGL city gas</div>
            </Link>

            <Link
              to="/requests?department_id=5"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🌊</div>
              <div className="text-xs font-bold text-[#202124]">Sewage &amp; Drain</div>
              <div className="text-[11px] text-[#5F6368]">Stormwater culvert</div>
            </Link>

            <Link
              to="/requests?department_id=6"
              className="p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-sm transition-all text-center space-y-1 group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">🛣️</div>
              <div className="text-xs font-bold text-[#202124]">Road Works</div>
              <div className="text-[11px] text-[#5F6368]">Asphalt overlay</div>
            </Link>
          </div>

          {/* Trust Banner matching Roomie's 100% Student-Only Accommodation Network pill */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-[#DADCE0] px-5 py-3 shadow-2xs inline-flex items-center gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] flex items-center justify-center font-bold flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#202124]">
                  100% Inter-Departmental Coordination Protocol
                </div>
                <div className="text-[11px] text-[#5F6368] font-medium">
                  Unified trenching, single-pass asphalt restoration, and zero duplicate road cutting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Evaluation Scenario Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DADCE0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7E0] text-[#7A4B04] text-[10px] font-bold uppercase tracking-wider">
              <span>Required Evaluation Scenario</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
              Central Avenue (FC Road) Simultaneous Trenching Overlap
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
              PMC Water Supply (Oct 15–18) and MSEDCL Power (Oct 17–20) planned uncoordinated work on the same corridor.
              Infrasync’s collision engine generated proposal <strong>PROP-2026-001</strong>, consolidating trenching into a 4-day shared window and saving <strong>₹38,400</strong> in municipal asphalt repaving fees.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/coordination"
              className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Review Proposal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. How It Works (Four-Step Section matching Roomie's exact layout) */}
      <section id="how-it-works" className="bg-white border-y border-[#DADCE0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl font-black text-[#202124] tracking-tight">
              Simple 4-Step Process
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6368]">
              Centralized decision-support workflow before roads are dug repeatedly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Blue */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] hover:border-[#1A73E8] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#1A73E8]">01</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center text-lg">
                    📝
                  </div>
                </div>
                <h3 className="font-black text-[#202124] text-base tracking-tight">
                  Submit an Excavation Request
                </h3>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Departments submit planned road trenching with exact coordinates, duration, utility depth, and contractor details.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-[#1A73E8]">
                Step 1: Registration →
              </div>
            </div>

            {/* Step 2: Red */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] hover:border-[#EA4335] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#EA4335]">02</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FCE8E6] text-[#EA4335] flex items-center justify-center text-lg">
                    🔍
                  </div>
                </div>
                <h3 className="font-black text-[#202124] text-base tracking-tight">
                  Detect Scheduling Conflicts
                </h3>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Deterministic spatial and interval engine automatically flags collisions and 14-day sequential digging on the same road.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-[#EA4335]">
                Step 2: Collision Scan →
              </div>
            </div>

            {/* Step 3: Yellow */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] hover:border-[#FBBC04] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#FBBC04]">03</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF7E0] text-[#7A4B04] flex items-center justify-center text-lg">
                    📅
                  </div>
                </div>
                <h3 className="font-black text-[#202124] text-base tracking-tight">
                  Coordinate Work Windows
                </h3>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Generates candidate consolidated excavation corridors with feasibility scoring, agency voting, and admin authorization.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-[#7A4B04]">
                Step 3: Joint Scheduling →
              </div>
            </div>

            {/* Step 4: Green */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 sm:p-7 border border-[#DADCE0] hover:border-[#34A853] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#34A853]">04</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center text-lg">
                    🤝
                  </div>
                </div>
                <h3 className="font-black text-[#202124] text-base tracking-tight">
                  Track Progress &amp; Restoration
                </h3>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Decouples excavation completion from municipal asphalt certification and lab density sign-off before closing right-of-way.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-[#137333]">
                Step 4: Quality Sign-Off →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust & CTA Section matching Roomie's Privacy & Trust banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#202124] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-transparent">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#34A853]">
              <Lock className="w-4 h-4" />
              Civic Budget &amp; Road Life Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              “Plan once, coordinate collectively, excavate intelligently.”
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Protect municipal tax funds and preserve Pune's road surface longevity through synchronized underground utility trenching. Every rupee saved in asphalt repaving is reinvested in urban infrastructure.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/overview"
              className="px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open Dashboard Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
