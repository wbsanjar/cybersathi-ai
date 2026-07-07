import React, { useState } from "react";
import InteractiveMap from "./components/InteractiveMap";
import Dashboard from "./components/Dashboard";
import EmergencyResponse from "./components/EmergencyResponse";
import QuizSection from "./components/QuizSection";
import ScannerSection from "./components/ScannerSection";
import AIChatbot from "./components/AIChatbot";
import CyberAwareness from "./components/CyberAwareness";
import SocialMediaProtection from "./components/SocialMediaProtection";
import FraudDetection from "./components/FraudDetection";
import ReportFraud from "./components/ReportFraud";
import AdminPanel from "./components/AdminPanel";
import FamilyProtection from "./components/FamilyProtection";
import ScamSimulator from "./components/ScamSimulator";
import Contact from "./components/Contact";
import CitizenDashboard from "./components/CitizenDashboard";
import OfficerDashboard from "./components/OfficerDashboard";
import NearbyPoliceStations from "./components/NearbyPoliceStations";
import { TRANSLATIONS, CYBER_NEWS, NOTIFICATIONS_DATA } from "./data";
import { MOCK_USERS } from "./roleData";
import { ScanResult, UserProfile, NotificationItem, AuthUser, UserRole } from "./types";
import {
  Bot, Shield, ShieldCheck, AlertTriangle, HelpCircle,
  Settings, Users, Globe, LogIn, Award, ListFilter,
  CheckCircle, ArrowRight, BookOpen, MessageSquare, Info,
  FileLock, Mail, Phone, Lock, Eye, Menu, X, Landmark, RefreshCw,
  Link2, FileImage, Bell, BellRing, Smartphone, UsersRound,
  Gamepad2, BrainCircuit, ExternalLink, Send, Sliders, XCircle,
  Scale, UserCog, ChevronRight, LogOut, UserPlus, MapPin
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"en" | "hi" | "bn">("en");
  const [activeTab, setActiveTab] = useState<"home" | "scanner" | "dashboard" | "emergency" | "quiz" | "profile" | "admin" | "about" | "awareness" | "alerts" | "social" | "fraud-detection" | "report-fraud" | "family" | "simulator" | "contact" | "police-stations">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [notifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Siddharth Verma",
    email: "siddharth.v@gmail.com",
    phone: "+91 91234 56789",
    cyberScore: 75,
    twoFactorEnabled: false,
    notificationsEnabled: true,
    familyMembers: [],
    achievements: [
      { id: "ach-1", title: "Phishing Slayer", description: "Successfully scan a malicious phishing link", unlocked: true, badge: "🕵️" },
      { id: "ach-2", title: "OTP Shield Master", description: "Earn a high score in the Cyber Awareness Quiz", unlocked: false, badge: "🛡️" },
      { id: "ach-3", title: "Guardian Angel", description: "Generate an official bank freeze complaint letter", unlocked: false, badge: "👼" },
      { id: "ach-4", title: "Scam Spotter", description: "Complete the Scam Simulator with 100% score", unlocked: false, badge: "🎯" },
      { id: "ach-5", title: "Security Champion", description: "Complete all security checklist items", unlocked: false, badge: "🏆" }
    ],
    scannedHistory: [
      { id: "h-1", type: "SMS SCAN", input: "BSES Electricity Bill alert...", status: "Fraud", score: 95, date: "July 04, 2026" },
      { id: "h-2", type: "URL SCAN", input: "https://paytm-rewards.in...", status: "Suspicious", score: 68, date: "July 02, 2026" },
      { id: "h-3", type: "QR SCAN", input: "upi://pay?pa=clean@axis...", status: "Safe", score: 10, date: "June 30, 2026" }
    ]
  });

  // ─── ROLE-BASED AUTH STATE ───────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  const [authStep, setAuthStep] = useState<"role" | "details" | "verify">("role");

  const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ElementType; desc: string; color: string }> = {
    citizen: { label: "Citizen / User", icon: Users, desc: "Scan scams, report fraud, track complaints, get AI help", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    officer: { label: "Cyber Officer", icon: Scale, desc: "Manage cases, verify complaints, review evidence", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    super_admin: { label: "Super Admin", icon: UserCog, desc: "Platform management, users, alerts, AI settings", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === authEmail);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setActiveTab("home");
    } else {
      alert("Demo: Use any email from the mock data.\n\nCitizen: amit.kumar@gmail.com\nOfficer: vikram.singh@cybercell.gov.in\nAdmin: aditya@cybersathi.ai");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AuthUser = {
      id: `cit-${Date.now()}`,
      fullName: authName,
      email: authEmail,
      phone: authPhone,
      role: selectedRole,
      joinedAt: new Date().toISOString().split("T")[0],
      twoFactorEnabled: false,

    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setActiveTab("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab("home");
  };

  const t = (key: string): string => TRANSLATIONS[lang][key] || key;

  const handleQuizCompletion = (scorePercentage: number) => {
    setUserProfile(prev => {
      const updatedAchievements = prev.achievements.map(ach =>
        ach.id === "ach-2" && scorePercentage >= 80 ? { ...ach, unlocked: true } : ach
      );
      return { ...prev, cyberScore: Math.round((prev.cyberScore + scorePercentage) / 2), achievements: updatedAchievements };
    });
  };

  const handleScanCompletion = (result: ScanResult) => {
    setUserProfile(prev => {
      const updatedAchievements = prev.achievements.map(ach =>
        ach.id === "ach-1" ? { ...ach, unlocked: true } : ach
      );
      const newHistoryItem = {
        id: `h-${Date.now()}`,
        type: "AI CORE SCAN",
        input: result.scamType || "Security check",
        status: result.status,
        score: result.riskScore,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };
      return { ...prev, scannedHistory: [newHistoryItem, ...prev.scannedHistory], achievements: updatedAchievements };
    });
  };

  const roleIcon = (role: UserRole) => {
    const icons: Record<UserRole, React.ElementType> = { citizen: Users, officer: Scale, super_admin: UserCog };
    return icons[role];
  };

  const roleBadgeColor = (role: UserRole) => {
    const c: Record<UserRole, string> = { citizen: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", officer: "text-amber-400 bg-amber-500/10 border-amber-500/20", super_admin: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    return c[role];
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950" id="master-layout">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse [animation-duration:12s]"></div>
        <div className="absolute top-[45%] right-[10%] w-[700px] h-[700px] bg-purple-600/12 rounded-full blur-[180px] animate-pulse [animation-duration:15s]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[130px] animate-pulse [animation-duration:10s]"></div>
      </div>

      <nav className="sticky top-0 z-50 glass-navbar" id="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")} id="nav-logo">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <div className="h-full w-full bg-[#050816] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  <span>CyberSathi</span>
                  <span className="text-cyan-400 font-mono text-xs">AI</span>
                </h1>
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">Detect • Prevent • Protect</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold tracking-wide">
              <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "home" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("navHome")}</button>
              <button onClick={() => { setActiveTab("police-stations"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "police-stations" ? "bg-white/10 text-emerald-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("navPolice")}</button>
              {currentUser?.role === "citizen" && (
                <button onClick={() => { setActiveTab("scanner"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "scanner" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("navScanner")}</button>
              )}
              {currentUser?.role === "citizen" && (
                <button onClick={() => { setActiveTab("fraud-detection"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "fraud-detection" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("fraudTitle")}</button>
              )}
              {currentUser?.role === "citizen" && (
                <button onClick={() => { setActiveTab("social"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "social" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("socialTitle")}</button>
              )}
              <button onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "dashboard" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("navDashboard")}</button>
              <button onClick={() => { setActiveTab("emergency"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "emergency" ? "bg-red-500/15 border border-red-500/30 text-red-400" : "text-red-400/80 hover:text-red-400 hover:bg-red-500/5"}`}>{t("navSos")}</button>
              <button onClick={() => { setActiveTab("awareness"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "awareness" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>{t("navLearn")}</button>
              {currentUser?.role === "super_admin" && (
                <button onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "admin" ? "bg-white/10 text-cyan-300 border border-white/10" : "text-slate-400 hover:text-white"}`}>Admin</button>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition" title="Notifications">
                  {unreadCount > 0 ? <BellRing className="w-4 h-4 text-cyan-400" /> : <Bell className="w-4 h-4" />}
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full min-w-[16px] text-center">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                      <h4 className="text-white font-bold text-xs">Notifications</h4>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white"><XCircle className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-slate-800/50 hover:bg-white/5 transition ${!n.read ? "bg-cyan-500/5" : ""}`}>
                          <div className="flex items-start gap-2">
                            <div className={`p-1 rounded ${n.severity === "critical" ? "bg-red-500/10 text-red-400" : n.severity === "high" ? "bg-amber-500/10 text-amber-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                              {n.type === "fraud_alert" ? <Shield className="w-3 h-3" /> : n.type === "login_alert" ? <Smartphone className="w-3 h-3" /> : n.type === "scam_alert" ? <AlertTriangle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className={`text-xs ${!n.read ? "text-white font-bold" : "text-slate-300"}`}>{n.title}</h5>
                              <p className="text-[10px] text-slate-400 truncate">{n.message}</p>
                              <span className="text-[9px] text-slate-600 font-mono">{n.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => { const langs = ["en", "hi", "bn"]; const idx = langs.indexOf(lang); setLang(langs[(idx + 1) % langs.length] as "en" | "hi" | "bn"); }} className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold bg-white/5 text-slate-300 hover:text-white transition-all backdrop-blur-sm" id="language-selector-btn" title="Translate to Hindi / English">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              {isLoggedIn && currentUser ? (
                <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm text-xs font-mono shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">{currentUser.fullName.charAt(0)}</div>
                    <div>
                      <span className="text-slate-300 font-semibold block leading-tight">{currentUser.fullName.split(" ")[0]}</span>
                      <span className={`text-[8px] px-1 rounded ${roleBadgeColor(currentUser.role)}`}>{currentUser.role.replace("_", " ")}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition ml-1" title="Logout">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="glass-btn-primary font-bold px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer animate-pulse" id="header-login-btn">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition" id="mobile-menu-toggle-btn">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#050816]/95 backdrop-blur-lg p-4 space-y-2 text-sm font-semibold tracking-wide">
            <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "home" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>🏠 {t("navHome")}</button>
            <button onClick={() => { setActiveTab("police-stations"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "police-stations" ? "bg-slate-900 text-emerald-400" : "text-slate-400"}`}>{t("navPolice")}</button>
            {currentUser?.role === "citizen" && (
              <button onClick={() => { setActiveTab("scanner"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "scanner" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>🔍 {t("navScanner")}</button>
            )}
            {currentUser?.role === "citizen" && (
              <button onClick={() => { setActiveTab("fraud-detection"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "fraud-detection" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>🛡️ {t("fraudTitle")}</button>
            )}
            {currentUser?.role === "citizen" && (
              <button onClick={() => { setActiveTab("social"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "social" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>👥 {t("socialTitle")}</button>
            )}
            <button onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "dashboard" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>📊 {t("navDashboard")}</button>
            <button onClick={() => { setActiveTab("emergency"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 rounded-lg block bg-red-500/10 text-red-400">{t("navSosEmergency")}</button>
            <button onClick={() => { setActiveTab("awareness"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "awareness" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>{t("navLearnArticles")}</button>
            <button onClick={() => { setActiveTab("report-fraud"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "report-fraud" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>📝 {t("navReport")}</button>
            <button onClick={() => { setActiveTab("family"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "family" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>👨‍👩‍👧‍👦 Family Protection</button>
            <button onClick={() => { setActiveTab("simulator"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "simulator" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>🎮 Scam Simulator</button>
            <button onClick={() => { setActiveTab("quiz"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "quiz" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>🧠 {t("navQuiz")}</button>
            {currentUser?.role === "super_admin" && (
              <button onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "admin" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>⚙️ {t("navAdmin")}</button>
            )}
            <button onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "contact" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>📞 {t("navContact")}</button>
            <button onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "about" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}>ℹ️ About</button>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button onClick={() => { const langs = ["en", "hi", "bn"]; const idx = langs.indexOf(lang); setLang(langs[(idx + 1) % langs.length] as "en" | "hi" | "bn"); setMobileMenuOpen(false); }} className="flex items-center gap-1.5 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs bg-slate-950 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "বাংলা"}</span>
              </button>
              {isLoggedIn && currentUser ? (
                <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-mono">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              ) : (
                <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); setMobileMenuOpen(false); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono uppercase">Login</button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {activeTab === "home" && (
          <div className="space-y-12 animate-fadeIn" id="home-view">
            {isLoggedIn && currentUser ? (
              <>
                {currentUser.role === "citizen" && <CitizenDashboard user={currentUser} />}
                {currentUser.role === "officer" && <OfficerDashboard user={currentUser} />}
                {currentUser.role === "super_admin" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20"><UserCog className="w-5 h-5" /></div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Welcome, {currentUser.fullName}</h2>
                        <p className="text-xs text-slate-500 font-mono">Super Admin • Full Platform Access</p>
                      </div>
                    </div>
                    <AdminPanel />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-card p-6 sm:p-10 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2 bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 rounded-full px-3.5 py-1.5 text-xs font-mono self-start w-fit">
                      <Bot className="w-4 h-4 animate-bounce" />
                      <span>Next-Gen Security Models Activated</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{t("heroTitle")}</h1>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t("heroSub")}</p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => { setAuthMode("signup"); setShowAuthModal(true); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-lg text-sm transition shadow-[0_0_20px_rgba(0,229,255,0.3)] font-mono uppercase tracking-wide cursor-pointer">
                        🚀 {t("getStarted")}
                      </button>
                      <button onClick={() => setChatOpen(true)} className="bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 font-bold py-3.5 px-6 rounded-lg text-sm transition font-mono uppercase tracking-wide cursor-pointer">
                        🤖 AI Chat
                      </button>
                      <button onClick={() => setActiveTab("emergency")} className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-3.5 px-6 rounded-lg text-sm transition font-mono uppercase tracking-wide">⚠️ {t("reportFraud")}</button>
                    </div>
                  </div>
                  <div className="lg:col-span-5 relative">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-2xl blur-sm opacity-30 pointer-events-none"></div>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                      <img src="./src/assets/images/cybersathi_hero_banner_1783244279624.jpg" alt="CyberSathi AI Security Matrix" className="w-full h-auto object-cover opacity-90 transition duration-500 hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"; }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-[#050816]/80 px-2.5 py-1 rounded border border-slate-800">SYSTEM SEC: SHIELD_ENABLED</span>
                        <span className="text-[10px] font-mono text-slate-400">Ver 3.5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {([
                    { role: "citizen", label: "Citizen / User", icon: Users, desc: "Scan scams, file complaints, track cases", color: "from-cyan-500 to-blue-600" },
                    { role: "officer", label: "Cyber Officer", icon: Scale, desc: "Case management, evidence review", color: "from-amber-500 to-orange-600" },
                    { role: "super_admin", label: "Super Admin", icon: UserCog, desc: "Full platform management & control", color: "from-rose-500 to-pink-600" },
                  ] as const).map((r) => (
                    <button key={r.role} onClick={() => { setSelectedRole(r.role as UserRole); setAuthMode("signup"); setShowAuthModal(true); }}
                      className="glass-card glass-card-hover rounded-xl p-4 text-left group cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} p-[1.5px] mb-3`}>
                        <div className="h-full w-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                          <r.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-sm mb-1">{r.label}</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{r.desc}</p>
                      <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-mono mt-2 opacity-0 group-hover:opacity-100 transition">
                        Get Started <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <InteractiveMap />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "police-stations" && (
          <div className="animate-fadeIn">
            <NearbyPoliceStations t={t} lang={lang} />
          </div>
        )}

        {activeTab === "scanner" && (
          <div className="animate-fadeIn">
            <ScannerSection onScanCompleted={handleScanCompletion} />
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="animate-fadeIn">
            {isLoggedIn && currentUser ? (
              currentUser.role === "citizen" ? (
                <Dashboard userQuizScore={userProfile.cyberScore} scanHistoryCount={userProfile.scannedHistory.length} />
              ) : currentUser.role === "officer" ? (
                <OfficerDashboard user={currentUser} />
              ) : (
                <AdminPanel />
              )
            ) : (
              <Dashboard userQuizScore={userProfile.cyberScore} scanHistoryCount={userProfile.scannedHistory.length} />
            )}
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="animate-fadeIn">
            <EmergencyResponse t={t} lang={lang} />
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="animate-fadeIn">
            <QuizSection onQuizCompleted={handleQuizCompletion} t={t} />
          </div>
        )}

        {activeTab === "profile" && isLoggedIn && currentUser && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn" id="profile-view">
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="h-16 w-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  {currentUser.fullName.charAt(0)}
                </div>
                <h3 className="text-white font-bold text-lg">{currentUser.fullName}</h3>
                <span className="text-xs font-mono text-slate-400">{currentUser.email}</span>
                <div className="mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${roleBadgeColor(currentUser.role)}`}>
                    {currentUser.role === "super_admin" ? "Super Admin" : currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </span>
                </div>
                {currentUser.organizationName && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{currentUser.organizationName}</p>
                )}
                {currentUser.badgeNumber && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Badge: {currentUser.badgeNumber}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">CYBER SCORE</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">{userProfile.cyberScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">MEMBER SINCE</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{currentUser.joinedAt}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button onClick={() => setShow2FAModal(true)} className="text-[10px] text-cyan-400 hover:underline font-mono">
                    {twoFAEnabled ? "✅ 2FA Enabled" : "Enable 2FA →"}
                  </button>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-cyan-400" />
                  <span>Aura Badges Unlocked</span>
                </h4>
                <div className="space-y-3">
                  {userProfile.achievements.map(ach => (
                    <div key={ach.id} className={`p-3 rounded-lg border flex gap-3 items-center ${ach.unlocked ? "bg-white/2 border-white/5" : "bg-black/10 border-white/5 opacity-40"}`}>
                      <span className="text-2xl">{ach.badge}</span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                        <p className="text-[10px] text-slate-400">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold text-base mb-4">Your Recent AI Scan History</h3>
              <div className="space-y-3">
                {userProfile.scannedHistory.map(item => (
                  <div key={item.id} className="p-4 bg-white/2 border border-white/5 rounded-xl flex justify-between items-center hover:border-white/10 transition-all">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500">{item.date} • {item.type}</span>
                      <h4 className="text-xs sm:text-sm text-slate-200 truncate max-w-sm">{item.input}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${item.status === "Fraud" ? "bg-red-500/10 text-red-400 border border-red-500/20" : item.status === "Suspicious" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Risk: {item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "fraud-detection" && (
          <div className="animate-fadeIn">
            <FraudDetection t={t} onScanCompleted={handleScanCompletion} />
          </div>
        )}

        {activeTab === "social" && (
          <div className="animate-fadeIn">
            <SocialMediaProtection t={t} onScanCompleted={handleScanCompletion} />
          </div>
        )}

        {activeTab === "report-fraud" && (
          <div className="animate-fadeIn">
            <ReportFraud />
          </div>
        )}

        {activeTab === "awareness" && (
          <div className="animate-fadeIn">
            <CyberAwareness t={t} lang={lang} />
          </div>
        )}

        {activeTab === "admin" && (
          <div className="animate-fadeIn">
            <AdminPanel />
          </div>
        )}

        {activeTab === "family" && (
          <div className="animate-fadeIn">
            <FamilyProtection />
          </div>
        )}

        {activeTab === "simulator" && (
          <div className="animate-fadeIn">
            <ScamSimulator />
          </div>
        )}

        {activeTab === "contact" && (
          <div className="animate-fadeIn">
            <Contact />
          </div>
        )}

        {activeTab === "about" && (
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn" id="about-view">
            <div className="text-center space-y-2 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">About CyberSathi AI</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">Multi-Role Cyber Fraud Prevention Platform for Citizens, Businesses, Law Enforcement & Administrators.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/2 p-5 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5"><Bot className="w-4 h-4 text-cyan-400" /><span>Our Mission</span></h4>
                <p className="text-xs text-slate-400 leading-relaxed">Empowering every Indian citizen, business, and law enforcement agency with AI-powered tools to detect, prevent, and respond to cyber fraud in real-time.</p>
              </div>
              <div className="bg-white/2 p-5 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-400" /><span>Four Pillars of Protection</span></h4>
                <p className="text-xs text-slate-400 leading-relaxed">Citizens get scam scanning & reporting. Businesses get employee protection. Officers get case management. Admins get full platform control.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-10 z-10 text-slate-500 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-center gap-4 text-slate-400 flex-wrap">
            <button onClick={() => setActiveTab("home")} className="hover:text-white transition text-[10px] font-mono">Home</button>
            <button onClick={() => setActiveTab("police-stations")} className="hover:text-white transition text-[10px] font-mono">{t("navPolice")}</button>
            {currentUser?.role === "citizen" && <button onClick={() => setActiveTab("scanner")} className="hover:text-white transition text-[10px] font-mono">AI Scanner</button>}
            {currentUser?.role === "citizen" && <button onClick={() => setActiveTab("fraud-detection")} className="hover:text-white transition text-[10px] font-mono">{t("fraudTitle")}</button>}
            {currentUser?.role === "citizen" && <button onClick={() => setActiveTab("social")} className="hover:text-white transition text-[10px] font-mono">{t("socialTitle")}</button>}
            <button onClick={() => setActiveTab("dashboard")} className="hover:text-white transition text-[10px] font-mono">Dashboard</button>
            <button onClick={() => setActiveTab("emergency")} className="hover:text-white transition text-[10px] font-mono">{t("navSos")}</button>
            <button onClick={() => setActiveTab("awareness")} className="hover:text-white transition text-[10px] font-mono">{t("navLearn")}</button>
            <button onClick={() => setActiveTab("report-fraud")} className="hover:text-white transition text-[10px] font-mono">Report Fraud</button>
            <button onClick={() => setActiveTab("family")} className="hover:text-white transition text-[10px] font-mono">Family</button>
            <button onClick={() => setActiveTab("simulator")} className="hover:text-white transition text-[10px] font-mono">Scam Simulator</button>
            <button onClick={() => setActiveTab("admin")} className="hover:text-white transition text-[10px] font-mono">Admin</button>
            <button onClick={() => setActiveTab("contact")} className="hover:text-white transition text-[10px] font-mono">Contact</button>
          </div>
          <p>© 2026 CyberSathi AI. Ministry of Home Affairs compliant guidelines. Protect. Detect. Respond.</p>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1.5px] shadow-[0_4px_20px_rgba(0,229,255,0.4)] hover:scale-105 transition cursor-pointer flex items-center justify-center relative" id="floating-chat-toggle" title="Chat with CyberSathi AI assistant">
            <div className="h-full w-full bg-[#050816] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full">LIVE</span>
          </button>
        ) : (
          <div className="relative">
            <AIChatbot />
            <button onClick={() => setChatOpen(false)} className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white transition flex items-center justify-center text-xs font-bold">✕</button>
          </div>
        )}
      </div>

      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative">
            <button onClick={() => setShow2FAModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-white font-bold text-lg mb-1">🔐 Two-Factor Authentication</h3>
            <p className="text-xs text-slate-400 mb-5">Add an extra layer of security to your CyberSathi account.</p>
            <div className="space-y-4">
              <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-cyan-400" />
                <div>
                  <h4 className="text-white font-bold text-xs">Authenticator App</h4>
                  <p className="text-[10px] text-slate-400">Use Google Authenticator or similar app to scan QR code</p>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                <div className="w-32 h-32 bg-white/5 mx-auto rounded-lg flex items-center justify-center border border-slate-700">
                  <Lock className="w-12 h-12 text-cyan-400/50" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">CYSR-2FA-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Enter 6-digit code from app</label>
                <input type="text" maxLength={6} placeholder="000000" className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-slate-200 text-center font-mono tracking-widest focus:outline-none focus:border-cyan-400" />
              </div>
              <button onClick={() => { setTwoFAEnabled(true); setShow2FAModal(false); }} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL — Role-based Login / Signup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-bold text-lg">CyberSathi AI</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">Multi-Role Security Platform — {authMode === "login" ? "Login to your account" : "Create your account"}</p>

            {/* Login / Signup toggle */}
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 mb-5">
              <button onClick={() => setAuthMode("login")} className={`flex-1 py-2 text-xs font-bold rounded font-mono transition ${authMode === "login" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400"}`}>Login</button>
              <button onClick={() => setAuthMode("signup")} className={`flex-1 py-2 text-xs font-bold rounded font-mono transition ${authMode === "signup" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400"}`}>Sign Up</button>
            </div>

            {authMode === "signup" && authStep === "role" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold mb-2">Select your role:</p>
                {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).map(([role, config]) => (
                  <button key={role} onClick={() => { setSelectedRole(role); setAuthStep("details"); }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedRole === role ? config.color : "border-slate-700/50 bg-slate-900/50 hover:bg-slate-800/50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedRole === role ? config.color : "bg-slate-800 text-slate-400"}`}>
                        <config.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{config.label}</h4>
                        <p className="text-[10px] text-slate-400">{config.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {authMode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                  <input type="email" required placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Password</label>
                  <input type="password" required placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400" />
                </div>
                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer">
                  Login to Dashboard
                </button>
                <p className="text-[9px] text-slate-600 font-mono text-center">
                  Demo: amit.kumar@gmail.com / vikram.singh@cybercell.gov.in / aditya@cybersathi.ai
                </p>
              </form>
            )}

            {authMode === "signup" && authStep === "details" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${roleBadgeColor(selectedRole)}`}>
                    {ROLE_CONFIG[selectedRole].label}
                  </span>
                  <button type="button" onClick={() => setAuthStep("role")} className="text-[9px] text-cyan-400 hover:underline font-mono">(Change)</button>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                  <input type="text" required placeholder="Your full name" value={authName} onChange={e => setAuthName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                  <input type="email" required placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Phone Number</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={authPhone} onChange={e => setAuthPhone(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400" />
                </div>

                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer">
                  Create {ROLE_CONFIG[selectedRole].label} Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
