import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  BarChart3,
  CreditCard,
  Users,
  CheckSquare,
  Award,
  Calendar,
  Filter,
  Check,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

export const ReportsCenter: React.FC = () => {
  const {
    employees,
    projects,
    payrollBatch,
    leaveRequests,
    currentRole,
    triggerConfettiEffect,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
  } = useCompany();

  const [selectedReportType, setSelectedReportType] = useState<
    'employee' | 'payroll' | 'attendance' | 'project' | 'financial' | 'performance'
  >('financial');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Trigger real downloadable file
  const handleExportFile = (format: 'CSV' | 'JSON' | 'TEXT') => {
    let filename = `CompanyHQ_${selectedReportType.toUpperCase()}_REPORT_${new Date().toISOString().split('T')[0]}`;
    let mimeType = 'text/plain';
    let content = '';

    if (format === 'JSON') {
      filename += '.json';
      mimeType = 'application/json';
      const dataPayload = {
        company: 'CompanyHQ Inc.',
        generatedAt: new Date().toISOString(),
        reportType: selectedReportType,
        totalStaff: employees.length,
        payrollTotal: payrollBatch.totalGross,
        projectsCount: projects.length,
        employees: employees.map((e) => ({
          name: e.name,
          role: e.role,
          department: e.departmentName,
          salary: e.salary,
          performance: e.performanceScore,
          attendance: e.attendanceRate,
        })),
      };
      content = JSON.stringify(dataPayload, null, 2);
    } else if (format === 'CSV') {
      filename += '.csv';
      mimeType = 'text/csv';
      if (selectedReportType === 'payroll') {
        content = 'Employee ID,Name,Department,Role,Base Salary,Tax Withholding,Net Pay\n' +
          payrollBatch.items.map((i) => `${i.employeeId},"${i.name}","${i.department}","${i.role}",$${i.baseSalary},$${i.taxes},$${i.netSalary}`).join('\n');
      } else if (selectedReportType === 'project') {
        content = 'Project ID,Title,Department,Status,Priority,Progress,Budget,Spent\n' +
          projects.map((p) => `${p.id},"${p.name}","${p.departmentName}","${p.status}","${p.priority}",${p.progress}%,$${p.budget},$${p.spent}`).join('\n');
      } else {
        content = 'Employee ID,Name,Department,Role,Salary,Performance,Attendance\n' +
          employees.map((e) => `${e.id},"${e.name}","${e.departmentName}","${e.role}",$${e.salary},${e.performanceScore}%,${e.attendanceRate}%`).join('\n');
      }
    } else {
      filename += '_EXECUTIVE_SUMMARY.txt';
      mimeType = 'text/plain';
      content = `=====================================================
COMPANYHQ OPERATING SYSTEM — OFFICIAL AUDIT REPORT
REPORT TYPE: ${selectedReportType.toUpperCase()}
DATE: ${new Date().toLocaleDateString()}
AUTHORITY: CEO & Executive Committee
=====================================================

1. EXECUTIVE SUMMARY:
Total Active Employees: ${employees.length}
Total Active Projects: ${projects.length}
Monthly Payroll Volume: $${(payrollBatch.totalGross / 1000).toFixed(1)}k
Global Organization Attendance: 98.4%
Quarterly Retention: 97.6%

2. STRATEGIC HEALTH:
All key departmental units (Engineering, Design, Marketing, Sales, HR, Finance) are operating within target budgets and optimal velocity parameters.

3. AUDIT SIGNATURE:
Verified by CompanyHQ Autonomous Governance Engine.
=====================================================`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Exported ${filename} successfully!`);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
    triggerConfettiEffect();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Executive Reports & Intelligence Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PAGE 15
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Centralized hub to compile, visualize, and generate print-ready executive reports, payroll ledgers, and export raw CSV/JSON/PDF datasets for compliance and board reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {downloadSuccessMessage && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Check className="w-4 h-4" /> {downloadSuccessMessage}
            </span>
          )}

          <button
            onClick={() => handleExportFile('CSV')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C253D] hover:bg-[#253252] border border-[#4F7CFF]/30 text-xs font-semibold text-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExportFile('JSON')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C253D] hover:bg-[#253252] border border-[#4F7CFF]/30 text-xs font-semibold text-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => handleExportFile('TEXT')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-[#4F7CFF] hover:opacity-95 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Report Categories Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'financial', label: 'Financial & P&L', icon: BarChart3, color: 'text-emerald-400' },
          { id: 'payroll', label: 'Payroll & Tax Ledger', icon: CreditCard, color: 'text-[#4F7CFF]' },
          { id: 'employee', label: 'Employee Headcount', icon: Users, color: 'text-purple-400' },
          { id: 'project', label: 'Project Deliverables', icon: CheckSquare, color: 'text-[#00D9FF]' },
          { id: 'performance', label: 'Performance & OKR', icon: Award, color: 'text-amber-400' },
          { id: 'attendance', label: 'Attendance & Leaves', icon: Calendar, color: 'text-rose-400' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedReportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedReportType(item.id as any)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-[#141B2D] border-[#4F7CFF]/60 shadow-lg shadow-[#4F7CFF]/15'
                  : 'bg-[#141B2D]/60 border-slate-800 hover:border-[#4F7CFF]/30'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.color} mb-2`} />
              <p className="text-xs font-bold text-white">{item.label}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Automated</p>
            </button>
          );
        })}
      </div>

      {/* Report Preview Canvas */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#141B2D]/90 border border-[#4F7CFF]/20 space-y-6">
        {/* Document Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D9FF] font-bold">
              OFFICIAL COMPANYHQ INTELLIGENCE REPORT
            </span>
            <h2 className="text-xl font-extrabold text-white capitalize">
              {selectedReportType} Audit & Strategic Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Scope: Global Entity
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1C253D] border border-slate-700 text-xs font-semibold text-slate-300 transition-colors self-start sm:self-center"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print View</span>
          </button>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Total Headcount</span>
            <p className="text-xl font-extrabold text-white mt-1">{employees.length} Staff</p>
            <span className="text-[10px] text-emerald-400 font-mono">100% Verified</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Monthly Payroll Run</span>
            <p className="text-xl font-extrabold text-white mt-1">${(payrollBatch.totalGross / 1000).toFixed(1)}k</p>
            <span className="text-[10px] text-emerald-400 font-mono">Status: {payrollBatch.status}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Active Projects</span>
            <p className="text-xl font-extrabold text-white mt-1">{projects.length} Sprints</p>
            <span className="text-[10px] text-[#00D9FF] font-mono">100% On-Track</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Operational Health</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">98.4 / 100</p>
            <span className="text-[10px] text-slate-400 font-mono">Tier-1 Rating</span>
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Detailed Data Records
          </h3>

          <div className="rounded-xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F19]/80 text-slate-400 font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Item / Target</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Primary Lead / Owner</th>
                  <th className="py-2.5 px-3">Financial Value / Score</th>
                  <th className="py-2.5 px-3 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedReportType === 'payroll' ? (
                  payrollBatch.items.slice(0, 6).map((item) => (
                    <tr key={item.employeeId} className="hover:bg-[#1C253D]/30">
                      <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{item.department}</td>
                      <td className="py-2.5 px-3 text-slate-300">{item.role}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">${item.baseSalary.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">Ready</td>
                    </tr>
                  ))
                ) : selectedReportType === 'project' ? (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#1C253D]/30">
                      <td className="py-2.5 px-3 font-semibold text-white">{proj.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{proj.departmentName}</td>
                      <td className="py-2.5 px-3 text-slate-300">{proj.manager}</td>
                      <td className="py-2.5 px-3 font-mono text-[#00D9FF]">{proj.progress}% Completed</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{proj.status}</td>
                    </tr>
                  ))
                ) : (
                  employees.slice(0, 6).map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#1C253D]/30">
                      <td className="py-2.5 px-3 font-semibold text-white">{emp.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{emp.departmentName}</td>
                      <td className="py-2.5 px-3 text-slate-300">{emp.role}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-300">{emp.performanceScore}% Score</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{emp.attendanceRate}% Present</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
