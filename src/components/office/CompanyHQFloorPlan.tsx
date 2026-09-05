import React, { useState, useEffect } from 'react';
import {
  Users,
  Video,
  DoorOpen,
  Coffee,
  Utensils,
  Package,
  Server,
  Palette,
  PenTool,
  Cpu,
  Code,
  FolderKanban,
  Crown,
  Briefcase,
  Rocket,
  Coins,
  LayoutGrid,
  Terminal,
  Footprints,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import {
  FloorPlanRoomKey,
  WorkstationCubicle,
  LivePresenceIndicator,
} from '../../types';
import {
  FLOOR_PLAN_ROOMS_META,
  INITIAL_TECH_CUBICLES,
  INITIAL_DESIGN_CUBICLES,
  INITIAL_CORRIDOR_WALKERS,
  CorridorWalker,
  getPresenceColor,
} from '../../data/floorPlanData';
import { CubicleWorkstationModal } from './CubicleWorkstationModal';
import { InteractiveRoomModal } from './InteractiveRoomModal';

export const CompanyHQFloorPlan: React.FC = () => {
  // State
  const [selectedRoomKey, setSelectedRoomKey] = useState<FloorPlanRoomKey | null>(null);
  const [selectedCubicle, setSelectedCubicle] = useState<WorkstationCubicle | null>(null);
  const [techCubicles, setTechCubicles] = useState<WorkstationCubicle[]>(INITIAL_TECH_CUBICLES);
  const [designCubicles, setDesignCubicles] = useState<WorkstationCubicle[]>(INITIAL_DESIGN_CUBICLES);
  const [statusFilter, setStatusFilter] = useState<LivePresenceIndicator | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ambientSound, setAmbientSound] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [walkers, setWalkers] = useState<CorridorWalker[]>(INITIAL_CORRIDOR_WALKERS);

  // Animate corridor walkers walking along the top corridor
  useEffect(() => {
    const interval = setInterval(() => {
      setWalkers((prev) =>
        prev.map((w) => {
          let nextX = w.direction === 'right' ? w.startPercentX + w.speed * 0.4 : w.startPercentX - w.speed * 0.4;
          let nextDir = w.direction;
          if (nextX >= 90) {
            nextX = 90;
            nextDir = 'left';
          } else if (nextX <= 10) {
            nextX = 10;
            nextDir = 'right';
          }
          return {
            ...w,
            startPercentX: nextX,
            direction: nextDir,
          };
        })
      );
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Update cubicle status
  const handleUpdateCubicleStatus = (cubicleId: string, status: LivePresenceIndicator) => {
    setTechCubicles((prev) =>
      prev.map((c) => (c.id === cubicleId ? { ...c, presenceStatus: status } : c))
    );
    setDesignCubicles((prev) =>
      prev.map((c) => (c.id === cubicleId ? { ...c, presenceStatus: status } : c))
    );
    if (selectedCubicle && selectedCubicle.id === cubicleId) {
      setSelectedCubicle({ ...selectedCubicle, presenceStatus: status });
    }
  };

  // Filtered cubicles check
  const isCubicleMatch = (cub: WorkstationCubicle) => {
    const matchesStatus = statusFilter === 'all' || cub.presenceStatus === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      cub.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cub.employeeRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cub.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  };

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, role, or cubicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Live Presence Indicators Legend & Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-[11px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Desks (40)
          </button>

          <button
            onClick={() => setStatusFilter('working')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'working'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Working (Green)
          </button>

          <button
            onClick={() => setStatusFilter('meeting')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'meeting'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Meeting (Blue)
          </button>

          <button
            onClick={() => setStatusFilter('break')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'break'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Break (Orange)
          </button>

          <button
            onClick={() => setStatusFilter('reviewing')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'reviewing'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Reviewing (Purple)
          </button>

          <button
            onClick={() => setStatusFilter('offline')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'offline'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Offline (Red)
          </button>
        </div>

        {/* View Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className={`p-2 rounded-xl border transition-colors ${
              ambientSound
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Ambient Office Sound"
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.4))}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas Frame */}
      <div className="relative overflow-x-auto overflow-y-hidden rounded-3xl border-2 border-slate-200 bg-[#F4F6F9] shadow-inner p-4 sm:p-6 transition-transform origin-top">
        <div
          className="min-w-[1180px] select-none space-y-4"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* ========================================================================= */}
          {/* TOP SECTION: CAFETERIA (LEFT), PERSONAL/DUO LOUNGE & CORRIDOR, MAIN GATE (RIGHT) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-12 gap-3.5">
            {/* Cafeteria (Top Left, cols 1-3) */}
            <div
              onClick={() => setSelectedRoomKey('cafeteria')}
              className="col-span-3 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase text-amber-700">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    <span>CAFETERIA & DINING</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5 group-hover:text-amber-600 transition-colors">
                    Cafeteria
                  </h3>
                  <p className="text-[11px] text-slate-500">Social hub, coffee & peer kudos</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  14 Inside
                </span>
              </div>

              {/* Graphical representation of tables */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-800">
                  ☕
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-800">
                  🥗
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Barista & Dining Booths</span>
                <span className="text-[10px] text-amber-600 font-bold ml-auto group-hover:translate-x-1 transition-transform">
                  Enter →
                </span>
              </div>
            </div>

            {/* Walkway & Scenic Duo Lounge (Center, cols 4-9) */}
            <div className="col-span-6 flex flex-col gap-2">
              {/* Personal or duo person to sit and talk work or eat or see scenario */}
              <div
                onClick={() => setSelectedRoomKey('lounge_duo')}
                className="rounded-xl bg-purple-50/70 border border-purple-200 hover:border-purple-400 p-2.5 px-4 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 group-hover:text-purple-700">
                      Scenic Terrace Lounge
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Solo focus pods & duo peer sync overlooking skyline
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                  6 / 16 Pods
                </span>
              </div>

              {/* Walkway Corridor with Animated Walking Avatars */}
              <div
                onClick={() => setSelectedRoomKey('walkway')}
                className="relative flex-1 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 border-2 border-dashed border-slate-300 hover:border-blue-400 p-3 shadow-inner cursor-pointer group flex flex-col justify-between min-h-[85px] overflow-hidden"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1 uppercase tracking-wider text-slate-500">
                    <Footprints className="w-3.5 h-3.5 text-blue-500" />
                    Walkway Corridor (Main Concourse)
                  </span>
                  <span className="text-blue-600 group-hover:underline">Click Corridor</span>
                </div>

                {/* Animated walking avatars traversing the corridor */}
                <div className="relative h-9 w-full my-auto flex items-center">
                  {walkers.map((walker) => (
                    <div
                      key={walker.id}
                      className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1 transition-all duration-150"
                      style={{ left: `${walker.startPercentX}%` }}
                      title={`${walker.name} (${walker.role}): ${walker.activityNote}`}
                    >
                      <div className="relative">
                        <img
                          src={walker.avatar}
                          alt={walker.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500 shadow-sm"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 bg-white/90 px-1 py-0.2 rounded shadow-2xs whitespace-nowrap hidden sm:inline">
                        {walker.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/60 pt-1">
                  <span>← Walk to Cafeteria</span>
                  <span className="font-mono text-emerald-600">Active movement: 4 employees walking</span>
                  <span>Walk to Main Gate →</span>
                </div>
              </div>
            </div>

            {/* Main Gate (Top Right, cols 10-12) */}
            <div
              onClick={() => setSelectedRoomKey('main_gate')}
              className="col-span-3 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase text-blue-700">
                    <DoorOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>MAIN GATE & SECURITY</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
                    Main Gate
                  </h3>
                  <p className="text-[11px] text-slate-500">Access turnstiles, RFID badges & visitors</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  Secure
                </span>
              </div>

              {/* Turnstile graphic */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <div className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-[9px] font-bold text-slate-700">
                  TURNSTILE #1 [OPEN]
                </div>
                <span className="text-[10px] text-blue-600 font-bold ml-auto group-hover:translate-x-1 transition-transform">
                  Enter Checkpoint →
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MIDDLE SECTION:
              - LEFT COLUMN: Store Room, Male Bathroom, Female Bathroom
              - CENTER LEFT: Design Room (20 Cubicles)
              - CENTER DIVIDER: Meeting Room 1, Meeting Room 2, Meeting Room 3
              - CENTER RIGHT: Tech Room (20 Cubicles)
              - RIGHT COLUMN: DevOps Deployment (top), Finance / Account & Audit (bottom)
          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-12 gap-3.5">
            {/* Left Column: Store Room & Restrooms (cols 1-2) */}
            <div className="col-span-2 flex flex-col gap-3">
              {/* Store Room */}
              <div
                onClick={() => setSelectedRoomKey('store_room')}
                className="flex-1 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-500">
                    <Package className="w-3 h-3 text-slate-600" />
                    <span>STORE ROOM</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mt-0.5">
                    Store Room
                  </h4>
                  <p className="text-[10px] text-slate-500">IT hardware & asset depot</p>
                </div>
                <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-center block">
                  MacBook / 4K Fleet
                </span>
              </div>

              {/* Male Bathroom */}
              <div
                onClick={() => setSelectedRoomKey('male_bathroom')}
                className="rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-300 p-3 shadow-xs transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-blue-600">
                    <Sparkles className="w-3 h-3" />
                    <span>MALE BATHROOM</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Restroom (M)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="1 Occupied" />
              </div>

              {/* Female Bathroom */}
              <div
                onClick={() => setSelectedRoomKey('female_bathroom')}
                className="rounded-2xl bg-white border-2 border-slate-200 hover:border-pink-300 p-3 shadow-xs transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-pink-600">
                    <Sparkles className="w-3 h-3" />
                    <span>FEMALE BATHROOM</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Restroom (F)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="2 Occupied" />
              </div>
            </div>

            {/* Design Room (cols 3-5) */}
            <div
              className="col-span-3 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-300 p-3.5 shadow-sm transition-all flex flex-col justify-between"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div
                  onClick={() => setSelectedRoomKey('design_room')}
                  className="cursor-pointer group flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-pink-600 transition-colors">
                      DESIGN ROOM
                    </h3>
                    <span className="text-[10px] text-slate-500">UI/UX Open Floor (20 Cubicles)</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoomKey('design_room')}
                  className="text-[10px] font-bold text-pink-600 hover:underline"
                >
                  Room Details →
                </button>
              </div>

              {/* 20 Cubicles Grid (5 cols x 4 rows) */}
              <div className="grid grid-cols-5 gap-1.5 py-2">
                {designCubicles.map((cubicle) => {
                  const matches = isCubicleMatch(cubicle);
                  const pStyle = getPresenceColor(cubicle.presenceStatus);
                  return (
                    <div
                      key={cubicle.id}
                      onClick={() => setSelectedCubicle(cubicle)}
                      className={`relative aspect-square rounded-xl border p-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        matches
                          ? 'bg-slate-50 hover:bg-white hover:border-pink-500 hover:shadow-md hover:scale-105 border-slate-200'
                          : 'opacity-30 border-dashed border-slate-200'
                      }`}
                      title={`${cubicle.label}: ${cubicle.employeeName} (${cubicle.employeeRole})\nStatus: ${pStyle.label}\nTask: ${cubicle.currentTask}`}
                    >
                      <span className="text-[8px] font-mono font-bold text-slate-500 leading-none">
                        {cubicle.label}
                      </span>
                      <div className="relative mt-0.5">
                        <img
                          src={cubicle.employeeAvatar}
                          alt={cubicle.employeeName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${pStyle.dot} ring-1 ring-white`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                <span>Row 1-4 Workstations</span>
                <span className="text-pink-600 font-bold">16 Occupied</span>
              </div>
            </div>

            {/* Central Divider: Meeting Rooms (cols 6-7) */}
            <div className="col-span-2 flex flex-col gap-2">
              {/* Meeting Room 1 */}
              <div
                onClick={() => setSelectedRoomKey('meeting_room_1')}
                className="flex-1 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-blue-600">
                    <Video className="w-3.5 h-3.5" />
                    <span>MEETING ROOM 1</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                    16p
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600">
                    Executive Board Room
                  </h4>
                  <p className="text-[10px] text-slate-500">4K video wall & AI summary</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Session (8 inside)
                </span>
              </div>

              {/* Meeting Room 2 */}
              <div
                onClick={() => setSelectedRoomKey('meeting_room_2')}
                className="flex-1 rounded-2xl bg-white border-2 border-cyan-200 hover:border-cyan-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-cyan-600">
                    <Users className="w-3.5 h-3.5" />
                    <span>MEETING ROOM 2</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[9px] font-bold">
                    8p
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-cyan-600">
                    Team Meeting Room
                  </h4>
                  <p className="text-[10px] text-slate-500">Sprint standup & retro</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">5 inside</span>
              </div>

              {/* Meeting Room 3 */}
              <div
                onClick={() => setSelectedRoomKey('meeting_room_3')}
                className="flex-1 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-emerald-600">
                    <Video className="w-3.5 h-3.5" />
                    <span>MEETING ROOM 3</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    4p
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600">
                    Small Meeting Room
                  </h4>
                  <p className="text-[10px] text-slate-500">1-on-1 huddle pod</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">2 inside</span>
              </div>
            </div>

            {/* Tech Room (cols 8-10) */}
            <div
              className="col-span-3 rounded-2xl bg-white border-2 border-cyan-200 hover:border-cyan-300 p-3.5 shadow-sm transition-all flex flex-col justify-between"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div
                  onClick={() => setSelectedRoomKey('tech_room')}
                  className="cursor-pointer group flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                      TECH ROOM
                    </h3>
                    <span className="text-[10px] text-slate-500">Engineering Floor (20 Cubicles)</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoomKey('tech_room')}
                  className="text-[10px] font-bold text-cyan-600 hover:underline"
                >
                  Room Details →
                </button>
              </div>

              {/* 20 Cubicles Grid (5 cols x 4 rows) */}
              <div className="grid grid-cols-5 gap-1.5 py-2">
                {techCubicles.map((cubicle) => {
                  const matches = isCubicleMatch(cubicle);
                  const pStyle = getPresenceColor(cubicle.presenceStatus);
                  return (
                    <div
                      key={cubicle.id}
                      onClick={() => setSelectedCubicle(cubicle)}
                      className={`relative aspect-square rounded-xl border p-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        matches
                          ? 'bg-slate-50 hover:bg-white hover:border-cyan-500 hover:shadow-md hover:scale-105 border-slate-200'
                          : 'opacity-30 border-dashed border-slate-200'
                      }`}
                      title={`${cubicle.label}: ${cubicle.employeeName} (${cubicle.employeeRole})\nStatus: ${pStyle.label}\nTask: ${cubicle.currentTask}`}
                    >
                      <span className="text-[8px] font-mono font-bold text-slate-500 leading-none">
                        {cubicle.label}
                      </span>
                      <div className="relative mt-0.5">
                        <img
                          src={cubicle.employeeAvatar}
                          alt={cubicle.employeeName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${pStyle.dot} ring-1 ring-white`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                <span>Row 1-4 Workstations</span>
                <span className="text-cyan-600 font-bold">18 Occupied</span>
              </div>
            </div>

            {/* Right Column: DevOps Deployment (top), Finance (bottom) (cols 11-12) */}
            <div className="col-span-2 flex flex-col gap-3">
              {/* DevOps Deployment */}
              <div
                onClick={() => setSelectedRoomKey('devops')}
                className="flex-1 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-purple-600">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>DEVOPS ROOM</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-600 mt-0.5">
                    DevOps Deployment
                  </h4>
                  <p className="text-[10px] text-slate-500">CI/CD & Kubernetes status</p>
                </div>
                <div className="flex items-center justify-between text-[9px] pt-2 border-t border-slate-100">
                  <span className="text-emerald-600 font-bold">48 Pods Healthy</span>
                  <span className="text-purple-600 font-bold">Open →</span>
                </div>
              </div>

              {/* Finance / Account & Audit */}
              <div
                onClick={() => setSelectedRoomKey('finance')}
                className="flex-1 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-emerald-600">
                    <Coins className="w-3.5 h-3.5" />
                    <span>ACCOUNT & AUDIT</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 mt-0.5">
                    Finance Department
                  </h4>
                  <p className="text-[10px] text-slate-500">Payroll, invoices & audit</p>
                </div>
                <div className="flex items-center justify-between text-[9px] pt-2 border-t border-slate-100">
                  <span className="text-emerald-600 font-bold">Batch Approved</span>
                  <span className="text-emerald-600 font-bold">Open →</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM ROW:
              Server Room | Design Lead 1 | Design Lead 2 | Tech Lead 1 | Tech Lead 2 | HR | Manager | CEO | Chairman
          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-9 gap-2.5">
            {/* 1. Server Room */}
            <div
              onClick={() => setSelectedRoomKey('server_room')}
              className="rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-rose-600 uppercase">SERVER</span>
                <Server className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-rose-600">
                  Server Room
                </h4>
                <span className="text-[9px] text-slate-500 block">18.2°C Chilled</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded text-center">
                99.999% SLA
              </span>
            </div>

            {/* 2. Design Lead 1 */}
            <div
              onClick={() => setSelectedRoomKey('design_lead_1')}
              className="rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-purple-600 uppercase">LEAD</span>
                <Palette className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-purple-600">
                  Design Lead 1
                </h4>
                <span className="text-[9px] text-slate-500 block">Marcus Vance</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">UI/UX Tokens</span>
            </div>

            {/* 3. Design Lead 2 */}
            <div
              onClick={() => setSelectedRoomKey('design_lead_2')}
              className="rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-pink-600 uppercase">LEAD</span>
                <PenTool className="w-3.5 h-3.5 text-pink-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-pink-600">
                  Design Lead 2
                </h4>
                <span className="text-[9px] text-slate-500 block">Camila Rodriguez</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Brand & 3D</span>
            </div>

            {/* 4. Tech Lead 1 */}
            <div
              onClick={() => setSelectedRoomKey('tech_lead_1')}
              className="rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-sky-600 uppercase">LEAD</span>
                <Cpu className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-sky-600">
                  Tech Lead 1
                </h4>
                <span className="text-[9px] text-slate-500 block">Viktor Meyer</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Distributed Sys</span>
            </div>

            {/* 5. Tech Lead 2 */}
            <div
              onClick={() => setSelectedRoomKey('tech_lead_2')}
              className="rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-blue-600 uppercase">LEAD</span>
                <Code className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-blue-600">
                  Tech Lead 2
                </h4>
                <span className="text-[9px] text-slate-500 block">Priya Sharma</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Platform Web</span>
            </div>

            {/* 6. HR Department */}
            <div
              onClick={() => setSelectedRoomKey('hr')}
              className="rounded-2xl bg-white border-2 border-cyan-200 hover:border-cyan-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-cyan-600 uppercase">PEOPLE</span>
                <Users className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-cyan-600">
                  HR Department
                </h4>
                <span className="text-[9px] text-slate-500 block">David Kalu</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Recruit & Leaves</span>
            </div>

            {/* 7. Manager */}
            <div
              onClick={() => setSelectedRoomKey('manager')}
              className="rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-emerald-600 uppercase">OPS</span>
                <FolderKanban className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-emerald-600">
                  Manager Office
                </h4>
                <span className="text-[9px] text-slate-500 block">Rachel Kim</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Sprint Velocity</span>
            </div>

            {/* 8. CEO Office */}
            <div
              onClick={() => setSelectedRoomKey('ceo')}
              className="rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px] ring-2 ring-amber-400/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-amber-600 uppercase">COMMAND</span>
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400/30" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-amber-600">
                  CEO Office
                </h4>
                <span className="text-[9px] text-slate-500 block">Alexander Hayes</span>
              </div>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded text-center">
                Command Hub
              </span>
            </div>

            {/* 9. Chairman Office */}
            <div
              onClick={() => setSelectedRoomKey('chairman')}
              className="rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 p-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono font-bold text-amber-800 uppercase">BOARD</span>
                <Briefcase className="w-3.5 h-3.5 text-amber-800" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 group-hover:text-amber-800">
                  Chairman Office
                </h4>
                <span className="text-[9px] text-slate-500 block">Lord Sterling</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">Board Governance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      {selectedRoomKey && (
        <InteractiveRoomModal
          roomKey={selectedRoomKey}
          onClose={() => setSelectedRoomKey(null)}
          onSelectCubicle={(cub) => {
            setSelectedRoomKey(null);
            setSelectedCubicle(cub);
          }}
          techCubicles={techCubicles}
          designCubicles={designCubicles}
        />
      )}

      {selectedCubicle && (
        <CubicleWorkstationModal
          cubicle={selectedCubicle}
          onClose={() => setSelectedCubicle(null)}
          onUpdatePresence={handleUpdateCubicleStatus}
        />
      )}
    </div>
  );
};
