import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  FileSpreadsheet,
  AlertTriangle,
  MapPin,
  LayoutDashboard
} from 'lucide-react';

export const RoomieMobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#DADCE0] px-2 py-1 shadow-lg pb-safe">
      <div className="flex justify-around items-center h-14">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#1A73E8] font-black' : 'text-[#5F6368] hover:text-[#202124]'
            }`
          }
        >
          <HomeIcon className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#1A73E8] font-black' : 'text-[#5F6368] hover:text-[#202124]'
            }`
          }
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5 stroke-[1.8]" />
          <span>Requests</span>
        </NavLink>

        <NavLink
          to="/conflicts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#EA4335] font-black' : 'text-[#5F6368] hover:text-[#202124]'
            }`
          }
        >
          <AlertTriangle className="w-5 h-5 mb-0.5 stroke-[1.8]" />
          <span>Conflicts</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#1A73E8] font-black' : 'text-[#5F6368] hover:text-[#202124]'
            }`
          }
        >
          <MapPin className="w-5 h-5 mb-0.5 stroke-[1.8]" />
          <span>Map</span>
        </NavLink>

        <NavLink
          to="/overview"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
              isActive ? 'text-[#1A73E8] font-black' : 'text-[#5F6368] hover:text-[#202124]'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5 stroke-[1.8]" />
          <span>Dashboard</span>
        </NavLink>
      </div>
    </div>
  );
};
