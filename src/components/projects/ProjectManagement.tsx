import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Sparkles,
  Clock,
  User,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Kanban,
  Milestone,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { Project, ProjectTask, ProjectStatus, TaskPriority } from '../../types';
import { UnifiedProjectCalendarWidget } from '../calendar/UnifiedProjectCalendarWidget';

export const ProjectManagement: React.FC = () => {
  const {
    projects,
    employees,
    scheduledMeetings,
    candidates,
    currentRole,
    createProject,
    updateProjectStatus,
    addTaskToProject,
    updateTaskStatus,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    triggerConfettiEffect,
  } = useCompany();

  const [activeTabMode, setActiveTabMode] = useState<'board' | 'calendar'>('board');
  const [activeView, setActiveView] = useState<'board' | 'list'>('board');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState(250000);
  const [newProjectDeadline, setNewProjectDeadline] = useState('2026-11-30');
  const [newProjectPriority, setNewProjectPriority] = useState<TaskPriority>('High');

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(employees[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-09-25');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    createProject({
      name: newProjectName,
      code: newProjectCode || `HQ-${Math.floor(Math.random() * 900 + 100)}`,
      description: newProjectDesc,
      budget: Number(newProjectBudget),
      deadline: newProjectDeadline,
      priority: newProjectPriority,
      status: 'In Progress',
    });

    setNewProjectName('');
    setNewProjectCode('');
    setNewProjectDesc('');
    setIsNewProjectModalOpen(false);
    triggerConfettiEffect();
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;

    addTaskToProject(selectedProject.id, {
      title: newTaskTitle,
      description: newTaskDesc,
      assigneeId: newTaskAssigneeId,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      status: 'Todo',
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsNewTaskModalOpen(false);
    triggerConfettiEffect();
  };

  const taskColumns: { id: 'Todo' | 'In Progress' | 'In Review' | 'Done'; label: string; color: string }[] = [
    { id: 'Todo', label: 'To Do', color: '#64748B' },
    { id: 'In Progress', label: 'In Progress', color: '#00D9FF' },
    { id: 'In Review', label: 'In Review', color: '#FFB300' },
    { id: 'Done', label: 'Completed', color: '#00C853' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Project Management & Sprint Execution
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
              LINEAR WORKFLOW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track strategic milestones, assign engineering tasks, and monitor delivery velocity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setAiInitialPrompt(
                `Suggest optimal task allocations across available engineering talent for project: ${selectedProject?.name || 'All initiatives'}.`
              );
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF]/20 to-[#00D9FF]/20 border border-[#4F7CFF]/40 text-xs font-bold text-[#00D9FF] hover:opacity-90 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Allocator</span>
          </button>

          {(currentRole === 'CEO' || currentRole === 'PROJECT_MANAGER') && (
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Strategic Project</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher Tabs Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-[#090D16] border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabMode('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'board'
                ? 'bg-gradient-to-r from-[#4F7CFF] to-[#3B6AE8] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Sprint Board & Execution</span>
          </button>

          <button
            onClick={() => setActiveTabMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTabMode === 'calendar'
                ? 'bg-[#141B2D] border-[#00D9FF] text-[#00D9FF] shadow-lg shadow-[#00D9FF]/10'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Unified Calendar & Timeline</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] font-bold">
              {projects.length + (candidates.filter((c) => c.interviewDate).length) + scheduledMeetings.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:block px-3">
          {activeTabMode === 'board' ? 'Linear Kanban Workflow' : 'Multi-Disciplinary Operational Schedule'}
        </div>
      </div>

      {/* Conditionally Render Active Tab Mode */}
      {activeTabMode === 'calendar' ? (
        <UnifiedProjectCalendarWidget
          onSelectProject={(projId) => {
            setSelectedProjectId(projId);
            setActiveTabMode('board');
          }}
        />
      ) : (
        <>
          {/* Project Selector Chips Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {projects.map((prj) => (
              <button
                key={prj.id}
                onClick={() => setSelectedProjectId(prj.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                  selectedProjectId === prj.id
                    ? 'bg-[#141B2D] border-[#00D9FF] text-white shadow-lg shadow-[#4F7CFF]/15'
                    : 'bg-[#0B0F19]/80 border-slate-800 text-slate-400 hover:text-white hover:bg-[#141B2D]'
                }`}
              >
                <span className="font-mono text-[10px] text-[#00D9FF]">{prj.code}</span>
                <span>{prj.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    prj.status === 'Testing'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {prj.progress}%
                </span>
              </button>
            ))}
          </div>

      {/* Selected Project Overview Card */}
      {selectedProject && (
        <div className="glass-panel p-6 rounded-3xl border border-[#4F7CFF]/25 bg-gradient-to-br from-[#141B2D] to-[#101726]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
                  {selectedProject.code}
                </span>
                <span className="text-xs text-slate-400">Manager: {selectedProject.managerName}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">{selectedProject.name}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Budget & Runway</p>
                <p className="text-sm font-extrabold text-white font-mono">
                  ${selectedProject.spent.toLocaleString()} / ${selectedProject.budget.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3B6AE8] text-white text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Milestones Horizontal Bar */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Key Strategic Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedProject.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    m.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[#0B0F19]/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white truncate">{m.title}</span>
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Due: {m.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board Columns */}
      {selectedProject && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskColumns.map((col) => {
            const tasksInCol = selectedProject.tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 flex flex-col min-h-[380px]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {tasksInCol.length}
                  </span>
                </div>

                <div className="space-y-3 mt-3 flex-1 overflow-y-auto">
                  {tasksInCol.length > 0 ? (
                    tasksInCol.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-[#141B2D] border border-[#4F7CFF]/15 hover:border-[#00D9FF]/40 shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              task.priority === 'Urgent'
                                ? 'bg-rose-500/20 text-rose-300'
                                : task.priority === 'High'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Quick status transition */}
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(selectedProject.id, task.id, e.target.value as any)
                            }
                            aria-label="Update Task Status"
                            className="bg-[#0B0F19] border border-slate-700 text-[10px] text-slate-300 rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                          >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>

                        <h4 className="text-xs font-bold text-white mt-2 group-hover:text-[#00D9FF] transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assigneeAvatar}
                              alt={task.assigneeName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-slate-300 truncate max-w-[90px]">{task.assigneeName}</span>
                          </div>
                          <span className="font-mono text-slate-400">{task.dueDate}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8 border border-dashed border-slate-800 rounded-xl">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Launch Strategic Initiative</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create an enterprise project milestone and allocate resources.
            </p>

            <form onSubmit={handleCreateProjectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Autonomous AI Workflow Mesh v5"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Code Identifier</label>
                  <input
                    type="text"
                    placeholder="HQ-AI5"
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Budget ($)</label>
                  <input
                    type="number"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description & Goals</label>
                <textarea
                  rows={3}
                  placeholder="Summarize key technical goals and expected outcomes..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Deadline</label>
                  <input
                    type="date"
                    value={newProjectDeadline}
                    onChange={(e) => setNewProjectDeadline(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Priority Level</label>
                  <select
                    value={newProjectPriority}
                    onChange={(e) => setNewProjectPriority(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Create Sprint Task</h2>
            <p className="text-xs text-slate-400 mt-0.5">Assign an actionable deliverable to team members.</p>

            <form onSubmit={handleCreateTaskSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Wire up WebRTC data channels for low latency"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Assignee</label>
                <select
                  value={newTaskAssigneeId}
                  onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task specifications and verification steps..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
