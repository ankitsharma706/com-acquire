import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Bot,
  Flame,
  TrendingUp,
  Download,
  Share2,
} from 'lucide-react';
import { Employee } from '../../types';

interface TranscriptEntry {
  id: string;
  speaker: string;
  role: string;
  avatar: string;
  text: string;
  time: string;
  sentiment?: 'positive' | 'neutral' | 'urgent';
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Critical';
}

interface AiMeetingCopilotProps {
  currentUser: Employee;
}

export const AiMeetingCopilot: React.FC<AiMeetingCopilotProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'transcripts' | 'minutes' | 'actions' | 'chat'>('transcripts');

  // Real-time streaming transcription log
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([
    {
      id: '1',
      speaker: 'Elena Rostova',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      text: 'Our edge multi-region caching layer achieved sub-15ms latency across 99.4% of customer requests this week.',
      time: '10:02 AM',
      sentiment: 'positive',
    },
    {
      id: '2',
      speaker: 'Alex Chen',
      role: 'Head of Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: 'We are ready to initiate the Frankfurt failover test on Friday night. Zero downtime simulated.',
      time: '10:04 AM',
      sentiment: 'neutral',
    },
    {
      id: '3',
      speaker: 'Maya Lin',
      role: 'Design Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'The glassmorphic design token system is fully harmonized. Spatial audio cues are synchronized with visual focus states.',
      time: '10:05 AM',
      sentiment: 'positive',
    },
    {
      id: '4',
      speaker: 'Marcus Vance',
      role: 'Head of Growth',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Enterprise pipeline reached 14 Fortune 500 contracts in negotiation. $3.2M pipeline ARR for Q4.',
      time: '10:07 AM',
      sentiment: 'positive',
    },
  ]);

  // AI Meeting Minutes
  const [minutes, setMinutes] = useState<string>(
    `# EXECUTIVE BOARDROOM WAR ROOM MINUTES
**Date:** September 2, 2026 • **Session:** Q3 Strategic Review & Spatial Metaverse Ops
**Chair:** CEO Office • **Attendees:** Elena Rostova (CTO), Maya Lin (Design), Alex Chen (Infra), Marcus Vance (Growth)

---

### 1. Key Executive Highlights & Telemetry
• **Global Architecture & Latency:** Edge ingress clusters operating with 99.98% availability and 14.8ms average worldwide latency.
• **Financial Runway:** ARR surged to $1.24M/month. Runway stands firm at 26.4 months post-expansion.
• **Security & SOC2:** Automated Type II monitoring passed continuous audit checkpoints without observations.

### 2. Strategic Directives
1. **EMEA Datacenter Expansion:** Commission Frankfurt secondary availability zone before Oct 15.
2. **Spatial Audio Metaverse:** Roll out binaural HRTF conference rooms to all 15 virtual departments.
3. **Enterprise Pipeline:** Finalize custom SLA contracts for 4 tier-1 accounts by end of week.`
  );

  // Live Action Items
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'a1',
      task: 'Finalize Frankfurt failover dry run with cloud ops team',
      assignee: 'Alex Chen',
      completed: false,
      priority: 'Critical',
    },
    {
      id: 'a2',
      task: 'Export Figma design tokens for spatial radar components',
      assignee: 'Maya Lin',
      completed: true,
      priority: 'Medium',
    },
    {
      id: 'a3',
      task: 'Send enterprise SLA contract drafts to Legal & Compliance',
      assignee: 'Marcus Vance',
      completed: false,
      priority: 'High',
    },
  ]);

  // In-meeting chat
  const [chatMessages, setChatMessages] = useState<
    { sender: string; avatar: string; text: string; time: string }[]
  >([
    {
      sender: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      text: 'I just pinned the architecture diagram onto the 3D whiteboard.',
      time: '10:03 AM',
    },
    {
      sender: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'The binaural acoustic studio mode sounds amazing on headphones!',
      time: '10:06 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUser.name,
        avatar: currentUser.avatar,
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="glass-card rounded-[24px] flex flex-col h-full overflow-hidden border border-white/[0.08]">
      {/* Top Header with Tab Switcher */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0A0E17]/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          {[
            { id: 'transcripts', label: 'Live Transcript', icon: Bot },
            { id: 'minutes', label: 'AI Minutes', icon: FileText },
            { id: 'actions', label: `Actions (${actionItems.filter((a) => !a.completed).length})`, icon: CheckCircle2 },
            { id: 'chat', label: `Chat (${chatMessages.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white shadow-md'
                    : 'text-[#A7B0C0] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Room Sentiment Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-mono text-[#22C55E]">
          <Flame className="w-3.5 h-3.5" />
          <span>Alignment: 98% Consensus</span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {activeTab === 'transcripts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-[#A7B0C0]">
              <span className="flex items-center gap-1.5 font-bold text-[#00D4FF]">
                <Sparkles className="w-3.5 h-3.5" />
                Continuous Spatial Speech-to-Text Mesh
              </span>
              <span className="font-mono">Live • Latency 60ms</span>
            </div>

            {transcripts.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 group hover:border-[#4F7CFF]/40 transition-all"
              >
                <img
                  src={entry.avatar}
                  alt={entry.speaker}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{entry.speaker}</span>
                      <span className="text-[10px] text-[#A7B0C0] font-mono">({entry.role})</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280]">{entry.time}</span>
                  </div>
                  <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'minutes' && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                Gemini 3.7 Strategic Synthesis
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([minutes], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `meeting-minutes-${new Date().toISOString().slice(0, 10)}.md`;
                  a.click();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-white font-medium transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Export MD</span>
              </button>
            </div>
            <textarea
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full flex-1 min-h-[300px] p-4 rounded-2xl bg-[#0A0E17]/80 border border-white/[0.08] text-xs text-[#E2E8F0] font-mono leading-relaxed focus:outline-none focus:border-[#00D4FF]/40"
            />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-[#A7B0C0] uppercase font-mono tracking-wider">
              Auto-Detected Action Directives
            </div>
            {actionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleActionItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                    : 'bg-white/[0.04] border-white/[0.08] hover:border-[#00D4FF]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-[#22C55E] border-[#22C55E] text-black'
                        : 'border-white/20 hover:border-[#00D4FF]'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        item.completed ? 'line-through text-[#6B7280]' : 'text-white'
                      }`}
                    >
                      {item.task}
                    </p>
                    <p className="text-[10px] text-[#A7B0C0] font-mono">Assignee: {item.assignee}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    item.priority === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : item.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] text-[#A7B0C0] mb-1">
                  <span className="font-bold text-white">{msg.sender}</span>
                  <span className="font-mono text-[10px]">{msg.time}</span>
                </div>
                <p className="text-xs text-[#E2E8F0]">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-Meeting Chat Input */}
      {activeTab === 'chat' && (
        <form onSubmit={handleSendChat} className="p-3 border-t border-white/[0.08] bg-[#0A0E17]/60 flex gap-2">
          <input
            type="text"
            placeholder="Send in-meeting message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#00D4FF]"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
