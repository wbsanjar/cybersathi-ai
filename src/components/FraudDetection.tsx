import React, { useState } from "react";
import { ScanResult } from "../types";
import { Shield, ShieldAlert, ShieldCheck, AlertOctagon, CreditCard, Landmark, Scan, FileImage, QrCode, Upload, ArrowRight, Search, Building2, UserCheck, AlertTriangle } from "lucide-react";

export default function FraudDetection({ t, onScanCompleted }: { t?: (key: string) => string; onScanCompleted?: (result: ScanResult) => void }) {
  const _t = t || ((key: string) => key as string);
  const [activeTab, setActiveTab] = useState<"transaction" | "upi" | "bank" | "screenshot" | "qr">("transaction");

  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionReceiver, setTransactionReceiver] = useState("");
  const [transactionNote, setTransactionNote] = useState("");

  const [upiId, setUpiId] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrText, setQrText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "screenshot" | "qr") => {
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

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveResult(null);

    let endpoint = "";
    let payload: any = {};

    try {
      if (activeTab === "transaction") {
        endpoint = "/api/scan/transaction";
        payload = { amount: transactionAmount, receiver: transactionReceiver, note: transactionNote };
      } else if (activeTab === "upi") {
        endpoint = "/api/scan/upi";
        payload = { upiId };
      } else if (activeTab === "bank") {
        endpoint = "/api/scan/bank";
        payload = { accountNumber, ifscCode };
      } else if (activeTab === "screenshot") {
        endpoint = "/api/scan/screenshot";
        payload = { screenshotBase64: screenshotBase64 || "" };
        if (!screenshotBase64) {
          alert("Please upload a payment screenshot image first.");
          setIsLoading(false);
          return;
        }
      } else if (activeTab === "qr") {
        endpoint = "/api/scan/qr";
        payload = { qrImageBase64: qrBase64, qrText: qrText || "upi://pay?pa=merchant@paytm&pn=Merchant&am=5000" };
      }

      const response = await fetch(endpoint, {
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

  const loadSample = (type: string) => {
    setActiveResult(null);
    if (type === "transaction") {
      setTransactionAmount("8500");
      setTransactionReceiver("rewardclaim@icici");
      setTransactionNote("Tax refund processing fee");
    } else if (type === "upi") {
      setUpiId("cashreward@paytm");
    } else if (type === "bank") {
      setAccountNumber("123456789012");
      setIfscCode("SBIN0001234");
    } else if (type === "screenshot") {
      setScreenshotBase64("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
    } else if (type === "qr") {
      setQrText("upi://pay?pa=scamster@okhdfc&pn=PaytmUser&am=5000");
    }
  };

  const tabs = [
    { id: "transaction" as const, label: _t("fraudTabTransaction"), icon: CreditCard, color: "text-cyan-400" },
    { id: "upi" as const, label: _t("fraudTabUpi"), icon: UserCheck, color: "text-purple-400" },
    { id: "bank" as const, label: _t("fraudTabBank"), icon: Landmark, color: "text-amber-400" },
    { id: "screenshot" as const, label: _t("fraudTabScreenshot"), icon: FileImage, color: "text-emerald-400" },
    { id: "qr" as const, label: _t("fraudTabQr"), icon: QrCode, color: "text-rose-400" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="fraud-detection-hub">

      {/* Tab Selection Sidebar - Left 2 cols */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>{_t("fraudTitle")}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {_t("fraudDesc")}
        </p>

        <div className="flex flex-col gap-2 bg-white/2 p-2.5 rounded-xl border border-white/5 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveResult(null); }}
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                activeTab === tab.id ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]" : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Safety Tips Panel */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{_t("fraudSafetyTitle")}</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <Scan className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{_t("fraudSafety1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{_t("fraudSafety2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{_t("fraudSafety3")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Scanner Inputs & Results - Right 3 cols */}
      <div className="lg:col-span-3 space-y-6">

        {/* INPUT PANEL */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <form onSubmit={handleScan} className="space-y-4">

            {/* 1. TRANSACTION SAFETY ANALYSIS */}
            {activeTab === "transaction" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">{_t("fraudTransactionLabel")}</label>
                  <button
                    type="button"
                    onClick={() => loadSample("transaction")}
                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                  >
                    {_t("fraudTransactionSample")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudTransactionAmount")}</label>
                    <input
                      type="number"
                      required
                      placeholder={_t("fraudTransactionAmtPlaceholder")}
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudTransactionReceiver")}</label>
                    <input
                      type="text"
                      required
                      placeholder={_t("fraudTransactionRecPlaceholder")}
                      value={transactionReceiver}
                      onChange={(e) => setTransactionReceiver(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudTransactionNote")}</label>
                  <input
                    type="text"
                    placeholder={_t("fraudTransactionNotePlaceholder")}
                    value={transactionNote}
                    onChange={(e) => setTransactionNote(e.target.value)}
                    className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>
              </div>
            )}

            {/* 2. UPI ID VERIFICATION */}
            {activeTab === "upi" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider">{_t("fraudUpiLabel")}</label>
                  <button
                    type="button"
                    onClick={() => loadSample("upi")}
                    className="text-[10px] text-purple-400 hover:underline font-mono"
                  >
                    {_t("fraudUpiSample")}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder={_t("fraudUpiPlaceholder")}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full glass-input rounded-lg py-2.5 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  {_t("fraudUpiDesc")}
                </p>
              </div>
            )}

            {/* 3. BANK ACCOUNT RISK CHECK */}
            {activeTab === "bank" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">{_t("fraudBankLabel")}</label>
                  <button
                    type="button"
                    onClick={() => loadSample("bank")}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    {_t("fraudBankSample")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudBankAccount")}</label>
                    <input
                      type="text"
                      required
                      placeholder={_t("fraudBankAccountPlaceholder")}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudBankIfsc")}</label>
                    <input
                      type="text"
                      required
                      placeholder={_t("fraudBankIfscPlaceholder")}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  {_t("fraudBankDesc")}
                </p>
              </div>
            )}

            {/* 4. FAKE PAYMENT SCREENSHOT DETECTION */}
            {activeTab === "screenshot" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">{_t("fraudScreenshotLabel")}</label>
                  <button
                    type="button"
                    onClick={() => loadSample("screenshot")}
                    className="text-[10px] text-emerald-400 hover:underline font-mono"
                  >
                    {_t("fraudScreenshotSample")}
                  </button>
                </div>
                <div className="bg-white/2 border border-white/5 rounded-xl p-6 text-center backdrop-blur-sm">
                  {screenshotBase64 ? (
                    <div className="space-y-3">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded mx-auto flex items-center justify-center">
                        <FileImage className="w-10 h-10 text-emerald-400" />
                      </div>
                      <span className="text-xs text-emerald-400 font-mono block">{_t("fraudScreenshotLoaded")}</span>
                      <button
                        type="button"
                        onClick={() => setScreenshotBase64(null)}
                        className="text-[10px] text-red-400 hover:underline font-mono"
                      >
                        {_t("fraudScreenshotClear")}
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2.5 block">
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div>
                        <span className="text-xs font-semibold text-slate-300 block">{_t("fraudScreenshotUpload")}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{_t("fraudScreenshotFormat")}</span>
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
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  {_t("fraudScreenshotDesc")}
                </p>
              </div>
            )}

            {/* 5. QR CODE SECURITY SCANNER */}
            {activeTab === "qr" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-rose-400 font-mono uppercase tracking-wider">{_t("fraudQrLabel")}</label>
                  <button
                    type="button"
                    onClick={() => loadSample("qr")}
                    className="text-[10px] text-rose-400 hover:underline font-mono"
                  >
                    {_t("fraudQrSample")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[140px] text-center backdrop-blur-sm">
                    {qrBase64 ? (
                      <div className="space-y-2">
                        <span className="text-xs text-emerald-400 font-mono block">{_t("fraudQrAttached")}</span>
                        <button
                          type="button"
                          onClick={() => setQrBase64(null)}
                          className="text-[10px] text-red-400 hover:underline font-mono"
                        >
                          {_t("fraudQrRemove")}
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2.5 block w-full">
                        <Upload className="w-7 h-7 text-rose-400 mx-auto" />
                        <div>
                          <span className="text-xs font-semibold text-slate-300 block">{_t("fraudQrUpload")}</span>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{_t("fraudQrFormat")}</span>
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
                  <div className="flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">{_t("fraudQrDecoded")}</span>
                    <textarea
                      placeholder={_t("fraudQrPlaceholder")}
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      className="w-full flex-1 glass-input rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-btn-primary py-3 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              {isLoading ? _t("fraudAnalyzing") : _t("fraudAnalyze")}
            </button>
          </form>
        </div>

        {/* RESULTS PANEL */}
        {activeResult && (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="fraud-result-panel">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-white/5">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">{_t("fraudReport")}</span>
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  {activeResult.status === "Safe" ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>{_t("fraudVerdictSafe")}</span>
                    </>
                  ) : activeResult.status === "Suspicious" ? (
                    <>
                      <AlertOctagon className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span>{_t("fraudVerdictSuspicious")}</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                      <span>{_t("fraudVerdictFraud")}</span>
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
                <span>{_t("fraudRiskScore")}</span>
                <span className="text-sm">{activeResult.riskScore}/100</span>
              </div>
            </div>

            <div className="space-y-4">
              {activeResult.scamType && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudThreatClass")}</span>
                  <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-300 font-mono font-bold">{activeResult.scamType}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudForensic")}</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-lg border border-white/5">
                  {activeResult.threatDetails || activeResult.forensicAnalysis || activeResult.verdictExplanation || activeResult.transcriptAnalysis}
                </p>
              </div>

              {(activeResult.indicators || activeResult.findings || activeResult.detectedAnomalies) && (
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">{_t("fraudRedFlags")}</span>
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

              {(activeResult.actionSteps || activeResult.recommendation) && (
                <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">{_t("fraudDirectives")}</h5>
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
