import React, { useState } from 'react';
import {
  UserPlus,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Star,
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  DollarSign,
  Award,
  X,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { Candidate, CandidateStage, JobPosting } from '../../types';

export const HiringPipeline: React.FC = () => {
  const {
    candidates,
    jobPostings,
    currentRole,
    advanceCandidateStage,
    hireCandidate,
    generateOfferLetter,
    postNewJob,
    selectedCandidate,
    setSelectedCandidate,
    triggerConfettiEffect,
  } = useCompany();

  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // New Job Opening State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('development');
  const [newJobSalary, setNewJobSalary] = useState('$160,000 - $200,000');
  const [newJobOpenings, setNewJobOpenings] = useState(2);

  // Offer Letter State
  const [offerSalary, setOfferSalary] = useState(195000);
  const [offerEquity, setOfferEquity] = useState('1.2%');

  const pipelineStages: { id: CandidateStage; label: string; color: string }[] = [
    { id: 'Applied', label: 'Applied', color: '#64748B' },
    { id: 'Screening', label: 'Screening', color: '#818CF8' },
    { id: 'Interview', label: 'Leadership Sync', color: '#00D9FF' },
    { id: 'Technical Round', label: 'System Design', color: '#F59E0B' },
    { id: 'HR Round', label: 'Culture & Fit', color: '#EC4899' },
    { id: 'Selected', label: 'Offer Extended', color: '#00C853' },
  ];

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    postNewJob({
      title: newJobTitle,
      departmentId: newJobDept as any,
      salaryRange: newJobSalary,
      openings: Number(newJobOpenings),
    });

    setNewJobTitle('');
    setIsPostJobModalOpen(false);
    triggerConfettiEffect();
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    generateOfferLetter(selectedCandidate.id, Number(offerSalary), offerEquity);
    setIsOfferModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Talent Acquisition & Hiring Funnel
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/20 text-[#00D9FF]">
              {candidates.length} ACTIVE APPLICANTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage candidates through screening, technical assessments, and generate official electronic offer letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(currentRole === 'CEO' || currentRole === 'HR_MANAGER') && (
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Post Job Opening</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Job Requisitions Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {jobPostings.map((job) => (
          <div key={job.id} className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400 font-bold uppercase">{job.status}</span>
              <span>{job.openings} Openings</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-1">{job.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{job.salaryRange}</p>
          </div>
        ))}
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto">
        {pipelineStages.map((stage) => {
          const candsInStage = candidates.filter((c) => c.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="p-3.5 rounded-2xl bg-[#0B0F19]/80 border border-slate-800/80 flex flex-col min-h-[420px]"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                    {stage.label}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {candsInStage.length}
                </span>
              </div>

              <div className="space-y-2.5 mt-3 flex-1 overflow-y-auto">
                {candsInStage.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className="p-3 rounded-xl bg-[#141B2D] border border-[#4F7CFF]/15 hover:border-[#00D9FF]/40 cursor-pointer transition-all group relative"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                          {cand.name}
                        </h4>
                        <p className="text-[10px] text-slate-400">{cand.targetRole}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">{cand.experience}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {cand.rating}/5.0
                      </span>
                    </div>

                    {/* Stage quick advance action */}
                    {stage.id === 'Selected' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          hireCandidate(cand.id);
                          triggerConfettiEffect();
                        }}
                        className="w-full mt-2.5 py-1 px-2 rounded-lg bg-[#00C853] hover:bg-[#00B04A] text-slate-950 font-extrabold text-[10px] transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Hire to Team</span>
                      </button>
                    ) : (
                      <div className="mt-2.5 flex gap-1">
                        <select
                          value={cand.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            advanceCandidateStage(cand.id, e.target.value as any);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Advance Candidate Stage"
                          className="w-full bg-[#0B0F19] border border-slate-700 text-[10px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer font-mono"
                        >
                          {pipelineStages.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move to: {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Candidate Detail Drawer / Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#00D9FF] shadow-lg"
              />
              <div>
                <h2 className="text-xl font-extrabold text-white">{selectedCandidate.name}</h2>
                <p className="text-xs text-[#00D9FF] font-semibold">{selectedCandidate.targetRole}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Applied: {selectedCandidate.appliedDate} • {selectedCandidate.experience} Experience
                </p>
              </div>
            </div>

            {/* Candidate Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 p-3 rounded-2xl bg-[#0B0F19] border border-slate-800 text-center font-mono">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Interview Score</p>
                <p className="text-sm font-extrabold text-amber-400 mt-0.5">
                  ★ {selectedCandidate.rating} / 5.0
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Expected Salary</p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  ${selectedCandidate.expectedSalary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Current Stage</p>
                <p className="text-sm font-extrabold text-[#00D9FF] mt-0.5">
                  {selectedCandidate.stage}
                </p>
              </div>
            </div>

            {/* Skills & Notes */}
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-300 mb-1.5">Core Technical Proficiencies</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#0B0F19] text-[#00D9FF] border border-slate-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Offer details if generated */}
            {selectedCandidate.offerDetails && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Official Offer Dispatched</span>
                  <span className="font-mono">${selectedCandidate.offerDetails.salary.toLocaleString()} + {selectedCandidate.offerDetails.equity} Equity</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Start Date: {selectedCandidate.offerDetails.startDate}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] border border-[#4F7CFF]/30 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Compose Offer Package</span>
              </button>

              <button
                onClick={() => {
                  hireCandidate(selectedCandidate.id);
                  setSelectedCandidate(null);
                  triggerConfettiEffect();
                }}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#00C853] to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Hire to Roster</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Offer Modal */}
      {isOfferModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Generate Electronic Offer</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create an official compensation package for {selectedCandidate.name}.
            </p>

            <form onSubmit={handleOfferSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Base Salary ($ / Year)</label>
                <input
                  type="number"
                  value={offerSalary}
                  onChange={(e) => setOfferSalary(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Stock Equity Grant</label>
                <input
                  type="text"
                  value={offerEquity}
                  onChange={(e) => setOfferEquity(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Dispatch Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white">Post Job Requisition</h2>
            <p className="text-xs text-slate-400 mt-0.5">Open a new career position for CompanyHQ.</p>

            <form onSubmit={handlePostJobSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Machine Learning Engineer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Compensation Range</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Open Headcount</label>
                  <input
                    type="number"
                    value={newJobOpenings}
                    onChange={(e) => setNewJobOpenings(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
