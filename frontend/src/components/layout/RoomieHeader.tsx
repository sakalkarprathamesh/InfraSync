import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  FileSpreadsheet,
  AlertTriangle,
  CalendarClock,
  MapPin,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  MessageSquareShare,
  History,
  BarChart3,
  Boxes,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DemoUser } from '../../types';

export const RoomieHeader: React.FC = () => {
  const { user, switchDemoUser, logout } = useAuth();
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDemoUsers() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);
      } catch (err) {
        console.error('Error fetching demo users for header:', err);
      }
    }
    loadDemoUsers();
  }, []);

  const handleSwitchUser = async (du: DemoUser) => {
    await switchDemoUser(du);
    setIsDemoDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/overview');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DADCE0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo matching Roomie's exact treatment */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#1A73E8] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              I
            </div>
            <div className="flex flex-col">
              <div className="font-black text-lg tracking-tight leading-none text-[#123B70]">
                Infrasync
              </div>
              <span className="text-[10px] font-bold text-[#5F6368] tracking-wider uppercase mt-0.5">
                Pune Municipal GIS
              </span>
            </div>
          </Link>

          {/* Navigation Links with Roomie styling */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <HomeIcon className="w-4 h-4 text-slate-400" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/overview"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
              <span>Requests</span>
            </NavLink>

            <NavLink
              to="/conflicts"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <AlertTriangle className="w-4 h-4 text-[#EA4335]" />
              <span>Conflicts</span>
            </NavLink>

            <NavLink
              to="/coordination"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <CalendarClock className="w-4 h-4 text-slate-400" />
              <span>Coordination</span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#1A73E8]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-slate-50'
                }`
              }
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Map</span>
            </NavLink>

            {/* More Tools Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 text-[#5F6368] hover:text-[#202124] hover:bg-slate-50 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-2xl shadow-lg border border-[#DADCE0] py-2 hidden group-hover:block hover:block z-50">
                <Link
                  to="/collaboration"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#E8F0FE]/40 transition-colors"
                >
                  <MessageSquareShare className="w-4 h-4 text-[#1A73E8]" />
                  <span>Collaboration</span>
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#E8F0FE]/40 transition-colors"
                >
                  <History className="w-4 h-4 text-[#FBBC04]" />
                  <span>Excavation History</span>
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#E8F0FE]/40 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-[#34A853]" />
                  <span>Analytics & Savings</span>
                </Link>
                <Link
                  to="/resources"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#E8F0FE]/40 transition-colors"
                >
                  <Boxes className="w-4 h-4 text-[#EA4335]" />
                  <span>Resource Sharing</span>
                </Link>
                <div className="my-1 border-t border-[#DADCE0]/60" />
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & PBL Info</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Right Section: Notifications + Demo Switcher Pill + Auth CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/notifications"
              className="p-2 rounded-2xl text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#E8F0FE]/50 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA4335]" />
            </Link>
            {/* Quick Demo Switcher Pill matching Roomie's Demo nav pill */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 text-[#5F6368] hover:text-[#202124] bg-slate-50 border border-[#DADCE0] hover:border-[#1A73E8] cursor-pointer"
                title="Select Demo Persona"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-bold text-[#1A73E8]">
                  {user ? (user.role === 'admin' ? 'Admin' : user.department_name?.split(' ')[1] || 'User') : 'Demo'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#5F6368]" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-[#DADCE0] py-2 z-50">
                  <div className="px-3 py-2 border-b border-[#DADCE0]/60">
                    <p className="text-xs font-bold text-[#202124]">Switch Demonstration Persona</p>
                    <p className="text-[11px] text-[#5F6368]">Test municipal workflows without passwords</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {demoUsers.map((du) => {
                      const isCurrent = user?.email === du.email;
                      return (
                        <button
                          key={du.id}
                          onClick={() => handleSwitchUser(du)}
                          className={`flex items-start w-full px-3 py-2 text-left hover:bg-[#F8F9FA] transition-colors ${
                            isCurrent ? 'bg-[#E8F0FE]' : ''
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full mt-1.5 mr-2.5 flex-shrink-0"
                            style={{ backgroundColor: du.department_color || '#1A73E8' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#202124] truncate">
                                {du.name.split('(')[0]}
                              </p>
                              {isCurrent && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8] ml-1 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#5F6368] truncate">
                              {du.department_name}
                            </p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] rounded font-bold bg-[#E8F0FE] text-[#1A73E8] uppercase">
                              {du.role}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard / Login CTA matching Roomie's primary button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/overview"
                  className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open</span> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#5F6368] hover:text-[#EA4335] rounded-2xl hover:bg-slate-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 rounded-2xl text-[#5F6368] hover:text-[#202124] hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#DADCE0] space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/overview"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Overview Dashboard
            </Link>
            <Link
              to="/requests"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Excavation Requests
            </Link>
            <Link
              to="/conflicts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Conflict Detection
            </Link>
            <Link
              to="/coordination"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Coordination Schedule
            </Link>
            <Link
              to="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              GIS Interactive Map
            </Link>
            <Link
              to="/collaboration"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Department Collaboration
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Excavation History
            </Link>
            <Link
              to="/analytics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Analytics &amp; Savings
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-2xl text-xs font-bold text-[#5F6368] hover:text-[#202124] hover:bg-slate-50"
            >
              Settings &amp; PBL Info
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
