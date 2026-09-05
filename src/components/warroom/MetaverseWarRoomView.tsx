import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  PhoneOff,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  PenTool,
  Headphones,
  Users,
  Smile,
  Shield,
  Radio,
  X,
  Volume2,
  Hand,
  Settings,
  Grid,
  Columns,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { WarRoomCanvas3D, SeatParticipant } from './WarRoomCanvas3D';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { SpatialAudioRadar } from './SpatialAudioRadar';
import { AiMeetingCopilot } from './AiMeetingCopilot';

interface MetaverseWarRoomViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const MetaverseWarRoomView: React.FC<MetaverseWarRoomViewProps> = ({
  isModal = false,
  onClose,
}) => {
  const {
    currentUser,
    employees,
    triggerConfettiEffect,
    setIsMeetingModalOpen,
  } = useCompany();

  // Active view modes: 3D canvas, collaborative whiteboard, side-by-side split, video grid, or spatial audio
  const [viewMode, setViewMode] = useState<'3d_spatial' | 'whiteboard' | 'split' | 'grid' | 'audio'>('3d_spatial');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isScreenShare, setIsScreenShare] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState<boolean>(true);
  const [userSeatIndex, setUserSeatIndex] = useState<number>(0); // Head of table
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showRightCopilot, setShowRightCopilot] = useState<boolean>(true);

  // Initialize boardroom participants mapped from company employees
  const [participants, setParticipants] = useState<SeatParticipant[]>([]);

  useEffect(() => {
    const initialSeats: SeatParticipant[] = [
      {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        department: currentUser.departmentName,
        avatar: currentUser.avatar,
        seatIndex: userSeatIndex,
        isSpeaking: false,
        isMuted: isMuted,
        isScreenSharing: isScreenShare,
        isHandRaised: isHandRaised,
        audioLevel: 0,
        x: 0,
        z: 0,
        color: '#F5C451',
      },
      ...employees.slice(0, 6).map((emp, idx) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        department: emp.departmentName,
        avatar: emp.avatar,
        seatIndex: idx + 1,
        isSpeaking: idx === 0 || idx === 2,
        isMuted: idx === 4,
        isScreenSharing: false,
        isHandRaised: idx === 3,
        audioLevel: idx === 0 ? 0.8 : 0,
        x: 0,
        z: 0,
        color: ['#00D4FF', '#4F7CFF', '#8B5CF6', '#22C55E', '#EC4899', '#F59E0B'][idx % 6],
      })),
    ];

    setParticipants(initialSeats);
  }, [employees, currentUser, userSeatIndex, isMuted, isScreenShare, isHandRaised]);

  // Periodic simulated speaking activity
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === currentUser.id) return p;
          const willSpeak = Math.random() > 0.65;
          return {
            ...p,
            isSpeaking: willSpeak,
            audioLevel: willSpeak ? Math.random() * 0.8 + 0.2 : 0,
          };
        })
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const handleSelectSeat = (seatIndex: number) => {
    setUserSeatIndex(seatIndex);
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUser.id ? { ...p, seatIndex } : p))
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleLeaveMeeting = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      setIsMeetingModalOpen(false);
    }
  };

  const content = (
    <div className={`flex flex-col h-full bg-[#0A0E17] text-white ${isModal ? 'w-full max-w-7xl h-[92vh] rounded-[28px] border border-white/[0.08] shadow-2xl overflow-hidden' : 'min-h-[calc(100vh-6rem)]'}`}>
      {/* Top War Room Mission Bar */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0A0E17]/80 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Room Telemetry */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] text-white shadow-lg shadow-[#4F7CFF]/25">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Executive Metaverse War Room
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                REC 4K SPATIAL
              </span>
            </div>
            <p className="text-xs text-[#A7B0C0] mt-0.5">
              Floor 4 Executive Chamber • HRTF Spatial Audio Mesh • Real-Time Whiteboard
            </p>
          </div>
        </div>

        {/* Center: View Switcher (3D, Whiteboard, Split, Video, Audio) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          {[
            { id: '3d_spatial', label: '3D Metaverse', icon: Layers },
            { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
            { id: 'split', label: 'Split Studio', icon: Columns },
            { id: 'grid', label: 'Video Grid', icon: Grid },
            { id: 'audio', label: 'Spatial Radar', icon: Headphones },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white shadow-md shadow-[#4F7CFF]/20'
                    : 'text-[#A7B0C0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions & Minimize/Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRightCopilot(!showRightCopilot)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showRightCopilot
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#8B5CF6]'
                : 'bg-white/[0.04] border-white/10 text-[#A7B0C0]'
            }`}
            title="Toggle AI Copilot Drawer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#A7B0C0] hover:text-white border border-white/10"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isModal && (
            <button
              onClick={handleLeaveMeeting}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-[#A7B0C0] hover:text-rose-400 border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main War Room Body (3D Stage / Whiteboard / Grid + AI Copilot Sidebar) */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Core Canvas / Stage Area */}
        <div className={`${showRightCopilot ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} h-full flex flex-col gap-4 overflow-hidden`}>
          {viewMode === '3d_spatial' && (
            <div className="flex-1 h-full min-h-[500px]">
              <WarRoomCanvas3D
                participants={participants}
                currentUserId={currentUser.id}
                onSelectSeat={handleSelectSeat}
                spatialAudioEnabled={spatialAudioEnabled}
              />
            </div>
          )}

          {viewMode === 'whiteboard' && (
            <div className="flex-1 h-full min-h-[500px]">
              <InteractiveWhiteboard currentUserName={currentUser.name} />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[500px]">
              <div className="h-full">
                <WarRoomCanvas3D
                  participants={participants}
                  currentUserId={currentUser.id}
                  onSelectSeat={handleSelectSeat}
                  spatialAudioEnabled={spatialAudioEnabled}
                />
              </div>
              <div className="h-full">
                <InteractiveWhiteboard currentUserName={currentUser.name} />
              </div>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1">
              {participants.map((part) => (
                <div
                  key={part.id}
                  className="relative rounded-[20px] overflow-hidden bg-[#0B0F19] border border-white/[0.08] aspect-video flex flex-col justify-between p-3 group shadow-lg"
                >
                  <img
                    src={part.avatar}
                    alt={part.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                  {/* Top status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {part.department}
                    </span>
                    {part.isSpeaking && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-[#22C55E] rounded-full animate-pulse delay-100" />
                        <span className="w-1 h-2 bg-[#22C55E] rounded-full animate-pulse delay-200" />
                      </div>
                    )}
                  </div>

                  {/* Bottom name */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white drop-shadow-md">{part.name}</p>
                      <p className="text-[10px] text-[#A7B0C0] drop-shadow-sm font-mono">{part.role}</p>
                    </div>
                    <div
                      className={`p-1.5 rounded-full ${
                        part.isSpeaking ? 'bg-[#22C55E] text-black' : 'bg-black/60 text-[#A7B0C0]'
                      }`}
                    >
                      {part.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'audio' && (
            <div className="flex-1 h-full overflow-y-auto">
              <SpatialAudioRadar
                participants={participants}
                currentUserId={currentUser.id}
                spatialAudioEnabled={spatialAudioEnabled}
                onToggleSpatialAudio={() => setSpatialAudioEnabled(!spatialAudioEnabled)}
              />
            </div>
          )}
        </div>

        {/* Right Side: AI Copilot, Transcripts & Action Directive Engine */}
        {showRightCopilot && (
          <div className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
            <AiMeetingCopilot currentUser={currentUser} />
          </div>
        )}
      </div>

      {/* Bottom Meeting Controls Dock */}
      <div className="p-4 bg-[#0A0E17]/90 backdrop-blur-2xl border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-3">
        {/* Audio Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-2xl border transition-all ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#00D4FF]" />}
        </button>

        {/* Video Camera Toggle */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-3.5 rounded-2xl border transition-all ${
            isVideoOff
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]'
          }`}
          title={isVideoOff ? 'Start Video' : 'Stop Video'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-[#4F7CFF]" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={() => setIsScreenShare(!isScreenShare)}
          className={`p-3.5 rounded-2xl border transition-all ${
            isScreenShare
              ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
              : 'bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]'
          }`}
          title="Share Screen"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Raise Hand */}
        <button
          onClick={() => setIsHandRaised(!isHandRaised)}
          className={`p-3.5 rounded-2xl border transition-all ${
            isHandRaised
              ? 'bg-[#F5C451]/20 border-[#F5C451] text-[#F5C451]'
              : 'bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]'
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        {/* Applause / Confetti */}
        <button
          onClick={() => triggerConfettiEffect()}
          className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-[#F5C451] hover:bg-white/[0.08] transition-all"
          title="Executive Applause"
        >
          <Smile className="w-5 h-5" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

        {/* End Meeting Button */}
        <button
          onClick={handleLeaveMeeting}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave War Room</span>
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
        {content}
      </div>
    );
  }

  return content;
};
