import React, { useState } from "react";
import { ScanResult } from "../types";
import { MOCK_SAMPLES } from "../data";
import { Shield, ShieldAlert, ShieldCheck, AlertOctagon, Link2, MessageSquare, QrCode, FileImage, Mail, Volume2, ArrowRight, Play, Upload, HelpCircle, Check, Copy } from "lucide-react";

interface ScannerSectionProps {
  onScanCompleted: (result: ScanResult) => void;
}

export default function ScannerSection({ onScanCompleted }: ScannerSectionProps) {
  const [activeTab, setActiveTab] = useState<"url" | "sms" | "qr" | "screenshot" | "email" | "voice">("url");
  
  // Input fields state
  const [inputUrl, setInputUrl] = useState("");
  const [inputSms, setInputSms] = useState("");
  const [inputQrText, setInputQrText] = useState("");
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSender, setEmailSender] = useState("");
  const [voiceText, setVoiceText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  // File handles
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "qr" | "screenshot") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "qr") {
        setQrBase64(base64String);
      } else {
        setScreenshotBase64(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger server-side scan API
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveResult(null);

    let endpoint = "";
    let payload: any = {};

    try {
      if (activeTab === "url") {
        endpoint = "/api/scan/url";
        payload = { url: inputUrl };
      } else if (activeTab === "sms") {
        endpoint = "/api/scan/sms";
        payload = { smsText: inputSms };
      } else if (activeTab === "qr") {
        endpoint = "/api/scan/qr";
        payload = { qrImageBase64: qrBase64, qrText: inputQrText || "upi://pay?pa=scamster@okhdfc&pn=PaytmUser&am=5000" };
      } else if (activeTab === "screenshot") {
        endpoint = "/api/scan/screenshot";
        payload = { screenshotBase64: screenshotBase64 || "" };
        if (!screenshotBase64) {
          alert("Please upload an image screenshot first or use the mock screenshot trigger.");
          setIsLoading(false);
          return;
        }
      } else if (activeTab === "email") {
        endpoint = "/api/scan/email";
        payload = { emailSubject, emailBody, senderAddress: emailSender };
      } else if (activeTab === "voice") {
        endpoint = "/api/scan/audio";
        payload = { audioText: voiceText };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setActiveResult(data);
      onScanCompleted(data); // Propagate to parent to log search and score changes
    } catch (err: any) {
      console.error(err);
      alert(`Scan failed: ${err.message || "Ensure server is running and GEMINI_API_KEY is configured in Secrets."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load a sample for immediate user testing!
  const loadSample = (type: string, sampleData: any) => {
    setActiveResult(null);
    if (type === "sms") {
      setInputSms(sampleData.text);
    } else if (type === "url") {
      setInputUrl(sampleData.url);
    } else if (type === "email") {
      setEmailSender(sampleData.sender);
      setEmailSubject(sampleData.subject);
      setEmailBody(sampleData.body);
    } else if (type === "voice") {
      setVoiceText(sampleData.text);
    } else if (type === "qr") {
      // Direct mock values for UPI links
      setInputQrText(sampleData.url || "upi://pay?pa=rewardclaim@icici&pn=SBI-Nodal&am=9500&cu=INR");
    } else if (type === "screenshot_mock") {
      // Set mock Paytm QR base64 code context
      setScreenshotBase64(sampleData.base64);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="scanner-command-center">
      
      {/* Tab selection Sidebar (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>AI Scanning Suite</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select a scanner module. Input suspicious links, text messages, UPI QR codes, or payment screenshots to let Gemini diagnose the security risk.
        </p>

        <div className="flex flex-col gap-2 bg-white/2 p-2.5 rounded-xl border border-white/5 backdrop-blur-md">
          
          <button
            onClick={() => { setActiveTab("url"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "url" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-url-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>Phishing URL Scanner</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("sms"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "sms" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-sms-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>SMS Scam Detector</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("qr"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "qr" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-qr-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>QR Code Scanner</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("screenshot"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "screenshot" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-screenshot-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <FileImage className="w-4 h-4 text-emerald-400" />
              <span>Screenshot OCR Scanner</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("email"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "email" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-email-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Mail className="w-4 h-4 text-violet-400" />
              <span>Email Analyzer</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveTab("voice"); setActiveResult(null); }}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
              activeTab === "voice" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
            id="tab-voice-scanner"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Volume2 className="w-4 h-4 text-red-400" />
              <span>Voice Scam call Tracker</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>

        </div>
      </div>

      {/* Main Scanner Inputs & Results (Right 3 cols) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* INPUT PANEL CARD */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <form onSubmit={handleScan} className="space-y-4">
            
            {/* 1. URL TAB */}
            {activeTab === "url" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">Inspect Web Address URL</label>
                  {/* Load quick mock */}
                  <span className="text-[10px] text-slate-500 flex gap-1.5 font-mono">
                    Quick Sample:
                    {MOCK_SAMPLES.url.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => loadSample("url", sample)}
                        className="text-cyan-400 hover:underline hover:text-cyan-300"
                      >
                        [{sample.title.split(" ")[0]}]
                      </button>
                    ))}
                  </span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.onlinesbi-secure-update.com/login"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                  id="url-input-field"
                />
              </div>
            )}

            {/* 2. SMS TAB */}
            {activeTab === "sms" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider">Paste suspicious SMS text</label>
                  <span className="text-[10px] text-slate-500 flex gap-1.5 font-mono">
                    Quick Sample:
                    {MOCK_SAMPLES.sms.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => loadSample("sms", sample)}
                        className="text-purple-400 hover:underline hover:text-purple-300"
                      >
                        [{sample.title.split(" ")[0]}]
                      </button>
                    ))}
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the raw text of the incoming SMS message here..."
                  value={inputSms}
                  onChange={(e) => setInputSms(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  id="sms-input-field"
                />
              </div>
            )}

            {/* 3. QR CODE TAB */}
            {activeTab === "qr" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">Upload QR Image or paste UPI payload</label>
                  <button
                    type="button"
                    onClick={() => loadSample("qr", { url: "upi://pay?pa=cashreward@paytm&pn=EarnPrize&am=8500&cu=INR" })}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    [Load Sample Fake UPI QR]
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload base64 representation */}
                  <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[140px] text-center backdrop-blur-sm">
                    {qrBase64 ? (
                      <div className="space-y-2">
                        <span className="text-xs text-emerald-400 font-mono block">✓ QR Image Attached</span>
                        <button
                          type="button"
                          onClick={() => setQrBase64(null)}
                          className="text-[10px] text-red-400 hover:underline font-mono"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2.5 block w-full">
                        <Upload className="w-7 h-7 text-amber-400 mx-auto" />
                        <div>
                          <span className="text-xs font-semibold text-slate-300 block">Drag & Drop QR Image</span>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">JPEG or PNG file</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "qr")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* UPI text alternative */}
                  <div className="flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">Decoded UPI/Redirect Address</span>
                    <textarea
                      placeholder="e.g. upi://pay?pa=scamster@okhdfc&pn=PaytmUser..."
                      value={inputQrText}
                      onChange={(e) => setInputQrText(e.target.value)}
                      className="w-full flex-1 glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SCREENSHOT OCR TAB */}
            {activeTab === "screenshot" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">Upload payment / banking receipt screenshot</label>
                  <button
                    type="button"
                    onClick={() => {
                      // Simulating a real Paytm scam receipt file in base64 to test multimodal scanner
                      setScreenshotBase64("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
                    }}
                    className="text-[10px] text-emerald-400 hover:underline font-mono"
                  >
                    [Mock Fake Paytm Receipt Screenshot]
                  </button>
                </div>

                <div className="bg-white/2 border border-white/5 rounded-xl p-6 text-center backdrop-blur-sm">
                  {screenshotBase64 ? (
                    <div className="space-y-3">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded mx-auto flex items-center justify-center">
                        <FileImage className="w-10 h-10 text-emerald-400" />
                      </div>
                      <span className="text-xs text-emerald-400 font-mono block">✓ Forensic Image Registered for OCR</span>
                      <button
                        type="button"
                        onClick={() => setScreenshotBase64(null)}
                        className="text-[10px] text-red-400 hover:underline font-mono"
                      >
                        Clear Screenshot
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2.5 block">
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div>
                        <span className="text-xs font-semibold text-slate-300 block">Select receipt or customer care screenshot</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">JPG, PNG format</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "screenshot")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* 5. EMAIL ANALYZER TAB */}
            {activeTab === "email" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-violet-400 font-mono uppercase tracking-wider">Phishing Email Inspection</label>
                  <button
                    type="button"
                    onClick={() => loadSample("email", MOCK_SAMPLES.email[0])}
                    className="text-[10px] text-violet-400 hover:underline font-mono"
                  >
                    [Load Refund Phishing Scam]
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Sender Address</label>
                    <input
                      type="text"
                      placeholder="e.g. support@income-tax-gov-india.org"
                      value={emailSender}
                      onChange={(e) => setEmailSender(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Subject Line</label>
                    <input
                      type="text"
                      placeholder="e.g. Immediate Tax Refund authorized"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Email Body Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Paste the full body text or email header details..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 6. VOICE SCAM TAB */}
            {activeTab === "voice" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-red-400 font-mono uppercase tracking-wider">Voice call Speech-to-Text Analyzer</label>
                  <span className="text-[10px] text-slate-500 flex gap-1.5 font-mono">
                    Quick Sample:
                    {MOCK_SAMPLES.voice.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => loadSample("voice", sample)}
                        className="text-red-400 hover:underline hover:text-red-300"
                      >
                        [{sample.title.split(" ")[0]}]
                      </button>
                    ))}
                  </span>
                </div>
                
                <textarea
                  required
                  rows={4}
                  placeholder="Type or paste the transcript of the call (e.g. 'This is Mumbai custom narcotics calling. Your packages contains illegal drugs...')"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                />
              </div>
            )}

            {/* Core Action triggers */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-btn-primary py-3 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {isLoading ? "Consulting CyberSathi AI Security Matrix..." : "🛡️ Scan with CyberSathi AI"}
            </button>
          </form>
        </div>

        {/* RESULTS PANEL CARD */}
        {activeResult && (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="scanner-result-panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-white/5">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">DIAGNOSTIC REPORT</span>
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  {activeResult.status === "Safe" ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Security Verdict: Clear & Safe</span>
                    </>
                  ) : activeResult.status === "Suspicious" ? (
                    <>
                      <AlertOctagon className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span>Security Verdict: Suspicious Flags Found</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                      <span>Security Verdict: Dangerous Fraud Detected</span>
                    </>
                  )}
                </h4>
              </div>

              {/* Threat index meter badge */}
              <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                activeResult.status === "Safe" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : activeResult.status === "Suspicious" 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
              }`}>
                <span>Threat Risk Score:</span>
                <span className="text-sm">{activeResult.riskScore}/100</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Highlighted text sections for SMS Scams (Unique UI detail!) */}
              {activeTab === "sms" && activeResult.highlights && activeResult.highlights.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Sentence Forensic Highlights</span>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {inputSms.split(" ").map((word, wIdx) => {
                        // Check if word or subset matches highlight
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

              {/* Text explanations / detailed summaries */}
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Threat Forensic Summary</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-lg border border-white/5">
                  {activeResult.threatDetails || activeResult.forensicAnalysis || activeResult.transcriptAnalysis || activeResult.verdictExplanation}
                </p>
              </div>

              {/* Flags list */}
              {(activeResult.indicators || activeResult.detectedAnomalies || activeResult.findings || activeResult.detectedPhishingTechniques) && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Anomalies Detected</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(activeResult.indicators || activeResult.detectedAnomalies || activeResult.findings || activeResult.detectedPhishingTechniques)?.map((item, idx) => (
                      <div key={idx} className="bg-black/40 px-3 py-2 rounded border border-white/5 text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 font-mono text-[10px] mt-0.5 select-none">⚠</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action recommendations / safety checklists */}
              {(activeResult.actionSteps || activeResult.recommendation) && (
                <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">CyberSathi Shield Directives</h5>
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

      </div>

    </div>
  );
}
