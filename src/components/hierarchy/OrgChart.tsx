import React, { useState } from 'react';
import {
  Network,
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  Building,
  UserCheck,
  Award,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { Employee, DepartmentId } from '../../types';

export const OrgChart: React.FC = () => {
  const { employees, rooms, currentRole, setSelectedEmployee, setActiveTab } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentId | 'all'>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'emp-ceo-1': true,
    'emp-dev-lead': true,
    'emp-dsn-lead': true,
    'emp-fin-lead': true,
    'emp-hr-lead': true,
  });

  const ceo = employees.find((e) => e.userRoleType === 'CEO') || employees[0];
  const departmentLeads = employees.filter((e) => e.isTeamLead && e.id !== ceo.id);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getReports = (managerId: string) => {
    return employees.filter(
      (e) => e.reportingManagerId === managerId || (e.departmentId === managerId && e.id !== managerId)
    );
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || e.departmentId === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-5 rounded-2xl border border-[#4F7CFF]/20">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Organization Hierarchy & Reporting Tree
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive enterprise hierarchy with real-time reporting relationships, team leads, and department rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search member or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value as any)}
            aria-label="Filter Hierarchy by Department"
            className="h-9 px-3 rounded-xl bg-[#141B2D] border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments ({employees.length})</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Hierarchy Tree View */}
      <div className="p-8 rounded-3xl bg-[#0B0F19] border border-[#4F7CFF]/20 overflow-x-auto shadow-2xl">
        <div className="min-w-[800px] flex flex-col items-center">
          {/* Level 0: CEO Node */}
          <div className="relative flex flex-col items-center">
            <div
              onClick={() => {
                setSelectedEmployee(ceo);
                setActiveTab('hr');
              }}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#141B2D] to-[#1C253D] border-2 border-[#00D9FF] shadow-xl shadow-[#00D9FF]/20 hover:scale-105 transition-all cursor-pointer w-72 text-center relative group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Crown className="w-3 h-3" /> CHIEF EXECUTIVE (ADMIN)
              </div>

              <div className="flex flex-col items-center mt-1">
                <img
                  src={ceo.avatar}
                  alt={ceo.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#00D9FF] shadow-lg mb-2"
                />
                <h3 className="text-base font-extrabold text-white">{ceo.name}</h3>
                <p className="text-xs text-[#00D9FF] font-semibold">{ceo.role}</p>
                <p className="text-[11px] text-slate-400 mt-1">{ceo.location}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 w-full flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">Score: {ceo.performanceRating}%</span>
                  <span className="text-slate-400">Salary: ${ceo.salary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Vertical connector line */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-[#00D9FF] to-[#4F7CFF]" />
          </div>

          {/* Horizontal branching line */}
          <div className="w-[85%] h-0.5 bg-[#4F7CFF]/50 relative mb-8" />

          {/* Level 1: Department Heads & Team Leads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
            {departmentLeads.map((lead) => {
              const subMembers = employees.filter(
                (e) => e.departmentId === lead.departmentId && e.id !== lead.id
              );
              const isExpanded = expandedNodes[lead.id];

              return (
                <div key={lead.id} className="flex flex-col items-center">
                  {/* Lead Node Card */}
                  <div
                    onClick={() => {
                      setSelectedEmployee(lead);
                      setActiveTab('hr');
                    }}
                    className="p-4 rounded-2xl bg-[#141B2D] border border-[#4F7CFF]/30 hover:border-[#00D9FF] transition-all cursor-pointer w-full text-center group shadow-md"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[#00D9FF] uppercase font-bold">
                        {lead.departmentName}
                      </span>
                      <span className="text-emerald-400">{lead.performanceRating}%</span>
                    </div>

                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 mx-auto mb-2"
                    />

                    <h4 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                      {lead.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{lead.role}</p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{subMembers.length} Direct Reports</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNode(lead.id);
                        }}
                        className="text-[#00D9FF] hover:underline font-semibold flex items-center gap-0.5"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>

                  {/* Level 2: Sub-team members */}
                  {isExpanded && subMembers.length > 0 && (
                    <div className="mt-4 space-y-2 w-full pl-2 border-l-2 border-[#4F7CFF]/20">
                      {subMembers.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            setSelectedEmployee(sub);
                            setActiveTab('hr');
                          }}
                          className="p-2.5 rounded-xl bg-[#0B0F19]/80 border border-slate-800/80 hover:border-[#4F7CFF]/40 cursor-pointer flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={sub.avatar}
                              alt={sub.name}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                            <div className="text-left">
                              <p className="text-xs font-semibold text-white">{sub.name}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{sub.role}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {sub.performanceRating}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
