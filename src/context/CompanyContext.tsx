import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Employee,
  DepartmentRoom,
  DepartmentId,
  Project,
  ProjectTask,
  ProjectStatus,
  Candidate,
  CandidateStage,
  JobPosting,
  PayrollBatch,
  Invoice,
  CompanyAnnouncement,
  ChatMessage,
  ChatChannel,
  NotificationAlert,
  AuditLog,
  WorkflowPipeline,
  ApprovalItem,
  CompanyDocument,
  ScheduledMeeting,
  EmployeeBadge,
  RecognitionBadgeType,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_CANDIDATES,
  INITIAL_JOB_POSTINGS,
  INITIAL_PAYROLL_BATCH,
  INITIAL_INVOICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_POLICIES,
  INITIAL_ONBOARDING_TASKS,
  INITIAL_EXIT_PROCESSES,
  INITIAL_REIMBURSEMENTS,
  INITIAL_SETTINGS,
  INITIAL_WORKFLOWS,
  INITIAL_APPROVALS,
  INITIAL_DOCUMENTS,
  INITIAL_SCHEDULED_MEETINGS,
} from '../data/initialData';
import {
  LeaveRequest,
  HRPolicy,
  OnboardingTask,
  ExitProcess,
  ExpenseReimbursement,
  CompanySettings,
  ThemeMode,
} from '../types';

export type MainNavTab =
  | 'dashboard'
  | 'office'
  | 'war_room'
  | 'workflow'
  | 'projects'
  | 'employees'
  | 'hr_center'
  | 'hiring'
  | 'payroll'
  | 'approvals'
  | 'documents'
  | 'performance'
  | 'analytics'
  | 'notifications'
  | 'communication'
  | 'settings'
  | 'hierarchy'
  | 'department_rooms'
  | 'reports'
  | 'security'
  | 'hr'; // legacy alias support

interface CompanyContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  setCurrentUser: (user: Employee) => void;
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  
  // Data
  rooms: DepartmentRoom[];
  employees: Employee[];
  projects: Project[];
  candidates: Candidate[];
  jobPostings: JobPosting[];
  payrollBatch: PayrollBatch;
  invoices: Invoice[];
  announcements: CompanyAnnouncement[];
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  alerts: NotificationAlert[];
  auditLogs: AuditLog[];
  leaveRequests: LeaveRequest[];
  policies: HRPolicy[];
  onboardingTasks: OnboardingTask[];
  exitProcesses: ExitProcess[];
  reimbursements: ExpenseReimbursement[];
  settings: CompanySettings;
  workflows: WorkflowPipeline[];
  approvals: ApprovalItem[];
  documents: CompanyDocument[];
  scheduledMeetings: ScheduledMeeting[];
  
  // Modals & Drawers
  selectedRoom: DepartmentRoom | null;
  setSelectedRoom: (room: DepartmentRoom | null) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (cand: Candidate | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  
  // AI Copilot state
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  aiInitialPrompt: string;
  setAiInitialPrompt: (prompt: string) => void;
  isMeetingModalOpen: boolean;
  setIsMeetingModalOpen: (open: boolean) => void;
  isAnnouncementModalOpen: boolean;
  setIsAnnouncementModalOpen: (open: boolean) => void;

  // Actions
  triggerConfettiEffect: () => void;
  addNewEmployee: (emp: Partial<Employee>) => void;
  fireEmployee: (empId: string, reason?: string) => void;
  promoteEmployee: (empId: string, newRole: string, salaryBump: number) => void;
  reassignTeamLead: (departmentId: DepartmentId, employeeId: string) => void;
  createProject: (project: Partial<Project>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  addTaskToProject: (projectId: string, task: Partial<ProjectTask>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: 'Todo' | 'In Progress' | 'In Review' | 'Done') => void;
  advanceCandidateStage: (candidateId: string, nextStage: CandidateStage) => void;
  hireCandidate: (candidateId: string) => void;
  generateOfferLetter: (candidateId: string, salary: number, equity: string) => void;
  postNewJob: (job: Partial<JobPosting>) => void;
  approvePayrollBatch: () => void;
  releasePayrollBatch: () => void;
  broadcastAnnouncement: (announcement: { title: string; content: string; departmentId: string; isUrgent?: boolean }) => void;
  sendChatMessage: (channelId: string, text: string) => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  addAuditLog: (action: string, details: string, category: AuditLog['targetCategory']) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  submitLeaveRequest: (req: Partial<LeaveRequest>) => void;
  approveReimbursement: (id: string) => void;
  submitReimbursement: (reimb: Partial<ExpenseReimbursement>) => void;
  updateCompanySettings: (newSettings: Partial<CompanySettings>) => void;
  
  // Workflow, Approval, Document Actions
  advanceWorkflowStep: (pipelineId: string) => void;
  autoRunWorkflow: (pipelineId: string) => void;
  createWorkflowPipeline: (pipeline: Partial<WorkflowPipeline>) => void;
  approveApprovalItem: (id: string, comment?: string) => void;
  rejectApprovalItem: (id: string, reason?: string) => void;
  submitApprovalItem: (item: Partial<ApprovalItem>) => void;
  uploadDocument: (doc: Partial<CompanyDocument>) => void;
  deleteDocument: (id: string) => void;
  addScheduledMeeting: (meeting: Partial<ScheduledMeeting>) => void;
  updateScheduledMeetingStatus: (meetingId: string, status: ScheduledMeeting['status']) => void;
  scheduleCandidateInterview: (candidateId: string, date: string, time: string, interviewerId: string) => void;

  // AI Recognition System
  isAiAuditingBadges: boolean;
  aiAuditSummary: string | null;
  runAiBadgeRecognitionAudit: () => Promise<{ awardedCount: number; summary: string }>;
  awardManualBadge: (employeeId: string, badgeType: RecognitionBadgeType, customReason?: string) => void;
  removeBadge: (employeeId: string, badgeId: string) => void;
  sendEmployeeKudos: (employeeId: string, message?: string) => void;

  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  resetToDefaults: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'companyhq_os_state_v1';

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CEO');
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');
  
  // Entities
  const [rooms, setRooms] = useState<DepartmentRoom[]>(INITIAL_ROOMS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [currentUser, setCurrentUser] = useState<Employee>(INITIAL_EMPLOYEES[0]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);
  const [payrollBatch, setPayrollBatch] = useState<PayrollBatch>(INITIAL_PAYROLL_BATCH);
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [channels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-all');
  const [alerts, setAlerts] = useState<NotificationAlert[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [policies, setPolicies] = useState<HRPolicy[]>(INITIAL_POLICIES);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(INITIAL_ONBOARDING_TASKS);
  const [exitProcesses, setExitProcesses] = useState<ExitProcess[]>(INITIAL_EXIT_PROCESSES);
  const [reimbursements, setReimbursements] = useState<ExpenseReimbursement[]>(INITIAL_REIMBURSEMENTS);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [workflows, setWorkflows] = useState<WorkflowPipeline[]>(INITIAL_WORKFLOWS);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [documents, setDocuments] = useState<CompanyDocument[]>(INITIAL_DOCUMENTS);
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>(INITIAL_SCHEDULED_MEETINGS);

  // Modals / Drawers
  const [selectedRoom, setSelectedRoom] = useState<DepartmentRoom | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.employees) {
          // Merge initial badges and ensure badge schema integrity
          const mergedEmployees = parsed.employees.map((pe: Employee) => {
            const initEmp = INITIAL_EMPLOYEES.find((e) => e.id === pe.id);
            return {
              ...pe,
              badges: pe.badges && pe.badges.length > 0 ? pe.badges : (initEmp?.badges || []),
              kudosCount: pe.kudosCount ?? initEmp?.kudosCount ?? 0,
              collaborationScore: pe.collaborationScore ?? initEmp?.collaborationScore ?? 85,
            };
          });
          setEmployees(mergedEmployees);
        }
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.candidates) setCandidates(parsed.candidates);
        if (parsed.payrollBatch) setPayrollBatch(parsed.payrollBatch);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.alerts) setAlerts(parsed.alerts);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.leaveRequests) setLeaveRequests(parsed.leaveRequests);
        if (parsed.reimbursements) setReimbursements(parsed.reimbursements);
        if (parsed.settings) {
          setSettings({ ...parsed.settings, themeMode: 'Light' });
        }
      }
    } catch (e) {
      console.warn('Could not load saved state:', e);
    }
  }, []);

  // Save changes to local storage
  const saveState = (updated: Partial<{
    employees: Employee[];
    projects: Project[];
    candidates: Candidate[];
    payrollBatch: PayrollBatch;
    announcements: CompanyAnnouncement[];
    alerts: NotificationAlert[];
    auditLogs: AuditLog[];
    leaveRequests: LeaveRequest[];
    reimbursements: ExpenseReimbursement[];
    settings: CompanySettings;
  }>) => {
    try {
      const currentState = {
        employees: updated.employees || employees,
        projects: updated.projects || projects,
        candidates: updated.candidates || candidates,
        payrollBatch: updated.payrollBatch || payrollBatch,
        announcements: updated.announcements || announcements,
        alerts: updated.alerts || alerts,
        auditLogs: updated.auditLogs || auditLogs,
        leaveRequests: updated.leaveRequests || leaveRequests,
        reimbursements: updated.reimbursements || reimbursements,
        settings: updated.settings || settings,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  };

  const triggerConfettiEffect = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F7CFF', '#00D9FF', '#00C853', '#FFFFFF', '#FFB300'],
      });
    } catch {
      // safe fallback
    }
  };

  const addAuditLog = (action: string, details: string, category: AuditLog['targetCategory']) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      action,
      performedBy: currentUser.name,
      performedByRole: currentUser.role,
      details,
      targetCategory: category,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '198.51.100.1 (Enterprise Session)',
    };
    setAuditLogs((prev) => {
      const next = [newLog, ...prev];
      saveState({ auditLogs: next });
      return next;
    });
  };

  const addNewEmployee = (emp: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: emp.name || 'New Team Member',
      avatar: emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: emp.role || 'Software Engineer',
      userRoleType: emp.userRoleType || 'EMPLOYEE',
      departmentId: emp.departmentId || 'development',
      departmentName: emp.departmentName || 'Core Engineering',
      email: emp.email || `employee.${Date.now()}@companyhq.io`,
      phone: emp.phone || '+1 (415) 555-0100',
      salary: emp.salary || 140000,
      bonus: emp.bonus || 15000,
      equity: emp.equity || '0.5%',
      joiningDate: new Date().toISOString().split('T')[0],
      skills: emp.skills || ['TypeScript', 'Cloud Architecture', 'Problem Solving'],
      performanceRating: 90,
      performanceTier: 'Good',
      status: 'online',
      currentTask: 'Onboarding & Workspace Configuration',
      attendanceRate: 100,
      completedTasksCount: 0,
      assignedTasksCount: 2,
      location: emp.location || 'San Francisco HQ',
    };

    setEmployees((prev) => {
      const next = [newEmp, ...prev];
      saveState({ employees: next });
      return next;
    });

    addAuditLog('New Employee Hired', `Added ${newEmp.name} as ${newEmp.role} in ${newEmp.departmentName}`, 'Employees');
    triggerConfettiEffect();
  };

  const fireEmployee = (empId: string, reason = 'Executive Reorganization') => {
    const target = employees.find((e) => e.id === empId);
    if (!target) return;
    setEmployees((prev) => {
      const next = prev.filter((e) => e.id !== empId);
      saveState({ employees: next });
      return next;
    });
    addAuditLog('Employee Contract Terminated', `Deactivated ${target.name} (${target.role}). Reason: ${reason}`, 'Employees');
  };

  const promoteEmployee = (empId: string, newRole: string, salaryBump: number) => {
    setEmployees((prev) => {
      const next = prev.map((e) => {
        if (e.id === empId) {
          return {
            ...e,
            role: newRole,
            salary: e.salary + salaryBump,
            performanceRating: Math.min(100, e.performanceRating + 3),
            performanceTier: 'Excellent' as const,
          };
        }
        return e;
      });
      saveState({ employees: next });
      return next;
    });
    addAuditLog('Employee Promoted', `Promoted employee to ${newRole} with +$${salaryBump.toLocaleString()} salary increase`, 'Employees');
    triggerConfettiEffect();
  };

  const reassignTeamLead = (departmentId: DepartmentId, employeeId: string) => {
    const newLead = employees.find((e) => e.id === employeeId);
    if (!newLead) return;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === departmentId) {
          return { ...r, teamLeadId: newLead.id, teamLeadName: newLead.name };
        }
        return r;
      })
    );

    setEmployees((prev) => {
      const next = prev.map((e) => {
        if (e.id === employeeId) return { ...e, isTeamLead: true, userRoleType: 'TEAM_LEAD' as UserRole };
        if (e.departmentId === departmentId && e.id !== employeeId) return { ...e, isTeamLead: false };
        return e;
      });
      saveState({ employees: next });
      return next;
    });

    addAuditLog('Team Lead Assigned', `Assigned ${newLead.name} as lead of ${departmentId.toUpperCase()} Department`, 'Employees');
  };

  const createProject = (project: Partial<Project>) => {
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      name: project.name || 'New Strategic Initiative',
      code: project.code || `HQ-${Math.floor(Math.random() * 900 + 100)}`,
      description: project.description || 'Enterprise roadmap milestone project.',
      departmentId: project.departmentId || 'development',
      managerId: project.managerId || currentUser.id,
      managerName: project.managerName || currentUser.name,
      teamLeadId: project.teamLeadId || 'emp-dev-lead',
      teamLeadName: project.teamLeadName || 'Elena Rostova',
      teamMemberIds: project.teamMemberIds || [currentUser.id],
      status: project.status || 'Planning',
      progress: 0,
      budget: project.budget || 200000,
      spent: 0,
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      deadline: project.deadline || '2026-11-30',
      priority: project.priority || 'High',
      tags: project.tags || ['Enterprise', 'Q4 Strategy'],
      tasks: [],
      milestones: [
        { title: 'Project Kickoff & Spec', completed: true, dueDate: '2026-09-15' },
        { title: 'Core Implementation', completed: false, dueDate: '2026-10-15' },
        { title: 'Final QA & Release', completed: false, dueDate: '2026-11-30' },
      ],
    };

    setProjects((prev) => {
      const next = [newProject, ...prev];
      saveState({ projects: next });
      return next;
    });

    addAuditLog('Project Created', `Launched project ${newProject.name} (${newProject.code}) with budget $${newProject.budget.toLocaleString()}`, 'Projects');
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === projectId) {
          const progress = status === 'Completed' ? 100 : status === 'Testing' ? 90 : status === 'Review' ? 80 : p.progress;
          return { ...p, status, progress };
        }
        return p;
      });
      saveState({ projects: next });
      return next;
    });
    addAuditLog('Project Status Changed', `Updated project ${projectId} status to ${status}`, 'Projects');
  };

  const addTaskToProject = (projectId: string, task: Partial<ProjectTask>) => {
    const assignee = employees.find((e) => e.id === task.assigneeId) || currentUser;
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      projectId,
      title: task.title || 'Untitled Action Item',
      description: task.description || '',
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      departmentId: assignee.departmentId,
      priority: task.priority || 'Medium',
      status: task.status || 'Todo',
      dueDate: task.dueDate || '2026-09-20',
      estimatedHours: task.estimatedHours || 16,
      completedHours: 0,
    };

    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: [newTask, ...p.tasks] };
        }
        return p;
      });
      saveState({ projects: next });
      return next;
    });
  };

  const updateTaskStatus = (
    projectId: string,
    taskId: string,
    status: 'Todo' | 'In Progress' | 'In Review' | 'Done'
  ) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
          const completedCount = updatedTasks.filter((t) => t.status === 'Done').length;
          const calcProgress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : p.progress;
          return { ...p, tasks: updatedTasks, progress: calcProgress };
        }
        return p;
      });
      saveState({ projects: next });
      return next;
    });
  };

  const advanceCandidateStage = (candidateId: string, nextStage: CandidateStage) => {
    setCandidates((prev) => {
      const next = prev.map((c) => {
        if (c.id === candidateId) {
          return { ...c, stage: nextStage };
        }
        return c;
      });
      saveState({ candidates: next });
      return next;
    });
    addAuditLog('Candidate Stage Advanced', `Moved candidate ${candidateId} to ${nextStage}`, 'Hiring');
  };

  const generateOfferLetter = (candidateId: string, salary: number, equity: string) => {
    setCandidates((prev) => {
      const next = prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            stage: 'Selected' as CandidateStage,
            offerDetails: {
              salary,
              equity,
              startDate: '2026-10-01',
              status: 'Sent' as const,
            },
          };
        }
        return c;
      });
      saveState({ candidates: next });
      return next;
    });
    addAuditLog('Offer Letter Dispatched', `Generated offer of $${salary.toLocaleString()} + ${equity} equity for candidate`, 'Hiring');
    triggerConfettiEffect();
  };

  const hireCandidate = (candidateId: string) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    addNewEmployee({
      name: cand.name,
      avatar: cand.avatar,
      role: cand.targetRole,
      departmentId: cand.departmentId,
      departmentName: cand.departmentId === 'development' ? 'Core Engineering' : cand.departmentId.toUpperCase(),
      email: cand.email,
      phone: cand.phone,
      salary: cand.offerDetails?.salary || cand.expectedSalary,
      equity: cand.offerDetails?.equity || '0.8%',
      skills: cand.skills,
      performanceRating: 95,
      performanceTier: 'Excellent',
    });

    setCandidates((prev) => {
      const next = prev.filter((c) => c.id !== candidateId);
      saveState({ candidates: next });
      return next;
    });
  };

  const postNewJob = (job: Partial<JobPosting>) => {
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: job.title || 'Senior Software Engineer',
      departmentId: job.departmentId || 'development',
      location: job.location || 'San Francisco HQ (Hybrid)',
      type: job.type || 'Full-time',
      salaryRange: job.salaryRange || '$170,000 - $210,000 + Equity',
      openings: job.openings || 1,
      applicantsCount: 0,
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0],
    };

    setJobPostings((prev) => [newJob, ...prev]);
    addAuditLog('Job Requisition Posted', `Opened position: ${newJob.title}`, 'Hiring');
  };

  const approvePayrollBatch = () => {
    const updated: PayrollBatch = {
      ...payrollBatch,
      status: 'Approved',
      ceoApprovedBy: `${currentUser.name} (${currentUser.role})`,
      ceoApprovedAt: new Date().toLocaleString(),
    };
    setPayrollBatch(updated);
    saveState({ payrollBatch: updated });
    addAuditLog('Payroll Approved by CEO', `CEO approved monthly payroll release ($${updated.totalGross.toLocaleString()})`, 'Payroll');
    triggerConfettiEffect();
  };

  const releasePayrollBatch = () => {
    const updated: PayrollBatch = {
      ...payrollBatch,
      status: 'Dispatched',
      dispatchedAt: new Date().toLocaleString(),
      records: payrollBatch.records.map((r) => ({ ...r, status: 'Paid' as const })),
    };
    setPayrollBatch(updated);
    saveState({ payrollBatch: updated });
    addAuditLog('Payroll Funds Dispatched', `Transferred $${updated.totalNet.toLocaleString()} net salary disbursements to 48 employees via SVB Wire`, 'Payroll');
    triggerConfettiEffect();
  };

  const broadcastAnnouncement = (ann: {
    title: string;
    content: string;
    departmentId: string;
    isUrgent?: boolean;
  }) => {
    const newAnn: CompanyAnnouncement = {
      id: `ann-${Date.now()}`,
      title: ann.title,
      content: ann.content,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      departmentId: ann.departmentId as DepartmentId | 'all',
      timestamp: 'Just now',
      isUrgent: ann.isUrgent || false,
      pinned: true,
      reactions: [{ emoji: '🚀', count: 1, userIds: [currentUser.id] }],
    };

    setAnnouncements((prev) => {
      const next = [newAnn, ...prev];
      saveState({ announcements: next });
      return next;
    });

    addAuditLog('CEO Broadcast Issued', `Published announcement: "${ann.title}"`, 'Announcements');
    triggerConfettiEffect();
  };

  const sendChatMessage = (channelId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));
  };

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
      saveState({ alerts: next });
      return next;
    });
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => {
      const next = prev.map((a) => ({ ...a, isRead: true }));
      saveState({ alerts: next });
      return next;
    });
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status: 'Approved' as const } : l));
      saveState({ leaveRequests: next });
      return next;
    });
    addAuditLog('Leave Request Approved', `Approved leave request #${id}`, 'Employees');
    triggerConfettiEffect();
  };

  const rejectLeaveRequest = (id: string) => {
    setLeaveRequests((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' as const } : l));
      saveState({ leaveRequests: next });
      return next;
    });
    addAuditLog('Leave Request Rejected', `Declined leave request #${id}`, 'Employees');
  };

  const submitLeaveRequest = (req: Partial<LeaveRequest>) => {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeRole: currentUser.role,
      departmentId: currentUser.departmentId,
      leaveType: req.leaveType || 'Annual Vacation',
      startDate: req.startDate || '2026-09-20',
      endDate: req.endDate || '2026-09-24',
      daysCount: req.daysCount || 4,
      reason: req.reason || 'Personal leave request.',
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => {
      const next = [newReq, ...prev];
      saveState({ leaveRequests: next });
      return next;
    });
    addAuditLog('Leave Request Submitted', `${currentUser.name} applied for ${newReq.daysCount} days of ${newReq.leaveType}`, 'Employees');
  };

  const approveReimbursement = (id: string) => {
    setReimbursements((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status: 'Approved' as const } : r));
      saveState({ reimbursements: next });
      return next;
    });
    addAuditLog('Expense Reimbursement Approved', `Approved expense reimbursement #${id}`, 'Payroll');
    triggerConfettiEffect();
  };

  const submitReimbursement = (reimb: Partial<ExpenseReimbursement>) => {
    const newReimb: ExpenseReimbursement = {
      id: `exp-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.departmentName,
      category: reimb.category || 'Equipment',
      amount: reimb.amount || 250,
      receiptName: reimb.receiptName || 'Official Receipt & Itemized Invoice',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setReimbursements((prev) => {
      const next = [newReimb, ...prev];
      saveState({ reimbursements: next });
      return next;
    });
    addAuditLog('Expense Submitted', `${currentUser.name} submitted $${newReimb.amount} for ${newReimb.category}`, 'Payroll');
  };

  // Theme Mode synchronization
  const themeMode: ThemeMode = settings.themeMode || 'Light';

  useEffect(() => {
    const isLight = themeMode === 'Light';
    if (isLight) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.remove('theme-light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    updateCompanySettings({ themeMode: mode });
  };

  const toggleThemeMode = () => {
    const nextMode: ThemeMode = themeMode === 'Light' ? 'Enterprise Dark' : 'Light';
    setThemeMode(nextMode);
  };

  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveState({ settings: updated });
    addAuditLog('Company Settings Updated', 'Modified company configuration parameters & security policies', 'Settings');
    triggerConfettiEffect();
  };

  const advanceWorkflowStep = (pipelineId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== pipelineId) return wf;
        const currentIdx = wf.currentStepIndex;
        const updatedSteps = [...wf.steps];
        if (currentIdx < updatedSteps.length) {
          updatedSteps[currentIdx] = {
            ...updatedSteps[currentIdx],
            status: 'completed',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        const nextIdx = currentIdx + 1;
        if (nextIdx < updatedSteps.length) {
          updatedSteps[nextIdx] = {
            ...updatedSteps[nextIdx],
            status: 'in_progress',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        const isCompleted = nextIdx >= updatedSteps.length;
        if (isCompleted) {
          triggerConfettiEffect();
          addAuditLog(
            `Workflow Completed: ${wf.name}`,
            `All 11 automated enterprise lifecycle steps executed successfully for ${wf.projectName}`,
            'Projects'
          );
        } else {
          addAuditLog(
            `Workflow Step Advanced: ${updatedSteps[currentIdx]?.name}`,
            `Advanced to Step ${nextIdx + 1}: ${updatedSteps[nextIdx]?.name} in ${wf.name}`,
            'Projects'
          );
        }
        return {
          ...wf,
          currentStepIndex: nextIdx,
          steps: updatedSteps,
          status: isCompleted ? 'Completed' : 'Active',
          completedAt: isCompleted ? new Date().toISOString().substring(0, 10) : undefined,
        };
      })
    );
  };

  const autoRunWorkflow = (pipelineId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== pipelineId) return wf;
        const allCompletedSteps = wf.steps.map((step, idx) => ({
          ...step,
          status: 'completed' as const,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        }));
        triggerConfettiEffect();
        addAuditLog(
          `Automated Pipeline Executed: ${wf.name}`,
          `Full autonomous company workflow successfully completed ($${wf.contractValue.toLocaleString()} settled & revenue recorded)`,
          'Projects'
        );
        return {
          ...wf,
          currentStepIndex: wf.steps.length,
          steps: allCompletedSteps,
          status: 'Completed',
          completedAt: new Date().toISOString().substring(0, 10),
        };
      })
    );
  };

  const createWorkflowPipeline = (pipeline: Partial<WorkflowPipeline>) => {
    const defaultSteps = [
      { id: 'ceo_create_project' as const, order: 1, name: 'CEO Creates Project', actorRole: 'CEO', actorName: 'Alexander Hayes', description: 'Initiated Project charter & authorized budget.', status: 'completed' as const, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      { id: 'pm_assigned' as const, order: 2, name: 'Project Manager Assigned', actorRole: 'Project Manager', actorName: 'Marcus Vance', description: 'Configured milestones & deliverables.', status: 'in_progress' as const },
      { id: 'team_lead_assigned' as const, order: 3, name: 'Team Lead Assigned', actorRole: 'Engineering Lead', actorName: 'Elena Rostova', description: 'Technical spec & architecture setup.', status: 'pending' as const },
      { id: 'employees_assigned' as const, order: 4, name: 'Employees Assigned', actorRole: 'Squad Leads', actorName: 'Assigned Engineers', description: 'Sprint backlog story point allocation.', status: 'pending' as const },
      { id: 'work_started' as const, order: 5, name: 'Work Started (Sprints)', actorRole: 'Engineering Lab', actorName: 'Sprint Team', description: 'Active implementation and PRs.', status: 'pending' as const },
      { id: 'review' as const, order: 6, name: 'Code & QA Review', actorRole: 'QA & SecOps', actorName: 'CI/CD & Security', description: 'Security audit & unit test pass.', status: 'pending' as const },
      { id: 'approval' as const, order: 7, name: 'Executive & Client Approval', actorRole: 'Executive Suite', actorName: 'Alexander Hayes', description: 'Staging sign-off & UAT pass.', status: 'pending' as const },
      { id: 'client_delivery' as const, order: 8, name: 'Client Delivery', actorRole: 'DevOps', actorName: 'Release Eng', description: 'Production deployment to client.', status: 'pending' as const },
      { id: 'payment_received' as const, order: 9, name: 'Payment Received', actorRole: 'Treasury', actorName: 'Stripe ACH Engine', description: 'Invoice payment settled.', status: 'pending' as const },
      { id: 'finance_records_revenue' as const, order: 10, name: 'Finance Records Revenue', actorRole: 'Finance Manager', actorName: 'Claire Dupont', description: 'Quarterly ledger reconciliation.', status: 'pending' as const },
      { id: 'performance_updated' as const, order: 11, name: 'Performance Updated', actorRole: 'HR Engine', actorName: 'People Analytics', description: 'Team performance scores & bonuses updated.', status: 'pending' as const },
    ];

    const newPipeline: WorkflowPipeline = {
      id: `wf-${Date.now()}`,
      name: pipeline.name || 'New Enterprise Workflow',
      projectName: pipeline.projectName || 'Enterprise Deliverable',
      startedAt: new Date().toISOString().substring(0, 10),
      status: 'Active',
      currentStepIndex: 1,
      steps: defaultSteps,
      clientName: pipeline.clientName || 'Strategic Client Enterprise',
      contractValue: pipeline.contractValue || 250000,
    };

    setWorkflows((prev) => [newPipeline, ...prev]);
    addAuditLog(`New Workflow Pipeline Created`, `Created automated lifecycle pipeline: ${newPipeline.name}`, 'Projects');
    triggerConfettiEffect();
  };

  const approveApprovalItem = (id: string, comment?: string) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id !== id) return appr;
        const updatedChain = appr.chain.map((c) => {
          if (c.role === 'CEO' || c.status === 'Pending') {
            return {
              ...c,
              status: 'Approved' as const,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              comment: comment || 'Approved by Executive Authority.',
            };
          }
          return c;
        });
        addAuditLog(`Approval Granted: ${appr.title}`, `Final executive sign-off granted by ${currentUser.name} (${currentRole})`, 'Payroll');
        triggerConfettiEffect();
        return {
          ...appr,
          status: 'Approved',
          chain: updatedChain,
        };
      })
    );
  };

  const rejectApprovalItem = (id: string, reason?: string) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id !== id) return appr;
        addAuditLog(`Approval Rejected: ${appr.title}`, `Reason: ${reason || 'Denied during executive review'}`, 'Payroll');
        return {
          ...appr,
          status: 'Rejected',
        };
      })
    );
  };

  const submitApprovalItem = (item: Partial<ApprovalItem>) => {
    const newItem: ApprovalItem = {
      id: `appr-${Date.now()}`,
      type: item.type || 'Equipment Purchase',
      title: item.title || 'New Approval Request',
      department: item.department || currentUser.departmentName,
      submittedBy: currentUser.name,
      submittedByRole: currentUser.role,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      amount: item.amount || 0,
      currency: 'USD ($)',
      status: 'Pending Review',
      urgency: item.urgency || 'Medium',
      description: item.description || 'Submitted for multi-level review.',
      chain: [
        { role: 'Manager', approverName: 'Department Lead', status: 'Approved', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
        { role: 'CEO', approverName: 'Alexander Hayes', status: 'Pending' },
      ],
    };
    setApprovals((prev) => [newItem, ...prev]);
    addAuditLog(`Approval Submitted: ${newItem.title}`, `Submitted by ${currentUser.name}`, 'Payroll');
    triggerConfettiEffect();
  };

  const uploadDocument = (doc: Partial<CompanyDocument>) => {
    const newDoc: CompanyDocument = {
      id: `doc-${Date.now()}`,
      title: doc.title || 'Untitled Document',
      category: doc.category || 'Company Policies',
      fileType: doc.fileType || 'PDF',
      size: doc.size || '1.2 MB',
      uploadedBy: currentUser.name,
      uploadedByRole: currentUser.role,
      uploadedAt: new Date().toISOString().substring(0, 10),
      department: doc.department || currentUser.departmentName,
      tags: doc.tags || ['Enterprise', 'Internal'],
      version: doc.version || '1.0',
      securityClassification: doc.securityClassification || 'Internal',
      summary: doc.summary || 'Enterprise document uploaded to secure vault.',
      downloadCount: 0,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog(`Document Uploaded: ${newDoc.title}`, `Stored in ${newDoc.category} with classification ${newDoc.securityClassification}`, 'Security');
    triggerConfettiEffect();
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('Document Archived', `Archived document id: ${id}`, 'Security');
  };

  const addScheduledMeeting = (meeting: Partial<ScheduledMeeting>) => {
    const newMeeting: ScheduledMeeting = {
      id: `meet-${Date.now()}`,
      title: meeting.title || 'Team Strategy & Sync',
      roomName: meeting.roomName || 'Executive Board Room',
      roomId: meeting.roomId || 'board_room',
      departmentId: meeting.departmentId || 'ceo',
      date: meeting.date || new Date().toISOString().substring(0, 10),
      startTime: meeting.startTime || '10:00 AM',
      endTime: meeting.endTime || '11:00 AM',
      hostName: meeting.hostName || currentUser.name,
      hostAvatar: meeting.hostAvatar || currentUser.avatar,
      hostRole: meeting.hostRole || currentUser.role,
      attendees: meeting.attendees || [
        { name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
      ],
      agenda: meeting.agenda || 'Discuss project milestones and align operational deliverables.',
      isVirtual: true,
      meetingLink: meeting.meetingLink || `https://meet.companyhq.io/sync-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: meeting.status || 'Scheduled',
      priority: meeting.priority || 'Medium',
    };
    setScheduledMeetings((prev) => [newMeeting, ...prev]);
    addAuditLog(`Meeting Scheduled: ${newMeeting.title}`, `Hosted in ${newMeeting.roomName} on ${newMeeting.date} at ${newMeeting.startTime}`, 'Announcements');
    triggerConfettiEffect();
  };

  const updateScheduledMeetingStatus = (meetingId: string, status: ScheduledMeeting['status']) => {
    setScheduledMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status } : m))
    );
    addAuditLog('Meeting Status Updated', `Meeting ${meetingId} status changed to ${status}`, 'Projects');
  };

  const scheduleCandidateInterview = (candidateId: string, date: string, time: string, interviewerId: string) => {
    const interviewer = employees.find((e) => e.id === interviewerId) || currentUser;
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              interviewDate: date,
              interviewerId: interviewer.id,
              interviewerName: interviewer.name,
              stage: c.stage === 'Applied' || c.stage === 'Screening' ? 'Interview' : c.stage,
            }
          : c
      )
    );

    // Also add to scheduled meetings
    const cand = candidates.find((c) => c.id === candidateId);
    if (cand) {
      addScheduledMeeting({
        title: `Candidate Interview: ${cand.name} (${cand.targetRole})`,
        roomName: 'HR Center Interview Suite',
        roomId: 'hr',
        departmentId: 'hr',
        date,
        startTime: time || '02:00 PM',
        endTime: '03:00 PM',
        hostName: interviewer.name,
        hostAvatar: interviewer.avatar,
        hostRole: interviewer.role,
        attendees: [
          { name: interviewer.name, avatar: interviewer.avatar, role: interviewer.role },
          { name: cand.name, avatar: cand.avatar, role: `Candidate - ${cand.targetRole}` },
        ],
        agenda: `Technical & cultural assessment for ${cand.targetRole}. Target compensation: $${cand.expectedSalary.toLocaleString()}.`,
        isVirtual: true,
        priority: 'High',
      });
    }
  };

  const [isAiAuditingBadges, setIsAiAuditingBadges] = useState(false);
  const [aiAuditSummary, setAiAuditSummary] = useState<string | null>(null);

  const runAiBadgeRecognitionAudit = async (): Promise<{ awardedCount: number; summary: string }> => {
    setIsAiAuditingBadges(true);
    try {
      const res = await fetch('/api/ai/award-badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees }),
      });
      const data = await res.json();
      const awards = data.awards || [];

      if (awards.length > 0) {
        let newlyAddedCount = 0;

        setEmployees((prev) => {
          const updated = prev.map((emp) => {
            const empAwards = awards.filter((a: any) => a.employeeId === emp.id);
            if (empAwards.length === 0) return emp;

            const existingBadges = emp.badges || [];
            const newBadges: EmployeeBadge[] = [];

            for (const a of empAwards) {
              if (!existingBadges.some((b) => b.type === a.badgeType)) {
                newBadges.push({
                  id: `badge-${emp.id}-${a.badgeType === 'Top Performer' ? 'top' : 'collab'}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                  type: a.badgeType,
                  title: a.title,
                  awardedAt: new Date().toISOString().split('T')[0],
                  aiReason: a.aiReason,
                  activityMetric: a.activityMetric,
                  level: a.level || 'Gold',
                  awardedByAi: true,
                  confidenceScore: a.confidenceScore || 95,
                });
                newlyAddedCount++;
              }
            }

            if (newBadges.length === 0) return emp;

            return {
              ...emp,
              badges: [...existingBadges, ...newBadges],
            };
          });

          saveState({ employees: updated });
          return updated;
        });

        triggerConfettiEffect();
        const summaryText = data.auditSummary || `AI Recognition Engine evaluated activity metrics and awarded ${awards.length} badges!`;
        setAiAuditSummary(summaryText);

        const newAlert: NotificationAlert = {
          id: `alert-badges-${Date.now()}`,
          title: '🏆 AI Recognition Honors Awarded',
          message: summaryText,
          timestamp: 'Just now',
          type: 'performance',
          severity: 'success',
          isRead: false,
        };
        setAlerts((prev) => [newAlert, ...prev]);

        addAuditLog(
          'AI Recognition Audit Executed',
          `Autonomous AI Talent Engine evaluated employee activity telemetry and awarded ${awards.length} recognition badges.`,
          'Employees'
        );

        return { awardedCount: awards.length, summary: summaryText };
      }

      return { awardedCount: 0, summary: 'All eligible employees currently hold up-to-date badges.' };
    } catch (err: any) {
      console.error('Error running AI recognition audit:', err);
      return { awardedCount: 0, summary: 'AI recognition audit encountered a transient issue.' };
    } finally {
      setIsAiAuditingBadges(false);
    }
  };

  const awardManualBadge = (employeeId: string, badgeType: RecognitionBadgeType, customReason?: string) => {
    setEmployees((prev) => {
      const updated = prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const existingBadges = emp.badges || [];
        if (existingBadges.some((b) => b.type === badgeType)) return emp;

        const newBadge: EmployeeBadge = {
          id: `badge-${emp.id}-${Date.now()}`,
          type: badgeType,
          title: badgeType === 'Top Performer' ? 'Top Performer (Executive Honor)' : 'Collaboration Hero',
          awardedAt: new Date().toISOString().split('T')[0],
          aiReason: customReason || (badgeType === 'Top Performer' ? `Recognized for outstanding velocity, task completion rate, and leadership.` : `Recognized for exemplary teamwork, peer mentorship, and cross-department collaboration.`),
          activityMetric: `${emp.completedTasksCount} completed tasks • ${emp.performanceRating}% rating • ${emp.attendanceRate}% attendance`,
          level: 'Diamond',
          awardedByAi: false,
          confidenceScore: 99,
        };

        return {
          ...emp,
          badges: [...existingBadges, newBadge],
        };
      });

      saveState({ employees: updated });
      return updated;
    });

    triggerConfettiEffect();
  };

  const removeBadge = (employeeId: string, badgeId: string) => {
    setEmployees((prev) => {
      const updated = prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        return {
          ...emp,
          badges: (emp.badges || []).filter((b) => b.id !== badgeId),
        };
      });
      saveState({ employees: updated });
      return updated;
    });
  };

  const sendEmployeeKudos = (employeeId: string, message?: string) => {
    setEmployees((prev) => {
      const updated = prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const nextKudos = (emp.kudosCount || 0) + 1;
        const existingBadges = emp.badges || [];

        let newBadges = [...existingBadges];
        const hasCollabBadge = existingBadges.some((b) => b.type === 'Collaboration Hero');
        if (nextKudos >= 5 && !hasCollabBadge) {
          newBadges.push({
            id: `badge-collab-kudos-${emp.id}-${Date.now()}`,
            type: 'Collaboration Hero',
            title: 'Collaboration Hero (Peer Champion)',
            awardedAt: new Date().toISOString().split('T')[0],
            aiReason: `AI evaluated: Achieved high peer recognition threshold with ${nextKudos} kudos across departments.`,
            activityMetric: `${nextKudos} Peer Kudos • Cross-department synergy anchor`,
            level: 'Gold',
            awardedByAi: true,
            confidenceScore: 97,
          });
          triggerConfettiEffect();
        }

        return {
          ...emp,
          kudosCount: nextKudos,
          badges: newBadges,
        };
      });

      saveState({ employees: updated });
      return updated;
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setEmployees(INITIAL_EMPLOYEES);
    setProjects(INITIAL_PROJECTS);
    setCandidates(INITIAL_CANDIDATES);
    setPayrollBatch(INITIAL_PAYROLL_BATCH);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAlerts(INITIAL_ALERTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setPolicies(INITIAL_POLICIES);
    setOnboardingTasks(INITIAL_ONBOARDING_TASKS);
    setExitProcesses(INITIAL_EXIT_PROCESSES);
    setReimbursements(INITIAL_REIMBURSEMENTS);
    setSettings(INITIAL_SETTINGS);
    setWorkflows(INITIAL_WORKFLOWS);
    setApprovals(INITIAL_APPROVALS);
    setDocuments(INITIAL_DOCUMENTS);
    setScheduledMeetings(INITIAL_SCHEDULED_MEETINGS);
    setCurrentRole('CEO');
    setCurrentUser(INITIAL_EMPLOYEES[0]);
  };

  return (
    <CompanyContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        rooms,
        employees,
        projects,
        candidates,
        jobPostings,
        payrollBatch,
        invoices,
        announcements,
        channels,
        messages,
        activeChannelId,
        setActiveChannelId,
        alerts,
        auditLogs,
        leaveRequests,
        policies,
        onboardingTasks,
        exitProcesses,
        reimbursements,
        settings,
        workflows,
        approvals,
        documents,
        scheduledMeetings,
        selectedRoom,
        setSelectedRoom,
        selectedEmployee,
        setSelectedEmployee,
        selectedCandidate,
        setSelectedCandidate,
        selectedProject,
        setSelectedProject,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        aiInitialPrompt,
        setAiInitialPrompt,
        isMeetingModalOpen,
        setIsMeetingModalOpen,
        isAnnouncementModalOpen,
        setIsAnnouncementModalOpen,
        triggerConfettiEffect,
        addNewEmployee,
        fireEmployee,
        promoteEmployee,
        reassignTeamLead,
        createProject,
        updateProjectStatus,
        addTaskToProject,
        updateTaskStatus,
        advanceCandidateStage,
        hireCandidate,
        generateOfferLetter,
        postNewJob,
        approvePayrollBatch,
        releasePayrollBatch,
        broadcastAnnouncement,
        sendChatMessage,
        markAlertRead,
        markAllAlertsRead,
        addAuditLog,
        approveLeaveRequest,
        rejectLeaveRequest,
        submitLeaveRequest,
        approveReimbursement,
        submitReimbursement,
        updateCompanySettings,
        advanceWorkflowStep,
        autoRunWorkflow,
        createWorkflowPipeline,
        approveApprovalItem,
        rejectApprovalItem,
        submitApprovalItem,
        uploadDocument,
        deleteDocument,
        addScheduledMeeting,
        updateScheduledMeetingStatus,
        scheduleCandidateInterview,
        isAiAuditingBadges,
        aiAuditSummary,
        runAiBadgeRecognitionAudit,
        awardManualBadge,
        removeBadge,
        sendEmployeeKudos,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        resetToDefaults,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
