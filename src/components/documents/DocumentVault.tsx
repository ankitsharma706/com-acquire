import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  Eye,
  Shield,
  Tag,
  Lock,
  Sparkles,
  FolderOpen,
  Filter,
  FileCode,
  FileCheck,
  Building,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { CompanyDocument, DocumentCategory, SecurityClassification } from '../../types';

export const DocumentVault: React.FC = () => {
  const {
    documents,
    uploadDocument,
    deleteDocument,
    currentRole,
    currentUser,
    setIsAiDrawerOpen,
    setAiInitialPrompt,
  } = useCompany();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CompanyDocument | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Company Policies');
  const [newClassification, setNewClassification] = useState<SecurityClassification>('Internal');
  const [newDepartment, setNewDepartment] = useState('All Company');
  const [newFileType, setNewFileType] = useState<'PDF' | 'DOCX' | 'XLSX' | 'MARKDOWN'>('PDF');
  const [newSummary, setNewSummary] = useState('');
  const [newTags, setNewTags] = useState('Executive, Compliance');

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesClassification =
      selectedClassification === 'All' || doc.securityClassification === selectedClassification;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClassification && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    uploadDocument({
      title: newTitle,
      category: newCategory,
      securityClassification: newClassification,
      department: newDepartment,
      fileType: newFileType,
      size: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
      summary: newSummary || 'Enterprise documentation uploaded to secure cloud vault.',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTitle('');
    setNewSummary('');
    setIsUploadModalOpen(false);
  };

  const getClassificationBadge = (classification: SecurityClassification) => {
    switch (classification) {
      case 'Restricted / CEO Only':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'Confidential':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Internal':
        return 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const handleSummarizeWithAi = (doc: CompanyDocument) => {
    setAiInitialPrompt(
      `Please provide an executive summary, key risk factors, and actionable items from the company document titled "${doc.title}" (Category: ${doc.category}, Security: ${doc.securityClassification}).\n\nSummary context: ${doc.summary}`
    );
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1424] via-[#15223D] to-[#0D1424] border border-[#4F7CFF]/25 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Encrypted Document Vault & Knowledge Base
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                AES-256 + RBAC Access
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Company Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Secure enterprise repository for master contracts, financial invoices, executive board minutes, ISO/SOC-2 policies, and AI-summarized project wikis.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white text-xs font-bold transition-all shadow-md shadow-[#4F7CFF]/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Storage Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Vault Files</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">
              {documents.length} <span className="text-xs text-slate-400 font-normal">assets</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Encrypted Storage</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-[#00D9FF] mt-0.5 block">
              42.8 <span className="text-xs text-slate-400 font-normal">GB / 1 TB</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Confidential / Restricted</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-0.5 block">
              {documents.filter((d) => d.securityClassification !== 'Public').length} <span className="text-xs text-slate-400 font-normal">files</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Audit Reads</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {documents.reduce((acc, d) => acc + d.downloadCount, 0)} <span className="text-xs text-slate-400 font-normal">downloads</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0D1424]/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            'All',
            'Contracts & MSA',
            'Invoices & Billing',
            'Company Policies',
            'Project Wikis & Docs',
            'Executive Reports',
            'Meeting Notes & AI Summaries',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#4F7CFF] text-white shadow-sm shadow-[#4F7CFF]/30'
                  : 'bg-[#141B2D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#141B2D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Classification Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents, tags, summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] w-48 sm:w-60"
            />
          </div>

          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#00D9FF]"
          >
            <option value="All">All Classifications</option>
            <option value="Public">Public</option>
            <option value="Internal">Internal</option>
            <option value="Confidential">Confidential</option>
            <option value="Restricted / CEO Only">Restricted / CEO Only</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#0D1424]/60 border border-slate-800/80">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No documents found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category or search filter.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 hover:border-[#4F7CFF]/40 transition-all shadow-lg flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#141E33] border border-slate-700 flex items-center justify-center text-[#00D9FF] font-mono font-bold text-xs shrink-0">
                    {doc.fileType}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border ${getClassificationBadge(
                      doc.securityClassification
                    )}`}
                  >
                    {doc.securityClassification}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                    {doc.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {doc.category} • v{doc.version} • {doc.size}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{doc.summary}</p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {doc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">
                  By {doc.uploadedBy} • {doc.uploadedAt}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSummarizeWithAi(doc)}
                    className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 transition-all"
                    title="Summarize with AI Copilot"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg bg-[#00D9FF]/15 hover:bg-[#00D9FF]/25 text-[#00D9FF] border border-[#00D9FF]/30 transition-all"
                    title="Inspect & Preview Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                    title="Archive Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Preview Drawer / Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0D1424] border border-[#4F7CFF]/40 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-white">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Category</span>
                  <span className="text-slate-200 font-semibold">{previewDoc.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Classification</span>
                  <span className="text-[#00D9FF] font-semibold">{previewDoc.securityClassification}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">File Size</span>
                  <span className="text-slate-200 font-semibold">{previewDoc.size} ({previewDoc.fileType})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Version</span>
                  <span className="text-emerald-400 font-mono font-semibold">v{previewDoc.version}</span>
                </div>
              </div>

              {/* Simulated Rendered Preview */}
              <div className="p-4 rounded-xl bg-[#080B12] border border-slate-800 space-y-2 font-mono text-[11px] text-slate-300">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>COMPANYHQ SECURE DOCUMENT VIEWER</span>
                  <span className="text-emerald-400">HASH: SHA256-VALIDATED</span>
                </div>
                <p className="text-white font-bold text-xs pt-1">{previewDoc.title}</p>
                <p className="text-slate-300 leading-relaxed">{previewDoc.summary}</p>
                <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-slate-400 space-y-1">
                  <p>• Verified Authorization Signatures: Alexander Hayes (CEO), Marcus Vance (COO)</p>
                  <p>• Multi-region replicate: us-east-1, eu-central-1, ap-southeast-1</p>
                  <p>• Retention Schedule: 7-Year Statutory Enterprise Archive</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={() => {
                  const target = previewDoc;
                  setPreviewDoc(null);
                  handleSummarizeWithAi(target);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI to Summarize</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading "${previewDoc.title}" (${previewDoc.fileType})...`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white font-bold text-xs shadow-md shadow-[#4F7CFF]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1424] border border-[#4F7CFF]/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-white">Upload Document to Vault</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Services Agreement 2026 - Acme Global"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vault Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Contracts & MSA">Contracts & MSA</option>
                    <option value="Invoices & Billing">Invoices & Billing</option>
                    <option value="Company Policies">Company Policies</option>
                    <option value="Project Wikis & Docs">Project Wikis & Docs</option>
                    <option value="Executive Reports">Executive Reports</option>
                    <option value="Meeting Notes & AI Summaries">Meeting Notes & AI Summaries</option>
                    <option value="Offer Letters">Offer Letters</option>
                    <option value="Payslips & Tax">Payslips & Tax</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Security Level</label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value as SecurityClassification)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Public">Public</option>
                    <option value="Internal">Internal</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Restricted / CEO Only">Restricted / CEO Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">File Format</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="MARKDOWN">MARKDOWN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department Scope</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Metadata Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Legal, Contract, Revenue, Enterprise"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Summary & Notes</label>
                <textarea
                  rows={3}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief synopsis of document contents and key clauses..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141B2D] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1C253D] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#3d68e6] text-white font-bold text-xs shadow-md shadow-[#4F7CFF]/20"
                >
                  Encrypt & Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
