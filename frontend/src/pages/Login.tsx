import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Home,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { DemoUser } from '../types';

export const Login: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemos() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);
      } catch (err) {
        console.error('Failed to load demo accounts', err);
      }
    }
    loadDemos();
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (du: DemoUser) => {
    setError(null);
    try {
      setLoading(true);
      await switchDemoUser(du);
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Roomie-Style Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-2xl bg-[#1A73E8] text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
            I
          </div>
          <div className="flex flex-col text-left">
            <div className="font-black text-2xl tracking-tight leading-none text-[#123B70]">
              Infrasync
            </div>
            <span className="text-[11px] font-bold text-[#5F6368] tracking-wider uppercase mt-0.5">
              Pune Municipal GIS Portal
            </span>
          </div>
        </Link>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#202124] tracking-tight">
            Sign in to Your Department
          </h1>
          <p className="text-xs text-[#5F6368] mt-1">
            Access inter-agency excavation plans, conflict detection, and GIS coordination.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white border border-[#DADCE0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3.5 bg-[#FCE8E6] border border-[#F28B82] rounded-2xl text-xs text-[#EA4335] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#EA4335] flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Login Personas matching Roomie card treatments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DADCE0]">
              <span className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#FBBC04]" />
                One-Click Demo Access
              </span>
              <span className="text-[11px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full">
                Instant Sign-In
              </span>
            </div>

            <p className="text-xs text-[#5F6368]">
              Select any stakeholder role to immediately test real municipal workflows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoUsers.map((du) => (
                <button
                  key={du.id}
                  onClick={() => handleDemoSelect(du)}
                  disabled={loading}
                  className="flex items-start p-3 text-left rounded-2xl bg-white hover:bg-[#F8F9FA] border border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-xs transition-all group cursor-pointer"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1.5 mr-2.5 flex-shrink-0"
                    style={{ backgroundColor: du.department_color || '#1A73E8' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#202124] group-hover:text-[#1A73E8] truncate">
                      {du.name.split('(')[0]}
                    </p>
                    <p className="text-[11px] text-[#5F6368] truncate mt-0.5">
                      {du.department_name}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#E8F0FE] text-[#1A73E8] uppercase">
                      {du.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#DADCE0] w-full" />
            <span className="bg-white px-3 text-[10px] text-[#5F6368] uppercase tracking-widest font-bold absolute">
              Or Manual Sign In
            </span>
          </div>

          {/* Standard Form matching Roomie input style */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#5F6368]" />
                <input
                  type="email"
                  required
                  placeholder="admin@punecorp.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#5F6368]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#DADCE0] rounded-2xl text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-2xl disabled:opacity-50 transition-all shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="pt-2 text-center border-t border-[#DADCE0]">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6368] hover:text-[#1A73E8] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Public Homepage</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-[#5F6368]">
          MIT School of Computing • Department of CSE • Project SY904
        </div>
      </div>
    </div>
  );
};
