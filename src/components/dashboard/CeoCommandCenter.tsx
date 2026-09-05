import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Building,
  CreditCard,
  UserPlus,
  Radio,
  Megaphone,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

export const CeoCommandCenter: React.FC = () => {
  const {
    currentRole,
    employees,
    projects,
    candidates,
    payrollBatch,
    rooms,
    announcements,
    setActiveTab,
    setSelectedRoom,
    approvePayrollBatch,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    setIsAnnouncementModalOpen,
  } = useCompany();

  const totalEmployees = employees.length;
  const activeProjects = projects.filter((p) => p.status === 'In Progress').length;
  const pendingPayroll = payrollBatch.status === 'Pending CEO Approval';
  const readyOffers = candidates.filter((c) => c.stage === 'Selected');
  const criticalTasksCount = projects
    .flatMap((p) => p.tasks)
    .filter((t) => t.priority === 'Urgent' && t.status !== 'Done').length;

  const quickStats = [
    {
      title: 'Monthly Recurring Revenue (ARR $14.8M)',
      value: '$1,240,000',
      change: '+18.4% MoM',
      isPositive: true,
      subtext: 'Gross Margin 84.2%',
      icon: DollarSign,
      color: 'from-[#4F7CFF] to-[#00D4FF]',
    },
    {
      title: 'Total Active Headcount',
      value: `${totalEmployees} / 60`,
      change: '+4 this month',
      isPositive: true,
      subtext: '98.2% Avg Attendance',
      icon: Users,
      color: 'from-[#10B981] to-[#14B8A6]',
    },
    {
      title: 'Sprint Velocity & Delivery',
      value: '94.8%',
      change: '+3.2% vs Q2',
      isPositive: true,
      subtext: `${activeProjects} Active Initiatives`,
      icon: Zap,
      color: 'from-[#3B82F6] to-[#6366F1]',
    },
    {
      title: 'Net Profitable Runway',
      value: '26.4 Mos',
      change: '$14.8M in Treasury',
      isPositive: true,
      subtext: 'Burn Rate: $380k/mo',
      icon: Activity,
      color: 'from-[#F5C451] to-[#FFE28A]',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome & Mode Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#141B2D] via-[#111827] to-[#141B2D] border border-white/[0.08] p-6 lg:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#4F7CFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-48 h-48 bg-[#00D4FF]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-40 h-40 bg-[#F5C451]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F5C451]/15 to-[#FFE28A]/15 text-[#F5C451] border border-[#F5C451]/30 tracking-wider">
                👑 LIVE CEO TELEMETRY • SF GLOBAL HQ
              </span>
              <span className="text-[11px] text-[#A7B0C0] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Real-time Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Executive Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B0C0] mt-1.5 max-w-2xl leading-relaxed">
              All 8 virtual departments are fully synchronized. Engineering velocity is optimal, and monthly cash flow remains strongly profitable.
            </p>
          </div>

          {/* Quick CEO Control Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {currentRole === 'CEO' && (
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F5C451]/15 to-white/[0.04] hover:from-[#F5C451]/25 hover:to-white/[0.08] border border-[#F5C451]/40 text-xs font-bold text-[#F5C451] transition-all shadow-sm group"
              >
                <Megaphone className="w-4 h-4 text-[#F5C451] group-hover:scale-110 transition-transform" />
                <span>Broadcast Directive</span>
              </button>
            )}

            <button
              onClick={() => {
                setAiInitialPrompt('Predict potential project delays across all engineering initiatives and recommend resource shifts.');
                setIsAiDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] hover:scale-[1.03] text-xs font-bold text-white shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#00D4FF]/40 transition-all duration-200 group"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>AI Strategic Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Floating KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card p-5 rounded-[24px] hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold text-[#A7B0C0] leading-tight pr-2">{stat.title}</p>
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md shadow-[#4F7CFF]/15 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                <div className="flex items-center justify-between mt-1.5 text-xs">
                  <span className="font-bold text-[#22C55E] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {stat.change}
                  </span>
                  <span className="text-[11px] text-[#A7B0C0] font-medium">{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CEO Action Queue (Exclusive Gold Styling) */}
      {(pendingPayroll || readyOffers.length > 0 || criticalTasksCount > 0) && (
        <div className="p-6 rounded-[24px] bg-gradient-to-r from-[#141B2D] via-[#1a2238] to-[#141B2D] border border-[#F5C451]/35 shadow-2xl shadow-[#F5C451]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C451]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5C451] animate-ping" />
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#F5C451]">👑 CEO Authorization Queue</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5C451]/20 text-[#F5C451] font-mono border border-[#F5C451]/30">
                  EXECUTIVE SIGN-OFF REQUIRED
                </span>
              </h2>
            </div>
            <span className="text-[11px] text-[#A7B0C0] font-mono">3 Pending Authorizations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Payroll Authorization Card */}
            {pendingPayroll ? (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#F5C451]/40 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#F5C451]">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#F5C451]" />
                      September Payroll Run
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5C451]/20 text-[#F5C451] font-mono text-[10px] border border-[#F5C451]/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-white mt-2">$348,500.00</p>
                  <p className="text-[11px] text-[#A7B0C0] mt-0.5">
                    Gross salary, bonuses and withholdings for all 48 employees.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={approvePayrollBatch}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:opacity-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Sign & Approve
                  </button>
                  <button
                    onClick={() => setActiveTab('payroll')}
                    className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold transition-all"
                  >
                    Audit
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#22C55E]/30 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                <div>
                  <p className="text-xs font-bold text-white">Payroll Dispatched</p>
                  <p className="text-[11px] text-[#A7B0C0]">All 48 employees paid on schedule.</p>
                </div>
              </div>
            )}

            {/* Candidate Offer Review */}
            {readyOffers.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#00D4FF]/35 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#00D4FF]">
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-[#00D4FF]" />
                      Executive Offer Sign-off
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] font-mono text-[10px] border border-[#00D4FF]/30">
                      Selected
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mt-2">{readyOffers[0].name}</p>
                  <p className="text-[11px] text-[#A7B0C0]">
                    {readyOffers[0].targetRole} (${readyOffers[0].offerDetails?.salary?.toLocaleString()} +{' '}
                    {readyOffers[0].offerDetails?.equity})
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('hiring')}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] hover:scale-[1.02] text-white font-bold text-xs transition-all shadow-md text-center"
                  >
                    Review Offer Package
                  </button>
                </div>
              </div>
            )}

            {/* Critical Sprint Milestone */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#4F7CFF]/35 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#4F7CFF]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#4F7CFF]" />
                    SOC2 Compliance Sprint
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#4F7CFF]/15 text-[#00D4FF] font-mono text-[10px] border border-[#00D4FF]/30">
                    92% Complete
                  </span>
                </div>
                <p className="text-sm font-bold text-white mt-2">Zero-Trust Enclave Hardened</p>
                <p className="text-[11px] text-[#A7B0C0]">
                  Final external red-team audit scheduled for next week.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('projects')}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all text-center"
                >
                  View Sprint Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: 3D Department Rooms & Active Strategic Initiatives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Virtual Department Rooms Overview */}
        <div className="lg:col-span-2 glass-card p-6 rounded-[24px]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <Building className="w-4 h-4 text-[#00D4FF]" />
                Virtual Office Rooms & Real-Time IoT Telemetry
              </h2>
              <p className="text-[11px] text-[#A7B0C0] mt-0.5">
                8 active rooms with live temperature, ambient acoustic metrics, and active member occupancy.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('office')}
              className="text-xs font-bold text-[#00D4FF] hover:underline flex items-center gap-1"
            >
              Open 3D Floor Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            {rooms.slice(0, 6).map((room) => (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setActiveTab('office');
                }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#4F7CFF]/40 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: room.color }}
                    />
                    <h4 className="text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                      {room.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A7B0C0] border border-white/[0.08]">
                    {room.shortCode}
                  </span>
                </div>

                <p className="text-[11px] text-[#A7B0C0] mt-1 line-clamp-1">{room.ambientStatus}</p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[10px]">
                  <span className="text-[#A7B0C0] font-medium">
                    Lead: <span className="text-white font-semibold">{room.teamLeadName}</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[#A7B0C0]">
                    <span>👥 {room.currentOccupants}/{room.capacity}</span>
                    <span className="text-[#22C55E] font-bold">{room.avgPerformanceScore}% Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Active Strategic Initiatives & Sprints */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4F7CFF]" />
                Active Strategic Sprints
              </h2>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-bold text-[#00D4FF] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {projects.slice(0, 3).map((prj) => (
                <div key={prj.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#4F7CFF]/15 text-[#00D4FF] border border-[#00D4FF]/30 font-bold">
                        {prj.code}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1.5">{prj.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prj.status === 'Testing'
                          ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                          : prj.status === 'In Progress'
                          ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30'
                          : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                      }`}
                    >
                      {prj.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-[#A7B0C0] mb-1">
                      <span>Progress</span>
                      <span className="font-mono text-white font-bold">{prj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF]"
                        style={{ width: `${prj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 text-[10px] text-[#A7B0C0]">
                    <span>Lead: {prj.teamLeadName}</span>
                    <span className="font-mono">Budget: ${prj.budget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="w-full mt-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-white text-center transition-all"
          >
            Open Project Backlog & Milestones
          </button>
        </div>
      </div>

      {/* Pinned Company-Wide CEO Announcement */}
      {announcements.length > 0 && (
        <div className="glass-card p-6 rounded-[24px] bg-gradient-to-r from-[#141B2D] via-[#111827] to-[#141B2D] border border-white/[0.08]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#F5C451] to-[#FFE28A] text-black shadow-lg shadow-[#F5C451]/20">
                <Megaphone className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5C451]/20 text-[#F5C451] border border-[#F5C451]/30 font-bold">
                    👑 OFFICIAL CEO DIRECTIVE
                  </span>
                  <span className="text-xs text-[#A7B0C0]">{announcements[0].timestamp}</span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1.5">{announcements[0].title}</h3>
                <p className="text-xs text-[#A7B0C0] mt-1 leading-relaxed max-w-4xl">
                  {announcements[0].content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {announcements[0].reactions.map((r, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#00D4FF] text-xs text-[#A7B0C0] hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <span>{r.emoji}</span>
                  <span className="text-[10px] font-mono">{r.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
