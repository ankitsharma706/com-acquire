import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Server,
  RefreshCw,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { UserRole } from '../../types';

export const SecurityAuditModal: React.FC = () => {
  const { auditLogs, currentRole, employees } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.targetCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const rbacRoles: {
    role: UserRole;
    name: string;
    description: string;
    permissions: string[];
  }[] = [
    {
      role: 'CEO',
      name: 'CEO & Founder (Admin)',
      description: 'Super-admin unrestricted access to payroll, hiring, termination, and directives.',
      permissions: ['All Permissions', 'Approve Payroll', 'Fire/Promote Staff', 'Broadcast Announcements', 'Manage AI Copilot'],
    },
    {
      role: 'HR_MANAGER',
      name: 'HR & People Ops Lead',
      description: 'Candidate screening, hiring pipeline, employee files, and attendance oversight.',
      permissions: ['Candidate Funnel', 'Post Job Openings', 'Generate Offers', 'Employee Directory', 'Attendance Reports'],
    },
    {
      role: 'PROJECT_MANAGER',
      name: 'Technical Project Manager',
      description: 'Sprint planning, Kanban board, task allocation, and delivery velocity.',
      permissions: ['Create Projects', 'Allocate Tasks', 'Milestone Tracking', 'Sprint Reviews'],
    },
    {
      role: 'TEAM_LEAD',
      name: 'Department Team Lead',
      description: 'Room management, environmental controls, and performance ratings.',
      permissions: ['Department Room Access', 'Acoustics & Climate', 'Scorecard Reviews', 'Channel Moderation'],
    },
    {
      role: 'EMPLOYEE',
      name: 'Specialist / Engineer',
      description: 'Task execution, code submission, and room collaboration.',
      permissions: ['Submit Tasks', 'Virtual Office Room', 'Join Video War Room', 'Department Chat'],
    },
    {
      role: 'FINANCE_MANAGER',
      name: 'Treasury & Controller',
      description: 'Payroll preparation, digital payslips, and ARR ledger compliance.',
      permissions: ['Prepare Payroll', 'View Invoices', 'Treasury Ledger', 'Tax Escrow Audit'],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Security, RBAC Matrix & Immutable Audit Logs
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              SOC2 TYPE II VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed event ledger, role permissions matrix, and enterprise session audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-pulse" />
          <span>Zero-Trust Enclave Active</span>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-[#4F7CFF]/20 bg-gradient-to-br from-[#141B2D] to-[#101726]">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Role-Based Access Control (RBAC) Entitlements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {rbacRoles.map((r) => (
            <div
              key={r.role}
              className={`p-4 rounded-2xl border transition-all ${
                currentRole === r.role
                  ? 'bg-[#141B2D] border-[#00D9FF] shadow-lg shadow-[#4F7CFF]/20'
                  : 'bg-[#0B0F19]/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#00D9FF]" />
                  {r.name}
                </h4>
                {currentRole === r.role && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#00D9FF]/20 text-[#00D9FF] font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{r.description}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                {r.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Logs Table */}
      <div className="glass-panel rounded-3xl border border-[#4F7CFF]/20 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Immutable Executive Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every critical action (payroll, hiring, promotions, directives) is timestamped and recorded.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter Audit Logs by Category"
              className="h-8 px-2.5 rounded-lg bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Payroll">Payroll</option>
              <option value="Hiring">Hiring</option>
              <option value="Employees">Employees</option>
              <option value="Projects">Projects</option>
              <option value="Announcements">Announcements</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B0F19]/60 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#141B2D]/80 transition-colors">
                  <td className="py-3 px-5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-white">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {log.performedBy} ({log.performedByRole})
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4F7CFF]/15 text-[#00D9FF]">
                      {log.targetCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">{log.details}</td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[10px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
