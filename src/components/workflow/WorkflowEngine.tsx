import React, { useState } from 'react';
import {
  GitMerge,
  Play,
  FastForward,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  UserCheck,
  Code2,
  FileCode,
  DollarSign,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { WorkflowPipeline, WorkflowStepId } from '../../types';

export const WorkflowEngine: React.FC = () => {
  const {
    workflows,
    advanceWorkflowStep,
    autoRunWorkflow,
    createWorkflowPipeline,
    currentRole,
    currentUser,
  } = useCompany();

  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(workflows[0]?.id || 'wf-1');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStepDetail, setSelectedStepDetail] = useState<any>(null);

  // New Workflow form state
  const [newWfName, setNewWfName] = useState('');
  const [newWfProjectName, setNewWfProjectName] = useState('');
  const [newWfClient, setNewWfClient] = useState('');
  const [newWfValue, setNewWfValue] = useState(350000);

  const activePipeline = workflows.find((w) => w.id === selectedPipelineId) || workflows[0];

  const getStepIcon = (stepId: WorkflowStepId) => {
    switch (stepId) {
      case 'ceo_create_project':
        return Briefcase;
      case 'pm_assigned':
        return UserCheck;
      case 'team_lead_assigned':
        return ShieldCheck;
      case 'employees_assigned':
        return Layers;
      case 'work_started':
        return Code2;
      case 'review':
        return FileCode;
      case 'approval':
        return CheckCircle2;
      case 'client_delivery':
        return Zap;
      case 'payment_received':
        return DollarSign;
      case 'finance_records_revenue':
        return TrendingUp;
      case 'performance_updated':
        return Award;
      default:
        return Cpu;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim() || !newWfProjectName.trim()) return;

    createWorkflowPipeline({
      name: newWfName,
      projectName: newWfProjectName,
      clientName: newWfClient || 'Enterprise Client Inc.',
      contractValue: Number(newWfValue) || 250000,
    });

    setNewWfName('');
    setNewWfProjectName('');
    setNewWfClient('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1424] via-[#141E33] to-[#0D1424] border border-[#4F7CFF]/25 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 uppercase tracking-widest flex items-center gap-1.5">
                <GitMerge className="w-3 h-3" /> Autonomous Company Orchestration
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                11-Stage End-to-End Pipeline
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Workflow Engine & Autonomous Execution
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Fully connects the CEO project charter through management assignment, sprint execution, client delivery, revenue recognition in the treasury ledger, and automated performance updates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white text-xs font-bold transition-all shadow-md shadow-[#4F7CFF]/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Workflow</span>
            </button>
          </div>
        </div>

        {/* Global Pipeline Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Active Pipelines</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">
              {workflows.filter((w) => w.status === 'Active').length} <span className="text-xs text-slate-400 font-normal">in flight</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Completed Lifecycle Value</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              ${workflows.reduce((acc, w) => acc + (w.status === 'Completed' ? w.contractValue : 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Auto-Sync Latency</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-[#00D9FF] mt-0.5 block">
              0.4s <span className="text-xs text-slate-400 font-normal">Real-time</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Automation Success Rate</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-0.5 block">
              99.8% <span className="text-xs text-slate-400 font-normal">SOC-2</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Selector Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {workflows.map((wf) => {
            const isSelected = wf.id === activePipeline.id;
            const completedCount = wf.steps.filter((s) => s.status === 'completed').length;
            const pct = Math.round((completedCount / wf.steps.length) * 100);

            return (
              <button
                key={wf.id}
                onClick={() => setSelectedPipelineId(wf.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#141E33] border-[#00D9FF]/50 text-white shadow-md shadow-[#00D9FF]/10'
                    : 'bg-[#0E1424]/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-[#141B2D]'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{wf.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        wf.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#00D9FF]/20 text-[#00D9FF]'
                      }`}
                    >
                      {wf.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>{wf.projectName}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">${wf.contractValue.toLocaleString()}</span>
                    <span>•</span>
                    <span className="text-[#00D9FF]">{pct}% Done</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Controls for Selected Pipeline */}
        <div className="flex items-center gap-2 shrink-0">
          {activePipeline.status !== 'Completed' && (
            <>
              <button
                onClick={() => advanceWorkflowStep(activePipeline.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D9FF]/15 hover:bg-[#00D9FF]/25 border border-[#00D9FF]/40 text-[#00D9FF] text-xs font-bold transition-all active:scale-95 shadow-sm"
                title="Advance to next step immediately"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Next Step</span>
              </button>

              <button
                onClick={() => autoRunWorkflow(activePipeline.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#4F7CFF] hover:from-purple-500 hover:to-[#3d68e6] text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-purple-600/20"
                title="Execute all steps automatically"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Run Full Auto-Pilot</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Pipeline Step-by-Step Flow Visualization */}
      <div className="p-6 rounded-2xl bg-[#0D1424]/90 border border-[#4F7CFF]/20 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{activePipeline.name}</h2>
              <span className="text-xs text-slate-400 font-mono">ID: {activePipeline.id}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Client: <span className="text-white font-semibold">{activePipeline.clientName}</span> | Target Deliverable: <span className="text-white font-semibold">{activePipeline.projectName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Contract Value</span>
              <span className="text-base font-bold font-mono text-emerald-400">${activePipeline.contractValue.toLocaleString()} USD</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Started</span>
              <span className="text-xs font-mono text-slate-200">{activePipeline.startedAt}</span>
            </div>
          </div>
        </div>

        {/* Step Flow List (Interactive Cards connected by lines) */}
        <div className="space-y-3">
          {activePipeline.steps.map((step, index) => {
            const Icon = getStepIcon(step.id);
            const isCurrent = step.status === 'in_progress';
            const isDone = step.status === 'completed';
            const isPending = step.status === 'pending';

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStepDetail(step)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#142345] via-[#10192F] to-[#142345] border-[#00D9FF] shadow-lg shadow-[#00D9FF]/15 ring-1 ring-[#00D9FF]/40'
                    : isDone
                    ? 'bg-[#0E1528]/80 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#0A0E1A]/60 border-slate-800/80 opacity-70 hover:opacity-90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  {/* Left Column: Step Order & Icon */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border font-mono font-bold text-sm transition-transform group-hover:scale-105 ${
                        isDone
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : isCurrent
                          ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] animate-pulse shadow-md shadow-[#00D9FF]/20'
                          : 'bg-slate-800/60 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-slate-800">
                          Step {step.order} of {activePipeline.steps.length}
                        </span>
                        <h3 className={`text-sm font-bold ${isCurrent ? 'text-[#00D9FF]' : isDone ? 'text-white' : 'text-slate-300'}`}>
                          {step.name}
                        </h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isCurrent
                              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 animate-pulse'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {step.status === 'in_progress' ? '⚡ In Progress' : step.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 max-w-2xl">{step.description}</p>
                    </div>
                  </div>

                  {/* Right Column: Responsible Actor & Timestamp */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-200">
                      <span className="text-[11px] text-slate-400">{step.actorRole}:</span>
                      <span className="text-[#00D9FF]">{step.actorName}</span>
                    </div>
                    {step.timestamp && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-payload inspection preview */}
                {step.outputPayload && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#00D9FF]" />
                      Output Artifact: {JSON.stringify(step.outputPayload)}
                    </span>
                    <span className="text-[10px] text-[#00D9FF] group-hover:underline flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Inspector Modal / Drawer */}
      {selectedStepDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1424] border border-[#00D9FF]/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#00D9FF]/20 text-[#00D9FF] font-mono text-xs font-bold">
                  Step {selectedStepDetail.order}
                </span>
                <h3 className="text-base font-bold text-white">{selectedStepDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStepDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono block text-[10px] uppercase">Description</span>
                <p className="text-slate-200 mt-0.5">{selectedStepDetail.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Actor Role</span>
                  <span className="text-white font-semibold">{selectedStepDetail.actorRole}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Responsible Assignee</span>
                  <span className="text-[#00D9FF] font-semibold">{selectedStepDetail.actorName}</span>
                </div>
              </div>

              {selectedStepDetail.outputPayload && (
                <div className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono">
                  <span className="text-slate-400 text-[10px] uppercase block mb-1">Generated Output Payload</span>
                  <pre className="text-[11px] text-emerald-400 overflow-x-auto">
                    {JSON.stringify(selectedStepDetail.outputPayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStepDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Workflow Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0D1424] border border-[#4F7CFF]/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-white">Create Enterprise Workflow</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Workflow Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fortune 500 Multimodal AI System Launch"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverable / Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Enterprise Neural Copilot"
                  value={newWfProjectName}
                  onChange={(e) => setNewWfProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Entity</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp Global"
                    value={newWfClient}
                    onChange={(e) => setNewWfClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contract Value ($)</label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={newWfValue}
                    onChange={(e) => setNewWfValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 text-slate-400 text-[11px] space-y-1">
                <span className="font-semibold text-white block">Automated Engine Configuration:</span>
                <p>• Automatically initiates 11 connected enterprise phases.</p>
                <p>• Connects CEO charter &rarr; PM &rarr; Team Lead &rarr; Employees &rarr; QA &rarr; Delivery &rarr; Stripe Treasury.</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white font-bold shadow-md shadow-[#4F7CFF]/20"
                >
                  Launch Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
