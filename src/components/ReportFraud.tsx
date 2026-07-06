import React, { useState } from "react";
import { FileText, Upload, Shield, AlertTriangle, ExternalLink, CheckCircle, Clock, ArrowRight, Copy, Download, HelpCircle, Landmark, PhoneCall, Search } from "lucide-react";

const FRAUD_TYPES = [
  "UPI / Payment Fraud",
  "Phishing / Fake URL",
  "SIM Swap / OTP Theft",
  "Credit / Debit Card Fraud",
  "Loan / Investment Scam",
  "Online Shopping Fraud",
  "Social Media Impersonation",
  "Job / Work-from-Home Scam",
  "Ransomware / Malware",
  "Other"
];

const MOCK_COMPLAINTS = [
  { id: "CYS-2024-001", type: "UPI Fraud", date: "2024-11-12", status: "Under Investigation", amount: "₹48,500" },
  { id: "CYS-2024-002", type: "Phishing URL", date: "2024-10-28", status: "Resolved", amount: "₹12,000" },
  { id: "CYS-2024-003", type: "SIM Swap", date: "2024-09-15", status: "Action Required", amount: "₹1,20,000" }
];

export default function ReportFraud() {
  const [step, setStep] = useState<"form" | "report" | "evidence">("form");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dateTime, setDateTime] = useState("");

  const [generatedReport, setGeneratedReport] = useState("");
  const [evidenceGuide, setEvidenceGuide] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/scan/fraud-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, contact, email, fraudType, description, amount, dateTime })
      });
      const data = await res.json();
      if (data.reportText || data.report) {
        setGeneratedReport(data.reportText || data.report);
        setStep("report");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate fraud report. Please check backend connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvidenceGuide = async () => {
    setIsSubmittingEvidence(true);
    try {
      const res = await fetch("/api/emergency/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fraudType, description, amount })
      });
      const data = await res.json();
      if (data.guide || data.evidenceGuide) {
        setEvidenceGuide(data.guide || data.evidenceGuide);
        setStep("evidence");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch evidence guide.");
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files as FileList).map(f => f.name);
      setEvidenceFiles(prev => [...prev, ...names]);
    }
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedReport], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `CyberSathi_FraudReport_${fullName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8" id="report-fraud-container">

      {/* Header */}
      <div className="glass-card border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Cyber Fraud</h2>
              <p className="text-xs text-red-300/80 leading-relaxed max-w-xl">
                Report online fraud, financial scams, phishing attacks, or identity theft. CyberSathi AI will generate a formal complaint report and guide you on evidence collection for legal proceedings.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStep("form"); setShowStatus(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                step === "form" && !showStatus ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              Report
            </button>
            <button
              onClick={() => setShowStatus(!showStatus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                showStatus ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              <Search className="w-3.5 h-3.5 inline mr-1" />
              Track Status
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-cyan-500/30 transition-all group"
        >
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-sm">National Cyber Crime Portal</h4>
            <p className="text-[10px] text-slate-400 font-mono truncate">cybercrime.gov.in</p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all flex-shrink-0" />
        </a>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Cyber Helpline</h4>
            <p className="text-xs font-bold text-red-400 font-mono select-all">1930</p>
            <p className="text-[10px] text-slate-500 font-mono">24x7 Toll Free</p>
          </div>
        </div>

        <a
          href="https://sancharsaathi.gov.in"
          target="_blank"
          rel="noreferrer"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-cyan-500/30 transition-all group"
        >
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-sm">Sanchar Saathi</h4>
            <p className="text-[10px] text-slate-400 font-mono truncate">sancharsaathi.gov.in</p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all flex-shrink-0" />
        </a>
      </div>

      {/* Status Tracking */}
      {showStatus && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-white font-bold text-base flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-cyan-400" />
            <span>Complaint Status Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Track your existing complaints filed through CyberSathi or the National Cyber Crime Portal.</p>
          <div className="space-y-3">
            {MOCK_COMPLAINTS.map((c) => (
              <div key={c.id} className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    c.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400" :
                    c.status === "Under Investigation" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {c.status === "Resolved" ? <CheckCircle className="w-4 h-4" /> :
                     c.status === "Under Investigation" ? <Clock className="w-4 h-4" /> :
                     <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{c.id}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{c.type}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{c.date} • {c.amount}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg text-center ${
                  c.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  c.status === "Under Investigation" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-3">* Showing sample data. Real tracking requires filing a complaint first.</p>
        </div>
      )}

      {/* Step 1: Report Form */}
      {step === "form" && !showStatus && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">1</span>
              <span className="text-sm font-bold text-white">Report Details</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold font-mono">2</span>
              <span className="text-sm">AI Report</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold font-mono">3</span>
              <span className="text-sm">Evidence Guide</span>
            </div>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Contact Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. amit.v@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Fraud Type *</label>
                <select
                  required
                  value={fraudType}
                  onChange={(e) => setFraudType(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono appearance-none"
                >
                  <option value="" disabled className="bg-slate-900">Select fraud type</option>
                  {FRAUD_TYPES.map((ft) => (
                    <option key={ft} value={ft} className="bg-slate-900">{ft}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Amount Involved (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Date / Time of Incident *</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Incident Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe what happened in detail. Include any suspicious links, phone numbers, bank account details, or transaction IDs involved."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full glass-input rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full glass-btn-primary py-3.5 rounded-lg text-sm font-mono uppercase tracking-wide cursor-pointer"
            >
              {isGenerating ? "Generating AI Fraud Report..." : "Generate AI Fraud Report"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: AI Report */}
      {step === "report" && !showStatus && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold font-mono">1</span>
              <span className="text-sm text-emerald-400">Done</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">2</span>
              <span className="text-sm font-bold text-white">AI Report</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold font-mono">3</span>
              <span className="text-sm">Evidence Guide</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>AI-Generated Fraud Report</span>
              </h3>
              <p className="text-xs text-slate-400">This report is formatted for submission to the National Cyber Crime Portal (cybercrime.gov.in).</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(generatedReport)}
                className="bg-white/2 border border-white/5 hover:bg-white/5 text-slate-300 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isCopied ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 font-mono">Copied!</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5 text-cyan-400" /><span className="font-mono">Copy</span></>
                )}
              </button>
              <button
                onClick={downloadReport}
                className="glass-btn-primary px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="font-mono">Download</span>
              </button>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl border border-white/5 p-5 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto shadow-inner select-all backdrop-blur-md">
            {generatedReport}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setStep("form"); setGeneratedReport(""); }}
              className="bg-black/40 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white px-4 py-2.5 rounded-lg text-xs font-mono transition-all"
            >
              Edit Report Details
            </button>
            <button
              onClick={handleEvidenceGuide}
              disabled={isSubmittingEvidence}
              className="glass-btn-primary px-4 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2"
            >
              {isSubmittingEvidence ? "Loading..." : <><HelpCircle className="w-4 h-4" /> Proceed to Evidence Guide</>}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Evidence Guide */}
      {step === "evidence" && !showStatus && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold font-mono">1</span>
              <span className="text-sm text-emerald-400">Done</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold font-mono">2</span>
              <span className="text-sm text-emerald-400">Done</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold font-mono">3</span>
              <span className="text-sm font-bold text-white">Evidence Guide</span>
            </div>
          </div>

          <h3 className="text-white font-bold text-base flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-amber-400" />
            <span>Evidence Collection Guide</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">AI-suggested evidence checklist based on your fraud type. Collect and organize these documents for your cyber crime complaint.</p>

          {evidenceGuide && (
            <div className="bg-black/40 rounded-xl border border-white/5 p-5 font-mono text-xs text-slate-300 leading-relaxed mb-5 backdrop-blur-md">
              {evidenceGuide.split("\n").map((line, i) => (
                line.trim() ? <p key={i} className="mb-1.5">{line}</p> : <br key={i} />
              ))}
            </div>
          )}

          {/* Evidence Upload Area */}
          <div className="bg-white/2 border border-white/5 rounded-xl p-6 text-center backdrop-blur-sm mb-5">
            {evidenceFiles.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">{evidenceFiles.length} file(s) attached</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {evidenceFiles.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setEvidenceFiles([])}
                  className="text-[10px] text-red-400 hover:underline font-mono block mx-auto"
                >
                  Clear all files
                </button>
                <label className="cursor-pointer inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono border border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/5 px-4 py-2 rounded-lg transition-all">
                  <Upload className="w-4 h-4" />
                  Add More Files
                  <input type="file" multiple onChange={handleEvidenceUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2.5 block">
                <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Upload Screenshots / Documents</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">PNG, JPG, PDF files accepted</span>
                </div>
                <input type="file" multiple accept="image/*,application/pdf" onChange={handleEvidenceUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Government Integration */}
          <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">Government Integration</h4>
            </div>
            <p className="text-[11px] text-cyan-200/80 mb-3">
              Your report can be directly submitted to the National Cyber Crime Reporting Portal. Use the links below to file your official complaint.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                File on cybercrime.gov.in
              </a>
              <a
                href="https://sancharsaathi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Report on Sanchar Saathi
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setStep("report"); setEvidenceGuide(""); }}
              className="bg-black/40 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white px-4 py-2.5 rounded-lg text-xs font-mono transition-all"
            >
              Back to Report
            </button>
            <button
              onClick={() => { setStep("form"); setGeneratedReport(""); setEvidenceGuide(""); setEvidenceFiles([]); }}
              className="glass-btn-primary px-4 py-2.5 rounded-lg text-xs font-mono transition-all"
            >
              File New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
