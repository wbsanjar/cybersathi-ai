import React, { useState } from "react";
import { ScanResult, FraudReport } from "../types";
import { Shield, FileText, AlertTriangle, Clock, CheckCircle, ChevronRight, Search, Filter, ArrowUpRight, MessageSquare, Phone, Bot, ExternalLink } from "lucide-react";

const MOCK_COMPLAINTS: Partial<FraudReport>[] = [
  { id: "FR-2026-0842", type: "UPI QR Scam", description: "Fake QR code at tea stall led to unauthorized ₹4,500 deduction from GPay.", amount: 4500, status: "investigating", date: "2026-07-04" },
  { id: "FR-2026-0835", type: "Phishing Link", description: "SBI KYC SMS link. Reported via 1930. Under investigation.", amount: 0, status: "investigating", date: "2026-07-02" },
  { id: "FR-2026-0821", type: "Investment Scam", description: "Telegram task scam. Lost ₹5,000 after initial ₹500 earnings.", amount: 5000, status: "resolved", date: "2026-06-28", resolution: "Amount frozen. Complaint forwarded to cyber cell." },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    investigating: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dismissed: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  };
  return styles[status] || styles.pending;
};

export default function CitizenDashboard({ user }: { user: { fullName: string; email: string } }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_COMPLAINTS.filter(c =>
    c.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Welcome, {user.fullName.split(" ")[0]}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Citizen Cyber Safety Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer">
            <Phone className="w-3.5 h-3.5" />
            SOS 1930
          </button>
          <button className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" />
            AI Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Total Scans</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Shield className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">47</span>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">+12 this week</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Complaints</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"><FileText className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">3</span>
          <p className="text-[10px] text-amber-400 font-mono mt-1">2 active</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Frauds Prevented</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-white">12</span>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">₹1,24,500 saved</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Cyber Score</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20"><AlertTriangle className="w-3.5 h-3.5" /></div>
          </div>
          <span className="text-2xl font-bold text-cyan-400">75/100</span>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Intermediate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-sm">Your Complaint Tracking</h3>
              <p className="text-[10px] text-slate-500 font-mono">Track status of your filed complaints</p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="pl-7 pr-2 py-1 text-[10px] bg-white/5 border border-white/10 rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 font-mono w-36"
              />
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((c) => (
              <div key={c.id} className="p-3 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-cyan-400/60 font-bold">{c.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusBadge(c.status || "")}`}>{c.status}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.date}</span>
                    </div>
                    <h4 className="text-white font-semibold text-xs mb-0.5">{c.type}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                      {(c.amount ?? 0) > 0 && <span>Amount: <span className="text-amber-400 font-bold">₹{(c.amount ?? 0).toLocaleString()}</span></span>}
                      {c.resolution && <span className="text-emerald-400">✓ {c.resolution}</span>}
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-cyan-400" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 text-cyan-300 text-xs font-mono transition cursor-pointer">
                <Shield className="w-3.5 h-3.5" /> AI Scan Suspicious Message
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-300 text-xs font-mono transition cursor-pointer">
                <AlertTriangle className="w-3.5 h-3.5" /> File a Fraud Report
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 text-amber-300 text-xs font-mono transition cursor-pointer">
                <Phone className="w-3.5 h-3.5" /> Emergency SOS
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 text-emerald-300 text-xs font-mono transition cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" /> AI Chatbot Help
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              Recent Activity
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: Shield, color: "text-emerald-400", text: "Link scanned — Safe", time: "2 hrs ago" },
                { icon: FileText, color: "text-cyan-400", text: "Complaint FR-0842 updated", time: "5 hrs ago" },
                { icon: CheckCircle, color: "text-emerald-400", text: "Cyber Quiz completed — 90%", time: "1 day ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`p-1 rounded ${a.color} bg-white/5`}><a.icon className="w-3 h-3" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300">{a.text}</p>
                    <span className="text-[9px] text-slate-600 font-mono">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
