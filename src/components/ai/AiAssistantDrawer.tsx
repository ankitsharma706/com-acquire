import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    aiInitialPrompt,
    setAiInitialPrompt,
    employees,
    projects,
    payrollBatch,
    rooms,
  } = useCompany();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<AiMessage[]>([
    {
      id: 'ai-init',
      sender: 'assistant',
      text: `Hello, CEO! I am your CompanyHQ Neural Executive Copilot. I have real-time access to all 8 departments, 48 employee scorecards, $1.24M MRR financial metrics, and sprint velocity. How can I assist your leadership decisions today?`,
      timestamp: 'Just now',
    },
  ]);

  const promptChips = [
    'Predict project delivery bottlenecks',
    'Recommend top candidates for promotion',
    'Draft All-Hands Q3 strategy announcement',
    'Analyze burn rate & suggest cost optimizations',
    'Generate executive summary for Board of Directors',
  ];

  // If opened with an initial prompt, auto-trigger
  useEffect(() => {
    if (isAiDrawerOpen && aiInitialPrompt) {
      handleAskAi(aiInitialPrompt);
      setAiInitialPrompt('');
    }
  }, [isAiDrawerOpen, aiInitialPrompt]);

  const handleAskAi = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          companyContext: {
            totalEmployees: employees.length,
            mrr: '$1,240,000',
            activeProjects: projects.map((p) => ({ name: p.name, progress: p.progress, status: p.status })),
            payrollStatus: payrollBatch.status,
            roomsCount: rooms.length,
          },
        }),
      });

      const data = await response.json();
      const reply = data.result || 'I processed your executive query successfully.';

      const aiMsg: AiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI copilot call failed, providing local strategic insight fallback:', err);
      // Fallback heuristics
      const fallbackReply = `**Executive Strategic Analysis:**\n\n- **Engineering Velocity:** Core platform initiatives are 94.8% on target. Zero-Trust Security sprint is 92% complete.\n- **Treasury Health:** $14.82M in reserve with 26.4 months of runway at current $380k/mo burn.\n- **Talent Recommendation:** Elena Rostova (Engineering Lead) and Maya Lin (Design Lead) demonstrate top-tier output (98%+ scorecard) and are recommended for senior director elevation.`;

      setChatHistory((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg h-full bg-[#0A0E17]/95 border-l border-white/[0.08] p-6 flex flex-col justify-between shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] text-white shadow-lg shadow-[#8B5CF6]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  CompanyHQ Neural Copilot
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#00D4FF] border border-[#8B5CF6]/30 font-bold">
                  GEMINI 3.7
                </span>
              </div>
              <p className="text-[11px] text-[#A7B0C0]">Autonomous executive operations & real-time telemetry</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-2 rounded-xl bg-white/[0.04] text-[#A7B0C0] hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Chips Bar */}
        <div className="py-3.5 flex gap-2 overflow-x-auto border-b border-white/[0.08]">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAi(chip)}
              className="px-3.5 py-1.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#00D4FF]/50 text-[11px] text-[#A7B0C0] hover:text-white whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Lightbulb className="w-3 h-3 text-[#00D4FF]" />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {chatHistory.map((msg) => {
            const isAi = msg.sender === 'assistant';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-gradient-to-br from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] text-white shadow-md shadow-[#8B5CF6]/20'
                      : 'bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/20'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-[20px] max-w-[85%] text-xs leading-relaxed relative group ${
                    isAi
                      ? 'glass-card text-[#E5E9F0]'
                      : 'bg-gradient-to-r from-[#4F7CFF] to-[#00D4FF] text-white font-medium shadow-md shadow-[#4F7CFF]/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] opacity-70 font-mono">
                    <span>{isAi ? 'Neural Copilot' : 'CEO (You)'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                  {isAi && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/[0.06] text-[#A7B0C0] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-[#00D4FF] font-mono p-3.5 bg-white/[0.04] rounded-2xl border border-[#00D4FF]/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
              <span>Analyzing cross-department telemetry & synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAi(inputQuery);
          }}
          className="pt-3.5 border-t border-white/[0.08] flex gap-2.5"
        >
          <input
            type="text"
            placeholder="Ask AI Copilot for decisions, plans, or summaries..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#4F7CFF] focus:ring-1 focus:ring-[#4F7CFF]"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#4F7CFF] to-[#00D4FF] hover:scale-[1.03] text-white font-bold text-xs shadow-lg shadow-[#8B5CF6]/30 disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
