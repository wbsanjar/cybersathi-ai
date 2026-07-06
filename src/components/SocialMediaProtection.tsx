import React, { useState } from "react";
import { ScanResult } from "../types";
import { MOCK_SAMPLES } from "../data";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Users, MessageCircle, AlertOctagon, Bot, Globe, ExternalLink, ArrowRight, Lightbulb, DollarSign, Smartphone, Hash } from "lucide-react";

export default function SocialMediaProtection({ t, onScanCompleted }: { t?: (key: string) => string; onScanCompleted?: (result: ScanResult) => void }) {
  const _t = t || ((key: string) => key as string);
  const [activeTab, setActiveTab] = useState<"profile" | "message">("profile");

  const [profileUrl, setProfileUrl] = useState("");
  const [profileName, setProfileName] = useState("");
  const [messageText, setMessageText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveResult(null);

    let payload: any = {};

    try {
      if (activeTab === "profile") {
        payload = { profileUrl, profileName };
      } else {
        payload = { messageText };
      }

      const response = await fetch("/api/scan/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setActiveResult(data);
    } catch (err: any) {
      console.error(err);
      alert(`Scan failed: ${err.message || "Ensure server is running and GEMINI_API_KEY is configured in Secrets."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (type: string, sampleData: any) => {
    setActiveResult(null);
    if (type === "profile") {
      setProfileUrl(sampleData.profileUrl || "");
      setProfileName(sampleData.profileName || "");
    } else if (type === "message") {
      setMessageText(sampleData.text || "");
    }
  };

  const profileSamples = MOCK_SAMPLES.social.filter(s => s.profileUrl);
  const messageSamples = MOCK_SAMPLES.social.filter(s => s.text);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="social-media-protection">
      
      {/* Tab selection Sidebar (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>{_t("socialTitle")}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {_t("socialDesc")}
        </p>

        <div className="flex flex-col gap-2 bg-white/2 p-2.5 rounded-xl border border-white/5 backdrop-blur-md">
          
          <button
            onClick={() => { setActiveTab("profile"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "profile" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-fake-profile"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{_t("socialTabProfile")}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("message"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "message" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-scam-message"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span>{_t("socialTabMessage")}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

        </div>

        {/* Investment Scam Alerts & Safety Tips Panel */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>{_t("socialInvestTitle")}</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              <span>{_t("socialInvest1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              <span>{_t("socialInvest2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              <span>{_t("socialInvest3")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>{_t("socialInvest4")}</span>
            </li>
          </ul>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{_t("socialWATitle")}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <Hash className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{_t("socialWATip1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Hash className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{_t("socialWATip2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Hash className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{_t("socialWATip3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Hash className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{_t("socialWATip4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Input & Results (Right 3 cols) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* INPUT PANEL CARD */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <form onSubmit={handleScan} className="space-y-4">
            
            {/* 1. FAKE PROFILE DETECTION TAB */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">{_t("socialProfileUrl")}</label>
                  <span className="text-[10px] text-slate-500 flex gap-1.5 font-mono">
                    {_t("socialQuickSample")}
                    {profileSamples.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => loadSample("profile", sample)}
                        className="text-cyan-400 hover:underline hover:text-cyan-300"
                      >
                        [{sample.title.split(" ")[0]}]
                      </button>
                    ))}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={_t("socialProfilePlaceholder")}
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                  id="profile-url-input"
                />
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("socialProfileName")}</label>
                  <input
                    type="text"
                    placeholder={_t("socialProfileNamePlaceholder")}
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    id="profile-name-input"
                  />
                </div>
              </div>
            )}

            {/* 2. SCAM MESSAGE ANALYSIS TAB */}
            {activeTab === "message" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider">{_t("socialMessageLabel")}</label>
                  <span className="text-[10px] text-slate-500 flex gap-1.5 font-mono">
                    {_t("socialQuickSample")}
                    {messageSamples.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => loadSample("message", sample)}
                        className="text-purple-400 hover:underline hover:text-purple-300"
                      >
                        [{sample.title.split(" ")[0]}]
                      </button>
                    ))}
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder={_t("socialMessagePlaceholder")}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  id="message-input-field"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-btn-primary py-3 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {isLoading ? _t("socialAnalyzing") : _t("socialAnalyze")}
            </button>
          </form>
        </div>

        {/* RESULTS PANEL CARD */}
        {activeResult && (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="social-result-panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-white/5">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">{_t("socialReport")}</span>
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  {activeResult.status === "Safe" ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>{_t("socialVerdictSafe")}</span>
                    </>
                  ) : activeResult.status === "Suspicious" ? (
                    <>
                      <AlertOctagon className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span>{_t("socialVerdictSuspicious")}</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                      <span>{_t("socialVerdictFraud")}</span>
                    </>
                  )}
                </h4>
              </div>

              <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                activeResult.status === "Safe" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : activeResult.status === "Suspicious" 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
              }`}>
                <span>{_t("socialRiskScore")}</span>
                <span className="text-sm">{activeResult.riskScore}/100</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Scam type badge */}
              {activeResult.scamType && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("socialThreatClass")}</span>
                  <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                    <Bot className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-300 font-mono font-bold">{activeResult.scamType}</span>
                  </div>
                </div>
              )}

              {/* Highlights section for message analysis */}
              {activeTab === "message" && activeResult.highlights && activeResult.highlights.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("socialHighlights")}</span>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {messageText.split(" ").map((word, wIdx) => {
                        const matchedHighlight = activeResult.highlights?.find(h => 
                          h.text.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""))
                        );
                        if (matchedHighlight) {
                          return (
                            <span 
                              key={wIdx} 
                              className={`underline decoration-2 font-bold select-all cursor-help ${
                                matchedHighlight.severity === "high" ? "text-red-400 decoration-red-500 bg-red-500/5" : "text-amber-400 decoration-amber-500 bg-amber-500/5"
                              }`}
                              title={`${matchedHighlight.reason}`}
                            >
                              {word}{" "}
                            </span>
                          );
                        }
                        return word + " ";
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Forensic analysis / threat summary */}
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("socialForensic")}</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-lg border border-white/5">
                  {activeResult.threatDetails || activeResult.forensicAnalysis || activeResult.verdictExplanation || activeResult.transcriptAnalysis}
                </p>
              </div>

              {/* Indicators / Findings */}
              {(activeResult.indicators || activeResult.findings || activeResult.detectedAnomalies) && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("socialRedFlags")}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(activeResult.indicators || activeResult.findings || activeResult.detectedAnomalies)?.map((item, idx) => (
                      <div key={idx} className="bg-black/40 px-3 py-2 rounded border border-white/5 text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 font-mono text-[10px] mt-0.5 select-none">⚠</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action steps / recommendations */}
              {(activeResult.actionSteps || activeResult.recommendation) && (
                <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">{_t("socialDirectives")}</h5>
                  </div>
                  {activeResult.actionSteps ? (
                    <ul className="space-y-1.5 text-xs text-cyan-200/80 list-disc list-inside leading-relaxed">
                      {activeResult.actionSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-cyan-200/80 leading-relaxed">
                      {activeResult.recommendation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Educational section at bottom */}
        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{_t("socialHowTitle")}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="bg-white/2 border border-white/5 rounded-xl p-3.5 space-y-1.5">
              <span className="text-cyan-400 font-bold font-mono text-[10px] uppercase tracking-wider">{_t("socialHowFake")}</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>{_t("socialHowFake1")}</li>
                <li>{_t("socialHowFake2")}</li>
                <li>{_t("socialHowFake3")}</li>
                <li>{_t("socialHowFake4")}</li>
              </ul>
            </div>
            <div className="bg-white/2 border border-white/5 rounded-xl p-3.5 space-y-1.5">
              <span className="text-purple-400 font-bold font-mono text-[10px] uppercase tracking-wider">{_t("socialHowScam")}</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>{_t("socialHowScam1")}</li>
                <li>{_t("socialHowScam2")}</li>
                <li>{_t("socialHowScam3")}</li>
                <li>{_t("socialHowScam4")}</li>
              </ul>
            </div>
            <div className="bg-white/2 border border-white/5 rounded-xl p-3.5 space-y-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px] uppercase tracking-wider">{_t("socialHowInvest")}</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>{_t("socialHowInvest1")}</li>
                <li>{_t("socialHowInvest2")}</li>
                <li>{_t("socialHowInvest3")}</li>
                <li>{_t("socialHowInvest4")}</li>
              </ul>
            </div>
            <div className="bg-white/2 border border-white/5 rounded-xl p-3.5 space-y-1.5">
              <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase tracking-wider">{_t("socialHowSafe")}</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>{_t("socialHowSafe1")}</li>
                <li>{_t("socialHowSafe2")}</li>
                <li>{_t("socialHowSafe3")}</li>
                <li>{_t("socialHowSafe4")}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
