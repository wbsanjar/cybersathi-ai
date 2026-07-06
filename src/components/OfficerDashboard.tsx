import React, { useState } from "react";
import { AuthUser, OfficerCase } from "../types";
import { OFFICER_CASES, CASE_STATS } from "../roleData";
import { Shield, FileText, Search, Filter, ChevronRight, Eye, Clock, CheckCircle, XCircle, AlertTriangle, MapPin, Users, Scale, BadgePercent, ArrowUpRight, Phone, Mail, Calendar, MessageSquare } from "lucide-react";

const statusColor = (s: string) => {
  const c: Record<string, string> = {
    assigned: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    investigating: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    under_review: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dismissed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return c[s] || c.assigned;
};

const priorityColor = (p: string) => {
  const c: Record<string, string> = { low: "text-slate-400", medium: "text-amber-400", high: "text-orange-400", critical: "text-red-400" };
  return c[p] || c.low;
};

export default function OfficerDashboard({ user }: { user: AuthUser }) {
  const [filter, setFilter] = useState<"all" | "assigned" | "investigating" | "under_review" | "resolved">("all");
  const [search, setSearch] = useState("");

  const filtered = OFFICER_CASES.filter(c => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch = c.caseNumber.toLowerCase().includes(search.toLowerCase()) || c.complainantName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const activeCases = OFFICER_CASES.filter(c => c.status !== "resolved" && c.status !== "dismissed");
  const criticalCount = OFFICER_CASES.filter(c => c.priority === "critical" && c.status !== "resolved").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Cyber Officer Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{user.badgeNumber} • {user.jurisdiction} Jurisdiction</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Online</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-lg transition cursor-pointer">
            <MapPin className="w-3 h-3" /> Fraud Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Active Cases</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><FileText className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">{activeCases.length}</span>
          <p className="text-[10px] text-cyan-400 font-mono mt-1">{criticalCount} critical priority</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Resolved</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">{OFFICER_CASES.filter(c => c.status === "resolved").length}</span>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">This month</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Amount Involved</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"><BadgePercent className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">₹{OFFICER_CASES.reduce((s, c) => s + c.amount, 0).toLocaleString()}</span>
          <p className="text-[10px] text-amber-400 font-mono mt-1">Total across cases</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Clearance Rate</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20"><ArrowUpRight className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">{Math.round(OFFICER_CASES.filter(c => c.status === "resolved").length / OFFICER_CASES.length * 100)}%</span>
          <p className="text-[10px] text-violet-400 font-mono mt-1">Avg. {CASE_STATS.avgResolutionDays} days resolution</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Assigned Cases
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">{filtered.length} cases • Sorted by priority</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case # or name..." className="pl-6 pr-2 py-1 text-[10px] bg-white/5 border border-white/10 rounded text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 font-mono w-36" />
            </div>
            <div className="flex bg-white/2 p-0.5 rounded-lg border border-white/5">
              {(["all", "assigned", "investigating", "under_review", "resolved"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-[9px] font-mono font-semibold rounded transition ${filter === f ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" : "text-slate-500 hover:text-white"}`}>
                  {f === "under_review" ? "Review" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="p-3.5 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-amber-400/60 font-bold">{c.caseNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusColor(c.status)}`}>{c.status}</span>
                    <span className={`text-[9px] font-bold font-mono ${priorityColor(c.priority)}`}>■ {c.priority.toUpperCase()}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.assignedAt}</span>
                  </div>
                  <h4 className="text-white font-semibold text-xs mb-0.5">{c.complainantName} — {c.type}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-1.5">{c.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.complainantPhone}</span>
                    {c.amount > 0 && <span>Amount: <span className="text-amber-400 font-bold">₹{c.amount.toLocaleString()}</span></span>}
                    <span>{c.evidenceCount} evidence items</span>
                    {c.resolution && <span className="text-emerald-400">✓ {c.resolution}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition cursor-pointer" title="View Evidence">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition cursor-pointer" title="Update Status">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            High Priority Cases
          </h3>
          <div className="space-y-2">
            {OFFICER_CASES.filter(c => c.priority === "critical" || c.priority === "high").slice(0, 4).map(c => (
              <div key={c.id} className="flex items-start gap-2.5 p-2.5 bg-white/2 border border-white/5 rounded-lg">
                <div className={`p-1 rounded ${c.priority === "critical" ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400"}`}>
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200">{c.caseNumber} — {c.type}</p>
                  <span className="text-[9px] text-slate-500 font-mono">{c.complainantName} • ₹{c.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FileText, label: "New Case File", color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10 hover:bg-cyan-500/10" },
              { icon: Eye, label: "Review Evidence", color: "text-amber-400 bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10" },
              { icon: CheckCircle, label: "Update Status", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10" },
              { icon: MapPin, label: "View Heatmap", color: "text-purple-400 bg-purple-500/5 border-purple-500/10 hover:bg-purple-500/10" },
            ].map((a, i) => (
              <button key={i} className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-mono transition cursor-pointer ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
