import React, { useState } from 'react';
import {
  Building2,
  Users,
  Volume2,
  Thermometer,
  Sparkles,
  Video,
  Radio,
  Layers,
  Eye,
  Sliders,
  Bell,
  DoorOpen,
  Coffee,
  CheckCircle2,
  Mic,
  Maximize2,
  MapPin,
  LayoutGrid,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { DepartmentRoom } from '../../types';
import { RoomDetailModal } from './RoomDetailModal';
import { CompanyHQFloorPlan } from './CompanyHQFloorPlan';

export const VirtualOfficeMap: React.FC = () => {
  const {
    rooms,
    employees,
    selectedRoom,
    setSelectedRoom,
    setIsMeetingModalOpen,
    triggerConfettiEffect,
  } = useCompany();

  const [viewMode, setViewMode] = useState<'floor_plan' | 'department_cards'>('floor_plan');
  const [activeSoundscape, setActiveSoundscape] = useState<string>('Deep Focus Synth');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [knockFeedback, setKnockFeedback] = useState<string | null>(null);

  const soundscapes = [
    'Deep Focus Synth',
    'Silicon Valley Datacenter Hum',
    'Rain on Skylight Glass',
    'Coffee Shop Ambient Chatter',
    'Mute Audio',
  ];

  const filteredRooms = floorFilter === 'all' ? rooms : rooms.filter((r) => r.floor === floorFilter);

  const handleKnock = (room: DepartmentRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    setKnockFeedback(`Knocked on ${room.name}! Room lead ${room.teamLeadName} notified.`);
    triggerConfettiEffect();
    setTimeout(() => setKnockFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              CompanyHQ Virtual Headquarters
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              HQ FLOOR PLAN • 18 INTERACTIVE ROOMS • 40 CUBICLES
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital workplace. Enter any room, check live cubicle telemetry, collaborate in conference suites, and review corporate metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('floor_plan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'floor_plan'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
              Office Floor Plan Map
            </button>
            <button
              onClick={() => setViewMode('department_cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'department_cards'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Multi-Floor Rooms
            </button>
          </div>

          {/* Soundscape Dropdown */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={activeSoundscape}
              onChange={(e) => setActiveSoundscape(e.target.value)}
              aria-label="Ambient Office Audio Soundscape"
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {soundscapes.map((s) => (
                <option key={s} value={s} className="bg-white text-slate-800">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* All-Hands Meeting Button */}
          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02]"
          >
            <Video className="w-4 h-4" />
            <span>Join War Room</span>
          </button>
        </div>
      </div>

      {/* Knock feedback toast */}
      {knockFeedback && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 flex items-center justify-between animate-in fade-in">
          <span>🔔 {knockFeedback}</span>
          <span className="text-[10px] font-mono text-slate-500">Live Notification Sent</span>
        </div>
      )}

      {/* Primary Content: Floor Plan or Department Cards */}
      {viewMode === 'floor_plan' ? (
        <CompanyHQFloorPlan />
      ) : (
        <div className="relative min-h-[640px] rounded-3xl bg-white border border-slate-200 p-6 lg:p-8 shadow-sm">
          {/* Floor Filter Tabs */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Level:</span>
              {[
                { id: 'all', label: 'All Levels' },
                { id: 4, label: 'Floor 4 (Executive & Boardroom)' },
                { id: 3, label: 'Floor 3 (Engineering & Design)' },
                { id: 2, label: 'Floor 2 (Growth & Enterprise Sales)' },
                { id: 1, label: 'Floor 1 (People Ops & Treasury)' },
              ].map((tab) => (
                <button
                  key={String(tab.id)}
                  onClick={() => setFloorFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    floorFilter === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 38 Active Inside
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 6 In Meeting
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 4 Deep Focus
              </span>
            </div>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => {
              const roomEmployees = employees.filter((e) => e.departmentId === room.id);
              const isBoardroom = room.id === 'meeting_rooms' || room.id === 'ceo';

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-[1.01] bg-white shadow-xs hover:shadow-md ${
                    isBoardroom
                      ? 'border-blue-300 ring-1 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top room glow header */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: room.color }}
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                        style={{ backgroundColor: `${room.color}15`, border: `1px solid ${room.color}30` }}
                      >
                        <Building2 className="w-4 h-4" style={{ color: room.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {room.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Level {room.floor} • Room {room.shortCode}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase"
                      style={{
                        backgroundColor: `${room.color}15`,
                        color: room.color,
                        border: `1px solid ${room.color}30`,
                      }}
                    >
                      {room.currentOccupants} / {room.capacity} IN
                    </span>
                  </div>

                  {/* Ambient Status */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {room.ambientStatus}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-2">
                      {room.temperature}
                    </span>
                  </div>

                  {/* Team Lead & Occupants Avatars */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Department Lead
                      </p>
                      <p className="text-xs font-bold text-slate-900">{room.teamLeadName}</p>
                    </div>

                    {/* Avatars Stack */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {roomEmployees.slice(0, 4).map((emp) => (
                        <img
                          key={emp.id}
                          src={emp.avatar}
                          alt={emp.name}
                          title={`${emp.name} - ${emp.role}`}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                      {roomEmployees.length > 4 && (
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-600">
                          +{roomEmployees.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Quick Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => handleKnock(room, e)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <DoorOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Knock</span>
                    </button>

                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] text-blue-700 font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};
