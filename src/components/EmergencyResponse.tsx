import React, { useState } from "react";
import { AlertCircle, ShieldAlert, PhoneCall, Copy, CheckCircle, Download, FileText, Landmark, UserMinus, HelpCircle } from "lucide-react";

export default function EmergencyResponse() {
  const [activeStep, setActiveStep] = useState<"trigger" | "wizard" | "result">("trigger");
  
  // Complaint state
  const [fullName, setFullName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [lossAmount, setLossAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");
  
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Helpline Hotlines
  const helplines = [
    { title: "National Cyber Helpline", number: "1930", desc: "Available 24/7. Call immediately within the golden hour to block funds transfers." },
    { title: "Women Cyber Helpline", number: "181", desc: "MHA cell for tracking digital harassment and identity spoofing." },
    { title: "Sanchar Saathi Portal", url: "https://sancharsaathi.gov.in", desc: "MHA portal to track, report, and block stolen SIM cards/IMEI numbers." }
  ];

  // Quick Bank Net-banking block numbers
  const banks = [
    { name: "State Bank of India (SBI)", hotline: "1800 123 4 / 1930", link: "https://www.onlinesbi.sbi" },
    { name: "HDFC Bank Ltd", hotline: "1800 202 6161", link: "https://www.hdfcbank.com" },
    { name: "ICICI Bank Ltd", hotline: "1800 1080", link: "https://www.icicibank.com" },
    { name: "Punjab National Bank (PNB)", hotline: "1800 1800", link: "https://www.pnbindia.in" },
    { name: "Axis Bank", hotline: "1860 419 5555", link: "https://www.axisbank.com" }
  ];

  // Call API to generate formal complaint
  const generateComplaintDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/emergency/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          contactNo,
          scamType: "Financial Cyber / UPI Fraud",
          incidentDetails,
          lossAmount,
          bankName,
          transactionId
        })
      });
      const data = await res.json();
      if (data.letterText) {
        setGeneratedLetter(data.letterText);
        setActiveStep("result");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to build letter. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `CyberSathi_Complaint_${fullName.replace(/\s+/g, "_") || "Victim"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8" id="emergency-workflow-container">
      
      {/* Banner / Headline */}
      <div className="glass-card border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Emergency Response System</h2>
              <p className="text-xs text-red-300/80 leading-relaxed max-w-xl">
                If you have been scammed or witnessed unauthorized debits, act immediately! Under the "Golden Hour" guideline, money transferred through UPI/IMPS can often be frozen before fraudsters withdraw it.
              </p>
            </div>
          </div>
          {activeStep === "trigger" && (
            <button
              onClick={() => setActiveStep("wizard")}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-bounce font-mono uppercase tracking-wide"
              id="activate-emergency-btn"
            >
              ⚠️ I am a Victim
            </button>
          )}
        </div>
      </div>

      {activeStep === "trigger" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quick Helpline Numbers list */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-400" />
              <span>National Fraud Hotlines</span>
            </h3>
            <div className="space-y-4">
              {helplines.map((item, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-4 rounded-lg flex items-start gap-3.5">
                  <span className="text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                      {item.number && (
                        <span className="text-xs font-bold text-red-400 font-mono select-all bg-red-500/10 px-1.5 py-0.2 rounded">
                          {item.number}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{item.desc}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline mt-1.5 inline-block font-mono">
                        Visit Official Portal &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bank Freezers */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-cyan-400" />
              <span>Bank Hotlines (Card & UPI Freeze)</span>
            </h3>
            <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
              {banks.map((bank, idx) => (
                <div key={idx} className="bg-white/2 hover:bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center transition">
                  <div>
                    <h4 className="text-slate-200 text-xs font-semibold">{bank.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Hotline: {bank.hotline}</span>
                  </div>
                  <a href={bank.link} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 bg-cyan-500/5 px-2.5 py-1 rounded">
                    Lock Account
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: Wizard Complaint Letter Builder */}
      {activeStep === "wizard" && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-white font-bold text-lg">Official Complaint Letter Builder</h3>
              <p className="text-xs text-slate-400">Generate a legally formatted request to instantly freeze transaction flows at your bank.</p>
            </div>
            <button
              onClick={() => setActiveStep("trigger")}
              className="text-xs text-slate-400 hover:text-white border border-white/5 hover:border-white/10 px-3 py-1.5 rounded bg-black/40 backdrop-blur-md"
            >
              Back to Hotlines
            </button>
          </div>

          <form onSubmit={generateComplaintDoc} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Kumar Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Your Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Your Bank Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI, HDFC, Paytm Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Total Loss Amount (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={lossAmount}
                  onChange={(e) => setLossAmount(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Transaction ID / UTR Code</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-9182745582"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full glass-input rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Incident description</label>
              <textarea
                required
                rows={3}
                placeholder="Briefly describe how you were tricked (e.g. 'Received fake SMS to block electricity, clicked link and scanned UPI QR code leading to debit...')"
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                className="w-full glass-input rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full glass-btn-primary py-3.5 rounded-lg text-sm font-mono uppercase tracking-wide cursor-pointer"
            >
              {isSubmitting ? "Generating Letter..." : "Generate Official Freeze Letter"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: Results Letter Preview */}
      {activeStep === "result" && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-white/5">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Generated Complaint Document</span>
              </h3>
              <p className="text-xs text-slate-400">Copy this content to submit via Netbanking / email, or print it out to hand over directly at your bank branch.</p>
            </div>
            
            <div className="flex gap-2 self-start sm:self-center">
              <button
                onClick={copyToClipboard}
                className="bg-white/2 border border-white/5 hover:bg-white/5 text-slate-300 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-mono">Copy Text</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadTextFile}
                className="glass-btn-primary px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="font-mono">Download .TXT</span>
              </button>
              <button
                onClick={() => setActiveStep("wizard")}
                className="bg-black/40 border border-white/5 hover:border-white/10 text-slate-450 hover:text-white px-3 py-1.5 rounded text-xs transition-all font-mono"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl border border-white/5 p-5 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto shadow-inner select-all backdrop-blur-md">
            {generatedLetter}
          </div>

          {/* Action guidance after downloading */}
          <div className="mt-5 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex gap-3.5 items-start">
            <Landmark className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-cyan-300 text-xs font-bold mb-1">What to do next?</h4>
              <ol className="list-decimal list-inside text-[11px] text-cyan-200/80 space-y-1.5 leading-relaxed">
                <li>Email this letter immediately to your bank's official support and nodal officer email.</li>
                <li>Call <span className="font-bold text-red-400">1930</span> to ensure your incident is registered in the Ministry of Home Affairs' portal.</li>
                <li>Visit your nearest home bank branch tomorrow morning and submit a signed physical printout of this complaint letter directly to the branch manager.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
