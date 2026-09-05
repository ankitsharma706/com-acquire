import React from 'react';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import { Header } from './components/common/Header';
import { HeaderNavigation } from './components/common/HeaderNavigation';
import { CeoCommandCenter } from './components/dashboard/CeoCommandCenter';
import { VirtualOfficeMap } from './components/office/VirtualOfficeMap';
import { OrgChart } from './components/hierarchy/OrgChart';
import { ProjectManagement } from './components/projects/ProjectManagement';
import { EmployeeManagement } from './components/hr/EmployeeManagement';
import { HRCenter } from './components/hr/HRCenter';
import { HiringPipeline } from './components/hiring/HiringPipeline';
import { PayrollDashboard } from './components/payroll/PayrollDashboard';
import { PerformanceTracker } from './components/performance/PerformanceTracker';
import { CommunicationHub } from './components/communication/CommunicationHub';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { SettingsModule } from './components/settings/SettingsModule';
import { DepartmentRoomsHub } from './components/departments/DepartmentRoomsHub';
import { ReportsCenter } from './components/reports/ReportsCenter';
import { SecurityAuditModal } from './components/security/SecurityAuditModal';
import { WorkflowEngine } from './components/workflow/WorkflowEngine';
import { ApprovalsHub } from './components/approvals/ApprovalsHub';
import { DocumentVault } from './components/documents/DocumentVault';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { AnnouncementModal } from './components/announcements/AnnouncementModal';
import { MetaverseWarRoomModal } from './components/communication/MetaverseWarRoomModal';
import { MetaverseWarRoomView } from './components/warroom/MetaverseWarRoomView';

const AppContent: React.FC = () => {
  const { activeTab } = useCompany();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CeoCommandCenter />;
      case 'office':
        return <VirtualOfficeMap />;
      case 'war_room':
        return <MetaverseWarRoomView />;
      case 'workflow':
        return <WorkflowEngine />;
      case 'projects':
        return <ProjectManagement />;
      case 'employees':
      case 'hr':
        return <EmployeeManagement />;
      case 'hr_center':
        return <HRCenter />;
      case 'hiring':
        return <HiringPipeline />;
      case 'payroll':
        return <PayrollDashboard />;
      case 'approvals':
        return <ApprovalsHub />;
      case 'documents':
        return <DocumentVault />;
      case 'performance':
        return <PerformanceTracker />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'notifications':
        return <NotificationCenter />;
      case 'communication':
        return <CommunicationHub />;
      case 'settings':
        return <SettingsModule />;
      case 'hierarchy':
        return <OrgChart />;
      case 'department_rooms':
        return <DepartmentRoomsHub />;
      case 'reports':
        return <ReportsCenter />;
      case 'security':
        return <SecurityAuditModal />;
      default:
        return <CeoCommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] flex flex-col font-sans selection:bg-[#4F7CFF]/20 selection:text-[#2563EB]">
      {/* Top Enterprise Header */}
      <Header />

      {/* All Navigation Below The Header */}
      <HeaderNavigation />

      {/* Scrollable Core Workspace Canvas - Expanded to Full Screen Width */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {renderActiveView()}
        </div>
      </main>

      {/* Global Drawers & Modals */}
      <AiAssistantDrawer />
      <AnnouncementModal />
      <MetaverseWarRoomModal />
    </div>
  );
};

export default function App() {
  return (
    <CompanyProvider>
      <AppContent />
    </CompanyProvider>
  );
}
