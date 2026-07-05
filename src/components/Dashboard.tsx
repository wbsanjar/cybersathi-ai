import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { LIVE_THREATS } from "../data";
import { Shield, AlertTriangle, CheckCircle, Clock, ShieldCheck, Terminal, Users, Radio, ArrowUpRight } from "lucide-react";

// Pie chart data for fraud types
const FRAUD_BREAKDOWN_DATA = [
  { name: "UPI QR Scams", value: 38, color: "#00E5FF" },
  { name: "Phishing URLs", value: 29, color: "#7C3AED" },
  { name: "SMS / OTP Fraud", value: 18, color: "#F59E0B" },
  { name: "Voice call / Deepfake", value: 10, color: "#EF4444" },
  { name: "Fake Payment Apps", value: 5, color: "#22C55E" }
];

// Timeline area chart data for weekly attacks
const WEEKLY_ATTACKS_DATA = [
  { day: "Mon", detected: 4200, blocked: 3950 },
  { day: "Tue", detected: 4800, blocked: 4610 },
  { day: "Wed", detected: 5100, blocked: 4920 },
  { day: "Thu", detected: 4900, blocked: 4700 },
  { day: "Fri", detected: 6200, blocked: 5980 },
  { day: "Sat", detected: 5500, blocked: 5320 },
  { day: "Sun", detected: 5800, blocked: 5650 }
];

interface DashboardProps {
  userQuizScore?: number;
  scanHistoryCount?: number;
}

export default function Dashboard({ userQuizScore = 80, scanHistoryCount = 0 }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"charts" | "feed" | "logs">("charts");
  const [logs, setLogs] = useState([
    { id: 1, time: "02:30:14", type: "SCAN", msg: "Multimodal QR payment address SBI-Merchant verified Suspicious" },
    { id: 2, time: "02:29:45", type: "INTEL", msg: "Lookalike domain 'sbi-card-verify.net' added to blacklist" },
    { id: 3, time: "02:28:10", type: "OCR", msg: "Paytm fake alert receipt text spacing mismatch flagged as Forgery" },
    { id: 4, time: "02:24:51", type: "CHAT", msg: "Chat interaction: advice given on FedEx SMS scam" },
    { id: 5, time: "02:20:00", type: "SYSTEM", msg: "Gemini 3.5 Flash security models re-synchronized" }
  ]);

  // Dynamically calculate user risk level based on quiz score (higher quiz score = lower risk)
  const calculatedRiskScore = Math.max(10, 100 - userQuizScore);
  let riskLabel = "Low Risk";
  let riskColor = "text-emerald-400";
  let riskBg = "bg-emerald-500/10 border-emerald-500/20";
  
  if (calculatedRiskScore > 65) {
    riskLabel = "High Risk";
    riskColor = "text-red-400";
    riskBg = "bg-red-500/10 border-red-500/20";
  } else if (calculatedRiskScore > 35) {
    riskLabel = "Medium Risk";
    riskColor = "text-amber-400";
    riskBg = "bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div className="space-y-8" id="dashboard-main-section">
      
      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card glass-card-hover rounded-xl p-4 relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">TODAY'S THREATS</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">1,482</span>
            <span className="text-xs text-red-400 flex items-center font-mono">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Active phishing URLs & scams</p>
        </div>

        <div className="glass-card glass-card-hover rounded-xl p-4 relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">BLOCKED SCAMS</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">48,210</span>
            <span className="text-xs text-cyan-400 flex items-center font-mono">
              +8% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">UPI & SMS fraud stopped</p>
        </div>

        <div className="glass-card glass-card-hover rounded-xl p-4 relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">REPORTS FILED</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">8,245</span>
            <span className="text-xs text-amber-400 flex items-center font-mono">
              +19% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Forwarded to Cyber Crime cell</p>
        </div>

        <div className="glass-card glass-card-hover rounded-xl p-4 relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold font-mono">THREAT LEVEL</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">ELEVATED</span>
            <span className="text-xs text-slate-400 font-mono">Stable</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">National fraud database monitor</p>
        </div>

      </div>

      {/* Middle Grid: Interactive Risk Gauge & Visual Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Score Widget */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-base mb-1">AI Risk Assessment Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Our AI evaluates your personal cyber security awareness based on your active scans and quiz score.
            </p>
          </div>

          {/* Radial representation */}
          <div className="relative flex flex-col items-center my-6">
            <div className="w-32 h-32 rounded-full border-4 border-slate-850 flex flex-col items-center justify-center relative">
              {/* Overlay half borders */}
              <div 
                className={`absolute inset-0 rounded-full border-4 border-transparent transition-all duration-500 ${
                  calculatedRiskScore > 65 
                    ? "border-t-red-500 border-r-red-500" 
                    : calculatedRiskScore > 35 
                    ? "border-t-amber-500 border-r-amber-500" 
                    : "border-t-cyan-400 border-r-cyan-400"
                }`}
                style={{ transform: `rotate(${calculatedRiskScore * 3.6}deg)` }}
              ></div>
              <span className="text-3xl font-extrabold text-white font-mono">{calculatedRiskScore}</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">SCORE</span>
            </div>

            <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold border font-mono ${riskBg} ${riskColor}`}>
              {riskLabel} ({calculatedRiskScore}% Vulnerability Index)
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-xl p-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 mb-1.5 text-white font-semibold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>CyberSathi Assessment</span>
            </div>
            {calculatedRiskScore > 65 
              ? "Urgent: Your profile has high exposure to fraud. Take our Cyber Awareness Quiz and run active scans on incoming texts to secure yourself." 
              : calculatedRiskScore > 35 
              ? "Medium: You are fairly secure. Always inspect payment receipts and URL addresses before typing credentials." 
              : "Excellent: Your awareness score is stellar. Keep using CyberSathi scanners to filter external threats."}
          </div>
        </div>

        {/* Charts & Interactive break-out panels */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-white font-bold text-base">Cyber Attack intelligence & Analytics</h3>
              <p className="text-xs text-slate-400 font-mono">Live telemetry from cyber crime databases</p>
            </div>
            <div className="flex bg-white/2 p-1 rounded-lg border border-white/5 self-start backdrop-blur-sm">
              <button
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all font-mono ${
                  activeTab === "charts" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("charts")}
                id="tab-charts"
              >
                Attack Trends
              </button>
              <button
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all font-mono ${
                  activeTab === "feed" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("feed")}
                id="tab-feed"
              >
                Intelligence Feed
              </button>
              <button
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all font-mono ${
                  activeTab === "logs" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("logs")}
                id="tab-logs"
              >
                AI Model Logs
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            {activeTab === "charts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                
                {/* Area timeline chart */}
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-mono text-slate-400 block mb-2">Weekly Incidents Blocked</span>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={WEEKLY_ATTACKS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <XAxis dataKey="day" stroke="#475569" fontSize={10} fontStyle="italic" />
                        <YAxis stroke="#475569" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#fff" }} />
                        <Area type="monotone" dataKey="detected" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="blocked" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 text-[10px] font-mono justify-center mt-2">
                    <span className="flex items-center gap-1 text-violet-400"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Detected Attempts</span>
                    <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Successfully Blocked</span>
                  </div>
                </div>

                {/* Pie breakdown */}
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-mono text-slate-400 block mb-2">Fraud Categories Share</span>
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={FRAUD_BREAKDOWN_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {FRAUD_BREAKDOWN_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend list */}
                  <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-400 mt-2">
                    {FRAUD_BREAKDOWN_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="truncate">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === "feed" && (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {LIVE_THREATS.map((item) => (
                  <div key={item.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex gap-3 items-start hover:border-white/10 transition-all">
                    <div className="p-2 rounded bg-white/5 border border-white/5 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-xs truncate">{item.title}</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-900/40">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex gap-4 text-[9px] font-mono text-slate-500 mt-1.5">
                        <span>Target: {item.target}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "logs" && (
              <div className="bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-xs text-cyan-400 min-h-[250px] flex flex-col justify-between backdrop-blur-md">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-slate-400 font-bold">
                    <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>CyberSathi AI Security Core Engine Log</span>
                  </div>
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-2.5 leading-relaxed hover:bg-slate-900 p-0.5 rounded transition">
                      <span className="text-slate-500 select-none">[{log.time}]</span>
                      <span className={`font-bold select-none px-1 rounded text-[9px] ${
                        log.type === "INTEL" ? "bg-red-950 text-red-400 border border-red-900/30" :
                        log.type === "OCR" ? "bg-amber-950 text-amber-400 border border-amber-900/30" :
                        log.type === "SCAN" ? "bg-cyan-950 text-cyan-400 border border-cyan-900/30" : "bg-slate-850 text-slate-400 border border-slate-800"
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-slate-300 truncate">{log.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-600 border-t border-slate-900 pt-2 flex justify-between">
                  <span>SSL STATUS: ACTIVE</span>
                  <span>NODE: CLOUD-API-V2</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
