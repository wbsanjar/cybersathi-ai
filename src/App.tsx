import React, { useState } from "react";
import InteractiveMap from "./components/InteractiveMap";
import Dashboard from "./components/Dashboard";
import EmergencyResponse from "./components/EmergencyResponse";
import QuizSection from "./components/QuizSection";
import ScannerSection from "./components/ScannerSection";
import AIChatbot from "./components/AIChatbot";
import { TRANSLATIONS, CYBER_NEWS } from "./data";
import { ScanResult, UserProfile } from "./types";
import { 
  Bot, Shield, ShieldCheck, AlertTriangle, HelpCircle, 
  Settings, Users, Globe, LogIn, Award, ListFilter,
  CheckCircle, ArrowRight, BookOpen, MessageSquare, Info, 
  FileLock, Mail, Phone, Lock, Eye, Menu, X, Landmark, RefreshCw,
  Link2, FileImage
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<"home" | "scanner" | "dashboard" | "emergency" | "quiz" | "profile" | "admin" | "about">("home");
  
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Floating chat toggle
  const [chatOpen, setChatOpen] = useState(false);

  // Authentication states (UI mock)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMethod, setAuthMethod] = useState<"google" | "otp" | "face">("google");
  const [authEmail, setAuthEmail] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // User Profile Safety Metrics & History
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Siddharth Verma",
    email: "siddharth.v@gmail.com",
    phone: "+91 91234 56789",
    cyberScore: 75,
    achievements: [
      { id: "ach-1", title: "Phishing Slayer", description: "Successfully scan a malicious phishing link", unlocked: true, badge: "🕵️" },
      { id: "ach-2", title: "OTP Shield Master", description: "Earn a high score in the Cyber Awareness Quiz", unlocked: false, badge: "🛡️" },
      { id: "ach-3", title: "Guardian Angel", description: "Generate an official bank freeze complaint letter", unlocked: false, badge: "👼" }
    ],
    scannedHistory: [
      { id: "h-1", type: "SMS SCAN", input: "BSES Electricity Bill alert...", status: "Fraud", score: 95, date: "July 04, 2026" },
      { id: "h-2", type: "URL SCAN", input: "https://paytm-rewards.in...", status: "Suspicious", score: 68, date: "July 02, 2026" },
      { id: "h-3", type: "QR SCAN", input: "upi://pay?pa=clean@axis...", status: "Safe", score: 10, date: "June 30, 2026" }
    ]
  });

  // Localization translator helper
  const t = (key: string): string => {
    return TRANSLATIONS[lang][key] || key;
  };

  // Callback: User completes a quiz
  const handleQuizCompletion = (scorePercentage: number) => {
    setUserProfile((prev) => {
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === "ach-2" && scorePercentage >= 80) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });

      return {
        ...prev,
        cyberScore: Math.round((prev.cyberScore + scorePercentage) / 2),
        achievements: updatedAchievements
      };
    });
  };

  // Callback: User completes a scan
  const handleScanCompletion = (result: ScanResult) => {
    setUserProfile((prev) => {
      // Unlock scanning achievement
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === "ach-1") return { ...ach, unlocked: true };
        return ach;
      });

      const newHistoryItem = {
        id: `h-${Date.now()}`,
        type: "AI CORE SCAN",
        input: result.scamType || "Security check",
        status: result.status,
        score: result.riskScore,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };

      return {
        ...prev,
        scannedHistory: [newHistoryItem, ...prev.scannedHistory],
        achievements: updatedAchievements
      };
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950" id="master-layout">
      
      {/* BACKGROUND PARTICLES EFFECT & NEON HALOS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse [animation-duration:12s]"></div>
        <div className="absolute top-[45%] right-[10%] w-[700px] h-[700px] bg-purple-600/12 rounded-full blur-[180px] animate-pulse [animation-duration:15s]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[130px] animate-pulse [animation-duration:10s]"></div>
      </div>

      {/* STICKY NAVBAR */}
      <nav className="sticky top-0 z-50 glass-navbar" id="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
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

            {/* Desktop Tabs */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold tracking-wide">
              <button
                onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "home" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                id="nav-link-home"
              >
                {t("navHome")}
              </button>
              <button
                onClick={() => { setActiveTab("scanner"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "scanner" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                id="nav-link-scanner"
              >
                {t("navScanner")}
              </button>
              <button
                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "dashboard" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                id="nav-link-dashboard"
              >
                {t("navDashboard")}
              </button>
              <button
                onClick={() => { setActiveTab("emergency"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "emergency" ? "bg-red-500/15 border border-red-500/30 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.1)]" : "text-red-400/80 hover:text-red-400 hover:bg-red-500/5"}`}
                id="nav-link-emergency"
              >
                {t("emergencyBtn").split(" ")[0]} ⚠️
              </button>
              <button
                onClick={() => { setActiveTab("quiz"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "quiz" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                id="nav-link-quiz"
              >
                {t("navQuiz")}
              </button>
              <button
                onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "about" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                id="nav-link-about"
              >
                {t("navAbout")}
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "profile" ? "bg-white/10 text-cyan-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "text-slate-400 hover:text-white"}`}
                  id="nav-link-profile"
                >
                  My Profile
                </button>
              )}
            </div>

            {/* Right Side: Localization & Login */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language toggle selector */}
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold bg-white/5 text-slate-300 hover:text-white transition-all backdrop-blur-sm"
                id="language-selector-btn"
                title="Translate to Hindi / English"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm text-xs font-mono shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300 font-semibold">{userProfile.fullName.split(" ")[0]}</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="glass-btn-primary font-bold px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 transition cursor-pointer animate-pulse"
                  id="header-login-btn"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#050816]/95 backdrop-blur-lg p-4 space-y-2 text-sm font-semibold tracking-wide">
            <button
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "home" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
            >
              {t("navHome")}
            </button>
            <button
              onClick={() => { setActiveTab("scanner"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "scanner" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
            >
              {t("navScanner")}
            </button>
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "dashboard" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
            >
              {t("navDashboard")}
            </button>
            <button
              onClick={() => { setActiveTab("emergency"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg block bg-red-500/10 text-red-400"
            >
              {t("emergencyBtn")}
            </button>
            <button
              onClick={() => { setActiveTab("quiz"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "quiz" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
            >
              {t("navQuiz")}
            </button>
            <button
              onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "about" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
            >
              {t("navAbout")}
            </button>
            {isLoggedIn && (
              <button
                onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2 px-3 rounded-lg block ${activeTab === "profile" ? "bg-slate-900 text-cyan-400" : "text-slate-400"}`}
              >
                My Profile
              </button>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => { setLang(lang === "en" ? "hi" : "en"); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs bg-slate-950 text-slate-300"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-950 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">{userProfile.fullName}</span>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono uppercase"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CORE WRAPPER SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fadeIn" id="home-view">
            
            {/* HERO HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-card p-6 sm:p-10 rounded-3xl relative overflow-hidden">
              {/* Absolutes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 rounded-full px-3.5 py-1.5 text-xs font-mono self-start w-fit">
                  <Bot className="w-4 h-4 animate-bounce" />
                  <span>Next-Gen Security Models Activated</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {t("heroTitle")}
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {t("heroSub")}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("scanner")}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-lg text-sm transition shadow-[0_0_20px_rgba(0,229,255,0.3)] font-mono uppercase tracking-wide cursor-pointer"
                  >
                    🚀 {t("getStarted")}
                  </button>
                  <button
                    onClick={() => setActiveTab("emergency")}
                    className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-3.5 px-6 rounded-lg text-sm transition font-mono uppercase tracking-wide"
                  >
                    ⚠️ {t("reportFraud")}
                  </button>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold py-3.5 px-6 rounded-lg text-sm transition font-mono uppercase tracking-wide flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>{t("tryAssistant")}</span>
                  </button>
                </div>
              </div>

              {/* Generated Image on Home page (Related UI Image) */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-2xl blur-sm opacity-30 pointer-events-none"></div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                  {/* Standard fallback vector or the real generated artifact! */}
                  <img
                    src="./src/assets/images/cybersathi_hero_banner_1783244279624.jpg"
                    alt="CyberSathi AI Security Matrix"
                    className="w-full h-auto object-cover opacity-90 transition duration-500 hover:scale-105"
                    onError={(e) => {
                      // Fallback in case of asset rendering paths on some clients
                      e.currentTarget.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-[#050816]/80 px-2.5 py-1 rounded border border-slate-800">SYSTEM SEC: SHIELD_ENABLED</span>
                    <span className="text-[10px] font-mono text-slate-400">Ver 3.5</span>
                  </div>
                </div>
              </div>

            </div>

            {/* INTERACTIVE DENSITY MAP */}
            <div className="space-y-4">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase font-mono mb-1">{t("interactiveMap").split(" ")[1]} Tracker</h3>
                <h2 className="text-2xl font-bold text-white">{t("interactiveMap")}</h2>
              </div>
              <InteractiveMap />
            </div>

            {/* BENTO CORE FEATURES HIGHLIGHTS */}
            <div className="space-y-4 pt-4">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xs font-bold text-purple-400 tracking-widest uppercase font-mono mb-1">Defense Arsenal</h3>
                <h2 className="text-2xl font-bold text-white">Advanced AI Fraud Checkers</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl w-fit">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-base">Phishing URL & Padlock Check</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our models inspect suspicious domains, SSL certificate validation, WHOIS reputations, and fake banking layouts to stop login spoofing.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("scanner")} className="text-xs text-cyan-400 font-mono hover:underline mt-4 flex items-center gap-1 self-start cursor-pointer">
                    Launch URL Scanner &rarr;
                  </button>
                </div>

                <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl w-fit">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-base">SMS Fraud & OTP Guardian</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Copy paste suspicious messages. CyberSathi highlights exact malicious text and phishing hooks, predicting bill disconnected/KYC frauds.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("scanner")} className="text-xs text-purple-400 font-mono hover:underline mt-4 flex items-center gap-1 self-start cursor-pointer">
                    Launch SMS Detector &rarr;
                  </button>
                </div>

                <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl w-fit">
                      <FileImage className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-base">Receipt Forensic OCR</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload payment confirmation screenshots. Gemini OCR analyzes spacing, fonts, and UPI layouts to verify authenticity.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("scanner")} className="text-xs text-emerald-400 font-mono hover:underline mt-4 flex items-center gap-1 self-start cursor-pointer">
                    Launch Screenshot Scanner &rarr;
                  </button>
                </div>

              </div>
            </div>

            {/* CYBER AWARENESS NEWS & BLOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>MHA Cyber Security Updates & News</span>
                </h3>
                <div className="space-y-4">
                  {CYBER_NEWS.map((news) => (
                    <div key={news.id} className="p-4 bg-white/2 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between gap-4 hover:border-white/10 transition-all">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.2 rounded font-bold">
                          {news.category}
                        </span>
                        <h4 className="text-white font-bold text-xs sm:text-sm">{news.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 self-start sm:self-center text-right whitespace-nowrap">
                        <div>{news.date}</div>
                        <div>{news.readTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="text-slate-200 font-bold mb-1">What is Golden Hour?</h4>
                      <p className="text-slate-400 leading-relaxed">
                        The first 2 hours after a cyber financial crime occurs. Calling 1930 instantly allows banks to block destination accounts.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-bold mb-1">How can CyberSathi scan screenshots?</h4>
                      <p className="text-slate-400 leading-relaxed">
                        We use Gemini Multimodal OCR vision to detect fake receipt generators, checking spacing discrepancies and font inconsistencies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 text-center">
                  <button onClick={() => setActiveTab("quiz")} className="glass-btn-primary font-bold py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wide w-full cursor-pointer animate-pulse">
                    🧠 Take the Cyber Quiz
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI SCANNER SECTION */}
        {activeTab === "scanner" && (
          <div className="animate-fadeIn">
            <ScannerSection onScanCompleted={handleScanCompletion} />
          </div>
        )}

        {/* TAB 3: ANALYTICS DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fadeIn">
            <Dashboard 
              userQuizScore={userProfile.cyberScore} 
              scanHistoryCount={userProfile.scannedHistory.length} 
            />
          </div>
        )}

        {/* TAB 4: EMERGENCY RESPONSE */}
        {activeTab === "emergency" && (
          <div className="animate-fadeIn">
            <EmergencyResponse />
          </div>
        )}

        {/* TAB 5: CYBER QUIZ */}
        {activeTab === "quiz" && (
          <div className="animate-fadeIn">
            <QuizSection onQuizCompleted={handleQuizCompletion} />
          </div>
        )}

        {/* TAB 6: USER PROFILE & ACHIEVEMENTS */}
        {activeTab === "profile" && isLoggedIn && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn" id="profile-view">
            
            {/* User credentials & achievements */}
            <div className="space-y-6">
              
              <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="h-16 w-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  {userProfile.fullName.charAt(0)}
                </div>
                <h3 className="text-white font-bold text-lg">{userProfile.fullName}</h3>
                <span className="text-xs font-mono text-slate-400">{userProfile.email}</span>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">CYBER SCORE</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">{userProfile.cyberScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">SECURITY LEVEL</span>
                    <span className="text-xs font-bold text-emerald-400">🛡️ SECURE</span>
                  </div>
                </div>
              </div>

              {/* Badges unlocked */}
              <div className="glass-card rounded-2xl p-6">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-cyan-400" />
                  <span>Aura Badges Unlocked</span>
                </h4>
                <div className="space-y-3">
                  {userProfile.achievements.map((ach) => (
                    <div key={ach.id} className={`p-3 rounded-lg border flex gap-3 items-center ${
                      ach.unlocked ? "bg-white/2 border-white/5" : "bg-black/10 border-white/5 opacity-40"
                    }`}>
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

            {/* Scan Activity History Logs */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold text-base mb-4">Your Recent AI Scan History</h3>
              <div className="space-y-3">
                {userProfile.scannedHistory.map((item) => (
                  <div key={item.id} className="p-4 bg-white/2 border border-white/5 rounded-xl flex justify-between items-center hover:border-white/10 transition-all">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500">{item.date} • {item.type}</span>
                      <h4 className="text-xs sm:text-sm text-slate-200 truncate max-w-sm">{item.input}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        item.status === "Fraud" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        item.status === "Suspicious" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
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

        {/* TAB 7: ABOUT */}
        {activeTab === "about" && (
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn" id="about-view">
            <div className="text-center space-y-2 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">About CyberSathi AI</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                CyberSathi AI is a cutting-edge platform designed to democratize cybersecurity and shield retail internet users from escalating UPI scams, fraud SMSes, and malicious redirects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/2 p-5 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Our Mission</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In India, millions fall victim to financial cyber fraud due to subtle social engineering scams like electricity disconnected warnings or receiving dummy UPI pay screenshots. CyberSathi empowers everyday citizens to immediately verify these incoming alerts, blocking scams before funds leave the account.
                </p>
              </div>

              <div className="bg-white/2 p-5 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-purple-400" />
                  <span>Golden Hour Protocols</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We bridge the technical gap between cyber victims and law enforcement. By supplying auto-generated, legally formatted bank freeze complaint templates, we enable immediate asset hold requests, saving precious hours before transaction traces vanish.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center">
              <span className="text-xs font-mono text-cyan-300">
                Created with ❤️ using Gemini AI Core technology for Cyber Safety Hackathon.
              </span>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 z-10 text-slate-500 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab("home")} className="hover:text-white transition">Home</button>
            <button onClick={() => setActiveTab("scanner")} className="hover:text-white transition">AI Scanner</button>
            <button onClick={() => setActiveTab("dashboard")} className="hover:text-white transition">Dashboard</button>
            <button onClick={() => setActiveTab("quiz")} className="hover:text-white transition">Cyber Quiz</button>
          </div>
          <p>© 2026 CyberSathi AI. Ministry of Home Affairs compliant guidelines. Protect. Detect. Respond.</p>
          <p className="text-[10px] text-slate-600">Disclaimer: All diagnostics are generated by server-side Gemini LLMs and forensic image OCR checks. Verify with official banking nodal channels.</p>
        </div>
      </footer>

      {/* FLOATING CHAT WIDGET TOGGLE BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1.5px] shadow-[0_4px_20px_rgba(0,229,255,0.4)] hover:scale-105 transition cursor-pointer flex items-center justify-center relative"
            id="floating-chat-toggle"
            title="Chat with CyberSathi AI assistant"
          >
            <div className="h-full w-full bg-[#050816] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          </button>
        ) : (
          <div className="relative">
            <AIChatbot />
            <button
              onClick={() => setChatOpen(false)}
              className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white transition flex items-center justify-center text-xs font-bold"
              title="Close Chat"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* AUTHENTICATION MODAL (MOCK UI) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-white font-bold text-lg mb-1">Access CyberSathi</h3>
            <p className="text-xs text-slate-400 mb-5">Login with your credentials to unlock secure profiling, scans memory, and custom achievements badges.</p>

            {/* Select method */}
            <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-lg border border-slate-850 mb-5">
              <button
                onClick={() => setAuthMethod("google")}
                className={`py-1.5 text-[10px] font-bold rounded font-mono ${authMethod === "google" ? "bg-cyan-500/10 text-cyan-300" : "text-slate-400"}`}
              >
                Google
              </button>
              <button
                onClick={() => setAuthMethod("otp")}
                className={`py-1.5 text-[10px] font-bold rounded font-mono ${authMethod === "otp" ? "bg-cyan-500/10 text-cyan-300" : "text-slate-400"}`}
              >
                OTP Login
              </button>
              <button
                onClick={() => setAuthMethod("face")}
                className={`py-1.5 text-[10px] font-bold rounded font-mono ${authMethod === "face" ? "bg-cyan-500/10 text-cyan-300" : "text-slate-400"}`}
              >
                Face Auth
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authMethod === "google" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Google Credentials Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {authMethod === "otp" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765-XXXXX"
                      className="w-full bg-slate-950/80 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={authOtp}
                      onChange={(e) => setAuthOtp(e.target.value)}
                      className="flex-1 bg-slate-950/80 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                    <button type="button" className="bg-slate-850 border border-slate-800 text-cyan-400 hover:text-white px-3 py-2 rounded-lg text-[10px] font-mono whitespace-nowrap">
                      Send OTP
                    </button>
                  </div>
                </div>
              )}

              {authMethod === "face" && (
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-400/20 mx-auto flex items-center justify-center animate-pulse">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-200 font-bold block">Biometric Scan Active</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Looking for biometric Face ID coordinates</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs font-mono uppercase tracking-wide cursor-pointer"
              >
                Authenticate & Login
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
