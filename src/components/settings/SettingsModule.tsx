import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Building,
  Key,
  CreditCard,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Users,
  Save,
  Check,
  Zap,
  Sun,
  Moon,
  Palette,
  Monitor,
  CheckCheck,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { UserRole, ThemeMode } from '../../types';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateCompanySettings,
    currentUser,
    setCurrentUser,
    triggerConfettiEffect,
    themeMode,
    setThemeMode,
    toggleThemeMode,
  } = useCompany();

  const [activeSection, setActiveSection] = useState<
    'appearance' | 'branding' | 'security' | 'permissions' | 'integrations' | 'notifications' | 'billing'
  >('appearance');

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [legalName, setLegalName] = useState(settings.legalEntity || settings.companyName);
  const [domain, setDomain] = useState('companyhq.io');
  const [timezone, setTimezone] = useState(settings.timezone);
  const [currency, setCurrency] = useState(settings.defaultCurrency);
  const [twoFactorRequired, setTwoFactorRequired] = useState(settings.enable2FA);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(settings.sessionTimeoutMinutes);
  const [ipWhitelisting, setIpWhitelisting] = useState(true);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings({
      companyName,
      legalEntity: legalName,
      timezone,
      defaultCurrency: currency,
      enable2FA: twoFactorRequired,
      sessionTimeoutMinutes,
      themeMode,
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
    triggerConfettiEffect();
  };

  const rolesMatrix: {
    role: UserRole;
    label: string;
    description: string;
    canViewPayroll: boolean;
    canApprovePayroll: boolean;
    canManageHiring: boolean;
    canManageProjects: boolean;
    canManageHR: boolean;
    canBroadcast: boolean;
  }[] = [
    { role: 'CEO', label: 'CEO (Owner)', description: 'Root superuser access to all financials, hires, settings & strategy', canViewPayroll: true, canApprovePayroll: true, canManageHiring: true, canManageProjects: true, canManageHR: true, canBroadcast: true },
    { role: 'HR_MANAGER', label: 'HR Manager', description: 'Talent hiring, employee onboarding, policies, leaves & files', canViewPayroll: false, canApprovePayroll: false, canManageHiring: true, canManageProjects: false, canManageHR: true, canBroadcast: true },
    { role: 'FINANCE_MANAGER', label: 'Finance Manager', description: 'Treasury budgets, invoices, expense audits & payroll batch checks', canViewPayroll: true, canApprovePayroll: true, canManageHiring: false, canManageProjects: false, canManageHR: false, canBroadcast: false },
    { role: 'PROJECT_MANAGER', label: 'Project Manager', description: 'Sprint boards, Gantt timelines, milestones & task allocation', canViewPayroll: false, canApprovePayroll: false, canManageHiring: false, canManageProjects: true, canManageHR: false, canBroadcast: false },
    { role: 'TEAM_LEAD', label: 'Team Lead', description: 'Department room management, OKRs & squad productivity', canViewPayroll: false, canApprovePayroll: false, canManageHiring: false, canManageProjects: true, canManageHR: false, canBroadcast: false },
    { role: 'EMPLOYEE', label: 'Employee', description: 'Execution of assigned tasks, personal payslips & channel chat', canViewPayroll: false, canApprovePayroll: false, canManageHiring: false, canManageProjects: false, canManageHR: false, canBroadcast: false },
    { role: 'RECRUITER', label: 'Recruiter', description: 'Candidate screening, interview schedules & offer letters', canViewPayroll: false, canApprovePayroll: false, canManageHiring: true, canManageProjects: false, canManageHR: false, canBroadcast: false },
    { role: 'ACCOUNTANT', label: 'Accountant', description: 'Payroll tax ledgers, expense reimbursements & balance sheets', canViewPayroll: true, canApprovePayroll: false, canManageHiring: false, canManageProjects: false, canManageHR: false, canBroadcast: false },
    { role: 'VIEWER', label: 'Viewer (Auditor)', description: 'Read-only analytics, audit logs and high-level summaries', canViewPayroll: false, canApprovePayroll: false, canManageHiring: false, canManageProjects: false, canManageHR: false, canBroadcast: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00D9FF]/15 border border-[#00D9FF]/30 text-[#00D9FF]">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              CompanyHQ Operating System Settings
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30">
              SYS-CONFIG
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Configure system themes, corporate identity, 9-tier RBAC security policy rules, AI engine credentials, connected API webhooks, and billing subscriptions.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Direct Theme Quick-Toggle in Header */}
          <div className="flex items-center bg-[#0B0F19]/80 border border-slate-700/80 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setThemeMode('Enterprise Dark')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                themeMode === 'Enterprise Dark'
                  ? 'bg-[#141B2D] text-[#00D9FF] shadow border border-[#4F7CFF]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Enterprise Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setThemeMode('Light')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                themeMode === 'Light'
                  ? 'bg-white text-slate-900 shadow border border-slate-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="High-Contrast Light Mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
          </div>

          {isSavedAlert && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-in fade-in">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] hover:opacity-95 text-xs font-semibold text-white shadow-md shadow-[#4F7CFF]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Settings Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="p-3 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-1">
          {[
            { id: 'appearance', label: 'Appearance & Theme System', icon: Palette, badge: themeMode === 'Enterprise Dark' ? 'Dark' : 'Light' },
            { id: 'branding', label: 'Company Profile & Branding', icon: Building },
            { id: 'security', label: 'Security & Access Controls', icon: Shield },
            { id: 'permissions', label: 'Roles & RBAC Matrix (9 Roles)', icon: Users },
            { id: 'integrations', label: 'API Integrations & AI Engine', icon: Layers },
            { id: 'notifications', label: 'Notification Rules', icon: Bell },
            { id: 'billing', label: 'Plan & Billing Subscriptions', icon: CreditCard },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F7CFF]/20 to-[#00D9FF]/10 text-white border border-[#4F7CFF]/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#1C253D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00D9FF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section 0: Appearance & Theme System */}
          {activeSection === 'appearance' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#00D9FF]" />
                    Appearance & Theme Mode
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between the immersive Enterprise Dark operating environment and high-contrast Light mode.
                  </p>
                </div>
                
                {/* Visual Pill Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19]/80 border border-slate-700/70">
                  <span className="text-[11px] text-slate-400">Active Theme:</span>
                  <span className="text-xs font-bold text-[#00D9FF] flex items-center gap-1.5">
                    {themeMode === 'Enterprise Dark' ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#00D9FF]" /> Enterprise Dark
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> High-Contrast Light
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Master Theme Toggle Switch Widget */}
              <div className="p-5 rounded-2xl bg-[#0B0F19]/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#4F7CFF]" />
                      Theme Toggle Switch
                    </h4>
                    <p className="text-xs text-slate-400">
                      Toggle instantly between dark enterprise cockpit and crisp daylight interface.
                    </p>
                  </div>

                  {/* Interactive Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${themeMode === 'Enterprise Dark' ? 'text-white' : 'text-slate-400'}`}>
                      Dark
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={themeMode === 'Light'}
                      onClick={toggleThemeMode}
                      className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:ring-offset-2 focus:ring-offset-[#0B0F19] ${
                        themeMode === 'Light' ? 'bg-[#4F7CFF]' : 'bg-[#1C253D]'
                      }`}
                    >
                      <span className="sr-only">Toggle theme</span>
                      <span
                        className={`pointer-events-none flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          themeMode === 'Light' ? 'translate-x-8 text-amber-600' : 'translate-x-0 text-slate-900'
                        }`}
                      >
                        {themeMode === 'Light' ? (
                          <Sun className="w-4 h-4" />
                        ) : (
                          <Moon className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                    <span className={`text-xs font-semibold ${themeMode === 'Light' ? 'text-white' : 'text-slate-400'}`}>
                      Light
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Theme Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Card 1: Enterprise Dark */}
                <div
                  onClick={() => setThemeMode('Enterprise Dark')}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden group ${
                    themeMode === 'Enterprise Dark'
                      ? 'bg-gradient-to-b from-[#141B2D] to-[#0B0F19] border-[#00D9FF] shadow-lg shadow-[#00D9FF]/10 ring-1 ring-[#00D9FF]'
                      : 'bg-[#0B0F19]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#00D9FF]/15 border border-[#00D9FF]/30 text-[#00D9FF]">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          Enterprise Dark
                        </h4>
                        <span className="text-[11px] text-slate-400">Obsidian Executive Cockpit</span>
                      </div>
                    </div>
                    {themeMode === 'Enterprise Dark' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40">
                        <CheckCheck className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                        SELECT
                      </span>
                    )}
                  </div>

                  {/* Dark Theme Mini Preview Box */}
                  <div className="rounded-xl bg-[#070A13] border border-slate-800 p-3 mb-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Dark Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#141B2D] border border-[#4F7CFF]/30 flex items-center justify-center text-[#00D9FF] text-xs font-bold">
                        HQ
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-20 bg-slate-700 rounded" />
                        <div className="h-1.5 w-12 bg-slate-800 rounded" />
                      </div>
                      <div className="px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF] text-[9px] font-mono">
                        +14.2%
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Deep obsidian palette with neon blue & electric cyan telemetry accents. Designed for zero eye strain in dark environments.
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                    <span>Contrast ratio: 14.5:1 (Optimized for OLED & focus)</span>
                  </div>
                </div>

                {/* Card 2: High-Contrast Light */}
                <div
                  onClick={() => setThemeMode('Light')}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden group ${
                    themeMode === 'Light'
                      ? 'bg-gradient-to-b from-white to-slate-50 border-[#4F7CFF] shadow-lg shadow-[#4F7CFF]/15 ring-1 ring-[#4F7CFF]'
                      : 'bg-[#0B0F19]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-data-[theme=light]:text-slate-900 flex items-center gap-2">
                          High-Contrast Light
                        </h4>
                        <span className="text-[11px] text-slate-400">Crisp Daylight & Presentation Mode</span>
                      </div>
                    </div>
                    {themeMode === 'Light' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-blue-600 text-white border border-blue-700">
                        <CheckCheck className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                        SELECT
                      </span>
                    )}
                  </div>

                  {/* Light Theme Mini Preview Box */}
                  <div className="rounded-xl bg-white border border-slate-200 p-3 mb-4 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Light Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold">
                        HQ
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-20 bg-slate-800 rounded" />
                        <div className="h-1.5 w-12 bg-slate-400 rounded" />
                      </div>
                      <div className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-mono font-bold">
                        +14.2%
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Crisp white canvas with deep ink typography and sharp high-contrast dividers. Ideal for daylight offices and projector presentations.
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>WCAG AAA compliant: 16.2:1 text contrast</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Branding & Profile */}
          {activeSection === 'branding' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Company Identity & Legal Entity</h3>
                <p className="text-xs text-slate-400">Global organization parameters utilized across official contracts, payroll slips, and invoices.</p>
              </div>

              {/* Theme quick option in Branding section */}
              <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#00D9FF]" />
                    UI Theme Mode
                  </span>
                  <p className="text-[11px] text-slate-400">Current visual style of CompanyHQ OS</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMode('Enterprise Dark')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      themeMode === 'Enterprise Dark'
                        ? 'bg-[#141B2D] text-[#00D9FF] border border-[#4F7CFF]/40 shadow-sm'
                        : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Enterprise Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('Light')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      themeMode === 'Light'
                        ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                        : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Brand Display Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Legal Registered Entity</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Primary Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Corporate Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
                  >
                    <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                    <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
                    <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                    <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Security */}
          {activeSection === 'security' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise Security & Compliance Policy</h3>
                <p className="text-xs text-slate-400">Strict multi-factor auth and continuous session protection standards.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Enforce Hardware 2FA / WebAuthn</p>
                    <p className="text-[11px] text-slate-400">Require all 48 employees to register FIDO2 security keys or TOTP.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorRequired}
                    onChange={(e) => setTwoFactorRequired(e.target.checked)}
                    className="w-5 h-5 rounded accent-[#4F7CFF]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">IP Whitelisting & VPN Enclave</p>
                    <p className="text-[11px] text-slate-400">Restrict access to corporate IP blocks and authorized Zero-Trust tunnels.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={ipWhitelisting}
                    onChange={(e) => setIpWhitelisting(e.target.checked)}
                    className="w-5 h-5 rounded accent-[#4F7CFF]"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Session Idle Inactivity Timeout</p>
                    <span className="text-xs font-mono font-bold text-[#00D9FF]">{sessionTimeoutMinutes} Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className="w-full accent-[#4F7CFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Roles & Permissions Matrix */}
          {activeSection === 'permissions' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC Matrix)</h3>
                <p className="text-xs text-slate-400">Permissions across all 9 discrete corporate user roles.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                      <th className="pb-3 px-3">Role</th>
                      <th className="pb-3 px-2 text-center">View Payroll</th>
                      <th className="pb-3 px-2 text-center">Approve Payroll</th>
                      <th className="pb-3 px-2 text-center">Hiring</th>
                      <th className="pb-3 px-2 text-center">Projects</th>
                      <th className="pb-3 px-2 text-center">HR Center</th>
                      <th className="pb-3 px-2 text-center">Broadcast</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {rolesMatrix.map((item) => (
                      <tr key={item.role} className="hover:bg-[#1C253D]/40">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canViewPayroll ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canApprovePayroll ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canManageHiring ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canManageProjects ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canManageHR ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {item.canBroadcast ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Integrations */}
          {activeSection === 'integrations' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Cloud Infrastructure & AI Integrations</h3>
                <p className="text-xs text-slate-400">Connected third-party enterprise services powering CompanyHQ automation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Google Gemini 2.5 Pro', desc: 'Powers executive intelligence, resume scoring & meeting minutes', status: 'Active (Connected)', color: 'text-[#00D9FF]' },
                  { name: 'AWS S3 Cloud Vault', desc: 'Secure asset storage for payroll invoices & resumes', status: 'Active (Connected)', color: 'text-amber-400' },
                  { name: 'Slack Enterprise Grid', desc: 'Bi-directional alert synchronization & war room pings', status: 'Active (Connected)', color: 'text-purple-400' },
                  { name: 'GitHub Enterprise', desc: 'Sprint commit linkage & automated project status triggers', status: 'Active (Connected)', color: 'text-slate-200' },
                  { name: 'Stripe Treasury & ACH', desc: 'Direct corporate payroll disbursement & invoice processing', status: 'Active (Connected)', color: 'text-emerald-400' },
                  { name: 'Zoom / Google Meet', desc: 'Automated 1-click room video conferences with recording', status: 'Active (Connected)', color: 'text-[#4F7CFF]' },
                ].map((integ) => (
                  <div key={integ.name} className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{integ.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {integ.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{integ.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Notifications */}
          {activeSection === 'notifications' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">System Notification Rules</h3>
                <p className="text-xs text-slate-400">Configure alert thresholds and escalation routes for payroll, hiring, and system events.</p>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Critical Payroll & Budget Deviations', desc: 'Trigger instant alerts when department spends exceed quarterly allocations by >5%', enabled: true },
                  { title: 'Candidate Offer Approvals', desc: 'Notify CEO and HR Director upon candidate advancement to Offer stage', enabled: true },
                  { title: 'High-Priority Project Milestones', desc: 'Broadcast updates when Tier-1 projects switch status or miss deadlines', enabled: true },
                  { title: 'Unusual Login & Access Alerts', desc: 'Immediate notification upon authentication from unrecognized IP ranges', enabled: true },
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">{rule.title}</p>
                      <p className="text-[11px] text-slate-400">{rule.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={rule.enabled}
                      className="w-5 h-5 rounded accent-[#4F7CFF]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Billing */}
          {activeSection === 'billing' && (
            <div className="p-6 rounded-2xl bg-[#141B2D]/80 border border-[#4F7CFF]/15 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">CompanyHQ Operating License</h3>
                <p className="text-xs text-slate-400">Enterprise tier with unlimited departments, full AI copilot tokens, and SLA guarantee.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C253D] to-[#141B2D] border border-[#4F7CFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/20 text-[#00D9FF] font-bold">
                    ENTERPRISE UNLIMITED
                  </span>
                  <h4 className="text-lg font-extrabold text-white">$24,000 / Year (Billed Annually)</h4>
                  <p className="text-xs text-slate-400">48 Active Seats • 99.99% Uptime SLA • Dedicated AI TPU Instance</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-xs font-semibold shadow-sm transition-all shrink-0">
                  Manage Corporate Invoices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
