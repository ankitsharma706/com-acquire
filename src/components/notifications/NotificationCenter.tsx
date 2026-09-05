import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  Filter,
  Megaphone,
  CreditCard,
  UserPlus,
  CheckSquare,
  Sparkles,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { NotificationAlert } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setActiveTab,
    setIsAnnouncementModalOpen,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
  } = useCompany();

  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'critical' | 'high' | 'medium' | 'info'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const categories = ['ALL', 'Payroll', 'Hiring', 'Project', 'Leaves', 'General', 'Security'];

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (filterCategory !== 'ALL' && alert.category !== filterCategory) return false;
    return true;
  });

  const getAlertIcon = (category: string, severity: string) => {
    switch (category) {
      case 'Payroll':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'Hiring':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      case 'Project':
        return <CheckSquare className="w-4 h-4 text-[#00D9FF]" />;
      case 'Leaves':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'Security':
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      default:
        if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-400" />;
        return <Bell className="w-4 h-4 text-[#4F7CFF]" />;
    }
  };

  const handleActionClick = (alert: NotificationAlert) => {
    markAlertRead(alert.id);
    if (alert.actionLink) {
      setActiveTab(alert.actionLink as any);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF5252]/15 border border-[#FF5252]/30 text-[#FF5252]">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Company Alerts & Notification Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/30">
              PAGE 10
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time multi-channel feed dispatching system alerts, deadline warnings, approval escalations, payroll triggers, and CEO broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C253D] hover:bg-[#253252] border border-[#4F7CFF]/30 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] border border-[#4F7CFF]/30 text-xs font-semibold text-[#00D9FF] shadow-sm transition-all"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Send Alert Broadcast</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 flex flex-wrap items-center justify-between gap-4">
        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {(['ALL', 'critical', 'high', 'medium', 'info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-[#4F7CFF]/20 text-[#00D9FF] border border-[#4F7CFF]/40'
                  : 'text-slate-400 hover:text-white bg-[#0B0F19]/60'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white bg-[#0B0F19]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#141B2D]/50 border border-dashed border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-white">All clear! No notifications found.</p>
            <p className="text-xs text-slate-400">All company processes are running within optimal parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.isRead
                  ? 'bg-[#141B2D]/50 border-slate-800/80 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-gradient-to-r from-rose-950/40 to-[#141B2D] border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-[#141B2D] border-[#4F7CFF]/30 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500/20 border border-rose-500/30'
                      : alert.severity === 'high'
                      ? 'bg-amber-500/20 border border-amber-500/30'
                      : 'bg-[#4F7CFF]/15 border border-[#4F7CFF]/30'
                  }`}
                >
                  {getAlertIcon(alert.category, alert.severity)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
                    )}
                    <span
                      className={`text-[9px] font-mono px-2 py-0.2 rounded-full font-bold uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : alert.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-[#4F7CFF]/20 text-[#00D9FF]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono px-2 py-0.2 rounded bg-slate-800">
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3" /> {alert.timestamp}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {alert.actionLink && (
                  <button
                    onClick={() => handleActionClick(alert)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#4F7CFF]/20 hover:bg-[#4F7CFF]/30 border border-[#4F7CFF]/40 text-[#00D9FF] text-xs font-semibold transition-colors"
                  >
                    Take Action →
                  </button>
                )}
                {!alert.isRead && (
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
