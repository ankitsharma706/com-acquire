import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Award,
  TrendingUp,
  UserX,
  ArrowUpRight,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  X,
  Trophy,
  HeartHandshake,
  ThumbsUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { Employee, DepartmentId, UserRole, RecognitionBadgeType } from '../../types';
import { RecognitionBadgePill } from '../common/RecognitionBadgePill';

export const EmployeeManagement: React.FC = () => {
  const {
    employees,
    rooms,
    currentRole,
    addNewEmployee,
    fireEmployee,
    promoteEmployee,
    selectedEmployee,
    setSelectedEmployee,
    triggerConfettiEffect,
    isAiAuditingBadges,
    aiAuditSummary,
    runAiBadgeRecognitionAudit,
    awardManualBadge,
    removeBadge,
    sendEmployeeKudos,
  } = useCompany();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'Top Performer' | 'Collaboration Hero' | 'any' | 'none'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isFireModalOpen, setIsFireModalOpen] = useState(false);
  const [kudosFeedback, setKudosFeedback] = useState<string | null>(null);

  // Sync selected employee with live employees array
  const currentSelectedEmp = selectedEmployee
    ? employees.find((e) => e.id === selectedEmployee.id) || selectedEmployee
    : null;

  // New Employee State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartmentId, setNewDepartmentId] = useState<DepartmentId>('development');
  const [newSalary, setNewSalary] = useState(150000);
  const [newEmail, setNewEmail] = useState('');
  const [newSkills, setNewSkills] = useState('TypeScript, React, Cloud Ops');

  // Promotion State
  const [promoteTitle, setPromoteTitle] = useState('Staff Engineer / Architect');
  const [salaryBump, setSalaryBump] = useState(25000);

  // Fire State
  const [fireReason, setFireReason] = useState('Restructuring & strategic pivot');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = departmentFilter === 'all' || emp.departmentId === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesBadge =
      badgeFilter === 'all' ||
      (badgeFilter === 'Top Performer' && emp.badges?.some((b) => b.type === 'Top Performer')) ||
      (badgeFilter === 'Collaboration Hero' && emp.badges?.some((b) => b.type === 'Collaboration Hero')) ||
      (badgeFilter === 'any' && (emp.badges?.length || 0) > 0) ||
      (badgeFilter === 'none' && (!emp.badges || emp.badges.length === 0));

    return matchesSearch && matchesDept && matchesStatus && matchesBadge;
  });

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const selectedDept = rooms.find((r) => r.id === newDepartmentId);

    addNewEmployee({
      name: newName,
      role: newRole,
      departmentId: newDepartmentId,
      departmentName: selectedDept ? selectedDept.name : 'Engineering',
      salary: Number(newSalary),
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@companyhq.io`,
      skills: newSkills.split(',').map((s) => s.trim()),
    });

    setNewName('');
    setNewRole('');
    setIsAddModalOpen(false);
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    promoteEmployee(selectedEmployee.id, promoteTitle, Number(salaryBump));
    setIsPromoteModalOpen(false);
  };

  const handleFireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    fireEmployee(selectedEmployee.id, fireReason);
    setSelectedEmployee(null);
    setIsFireModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Enterprise HR & Employee Directory
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
              {employees.length} TALENT RECORDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage employee compensation, role promotions, department assignments, and performance ratings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search talent or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value as any)}
            aria-label="Filter Employees by Department"
            className="h-9 px-3 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments ({employees.length})</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* AI Recognition Badge Filter */}
          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value as any)}
            aria-label="Filter Employees by Badge"
            className="h-9 px-3 rounded-xl bg-[#141B2D] border border-amber-500/30 text-xs text-amber-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Recognition Statuses</option>
            <option value="any">⭐ Any Awarded Badge</option>
            <option value="Top Performer">🏆 Top Performers</option>
            <option value="Collaboration Hero">🤝 Collaboration Heroes</option>
            <option value="none">Unbadged</option>
          </select>

          {/* AI Recognition Audit Action */}
          <button
            onClick={async () => {
              await runAiBadgeRecognitionAudit();
            }}
            disabled={isAiAuditingBadges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            title="Analyze employee telemetry and automatically bestow Top Performer and Collaboration Hero badges"
          >
            {isAiAuditingBadges ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isAiAuditingBadges ? 'Auditing Activity...' : 'Run AI Badge Audit'}</span>
          </button>

          {(currentRole === 'CEO' || currentRole === 'HR_MANAGER') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Hire New Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Audit Insight Notification Banner */}
      {aiAuditSummary && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300 font-bold">AI Recognition Engine:</strong> {aiAuditSummary}
            </span>
          </div>
          <button
            onClick={async () => {
              await runAiBadgeRecognitionAudit();
            }}
            className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 underline underline-offset-2 ml-2"
          >
            <RefreshCw className="w-3 h-3" />
            Re-audit
          </button>
        </div>
      )}

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => setSelectedEmployee(emp)}
            className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15 hover:border-[#00D9FF]/40 bg-[#141B2D]/80 hover:bg-[#141B2D] cursor-pointer transition-all duration-200 group relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-[#00D9FF] transition-all"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-[#141B2D] ${
                      emp.status === 'online'
                        ? 'bg-[#00C853]'
                        : emp.status === 'in-meeting'
                        ? 'bg-[#FFB300]'
                        : 'bg-[#4F7CFF]'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-[#00D9FF] transition-colors leading-tight">
                      {emp.name}
                    </h3>
                    {emp.isTeamLead && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        LEAD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{emp.role}</p>
                  <p className="text-[10px] text-[#4F7CFF] font-mono">{emp.departmentName}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  emp.performanceTier === 'Excellent'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : emp.performanceTier === 'Good'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {emp.performanceRating}%
              </span>
            </div>

            {/* AI Awarded Recognition Badges */}
            {emp.badges && emp.badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/60">
                {emp.badges.map((badge) => (
                  <RecognitionBadgePill
                    key={badge.id}
                    badge={badge}
                    size="sm"
                    showTooltip={true}
                  />
                ))}
                {(emp.kudosCount || 0) > 0 && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-semibold"
                    title={`${emp.kudosCount} Peer Kudos received`}
                  >
                    <ThumbsUp className="w-2.5 h-2.5 text-rose-400" />
                    {emp.kudosCount} Kudos
                  </span>
                )}
              </div>
            )}

            {/* Skills Tag Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {emp.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B0F19] text-slate-300 border border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Salary: <span className="text-white font-semibold">${(emp.salary / 1000).toFixed(0)}k/yr</span>
              </span>
              <span className="text-slate-400">
                Attendance: <span className="text-emerald-400 font-semibold">{emp.attendanceRate}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Employee Detailed Drawer / Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#00D9FF] shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedEmployee.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    {selectedEmployee.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#00D9FF] font-semibold">{selectedEmployee.role}</p>
                <p className="text-[11px] text-slate-400">{selectedEmployee.departmentName} • {selectedEmployee.location}</p>
              </div>
            </div>

            {/* Compensation & Performance Grid */}
            <div className="grid grid-cols-3 gap-3 mt-5 p-3 rounded-2xl bg-[#0B0F19] border border-slate-800 text-center font-mono">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Annual Base</p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  ${selectedEmployee.salary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Equity Grant</p>
                <p className="text-sm font-extrabold text-[#00D9FF] mt-0.5">
                  {selectedEmployee.equity}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Performance</p>
                <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                  {selectedEmployee.performanceRating}% ({selectedEmployee.performanceTier})
                </p>
              </div>
            </div>

            {/* Contact & Meta */}
            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEmployee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEmployee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined CompanyHQ on {selectedEmployee.joiningDate}</span>
              </div>
            </div>

            {/* AI Recognition & Activity Honors Section */}
            <div className="mt-5 p-4 rounded-2xl bg-[#0B0F19]/90 border border-[#4F7CFF]/25">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Recognition Badges & Activity Honors
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Evaluated by Gemini AI based on velocity, completion rate, peer kudos, and synergy.
                    </p>
                  </div>
                </div>

                {/* Peer Kudos Button */}
                <button
                  onClick={() => {
                    sendEmployeeKudos(currentSelectedEmp?.id || selectedEmployee.id);
                    setKudosFeedback(`Gave Kudos to ${selectedEmployee.name}! 🌟`);
                    setTimeout(() => setKudosFeedback(null), 3000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all"
                  title="Send peer recognition kudos (automatically awards Collaboration Hero at milestone threshold)"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                  <span>Send Kudos ({currentSelectedEmp?.kudosCount || selectedEmployee.kudosCount || 0})</span>
                </button>
              </div>

              {kudosFeedback && (
                <div className="mt-2 text-center text-xs font-semibold text-rose-400 bg-rose-500/10 py-1 px-2 rounded-lg animate-in fade-in">
                  {kudosFeedback}
                </div>
              )}

              {/* Badges List */}
              {currentSelectedEmp?.badges && currentSelectedEmp.badges.length > 0 ? (
                <div className="mt-3.5 space-y-2">
                  {currentSelectedEmp.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl border ${
                        badge.type === 'Top Performer'
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-cyan-950/20 border-cyan-500/30'
                      } flex items-start justify-between gap-3`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-2 rounded-xl mt-0.5 ${
                            badge.type === 'Top Performer'
                              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40'
                              : 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40'
                          }`}
                        >
                          {badge.type === 'Top Performer' ? (
                            <Trophy className="w-4 h-4" />
                          ) : (
                            <HeartHandshake className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-white">
                              {badge.title}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                                badge.level === 'Diamond'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : badge.level === 'Platinum'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {badge.level} Tier
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {badge.confidenceScore}% AI Confidence
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                            "{badge.aiReason}"
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                            <span>Activity: <strong className="text-slate-200">{badge.activityMetric}</strong></span>
                            <span>•</span>
                            <span>Awarded: {badge.awardedAt}</span>
                          </div>
                        </div>
                      </div>

                      {(currentRole === 'CEO' || currentRole === 'HR_MANAGER') && (
                        <button
                          onClick={() => removeBadge(currentSelectedEmp.id, badge.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Revoke Badge"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400">No recognition badges awarded yet.</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Click 'Run AI Badge Audit' in the directory header or award one manually below.
                  </p>
                </div>
              )}

              {/* Leadership Quick Bestow Controls */}
              {(currentRole === 'CEO' || currentRole === 'HR_MANAGER') && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Executive Honor Override:
                  </span>
                  <div className="flex items-center gap-2">
                    {!currentSelectedEmp?.badges?.some((b) => b.type === 'Top Performer') && (
                      <button
                        onClick={() => awardManualBadge(currentSelectedEmp?.id || selectedEmployee.id, 'Top Performer')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Trophy className="w-3 h-3" />
                        Award Top Performer
                      </button>
                    )}
                    {!currentSelectedEmp?.badges?.some((b) => b.type === 'Collaboration Hero') && (
                      <button
                        onClick={() => awardManualBadge(currentSelectedEmp?.id || selectedEmployee.id, 'Collaboration Hero')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <HeartHandshake className="w-3 h-3" />
                        Award Collab Hero
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Executive Action Buttons */}
            {(currentRole === 'CEO' || currentRole === 'HR_MANAGER') && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsFireModalOpen(true)}
                  className="py-2 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-400 transition-all flex items-center gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Terminate Contract
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPromoteModalOpen(true)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Promote & Adjust Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Hire New Team Member</h2>
            <p className="text-xs text-slate-400 mt-0.5">Add a new specialist to the CompanyHQ roster.</p>

            <form onSubmit={handleAddEmployeeSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Distributed Systems Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Department</label>
                  <select
                    value={newDepartmentId}
                    onChange={(e) => setNewDepartmentId(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Base Salary ($)</label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Rust, WebAssembly, Kubernetes"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote Modal */}
      {isPromoteModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Promote {selectedEmployee.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Elevate title and adjust annual compensation.</p>

            <form onSubmit={handlePromoteSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">New Role Title</label>
                <input
                  type="text"
                  required
                  value={promoteTitle}
                  onChange={(e) => setPromoteTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Salary Increase ($)</label>
                <input
                  type="number"
                  value={salaryBump}
                  onChange={(e) => setSalaryBump(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
                <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                  New Total: ${(selectedEmployee.salary + Number(salaryBump)).toLocaleString()}/yr
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Authorize Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fire Confirmation Modal */}
      {isFireModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-rose-500/40 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-rose-400">Terminate Contract</h2>
            <p className="text-xs text-slate-300 mt-1">
              Are you sure you want to deactivate <span className="font-bold text-white">{selectedEmployee.name}</span>?
            </p>

            <form onSubmit={handleFireSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Audit Justification</label>
                <input
                  type="text"
                  required
                  value={fireReason}
                  onChange={(e) => setFireReason(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFireModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                >
                  Confirm Termination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
