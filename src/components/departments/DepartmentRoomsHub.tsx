import React, { useState } from 'react';
import {
  DoorOpen,
  Users,
  Award,
  CheckSquare,
  Sparkles,
  Video,
  MessageSquare,
  BarChart3,
  Calendar,
  FileText,
  UserCheck,
  TrendingUp,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { DepartmentId, DepartmentRoom } from '../../types';

export const DepartmentRoomsHub: React.FC = () => {
  const {
    rooms,
    employees,
    projects,
    setSelectedEmployee,
    setSelectedProject,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    setIsMeetingModalOpen,
    setActiveTab,
    setActiveChannelId,
  } = useCompany();

  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId>('dept-dev');

  const currentRoom = rooms.find((r) => r.id === selectedDeptId) || rooms[0];
  const deptEmployees = employees.filter((e) => e.departmentId === selectedDeptId);
  const deptProjects = projects.filter((p) => p.departmentId === selectedDeptId);
  const deptLead = employees.find((e) => e.id === currentRoom.leadId);

  const avgAttendance = deptEmployees.length
    ? (deptEmployees.reduce((acc, curr) => acc + curr.attendanceRate, 0) / deptEmployees.length).toFixed(1)
    : '100';

  const handleOpenChannel = () => {
    setActiveTab('communication');
    // Map room to channel
    const channelMap: Record<string, string> = {
      'dept-dev': 'chan-dev',
      'dept-hr': 'chan-hr',
      'dept-finance': 'chan-finance',
      'dept-marketing': 'chan-marketing',
      'dept-sales': 'chan-sales',
      'dept-design': 'chan-all',
      'dept-ceo': 'chan-ceo-broadcast',
      'dept-support': 'chan-all',
    };
    if (channelMap[selectedDeptId]) {
      setActiveChannelId(channelMap[selectedDeptId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EC4899]/15 border border-[#EC4899]/30 text-[#EC4899]">
              <DoorOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Department Command Rooms
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30">
              PAGE 14
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Dedicated operational quarters for each company wing. Inspect squad health, live attendance rates, project commitments, and run live departmental video standups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] hover:opacity-95 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Launch Standup Video</span>
          </button>
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {rooms.map((room) => {
          const isSelected = selectedDeptId === room.id;
          const memberCount = employees.filter((e) => e.departmentId === room.id).length;
          return (
            <button
              key={room.id}
              onClick={() => setSelectedDeptId(room.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#141B2D] text-white border border-[#4F7CFF]/40 shadow-md shadow-[#4F7CFF]/15'
                  : 'text-slate-400 hover:text-white hover:bg-[#141B2D]/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: room.themeColor }} />
              <span>{room.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {memberCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Department Showcase Header */}
      <div
        className="p-6 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${currentRoom.themeColor}15, #141B2D 80%)`,
          borderColor: `${currentRoom.themeColor}40`,
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full font-mono uppercase tracking-wider"
              style={{ backgroundColor: `${currentRoom.themeColor}25`, color: currentRoom.themeColor }}
            >
              {currentRoom.name}
            </span>
            <span className="text-xs font-mono text-slate-400">Floor {currentRoom.floor}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{currentRoom.tagline}</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{currentRoom.description}</p>
        </div>

        {/* Lead & Quick Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#0B0F19]/70 p-4 rounded-xl border border-slate-800 shrink-0">
          {deptLead && (
            <div className="flex items-center gap-3">
              <img src={deptLead.avatar} alt={deptLead.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Department Lead</span>
                <p className="text-xs font-bold text-white">{deptLead.name}</p>
                <p className="text-[10px] text-[#00D9FF]">{deptLead.role}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:border-l sm:border-slate-800 sm:pl-4">
            <button
              onClick={handleOpenChannel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B2D] hover:bg-[#1C253D] text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Room Chat</span>
            </button>
            <button
              onClick={() => {
                setAiInitialPrompt(`Provide an in-depth productivity analysis and backlog optimization strategy for ${currentRoom.name}.`);
                setIsAiDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-xs font-semibold text-purple-300 border border-purple-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15">
          <span className="text-xs text-slate-400 font-medium">Squad Strength</span>
          <p className="text-2xl font-extrabold text-white mt-1">{deptEmployees.length} Staff</p>
          <span className="text-[10px] text-emerald-400 font-mono">100% Allocated</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15">
          <span className="text-xs text-slate-400 font-medium">Active Projects</span>
          <p className="text-2xl font-extrabold text-white mt-1">{deptProjects.length} Deliverables</p>
          <span className="text-[10px] text-[#00D9FF] font-mono">In Current Sprint</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15">
          <span className="text-xs text-slate-400 font-medium">Performance Score</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{currentRoom.performanceScore}%</p>
          <span className="text-[10px] text-slate-400 font-mono">Grade: Excellent</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15">
          <span className="text-xs text-slate-400 font-medium">Dept Attendance</span>
          <p className="text-2xl font-extrabold text-white mt-1">{avgAttendance}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">Top Compliance</span>
        </div>
      </div>

      {/* Main Grid: Team Members & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members List */}
        <div className="p-5 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-bold text-white">Department Personnel ({deptEmployees.length})</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Click to inspect</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {deptEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="p-3 rounded-xl bg-[#0B0F19]/60 border border-slate-800 hover:border-[#4F7CFF]/40 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0B0F19] ${
                        emp.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                      {emp.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{emp.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{emp.performanceScore}%</span>
                  <p className="text-[10px] text-slate-400 font-mono">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Projects & Sprints */}
        <div className="p-5 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#4F7CFF]" />
              <h3 className="text-sm font-bold text-white">Assigned Projects ({deptProjects.length})</h3>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-[#00D9FF] hover:underline font-semibold"
            >
              Open Sprints →
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {deptProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="p-4 rounded-xl bg-[#0B0F19]/60 border border-slate-800 hover:border-[#4F7CFF]/40 cursor-pointer space-y-2.5 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{proj.description}</p>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      proj.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400'
                        : proj.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-[#4F7CFF]/20 text-[#00D9FF]'
                    }`}
                  >
                    {proj.priority}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Progress: {proj.progress}%</span>
                    <span>Deadline: {proj.deadline}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
