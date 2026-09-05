export type UserRole =
  | 'CEO'
  | 'HR_MANAGER'
  | 'FINANCE_MANAGER'
  | 'PROJECT_MANAGER'
  | 'TEAM_LEAD'
  | 'EMPLOYEE'
  | 'RECRUITER'
  | 'ACCOUNTANT'
  | 'VIEWER';

export type DepartmentId =
  | 'ceo'
  | 'hr'
  | 'finance'
  | 'development'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'support'
  | 'operations'
  | 'legal'
  | 'meeting_hall'
  | 'training'
  | 'board_room'
  | 'server_room'
  | 'ai_control'
  | 'meeting_rooms';

export type EmployeeStatus =
  | 'online'
  | 'busy'
  | 'in_meeting'
  | 'offline'
  | 'on_leave'
  | 'working'
  | 'break'
  | 'lunch'
  | 'leave'
  | 'reviewing';

export type LivePresenceIndicator =
  | 'working'    // Green
  | 'meeting'    // Blue
  | 'break'      // Orange
  | 'offline'    // Red
  | 'reviewing'  // Purple
  | 'lunch'      // Yellow/Orange
  | 'leave';     // Gray

export type RecognitionBadgeType = 'Top Performer' | 'Collaboration Hero';

export interface EmployeeBadge {
  id: string;
  type: RecognitionBadgeType;
  title: string;
  awardedAt: string;
  aiReason: string;
  activityMetric: string;
  level?: 'Elite' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  awardedByAi: boolean;
  confidenceScore?: number;
}

export interface WorkstationCubicle {
  id: string;
  roomType: 'tech' | 'design';
  gridRow: number;
  gridCol: number;
  label: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  presenceStatus: LivePresenceIndicator;
  currentTask: string;
  workProgress: number; // 0-100
  performanceScore: number; // 0-100
  attendanceRate: number; // 0-100
  reportingManager: string;
  teamLead: string;
  activeProject: string;
  recentActivity: string;
  skills: string[];
  badges?: EmployeeBadge[];
  kudosCount?: number;
  collaborationScore?: number;
}

export type FloorPlanRoomKey =
  | 'main_gate'
  | 'walkway'
  | 'lounge_duo'
  | 'cafeteria'
  | 'store_room'
  | 'male_bathroom'
  | 'female_bathroom'
  | 'server_room'
  | 'design_lead_1'
  | 'design_lead_2'
  | 'tech_lead_1'
  | 'tech_lead_2'
  | 'hr'
  | 'manager'
  | 'ceo'
  | 'chairman'
  | 'devops'
  | 'finance'
  | 'design_room'
  | 'meeting_room_1'
  | 'meeting_room_2'
  | 'meeting_room_3'
  | 'tech_room';

export type PerformanceTier = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  userRoleType: UserRole;
  departmentId: DepartmentId;
  departmentName: string;
  email: string;
  phone: string;
  salary: number;
  bonus: number;
  equity: string;
  joiningDate: string;
  skills: string[];
  performanceRating: number; // 0 - 100
  performanceTier: PerformanceTier;
  reportingManagerId?: string;
  reportingManagerName?: string;
  status: EmployeeStatus;
  currentTask?: string;
  attendanceRate: number; // percentage
  completedTasksCount: number;
  assignedTasksCount: number;
  location: string;
  isTeamLead?: boolean;
  badges?: EmployeeBadge[];
  kudosCount?: number;
  collaborationScore?: number;
  recentActivities?: string[];
}

export interface DepartmentRoom {
  id: DepartmentId;
  name: string;
  shortCode: string;
  description: string;
  teamLeadId: string;
  teamLeadName: string;
  color: string;
  accentColor: string;
  iconName: string;
  floor: number;
  coordinates: { x: number; y: number; width: number; height: number };
  capacity: number;
  currentOccupants: number;
  activeProjectsCount: number;
  activeTasksCount: number;
  avgPerformanceScore: number;
  ambientStatus: string;
  temperature: string;
  noiseLevel: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'In Progress' | 'Review' | 'Testing' | 'Completed' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  departmentId: DepartmentId;
  priority: TaskPriority;
  status: 'Todo' | 'In Progress' | 'In Review' | 'Done';
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  type: string;
}

export interface ProjectComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: DepartmentId;
  managerId: string;
  managerName: string;
  teamLeadId: string;
  teamLeadName: string;
  teamMemberIds: string[];
  status: ProjectStatus;
  progress: number; // 0 - 100
  budget: number;
  spent: number;
  startDate: string;
  deadline: string;
  priority: TaskPriority;
  tags: string[];
  tasks: ProjectTask[];
  milestones: { title: string; completed: boolean; dueDate: string }[];
  files?: ProjectFile[];
  comments?: ProjectComment[];
}

export type CandidateStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical Round'
  | 'HR Round'
  | 'Offer Sent'
  | 'Hired'
  | 'Selected';

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  targetRole: string;
  departmentId: DepartmentId;
  appliedDate: string;
  stage: CandidateStage;
  experienceYears: number;
  expectedSalary: number;
  rating: number; // 1 - 5
  skills: string[];
  resumeUrl: string;
  notes: string[];
  interviewerId?: string;
  interviewerName?: string;
  interviewDate?: string;
  aiScore?: number;
  aiStrengths?: string[];
  aiFitRecommendation?: string;
  offerDetails?: {
    salary: number;
    equity: string;
    startDate: string;
    status: 'Drafted' | 'Sent' | 'Accepted' | 'Declined';
  };
}

export interface JobPosting {
  id: string;
  title: string;
  departmentId: DepartmentId;
  location: string;
  type: 'Full-time' | 'Remote' | 'Hybrid';
  salaryRange: string;
  openings: number;
  applicantsCount: number;
  status: 'Active' | 'Paused' | 'Closed';
  postedDate: string;
}

export type PayrollStatus = 'Pending Finance' | 'Pending CEO Approval' | 'Approved' | 'Dispatched';

export interface ExpenseReimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'Travel' | 'Equipment' | 'Software / SaaS' | 'Client Dining' | 'Training';
  amount: number;
  receiptName: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  departmentId: DepartmentId;
  baseSalary: number;
  bonus: number;
  allowances: number;
  taxDeductions: number;
  netPay: number;
  attendanceMultiplier: number;
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Paid';
  paymentDate: string;
}

export interface PayrollBatch {
  id: string;
  month: string;
  year: number;
  totalGross: number;
  totalBonuses: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  status: PayrollStatus;
  ceoApprovedBy?: string;
  ceoApprovedAt?: string;
  financeReviewedBy?: string;
  financeReviewedAt?: string;
  dispatchedAt?: string;
  records: PayrollRecord[];
  reimbursements?: ExpenseReimbursement[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  departmentId: DepartmentId;
  leaveType: 'Annual Vacation' | 'Sick Leave' | 'Parental' | 'Bereavement' | 'Unpaid';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

export interface HRPolicy {
  id: string;
  title: string;
  category: 'Conduct' | 'Remote Work' | 'Benefits' | 'Compensation' | 'Security';
  version: string;
  lastUpdated: string;
  description: string;
  downloadUrl: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  startDate: string;
  status: 'In Progress' | 'Completed' | 'Pending Review';
  progress: number;
  checklist: { task: string; completed: boolean }[];
}

export interface ExitProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  lastDay: string;
  reason: 'Career Growth' | 'Relocation' | 'Retirement' | 'Other';
  status: 'Handover in Progress' | 'Exit Interview Done' | 'Completed';
  assetsReturned: boolean;
  ndaSigned: boolean;
}

export interface Invoice {
  id: string;
  clientName: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
}

export interface CompanyAnnouncement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  departmentId?: DepartmentId | 'all';
  timestamp: string;
  isUrgent?: boolean;
  pinned?: boolean;
  reactions: { emoji: string; count: number; userIds: string[] }[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  departmentId?: DepartmentId;
  description: string;
  isPrivate: boolean;
  unreadCount: number;
  isDirectMessage?: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'payroll' | 'project' | 'hiring' | 'performance' | 'leave' | 'system' | 'security' | 'announcement';
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  actionText?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  details: string;
  targetCategory: 'Payroll' | 'Hiring' | 'Employees' | 'Projects' | 'Security' | 'Announcements' | 'Settings';
  timestamp: string;
  ipAddress: string;
}

export interface PerformanceScorecard {
  employeeId: string;
  productivity: number;
  taskCompletion: number;
  attendanceRate: number;
  teamContribution: number;
  overallScore: number;
  tier: PerformanceTier;
  feedback: string;
  evaluatedBy: string;
}

export type ThemeMode = 'Enterprise Dark' | 'Light';

export interface CompanySettings {
  companyName: string;
  legalEntity: string;
  logoUrl: string;
  taxId: string;
  defaultCurrency: string;
  timezone: string;
  primaryColor: string;
  accentColor: string;
  themeMode: ThemeMode;
  enable2FA: boolean;
  sessionTimeoutMinutes: number;
  allowPublicJobBoard: boolean;
  enableAiCopilot: boolean;
  billingPlan: 'Enterprise Tier (Unlimited)' | 'Scale' | 'Growth';
  billingCycle: 'Annual Prepaid' | 'Monthly';
  nextBillingDate: string;
  seatsOccupied: number;
  totalSeats: number;
}

// Workflow System Interfaces
export type WorkflowStepId =
  | 'ceo_create_project'
  | 'pm_assigned'
  | 'team_lead_assigned'
  | 'employees_assigned'
  | 'work_started'
  | 'review'
  | 'approval'
  | 'client_delivery'
  | 'payment_received'
  | 'finance_records_revenue'
  | 'performance_updated';

export interface WorkflowStep {
  id: WorkflowStepId;
  order: number;
  name: string;
  actorRole: string;
  actorName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  timestamp?: string;
  details?: string;
  outputPayload?: Record<string, any>;
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  projectId?: string;
  projectName: string;
  startedAt: string;
  completedAt?: string;
  status: 'Active' | 'Completed' | 'Paused';
  currentStepIndex: number;
  steps: WorkflowStep[];
  clientName: string;
  contractValue: number;
}

// Approval System Interfaces
export type ApprovalType =
  | 'Leave Request'
  | 'Expense Reimbursement'
  | 'Payroll Batch'
  | 'Hiring Offer'
  | 'Promotion & Raise'
  | 'Budget Increase'
  | 'Project Closure'
  | 'Equipment Purchase';

export type ApprovalStatus = 'Pending Review' | 'Approved' | 'Rejected' | 'Escalated';

export interface ApprovalChainStep {
  role: string;
  approverName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp?: string;
  comment?: string;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  department: string;
  submittedBy: string;
  submittedByRole: string;
  submittedAt: string;
  amount?: number;
  currency?: string;
  status: ApprovalStatus;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  chain: ApprovalChainStep[];
  detailsPayload?: Record<string, any>;
}

// Document Management Interfaces
export type DocumentCategory =
  | 'Contracts & MSA'
  | 'Invoices & Billing'
  | 'Payslips & Tax'
  | 'Offer Letters'
  | 'Company Policies'
  | 'Project Wikis & Docs'
  | 'Executive Reports'
  | 'Meeting Notes & AI Summaries';

export type SecurityClassification = 'Public' | 'Internal' | 'Confidential' | 'Restricted / CEO Only';

export interface CompanyDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'MD' | 'MARKDOWN' | 'KEY' | 'ZIP';
  size: string;
  uploadedBy: string;
  uploadedByRole: string;
  uploadedAt: string;
  department?: string;
  tags: string[];
  version: string;
  securityClassification: SecurityClassification;
  summary?: string;
  contentPreview?: string;
  downloadCount: number;
}

// Scheduled Virtual Meetings & Calendar Unified Types
export interface ScheduledMeeting {
  id: string;
  title: string;
  roomName: string;
  roomId: string;
  departmentId?: DepartmentId;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "11:00 AM"
  hostName: string;
  hostAvatar: string;
  hostRole: string;
  attendees: { name: string; avatar: string; role?: string }[];
  agenda: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: 'Scheduled' | 'Live Now' | 'Completed' | 'Cancelled';
  priority?: TaskPriority;
}

export type CalendarEventType =
  | 'deadline'
  | 'milestone'
  | 'interview'
  | 'meeting'
  | 'task';

export interface UnifiedCalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  time?: string;
  endTime?: string;
  departmentId?: DepartmentId;
  departmentName?: string;
  projectId?: string;
  projectName?: string;
  priority?: TaskPriority;
  status?: string;
  leadName?: string;
  leadAvatar?: string;
  locationOrRoom?: string;
  description?: string;
  metaBadge?: string;
  actionType?: 'project' | 'candidate' | 'room' | 'task';
  targetId?: string;
}

