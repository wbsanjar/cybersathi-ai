import React, { useState } from "react";
import { INDIA_STATE_STATS } from "../data";
import { Shield, AlertTriangle, ShieldCheck, MapPin, Zap } from "lucide-react";

export default function InteractiveMap() {
  const [selectedState, setSelectedState] = useState(INDIA_STATE_STATS[0]);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="interactive-map-container">
      {/* Absolute decorative glowing radial gradient */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Left Side: Dynamic Cyber Hotspots Constellation Map */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h3 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase font-mono">Live Hotspot Constellation</h3>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">India Fraud Density & Active Scams</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Hover or click on the key cyber fraud epicenters below to inspect real-time regional scam trends, phishing techniques, and local density.
            </p>
          </div>

          {/* Stylized Node-Network Visual Map */}
          <div className="bg-black/30 border border-white/5 rounded-xl p-6 relative min-h-[320px] flex items-center justify-center backdrop-blur-md">
            {/* Background grid accents */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

            {/* Simulated Geographic Layout Nodes */}
            <div className="relative w-full h-full min-h-[280px]">
              {INDIA_STATE_STATS.map((state, idx) => {
                // Layout nodes geographically relative (schematic India)
                // JH (East), HR/DL (North-center), RJ (West-center), KA/MH (South/West)
                let x = "50%";
                let y = "50%";
                
                if (state.id === "IN-DL") { x = "45%"; y = "25%"; } // Delhi
                else if (state.id === "IN-HR") { x = "38%"; y = "18%"; } // Haryana
                else if (state.id === "IN-RJ") { x = "22%"; y = "35%"; } // Rajasthan
                else if (state.id === "IN-UP") { x = "58%"; y = "32%"; } // UP
                else if (state.id === "IN-JH") { x = "74%"; y = "48%"; } // Jharkhand (Jamtara)
                else if (state.id === "IN-WB") { x = "84%"; y = "58%"; } // West Bengal
                else if (state.id === "IN-MH") { x = "32%"; y = "65%"; } // Maharashtra
                else if (state.id === "IN-KA") { x = "40%"; y = "82%"; } // Karnataka

                const isSelected = selectedState.id === state.id;

                return (
                  <button
                    key={state.id}
                    className="absolute group focus:outline-none"
                    style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
                    onClick={() => setSelectedState(state)}
                    id={`hotspot-btn-${state.id}`}
                  >
                    {/* Ring Pulse */}
                    <span className="absolute -inset-4 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/5 transition duration-300"></span>
                    
                    {/* Radar Pulse beacon for active scam alerts */}
                    {state.threatIndex > 80 && (
                      <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-35 animate-ping -left-2 -top-2 ${
                        state.threatIndex > 90 ? "bg-red-500" : "bg-amber-500"
                      }`}></span>
                    )}

                    {/* Node Dot */}
                    <div className={`relative h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? "bg-cyan-400 border-white scale-125 shadow-[0_0_12px_#00E5FF]" 
                        : "bg-slate-900 group-hover:scale-110"
                    } ${
                      state.threatIndex > 90 
                        ? "border-red-500 text-red-500" 
                        : state.threatIndex > 80 
                        ? "border-amber-500 text-amber-500" 
                        : "border-blue-500 text-blue-500"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    </div>

                    {/* Tiny state indicator label */}
                    <span className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono tracking-tight px-1.5 py-0.5 rounded border transition-all duration-300 ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold z-10 animate-pulse"
                        : "bg-black/80 border-white/5 text-slate-400 group-hover:text-white"
                    }`}>
                      {state.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}

              {/* Decorative Schematic Network Links */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                {/* Visual link lines between major scam epicenters */}
                <line x1="45%" y1="25%" x2="38%" y2="18%" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3" />
                <line x1="38%" y1="18%" x2="22%" y2="35%" stroke="#00E5FF" strokeWidth="1" />
                <line x1="22%" y1="35%" x2="32%" y2="65%" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4" />
                <line x1="45%" y1="25%" x2="58%" y2="32%" stroke="#00E5FF" strokeWidth="1" />
                <line x1="58%" y1="32%" x2="74%" y2="48%" stroke="#EF4444" strokeWidth="1" strokeDasharray="2" />
                <line x1="74%" y1="48%" x2="84%" y2="58%" stroke="#00E5FF" strokeWidth="1" />
                <line x1="32%" y1="65%" x2="40%" y2="82%" stroke="#00E5FF" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Threat Intelligence Profile of Selected Hotspot */}
        <div className="w-full md:w-[340px] bg-white/2 border border-white/5 rounded-xl p-5 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">{selectedState.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">CODE: {selectedState.id}</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                selectedState.threatIndex > 90 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : selectedState.threatIndex > 80 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {selectedState.threatIndex > 90 ? "CRITICAL" : "HIGH RISK"}
              </span>
            </div>

            {/* Risk Index Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Threat Index Score</span>
                <span className="font-bold text-white">{selectedState.threatIndex}/100</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r"
                  style={{ 
                    width: `${selectedState.threatIndex}%`,
                    backgroundImage: selectedState.threatIndex > 90 
                      ? "linear-gradient(to right, #7C3AED, #EF4444)" 
                      : "linear-gradient(to right, #00E5FF, #F59E0B)"
                  }}
                ></div>
              </div>
            </div>

            {/* Core scams active in this state */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Primary Scam Categories</span>
                <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed font-mono font-bold text-cyan-300">
                    {selectedState.activeScams}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Key Hotspots & Call Centers</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedState.hotspots.map((city, cIdx) => (
                    <span key={cIdx} className="text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/5 text-slate-300 flex items-center gap-1 font-mono">
                      <Zap className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Advice */}
          <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h5 className="text-xs font-bold text-cyan-300">CyberSathi Shield Guard</h5>
            </div>
            <p className="text-[11px] text-cyan-200/80 leading-relaxed">
              {selectedState.id === "IN-JH" 
                ? "Scammers here call posing as bank managers. Never download any quick remote tools or click links sent via SMS." 
                : selectedState.id === "IN-HR" 
                ? "Exercise high caution on OLX. If a buyer sends a 'Receive' QR code and requests your PIN, cancel the deal." 
                : "Always verify official government/bank domains. Report any lookalike numbers directly to cybercrime.gov.in."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
