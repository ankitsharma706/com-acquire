import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Shield,
  Search,
  UserCheck,
  ChevronDown,
  Building2,
  CheckCircle2,
  Video,
  Radio,
  X,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    setCurrentUser,
    employees,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    setIsMeetingModalOpen,
    setActiveTab,
    themeMode,
    toggleThemeMode,
  } = useCompany();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'CEO', label: 'CEO (Owner)', desc: 'Full root access to all systems, approvals, payroll, and strategy' },
    { role: 'HR_MANAGER', label: 'HR Manager', desc: 'Manage hiring pipeline, employee onboarding, policies & leaves' },
    { role: 'FINANCE_MANAGER', label: 'Finance Manager', desc: 'Budget oversight, treasury forecasts & payroll reviews' },
    { role: 'PROJECT_MANAGER', label: 'Project Manager', desc: 'Sprint planning, Gantt charts, milestones & task allocation' },
    { role: 'TEAM_LEAD', label: 'Team Lead', desc: 'Department room management, team reviews & OKR tracking' },
    { role: 'EMPLOYEE', label: 'Employee', desc: 'Task execution, sprint work, payslips & team channels' },
    { role: 'RECRUITER', label: 'Recruiter', desc: 'Candidate pipeline, interview scheduling & offer letters' },
    { role: 'ACCOUNTANT', label: 'Accountant', desc: 'Invoicing, tax withholding ledgers & expense reimbursements' },
    { role: 'VIEWER', label: 'Viewer (Auditor / Board)', desc: 'Read-only access across high-level operational dashboards' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    // Switch currentUser to matching representative
    const matchingEmp = employees.find((e) => e.userRoleType === role) || employees[0];
    setCurrentUser(matchingEmp);
  };

  const filteredSearch = searchQuery.trim()
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0A0E17]/85 backdrop-blur-2xl px-4 lg:px-8 flex items-center justify-between transition-all">
      {/* Left branding & company status indicator */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F7CFF] via-[#3B6AE8] to-[#00D4FF] p-[1px] shadow-lg shadow-[#4F7CFF]/25 group-hover:shadow-[#00D4FF]/40 transition-all">
            <div className="w-full h-full bg-white dark:bg-[#0A0E17] rounded-[15px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-[#00D4FF] group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white dark:border-[#0A0E17] animate-pulse" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#00D4FF] transition-colors">
                Company<span className="text-blue-600 dark:text-[#4F7CFF]">HQ</span> <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-black">AI</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-[#4F7CFF]/15 text-blue-700 dark:text-[#00D4FF] border border-blue-200 dark:border-[#00D4FF]/30 tracking-wider font-mono">
                ENTERPRISE OS v4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#A7B0C0] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              48 Employees Active • 8 Rooms Online
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80 ml-2">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 dark:text-[#A7B0C0]" />
          <input
            type="text"
            placeholder="Search teams, people, projects... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl text-xs bg-slate-100 dark:bg-[#141B2D]/80 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#6B7280] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <div className="absolute top-11 left-0 w-full rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-2 z-50 max-h-72 overflow-y-auto backdrop-blur-2xl">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setActiveTab('hr');
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">{emp.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#A7B0C0]">
                        {emp.role} • {emp.departmentName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-[#A7B0C0] p-2 text-center">No matching members found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Virtual War Room Quick Launch */}
        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#A7B0C0] hover:text-slate-900 dark:hover:text-white transition-all shadow-sm group"
          title="Join All-Hands Video Boardroom"
        >
          <div className="relative">
            <Video className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00D4FF] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-ping" />
          </div>
          <span className="font-medium text-[11px]">Metaverse War Room</span>
        </button>

        {/* AI Co-Pilot Action Button - Master AI Gradient System */}
        <button
          onClick={() => {
            setAiInitialPrompt('Provide an executive health overview and highlight critical bottlenecks.');
            setIsAiDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:scale-[1.03] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all duration-200 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">AI Co-Pilot</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20 font-mono">⚡ 3.7</span>
        </button>

        {/* Quick Theme Switcher */}
        <button
          onClick={toggleThemeMode}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A7B0C0] hover:text-slate-900 dark:hover:text-white transition-all group"
          title={`Switch to ${themeMode === 'Enterprise Dark' ? 'High-Contrast Light' : 'Enterprise Dark'} mode`}
          aria-label="Toggle theme mode"
        >
          {themeMode === 'Enterprise Dark' ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A7B0C0] hover:text-slate-900 dark:hover:text-white transition-all"
            title="System Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#EF4444] text-white text-[10px] font-bold px-1 animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isAlertsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-4 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company Alerts</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#4F7CFF]/20 text-blue-600 dark:text-[#00D4FF] font-bold">
                    {unreadAlerts.length} new
                  </span>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={markAllAlertsRead}
                    className="text-[11px] text-blue-600 dark:text-[#00D4FF] hover:underline transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        markAlertRead(alert.id);
                        if (alert.actionLink) {
                          setActiveTab(alert.actionLink as any);
                          setIsAlertsOpen(false);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        alert.isRead
                          ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04] opacity-75 hover:opacity-100'
                          : 'bg-blue-50/50 dark:bg-white/[0.06] border-blue-200 dark:border-[#4F7CFF]/30 shadow-sm hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              alert.severity === 'danger'
                                ? 'bg-[#EF4444]'
                                : alert.severity === 'warning'
                                ? 'bg-[#F59E0B]'
                                : alert.severity === 'success'
                                ? 'bg-[#22C55E]'
                                : 'bg-[#00D4FF]'
                            }`}
                          />
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-[#A7B0C0] whitespace-nowrap">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-[#A7B0C0] mt-1.5 leading-relaxed">{alert.message}</p>
                      {alert.actionText && (
                        <div className="mt-2 flex justify-end">
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-[#00D4FF] hover:underline flex items-center gap-1">
                            {alert.actionText} <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-[#A7B0C0] py-6 text-center">No alerts in system</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Selector - CEO Executive Styling */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all group ${
              currentRole === 'CEO'
                ? 'bg-amber-50 dark:bg-gradient-to-r dark:from-[#F5C451]/15 dark:to-white/[0.03] border-amber-300 dark:border-[#F5C451]/40 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/10'
            }`}
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={`w-8 h-8 rounded-xl object-cover ring-2 ${
                  currentRole === 'CEO' ? 'ring-amber-500' : 'ring-blue-500/50'
                }`}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-white dark:ring-[#0A0E17]" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                    currentRole === 'CEO'
                      ? 'bg-amber-100 text-amber-900 dark:bg-gradient-to-r dark:from-[#F5C451] dark:to-[#FFE28A] dark:text-black shadow-sm font-extrabold border border-amber-300 dark:border-none'
                      : 'bg-blue-100 dark:bg-[#4F7CFF]/20 text-blue-700 dark:text-[#00D4FF] border border-blue-200 dark:border-[#00D4FF]/30'
                  }`}
                >
                  {currentRole === 'CEO' ? '👑 CEO OWNER' : currentRole.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#A7B0C0] truncate max-w-[130px]">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#A7B0C0] group-hover:text-slate-800 dark:group-hover:text-white transition-transform" />
          </button>

          {/* Role Dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in">
              <div className="p-2.5 border-b border-slate-100 dark:border-white/[0.08]">
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#A7B0C0] uppercase tracking-wider font-mono">Switch Operating Perspective</p>
                <p className="text-[11px] text-slate-700 dark:text-white mt-0.5">Test UI permissions and role workflows in real-time.</p>
              </div>

              <div className="mt-1 space-y-1">
                {roleOptions.map((opt) => (
                  <div
                    key={opt.role}
                    onClick={() => handleRoleChange(opt.role)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between ${
                      currentRole === opt.role
                        ? opt.role === 'CEO'
                          ? 'bg-amber-50 dark:bg-gradient-to-r dark:from-[#F5C451]/20 dark:to-transparent border border-amber-300 dark:border-[#F5C451]/50 text-slate-900 dark:text-white font-bold'
                          : 'bg-blue-50 dark:bg-[#4F7CFF]/20 border border-blue-200 dark:border-[#4F7CFF]/40 text-blue-900 dark:text-white font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-[#A7B0C0] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        {opt.label}
                        {opt.role === 'CEO' && <Shield className="w-3 h-3 text-amber-500" />}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-[#A7B0C0] mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                    {currentRole === opt.role && (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          opt.role === 'CEO' ? 'text-amber-600' : 'text-blue-600 dark:text-[#00D4FF]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
