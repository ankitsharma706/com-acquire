import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Type,
  StickyNote,
  Sparkles,
  Download,
  Trash2,
  Undo2,
  Redo2,
  MousePointer,
  Layers,
  Palette,
  Check,
  Zap,
} from 'lucide-react';

type ToolType = 'pen' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'arrow' | 'text' | 'sticky' | 'laser';

interface WhiteboardElement {
  id: string;
  type: ToolType;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  author: string;
  timestamp: number;
}

interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  tool: string;
}

interface InteractiveWhiteboardProps {
  currentUserName: string;
}

export const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({ currentUserName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [activeColor, setActiveColor] = useState<string>('#00D4FF');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [history, setHistory] = useState<WhiteboardElement[][]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [laserPoint, setLaserPoint] = useState<{ x: number; y: number } | null>(null);

  // Simulated live collaborative remote cursors
  const [collaboratorCursors, setCollaboratorCursors] = useState<CollaboratorCursor[]>([
    { id: '1', name: 'Elena Rostova (CTO)', color: '#8B5CF6', x: 240, y: 180, tool: 'pen' },
    { id: '2', name: 'Maya Lin (Design)', color: '#EC4899', x: 520, y: 310, tool: 'sticky' },
    { id: '3', name: 'Alex Chen (Infra)', color: '#00D4FF', x: 380, y: 420, tool: 'rect' },
  ]);

  // Pre-load strategic architectural diagram
  const loadTemplate = (templateName: 'architecture' | 'swot' | 'roadmap') => {
    let newElems: WhiteboardElement[] = [];

    if (templateName === 'architecture') {
      newElems = [
        // Title
        {
          id: 't1',
          type: 'text',
          x: 40,
          y: 50,
          text: '⚡ COMPANY GLOBAL MICROSERVICE ARCHITECTURE',
          color: '#00D4FF',
          strokeWidth: 2,
          author: 'System Architecture',
          timestamp: Date.now(),
        },
        // Edge Cloud Gateway
        {
          id: 'r1',
          type: 'rect',
          x: 40,
          y: 90,
          width: 180,
          height: 90,
          color: '#4F7CFF',
          strokeWidth: 2.5,
          author: 'Alex Chen',
          timestamp: Date.now(),
        },
        {
          id: 't2',
          type: 'text',
          x: 55,
          y: 135,
          text: 'Edge NGINX Proxy\n• Multi-Region Ingress\n• DDoS Mitigation',
          color: '#FFFFFF',
          strokeWidth: 1,
          author: 'Alex Chen',
          timestamp: Date.now(),
        },
        // Arrow 1
        {
          id: 'a1',
          type: 'arrow',
          points: [{ x: 220, y: 135 }, { x: 300, y: 135 }],
          color: '#00D4FF',
          strokeWidth: 2.5,
          author: 'Alex Chen',
          timestamp: Date.now(),
        },
        // Core Microservices Cluster
        {
          id: 'r2',
          type: 'rect',
          x: 300,
          y: 90,
          width: 220,
          height: 140,
          color: '#8B5CF6',
          strokeWidth: 2.5,
          author: 'Elena Rostova',
          timestamp: Date.now(),
        },
        {
          id: 't3',
          type: 'text',
          x: 315,
          y: 130,
          text: 'Core Business Services\n• Auth & RBAC (JWT)\n• Real-Time Spatial Engine\n• Gemini 3.7 AI Copilot',
          color: '#FFFFFF',
          strokeWidth: 1,
          author: 'Elena Rostova',
          timestamp: Date.now(),
        },
        // Arrow 2
        {
          id: 'a2',
          type: 'arrow',
          points: [{ x: 520, y: 160 }, { x: 600, y: 160 }],
          color: '#22C55E',
          strokeWidth: 2.5,
          author: 'Elena Rostova',
          timestamp: Date.now(),
        },
        // Database & Cache Tier
        {
          id: 'r3',
          type: 'rect',
          x: 600,
          y: 90,
          width: 200,
          height: 140,
          color: '#22C55E',
          strokeWidth: 2.5,
          author: 'Elena Rostova',
          timestamp: Date.now(),
        },
        {
          id: 't4',
          type: 'text',
          x: 615,
          y: 130,
          text: 'Data & Cache Layer\n• Redis Mesh (4ms)\n• Cloud Firestore / SQL\n• Kafka Telemetry Pipe',
          color: '#FFFFFF',
          strokeWidth: 1,
          author: 'Elena Rostova',
          timestamp: Date.now(),
        },
        // Sticky Notes
        {
          id: 's1',
          type: 'sticky',
          x: 60,
          y: 280,
          width: 180,
          height: 120,
          text: '🚀 Sprint Priority:\nDeploy European geo-replicated node to cut London p99 latency under 20ms.',
          color: '#F5C451',
          strokeWidth: 1,
          author: currentUserName,
          timestamp: Date.now(),
        },
        {
          id: 's2',
          type: 'sticky',
          x: 320,
          y: 280,
          width: 190,
          height: 120,
          text: '🔒 Security Sign-Off:\nAll 48 endpoints verified with SOC2 Type II automated compliance monitoring.',
          color: '#EC4899',
          strokeWidth: 1,
          author: 'Maya Lin',
          timestamp: Date.now(),
        },
      ];
    } else if (templateName === 'swot') {
      newElems = [
        {
          id: 'swot_title',
          type: 'text',
          x: 40,
          y: 40,
          text: '🎯 EXECUTIVE STRATEGIC SWOT MATRIX • 2026',
          color: '#F5C451',
          strokeWidth: 2,
          author: currentUserName,
          timestamp: Date.now(),
        },
        {
          id: 's_box',
          type: 'sticky',
          x: 40,
          y: 80,
          width: 260,
          height: 160,
          text: '💪 STRENGTHS\n• 84.2% Gross Margin\n• Zero Churn in Enterprise Tier\n• Integrated AI Copilot Telemetry',
          color: '#22C55E',
          strokeWidth: 1,
          author: 'CEO',
          timestamp: Date.now(),
        },
        {
          id: 'w_box',
          type: 'sticky',
          x: 320,
          y: 80,
          width: 260,
          height: 160,
          text: '⚠️ WEAKNESSES\n• Onboarding velocity needs automation\n• Mobile web spatial app optimization\n• Hiring latency for ML leads',
          color: '#F59E0B',
          strokeWidth: 1,
          author: 'HR Lead',
          timestamp: Date.now(),
        },
        {
          id: 'o_box',
          type: 'sticky',
          x: 40,
          y: 260,
          width: 260,
          height: 160,
          text: '🌟 OPPORTUNITIES\n• EMEA & APAC Datacenter Expansion\n• AI Executive Voice Autonomous Agents\n• Fortune 500 White-Label Metaverse',
          color: '#00D4FF',
          strokeWidth: 1,
          author: 'Growth Lead',
          timestamp: Date.now(),
        },
        {
          id: 't_box',
          type: 'sticky',
          x: 320,
          y: 260,
          width: 260,
          height: 160,
          text: '🛡️ THREATS & RISKS\n• Cloud compute cost inflation\n• Competitor LLM pricing wars\n• Currency FX fluctuation',
          color: '#EF4444',
          strokeWidth: 1,
          author: 'Finance Director',
          timestamp: Date.now(),
        },
      ];
    } else {
      newElems = [
        {
          id: 'r_title',
          type: 'text',
          x: 40,
          y: 40,
          text: '📅 Q4 PRODUCT SPRINT EXECUTION ROADMAP',
          color: '#00D4FF',
          strokeWidth: 2,
          author: 'Product Lead',
          timestamp: Date.now(),
        },
        {
          id: 'col1',
          type: 'rect',
          x: 40,
          y: 80,
          width: 200,
          height: 320,
          color: '#3B82F6',
          strokeWidth: 2,
          author: 'Sprint Manager',
          timestamp: Date.now(),
        },
        {
          id: 'col2',
          type: 'rect',
          x: 260,
          y: 80,
          width: 200,
          height: 320,
          color: '#F59E0B',
          strokeWidth: 2,
          author: 'Sprint Manager',
          timestamp: Date.now(),
        },
        {
          id: 'col3',
          type: 'rect',
          x: 480,
          y: 80,
          width: 200,
          height: 320,
          color: '#22C55E',
          strokeWidth: 2,
          author: 'Sprint Manager',
          timestamp: Date.now(),
        },
      ];
    }

    setHistory((prev) => [...prev, elements]);
    setElements(newElems);
  };

  // Preload initial architecture template on mount
  useEffect(() => {
    loadTemplate('architecture');
  }, []);

  // Resize canvas according to container
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

  // Simulate remote collaborator cursor movements
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaboratorCursors((prev) =>
        prev.map((c) => ({
          ...c,
          x: Math.max(60, Math.min(760, c.x + (Math.random() - 0.5) * 35)),
          y: Math.max(60, Math.min(420, c.y + (Math.random() - 0.5) * 25)),
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Boardroom Whiteboard Grid Background
    const isLightMode = !document.documentElement.classList.contains('dark');
    ctx.fillStyle = isLightMode ? '#FFFFFF' : '#0B0F19';
    ctx.fillRect(0, 0, width, height);

    // Dotted grid pattern
    ctx.fillStyle = isLightMode ? 'rgba(148, 163, 184, 0.25)' : 'rgba(79, 124, 255, 0.15)';
    const dotSpacing = 24;
    for (let x = 12; x < width; x += dotSpacing) {
      for (let y = 12; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render all whiteboard elements
    elements.forEach((elem) => {
      const strokeColor = (isLightMode && (elem.color === '#FFFFFF' || elem.color === '#ffffff'))
        ? '#0F172A'
        : elem.color;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = elem.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (elem.type === 'pen' && elem.points && elem.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(elem.points[0].x, elem.points[0].y);
        for (let i = 1; i < elem.points.length; i++) {
          ctx.lineTo(elem.points[i].x, elem.points[i].y);
        }
        ctx.stroke();
      } else if (elem.type === 'highlighter' && elem.points && elem.points.length > 1) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = elem.strokeWidth * 3.5;
        ctx.beginPath();
        ctx.moveTo(elem.points[0].x, elem.points[0].y);
        for (let i = 1; i < elem.points.length; i++) {
          ctx.lineTo(elem.points[i].x, elem.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (elem.type === 'rect' && elem.x !== undefined && elem.y !== undefined) {
        ctx.beginPath();
        ctx.roundRect(elem.x, elem.y, elem.width || 100, elem.height || 60, 8);
        ctx.stroke();
        ctx.fillStyle = `${elem.color}15`;
        ctx.fill();
      } else if (elem.type === 'circle' && elem.x !== undefined && elem.y !== undefined) {
        ctx.beginPath();
        const r = (elem.width || 80) / 2;
        ctx.arc(elem.x + r, elem.y + r, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `${elem.color}15`;
        ctx.fill();
      } else if (elem.type === 'arrow' && elem.points && elem.points.length === 2) {
        const [p1, p2] = elem.points;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const headLen = 10;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(
          p2.x - headLen * Math.cos(angle - Math.PI / 6),
          p2.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          p2.x - headLen * Math.cos(angle + Math.PI / 6),
          p2.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      } else if (elem.type === 'sticky' && elem.x !== undefined && elem.y !== undefined) {
        const w = elem.width || 180;
        const h = elem.height || 110;

        // Shadow & Sticky note paper
        ctx.fillStyle = elem.color;
        ctx.beginPath();
        ctx.roundRect(elem.x, elem.y, w, h, 12);
        ctx.fill();

        // Pin icon on top
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(elem.x + w / 2, elem.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Author tag
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillText(`@${elem.author}`, elem.x + 12, elem.y + 22);

        // Sticky text
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
        const lines = (elem.text || '').split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, elem.x! + 12, elem.y! + 40 + idx * 16);
        });
      } else if (elem.type === 'text' && elem.x !== undefined && elem.y !== undefined) {
        ctx.fillStyle = (isLightMode && (elem.color === '#FFFFFF' || elem.color === '#ffffff'))
          ? '#0F172A'
          : elem.color;
        ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
        const lines = (elem.text || '').split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, elem.x!, elem.y! + idx * 18);
        });
      }
    });

    // Render In-Progress Active Drawing Line
    if (isDrawing && currentPoints.length > 1) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (activeTool === 'highlighter') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = strokeWidth * 3.5;
      }

      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();

      if (activeTool === 'highlighter') {
        ctx.restore();
      }
    }

    // Laser pointer glowing dot
    if (laserPoint) {
      ctx.beginPath();
      ctx.arc(laserPoint.x, laserPoint.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(laserPoint.x, laserPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
    }

    // Render Remote Collaborator Cursors
    collaboratorCursors.forEach((c) => {
      // Cursor pointer shape
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x + 12, c.y + 12);
      ctx.lineTo(c.x + 4, c.y + 14);
      ctx.lineTo(c.x, c.y + 18);
      ctx.closePath();
      ctx.fill();

      // Name badge
      ctx.fillStyle = c.color;
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      const tw = ctx.measureText(c.name).width;
      ctx.beginPath();
      ctx.roundRect(c.x + 14, c.y + 12, tw + 12, 18, 6);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(c.name, c.x + 20, c.y + 25);
    });

    ctx.restore();
  }, [elements, isDrawing, currentPoints, laserPoint, collaboratorCursors, activeColor, strokeWidth, activeTool]);

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (activeTool === 'laser') {
      setLaserPoint({ x, y });
    } else if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      setCurrentPoints([{ x, y }]);
    } else if (activeTool === 'sticky') {
      const stickyText = prompt('Enter text for sticky note:', '💡 New Strategic Initiative');
      if (stickyText) {
        const newElem: WhiteboardElement = {
          id: `sticky_${Date.now()}`,
          type: 'sticky',
          x,
          y,
          width: 180,
          height: 100,
          text: stickyText,
          color: activeColor,
          strokeWidth: 1,
          author: currentUserName,
          timestamp: Date.now(),
        };
        setHistory((prev) => [...prev, elements]);
        setElements((prev) => [...prev, newElem]);
      }
      setIsDrawing(false);
    } else if (activeTool === 'text') {
      const textVal = prompt('Enter text label:', 'System Module');
      if (textVal) {
        const newElem: WhiteboardElement = {
          id: `text_${Date.now()}`,
          type: 'text',
          x,
          y,
          text: textVal,
          color: activeColor,
          strokeWidth: 2,
          author: currentUserName,
          timestamp: Date.now(),
        };
        setHistory((prev) => [...prev, elements]);
        setElements((prev) => [...prev, newElem]);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'laser') {
      setLaserPoint({ x, y });
    }

    if (!isDrawing) return;

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      setCurrentPoints((prev) => [...prev, { x, y }]);
    } else if (activeTool === 'eraser') {
      // Erase elements close to cursor
      setElements((prev) =>
        prev.filter((elem) => {
          if (elem.x !== undefined && elem.y !== undefined) {
            const d = Math.hypot(elem.x - x, elem.y - y);
            return d > 35;
          }
          if (elem.points) {
            const hasClosePoint = elem.points.some((p) => Math.hypot(p.x - x, p.y - y) < 25);
            return !hasClosePoint;
          }
          return true;
        })
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas || !startPoint) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      if (currentPoints.length > 1) {
        const newElem: WhiteboardElement = {
          id: `line_${Date.now()}`,
          type: activeTool,
          points: currentPoints,
          color: activeColor,
          strokeWidth,
          author: currentUserName,
          timestamp: Date.now(),
        };
        setHistory((prev) => [...prev, elements]);
        setElements((prev) => [...prev, newElem]);
      }
    } else if (activeTool === 'rect') {
      const newElem: WhiteboardElement = {
        id: `rect_${Date.now()}`,
        type: 'rect',
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x) || 80,
        height: Math.abs(y - startPoint.y) || 50,
        color: activeColor,
        strokeWidth,
        author: currentUserName,
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev, elements]);
      setElements((prev) => [...prev, newElem]);
    } else if (activeTool === 'circle') {
      const radius = Math.hypot(x - startPoint.x, y - startPoint.y);
      const newElem: WhiteboardElement = {
        id: `circle_${Date.now()}`,
        type: 'circle',
        x: startPoint.x - radius,
        y: startPoint.y - radius,
        width: radius * 2 || 80,
        height: radius * 2 || 80,
        color: activeColor,
        strokeWidth,
        author: currentUserName,
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev, elements]);
      setElements((prev) => [...prev, newElem]);
    } else if (activeTool === 'arrow') {
      const newElem: WhiteboardElement = {
        id: `arrow_${Date.now()}`,
        type: 'arrow',
        points: [startPoint, { x, y }],
        color: activeColor,
        strokeWidth,
        author: currentUserName,
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev, elements]);
      setElements((prev) => [...prev, newElem]);
    }

    setCurrentPoints([]);
    setStartPoint(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, elements]);
    setElements(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, elements]);
    setElements(next);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (elements.length === 0) return;
    setHistory((prev) => [...prev, elements]);
    setElements([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `metaverse-whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] rounded-[24px] overflow-hidden bg-[#0A0E17] border border-white/[0.08] flex flex-col justify-between shadow-2xl"
    >
      {/* Top Whiteboard Floating Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Drawing Tools Group */}
        <div className="pointer-events-auto flex items-center p-1.5 rounded-2xl bg-[#0A0E17]/90 backdrop-blur-2xl border border-white/[0.08] shadow-xl gap-1">
          {[
            { id: 'pen', label: 'Pen', icon: PenTool },
            { id: 'highlighter', label: 'Highlighter', icon: Highlighter },
            { id: 'rect', label: 'Box', icon: Square },
            { id: 'circle', label: 'Circle', icon: Circle },
            { id: 'arrow', label: 'Arrow', icon: ArrowRight },
            { id: 'sticky', label: 'Sticky', icon: StickyNote },
            { id: 'text', label: 'Text', icon: Type },
            { id: 'laser', label: 'Laser', icon: MousePointer },
            { id: 'eraser', label: 'Eraser', icon: Eraser },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as ToolType)}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white shadow-md'
                    : 'text-[#A7B0C0] hover:text-white hover:bg-white/[0.06]'
                }`}
                title={t.label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Color & Template Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Color Palette */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#0A0E17]/90 backdrop-blur-2xl border border-white/[0.08] shadow-xl gap-1.5">
            {[
              '#00D4FF',
              '#4F7CFF',
              '#8B5CF6',
              '#22C55E',
              '#F5C451',
              '#EF4444',
              '#FFFFFF',
            ].map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(c)}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                  activeColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              >
                {activeColor === c && <Check className="w-3 h-3 text-black stroke-[3]" />}
              </button>
            ))}
          </div>

          {/* Preset Templates */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#0A0E17]/90 backdrop-blur-2xl border border-white/[0.08] shadow-xl gap-1">
            <button
              onClick={() => loadTemplate('architecture')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#A7B0C0] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              🏛️ Architecture
            </button>
            <button
              onClick={() => loadTemplate('swot')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#A7B0C0] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              📊 SWOT
            </button>
            <button
              onClick={() => loadTemplate('roadmap')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#A7B0C0] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              🚀 Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full flex-1 cursor-crosshair block"
      />

      {/* Bottom Floating Whiteboard History & Export Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0A0E17]/90 backdrop-blur-2xl border border-white/[0.08] shadow-xl text-xs">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-[#A7B0C0] hover:text-white disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-[#A7B0C0] hover:text-white disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#A7B0C0] hover:text-red-400"
            title="Clear Whiteboard"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Live Collaborators Status & Export PNG */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#0A0E17]/90 backdrop-blur-2xl border border-white/[0.08] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#00D4FF] font-bold">4 Live Collaborators</span>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] hover:opacity-95 text-xs font-bold text-white shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
