import React, { useState, useEffect } from 'react';
import { Menu, Bell, UserCircle2, Sparkles, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DemoUser } from '../../types';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user, switchDemoUser } = useAuth();
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);
        const notifData = await api.getNotifications(true);
        setUnreadNotifsCount(notifData.unread_count || 0);
      } catch (err) {
        console.error('Error fetching topbar data:', err);
      }
    }
    loadData();
    const interval = setInterval(loadData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSwitchUser = async (u: DemoUser) => {
    await switchDemoUser(u);
    setIsDemoDropdownOpen(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      {/* Left: Mobile Toggle & Project Branding */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            City of Pune • Smart Urban Infrastructure
          </span>
          <p className="text-sm font-bold text-slate-900 tracking-tight">
            Road Excavation Coordination Platform
          </p>
        </div>
      </div>

      {/* Right: Quick Role Switcher, Notifications & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Demo Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Demo Switcher:</span>
            <span className="font-bold">{user?.role === 'admin' ? 'Admin' : user?.department_name ? user.department_name.split(' ')[1] : 'Role'}</span>
            <ChevronDown className="w-3 h-3 text-blue-600" />
          </button>

          {isDemoDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Quick Switch Demo Persona</p>
                <p className="text-[11px] text-slate-500">Test role-specific views and permissions instantly</p>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {demoUsers.map((du) => {
                  const isCurrent = user?.email === du.email;
                  return (
                    <button
                      key={du.id}
                      onClick={() => handleSwitchUser(du)}
                      className={`flex items-start w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1.5 mr-2.5 flex-shrink-0"
                        style={{ backgroundColor: du.department_color || '#2563EB' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {du.name.split('(')[0]}
                          </p>
                          {isCurrent && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 ml-1 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {du.department_name}
                        </p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] rounded font-medium bg-slate-100 text-slate-600 uppercase">
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

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="In-App Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </Link>

        {/* Current User Pill */}
        <div className="hidden lg:flex items-center space-x-2.5 pl-2 border-l border-slate-200 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">
              {user?.name?.split(' ')[0] || 'User'}
            </p>
            <p className="text-[11px] text-slate-500">
              {user?.role === 'admin' ? 'Admin' : 'Officer'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
