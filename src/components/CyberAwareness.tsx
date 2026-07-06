import React, { useState } from "react";
import { AWARENESS_ARTICLES, SCAM_ALERTS, SECURITY_CHECKLIST, QUIZ_QUESTIONS } from "../data";
import { AwarenessArticle, ScamAlert, SecurityChecklistItem } from "../types";
import {
  BookOpen, AlertTriangle, ClipboardCheck, Video, Brain,
  Clock, User, ChevronRight, ShieldAlert, Shield,
  CheckCircle, Circle, AlertCircle, Play, Monitor,
  HelpCircle, ArrowRight, RotateCcw, Award, Check,
  ExternalLink
} from "lucide-react";

type TabType = "articles" | "scam-alerts" | "checklist" | "videos" | "quiz";

const severityStyles: Record<string, string> = {
  critical: "bg-red-500/10 border-red-500/20 text-red-400",
  high: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  low: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

const categoryColors: Record<string, string> = {
  article: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  video: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  guide: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  news: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "articles", label: "Articles", icon: BookOpen },
  { id: "scam-alerts", label: "Scam Alerts", icon: AlertTriangle },
  { id: "checklist", label: "Security Checklist", icon: ClipboardCheck },
  { id: "videos", label: "Video Learning", icon: Video },
  { id: "quiz", label: "Daily Quiz", icon: Brain },
];

const tabLabels: Record<string, string> = {
  articles: "learnArticles",
  "scam-alerts": "learnScamAlerts",
  checklist: "learnChecklist",
  videos: "learnVideos",
  quiz: "learnQuiz",
};

interface CyberAwarenessProps {
  t: (key: string) => string;
  lang: string;
}

export default function CyberAwareness({ t, lang }: CyberAwarenessProps) {
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [checklist, setChecklist] = useState<SecurityChecklistItem[]>(SECURITY_CHECKLIST);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const currentQuestion = QUIZ_QUESTIONS[quizIdx];

  const handleQuizSelect = (idx: number) => {
    if (!quizAnswered) setQuizSelected(idx);
  };

  const handleQuizVerify = () => {
    if (quizSelected === null) return;
    setQuizAnswered(true);
    if (quizSelected === currentQuestion.correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleQuizNext = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx((i) => i + 1);
      setQuizSelected(null);
      setQuizAnswered(false);
    } else {
      setQuizDone(true);
    }
  };

  const handleQuizReset = () => {
    setQuizIdx(0);
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <div className="space-y-6" id="cyber-awareness-section">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-cyan-400" />
        <h2 className="text-white font-bold text-lg">{t("learnTitle")}</h2>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
        {t("learnSubtitle")}
      </p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white/2 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setQuizDone(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                  : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(tabLabels[tab.id])}</span>
            </button>
          );
        })}
      </div>

      {/* ARTICLES TAB */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AWARENESS_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="glass-card rounded-2xl p-5 relative overflow-hidden hover:border-white/10 transition-all group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${categoryColors[article.category] || categoryColors.article}`}
                  >
                    {article.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCAM ALERTS TAB */}
      {activeTab === "scam-alerts" && (
        <div className="space-y-4">
          {SCAM_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="glass-card rounded-2xl p-5 relative overflow-hidden hover:border-white/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className={`p-2.5 rounded-xl border ${severityStyles[alert.severity]}`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-sm">{alert.title}</h4>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${severityStyles[alert.severity]}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {alert.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {alert.platform}
                    </span>
                    <span>•</span>
                    <span>{alert.affectedUsers} affected</span>
                    <span>•</span>
                    <span>{alert.date}</span>
                    <span>•</span>
                    <span className="text-slate-400">{alert.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECURITY CHECKLIST TAB */}
      {activeTab === "checklist" && (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                <span>Security Checklist</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Track your cyber security readiness
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  item.completed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-semibold ${
                      item.completed ? "text-emerald-300 line-through" : "text-white"
                    }`}
                  >
                    {item.title}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-white/5 border-white/5 text-slate-500 uppercase flex-shrink-0">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO LEARNING TAB */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "How to Spot Phishing Emails",
              duration: "12:30",
              desc: "Learn to identify the tell-tale signs of phishing attempts in emails and messages.",
              level: "Beginner",
            },
            {
              title: "UPI Safety Guide",
              duration: "15:45",
              desc: "Complete walkthrough of safe UPI practices and common scam patterns.",
              level: "Beginner",
            },
            {
              title: "Digital Arrest Scam Explained",
              duration: "08:20",
              desc: "Understand how digital arrest scams work and how to protect yourself.",
              level: "All Levels",
            },
            {
              title: "Secure Your Social Media",
              duration: "10:15",
              desc: "Privacy settings and security tips for popular social media platforms.",
              level: "Intermediate",
            },
            {
              title: "Two-Factor Authentication Setup",
              duration: "06:50",
              desc: "Step-by-step guide to enabling 2FA on your important accounts.",
              level: "Beginner",
            },
            {
              title: "Safe Online Shopping Practices",
              duration: "11:30",
              desc: "Tips for secure online shopping and recognizing fake e-commerce sites.",
              level: "All Levels",
            },
          ].map((video, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden hover:border-white/10 transition-all group cursor-pointer"
            >
              <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Monitor className="w-12 h-12 text-slate-600" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/80 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 text-slate-300 px-2 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-purple-500/10 border-purple-500/20 text-purple-400">
                    {video.level}
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{video.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DAILY QUIZ TAB */}
      {activeTab === "quiz" && (
        <div className="glass-card rounded-2xl p-6 max-w-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-bold text-base">Cyber Awareness Quiz</h3>
            {!quizDone && (
              <span className="text-xs font-mono text-slate-500 ml-auto">
                {quizIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            )}
          </div>

          {!quizDone ? (
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-base sm:text-lg leading-relaxed">
                {currentQuestion.question}
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  let btnStyle = "border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-slate-300";
                  if (quizSelected === idx) {
                    btnStyle = "border-cyan-400 bg-cyan-500/10 text-cyan-300 font-medium";
                  }
                  if (quizAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
                    } else if (quizSelected === idx) {
                      btnStyle = "border-red-500 bg-red-500/10 text-red-400";
                    } else {
                      btnStyle = "border-white/5 bg-white/1 text-slate-600 cursor-not-allowed";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      disabled={quizAnswered}
                      onClick={() => handleQuizSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all duration-200 flex gap-3 ${btnStyle}`}
                    >
                      <span className="font-mono font-bold text-slate-500 select-none">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
                    quizSelected === currentQuestion.correctIndex
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/20 border-red-500/30 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-bold">
                    {quizSelected === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                  <p className="text-[12px] opacity-90 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-slate-500">
                  Score: {quizScore}/{QUIZ_QUESTIONS.length}
                </span>
                {!quizAnswered ? (
                  <button
                    disabled={quizSelected === null}
                    onClick={handleQuizVerify}
                    className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide transition-all cursor-pointer disabled:opacity-40"
                  >
                    Verify Answer
                  </button>
                ) : (
                  <button
                    onClick={handleQuizNext}
                    className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{quizIdx < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Results"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-6">
              <Award className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">Quiz Completed!</h4>
                <p className="text-slate-400 text-sm">
                  You answered {quizScore} out of {QUIZ_QUESTIONS.length} correctly.
                </p>
              </div>
              <div className="max-w-md mx-auto rounded-xl border p-5 bg-cyan-500/5 border-cyan-500/20">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block mb-1">
                  YOUR SCORE
                </span>
                <h5 className="text-lg font-bold text-white mb-2">
                  {quizScore === QUIZ_QUESTIONS.length
                    ? "Cyber Shield Overlord"
                    : quizScore >= 3
                    ? "Phishing Detective"
                    : "Vulnerable Netizen"}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {quizScore === QUIZ_QUESTIONS.length
                    ? "Perfect score! You have flawless instincts against phishing, fake customer cares, and OTP traps."
                    : quizScore >= 3
                    ? "Great job! You recognize typical social engineering tricks, but stay alert for lookalike links."
                    : "Your defense score is vulnerable. Study the explanations carefully to safeguard your accounts."}
                </p>
              </div>
              <button
                onClick={handleQuizReset}
                className="bg-white/2 border border-white/5 hover:border-white/10 text-slate-300 font-bold py-3 px-6 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-2 transition mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
