import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Target,
  Sparkles,
  Star,
  CheckCircle,
  Users,
  ChevronRight,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { PerformanceScorecard } from '../../types';
import { INITIAL_SCORECARDS } from '../../data/initialData';
import { RecognitionBadgePill } from '../common/RecognitionBadgePill';

export const PerformanceTracker: React.FC = () => {
  const {
    employees,
    rooms,
    currentRole,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
    triggerConfettiEffect,
    isAiAuditingBadges,
    runAiBadgeRecognitionAudit,
  } = useCompany();

  const [scorecards] = useState<PerformanceScorecard[]>(INITIAL_SCORECARDS);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const okrs = [
    { title: 'Global 99.999% Platform Uptime', progress: 99.9, target: '100%', dept: 'Engineering', status: 'On Track' },
    { title: 'Enterprise ARR Expansion to $15M', progress: 88, target: '$15.0M', dept: 'Sales & Growth', status: 'Ahead' },
    { title: 'Design System 3.0 Component Mesh', progress: 94, target: '100%', dept: 'Design Studio', status: 'On Track' },
    { title: 'SOC2 Type II Audit Certification', progress: 92, target: '100%', dept: 'Security & Ops', status: 'Review' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Employee Performance & OKR Tracking
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
              REAL-TIME SCORECARDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate individual productivity, task completion velocity, team contributions, and AI promotion readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              await runAiBadgeRecognitionAudit();
            }}
            disabled={isAiAuditingBadges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAiAuditingBadges ? 'Auditing Telemetry...' : 'Award AI Badges'}</span>
          </button>

          <button
            onClick={() => {
              setAiInitialPrompt(
                'Analyze all department scorecards and recommend top candidates for promotion and equity adjustments.'
              );
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Promotion Insights</span>
          </button>
        </div>
      </div>

      {/* OKR Velocity Section */}
      <div className="glass-panel p-6 rounded-3xl border border-[#4F7CFF]/20 bg-gradient-to-br from-[#141B2D] to-[#101726]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#00D9FF]" />
            Company-Wide Strategic OKRs (Q3-Q4)
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">93.4% Avg Goal Completion</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {okrs.map((okr, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{okr.dept}</span>
                <span className="text-emerald-400 font-bold">{okr.status}</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1.5 leading-snug">{okr.title}</h4>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Progress</span>
                  <span className="text-white font-bold">{okr.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF]"
                    style={{ width: `${Math.min(100, okr.progress)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Performance Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scorecards.map((card) => {
          const emp = employees.find((e) => e.id === card.employeeId);
          if (!emp) return null;

          return (
            <div
              key={card.employeeId}
              className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15 hover:border-[#00D9FF]/40 bg-[#141B2D]/80 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-[#00D9FF] transition-all"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-[#00D9FF] transition-colors leading-tight">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400">{emp.role}</p>
                    <p className="text-[10px] text-[#4F7CFF] font-mono">{emp.departmentName}</p>

                    {emp.badges && emp.badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {emp.badges.map((badge) => (
                          <RecognitionBadgePill
                            key={badge.id}
                            badge={badge}
                            size="xs"
                            showTooltip={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-base font-extrabold text-emerald-400">
                    {card.overallScore}%
                  </span>
                  <p className="text-[10px] text-slate-400">{card.tier}</p>
                </div>
              </div>

              {/* Score Breakdown Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px]">Productivity:</span>
                  <p className="text-white font-bold">{card.productivity}%</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Task Completion:</span>
                  <p className="text-white font-bold">{card.taskCompletion}%</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Attendance:</span>
                  <p className="text-emerald-400 font-bold">{card.attendanceRate}%</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Team Contribution:</span>
                  <p className="text-[#00D9FF] font-bold">{card.teamContribution}%</p>
                </div>
              </div>

              {/* Reviewer Feedback Notes */}
              <p className="text-[11px] text-slate-300 mt-3 italic leading-relaxed">
                "{card.feedback}"
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Evaluated by: {card.evaluatedBy}</span>
                <span className="text-emerald-400">Next Review: Oct 2026</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
