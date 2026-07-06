import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { ADMIN_DASHBOARD_DATA } from "../data";
import type { AdminUser, FraudReport } from "../types";
import { Shield, Users, FileText, AlertTriangle, Activity, Settings, Search, ChevronRight, Terminal, Cpu, Zap, Clock, CheckCircle, XCircle, Ban, Flag, Eye, Filter, Download, ArrowUpRight, DollarSign, UserCheck, UserX } from "lucide-react";

const TAB_ICONS: Record<string, React.ElementType> = {
  Overview: Activity,
  Users: Users,
  Reports: FileText,
  Alerts: AlertTriangle,
  "AI Logs": Terminal
};

const USER_GROWTH_DATA = [
  { month: "Jan", users: 12400, scans: 35200 },
  { month: "Feb", users: 16200, scans: 41800 },
  { month: "Mar", users: 19800, scans: 48300 },
  { month: "Apr", users: 24500, scans: 56200 },
  { month: "May", users: 31200, scans: 72100 },
  { month: "Jun", users: 38200, scans: 89400 },
  { month: "Jul", users: 45892, scans: 128450 }
];

const SCAM_TYPE_DATA = [
  { name: "UPI QR Scams", value: 32, color: "#00E5FF" },
  { name: "Phishing URLs", value: 26, color: "#7C3AED" },
  { name: "SMS/OTP Fraud", value: 18, color: "#F59E0B" },
  { name: "Investment Scam", value: 14, color: "#EF4444" },
  { name: "Fake Apps", value: 10, color: "#22C55E" }
];

const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@cybersathi.ai", role: "admin", status: "active", lastActive: "2 mins ago", reportsHandled: 342 },
  { id: "u2", name: "Rahul Verma", email: "rahul@cybersathi.ai", role: "moderator", status: "active", lastActive: "15 mins ago", reportsHandled: 187 },
  { id: "u3", name: "Ananya Gupta", email: "ananya@cybersathi.ai", role: "analyst", status: "active", lastActive: "1 hour ago", reportsHandled: 94 },
  { id: "u4", name: "Vikram Singh", email: "vikram@cybersathi.ai", role: "moderator", status: "suspended", lastActive: "2 days ago", reportsHandled: 56 },
  { id: "u5", name: "Neha Patel", email: "neha@cybersathi.ai", role: "analyst", status: "active", lastActive: "3 hours ago", reportsHandled: 128 },
  { id: "u6", name: "Arjun Nair", email: "arjun@cybersathi.ai", role: "admin", status: "active", lastActive: "45 mins ago", reportsHandled: 215 },
  { id: "u7", name: "Sneha Reddy", email: "sneha@cybersathi.ai", role: "analyst", status: "suspended", lastActive: "5 days ago", reportsHandled: 23 },
  { id: "u8", name: "Karan Joshi", email: "karan@cybersathi.ai", role: "moderator", status: "active", lastActive: "30 mins ago", reportsHandled: 161 }
];

const MOCK_REPORTS: FraudReport[] = [
  { id: "FR-2026-0842", userId: "usr-321", userName: "Amit Kumar", type: "UPI QR Scam", description: "Fake QR code at a tea stall led to unauthorized ₹4,500 deduction from GPay.", amount: 4500, status: "pending", date: "2026-07-05", evidenceUrls: [], assignedTo: "Priya Sharma" },
  { id: "FR-2026-0841", userId: "usr-456", userName: "Sunita Devi", type: "Digital Arrest", description: "Caller posed as CBI officer, demanded ₹85,000 via UPI to avoid 'digital arrest'.", amount: 85000, status: "investigating", date: "2026-07-05", evidenceUrls: [], assignedTo: "Rahul Verma" },
  { id: "FR-2026-0840", userId: "usr-789", userName: "Rohan Mehta", type: "Phishing Link", description: "SBI KYC update SMS link stole login credentials. Unauthorized transfer of ₹12,000.", amount: 12000, status: "investigating", date: "2026-07-04", evidenceUrls: [], assignedTo: "Priya Sharma" },
  { id: "FR-2026-0839", userId: "usr-012", userName: "Deepa Roy", type: "Investment Scam", description: "Telegram task scam. Paid ₹5,000 for 'premium tasks' after earning ₹500 initially.", amount: 5000, status: "resolved", date: "2026-07-04", evidenceUrls: [], assignedTo: "Karan Joshi", resolution: "Blocked UPI ID, filed cyber complaint on portal" },
  { id: "FR-2026-0838", userId: "usr-345", userName: "Mohan Lal", type: "Fake App", description: "Installed 'Paytm Merchant APK' from WhatsApp. App stole contacts and SMS data.", amount: 0, status: "dismissed", date: "2026-07-03", evidenceUrls: [], assignedTo: "Neha Patel", resolution: "No financial loss, advised factory reset" },
  { id: "FR-2026-0837", userId: "usr-678", userName: "Kavita Singh", type: "UPI QR Scam", description: "Customer at shop scanned her QR to 'pay' but instead ₹6,200 was debited from her account.", amount: 6200, status: "pending", date: "2026-07-03", evidenceUrls: [] },
  { id: "FR-2026-0836", userId: "usr-901", userName: "Vijay Kumar", type: "SMS/OTP Fraud", description: "Received fake electricity disconnection SMS, called the number and shared OTP. Lost ₹22,000.", amount: 22000, status: "investigating", date: "2026-07-02", evidenceUrls: [], assignedTo: "Arjun Nair" },
  { id: "FR-2026-0835", userId: "usr-234", userName: "Pooja Jain", type: "Phishing Link", description: "Fake Netflix payment page entered card details. Fraudulent transaction of ₹4,999.", amount: 4999, status: "resolved", date: "2026-07-02", evidenceUrls: [], assignedTo: "Rahul Verma", resolution: "Card blocked, chargeback initiated" }
];

const MOCK_ALERTS = [
  { id: "ALT-001", title: "WhatsApp OTP Scam Surge", description: "500% increase in WhatsApp OTP verification scams reported in last 24 hours across Maharashtra.", severity: "critical", source: "CERT-In", timestamp: "2026-07-05 09:30", affected: "50,000+", status: "active" },
  { id: "ALT-002", title: "Fake SBI YONO Phishing Campaign", description: "Mass SMS campaign targeting SBI customers with fake KYC update links.", severity: "high", source: "SBI Security", timestamp: "2026-07-05 07:15", affected: "1,00,000+", status: "active" },
  { id: "ALT-003", title: "Deepfake CEO Fraud Alert", description: "AI-generated voice calls impersonating CEOs at 3 Indian banks reported.", severity: "critical", source: "RBI", timestamp: "2026-07-04 22:00", affected: "500+ companies", status: "active" },
  { id: "ALT-004", title: "Telegram Investment Ring Dismantled", description: "Delhi Police cyber cell busted a Telegram-based task scam network. 5 arrested.", severity: "medium", source: "Delhi Police", timestamp: "2026-07-04 16:45", affected: "25,000+", status: "resolved" },
  { id: "ALT-005", title: "Fake OLX Payment APK Spreading", description: "Malicious APK generating fake payment screenshots circulating in WhatsApp groups.", severity: "high", source: "CyberSathi Research", timestamp: "2026-07-03 14:20", affected: "15,000+", status: "active" },
  { id: "ALT-006", title: "Aadhaar-PAN Link Phishing", description: "Emails claiming income tax refund pending with fake income-tax portal links.", severity: "medium", source: "Income Tax Dept", timestamp: "2026-07-03 11:00", affected: "10,000+", status: "resolved" }
];

const AI_LOGS = [
  { id: 1, time: "09:45:12", level: "INFO", module: "Gemini 3.5 Flash", message: "Model re-synchronized. Knowledge cutoff updated to July 2026." },
  { id: 2, time: "09:44:30", level: "SCAN", module: "Multimodal Scanner", message: "QR code analysis accuracy at 99.7%. 4,280 scans processed today." },
  { id: 3, time: "09:42:15", level: "WARN", module: "Anomaly Detector", message: "Unusual pattern detected: mass SMS campaign from IP pool 103.xxx.xxx." },
  { id: 4, time: "09:40:00", level: "INFO", module: "OCR Engine", message: "Receipt forgery detection model updated. New forgery signature added." },
  { id: 5, time: "09:35:22", level: "INTEL", module: "Threat Intel", message: "New blacklisted domain: sbi-secure-verify.com. Added to blocklist." },
  { id: 6, time: "09:30:45", level: "INFO", module: "Chat API", message: "2,847 chat interactions handled in last hour. Avg response: 1.2s." },
  { id: 7, time: "09:25:10", level: "ERROR", module: "Deepfake Detector", message: "Audio analysis model returned inconclusive on 3 samples. Flagged for review." },
  { id: 8, time: "09:20:33", level: "SCAN", module: "URL Analyzer", message: "62 phishing URLs identified and reported to Google Safe Browsing." },
  { id: 9, time: "09:15:00", level: "INFO", module: "Model Registry", message: "Scheduled maintenance completed. All models operational." },
  { id: 10, time: "09:10:22", level: "WARN", module: "Rate Limiter", message: "API threshold at 82% capacity. Scale-up recommended within 48 hours." },
  { id: 11, time: "09:05:45", level: "INTEL", module: "Threat Intel", message: "New scam trend identified: fake electricity board disconnection SMS in Delhi NCR." },
  { id: 12, time: "09:00:00", level: "INFO", module: "System", message: "AI Security Core Engine started. All subsystems healthy." }
];

const roleBadge = (role: AdminUser["role"]) => {
  const styles = {
    admin: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    moderator: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    analyst: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  };
  return styles[role];
};

const statusBadge = (status: AdminUser["status"]) => {
  return status === "active"
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-red-500/10 text-red-400 border border-red-500/20";
};

const reportStatusBadge = (status: FraudReport["status"]) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    investigating: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dismissed: "bg-slate-500/10 text-slate-400 border border-slate-500/20"
  };
  return styles[status];
};

const alertSeverityBadge = (severity: string) => {
  const styles: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400 border border-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    low: "bg-slate-500/10 text-slate-400 border border-slate-500/20"
  };
  return styles[severity] || styles.low;
};

const logLevelBadge = (level: string) => {
  const styles: Record<string, string> = {
    INFO: "bg-cyan-950 text-cyan-400 border border-cyan-900/30",
    SCAN: "bg-emerald-950 text-emerald-400 border border-emerald-900/30",
    WARN: "bg-amber-950 text-amber-400 border border-amber-900/30",
    INTEL: "bg-red-950 text-red-400 border border-red-900/30",
    ERROR: "bg-red-950/70 text-red-300 border border-red-900/50"
  };
  return styles[level] || "bg-slate-850 text-slate-400 border border-slate-800";
};

const KPI_ICONS: Record<string, React.ElementType> = {
  "Total Users": Users,
  "Total Scans": Activity,
  "Reports Filed": FileText,
  "Amount Saved": DollarSign
};

function KPICard({ label, value, suffix, icon: Icon, change, color }: { label: string; value: string; suffix?: string; icon: React.ElementType; change: string; color: string; [key: string]: any }) {
  return (
    <div className="glass-card glass-card-hover rounded-xl p-4 relative group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-xs font-semibold font-mono uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg ${color} border ${color.replace('text', 'border').replace('500', '500').replace('/10', '/20')}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {suffix && <span className="text-xs text-slate-500 font-mono">{suffix}</span>}
      </div>
      <p className="text-[10px] text-slate-500 mt-1 font-mono">{change}</p>
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [userSearch, setUserSearch] = useState("");
  const [alertFilter, setAlertFilter] = useState<"all" | "active" | "resolved">("all");
  const tabs = ["Overview", "Users", "Reports", "Alerts", "AI Logs"];

  const d = ADMIN_DASHBOARD_DATA;
  const kpis = [
    { label: "Total Users", value: d.totalUsers.toLocaleString(), icon: KPI_ICONS["Total Users"], change: `+${d.monthlyGrowth}% this month`, color: "bg-violet-500/10 text-violet-400" },
    { label: "Total Scans", value: d.totalScans.toLocaleString(), icon: KPI_ICONS["Total Scans"], change: `${d.dailyActiveUsers.toLocaleString()} scans today`, color: "bg-cyan-500/10 text-cyan-400" },
    { label: "Reports Filed", value: d.totalReports.toLocaleString(), icon: KPI_ICONS["Reports Filed"], change: `${d.fraudsPrevented.toLocaleString()} frauds prevented`, color: "bg-amber-500/10 text-amber-400" },
    { label: "Amount Saved", value: `₹${(d.amountSaved / 10000000).toFixed(1)}Cr`, suffix: "INR", icon: KPI_ICONS["Amount Saved"], change: `₹${(d.amountSaved / 100000).toFixed(0)}L recovered`, color: "bg-emerald-500/10 text-emerald-400" }
  ];

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAlerts = alertFilter === "all" ? MOCK_ALERTS : MOCK_ALERTS.filter(a => a.status === alertFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Admin Panel
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">CyberSathi AI Security Platform Management</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
          <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:text-cyan-400 text-slate-400 transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex bg-white/2 p-1 rounded-xl border border-white/5 self-start backdrop-blur-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all font-mono whitespace-nowrap ${
                activeTab === tab
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_12px_rgba(0,229,255,0.08)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm">User Growth & Scan Volume</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Monthly active users and scan count</p>
                </div>
                <div className="flex gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-violet-400"><span className="w-2 h-2 rounded-full bg-violet-500" /> Users</span>
                  <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Scans</span>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={USER_GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} fontStyle="italic" />
                    <YAxis stroke="#475569" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#fff", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="users" stroke="#7C3AED" fill="url(#usersGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="scans" stroke="#00E5FF" fill="url(#scansGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm">Fraud Type Distribution</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Breakdown of reported scam categories</p>
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-48 w-48 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SCAM_TYPE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {SCAM_TYPE_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {SCAM_TYPE_DATA.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400 flex-1 font-mono">{item.name}</span>
                      <span className="text-white font-bold font-mono">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-white font-bold text-sm">User Management</h3>
              <p className="text-[10px] text-slate-500 font-mono">{MOCK_USERS.length} registered administrators</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 font-mono w-48"
                />
              </div>
              <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:text-cyan-400 text-slate-400 transition">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Last Active</th>
                  <th className="text-right py-3 px-2 text-slate-500 font-semibold uppercase tracking-wider">Reports</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-cyan-300">{u.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <span className="text-white font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${roleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 w-fit ${statusBadge(u.status)}`}>
                        {u.status === "active" ? <UserCheck className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{u.lastActive}</td>
                    <td className="py-3 px-2 text-right text-white font-bold">{u.reportsHandled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-sm">Fraud Reports</h3>
              <p className="text-[10px] text-slate-500 font-mono">{MOCK_REPORTS.length} reports • Sorted by latest</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20 transition">
                <Filter className="w-3 h-3" />
                Filter
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition">
                <Flag className="w-3 h-3" />
                New Report
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {MOCK_REPORTS.map((r) => (
              <div key={r.id} className="p-3 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-cyan-400/60 font-bold">{r.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${reportStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{r.date}</span>
                    </div>
                    <h4 className="text-white font-semibold text-xs mb-0.5">{r.userName} — {r.type}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500">
                      {r.amount > 0 && <span>Amount: <span className="text-amber-400 font-bold">₹{r.amount.toLocaleString()}</span></span>}
                      {r.assignedTo && <span>Assigned: {r.assignedTo}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Alerts" && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-white font-bold text-sm">Alert Management</h3>
              <p className="text-[10px] text-slate-500 font-mono">{MOCK_ALERTS.filter(a => a.status === "active").length} active alerts</p>
            </div>
            <div className="flex bg-white/2 p-0.5 rounded-lg border border-white/5 self-start">
              {(["all", "active", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={`px-3 py-1 text-[10px] font-mono font-semibold rounded-md transition-all ${
                    alertFilter === f ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredAlerts.map((a) => (
              <div key={a.id} className="p-4 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    a.severity === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    a.severity === "high" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold text-xs">{a.title}</h4>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${alertSeverityBadge(a.severity)}`}>
                        {a.severity}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        a.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-1.5">{a.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                      <span>Source: {a.source}</span>
                      <span>•</span>
                      <span>{a.timestamp}</span>
                      <span>•</span>
                      <span>Affected: {a.affected}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 transition" title="Acknowledge">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    {a.status === "active" && (
                      <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 hover:text-red-400 text-slate-400 transition" title="Dismiss">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "AI Logs" && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                AI Model Monitoring
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">Live engine logs • {AI_LOGS.length} entries</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Engine Active</span>
              </div>
              <button className="p-1 rounded bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 transition">
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3 text-slate-400 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>CyberSathi AI Core Engine — Log Stream</span>
              <span className="text-[9px] text-slate-600 ml-auto">v3.5.2-flash</span>
            </div>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {AI_LOGS.map((log) => (
                <div key={log.id} className="flex gap-2.5 leading-relaxed hover:bg-slate-900/60 p-0.5 rounded transition">
                  <span className="text-slate-600 select-none w-14 flex-shrink-0">[{log.time}]</span>
                  <span className={`px-1 rounded text-[9px] font-bold select-none ${logLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 w-28 flex-shrink-0 truncate">{log.module}</span>
                  <span className="text-slate-300 truncate">{log.message}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-600 border-t border-slate-900 pt-2 flex justify-between mt-3">
              <span>SSL: ACTIVE • RATE: 1,240 req/min</span>
              <span>NODE: CLOUD-API-V2 • MEM: 62%</span>
              <span>UPTIME: 14d 7h 32m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
