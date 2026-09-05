import React, { useState } from 'react';
import {
  X,
  Users,
  Video,
  CheckCircle2,
  AlertTriangle,
  Server,
  DollarSign,
  Briefcase,
  Layers,
  Crown,
  Sparkles,
  Terminal,
  Cpu,
  Package,
  DoorOpen,
  Coffee,
  Utensils,
  Footprints,
  Shield,
  FileText,
  Clock,
  Send,
  Play,
  RotateCcw,
  Check,
  Plus,
  Radio,
  Share2,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Heart,
  TrendingUp,
  FolderKanban,
  UserCheck,
  Maximize2,
} from 'lucide-react';
import { FloorPlanRoomKey, WorkstationCubicle } from '../../types';
import { FLOOR_PLAN_ROOMS_META } from '../../data/floorPlanData';
import { useCompany } from '../../context/CompanyContext';

interface InteractiveRoomModalProps {
  roomKey: FloorPlanRoomKey;
  onClose: () => void;
  onSelectCubicle?: (cubicle: WorkstationCubicle) => void;
  techCubicles?: WorkstationCubicle[];
  designCubicles?: WorkstationCubicle[];
}

export const InteractiveRoomModal: React.FC<InteractiveRoomModalProps> = ({
  roomKey,
  onClose,
  onSelectCubicle,
  techCubicles = [],
  designCubicles = [],
}) => {
  const room = FLOOR_PLAN_ROOMS_META[roomKey];
  const {
    employees,
    projects,
    candidates,
    payrollBatch,
    leaveRequests,
    policies,
    approveLeaveRequest,
    rejectLeaveRequest,
    approvePayrollBatch,
    broadcastAnnouncement,
    triggerConfettiEffect,
    setIsMeetingModalOpen,
  } = useCompany();

  // Local interactive tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Meeting room conference states
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState(
    '• Daily standup sync on floor plan release\n• Review high-contrast color standards\n• Discuss CI/CD canary deployment metrics'
  );
  const [aiSummaryGenerated, setAiSummaryGenerated] = useState(false);

  // Cafeteria Kudos
  const [kudosInput, setKudosInput] = useState('');
  const [kudosList, setKudosList] = useState([
    { id: 'k1', sender: 'Alexander Hayes', recipient: 'Elena Rostova', text: 'Incredible speed resolving the WebRTC mesh latency!' },
    { id: 'k2', sender: 'Marcus Vance', recipient: 'Camila Rodriguez', text: 'The new 3D spatial room lighting is gorgeous.' },
    { id: 'k3', sender: 'David Kalu', recipient: 'Rachel Kim', text: 'Thank you for streamlining the team onboarding flow!' },
  ]);

  // Server Room Emergency Failover test
  const [failoverRunning, setFailoverRunning] = useState(false);
  const [failoverSuccess, setFailoverSuccess] = useState(false);

  // DevOps Rollback
  const [rollbackDone, setRollbackDone] = useState(false);

  // Store room requisition
  const [equipmentRequestSuccess, setEquipmentRequestSuccess] = useState<string | null>(null);

  // Main Gate visitor log
  const [gateBadgeFeedback, setGateBadgeFeedback] = useState<string | null>(null);

  // Announcements
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  if (!room) return null;

  const handlePostKudos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kudosInput.trim()) return;
    setKudosList((prev) => [
      { id: `k-${Date.now()}`, sender: 'You', recipient: 'Entire HQ Team', text: kudosInput.trim() },
      ...prev,
    ]);
    setKudosInput('');
    triggerConfettiEffect();
  };

  const handleRunFailover = () => {
    setFailoverRunning(true);
    setTimeout(() => {
      setFailoverRunning(false);
      setFailoverSuccess(true);
      setTimeout(() => setFailoverSuccess(false), 4000);
    }, 2000);
  };

  const handleTriggerRollback = () => {
    setRollbackDone(true);
    setTimeout(() => setRollbackDone(false), 3500);
  };

  const handleRequestHardware = (itemName: string) => {
    setEquipmentRequestSuccess(`Requisition submitted for ${itemName}. IT asset ticket dispatched!`);
    setTimeout(() => setEquipmentRequestSuccess(null), 3500);
  };

  const handleScanBadge = () => {
    setGateBadgeFeedback('✅ Biometric badge verified: Access granted to Floor 1 & 2.');
    setTimeout(() => setGateBadgeFeedback(null), 3000);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    broadcastAnnouncement({
      title: 'Broadcast from Executive Suite',
      content: announcementText.trim(),
      departmentId: 'all',
      isUrgent: true,
    });
    setAnnouncementSent(true);
    setAnnouncementText('');
    triggerConfettiEffect();
    setTimeout(() => setAnnouncementSent(false), 3000);
  };

  const isMeetingRoom =
    roomKey === 'meeting_room_1' || roomKey === 'meeting_room_2' || roomKey === 'meeting_room_3';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Room Modal Header */}
        <div
          className="p-6 border-b border-slate-200 flex items-center justify-between relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${room.color}15, #FFFFFF)`,
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
              style={{ backgroundColor: room.color }}
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase border border-slate-200">
                  {room.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Capacity: {room.currentOccupants} / {room.capacity}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{room.title}</h2>
              <p className="text-xs text-slate-600 font-medium">{room.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMeetingRoom && (
              <button
                onClick={() => setInCall(!inCall)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inCall
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{inCall ? 'Leave Call' : 'Join Video Call'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs for Rooms with Sub-tools */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
            }`}
          >
            Room Overview & Telemetry
          </button>

          {isMeetingRoom && (
            <>
              <button
                onClick={() => setActiveTab('conference')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'conference' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
                }`}
              >
                Virtual Conference Room
              </button>
              <button
                onClick={() => setActiveTab('ai_summary')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'ai_summary' ? 'bg-white text-purple-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
                }`}
              >
                AI Meeting Summary & Notes
              </button>
            </>
          )}

          {roomKey === 'tech_room' && (
            <button
              onClick={() => setActiveTab('cubicles')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'cubicles' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Developer Cubicles ({techCubicles.length})
            </button>
          )}

          {roomKey === 'design_room' && (
            <button
              onClick={() => setActiveTab('cubicles')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'cubicles' ? 'bg-white text-pink-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Designer Cubicles ({designCubicles.length})
            </button>
          )}

          {roomKey === 'hr' && (
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'leaves' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Leave Requests & Approvals ({leaveRequests.filter((l) => l.status === 'Pending').length})
            </button>
          )}

          {roomKey === 'finance' && (
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'payroll' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Payroll Processing & Treasury
            </button>
          )}

          {roomKey === 'devops' && (
            <button
              onClick={() => setActiveTab('deployments')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'deployments' ? 'bg-white text-purple-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Kubernetes & CI/CD Telemetry
            </button>
          )}

          {roomKey === 'server_room' && (
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'telemetry' ? 'bg-white text-rose-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Rack Sensors & Emergency Failover
            </button>
          )}

          {roomKey === 'cafeteria' && (
            <button
              onClick={() => setActiveTab('kudos')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'kudos' ? 'bg-white text-amber-600 shadow-sm border border-slate-200' : 'hover:bg-slate-100'
              }`}
            >
              Peer Recognition & Kudos Wall
            </button>
          )}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-180px)] space-y-6 text-slate-700 text-sm">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Room Description & Highlights */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-sm text-slate-800 leading-relaxed">{room.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {room.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Room Lead Details */}
              {room.leadName && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                      {room.leadName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Assigned Room Supervisor
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{room.leadName}</p>
                      <p className="text-xs text-slate-500">{room.leadRole}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    🟢 Active On Duty
                  </span>
                </div>
              )}

              {/* Specific Room Custom Features */}
              {/* 1. CEO Office */}
              {roomKey === 'ceo' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    CEO Executive Command Center Controls
                  </h3>

                  <form onSubmit={handleSendAnnouncement} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">
                      Broadcast Urgent Announcement to Entire Virtual HQ:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. All-Hands briefing at 03:00 PM in Executive Boardroom..."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Broadcast
                      </button>
                    </div>
                    {announcementSent && (
                      <p className="text-xs font-bold text-emerald-600 animate-in fade-in">
                        ✅ Announcement dispatched to all departments and digital corridor screens!
                      </p>
                    )}
                  </form>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Staff</span>
                      <span className="text-lg font-black text-slate-900">{employees.length} Members</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Projects</span>
                      <span className="text-lg font-black text-blue-600">{projects.length} Active</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Payroll Status</span>
                      <span className="text-lg font-black text-emerald-600">{payrollBatch.status}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">SLA Uptime</span>
                      <span className="text-lg font-black text-purple-600">99.999%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Main Gate */}
              {roomKey === 'main_gate' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <DoorOpen className="w-4 h-4 text-blue-600" />
                      Biometric Security Checkpoint
                    </h3>
                    <button
                      onClick={handleScanBadge}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      Simulate RFID Badge Tap
                    </button>
                  </div>
                  {gateBadgeFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                      {gateBadgeFeedback}
                    </div>
                  )}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between">
                      <span>Visitor #1042: Series B Partner</span>
                      <span className="text-emerald-600 font-bold">Badge Issued (09:15 AM)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between">
                      <span>Alexander Hayes (CEO)</span>
                      <span className="text-blue-600 font-bold">Turnstile #1 Check-in (08:30 AM)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between">
                      <span>Hardware Delivery Van</span>
                      <span className="text-slate-500 font-bold">Loading Dock Pass #89</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Store Room */}
              {roomKey === 'store_room' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-slate-600" />
                    Available Hardware Fleet Inventory
                  </h3>
                  {equipmentRequestSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                      {equipmentRequestSuccess}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { item: 'MacBook Pro 16" (M3 Max, 64GB)', qty: 6, tag: 'High-Demand' },
                      { item: 'Apple Studio Display 27" 5K Retina', qty: 12, tag: 'Available' },
                      { item: 'Herman Miller Embody Ergonomic Chair', qty: 4, tag: 'Reserved' },
                      { item: 'CalDigit TS4 Thunderbolt 4 Docks', qty: 18, tag: 'Available' },
                    ].map((hw) => (
                      <div
                        key={hw.item}
                        className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{hw.item}</p>
                          <span className="text-[10px] text-slate-500">In Stock: {hw.qty} units</span>
                        </div>
                        <button
                          onClick={() => handleRequestHardware(hw.item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800"
                        >
                          Request
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Lounge Duo */}
              {roomKey === 'lounge_duo' && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                  <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-purple-600" />
                    Personal & Duo Scenic Focus Pods
                  </h3>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    Designed for solo deep-work sessions or duo peer discussions overlooking the skyline. Acoustic sound damping dampens exterior hallway noise to 22 dB.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                      <span className="font-bold text-slate-900 block">Pod A (Window Solo)</span>
                      <span className="text-[11px] text-emerald-600 font-medium">Occupied by Zoe Morales</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                      <span className="font-bold text-slate-900 block">Pod B (Duo Bench)</span>
                      <span className="text-[11px] text-blue-600 font-medium">Free for 1-on-1 Coffee Chat</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIRTUAL CONFERENCE ROOM TAB */}
          {activeTab === 'conference' && isMeetingRoom && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex flex-col justify-between p-4 text-white">
                {/* Top Video Header */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold font-mono tracking-wider">
                      {room.title.toUpperCase()} • ENCRYPTED WEBRTC MESH
                    </span>
                  </div>
                  {isRecording && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono text-[10px] font-bold">
                      REC 00:14:28
                    </span>
                  )}
                </div>

                {/* Simulated Grid of Attendees */}
                <div className="grid grid-cols-3 gap-3 my-auto">
                  {[
                    { name: 'Alexander Hayes (CEO)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', speaking: true },
                    { name: 'Elena Rostova (Dev Lead)', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', speaking: false },
                    { name: 'Marcus Vance (Design Lead)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', speaking: false },
                  ].map((user) => (
                    <div
                      key={user.name}
                      className={`relative aspect-video rounded-xl overflow-hidden bg-slate-800 border flex items-center justify-center ${
                        user.speaking ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-slate-700'
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Conference Control Bar */}
                <div className="flex items-center justify-center gap-3 z-10">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-full transition-colors ${
                      isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2.5 rounded-full transition-colors ${
                      !isVideoOn ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-2.5 rounded-full transition-colors ${
                      isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isRecording ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isRecording ? 'Stop REC' : 'Record Call'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI MEETING SUMMARY TAB */}
          {activeTab === 'ai_summary' && isMeetingRoom && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Autonomous AI Meeting Summarizer (Gemini Engine)
                  </span>
                  <button
                    onClick={() => setAiSummaryGenerated(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                  >
                    Generate Real-time AI Summary
                  </button>
                </div>

                {aiSummaryGenerated && (
                  <div className="p-4 rounded-xl bg-white border border-purple-200 text-xs space-y-2 animate-in fade-in">
                    <p className="font-bold text-slate-900">Key Meeting Decisions:</p>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      <li>Approved deployment of the architectural floor plan map with interactive cubicle stations.</li>
                      <li>Ensured high-contrast readability across milky white light mode and dark enterprise modes.</li>
                      <li>Scheduled automated payroll release for Friday 05:00 PM upon CEO approval.</li>
                    </ul>
                    <p className="text-[10px] text-purple-600 font-mono mt-2">
                      ⚡ Action items automatically synced to Jira and Slack channel #exec-briefings.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Collaborative Meeting Notes
                </label>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  rows={6}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* CUBICLES TAB FOR TECH OR DESIGN ROOM */}
          {activeTab === 'cubicles' && (roomKey === 'tech_room' || roomKey === 'design_room') && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Showing all 20 assigned employee workstations. Click any cubicle to view individual performance, assigned tasks, and reporting hierarchy.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {(roomKey === 'tech_room' ? techCubicles : designCubicles).map((cub) => (
                  <div
                    key={cub.id}
                    onClick={() => onSelectCubicle && onSelectCubicle(cub)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer text-center group"
                  >
                    <div className="relative w-10 h-10 mx-auto mb-2">
                      <img
                        src={cub.employeeAvatar}
                        alt={cub.employeeName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                          cub.presenceStatus === 'working'
                            ? 'bg-emerald-500'
                            : cub.presenceStatus === 'meeting'
                            ? 'bg-blue-500'
                            : cub.presenceStatus === 'break'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-600 block mb-1">
                      {cub.label}
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                      {cub.employeeName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{cub.employeeRole}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HR LEAVES TAB */}
          {activeTab === 'leaves' && roomKey === 'hr' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Employee Leave Approvals
              </h3>
              <div className="space-y-2">
                {leaveRequests.map((lr) => (
                  <div
                    key={lr.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{lr.employeeName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {lr.leaveType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {lr.startDate} to {lr.endDate} ({lr.daysCount} days) • Reason: {lr.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {lr.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => approveLeaveRequest(lr.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLeaveRequest(lr.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            lr.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {lr.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FINANCE PAYROLL TAB */}
          {activeTab === 'payroll' && roomKey === 'finance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    Current Active Batch ({payrollBatch.month} {payrollBatch.year})
                  </span>
                  <p className="text-xl font-black text-emerald-900 mt-0.5">
                    ${payrollBatch.totalNet.toLocaleString()} Total Net Disbursement
                  </p>
                  <p className="text-xs text-emerald-700">
                    Gross: ${payrollBatch.totalGross.toLocaleString()} • Tax Deductions: $
                    {payrollBatch.totalDeductions.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    approvePayrollBatch();
                    triggerConfettiEffect();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Authorize & Release Payroll
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payroll Ledger Sample
                </h4>
                {payrollBatch.records.slice(0, 5).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{rec.employeeName}</span>
                      <span className="text-slate-500 ml-2">({rec.employeeRole})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-slate-900">
                        ${rec.netPay.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEVOPS TAB */}
          {activeTab === 'deployments' && roomKey === 'devops' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                    Kubernetes Cluster: prod-us-central-01
                  </span>
                  <p className="text-base font-bold mt-0.5">Release v4.2.0 • 48 Pods Healthy (Zero CrashLoop)</p>
                </div>
                <button
                  onClick={handleTriggerRollback}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Trigger Instant Rollback
                </button>
              </div>

              {rollbackDone && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 animate-in fade-in">
                  ⚠️ Rollback requested: Traffic safely drained from canary to v4.1.9 stable image.
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">CI/CD Pipeline</span>
                  <span className="text-sm font-black text-emerald-600">Passing (98.4%)</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Average Latency</span>
                  <span className="text-sm font-black text-blue-600">18.4 ms (p99)</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Security Alerts</span>
                  <span className="text-sm font-black text-slate-900">0 Critical</span>
                </div>
              </div>
            </div>
          )}

          {/* SERVER ROOM TAB */}
          {activeTab === 'telemetry' && roomKey === 'server_room' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">
                    Rack Environmental Telemetry
                  </span>
                  <p className="text-lg font-black text-rose-900 mt-0.5">18.2°C Chilled Chiller Air</p>
                  <p className="text-xs text-rose-700">Fan Speed: 4,200 RPM • Humidity: 42% Nominal</p>
                </div>

                <button
                  onClick={handleRunFailover}
                  disabled={failoverRunning}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {failoverRunning ? 'Simulating Fault...' : 'Simulate Failover Test'}
                </button>
              </div>

              {failoverSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in">
                  ✅ Secondary Redis node seamlessly promoted to leader in 12ms. Zero client disconnects!
                </div>
              )}
            </div>
          )}

          {/* CAFETERIA KUDOS TAB */}
          {activeTab === 'kudos' && roomKey === 'cafeteria' && (
            <div className="space-y-4">
              <form onSubmit={handlePostKudos} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <label className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                  Give Peer Recognition / Social Kudos:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Shoutout to Marcus for the new design system tokens! 🎉"
                    value={kudosInput}
                    onChange={(e) => setKudosInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                  >
                    Post Kudos
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Watercooler Recognition Board
                </h4>
                {kudosList.map((k) => (
                  <div
                    key={k.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold text-xs">
                      {k.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{k.sender}</span>
                        <span className="text-[10px] text-slate-400">→</span>
                        <span className="font-semibold text-amber-700 text-xs">{k.recipient}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{k.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Room Code: <span className="font-bold text-slate-900">{room.key.toUpperCase()}</span> • Level 1
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
          >
            Close Room View
          </button>
        </div>
      </div>
    </div>
  );
};
