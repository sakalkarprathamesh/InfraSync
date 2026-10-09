import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  Building2,
  PieChart as PieIcon,
  ShieldAlert,
  Hammer,
  DollarSign,
  Info
} from 'lucide-react';
import { api } from '../api/client';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalyticsSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const PIE_COLORS = ['#34A853', '#1A73E8', '#FBBC04', '#EA4335', '#5F6368'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DADCE0]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">
              Urban Infrastructure Analytics
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E8F0FE] text-[#1A73E8] rounded-full uppercase">
              Pune Municipal Executive Report
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Quantitative metrics calculated dynamically from central excavation and restoration registry.
          </p>
        </div>
      </div>

      {/* Cost Impact & Savings Estimation Banner matching Roomie dark banner */}
      <div className="p-6 sm:p-8 bg-[#202124] text-white rounded-3xl border border-[#3C4043] shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#34A853] text-xs font-bold uppercase tracking-wider">
              <TrendingDown className="w-4 h-4 text-[#34A853]" />
              <span>Civic Expenditure Model &amp; Coordination Impact</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Consolidated vs. Independent Excavation Cost Analysis
            </h2>
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Uncoordinated Cost</span>
              <span className="text-lg font-bold text-slate-300">
                ₹{data.cost_estimation.total_separate_estimated_cost_inr.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#34A853] block font-medium">Estimated Civic Savings</span>
              <span className="text-2xl font-black text-[#34A853]">
                ₹{data.cost_estimation.total_potential_savings_inr.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="px-3.5 py-1.5 bg-[#E6F4EA] border border-[#CEEAD6] rounded-2xl text-center">
              <span className="text-xs font-bold text-[#137333]">
                {data.cost_estimation.savings_percentage}% Saved
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#1A73E8] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            {data.cost_estimation.assumptions_note}
          </p>
        </div>
      </div>

      {/* Charts Grid Row 1: Requests by Department & Coordinated vs Independent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Volume Bar Chart */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Excavation Volume by Utility Agency
            </h3>
            <span className="text-[11px] text-[#5F6368]">Total volume</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.requests_by_department} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: '#5F6368' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5F6368' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202124', color: '#fff', borderRadius: '16px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="count" name="Excavations" fill="#1A73E8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Coordinated vs Independent Work (Pie Chart) */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Coordinated vs. Uncoordinated Projects
            </h3>
            <span className="text-[11px] text-[#5F6368]">Ratio</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.coordination_comparison}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.coordination_comparison.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color === '#10B981' ? '#34A853' : entry.color === '#64748B' ? '#5F6368' : entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#202124', color: '#fff', borderRadius: '16px', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Monthly Timeline Activity & Conflicts by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Monthly Timeline Activity */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Excavation &amp; Coordination Activity (Monthly)
            </h3>
            <span className="text-[11px] text-[#5F6368]">Timeline Trend</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5F6368' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5F6368' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202124', color: '#fff', borderRadius: '16px', fontSize: '11px', border: 'none' }}
                />
                <Legend />
                <Line type="monotone" dataKey="requests" name="Total Submissions" stroke="#1A73E8" strokeWidth={2.5} />
                <Line type="monotone" dataKey="coordinated" name="Coordinated Windows" stroke="#34A853" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Conflicts by Category Breakdown */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#DADCE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              Detected Conflicts by Matching Rule
            </h3>
            <span className="text-[11px] text-[#5F6368]">Rule distribution</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {data.conflicts_by_category.map((item: any, idx: number) => (
              <div key={item.category} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202124]">{item.category}</span>
                  <span className="font-bold text-[#202124]">{item.count}</span>
                </div>
                <div className="w-full h-2.5 bg-[#F8F9FA] border border-[#DADCE0]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.count * 20, 10)}%`,
                      backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
