import React, { useState } from 'react';
import { Trophy, HeartHandshake, Sparkles, ShieldCheck, Star, Info, X } from 'lucide-react';
import { EmployeeBadge } from '../../types';

interface RecognitionBadgePillProps {
  badge: EmployeeBadge;
  size?: 'xs' | 'sm' | 'md';
  interactive?: boolean;
}

export const RecognitionBadgePill: React.FC<RecognitionBadgePillProps> = ({
  badge,
  size = 'sm',
  interactive = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isTopPerformer = badge.type === 'Top Performer';

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  }[size];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          if (interactive) {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
          }
        }}
        onMouseEnter={() => interactive && setShowTooltip(true)}
        onMouseLeave={() => interactive && setShowTooltip(false)}
        className={`inline-flex items-center rounded-full font-bold uppercase tracking-tight transition-all duration-200 border cursor-pointer select-none ${sizeClasses} ${
          isTopPerformer
            ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/25 to-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40 hover:border-amber-400 hover:shadow-xs shadow-amber-500/10'
            : 'bg-gradient-to-r from-blue-500/15 via-cyan-500/25 to-indigo-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/40 hover:border-cyan-400 hover:shadow-xs shadow-cyan-500/10'
        }`}
        title={`${badge.title} - Click for AI reasoning`}
      >
        {isTopPerformer ? (
          <Trophy className={`${iconSizes} text-amber-600 dark:text-amber-400 shrink-0`} />
        ) : (
          <HeartHandshake className={`${iconSizes} text-cyan-600 dark:text-cyan-400 shrink-0`} />
        )}
        <span className="whitespace-nowrap font-extrabold">{badge.type}</span>
        {badge.level && (
          <span
            className={`text-[8px] font-mono px-1 rounded-sm uppercase ${
              isTopPerformer
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200'
                : 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-200'
            }`}
          >
            {badge.level}
          </span>
        )}
      </button>

      {/* Interactive AI Citation Popover */}
      {showTooltip && interactive && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 z-50 text-left animate-in fade-in zoom-in-95 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              {isTopPerformer ? (
                <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-amber-400" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center">
                  <HeartHandshake className="w-3 h-3 text-cyan-400" />
                </div>
              )}
              <span className="text-[11px] font-extrabold text-white">{badge.title}</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              AI Verified
            </span>
          </div>

          {/* AI Reasoning Citation */}
          <div className="mt-2 text-[10.5px] text-slate-300 leading-snug">
            <p className="font-medium">{badge.aiReason}</p>
          </div>

          {/* Activity Metrics Evidence */}
          <div className="mt-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
              Activity Telemetry
            </span>
            <p className="text-[10px] font-mono text-cyan-300 font-semibold leading-tight">
              {badge.activityMetric}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>Awarded: {badge.awardedAt}</span>
            {badge.confidenceScore && (
              <span className="text-amber-400 font-bold">{badge.confidenceScore}% AI Confidence</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
