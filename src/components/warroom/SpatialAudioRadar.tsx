import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Sparkles,
  Headphones,
  Mic,
  Shield,
  Zap,
  Activity,
} from 'lucide-react';
import { SeatParticipant } from './WarRoomCanvas3D';

interface SpatialAudioRadarProps {
  participants: SeatParticipant[];
  currentUserId: string;
  spatialAudioEnabled: boolean;
  onToggleSpatialAudio: () => void;
}

export const SpatialAudioRadar: React.FC<SpatialAudioRadarProps> = ({
  participants,
  currentUserId,
  spatialAudioEnabled,
  onToggleSpatialAudio,
}) => {
  const [acousticProfile, setAcousticProfile] = useState<
    'dampened_boardroom' | 'hologram_chamber' | 'spatial_studio'
  >('spatial_studio');
  const [distanceDecay, setDistanceDecay] = useState<number>(75); // 0 - 100%
  const [noiseSuppression, setNoiseSuppression] = useState<boolean>(true);
  const [testPlaying, setTestPlaying] = useState<boolean>(false);
  const [individualVolumes, setIndividualVolumes] = useState<Record<string, number>>({});

  const currentUserParticipant = participants.find((p) => p.id === currentUserId) || participants[0];

  // Web Audio Context reference for synthetic spatial sound test
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleTestSpatialTone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setTestPlaying(true);

      // Create synthetic spatial ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      if (panner) {
        // Pan left to right
        panner.pan.setValueAtTime(-0.8, ctx.currentTime);
        panner.pan.linearRampToValueAtTime(0.8, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.65);

      setTimeout(() => setTestPlaying(false), 700);
    } catch (err) {
      console.warn('Web Audio Spatial API unavailable in this context:', err);
      setTestPlaying(false);
    }
  };

  const handleSetVolume = (id: string, vol: number) => {
    setIndividualVolumes((prev) => ({ ...prev, [id]: vol }));
  };

  return (
    <div className="glass-card p-6 rounded-[24px] space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] text-white shadow-lg shadow-[#8B5CF6]/25">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                Binaural 3D Spatial Audio Engine
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 font-bold">
                HRTF POSITIONAL
              </span>
            </div>
            <p className="text-xs text-[#A7B0C0] mt-0.5">
              Simulates physical seat coordinates with distance attenuation and head-related transfer function.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSpatialAudio}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
            spatialAudioEnabled
              ? 'bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] shadow-sm'
              : 'bg-white/[0.04] border border-white/10 text-[#A7B0C0] hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{spatialAudioEnabled ? 'Spatial Audio Active' : 'Stereo Audio Mode'}</span>
        </button>
      </div>

      {/* Spatial Radar Visualization & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: 2D Spatial Sound Field Radar */}
        <div className="relative aspect-square max-w-[280px] mx-auto w-full rounded-full bg-[#0A0E17] border border-white/[0.08] flex items-center justify-center shadow-inner overflow-hidden">
          {/* Radar scan grid rings */}
          <div className="absolute inset-4 rounded-full border border-[#4F7CFF]/15" />
          <div className="absolute inset-14 rounded-full border border-[#00D4FF]/20" />
          <div className="absolute inset-24 rounded-full border border-[#8B5CF6]/25" />

          {/* Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.06]" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.06]" />

          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[#00D4FF]/5 to-transparent animate-spin" style={{ animationDuration: '6s' }} />

          {/* User's Head Position (Center) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F5C451] to-[#FFE28A] flex items-center justify-center text-black font-extrabold text-[10px] shadow-lg shadow-[#F5C451]/30 ring-4 ring-[#F5C451]/20">
              YOU
            </div>
            <span className="text-[9px] font-mono text-[#F5C451] font-bold mt-1">LISTENER</span>
          </div>

          {/* Surrounding Avatars on Soundfield */}
          {participants.map((p, idx) => {
            if (p.id === currentUserId) return null;
            const angle = (p.seatIndex / 10) * Math.PI * 2 - Math.PI / 2;
            const radius = 95; // px from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={p.id}
                className="absolute flex flex-col items-center transition-all duration-500"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md relative ${
                    p.isSpeaking
                      ? 'bg-[#22C55E] ring-4 ring-[#22C55E]/30 animate-pulse'
                      : 'bg-[#4F7CFF]'
                  }`}
                >
                  {p.name[0]}
                  {p.isSpeaking && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22C55E]" />
                  )}
                </div>
                <span className="text-[8px] font-mono text-[#A7B0C0] max-w-[50px] truncate text-center mt-0.5">
                  {p.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Acoustic Chamber & Distance Parameters */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#A7B0C0] uppercase tracking-wider block mb-2 font-mono">
              Virtual Room Acoustic Simulation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'spatial_studio', label: 'Surround Studio', desc: 'Crisp 3D binaural' },
                { id: 'dampened_boardroom', label: 'Executive Suite', desc: 'Zero echo' },
                { id: 'hologram_chamber', label: 'Holo-Chamber', desc: 'Spacious reverb' },
              ].map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setAcousticProfile(prof.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    acousticProfile === prof.id
                      ? 'bg-gradient-to-br from-[#4F7CFF]/20 to-[#00D4FF]/15 border-[#00D4FF]/40 text-white shadow-md'
                      : 'bg-white/[0.03] border-white/[0.08] text-[#A7B0C0] hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{prof.label}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">{prof.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Distance Attenuation Slider */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="flex items-center justify-between text-xs text-[#A7B0C0] mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00D4FF]" />
                Spatial Distance Falloff:
              </span>
              <span className="font-mono text-[#00D4FF] font-bold">{distanceDecay}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={distanceDecay}
              onChange={(e) => setDistanceDecay(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
            />
            <p className="text-[10px] text-[#6B7280] mt-1.5">
              Participants sitting further away around the oval table will naturally sound quieter in your headphones.
            </p>
          </div>

          {/* Test Audio Spatial Ping Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestSpatialTone}
              disabled={testPlaying}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] hover:opacity-95 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{testPlaying ? 'Simulating 3D Ping...' : 'Test 3D Spatial Audio Ping'}</span>
            </button>

            <button
              onClick={() => setNoiseSuppression(!noiseSuppression)}
              className={`p-2.5 rounded-2xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
                noiseSuppression
                  ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                  : 'bg-white/[0.03] border-white/[0.08] text-[#A7B0C0]'
              }`}
              title="AI Neural Noise Suppression"
            >
              <Shield className="w-4 h-4" />
              <span>AI De-Noise {noiseSuppression ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Participant Audio Mixers */}
      <div className="pt-4 border-t border-white/[0.08]">
        <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2 font-mono uppercase tracking-wider">
          <Volume2 className="w-4 h-4 text-[#00D4FF]" />
          Individual Participant Audio Gains & Panning
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {participants.map((p) => {
            const vol = individualVolumes[p.id] ?? 100;
            const isUser = p.id === currentUserId;
            return (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#4F7CFF] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {p.name} {isUser && '(You)'}
                    </p>
                    <p className="text-[10px] text-[#A7B0C0] font-mono">Seat {p.seatIndex + 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={vol}
                    onChange={(e) => handleSetVolume(p.id, Number(e.target.value))}
                    disabled={isUser}
                    className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
                  />
                  <span className="text-[10px] font-mono text-[#00D4FF] w-7 text-right">
                    {vol}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
