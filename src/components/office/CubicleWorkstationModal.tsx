import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Video,
  Send,
  Heart,
  Laptop,
  Check,
  Plus,
  GitCommit,
  Layers,
  Sparkles,
} from 'lucide-react';
import { WorkstationCubicle, LivePresenceIndicator } from '../../types';
import { getPresenceColor } from '../../data/floorPlanData';
import { useCompany } from '../../context/CompanyContext';
import { RecognitionBadgePill } from '../common/RecognitionBadgePill';
import { Trophy, HeartHandshake } from 'lucide-react';

interface CubicleWorkstationModalProps {
  cubicle: WorkstationCubicle;
  onClose: () => void;
  onUpdatePresence?: (cubicleId: string, status: LivePresenceIndicator) => void;
}

export const CubicleWorkstationModal: React.FC<CubicleWorkstationModalProps> = ({
  cubicle,
  onClose,
  onUpdatePresence,
}) => {
  const { employees, currentRole, triggerConfettiEffect, setIsMeetingModalOpen, sendEmployeeKudos } = useCompany();

  // Retrieve matching live employee for real-time recognition synchronization
  const liveEmployee = employees.find(
    (e) => e.name.toLowerCase() === cubicle.employeeName.toLowerCase() || e.id === cubicle.employeeId
  );
  const currentBadges = (liveEmployee?.badges && liveEmployee.badges.length > 0)
    ? liveEmployee.badges
    : (cubicle.badges || []);
  const kudosCount = liveEmployee?.kudosCount ?? cubicle.kudosCount ?? 0;

  const [currentStatus, setCurrentStatus] = useState<LivePresenceIndicator>(cubicle.presenceStatus);
  const [tasks, setTasks] = useState<{ id: string; title: string; priority: 'High' | 'Medium' | 'Low'; completed: boolean }[]>([
    { id: 't1', title: cubicle.currentTask, priority: 'High', completed: false },
    { id: 't2', title: 'Prepare documentation & test coverage specs', priority: 'Medium', completed: true },
    { id: 't3', title: 'Participate in cross-team sprint sync', priority: 'Low', completed: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [kudosSent, setKudosSent] = useState(false);
  const [pingSent, setPingSent] = useState(false);

  const statusStyle = getPresenceColor(currentStatus);

  const handleStatusChange = (status: LivePresenceIndicator) => {
    setCurrentStatus(status);
    if (onUpdatePresence) {
      onUpdatePresence(cubicle.id, status);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      priority: 'Medium' as const,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  const handleSendKudos = () => {
    if (liveEmployee) {
      sendEmployeeKudos(liveEmployee.id);
    }
    setKudosSent(true);
    triggerConfettiEffect();
    setTimeout(() => setKudosSent(false), 3500);
  };

  const handlePing = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          className="p-6 border-b border-slate-200 flex items-start justify-between relative overflow-hidden"
          style={{
            background:
              cubicle.roomType === 'tech'
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.12))'
                : 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.12))',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={cubicle.employeeAvatar}
                alt={cubicle.employeeName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusStyle.dot} ring-2 ring-white shadow-sm`}
                title={`Status: ${statusStyle.label}`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                  {cubicle.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {cubicle.roomType === 'tech' ? 'Tech Room Desk' : 'Design Room Desk'}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {cubicle.employeeName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">{cubicle.employeeRole}</p>

              {/* AI Awarded Recognition Badges */}
              {currentBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {currentBadges.map((badge) => (
                    <RecognitionBadgePill
                      key={badge.id}
                      badge={badge}
                      size="sm"
                      showTooltip={true}
                    />
                  ))}
                  {kudosCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                      ❤️ {kudosCount} Kudos
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(92vh-180px)] text-slate-700 text-sm">
          {/* AI Recognition & Activity Honors Panel */}
          {currentBadges.length > 0 ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 via-cyan-500/5 to-slate-50 border border-amber-500/25 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      AI Recognition Badges & Honors
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Evaluated by Gemini AI based on activity telemetry, task velocity, and peer synergy.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {currentBadges.length} Active Badge{currentBadges.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {currentBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border ${
                      badge.type === 'Top Performer'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-cyan-50/70 border-cyan-200 text-cyan-900'
                    } flex items-start gap-2.5`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        badge.type === 'Top Performer'
                          ? 'bg-amber-500 text-white'
                          : 'bg-cyan-600 text-white'
                      }`}
                    >
                      {badge.type === 'Top Performer' ? (
                        <Trophy className="w-3.5 h-3.5" />
                      ) : (
                        <HeartHandshake className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{badge.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white font-bold border border-slate-200">
                          {badge.level}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700">
                          {badge.confidenceScore}% AI Confidence
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-slate-700 italic">
                        "{badge.aiReason}"
                      </p>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        Activity: <strong className="text-slate-800">{badge.activityMetric}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Talent Engine evaluating activity telemetry for recognition badges...</span>
              </div>
              <button
                onClick={handleSendKudos}
                className="text-[11px] font-bold text-pink-600 hover:text-pink-800 underline underline-offset-2"
              >
                Send first kudos (+1)
              </button>
            </div>
          )}

          {/* Status Quick Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Live Presence Status (Click to update)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'working', label: '🟢 Working', activeBg: 'bg-emerald-600 text-white' },
                  { id: 'meeting', label: '🔵 In Meeting', activeBg: 'bg-blue-600 text-white' },
                  { id: 'break', label: '🟠 Break', activeBg: 'bg-amber-500 text-white' },
                  { id: 'lunch', label: '🍽️ Lunch', activeBg: 'bg-orange-500 text-white' },
                  { id: 'reviewing', label: '🟣 Reviewing Tasks', activeBg: 'bg-purple-600 text-white' },
                  { id: 'leave', label: '🏖️ On Leave', activeBg: 'bg-slate-600 text-white' },
                  { id: 'offline', label: '🔴 Offline', activeBg: 'bg-rose-600 text-white' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStatusChange(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    currentStatus === s.id
                      ? `${s.activeBg} border-transparent shadow-sm scale-[1.03]`
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Performance
              </span>
              <span className="text-lg font-black text-emerald-600">
                {cubicle.performanceScore}%
              </span>
              <span className="text-[10px] text-slate-500 block">Tier 1 Rating</span>
            </div>

            <div className="text-center border-x border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Attendance
              </span>
              <span className="text-lg font-black text-blue-600">
                {cubicle.attendanceRate}%
              </span>
              <span className="text-[10px] text-slate-500 block">Clocked in 08:35 AM</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Work Progress
              </span>
              <span className="text-lg font-black text-purple-600">
                {cubicle.workProgress}%
              </span>
              <span className="text-[10px] text-slate-500 block">Current Sprint</span>
            </div>
          </div>

          {/* Project & Reporting Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                Active Project
              </span>
              <p className="font-bold text-slate-900 text-sm">{cubicle.activeProject}</p>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cubicle.workProgress}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-500" />
                Reporting Line
              </span>
              <p className="text-xs text-slate-600">
                Team Lead: <span className="font-bold text-slate-900">{cubicle.teamLead}</span>
              </p>
              <p className="text-xs text-slate-600">
                Reporting Manager: <span className="font-bold text-slate-900">{cubicle.reportingManager}</span>
              </p>
            </div>
          </div>

          {/* Recent Live Activity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 shadow-sm">
              {cubicle.roomType === 'tech' ? (
                <GitCommit className="w-4 h-4 text-emerald-600" />
              ) : (
                <Layers className="w-4 h-4 text-pink-600" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Live Work Activity Telemetry
              </span>
              <p className="text-xs text-slate-800 font-medium mt-0.5">
                {cubicle.recentActivity}
              </p>
            </div>
          </div>

          {/* Assigned Workstation Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Assigned Workstation Tasks
              </label>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>

            {isAddingTask && (
              <form onSubmit={handleAddTask} className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter task description..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  Assign
                </button>
              </form>
            )}

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium">{task.title}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Badges */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Core Skills & Tech Stack
            </label>
            <div className="flex flex-wrap gap-1.5">
              {cubicle.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePing}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>{pingSent ? 'Ping Sent!' : 'Slack Ping'}</span>
            </button>

            <button
              onClick={handleSendKudos}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-pink-600 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{kudosSent ? 'Kudos Shared! 🎉' : 'Send Kudos'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setIsMeetingModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-purple-600 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Video className="w-3.5 h-3.5 text-purple-600" />
              <span>Call to War Room</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
          >
            Close Workstation
          </button>
        </div>
      </div>
    </div>
  );
};
