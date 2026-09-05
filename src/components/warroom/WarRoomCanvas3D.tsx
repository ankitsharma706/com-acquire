import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Maximize2,
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  Volume2,
  Sparkles,
  User,
  Radio,
  Layers,
} from 'lucide-react';
import { Employee } from '../../types';

export interface SeatParticipant {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  seatIndex: number;
  isSpeaking: boolean;
  isMuted: boolean;
  isScreenSharing?: boolean;
  isHandRaised?: boolean;
  audioLevel: number; // 0 to 1
  x: number; // 3D local offset
  z: number;
  color: string;
}

interface WarRoomCanvas3DProps {
  participants: SeatParticipant[];
  currentUserId: string;
  onSelectSeat: (seatIndex: number) => void;
  onSelectParticipant?: (participant: SeatParticipant) => void;
  activePresentation?: 'whiteboard' | 'hologram' | 'telemetry' | 'screen';
  spatialAudioEnabled?: boolean;
}

export const WarRoomCanvas3D: React.FC<WarRoomCanvas3DProps> = ({
  participants,
  currentUserId,
  onSelectSeat,
  onSelectParticipant,
  activePresentation = 'hologram',
  spatialAudioEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera 3D controls state
  const [cameraPreset, setCameraPreset] = useState<'ceo' | 'orbit' | 'topdown' | 'whiteboard'>('orbit');
  const [yaw, setYaw] = useState<number>(0.3); // Horizontal rotation in radians
  const [pitch, setPitch] = useState<number>(0.45); // Vertical angle in radians
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Total seats around boardroom table
  const TOTAL_SEATS = 10;

  // Preset camera handlers
  const handleSetPreset = (preset: 'ceo' | 'orbit' | 'topdown' | 'whiteboard') => {
    setCameraPreset(preset);
    setAutoRotate(false);
    if (preset === 'ceo') {
      setYaw(0);
      setPitch(0.35);
      setZoom(1.15);
    } else if (preset === 'orbit') {
      setYaw(0.4);
      setPitch(0.5);
      setZoom(1.0);
      setAutoRotate(true);
    } else if (preset === 'topdown') {
      setYaw(0);
      setPitch(1.2);
      setZoom(0.85);
    } else if (preset === 'whiteboard') {
      setYaw(-0.75);
      setPitch(0.28);
      setZoom(1.25);
    }
  };

  // Resize canvas according to container dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 0.02;

      // Auto rotation in orbit mode if not dragging
      if (autoRotate && !isDragging) {
        setYaw((prev) => (prev + 0.002) % (Math.PI * 2));
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background ambient metaverse space
      const isLightMode = !document.documentElement.classList.contains('dark');
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        width * 0.75
      );
      if (isLightMode) {
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.5, '#FAF9F6');
        bgGrad.addColorStop(1, '#EEF2F6');
      } else {
        bgGrad.addColorStop(0, '#101726');
        bgGrad.addColorStop(0.5, '#0B0F19');
        bgGrad.addColorStop(1, '#05070D');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3D Perspective Projection Mathematics
      const cx = width / 2;
      const cy = height / 2 + 30 * zoom;
      const fov = 450 * zoom;

      // Helper: 3D point projection (X: right, Y: up, Z: deep)
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis (yaw)
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis (pitch)
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP + 600; // Camera distance offset

        // Perspective division
        const scale = fov / Math.max(z2, 100);
        return {
          x: cx + x1 * scale,
          y: cy - y2 * scale,
          z: z2,
          scale,
        };
      };

      // 1. Draw 3D Isometric Holographic Floor Grid
      const gridSize = 400;
      const gridSteps = 8;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 124, 255, 0.12)';

      for (let i = -gridSteps; i <= gridSteps; i++) {
        const p1 = project((i * gridSize) / gridSteps, -60, -gridSize);
        const p2 = project((i * gridSize) / gridSteps, -60, gridSize);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(-gridSize, -60, (i * gridSize) / gridSteps);
        const p4 = project(gridSize, -60, (i * gridSize) / gridSteps);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // 2. Draw Floor Energy Rings
      for (let r = 80; r <= 320; r += 80) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 - (r / 320) * 0.1})`;
        ctx.lineWidth = 1.5;
        const ringSegments = 32;
        for (let s = 0; s <= ringSegments; s++) {
          const theta = (s / ringSegments) * Math.PI * 2;
          const px = Math.cos(theta) * r;
          const pz = Math.sin(theta) * r;
          const pt = project(px, -60, pz);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // 3. Draw Boardroom Holographic Oval Table
      const tableRadiusX = 220;
      const tableRadiusZ = 130;
      const tableHeight = 0;
      const tableThickness = 12;

      // Table shadow / under-glow
      const underGlowPt = project(0, -58, 0);
      const underGlowGrad = ctx.createRadialGradient(
        underGlowPt.x,
        underGlowPt.y,
        10,
        underGlowPt.x,
        underGlowPt.y,
        180 * underGlowPt.scale
      );
      underGlowGrad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
      underGlowGrad.addColorStop(0.6, 'rgba(79, 124, 255, 0.08)');
      underGlowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = underGlowGrad;
      ctx.beginPath();
      ctx.arc(underGlowPt.x, underGlowPt.y, 180 * underGlowPt.scale, 0, Math.PI * 2);
      ctx.fill();

      // Table Glass Surface Poly (Top & Bevel)
      const tableSegments = 36;
      const topPts: { x: number; y: number; z: number }[] = [];
      const botPts: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i <= tableSegments; i++) {
        const theta = (i / tableSegments) * Math.PI * 2;
        const tx = Math.cos(theta) * tableRadiusX;
        const tz = Math.sin(theta) * tableRadiusZ;
        topPts.push(project(tx, tableHeight, tz));
        botPts.push(project(tx, tableHeight - tableThickness, tz));
      }

      // Draw Table Sides (Bevel)
      ctx.fillStyle = 'rgba(20, 27, 45, 0.85)';
      ctx.strokeStyle = 'rgba(79, 124, 255, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < tableSegments; i++) {
        ctx.beginPath();
        ctx.moveTo(topPts[i].x, topPts[i].y);
        ctx.lineTo(topPts[i + 1].x, topPts[i + 1].y);
        ctx.lineTo(botPts[i + 1].x, botPts[i + 1].y);
        ctx.lineTo(botPts[i].x, botPts[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw Table Top Surface
      ctx.beginPath();
      topPts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      const topGrad = ctx.createLinearGradient(
        topPts[0].x,
        topPts[0].y,
        topPts[tableSegments / 2].x,
        topPts[tableSegments / 2].y
      );
      topGrad.addColorStop(0, 'rgba(20, 27, 45, 0.95)');
      topGrad.addColorStop(0.5, 'rgba(26, 37, 65, 0.85)');
      topGrad.addColorStop(1, 'rgba(16, 23, 38, 0.95)');
      ctx.fillStyle = topGrad;
      ctx.fill();

      // Table Edge Neon Glow
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)';
      ctx.stroke();

      // Inner table telemetry circuit ring
      ctx.beginPath();
      for (let i = 0; i <= tableSegments; i++) {
        const theta = (i / tableSegments) * Math.PI * 2;
        const tx = Math.cos(theta) * (tableRadiusX * 0.75);
        const tz = Math.sin(theta) * (tableRadiusZ * 0.75);
        const p = project(tx, tableHeight + 1, tz);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(79, 124, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Center Presentation: Holographic Globe / Whiteboard Preview
      const centerPt = project(0, 40, 0);

      if (activePresentation === 'hologram' || activePresentation === 'telemetry') {
        // Holographic Beam Emitter
        const emitterBase = project(0, 2, 0);
        ctx.beginPath();
        ctx.ellipse(
          emitterBase.x,
          emitterBase.y,
          35 * emitterBase.scale,
          15 * emitterBase.scale,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
        ctx.fill();

        // Holographic Light Cone
        ctx.beginPath();
        const topCone = project(0, 110, 0);
        ctx.moveTo(emitterBase.x - 30 * emitterBase.scale, emitterBase.y);
        ctx.lineTo(topCone.x - 55 * topCone.scale, topCone.y);
        ctx.lineTo(topCone.x + 55 * topCone.scale, topCone.y);
        ctx.lineTo(emitterBase.x + 30 * emitterBase.scale, emitterBase.y);
        ctx.closePath();
        const coneGrad = ctx.createLinearGradient(
          emitterBase.x,
          emitterBase.y,
          topCone.x,
          topCone.y
        );
        coneGrad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
        coneGrad.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
        ctx.fillStyle = coneGrad;
        ctx.fill();

        // Rotating Holographic Cyber Sphere / Earth
        const sphereRadius = 38;
        const sphereLatLines = 6;
        const sphereLongLines = 8;
        ctx.lineWidth = 1.2;

        for (let lat = 1; lat < sphereLatLines; lat++) {
          const latAngle = ((lat - sphereLatLines / 2) / sphereLatLines) * Math.PI;
          const rLat = sphereRadius * Math.cos(latAngle);
          const yLat = 55 + sphereRadius * Math.sin(latAngle);

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
          const ringPts = 24;
          for (let p = 0; p <= ringPts; p++) {
            const theta = (p / ringPts) * Math.PI * 2 + tick;
            const sx = Math.cos(theta) * rLat;
            const sz = Math.sin(theta) * rLat;
            const pt = project(sx, yLat, sz);
            if (p === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Longitudinal rings
        for (let long = 0; long < sphereLongLines; long++) {
          const longAngle = (long / sphereLongLines) * Math.PI + tick;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(79, 124, 255, 0.45)';
          const ringPts = 24;
          for (let p = 0; p <= ringPts; p++) {
            const theta = (p / ringPts) * Math.PI * 2;
            const sx = sphereRadius * Math.sin(theta) * Math.cos(longAngle);
            const sz = sphereRadius * Math.sin(theta) * Math.sin(longAngle);
            const sy = 55 + sphereRadius * Math.cos(theta);
            const pt = project(sx, sy, sz);
            if (p === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Holographic floating text tag
        const tagPt = project(0, 115, 0);
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00D4FF';
        ctx.fillText('GLOBAL METRICS • 99.98% UPTIME', tagPt.x, tagPt.y);

        ctx.font = '9px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#A7B0C0';
        ctx.fillText('ARR: $1.24M/mo • Latency: 12ms', tagPt.x, tagPt.y + 13);
      } else {
        // Whiteboard / Screen Share Holographic Display Screen floating above table
        const screenPt = project(0, 65, -30);
        const sW = 160 * screenPt.scale;
        const sH = 95 * screenPt.scale;

        // Screen bezel
        ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
        ctx.strokeStyle = '#4F7CFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(screenPt.x - sW / 2, screenPt.y - sH / 2, sW, sH, 8);
        ctx.fill();
        ctx.stroke();

        // Screen content preview
        ctx.fillStyle = '#00D4FF';
        ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LIVE COLLABORATIVE WHITEBOARD', screenPt.x, screenPt.y - 15);

        ctx.fillStyle = '#A7B0C0';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('System Architecture & Q4 Roadmap', screenPt.x, screenPt.y + 2);
        ctx.fillText('• 4 Live Pointers • Spatial Sync On', screenPt.x, screenPt.y + 16);
      }

      // 5. Draw Seats & Avatars with Depth Sorting (Z-buffer)
      const seatPositions: {
        seatIndex: number;
        x: number;
        z: number;
        pt: { x: number; y: number; z: number; scale: number };
        participant?: SeatParticipant;
      }[] = [];

      for (let s = 0; s < TOTAL_SEATS; s++) {
        const theta = (s / TOTAL_SEATS) * Math.PI * 2 - Math.PI / 2;
        const seatDistX = tableRadiusX + 55;
        const seatDistZ = tableRadiusZ + 45;
        const sx = Math.cos(theta) * seatDistX;
        const sz = Math.sin(theta) * seatDistZ;
        const pt = project(sx, 0, sz);

        const occupant = participants.find((p) => p.seatIndex === s);
        seatPositions.push({
          seatIndex: s,
          x: sx,
          z: sz,
          pt,
          participant: occupant,
        });
      }

      // Sort seats from back to front (largest z first)
      seatPositions.sort((a, b) => b.pt.z - a.pt.z);

      // Render each seat & avatar
      seatPositions.forEach(({ seatIndex, pt, participant }) => {
        const isHovered = hoveredSeat === seatIndex;
        const isCurrent = participant && participant.id === currentUserId;
        const radius = 18 * pt.scale;

        // Seat Pod / Base on Floor
        const floorPt = project(
          (seatIndex === 0 ? 0 : Math.cos((seatIndex / TOTAL_SEATS) * Math.PI * 2 - Math.PI / 2) * (tableRadiusX + 55)),
          -55,
          (seatIndex === 0 ? -(tableRadiusZ + 45) : Math.sin((seatIndex / TOTAL_SEATS) * Math.PI * 2 - Math.PI / 2) * (tableRadiusZ + 45))
        );

        ctx.beginPath();
        ctx.ellipse(
          floorPt.x,
          floorPt.y,
          22 * floorPt.scale,
          10 * floorPt.scale,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = isHovered ? 'rgba(0, 212, 255, 0.3)' : 'rgba(20, 27, 45, 0.6)';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#00D4FF' : 'rgba(79, 124, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pod stem / vertical support line
        ctx.beginPath();
        ctx.moveTo(floorPt.x, floorPt.y);
        ctx.lineTo(pt.x, pt.y + radius);
        ctx.strokeStyle = 'rgba(79, 124, 255, 0.4)';
        ctx.lineWidth = 2 * pt.scale;
        ctx.stroke();

        if (participant) {
          // ACTIVE OCCUPANT AVATAR

          // Spatial Audio Speaking Waves
          if (participant.isSpeaking) {
            const waveCount = 3;
            for (let w = 1; w <= waveCount; w++) {
              const waveRadius = radius + (w * 10 + (tick * 25) % 25) * pt.scale;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, waveRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(34, 197, 94, ${0.7 - (w * 0.2)})`;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }

          // Avatar Sphere / Glowing Base Ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius + 3 * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = isCurrent
            ? '#F5C451'
            : participant.isSpeaking
            ? '#22C55E'
            : '#4F7CFF';
          ctx.fill();

          // Avatar Image or Monogram circle
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#141B2D';
          ctx.fill();
          ctx.save();
          ctx.clip();

          // Draw initials or fallback avatar
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${Math.max(10, 13 * pt.scale)}px Plus Jakarta Sans, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = participant.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          ctx.fillText(initials, pt.x, pt.y);
          ctx.restore();

          // Status Badge on Avatar (Mic / Mute / Hand)
          const badgePt = {
            x: pt.x + radius * 0.75,
            y: pt.y - radius * 0.75,
          };
          ctx.beginPath();
          ctx.arc(badgePt.x, badgePt.y, 6 * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = participant.isHandRaised
            ? '#F5C451'
            : participant.isMuted
            ? '#EF4444'
            : '#22C55E';
          ctx.fill();
          ctx.strokeStyle = '#0B0F19';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Floating 3D Name Tag Pill
          const tagY = pt.y - radius - 14 * pt.scale;
          const nameText = isCurrent ? `${participant.name} (You)` : participant.name;
          ctx.font = `bold ${Math.max(9, 11 * pt.scale)}px Plus Jakarta Sans, sans-serif`;
          const textMetrics = ctx.measureText(nameText);
          const tagW = textMetrics.width + 16 * pt.scale;
          const tagH = 16 * pt.scale;

          ctx.fillStyle = isCurrent
            ? 'rgba(245, 196, 81, 0.95)'
            : isLightMode
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(11, 15, 25, 0.85)';
          ctx.strokeStyle = isCurrent
            ? '#FFE28A'
            : isLightMode
            ? 'rgba(37, 99, 235, 0.35)'
            : 'rgba(79, 124, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(pt.x - tagW / 2, tagY - tagH / 2, tagW, tagH, 6 * pt.scale);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isCurrent ? '#000000' : isLightMode ? '#0F172A' : '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(nameText, pt.x, tagY);

          // Department label below avatar
          ctx.font = `${Math.max(8, 9 * pt.scale)}px JetBrains Mono, monospace`;
          ctx.fillStyle = '#A7B0C0';
          ctx.fillText(participant.role, pt.x, pt.y + radius + 11 * pt.scale);
        } else {
          // EMPTY AVAILABLE SEAT
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(0, 212, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)';
          ctx.strokeStyle = isHovered ? '#00D4FF' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.setLineDash([4, 4]);
          ctx.fill();
          ctx.stroke();
          ctx.setLineDash([]);

          // Plus Icon
          ctx.fillStyle = isHovered ? '#00D4FF' : '#6B7280';
          ctx.font = `bold ${Math.max(10, 12 * pt.scale)}px Plus Jakarta Sans, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`+ S${seatIndex + 1}`, pt.x, pt.y);

          if (isHovered) {
            ctx.font = `9px JetBrains Mono, monospace`;
            ctx.fillStyle = '#00D4FF';
            ctx.fillText('Click to sit here', pt.x, pt.y + radius + 10);
          }
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [yaw, pitch, zoom, participants, currentUserId, hoveredSeat, activePresentation, autoRotate, isDragging]);

  // Mouse interaction for 3D Orbit & Seat Click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setYaw((prev) => prev + deltaX * 0.008);
      setPitch((prev) => Math.max(0.15, Math.min(1.35, prev + deltaY * 0.008)));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      // Raycasting / Hit testing for hovering over seats
      const dpr = window.devicePixelRatio || 1;
      const cx = rect.width / 2;
      const cy = rect.height / 2 + 30 * zoom;
      const fov = 450 * zoom;

      let foundSeat: number | null = null;
      for (let s = 0; s < TOTAL_SEATS; s++) {
        const theta = (s / TOTAL_SEATS) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(theta) * 275;
        const sz = Math.sin(theta) * 175;

        // 3D projection
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = sx * cosY - sz * sinY;
        const z1 = sx * sinY + sz * cosY;

        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = 0 * cosP - z1 * sinP;
        const z2 = 0 * sinP + z1 * cosP + 600;

        const scale = fov / Math.max(z2, 100);
        const px = cx + x1 * scale;
        const py = cy - y2 * scale;

        const dist = Math.hypot(mouseX - px, mouseY - py);
        if (dist < 28 * scale) {
          foundSeat = s;
          break;
        }
      }
      setHoveredSeat(foundSeat);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredSeat !== null) {
      const occupant = participants.find((p) => p.seatIndex === hoveredSeat);
      if (occupant) {
        onSelectParticipant?.(occupant);
      } else {
        onSelectSeat(hoveredSeat);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.65, Math.min(1.8, prev - e.deltaY * 0.001)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] rounded-[24px] overflow-hidden bg-[#0A0E17] border border-white/[0.08] select-none shadow-2xl"
    >
      {/* 3D Canvas Element */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Left 3D Camera Controls Toolbar */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
        <div className="flex items-center p-1 rounded-2xl bg-[#0A0E17]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg">
          {[
            { id: 'ceo', label: '👑 CEO Table Head' },
            { id: 'orbit', label: '🪐 3D Orbit' },
            { id: 'topdown', label: '📐 Spatial Grid' },
            { id: 'whiteboard', label: '🖊️ Board Focus' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSetPreset(preset.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cameraPreset === preset.id
                  ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white shadow-md'
                  : 'text-[#A7B0C0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-2xl border backdrop-blur-xl transition-all ${
            autoRotate
              ? 'bg-[#00D4FF]/20 border-[#00D4FF]/40 text-[#00D4FF]'
              : 'bg-[#0A0E17]/80 border-white/[0.08] text-[#A7B0C0] hover:text-white'
          }`}
          title="Toggle 3D Auto-Orbit"
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Top Right HUD: Spatial Audio & Real-Time Stats */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0A0E17]/80 backdrop-blur-xl border border-white/[0.08] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[#00D4FF] font-bold">SPATIAL 3D ENGINE</span>
          <span className="text-[#6B7280]">|</span>
          <span className="text-white">{participants.length} Active Avatars</span>
        </div>
      </div>

      {/* Bottom Zoom & Help Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-[#0A0E17]/80 backdrop-blur-xl border border-white/[0.08] text-xs text-[#A7B0C0]">
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.max(0.65, z - 0.15))}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-[#0A0E17]/80 backdrop-blur-xl border border-white/[0.08] text-[11px] text-[#A7B0C0]">
          💡 <span className="text-white font-medium">Click any empty seat</span> to reposition your 3D avatar & binaural audio point
        </div>
      </div>
    </div>
  );
};
