import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  AlertTriangle,
  CalendarClock,
  MapPin,
  MessageSquareShare,
  History,
  Bell,
  BarChart3,
  Boxes,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Excavation Requests', path: '/requests', icon: FileSpreadsheet },
    { name: 'Conflict Detection', path: '/conflicts', icon: AlertTriangle, highlight: true },
    { name: 'Coordination Schedule', path: '/coordination', icon: CalendarClock },
    { name: 'GIS Map', path: '/map', icon: MapPin },
    { name: 'Department Collaboration', path: '/collaboration', icon: MessageSquareShare },
    { name: 'Excavation History', path: '/history', icon: History },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Resource Sharing', path: '/resources', icon: Boxes },
    { name: 'Settings & PBL Info', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0F172A] text-slate-300 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
              <span className="text-lg tracking-wider">IN</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Infrasync
              </h1>
              <p className="text-[10px] text-blue-400 font-medium tracking-wide uppercase mt-0.5">
                Pune Municipal GIS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context Card */}
        {user && (
          <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs">
            <div className="flex items-center space-x-2 text-slate-400 mb-1">
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-300">
                {user.role === 'admin'
                  ? 'Municipal Admin'
                  : user.role === 'department_user'
                  ? 'Department User'
                  : 'Public Observer'}
              </span>
            </div>
            <p className="font-medium text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user.department_name || 'Central Administration'}
            </p>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
          <div className="px-2 py-1 text-[11px] text-slate-400 text-center">
            MIT School of Computing • SY904
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-3 py-2 mt-2 text-xs font-medium text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
