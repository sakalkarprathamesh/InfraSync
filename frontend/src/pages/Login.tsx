import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  AlertCircle
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
      navigate('/');
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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-500/30">
          IN
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          INFRASYNC
        </h1>
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          AI-Powered Urban Road Excavation Coordination System
        </p>
        <p className="text-[11px] text-slate-400">
          City of Pune • MIT School of Computing PBL Project (SY904)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Login Personas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                One-Click Demo Login
              </span>
              <span className="text-[10px] text-slate-400">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoUsers.map((du) => (
                <button
                  key={du.id}
                  onClick={() => handleDemoSelect(du)}
                  disabled={loading}
                  className="flex items-start p-3 text-left rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-blue-500 transition-all group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1 mr-2.5 flex-shrink-0"
                    style={{ backgroundColor: du.department_color || '#2563EB' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                      {du.name.split('(')[0]}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {du.department_name}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-900 text-slate-300 uppercase">
                      {du.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold absolute">
              Or Manual Sign In
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@infrasync.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center space-x-1"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Infrasync'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
