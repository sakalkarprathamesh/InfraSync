import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, MapPin, Building2, ExternalLink } from 'lucide-react';

export const RoomieFooter: React.FC = () => {
  return (
    <footer className="bg-white text-[#5F6368] text-xs border-t border-[#DADCE0] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description (Span 2) */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A73E8] text-white font-black flex items-center justify-center text-sm shadow-2xs">
                I
              </div>
              <div className="font-black text-base sm:text-lg tracking-tight">
                <span className="text-[#123B70]">Infrasync</span>
                <span className="text-[#1A73E8] text-xs font-bold ml-1.5">Pune GIS</span>
              </div>
            </div>

            <p className="text-xs text-[#5F6368] max-w-md leading-relaxed">
              “Coordinate infrastructure work before the road is dug. Centralized decision-support platform for Pune Municipal Corporation and utility agencies.”
            </p>

            <p className="text-[11px] text-[#5F6368] font-medium">
              MIT School of Computing • Department of Computer Science &amp; Engineering • Group SY904
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-[#202124] text-xs font-bold uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-[#1A73E8] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/overview" className="hover:text-[#1A73E8] transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-[#1A73E8] transition-colors">
                  Excavation Requests
                </Link>
              </li>
              <li>
                <Link to="/conflicts" className="hover:text-[#1A73E8] transition-colors">
                  Conflict Detection Matrix
                </Link>
              </li>
              <li>
                <Link to="/coordination" className="hover:text-[#1A73E8] transition-colors">
                  Unified Coordination Schedule
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#1A73E8] transition-colors">
                  GIS Interactive Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Help, Guide & Trust */}
          <div className="space-y-2">
            <h4 className="text-[#202124] text-xs font-bold uppercase tracking-wider">
              PBL Information &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  to="/settings"
                  className="text-[#1A73E8] hover:underline font-bold flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Guide: Dr. Tejaswani Bhosale</span>
                </Link>
              </li>
              <li className="text-[11px] text-[#5F6368]">
                Team: Prathamesh, Chaitanya, Sharvari, Shravani
              </li>
              <li className="flex items-center gap-1 text-[#137333] font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Deterministic Conflict Detection Engine</span>
              </li>
              <li className="flex items-center gap-1 text-[#1A73E8] font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>10 Verified Pune Road Corridors</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright matching Roomie */}
        <div className="pt-6 border-t border-[#DADCE0] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#5F6368]">
          <p>
            © 2026 Infrasync. Designed with care by{' '}
            <strong className="text-[#1A73E8] font-bold">
              Prathamesh Sakalkar, Chaitanya, Sharvari &amp; Shravani
            </strong>
            .
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <span className="text-[#5F6368]">MIT School of Computing • SY904</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
