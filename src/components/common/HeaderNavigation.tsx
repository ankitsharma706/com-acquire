import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Building,
  CheckSquare,
  Users,
  UserCheck,
  UserPlus,
  CreditCard,
  Award,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  Network,
  DoorOpen,
  FileText,
  Megaphone,
  Sparkles,
  RefreshCw,
  GitMerge,
  FileCheck,
  FolderOpen,
  Video,
  ChevronLeft,
  ChevronRight,
  Grid,
  Check,
} from 'lucide-react';
import { useCompany, MainNavTab } from '../../context/CompanyContext';

export const HeaderNavigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    payrollBatch,
    candidates,
    projects,
    alerts,
    leaveRequests,
    workflows,
    approvals,
    documents,
    setIsAnnouncementModalOpen,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    resetToDefaults,
  } = useCompany();

  const [activeSectionFilter, setActiveSectionFilter] = useState<'ALL' | 'OPERATIONS' | 'PEOPLE & FINANCE' | 'COMMUNICATIONS & INSIGHTS'>('ALL');
  const [isGridMenuOpen, setIsGridMenuOpen] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridMenuRef = useRef<HTMLDivElement>(null);

  const pendingPayroll = payrollBatch.status === 'Pending CEO Approval';
  const selectedCandidatesCount = candidates.filter((c) => c.stage === 'Selected' || c.stage === 'Offer Sent').length;
  const activeProjectsCount = projects.filter((p) => p.status === 'Active' || p.status === 'In Progress').length;
  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending Review').length;
  const activeWorkflowsCount = workflows.filter((w) => w.status === 'Active').length;

  const navItems: {
    id: MainNavTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    pageNumber: number;
    section: 'OPERATIONS' | 'PEOPLE & FINANCE' | 'COMMUNICATIONS & INSIGHTS';
  }[] = [
    // Section 1: Operations
    { id: 'dashboard', label: 'CEO Command Center', shortLabel: 'Command Center', icon: LayoutDashboard, pageNumber: 1, section: 'OPERATIONS' },
    { id: 'office', label: 'Virtual Office Map', shortLabel: 'Office Map', icon: Building, badge: '15 Rooms', badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30', pageNumber: 2, section: 'OPERATIONS' },
    { id: 'workflow', label: 'Workflow Engine', shortLabel: 'Workflows', icon: GitMerge, badge: activeWorkflowsCount > 0 ? `${activeWorkflowsCount} Live` : '11 Steps', badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 font-bold animate-pulse', pageNumber: 3, section: 'OPERATIONS' },
    { id: 'projects', label: 'Projects & Sprints', shortLabel: 'Projects', icon: CheckSquare, badge: activeProjectsCount, badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30', pageNumber: 4, section: 'OPERATIONS' },
    { id: 'employees', label: 'Employees Directory', shortLabel: 'Employees', icon: Users, badge: '48 Active', badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30', pageNumber: 5, section: 'OPERATIONS' },
    { id: 'hierarchy', label: 'Company Structure', shortLabel: 'Structure', icon: Network, pageNumber: 6, section: 'OPERATIONS' },

    // Section 2: People & Finance
    { id: 'hr_center', label: 'HR Center', shortLabel: 'HR Center', icon: UserCheck, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} Leaves` : undefined, badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30', pageNumber: 7, section: 'PEOPLE & FINANCE' },
    { id: 'hiring', label: 'Hiring Pipeline', shortLabel: 'Hiring', icon: UserPlus, badge: selectedCandidatesCount > 0 ? `${selectedCandidatesCount} Offers` : candidates.length, badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30', pageNumber: 8, section: 'PEOPLE & FINANCE' },
    { id: 'payroll', label: 'Payroll & Treasury', shortLabel: 'Payroll', icon: CreditCard, badge: pendingPayroll ? 'Sign-off' : '$348.5k', badgeColor: pendingPayroll ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/40 font-bold animate-pulse' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300', pageNumber: 9, section: 'PEOPLE & FINANCE' },
    { id: 'approvals', label: 'Approvals Hub', shortLabel: 'Approvals', icon: FileCheck, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Needs CEO` : 'All Clear', badgeColor: pendingApprovalsCount > 0 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 font-bold animate-pulse' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30', pageNumber: 10, section: 'PEOPLE & FINANCE' },
    { id: 'documents', label: 'Document Vault', shortLabel: 'Doc Vault', icon: FolderOpen, badge: `${documents.length} Files`, badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30', pageNumber: 11, section: 'PEOPLE & FINANCE' },
    { id: 'performance', label: 'Performance & OKRs', shortLabel: 'Performance', icon: Award, pageNumber: 12, section: 'PEOPLE & FINANCE' },
    { id: 'department_rooms', label: 'Department Rooms', shortLabel: 'Dept Rooms', icon: DoorOpen, badge: '15 Depts', badgeColor: 'bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30', pageNumber: 13, section: 'PEOPLE & FINANCE' },

    // Section 3: Communications & Insights
    { id: 'war_room', label: 'Metaverse War Room', shortLabel: 'War Room 3D', icon: Video, badge: '3D Spatial', badgeColor: 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 animate-pulse font-bold', pageNumber: 14, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'communication', label: 'Team Chat & Channels', shortLabel: 'Team Chat', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 animate-pulse', pageNumber: 15, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'notifications', label: 'Notification Center', shortLabel: 'Alerts', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, badgeColor: 'bg-red-500/20 text-red-700 dark:text-red-400 font-bold', pageNumber: 16, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'analytics', label: 'Analytics & BI', shortLabel: 'Analytics', icon: BarChart3, pageNumber: 17, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'reports', label: 'Reports Center', shortLabel: 'Reports', icon: FileText, badge: 'PDF/CSV', badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30', pageNumber: 18, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'settings', label: 'Settings & Security', shortLabel: 'Settings', icon: Settings, pageNumber: 19, section: 'COMMUNICATIONS & INSIGHTS' },
  ];

  // Close grid menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridMenuRef.current && !gridMenuRef.current.contains(event.target as Node)) {
        setIsGridMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on active section
  const displayedItems = activeSectionFilter === 'ALL'
    ? navItems
    : navItems.filter((item) => item.section === activeSectionFilter);

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Scroll active tab into view when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <nav className="sticky top-16 z-20 w-full bg-[#FFFFFF]/95 dark:bg-[#0A0E17]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] shadow-sm select-none transition-all">
      {/* Upper Category Ribbon & Quick Executive Actions */}
      <div className="px-4 lg:px-8 py-2 border-b border-slate-100 dark:border-white/[0.04] flex items-center justify-between gap-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mr-1 hidden sm:inline">
            Modules:
          </span>

          <button
            onClick={() => setActiveSectionFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSectionFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            All Modules <span className="text-[10px] opacity-75">({navItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter('OPERATIONS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSectionFilter === 'OPERATIONS'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            ⚡ Operations <span className="text-[10px] opacity-75">(6)</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter('PEOPLE & FINANCE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSectionFilter === 'PEOPLE & FINANCE'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            💼 People & Capital <span className="text-[10px] opacity-75">(7)</span>
          </button>

          <button
            onClick={() => setActiveSectionFilter('COMMUNICATIONS & INSIGHTS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSectionFilter === 'COMMUNICATIONS & INSIGHTS'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            📡 Intel & Comms <span className="text-[10px] opacity-75">(6)</span>
          </button>
        </div>

        {/* Right Side Quick Controls & All Apps Grid Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          {currentRole === 'CEO' && (
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Broadcast Company Announcement"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          )}

          <button
            onClick={() => {
              setAiInitialPrompt('Generate a comprehensive quarterly executive operations report for CompanyHQ.');
              setIsAiDrawerOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all shadow-sm"
            title="Generate AI Executive Intelligence Report"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Report</span>
          </button>

          <button
            onClick={resetToDefaults}
            title="Reset company demo state"
            className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Grid View Launcher Dropdown */}
          <div className="relative" ref={gridMenuRef}>
            <button
              onClick={() => setIsGridMenuOpen(!isGridMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                isGridMenuOpen
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Apps</span>
            </button>

            {/* Grid Mega Menu Dropdown */}
            {isGridMenuOpen && (
              <div className="absolute right-0 top-9 w-[320px] sm:w-[580px] p-4 bg-white dark:bg-[#101726] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      CompanyHQ Enterprise Directory
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                    19 Modules
                  </span>
                </div>

                {/* Operations Group */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2">
                    ⚡ Core Operations
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {navItems
                      .filter((i) => i.section === 'OPERATIONS')
                      .map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeTab === item.id || (item.id === 'employees' && activeTab === 'hr');
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsGridMenuOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium text-left transition-all ${
                              isCurrent
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* People & Finance Group */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2">
                    💼 People & Capital
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {navItems
                      .filter((i) => i.section === 'PEOPLE & FINANCE')
                      .map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsGridMenuOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium text-left transition-all ${
                              isCurrent
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Communications & Intel Group */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2">
                    📡 Communications & Intel
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {navItems
                      .filter((i) => i.section === 'COMMUNICATIONS & INSIGHTS')
                      .map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsGridMenuOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium text-left transition-all ${
                              isCurrent
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Horizontal Navigation Strip */}
      <div className="relative px-2 sm:px-4 lg:px-8 py-2 flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors shrink-0 mr-1"
          aria-label="Scroll navigation left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Horizontal Navigation Items Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 flex-1"
        >
          {displayedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'employees' && activeTab === 'hr');

            return (
              <button
                key={item.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span>{item.shortLabel}</span>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : item.badgeColor || 'bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors shrink-0 ml-1"
          aria-label="Scroll navigation right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
