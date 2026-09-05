import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Zap,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

export const AnalyticsDashboard: React.FC = () => {
  const { employees, projects, rooms, setIsAiDrawerOpen, setAiInitialPrompt } = useCompany();

  const monthlyFinancials = [
    { month: 'Apr', revenue: 980, expenses: 340 },
    { month: 'May', revenue: 1050, expenses: 355 },
    { month: 'Jun', revenue: 1120, expenses: 360 },
    { month: 'Jul', revenue: 1180, expenses: 370 },
    { month: 'Aug', revenue: 1210, expenses: 375 },
    { month: 'Sep', revenue: 1240, expenses: 380 },
  ];

  const departmentPerformance = rooms.map((r) => ({
    name: r.shortCode,
    fullName: r.name,
    score: r.avgPerformanceScore,
    color: r.color,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Enterprise Analytics & Business Intelligence
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
              LIVE DATASTREAM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time financial telemetry, cash burn projections, sprint delivery velocity, and department health metrics.
          </p>
        </div>

        <button
          onClick={() => {
            setAiInitialPrompt('Perform a deep financial breakdown of our $1.24M MRR and recommend 3 areas for margin optimization.');
            setIsAiDrawerOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Financial Deep-Dive</span>
        </button>
      </div>

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Net Profit Margin</p>
          <h3 className="text-2xl font-extrabold text-[#00C853] mt-1 font-mono">69.4%</h3>
          <p className="text-[11px] text-slate-400 mt-1">+$860k Net Cash Flow/mo</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Customer Acquisition Cost (CAC)</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">$1,840</h3>
          <p className="text-[11px] text-emerald-400 mt-1">-12% Payback Period: 3.2 Mo</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Net Revenue Retention (NRR)</p>
          <h3 className="text-2xl font-extrabold text-[#00D9FF] mt-1 font-mono">134.8%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Top-decile SaaS benchmark</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Engineering Output Efficiency</p>
          <h3 className="text-2xl font-extrabold text-indigo-400 mt-1 font-mono">98.1%</h3>
          <p className="text-[11px] text-slate-400 mt-1">0 Critical Production Outages</p>
        </div>
      </div>

      {/* Charts Section: Revenue vs Expenses Growth Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Financial Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#4F7CFF]/20 bg-gradient-to-br from-[#141B2D] to-[#101726]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Monthly Revenue ($k) vs Cash Outflow ($k)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Trailing 6 Months Financial Expansion</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#00D9FF]">
                <span className="w-3 h-3 rounded bg-[#00D9FF]" /> MRR Revenue
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-3 rounded bg-amber-400" /> Operational Burn
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex items-end justify-between gap-4 h-64 px-4 pb-2 border-b border-slate-800">
            {monthlyFinancials.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Revenue Bar */}
                  <div
                    className="w-1/2 rounded-t-lg bg-gradient-to-t from-[#4F7CFF] to-[#00D9FF] group-hover:brightness-125 transition-all relative"
                    style={{ height: `${(item.revenue / 1300) * 100}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded shadow whitespace-nowrap transition-opacity">
                      ${item.revenue}k
                    </span>
                  </div>

                  {/* Expenses Bar */}
                  <div
                    className="w-1/2 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-125 transition-all relative"
                    style={{ height: `${(item.expenses / 1300) * 100}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded shadow whitespace-nowrap transition-opacity">
                      ${item.expenses}k
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Department Productivity Radar */}
        <div className="glass-panel p-6 rounded-3xl border border-[#4F7CFF]/20 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Department Output Index
            </h3>

            <div className="mt-4 space-y-3.5">
              {departmentPerformance.map((dept, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-white font-bold">{dept.fullName}</span>
                    <span className="text-emerald-400 font-bold">{dept.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.score}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
            Weighted Average Index: <strong className="text-[#00D9FF]">96.8%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
