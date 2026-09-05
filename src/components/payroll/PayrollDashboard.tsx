import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Download,
  FileText,
  ShieldCheck,
  AlertCircle,
  Building,
  User,
  Sparkles,
  Printer,
  X,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { PayrollRecord } from '../../types';

export const PayrollDashboard: React.FC = () => {
  const {
    payrollBatch,
    approvePayrollBatch,
    releasePayrollBatch,
    invoices,
    currentRole,
    triggerConfettiEffect,
  } = useCompany();

  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  const pendingCeoApproval = payrollBatch.status === 'Pending CEO Approval';
  const isApproved = payrollBatch.status === 'Approved';
  const isDispatched = payrollBatch.status === 'Dispatched';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Payroll, Treasury & Compensation
            </h1>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                isDispatched
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isApproved
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-amber-500/20 text-amber-400 animate-pulse'
              }`}
            >
              STATUS: {payrollBatch.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated payroll disbursement engine with multi-signature CEO authorization and digital tax withholdings.
          </p>
        </div>

        {/* 3-Step Multi-Signature Action Flow */}
        <div className="flex items-center gap-3">
          {pendingCeoApproval && (
            <button
              onClick={() => {
                approvePayrollBatch();
                triggerConfettiEffect();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>CEO Sign-off & Authorize Batch</span>
            </button>
          )}

          {isApproved && (
            <button
              onClick={() => {
                releasePayrollBatch();
                triggerConfettiEffect();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C853] to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Dispatch $278.8k to Bank Rails</span>
            </button>
          )}

          {isDispatched && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Funds Dispatched via SVB Wire</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Treasury Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Total Gross Disbursement</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">
            ${payrollBatch.totalGross.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">48 Full-time & Specialist staff</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Federal & State Withholdings</p>
          <h3 className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
            ${payrollBatch.totalDeductions.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">IRS & CA FTB Tax Escrow</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Net Employee Payout</p>
          <h3 className="text-2xl font-extrabold text-[#00D9FF] mt-1 font-mono">
            ${payrollBatch.totalNet.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Direct ACH / Wire deposit</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[#4F7CFF]/15">
          <p className="text-xs font-semibold text-slate-400">Treasury Liquid Reserve</p>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            $14,820,000
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">26.4 Months Runway</p>
        </div>
      </div>

      {/* Verification & Approvals Audit Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0F19]/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Prepared by: <strong className="text-white">{payrollBatch.financeReviewedBy || 'Finance Team'}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle className="w-4 h-4 text-[#00D9FF]" />
          <span>
            CEO Authorization: {payrollBatch.ceoApprovedBy ? (
              <strong className="text-emerald-400">{payrollBatch.ceoApprovedBy} ({payrollBatch.ceoApprovedAt})</strong>
            ) : (
              <strong className="text-amber-400">Pending CEO Signature</strong>
            )}
          </span>
        </div>
      </div>

      {/* Individual Employee Payroll Records Table */}
      <div className="glass-panel rounded-3xl border border-[#4F7CFF]/20 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {payrollBatch.month} Payroll Ledger & Digital Payslips
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any record to inspect and download official payslip.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {payrollBatch.records.length} Employees in Current Batch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B0F19]/60 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3.5 px-5">Employee</th>
                <th className="py-3.5 px-4">Role & Dept</th>
                <th className="py-3.5 px-4">Gross Pay</th>
                <th className="py-3.5 px-4">Performance Bonus</th>
                <th className="py-3.5 px-4">Taxes & Deductions</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payrollBatch.records.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="hover:bg-[#141B2D]/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-5">
                    <span className="font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                      {rec.employeeName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{rec.employeeRole}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    ${rec.baseSalary.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400">
                    +${rec.bonus.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400">
                    -${rec.taxDeductions.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-[#00D9FF]">
                    ${rec.netPay.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        rec.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(rec);
                      }}
                      className="text-[#00D9FF] hover:underline font-semibold flex items-center gap-1 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Payslip Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/40 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Payslip Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#00D9FF]" />
                  <span className="font-extrabold text-white text-base">CompanyHQ, Inc.</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
                  OFFICIAL PAYSLIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                500 Howard Street, Suite 400 • San Francisco, CA 94105
              </p>
            </div>

            {/* Employee Meta */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Employee Name:</span>
                <p className="text-white font-bold">{selectedRecord.employeeName}</p>
              </div>
              <div>
                <span className="text-slate-400">Designation:</span>
                <p className="text-white font-bold">{selectedRecord.employeeRole}</p>
              </div>
              <div>
                <span className="text-slate-400">Pay Period:</span>
                <p className="text-white font-bold">{payrollBatch.month}</p>
              </div>
              <div>
                <span className="text-slate-400">Disbursement Status:</span>
                <p className="text-emerald-400 font-bold">{selectedRecord.status}</p>
              </div>
            </div>

            {/* Compensation Breakdown Box */}
            <div className="mt-5 p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Base Salary</span>
                <span className="text-white font-semibold">${selectedRecord.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Performance & OKR Bonus</span>
                <span className="text-emerald-400 font-semibold">+${selectedRecord.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tax Withholdings & FICA (20%)</span>
                <span className="text-amber-400 font-semibold">-${selectedRecord.taxDeductions.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-[#00D9FF]">
                <span>Total Net Payment</span>
                <span>${selectedRecord.netPay.toLocaleString()}</span>
              </div>
            </div>

            {/* Official Stamp & Sign */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div>
                <p className="text-slate-300 font-bold">Authorized Digital Signature</p>
                <p className="text-emerald-400 font-semibold">CEO_COMPANYHQ_VERIFIED_KEY</p>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00D9FF]/40 flex items-center justify-center text-[9px] text-[#00D9FF] font-bold uppercase text-center rotate-[-12deg]">
                CompanyHQ SEAL
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  triggerConfettiEffect();
                  setSelectedRecord(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md text-center"
              >
                Download Official PDF Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
