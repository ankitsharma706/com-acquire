import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  FileText,
  UserMinus,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Search,
  Download,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  ChevronRight,
  Briefcase,
  Users,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { LeaveRequest, HRPolicy } from '../../types';

export const HRCenter: React.FC = () => {
  const {
    employees,
    leaveRequests,
    policies,
    onboardingTasks,
    exitProcesses,
    approveLeaveRequest,
    rejectLeaveRequest,
    submitLeaveRequest,
    currentRole,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    setSelectedEmployee,
  } = useCompany();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'leaves' | 'onboarding' | 'exit' | 'policies' | 'attendance'
  >('overview');
  const [leaveFilter, setLeaveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [policySearch, setPolicySearch] = useState('');
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState<LeaveRequest['leaveType']>('Annual Vacation');
  const [newLeaveDays, setNewLeaveDays] = useState(3);
  const [newLeaveReason, setNewLeaveReason] = useState('');

  // Key Metrics calculation
  const totalStaff = employees.length;
  const newHiresThisQuarter = 6;
  const leavesPending = leaveRequests.filter((l) => l.status === 'Pending').length;
  const activeLeavesToday = leaveRequests.filter((l) => l.status === 'Approved').length;
  const retentionRate = 97.6;
  const attritionRate = 2.4;
  const avgAttendance = (
    employees.reduce((acc, curr) => acc + curr.attendanceRate, 0) / employees.length
  ).toFixed(1);

  const filteredLeaves =
    leaveFilter === 'All'
      ? leaveRequests
      : leaveRequests.filter((l) => l.status === leaveFilter);

  const filteredPolicies = policies.filter(
    (p) =>
      p.title.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.description.toLowerCase().includes(policySearch.toLowerCase())
  );

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      leaveType: newLeaveType,
      daysCount: Number(newLeaveDays),
      reason: newLeaveReason || 'Standard leave request.',
      startDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * (2 + Number(newLeaveDays))).toISOString().split('T')[0],
    });
    setIsApplyLeaveModalOpen(false);
    setNewLeaveReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              HR Operations & People Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PAGE 5
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Centralized workforce command: employee records, automated leave workflows, compliance policies, talent onboarding cohorts, and retention analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApplyLeaveModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C253D] hover:bg-[#253252] border border-[#4F7CFF]/30 text-xs font-semibold text-white shadow-sm transition-all hover:border-[#00D9FF]/50"
          >
            <Plus className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Apply Time Off</span>
          </button>

          <button
            onClick={() => {
              setAiInitialPrompt('Analyze current workforce retention metrics, attrition risks, and department attendance trends.');
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#4F7CFF] hover:opacity-95 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI People Audit</span>
          </button>
        </div>
      </div>

      {/* HR KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">Total Headcount</span>
            <Users className="w-4 h-4 text-[#4F7CFF]" />
          </div>
          <p className="text-xl font-extrabold text-white">{totalStaff}</p>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +12.5% Q3
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">New Hires</span>
            <Briefcase className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <p className="text-xl font-extrabold text-white">+{newHiresThisQuarter}</p>
          <span className="text-[10px] text-slate-400 font-mono">This Quarter</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">Leaves Pending</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{leavesPending}</p>
          <span className="text-[10px] text-amber-400 font-mono">{activeLeavesToday} On Leave</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">Attendance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">{avgAttendance}%</p>
          <span className="text-[10px] text-slate-400 font-mono">Global Avg</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">Retention Rate</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{retentionRate}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">Industry Top 5%</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold">Attrition Rate</span>
            <UserMinus className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-rose-400">{attritionRate}%</p>
          <span className="text-[10px] text-slate-400 font-mono">Benchmark: 8.5%</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'HR Hub Overview', count: undefined },
          { id: 'leaves', label: 'Leave Management', count: leavesPending },
          { id: 'onboarding', label: 'Onboarding Cohorts', count: onboardingTasks.length },
          { id: 'exit', label: 'Exit & Offboarding', count: exitProcesses.length },
          { id: 'policies', label: 'Policies & Documents', count: policies.length },
          { id: 'attendance', label: 'Live Attendance Logs', count: undefined },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#141B2D]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Leave Requests Widget */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Pending Leave Authorizations</h3>
                </div>
                <button
                  onClick={() => setActiveTab('leaves')}
                  className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1 font-semibold"
                >
                  View all ({leaveRequests.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {leaveRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{req.employeeName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                          {req.leaveType}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {req.daysCount} days ({req.startDate} to {req.endDate})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">"{req.reason}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => approveLeaveRequest(req.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => rejectLeaveRequest(req.id)}
                            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg font-mono ${
                            req.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Onboarding Overview */}
            <div className="p-5 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#00D9FF]" />
                  <h3 className="text-sm font-bold text-white">Active Onboarding Cohorts</h3>
                </div>
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1 font-semibold"
                >
                  Manage Onboarding <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {onboardingTasks.map((onb) => (
                  <div key={onb.id} className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{onb.employeeName}</p>
                        <p className="text-[11px] text-slate-400">{onb.role} • {onb.department}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
                        {onb.progress}% Done
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] rounded-full"
                        style={{ width: `${onb.progress}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      {onb.checklist.filter((c) => c.completed).length}/{onb.checklist.length} Milestones Cleared
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Policies & Quick Docs */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">HR Compliance Standard</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  SOC 2 Type II
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All 48 employees have completed mandatory annual anti-harassment training and security key certification.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                {policies.slice(0, 3).map((pol) => (
                  <div
                    key={pol.id}
                    className="p-2.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800/80 flex items-center justify-between hover:border-[#4F7CFF]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">{pol.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{pol.version} • {pol.category}</p>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-400 hover:text-[#00D9FF] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leaves Management */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLeaveFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    leaveFilter === filter
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white bg-[#141B2D]'
                  }`}
                >
                  {filter} Leaves
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsApplyLeaveModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Submit Request
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 px-3">Employee</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Duration</th>
                  <th className="pb-3 px-3">Reason</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-[#1C253D]/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-bold text-white">{req.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{req.employeeRole}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {req.daysCount} days ({req.startDate} → {req.endDate})
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{req.reason}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : req.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveLeaveRequest(req.id)}
                            className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLeaveRequest(req.id)}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-[11px] font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Policies & Documents */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search policies, compliance rules..."
                value={policySearch}
                onChange={(e) => setPolicySearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl text-xs bg-[#141B2D] border border-[#4F7CFF]/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
              />
            </div>
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] border border-[#4F7CFF]/30 text-xs text-slate-200 font-semibold">
              <Plus className="w-3.5 h-3.5 text-[#00D9FF]" /> Upload HR Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPolicies.map((pol) => (
              <div
                key={pol.id}
                className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 hover:border-[#4F7CFF]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#4F7CFF]/15 text-[#00D9FF]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{pol.title}</h4>
                      <span className="text-[10px] text-purple-300 font-mono">{pol.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {pol.version}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{pol.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Updated: {pol.lastUpdated}</span>
                  <button className="flex items-center gap-1.5 text-[#00D9FF] hover:underline font-semibold">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Live Attendance */}
      {activeTab === 'attendance' && (
        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Live Attendance & Presence Ledger</h3>
            <span className="text-xs font-mono text-emerald-400">
              {employees.filter((e) => e.status === 'online').length} Present • {employees.filter((e) => e.status === 'in_meeting').length} In Meeting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="p-3 rounded-xl bg-[#0B0F19]/60 border border-slate-800 hover:border-[#4F7CFF]/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0B0F19] ${
                        emp.status === 'online'
                          ? 'bg-emerald-400'
                          : emp.status === 'in_meeting'
                          ? 'bg-[#00D9FF]'
                          : emp.status === 'busy'
                          ? 'bg-amber-400'
                          : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{emp.name}</p>
                    <p className="text-[10px] text-slate-400">{emp.departmentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{emp.attendanceRate}%</span>
                  <p className="text-[10px] text-slate-400 font-mono capitalize">{emp.status.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#141B2D] border border-[#4F7CFF]/30 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Apply For Time Off</h3>
              </div>
              <button
                onClick={() => setIsApplyLeaveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Leave Type</label>
                <select
                  value={newLeaveType}
                  onChange={(e) => setNewLeaveType(e.target.value as any)}
                  className="w-full h-9 rounded-xl px-3 bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                >
                  <option value="Annual Vacation">Annual Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Parental">Parental Leave</option>
                  <option value="Bereavement">Bereavement</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Number of Days</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={newLeaveDays}
                  onChange={(e) => setNewLeaveDays(Number(e.target.value))}
                  className="w-full h-9 rounded-xl px-3 bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Reason / Coverage Plan</label>
                <textarea
                  required
                  rows={3}
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  placeholder="E.g., Personal vacation, emergency coverage handoff prepared with squad lead."
                  className="w-full p-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
