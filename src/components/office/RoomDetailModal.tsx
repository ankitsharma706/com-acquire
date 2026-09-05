import React, { useState } from 'react';
import {
  X,
  Building,
  Users,
  CheckCircle,
  Thermometer,
  Volume2,
  Send,
  MessageSquare,
  Sparkles,
  Video,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DepartmentRoom, Employee } from '../../types';
import { useCompany } from '../../context/CompanyContext';

interface RoomDetailModalProps {
  room: DepartmentRoom;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose }) => {
  const {
    employees,
    projects,
    currentRole,
    sendChatMessage,
    messages,
    setIsMeetingModalOpen,
    setActiveTab,
    reassignTeamLead,
    triggerConfettiEffect,
  } = useCompany();

  const [chatInput, setChatInput] = useState('');
  const [roomTemp, setRoomTemp] = useState('21.0°C');
  const [activeTab, setActiveTabLocal] = useState<'members' | 'tasks' | 'chat'>('members');

  const roomEmployees = employees.filter((e) => e.departmentId === room.id);
  const roomProjects = projects.filter((p) => p.departmentId === room.id);
  const roomTasks = roomProjects.flatMap((p) => p.tasks);

  const roomChannelId = `chan-${room.id}`;
  const roomMessages = messages[roomChannelId] || [
    {
      id: 'mock-1',
      channelId: roomChannelId,
      senderId: room.teamLeadId,
      senderName: room.teamLeadName,
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Department Lead',
      text: `Welcome to the ${room.name} interactive hub. Daily sprint syncs are held here at 10 AM.`,
      timestamp: '09:00 AM',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(roomChannelId, chatInput);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div
          className="p-6 border-b border-slate-800 flex items-center justify-between relative"
          style={{
            background: `linear-gradient(to right, ${room.color}15, #141B2D)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: `${room.color}30`, border: `1px solid ${room.color}60` }}
            >
              <Building className="w-6 h-6" style={{ color: room.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">{room.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {room.shortCode}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Floor {room.floor} • Lead: <span className="text-white font-semibold">{room.teamLeadName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setIsMeetingModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Huddle</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Environmental Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#0B0F19]/80 border-b border-slate-800/80 text-xs font-mono">
          <div className="p-2 rounded-lg bg-[#141B2D] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Climate:
            </span>
            <span className="font-bold text-white">{room.temperature}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#141B2D] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#00D9FF]" /> Acoustics:
            </span>
            <span className="font-bold text-white">{room.noiseLevel}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#141B2D] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Occupancy:
            </span>
            <span className="font-bold text-emerald-400">
              {room.currentOccupants} / {room.capacity}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[#141B2D] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Performance:
            </span>
            <span className="font-bold text-[#00D9FF]">{room.avgPerformanceScore}%</span>
          </div>
        </div>

        {/* Sub-tabs: Members / Tasks / Room Chat */}
        <div className="flex border-b border-slate-800 px-6 bg-[#141B2D]">
          {[
            { id: 'members', label: `Team Members (${roomEmployees.length})` },
            { id: 'tasks', label: `Assigned Tasks (${roomTasks.length})` },
            { id: 'chat', label: 'Room Channel' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabLocal(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#00D9FF] text-[#00D9FF]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto max-h-[50vh] flex-1">
          {activeTab === 'members' && (
            <div className="space-y-3">
              {roomEmployees.length > 0 ? (
                roomEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800/80 flex items-center justify-between hover:border-[#4F7CFF]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00C853] ring-2 ring-[#141B2D]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{emp.name}</h4>
                          {emp.isTeamLead && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                              TEAM LEAD
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{emp.role}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          Current Focus: {emp.currentTask || 'Active Sprint Work'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono text-[11px]">
                        <span className="text-emerald-400 font-bold">{emp.performanceRating}% Score</span>
                        <p className="text-[10px] text-slate-400">{emp.attendanceRate}% Attendance</p>
                      </div>

                      {currentRole === 'CEO' && !emp.isTeamLead && (
                        <button
                          onClick={() => {
                            reassignTeamLead(room.id, emp.id);
                            triggerConfettiEffect();
                          }}
                          className="py-1 px-2.5 rounded-lg bg-[#4F7CFF]/15 hover:bg-[#4F7CFF]/30 border border-[#4F7CFF]/30 text-[10px] font-bold text-[#00D9FF] transition-all"
                        >
                          Make Lead
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No dedicated members permanently assigned. Floating occupants active.
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {roomTasks.length > 0 ? (
                roomTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            task.priority === 'Urgent'
                              ? 'bg-rose-500/20 text-rose-300'
                              : task.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <h4 className="text-xs font-bold text-white">{task.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{task.description}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        Assignee: <span className="text-slate-300 font-semibold">{task.assigneeName}</span> • Due: {task.dueDate}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        task.status === 'Done'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active tasks registered under this department room.
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-72 justify-between">
              <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                {roomMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="p-3 rounded-xl bg-[#0B0F19]/80 border border-slate-800 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder={`Message #${room.shortCode} room feed...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 py-2 px-3.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#4F7CFF] hover:bg-[#3B6AE8] text-white font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
