import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Users,
  Smile,
  Paperclip,
  Share2,
  Sparkles,
  PhoneOff,
  Radio,
  Lock,
  Hash,
  Crown,
  Volume2,
  X,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { ChatChannel, ChatMessage } from '../../types';

export const CommunicationHub: React.FC = () => {
  const {
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    sendChatMessage,
    currentUser,
    employees,
    isMeetingModalOpen,
    setIsMeetingModalOpen,
    triggerConfettiEffect,
  } = useCompany();

  const [chatInput, setChatInput] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTabLocal] = useState<'chat' | 'war_room'>('chat');

  const currentChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const currentMessages = messages[activeChannelId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendChatMessage(activeChannelId, chatInput);
    setChatInput('');
  };

  const meetingParticipants = employees.slice(0, 6);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Enterprise Communications & Video War Room
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              WEBRTC ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-channel communication, department threads, and instant All-Hands video conference rooms.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#0B0F19] border border-slate-800">
            <button
              onClick={() => setActiveTabLocal('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Channels & Chat
            </button>
            <button
              onClick={() => setActiveTabLocal('war_room')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'war_room'
                  ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#00D9FF]" />
              Metaverse War Room
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* Channels & Chat View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[640px]">
          {/* Channels Sidebar */}
          <div className="p-4 rounded-3xl bg-[#0B0F19]/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
                Team Channels
              </p>
              <div className="space-y-1">
                {channels.map((chan) => {
                  const isActive = chan.id === activeChannelId;
                  return (
                    <button
                      key={chan.id}
                      onClick={() => setActiveChannelId(chan.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#141B2D] text-[#00D9FF] border border-[#00D9FF]/30 shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {chan.isPrivate ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Hash className="w-3.5 h-3.5 text-[#4F7CFF] shrink-0" />
                        )}
                        <span className="truncate">{chan.name}</span>
                      </div>
                      {chan.unreadCount > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#00D9FF]/20 text-[#00D9FF]">
                          {chan.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTabLocal('war_room')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Launch Video War Room</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Pane */}
          <div className="md:col-span-3 rounded-3xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 flex flex-col justify-between overflow-hidden">
            {/* Channel Top Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F19]/40">
              <div className="flex items-center gap-2.5">
                <Hash className="w-5 h-5 text-[#00D9FF]" />
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">
                    {currentChannel.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">{currentChannel.topic}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {currentChannel.memberCount} Members Active
              </span>
            </div>

            {/* Message Feed */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {currentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 group">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700 shrink-0 mt-0.5"
                  />
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19]/70 border border-slate-800/80 max-w-2xl group-hover:border-[#4F7CFF]/30 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 bg-[#0B0F19]/60 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={`Message #${currentChannel.name}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
              />
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Metaverse War Room Interactive Video Conference */
        <div className="rounded-3xl bg-[#0B0F19] border border-[#4F7CFF]/30 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Live Video Boardroom (All-Hands Sync)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              <span>HD 1080p • 60 FPS • 0% Packet Loss</span>
            </div>
          </div>

          {/* Participant Video Feeds Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingParticipants.map((part, idx) => (
              <div
                key={part.id}
                className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex flex-col justify-between p-3 group shadow-lg"
              >
                {/* Simulated Video Feed Image */}
                <img
                  src={part.avatar}
                  alt={part.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top audio pulse indicator */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/10">
                    {part.departmentName}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>

                {/* Bottom Name Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white drop-shadow-md">{part.name}</p>
                    <p className="text-[10px] text-slate-300 drop-shadow-sm">{part.role}</p>
                  </div>
                  <div className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                    <Mic className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Control Bar */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-2xl border transition-all ${
                isMicMuted
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-[#141B2D] border-slate-700 text-white hover:bg-[#1C253D]'
              }`}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-2xl border transition-all ${
                isVideoOff
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-[#141B2D] border-slate-700 text-white hover:bg-[#1C253D]'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl border transition-all ${
                isScreenSharing
                  ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]'
                  : 'bg-[#141B2D] border-slate-700 text-white hover:bg-[#1C253D]'
              }`}
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTabLocal('chat')}
              className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg transition-all"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
