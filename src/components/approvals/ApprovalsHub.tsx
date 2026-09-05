import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Plus,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Send,
  Sparkles,
  AlertCircle,
  Search,
  MessageSquare,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { ApprovalItem, ApprovalType } from '../../types';

export const ApprovalsHub: React.FC = () => {
  const {
    approvals,
    approveApprovalItem,
    rejectApprovalItem,
    submitApprovalItem,
    currentRole,
    currentUser,
  } = useCompany();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [approvalModalItem, setApprovalModalItem] = useState<ApprovalItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<ApprovalItem | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Submit form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ApprovalType>('Equipment Purchase');
  const [newDepartment, setNewDepartment] = useState('Engineering');
  const [newAmount, setNewAmount] = useState(15000);
  const [newUrgency, setNewUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newDescription, setNewDescription] = useState('');

  // Filter items
  const filteredApprovals = approvals.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesCategory = selectedCategory === 'All' || item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const pendingCount = approvals.filter((a) => a.status === 'Pending Review').length;
  const approvedCount = approvals.filter((a) => a.status === 'Approved').length;
  const totalApprovedAmount = approvals
    .filter((a) => a.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleApproveConfirm = () => {
    if (!approvalModalItem) return;
    approveApprovalItem(approvalModalItem.id, approvalComment);
    setApprovalModalItem(null);
    setApprovalComment('');
  };

  const handleRejectConfirm = () => {
    if (!rejectModalItem) return;
    rejectApprovalItem(rejectModalItem.id, rejectReason);
    setRejectModalItem(null);
    setRejectReason('');
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    submitApprovalItem({
      title: newTitle,
      type: newType,
      department: newDepartment,
      amount: Number(newAmount) || 0,
      urgency: newUrgency,
      description: newDescription || 'Standard business justification provided.',
    });

    setNewTitle('');
    setNewDescription('');
    setIsSubmitModalOpen(false);
  };

  const getUrgencyBadge = (urgency: ApprovalItem['urgency']) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40';
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1424] via-[#141F36] to-[#0D1424] border border-[#4F7CFF]/25 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F7CFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4F7CFF]/15 text-[#4F7CFF] border border-[#4F7CFF]/30 uppercase tracking-widest flex items-center gap-1.5">
                <FileCheck className="w-3 h-3" /> Multi-Tier Executive Governance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                Current Authority: {currentRole}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Company Approvals Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Centralized decision command for budget allocations, equipment authorizations, hiring offers, compensation adjustments, and critical operational expenditures.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white text-xs font-bold transition-all shadow-md shadow-[#4F7CFF]/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Request</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Pending Decision</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5 block">
              {pendingCount} <span className="text-xs text-slate-400 font-normal">items</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Approved Total</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              ${totalApprovedAmount.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Avg Turnaround</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-[#00D9FF] mt-0.5 block">
              2.4 <span className="text-xs text-slate-400 font-normal">hours</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Executive Sign-Offs</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-0.5 block">
              {approvedCount} <span className="text-xs text-slate-400 font-normal">granted</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1424]/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['Pending Review', 'All', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab
                  ? 'bg-[#4F7CFF] text-white shadow-sm shadow-[#4F7CFF]/30'
                  : 'bg-[#141B2D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#141B2D]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, submitter, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#00D9FF]"
          >
            <option value="All">All Categories</option>
            <option value="Equipment Purchase">Equipment Purchase</option>
            <option value="Hiring Offer">Hiring Offer</option>
            <option value="Promotion & Raise">Promotion & Raise</option>
            <option value="Expense Reimbursement">Expense Reimbursement</option>
            <option value="Leave Request">Leave Request</option>
            <option value="Budget Increase">Budget Increase</option>
            <option value="Project Closure">Project Closure</option>
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3.5">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0D1424]/60 border border-slate-800/80">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No approval items found</h3>
            <p className="text-xs text-slate-500 mt-1">
              All requests matching the current filters have been processed.
            </p>
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const isPending = item.status === 'Pending Review';
            const isApproved = item.status === 'Approved';
            const isRejected = item.status === 'Rejected';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 hover:border-[#4F7CFF]/40 transition-all shadow-lg space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#4F7CFF]/15 text-[#4F7CFF] border border-[#4F7CFF]/30">
                        {item.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getUrgencyBadge(item.urgency)}`}>
                        {item.urgency} Urgency
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isRejected
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300">{item.description}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                    {item.amount > 0 && (
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        ${item.amount.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      Submitted: {item.submittedAt}
                    </span>
                  </div>
                </div>

                {/* Submitter & Multi-Level Chain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                  {/* Left: Submitter info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#141B2D] border border-slate-700 flex items-center justify-center font-bold text-xs text-[#00D9FF]">
                      {item.submittedBy.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{item.submittedBy}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.submittedByRole} • {item.department}
                      </span>
                    </div>
                  </div>

                  {/* Right: Multi-Level Approval Chain */}
                  <div className="flex items-center gap-2 flex-wrap md:justify-end">
                    {item.chain.map((chainStep, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                        <div
                          className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 ${
                            chainStep.status === 'Approved'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : chainStep.status === 'Pending'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}
                        >
                          {chainStep.status === 'Approved' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-400" />
                          )}
                          <span className="font-semibold text-[11px]">{chainStep.role}: {chainStep.approverName}</span>
                        </div>
                        {idx < item.chain.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {isPending && (
                  <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800/60">
                    <button
                      onClick={() => setRejectModalItem(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => setApprovalModalItem(item)}
                      className="px-4 py-1.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white text-xs font-bold transition-all shadow-md shadow-[#4F7CFF]/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Executive Sign-Off</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Approval Confirmation Modal */}
      {approvalModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0D1424] border border-emerald-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Authorize Approval</h3>
              </div>
              <button
                onClick={() => setApprovalModalItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Item</span>
                <span className="text-white font-bold text-sm block mt-0.5">{approvalModalItem.title}</span>
                {approvalModalItem.amount > 0 && (
                  <span className="text-emerald-400 font-mono font-bold block mt-1">
                    Amount: ${approvalModalItem.amount.toLocaleString()} USD
                  </span>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Executive Approval Signature / Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="e.g. Authorized under FY Q3 strategic infrastructure budget."
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setApprovalModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs shadow-md shadow-emerald-500/20"
              >
                Confirm & Sign Off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0D1424] border border-red-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Reject Request</h3>
              </div>
              <button
                onClick={() => setRejectModalItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Are you sure you want to reject <span className="text-white font-semibold">"{rejectModalItem.title}"</span>?
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Reason for Rejection (Required for audit log)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Budget ceiling reached for this quarter or requires vendor renegotiation."
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit New Approval Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1424] border border-[#4F7CFF]/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-white">Submit New Approval Request</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Compute Cluster Expansion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ApprovalType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Equipment Purchase">Equipment Purchase</option>
                    <option value="Hiring Offer">Hiring Offer</option>
                    <option value="Promotion & Raise">Promotion & Raise</option>
                    <option value="Expense Reimbursement">Expense Reimbursement</option>
                    <option value="Leave Request">Leave Request</option>
                    <option value="Budget Increase">Budget Increase</option>
                    <option value="Project Closure">Project Closure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Urgency</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Justification</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail why this allocation is required and its strategic ROI..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white font-bold text-xs shadow-md shadow-[#4F7CFF]/20"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
