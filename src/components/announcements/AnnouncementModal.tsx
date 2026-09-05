import React, { useState } from 'react';
import { Megaphone, X, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

export const AnnouncementModal: React.FC = () => {
  const {
    isAnnouncementModalOpen,
    setIsAnnouncementModalOpen,
    broadcastAnnouncement,
    rooms,
    triggerConfettiEffect,
  } = useCompany();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isAnnouncementModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    broadcastAnnouncement({
      title,
      content,
      departmentId,
      isUrgent,
    });

    setTitle('');
    setContent('');
    setIsAnnouncementModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141B2D] border border-[#4F7CFF]/30 p-6 shadow-2xl">
        <button
          onClick={() => setIsAnnouncementModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4F7CFF] to-[#00D9FF] text-white shadow-lg shadow-[#4F7CFF]/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Broadcast CEO Directive</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deliver an all-hands priority announcement across all virtual rooms.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Announcement Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Strategic Expansion & New Stock Option Pool"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Target Audience</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all">Company-Wide (All 48 Team Members)</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} Only
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Detailed Message Body</label>
            <textarea
              rows={4}
              required
              placeholder="Provide strategic context, congratulations, or actionable instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#4F7CFF] leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="urgentCheck"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded bg-[#0B0F19] border-slate-700 text-[#4F7CFF] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="urgentCheck" className="text-xs text-slate-300 cursor-pointer select-none">
              Mark as High-Priority Urgent Notification (Pins to top)
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAnnouncementModalOpen(false)}
              className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Publish Directive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
