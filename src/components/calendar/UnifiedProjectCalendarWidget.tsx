import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  Video,
  Users,
  CheckCircle2,
  AlertCircle,
  Flag,
  Filter,
  Search,
  Building,
  ArrowUpRight,
  CheckSquare,
  DoorOpen,
  CalendarCheck,
  CalendarDays,
  ListOrdered,
  Layers,
  X,
  UserCheck,
  Briefcase,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import {
  UnifiedCalendarEvent,
  CalendarEventType,
  ScheduledMeeting,
  TaskPriority,
  DepartmentId,
} from '../../types';

interface UnifiedProjectCalendarWidgetProps {
  onSelectProject?: (projectId: string) => void;
  initialSelectedDate?: string;
  compactMode?: boolean;
}

export const UnifiedProjectCalendarWidget: React.FC<UnifiedProjectCalendarWidgetProps> = ({
  onSelectProject,
  initialSelectedDate,
  compactMode = false,
}) => {
  const {
    projects,
    candidates,
    scheduledMeetings,
    employees,
    rooms,
    currentRole,
    currentUser,
    setSelectedCandidate,
    setSelectedRoom,
    setActiveTab,
    addScheduledMeeting,
    updateScheduledMeetingStatus,
    scheduleCandidateInterview,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    triggerConfettiEffect,
  } = useCompany();

  // Calendar State
  // Default to September 2026 (matching system timeline) or current date
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 is September (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate || '2026-09-02');
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'week'>('month');

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | CalendarEventType>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [scheduleType, setScheduleType] = useState<'meeting' | 'milestone' | 'interview'>('meeting');

  // Schedule Modal Form States
  // 1. Meeting Form
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [meetingRoomId, setMeetingRoomId] = useState<string>('development');
  const [meetingDate, setMeetingDate] = useState<string>(selectedDate);
  const [meetingStartTime, setMeetingStartTime] = useState<string>('10:00 AM');
  const [meetingEndTime, setMeetingEndTime] = useState<string>('11:00 AM');
  const [meetingAgenda, setMeetingAgenda] = useState<string>('');
  const [meetingPriority, setMeetingPriority] = useState<TaskPriority>('High');

  // 2. Milestone / Deadline Form
  const [milestoneProjectId, setMilestoneProjectId] = useState<string>(projects[0]?.id || '');
  const [milestoneTitle, setMilestoneTitle] = useState<string>('');
  const [milestoneDueDate, setMilestoneDueDate] = useState<string>(selectedDate);

  // 3. Interview Form
  const [interviewCandidateId, setInterviewCandidateId] = useState<string>(candidates[0]?.id || '');
  const [interviewDate, setInterviewDate] = useState<string>(selectedDate);
  const [interviewTime, setInterviewTime] = useState<string>('02:00 PM');
  const [interviewerId, setInterviewerId] = useState<string>(employees[0]?.id || '');

  // Compile Unified Events from all sources
  const allEvents = useMemo<UnifiedCalendarEvent[]>(() => {
    const events: UnifiedCalendarEvent[] = [];

    // 1. Project Final Deadlines
    projects.forEach((prj) => {
      if (prj.deadline) {
        events.push({
          id: `deadline-${prj.id}`,
          title: `Project Hard Deadline: ${prj.name}`,
          type: 'deadline',
          date: prj.deadline,
          time: '11:59 PM',
          projectId: prj.id,
          projectName: prj.name,
          departmentId: prj.departmentId,
          departmentName: prj.departmentId.toUpperCase(),
          priority: prj.priority,
          status: prj.status,
          leadName: prj.managerName,
          metaBadge: `${prj.code} • ${prj.progress}% Done`,
          description: `Target delivery date for ${prj.name}. Budget: $${prj.budget.toLocaleString()}.`,
          actionType: 'project',
          targetId: prj.id,
        });
      }

      // 2. Project Milestones
      if (prj.milestones && prj.milestones.length > 0) {
        prj.milestones.forEach((m, idx) => {
          if (m.dueDate) {
            events.push({
              id: `milestone-${prj.id}-${idx}`,
              title: `Milestone: ${m.title}`,
              type: 'milestone',
              date: m.dueDate,
              time: '05:00 PM',
              projectId: prj.id,
              projectName: prj.name,
              departmentId: prj.departmentId,
              departmentName: prj.departmentId.toUpperCase(),
              status: m.completed ? 'Completed' : 'Pending',
              metaBadge: `${prj.code} Milestone`,
              description: `Strategic key milestone for ${prj.name}.`,
              actionType: 'project',
              targetId: prj.id,
            });
          }
        });
      }

      // 3. Sprint Tasks Due Dates
      if (prj.tasks && prj.tasks.length > 0) {
        prj.tasks.forEach((t) => {
          if (t.dueDate) {
            events.push({
              id: `task-${t.id}`,
              title: `Task Due: ${t.title}`,
              type: 'task',
              date: t.dueDate,
              time: '06:00 PM',
              projectId: prj.id,
              projectName: prj.name,
              departmentId: prj.departmentId,
              priority: t.priority,
              status: t.status,
              leadName: t.assigneeName,
              leadAvatar: t.assigneeAvatar,
              metaBadge: `${prj.code} Task`,
              description: t.description || `Assigned deliverable for ${t.assigneeName}.`,
              actionType: 'task',
              targetId: t.id,
            });
          }
        });
      }
    });

    // 4. Upcoming Candidate Interviews
    candidates.forEach((cand) => {
      if (cand.interviewDate) {
        events.push({
          id: `interview-${cand.id}`,
          title: `Candidate Interview: ${cand.name}`,
          type: 'interview',
          date: cand.interviewDate,
          time: '02:00 PM',
          endTime: '03:00 PM',
          departmentId: cand.departmentId,
          departmentName: 'HR / Talent',
          leadName: cand.interviewerName || 'HR Team',
          leadAvatar: cand.avatar,
          locationOrRoom: 'HR Interview Suite',
          status: cand.stage,
          metaBadge: `${cand.targetRole} (${cand.stage})`,
          description: `Applicant for ${cand.targetRole}. Exp: ${cand.experienceYears}y • Rating: ${cand.rating}/5. Notes: ${cand.notes?.[0] || 'Technical assessment'}`,
          actionType: 'candidate',
          targetId: cand.id,
        });
      }
    });

    // 5. Scheduled Virtual Meetings & All-Hands
    scheduledMeetings.forEach((meet) => {
      events.push({
        id: `meeting-${meet.id}`,
        title: meet.title,
        type: 'meeting',
        date: meet.date,
        time: meet.startTime,
        endTime: meet.endTime,
        departmentId: meet.departmentId,
        departmentName: meet.roomName,
        locationOrRoom: meet.roomName,
        leadName: meet.hostName,
        leadAvatar: meet.hostAvatar,
        status: meet.status,
        priority: meet.priority || 'Medium',
        metaBadge: `${meet.status} • ${meet.roomName}`,
        description: meet.agenda,
        actionType: 'room',
        targetId: meet.roomId,
      });
    });

    // Sort chronologically
    return events.sort((a, b) => {
      if (a.date === b.date) {
        return (a.time || '').localeCompare(b.time || '');
      }
      return a.date.localeCompare(b.date);
    });
  }, [projects, candidates, scheduledMeetings]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // Type Filter
      if (typeFilter !== 'all' && ev.type !== typeFilter) return false;

      // Department Filter
      if (departmentFilter !== 'all' && ev.departmentId !== departmentFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(query);
        const matchDesc = (ev.description || '').toLowerCase().includes(query);
        const matchLead = (ev.leadName || '').toLowerCase().includes(query);
        const matchProject = (ev.projectName || '').toLowerCase().includes(query);
        const matchMeta = (ev.metaBadge || '').toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLead && !matchProject && !matchMeta) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, typeFilter, departmentFilter, searchQuery]);

  // Events on currently selected date
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter((ev) => ev.date === selectedDate);
  }, [filteredEvents, selectedDate]);

  // Calendar Grid Calculation
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  }, [currentYear, currentMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Helper to get events for specific date string YYYY-MM-DD
  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter((ev) => ev.date === dateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September
    setSelectedDate('2026-09-02');
  };

  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (scheduleType === 'meeting') {
      if (!meetingTitle.trim()) return;
      const targetRoom = rooms.find((r) => r.id === meetingRoomId) || rooms[0];
      addScheduledMeeting({
        title: meetingTitle,
        roomName: targetRoom.name,
        roomId: targetRoom.id,
        departmentId: targetRoom.id,
        date: meetingDate,
        startTime: meetingStartTime,
        endTime: meetingEndTime,
        agenda: meetingAgenda || 'Strategic sync and team alignment.',
        priority: meetingPriority,
        hostName: currentUser.name,
        hostAvatar: currentUser.avatar,
        hostRole: currentUser.role,
        attendees: [
          { name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
          { name: targetRoom.teamLeadName, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', role: 'Team Lead' },
        ],
      });
      setMeetingTitle('');
      setMeetingAgenda('');
    } else if (scheduleType === 'interview') {
      scheduleCandidateInterview(interviewCandidateId, interviewDate, interviewTime, interviewerId);
    } else if (scheduleType === 'milestone') {
      if (!milestoneTitle.trim()) return;
      const targetPrj = projects.find((p) => p.id === milestoneProjectId);
      if (targetPrj) {
        targetPrj.milestones = [
          ...(targetPrj.milestones || []),
          { title: milestoneTitle, completed: false, dueDate: milestoneDueDate },
        ];
      }
      setMilestoneTitle('');
      triggerConfettiEffect();
    }

    setIsScheduleModalOpen(false);
  };

  const handleEventAction = (event: UnifiedCalendarEvent) => {
    if (event.actionType === 'project' && event.targetId) {
      if (onSelectProject) {
        onSelectProject(event.targetId);
      }
    } else if (event.actionType === 'candidate' && event.targetId) {
      const cand = candidates.find((c) => c.id === event.targetId);
      if (cand) {
        setSelectedCandidate(cand);
        setActiveTab('hiring');
      }
    } else if (event.actionType === 'room' && event.targetId) {
      const room = rooms.find((r) => r.id === event.targetId);
      if (room) {
        setSelectedRoom(room);
        setActiveTab('office');
      }
    }
  };

  const getTypeIcon = (type: CalendarEventType) => {
    switch (type) {
      case 'deadline':
        return <Flag className="w-3.5 h-3.5 text-rose-400" />;
      case 'milestone':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9FF]" />;
      case 'interview':
        return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case 'meeting':
        return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'task':
        return <CheckSquare className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'deadline':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'milestone':
        return 'bg-[#00D9FF]/15 border-[#00D9FF]/30 text-[#00D9FF]';
      case 'interview':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'meeting':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-300';
      case 'task':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
    }
  };

  // Group events by date for chronological agenda view
  const eventsGroupedByDate = useMemo(() => {
    const groups: Record<string, UnifiedCalendarEvent[]> = {};
    filteredEvents.forEach((ev) => {
      if (!groups[ev.date]) {
        groups[ev.date] = [];
      }
      groups[ev.date].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-5">
      {/* Widget Top Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-3xl border border-[#4F7CFF]/20 bg-gradient-to-br from-[#141B2D] via-[#0E1424] to-[#0A0D16] shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F7CFF]/30 to-[#00D9FF]/20 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-inner">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Unified Operations Calendar & Timeline
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] font-bold border border-[#00D9FF]/30">
                  {filteredEvents.length} LIVE EVENTS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrated timeline cross-referencing team deliverables, upcoming candidate interviews, and virtual syncs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#090D16] border border-slate-800">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-[#4F7CFF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month Grid</span>
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-[#4F7CFF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Agenda Timeline</span>
            </button>
          </div>

          {/* AI Optimizer */}
          <button
            onClick={() => {
              setAiInitialPrompt(
                'Audit upcoming team deadlines, interviews, and scheduled meetings for September 2026. Highlight any resource conflicts, tight turnaround risks, and propose an executive de-confliction schedule.'
              );
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Schedule Audit</span>
          </button>

          {/* Schedule Event Button */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800 bg-[#0B0F19]/90">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'all'
                ? 'bg-[#141B2D] border-[#00D9FF] text-white shadow-sm'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories ({allEvents.length})
          </button>
          <button
            onClick={() => setTypeFilter('deadline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'deadline'
                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Flag className="w-3 h-3 text-rose-400" />
            <span>Deadlines</span>
          </button>
          <button
            onClick={() => setTypeFilter('milestone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'milestone'
                ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-[#00D9FF]" />
            <span>Milestones</span>
          </button>
          <button
            onClick={() => setTypeFilter('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'interview'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3 h-3 text-emerald-400" />
            <span>Interviews</span>
          </button>
          <button
            onClick={() => setTypeFilter('meeting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'meeting'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3 h-3 text-purple-400" />
            <span>Virtual Meetings</span>
          </button>
          <button
            onClick={() => setTypeFilter('task')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              typeFilter === 'task'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3 h-3 text-amber-400" />
            <span>Sprint Tasks</span>
          </button>
        </div>

        {/* Search & Department Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-52">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#090D16] border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="development">Engineering</option>
            <option value="design">Product Design</option>
            <option value="marketing">Marketing & Growth</option>
            <option value="sales">Enterprise Sales</option>
            <option value="finance">Finance & Treasury</option>
            <option value="hr">HR & People</option>
            <option value="ceo">Executive Suite</option>
          </select>
        </div>
      </div>

      {/* Main Calendar Matrix & Split Pane */}
      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Month Matrix Column */}
          <div className="lg:col-span-8 glass-panel p-5 rounded-3xl border border-slate-800/80 bg-[#0E1424]/80 flex flex-col justify-between">
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-extrabold text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={handleJumpToToday}
                  className="px-2 py-0.5 rounded-md bg-[#4F7CFF]/20 text-[#00D9FF] text-[10px] font-mono font-bold hover:bg-[#4F7CFF]/30 transition-colors"
                >
                  TODAY
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="p-1.5 rounded-lg bg-[#090D16] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="p-1.5 rounded-lg bg-[#090D16] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 border-b border-slate-800/50">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                <span key={d} className={`text-[10px] font-mono font-bold ${i === 0 || i === 6 ? 'text-slate-600' : 'text-slate-400'}`}>
                  {d}
                </span>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2 flex-1">
              {/* Empty padding for days before month start */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[72px] rounded-xl bg-[#090D16]/30 border border-slate-900/40 p-1 opacity-25"
                />
              ))}

              {/* Real Days of Current Month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isToday = formattedDate === '2026-09-02';
                const isSelected = formattedDate === selectedDate;
                const dayEvents = getEventsForDate(formattedDate);

                return (
                  <div
                    key={formattedDate}
                    onClick={() => setSelectedDate(formattedDate)}
                    className={`min-h-[72px] rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#182238] border-[#00D9FF] shadow-lg shadow-[#00D9FF]/10'
                        : isToday
                        ? 'bg-[#121A2C] border-[#4F7CFF]/50'
                        : dayEvents.length > 0
                        ? 'bg-[#0B0F19] border-slate-800 hover:border-slate-700'
                        : 'bg-[#090D16]/70 border-slate-900/60 hover:bg-[#0E1424]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isSelected
                            ? 'text-[#00D9FF]'
                            : isToday
                            ? 'text-white bg-[#4F7CFF] px-1.5 py-0.2 rounded-md'
                            : 'text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {isToday && !isSelected && (
                        <span className="text-[8px] font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                          TODAY
                        </span>
                      )}

                      {dayEvents.length > 0 && (
                        <span className="text-[9px] font-mono px-1 rounded-full bg-slate-800 text-slate-300">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Compact Event Pills in Day Cell */}
                    <div className="space-y-0.5 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] truncate px-1 py-0.2 rounded font-medium border ${getTypeColor(ev.type)} flex items-center gap-0.5`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                            backgroundColor:
                              ev.type === 'deadline'
                                ? '#F43F5E'
                                : ev.type === 'interview'
                                ? '#10B981'
                                : ev.type === 'meeting'
                                ? '#A855F7'
                                : ev.type === 'milestone'
                                ? '#00D9FF'
                                : '#F59E0B'
                          }} />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] font-mono text-slate-400 block text-right">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Color Legend */}
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Project Deadline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                  <span>Milestone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Interview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Virtual Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Sprint Task</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                Click any date to inspect details
              </span>
            </div>
          </div>

          {/* Selected Date Detail Drawer / Day Agenda Pane */}
          <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-[#4F7CFF]/25 bg-[#0B0F19]/95 flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Date Agenda</span>
                <h3 className="text-base font-extrabold text-white">
                  {selectedDate === '2026-09-02' ? 'Today • Sep 2, 2026' : selectedDate}
                </h3>
              </div>
              <button
                onClick={() => {
                  setMeetingDate(selectedDate);
                  setIsScheduleModalOpen(true);
                }}
                className="p-1.5 rounded-xl bg-[#4F7CFF]/20 text-[#00D9FF] hover:bg-[#4F7CFF]/30 transition-colors border border-[#4F7CFF]/30 flex items-center gap-1 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* List of Events for Selected Date */}
            <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-1">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl bg-[#141B2D] border border-slate-800 hover:border-[#00D9FF]/40 transition-all space-y-2 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTypeColor(ev.type)} flex items-center gap-1`}>
                          {getTypeIcon(ev.type)}
                          <span className="capitalize">{ev.type}</span>
                        </span>
                        {ev.priority && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              ev.priority === 'Urgent'
                                ? 'bg-rose-500/20 text-rose-300'
                                : ev.priority === 'High'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {ev.priority}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-[#00D9FF] font-semibold">
                        {ev.time}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-white leading-snug group-hover:text-[#00D9FF] transition-colors">
                      {ev.title}
                    </h4>

                    {ev.description && (
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {ev.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        {ev.leadAvatar && (
                          <img
                            src={ev.leadAvatar}
                            alt={ev.leadName || ''}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        )}
                        <span className="truncate max-w-[120px]">{ev.leadName || ev.locationOrRoom || 'Team'}</span>
                      </div>

                      {ev.actionType && (
                        <button
                          onClick={() => handleEventAction(ev)}
                          className="flex items-center gap-1 font-bold text-[#00D9FF] hover:underline"
                        >
                          <span>{ev.actionType === 'room' ? 'Enter Room' : ev.actionType === 'candidate' ? 'View Candidate' : 'Inspect'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-slate-800/80 rounded-2xl">
                  <CalendarCheck className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-400">No scheduled events on this date</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "Add" to schedule a meeting, milestone deadline, or interview.
                  </p>
                  <button
                    onClick={() => {
                      setMeetingDate(selectedDate);
                      setIsScheduleModalOpen(true);
                    }}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    + Schedule on {selectedDate}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Summary at bottom of drawer */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Total in month: {filteredEvents.length}</span>
              <span>Selected: {selectedDateEvents.length} events</span>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda / Chronological Timeline Stream Mode */
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-[#0E1424]/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">Chronological Company Timeline</h3>
              <p className="text-xs text-slate-400">All deliverables, meetings, and interviews sequenced by date.</p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#4F7CFF]/20 text-[#00D9FF]">
              {filteredEvents.length} Scheduled Deliverables
            </span>
          </div>

          <div className="space-y-6">
            {Object.keys(eventsGroupedByDate).length > 0 ? (
              Object.keys(eventsGroupedByDate).map((dateStr) => {
                const isToday = dateStr === '2026-09-02';
                const eventsOnThisDay = eventsGroupedByDate[dateStr];

                return (
                  <div key={dateStr} className="space-y-3">
                    {/* Date Header Strip */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold flex items-center gap-2 ${
                          isToday
                            ? 'bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/20'
                            : 'bg-[#141B2D] text-slate-300 border border-slate-800'
                        }`}
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                        {isToday && <span className="bg-[#00D9FF] text-[#090D16] text-[9px] px-1 rounded font-bold">TODAY</span>}
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
                      <span className="text-[10px] font-mono text-slate-500">
                        {eventsOnThisDay.length} item{eventsOnThisDay.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Events on this day */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {eventsOnThisDay.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 hover:border-[#00D9FF]/40 transition-all space-y-2.5 shadow-sm group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTypeColor(ev.type)} flex items-center gap-1`}>
                              {getTypeIcon(ev.type)}
                              <span className="capitalize">{ev.type}</span>
                            </span>
                            <span className="text-xs font-mono text-[#00D9FF] font-semibold">
                              {ev.time} {ev.endTime ? `→ ${ev.endTime}` : ''}
                            </span>
                          </div>

                          <h4 className="text-xs font-extrabold text-white leading-snug group-hover:text-[#00D9FF] transition-colors">
                            {ev.title}
                          </h4>

                          {ev.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {ev.description}
                            </p>
                          )}

                          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              {ev.leadAvatar ? (
                                <img
                                  src={ev.leadAvatar}
                                  alt={ev.leadName || ''}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                              ) : (
                                <Building className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span className="truncate max-w-[130px]">{ev.leadName || ev.locationOrRoom}</span>
                            </div>

                            {ev.actionType && (
                              <button
                                onClick={() => handleEventAction(ev)}
                                className="flex items-center gap-1 font-bold text-[#00D9FF] hover:underline"
                              >
                                <span>{ev.actionType === 'room' ? 'Join' : ev.actionType === 'candidate' ? 'View Dossier' : 'Inspect'}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl">
                <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">No events found matching your criteria</p>
                <p className="text-xs text-slate-500 mt-1">Try clearing filters or search keywords.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule New Event / Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#4F7CFF]/20 text-[#00D9FF] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Schedule Timeline Item</h3>
                  <p className="text-xs text-slate-400">Create virtual room meeting, project milestone, or candidate interview.</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Type Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 mt-4 p-1 rounded-xl bg-[#090D16] border border-slate-800">
              <button
                type="button"
                onClick={() => setScheduleType('meeting')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scheduleType === 'meeting'
                    ? 'bg-[#4F7CFF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Virtual Meeting</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('milestone')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scheduleType === 'milestone'
                    ? 'bg-[#00D9FF] text-[#090D16] shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Milestone Due</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('interview')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scheduleType === 'interview'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>HR Interview</span>
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="mt-4 space-y-3.5">
              {/* Meeting Form */}
              {scheduleType === 'meeting' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Meeting Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 Sprint Architecture Alignment"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Virtual Department Room</label>
                      <select
                        value={meetingRoomId}
                        onChange={(e) => setMeetingRoomId(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} (Floor {r.floor})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Date</label>
                      <input
                        type="date"
                        required
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Start Time</label>
                      <input
                        type="text"
                        placeholder="10:00 AM"
                        value={meetingStartTime}
                        onChange={(e) => setMeetingStartTime(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">End Time</label>
                      <input
                        type="text"
                        placeholder="11:00 AM"
                        value={meetingEndTime}
                        onChange={(e) => setMeetingEndTime(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Priority</label>
                      <select
                        value={meetingPriority}
                        onChange={(e) => setMeetingPriority(e.target.value as any)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Agenda & Goals</label>
                    <textarea
                      rows={2}
                      placeholder="Outline key meeting deliverables and discussion points..."
                      value={meetingAgenda}
                      onChange={(e) => setMeetingAgenda(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Milestone Form */}
              {scheduleType === 'milestone' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Associated Project</label>
                    <select
                      value={milestoneProjectId}
                      onChange={(e) => setMilestoneProjectId(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} • {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Milestone Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Complete SOC2 Type II Audit Artifacts"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Target Completion Date</label>
                    <input
                      type="date"
                      required
                      value={milestoneDueDate}
                      onChange={(e) => setMilestoneDueDate(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Interview Form */}
              {scheduleType === 'interview' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Candidate</label>
                    <select
                      value={interviewCandidateId}
                      onChange={(e) => setInterviewCandidateId(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.targetRole} (Stage: {c.stage})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Interview Date</label>
                      <input
                        type="date"
                        required
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Time</label>
                      <input
                        type="text"
                        placeholder="02:00 PM"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Assigned Interviewer</label>
                    <select
                      value={interviewerId}
                      onChange={(e) => setInterviewerId(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
