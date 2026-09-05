import React from 'react';
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
  ShieldCheck,
  Megaphone,
  Sparkles,
  RefreshCw,
  GitMerge,
  FileCheck,
  FolderOpen,
  Video,
} from 'lucide-react';
import { useCompany, MainNavTab } from '../../context/CompanyContext';

export const Sidebar: React.FC = () => {
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
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    pageNumber: number;
    section: 'OPERATIONS' | 'PEOPLE & FINANCE' | 'COMMUNICATIONS & INSIGHTS';
  }[] = [
    // Section 1: Operations
    { id: 'dashboard', label: 'CEO Command Center', icon: LayoutDashboard, pageNumber: 1, section: 'OPERATIONS' },
    { id: 'office', label: 'Virtual Office Map', icon: Building, badge: '15 Rooms', badgeColor: 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30', pageNumber: 2, section: 'OPERATIONS' },
    { id: 'workflow', label: 'Workflow Engine', icon: GitMerge, badge: activeWorkflowsCount > 0 ? `${activeWorkflowsCount} Live` : '11 Steps', badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 font-bold animate-pulse', pageNumber: 3, section: 'OPERATIONS' },
    { id: 'projects', label: 'Projects & Sprints', icon: CheckSquare, badge: activeProjectsCount, badgeColor: 'bg-[#4F7CFF]/20 text-[#4F7CFF] border border-[#4F7CFF]/30', pageNumber: 4, section: 'OPERATIONS' },
    { id: 'employees', label: 'Employees Directory', icon: Users, badge: '48 Active', badgeColor: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30', pageNumber: 5, section: 'OPERATIONS' },
    { id: 'hierarchy', label: 'Company Structure', icon: Network, pageNumber: 6, section: 'OPERATIONS' },

    // Section 2: People & Finance
    { id: 'hr_center', label: 'HR Center', icon: UserCheck, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} Leaves` : undefined, badgeColor: 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30', pageNumber: 7, section: 'PEOPLE & FINANCE' },
    { id: 'hiring', label: 'Hiring Pipeline', icon: UserPlus, badge: selectedCandidatesCount > 0 ? `${selectedCandidatesCount} Offers` : candidates.length, badgeColor: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30', pageNumber: 8, section: 'PEOPLE & FINANCE' },
    { id: 'payroll', label: 'Payroll & Treasury', icon: CreditCard, badge: pendingPayroll ? 'Sign-off' : '$348.5k', badgeColor: pendingPayroll ? 'bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 font-bold animate-pulse' : 'bg-white/[0.06] text-[#A7B0C0]', pageNumber: 9, section: 'PEOPLE & FINANCE' },
    { id: 'approvals', label: 'Approvals Hub', icon: FileCheck, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Needs CEO` : 'All Clear', badgeColor: pendingApprovalsCount > 0 ? 'bg-[#F5C451]/25 text-[#F5C451] border border-[#F5C451]/40 font-bold animate-pulse' : 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30', pageNumber: 10, section: 'PEOPLE & FINANCE' },
    { id: 'documents', label: 'Document Vault', icon: FolderOpen, badge: `${documents.length} Files`, badgeColor: 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30', pageNumber: 11, section: 'PEOPLE & FINANCE' },
    { id: 'performance', label: 'Performance & OKRs', icon: Award, pageNumber: 12, section: 'PEOPLE & FINANCE' },
    { id: 'department_rooms', label: 'Department Rooms', icon: DoorOpen, badge: '15 Depts', badgeColor: 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30', pageNumber: 13, section: 'PEOPLE & FINANCE' },

    // Section 3: Communications & Insights
    { id: 'war_room', label: 'Metaverse War Room', icon: Video, badge: '3D Spatial', badgeColor: 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#00D4FF]/25 text-[#00D4FF] border border-[#00D4FF]/40 animate-pulse font-bold', pageNumber: 14, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'communication', label: 'Team Chat & Channels', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 animate-pulse', pageNumber: 15, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'notifications', label: 'Notification Center', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, badgeColor: 'bg-[#EF4444]/25 text-[#EF4444] font-bold', pageNumber: 16, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'analytics', label: 'Analytics & BI', icon: BarChart3, pageNumber: 17, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'reports', label: 'Reports Center', icon: FileText, badge: 'PDF/CSV', badgeColor: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30', pageNumber: 18, section: 'COMMUNICATIONS & INSIGHTS' },
    { id: 'settings', label: 'Settings & Security', icon: Settings, pageNumber: 19, section: 'COMMUNICATIONS & INSIGHTS' },
  ];

  const renderSection = (sectionName: 'OPERATIONS' | 'PEOPLE & FINANCE' | 'COMMUNICATIONS & INSIGHTS', title: string) => {
    const items = navItems.filter((i) => i.section === sectionName);
    return (
      <div key={sectionName} className="mb-5">
        <p className="px-3 mb-2 text-[9px] font-bold text-[#6B7280] tracking-wider uppercase font-mono">
          {title}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'employees' && activeTab === 'hr');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F7CFF]/20 via-[#4F7CFF]/10 to-[#00D4FF]/10 text-white border border-[#4F7CFF]/35 shadow-sm shadow-[#4F7CFF]/20'
                    : 'text-[#A7B0C0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#4F7CFF] to-[#00D4FF] rounded-r-full shadow-sm shadow-[#00D4FF]" />
                )}
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#00D4FF]' : 'text-[#A7B0C0] group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-[#6B7280] font-mono">P{item.pageNumber}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        item.badgeColor || 'bg-white/[0.06] text-[#A7B0C0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] border-r border-white/[0.08] bg-[#0A0E17]/95 backdrop-blur-2xl p-3.5 overflow-y-auto select-none justify-between">
      <div>
        {renderSection('OPERATIONS', 'Core Operations')}
        {renderSection('PEOPLE & FINANCE', 'People & Capital')}
        {renderSection('COMMUNICATIONS & INSIGHTS', 'Communications & Intel')}
      </div>

      {/* Bottom Quick Controls */}
      <div className="pt-3 mt-2 border-t border-white/[0.08] space-y-2">
        {currentRole === 'CEO' && (
          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-gradient-to-r from-[#F5C451]/15 to-white/[0.03] hover:from-[#F5C451]/25 hover:to-white/[0.06] border border-[#F5C451]/40 text-xs font-bold text-[#F5C451] transition-all shadow-sm"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#F5C451]" />
            <span>Broadcast Announcement</span>
          </button>
        )}

        <button
          onClick={() => {
            setAiInitialPrompt('Generate a comprehensive quarterly executive operations report for CompanyHQ.');
            setIsAiDrawerOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 via-[#4F7CFF]/15 to-[#00D4FF]/15 hover:from-[#8B5CF6]/25 hover:to-[#00D4FF]/25 border border-[#8B5CF6]/40 text-xs font-bold text-white transition-all shadow-md shadow-[#8B5CF6]/15 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00D4FF] group-hover:rotate-12 transition-transform" />
          <span>AI Executive Report</span>
        </button>

        <div className="flex items-center justify-between pt-1 px-1 text-[10px] text-[#6B7280]">
          <span className="font-mono">Sync: 12ms (Optimal)</span>
          <button
            onClick={resetToDefaults}
            title="Reset company demo state"
            className="flex items-center gap-1 text-[#A7B0C0] hover:text-white transition-colors"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            Reset Data
          </button>
        </div>
      </div>
    </aside>
  );
};
