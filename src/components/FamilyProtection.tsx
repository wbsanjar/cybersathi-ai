import React, { useState } from "react";
import { FAMILY_MEMBERS } from "../data";
import { FamilyMember } from "../types";
import { Users, Shield, Heart, Plus, Phone, X, Clock, AlertTriangle, CheckCircle, UserPlus, Activity, ShieldCheck, Sparkles, MessageCircle, Award, Eye, Mail } from "lucide-react";

const FAMILY_TIPS = [
  { icon: Shield, title: "Enable 2FA", desc: "Enable two-factor authentication on all family members' social media and banking apps." },
  { icon: Eye, title: "Monitor Activity", desc: "Regularly check bank statements and UPI transaction history for unauthorized debits." },
  { icon: MessageCircle, title: "Verify Calls", desc: "Teach family to never share OTP/PIN over phone. Always verify caller identity through official channels." },
  { icon: Mail, title: "Spot Phishing", desc: "Educate about suspicious emails and SMS. Never click unknown links promising rewards or threatening account blocks." },
  { icon: Phone, title: "Report Numbers", desc: "Save 1930 (Cyber Crime) and 155260 (Payment Fraud) on all family phones for quick reporting." },
  { icon: Clock, title: "Regular Scans", desc: "Scan suspicious messages and URLs through CyberSathi before interacting with them." }
];

const FAMILY_ACTIVITIES = [
  { id: "act-1", type: "scan", member: "Sunita Verma", action: "Scanned a suspicious SMS", time: "2 hours ago", status: "safe" },
  { id: "act-2", type: "alert", member: "Rajesh Verma", action: "Blocked a phishing URL", time: "5 hours ago", status: "blocked" },
  { id: "act-3", type: "tip", member: "Priya Verma", action: "Completed cyber awareness quiz", time: "1 day ago", status: "completed" },
  { id: "act-4", type: "scan", member: "Sunita Verma", action: "UPI payment address verified", time: "1 day ago", status: "safe" },
  { id: "act-5", type: "alert", member: "Rajesh Verma", action: "WhatsApp scam attempt reported", time: "3 days ago", status: "blocked" }
];

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400";
  const bgColor = score >= 70 ? "border-emerald-500/30 bg-emerald-500/5" : score >= 40 ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5";
  const label = score >= 70 ? "Safe" : score >= 40 ? "At Risk" : "Critical";

  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border ${bgColor}`}>
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
          <circle
            cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3"
            strokeDasharray={`${score * 0.87} 100`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold ${color}`}>
          {score}
        </span>
      </div>
      <div>
        <span className={`text-[10px] font-bold font-mono ${color}`}>{label}</span>
      </div>
    </div>
  );
}

export default function FamilyProtection() {
  const [members, setMembers] = useState<FamilyMember[]>(FAMILY_MEMBERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relation: "", phone: "" });

  const overallScore = Math.round(members.reduce((sum, m) => sum + m.cyberScore, 0) / members.length);
  const activeMembers = members.filter((m) => m.isActive).length;
  const criticalMembers = members.filter((m) => m.cyberScore < 40).length;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.relation) return;
    const member: FamilyMember = {
      id: `fm-${Date.now()}`,
      name: newMember.name,
      relation: newMember.relation,
      phone: newMember.phone || "+91 9XXXXXXXXX",
      cyberScore: 50,
      isActive: true,
      lastScan: "Just now"
    };
    setMembers((prev) => [...prev, member]);
    setNewMember({ name: "", relation: "", phone: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-cyan-500/15 text-cyan-400 rounded-xl border border-cyan-500/25">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Family Protection</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl mt-1">
                Monitor and protect your family members from cyber threats. Track cyber scores, scan suspicious messages, and stay alert together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">FAMILY SCORE</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{overallScore}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Overall family protection score</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">MEMBERS</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{members.length}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">{activeMembers} active members</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">CRITICAL</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{criticalMembers}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Members need attention</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">PROTECTED</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{members.filter((m) => m.cyberScore >= 70).length}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Members with safe score</p>
        </div>
      </div>

      {/* Family Members Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">Family Members</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="glass-btn-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const scoreColor = member.cyberScore >= 70 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : member.cyberScore >= 40 ? "text-amber-400 border-amber-500/20 bg-amber-500/10" : "text-red-400 border-red-500/20 bg-red-500/10";
            const scoreLabel = member.cyberScore >= 70 ? "Safe" : member.cyberScore >= 40 ? "At Risk" : "Critical";

            return (
              <div key={member.id} className="glass-card glass-card-hover rounded-xl p-5 relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{member.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{member.relation}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${member.isActive ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-slate-500 border-white/10 bg-white/5"}`}>
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-400 font-mono">{member.phone}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <ScoreGauge score={member.cyberScore} />
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 font-mono block">Last Scan</span>
                    <span className="text-[10px] text-slate-400 font-mono">{member.lastScan}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 text-[10px] font-mono bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg transition-all">
                    View Details
                  </button>
                  <button className="flex-1 text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-400 py-1.5 rounded-lg transition-all">
                    Run Scan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Tips + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safety Tips */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Family Safety Tips</span>
          </h3>
          <div className="space-y-3">
            {FAMILY_TIPS.map((tip, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 rounded-lg p-3 flex gap-3 hover:border-white/10 transition-all">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 h-fit">
                  <tip.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-semibold">{tip.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {FAMILY_ACTIVITIES.map((act) => {
              const statusIcon = act.status === "safe" ? CheckCircle : act.status === "blocked" ? Shield : Award;
              const statusColor = act.status === "safe" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : act.status === "blocked" ? "text-red-400 border-red-500/20 bg-red-500/10" : "text-cyan-400 border-cyan-500/20 bg-cyan-500/10";
              const StatusIcon = statusIcon;

              return (
                <div key={act.id} className="bg-white/2 border border-white/5 rounded-lg p-3 flex items-start gap-3 hover:border-white/10 transition-all">
                  <div className={`p-1.5 rounded-lg border ${statusColor}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-xs font-semibold truncate">{act.member}</span>
                      <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{act.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div
            className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-lg">Add Family Member</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 relative">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Verma"
                  value={newMember.name}
                  onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full glass-input rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1.5">Relation</label>
                <select
                  required
                  value={newMember.relation}
                  onChange={(e) => setNewMember((prev) => ({ ...prev, relation: e.target.value }))}
                  className="w-full glass-input rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono appearance-none"
                >
                  <option value="" disabled className="bg-slate-900">Select relation</option>
                  <option value="Mother" className="bg-slate-900">Mother</option>
                  <option value="Father" className="bg-slate-900">Father</option>
                  <option value="Sister" className="bg-slate-900">Sister</option>
                  <option value="Brother" className="bg-slate-900">Brother</option>
                  <option value="Spouse" className="bg-slate-900">Spouse</option>
                  <option value="Child" className="bg-slate-900">Child</option>
                  <option value="Grandparent" className="bg-slate-900">Grandparent</option>
                  <option value="Other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={newMember.phone}
                  onChange={(e) => setNewMember((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full glass-input rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button type="submit" className="w-full glass-btn-primary py-3 rounded-lg text-sm font-bold font-mono tracking-wide">
                Add to Family Protection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
