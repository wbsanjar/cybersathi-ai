import React, { useState, useMemo } from "react";
import { SCAM_SIMULATIONS } from "../data";
import { ScamSimulation } from "../types";
import {
  Shield, Brain, AlertTriangle, CheckCircle, XCircle, BookOpen,
  ChevronRight, RotateCcw, Award, ArrowRight, Filter, Star
} from "lucide-react";

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  medium: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  hard: "bg-red-500/10 border-red-500/20 text-red-400",
};

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const filters: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export default function ScamSimulator() {
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const filtered = useMemo(
    () => filter === "all" ? SCAM_SIMULATIONS : SCAM_SIMULATIONS.filter((s) => s.difficulty === filter),
    [filter]
  );

  const current = filtered[currentIdx];
  const total = filtered.length;
  const completedCount = completed.size;

  const handleSelect = (idx: number) => {
    if (!answered) setSelected(idx);
  };

  const handleVerify = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === current.correctIndex) setScore((s) => s + 1);
    setCompleted((prev) => new Set(prev).add(current.id));
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setCompleted(new Set());
    setDone(false);
  };

  if (done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const rank =
      pct === 100 ? "Scam Proof Expert"
        : pct >= 75 ? "Security Aware"
        : pct >= 50 ? "Learning Defender"
        : "Needs Practice";

    return (
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-2xl mx-auto relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <Award className="w-16 h-16 text-cyan-400 mx-auto animate-bounce mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Simulation Complete!</h3>
        <p className="text-slate-400 text-sm mb-6">
          You completed {total} scenario{total > 1 ? "s" : ""} and scored {score}/{total} ({pct}%)
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-cyan-500/10 border-cyan-500/20 text-cyan-300 font-bold text-sm mb-6">
          <Star className="w-4 h-4" />
          <span>{rank}</span>
        </div>
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex justify-between text-xs text-slate-500 font-mono mb-1.5">
            <span>Mastery</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-slate-300 text-xs font-mono font-bold uppercase tracking-wide transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto text-center">
        <p className="text-slate-400 text-sm">No scenarios match the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="scam-simulator-section">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-cyan-400" />
        <h2 className="text-white font-bold text-lg">AI Scam Simulator</h2>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
        Test your ability to identify real-world scams in a safe environment. Each scenario presents a common fraud situation — choose the safest response.
      </p>

      {/* Difficulty Filter + Score Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 bg-white/2 p-1 rounded-xl border border-white/5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setCurrentIdx(0); setSelected(null); setAnswered(false); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filter === f.id
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Score: <span className="text-emerald-400 font-bold">{score}</span>
          </span>
          <span className="text-slate-500">
            Progress: <span className="text-cyan-300 font-bold">{currentIdx + 1}/{total}</span>
          </span>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden" key={current.id}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${difficultyColors[current.difficulty]}`}>
            {difficultyLabels[current.difficulty].toUpperCase()}
          </span>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-purple-500/10 border-purple-500/20 text-purple-400">
            {current.category.toUpperCase()}
          </span>
        </div>

        <h3 className="text-white font-bold text-base mb-1">{current.title}</h3>
        <p className="text-xs text-slate-400 mb-1">{current.description}</p>
        <div className="bg-white/2 border border-white/5 rounded-xl p-4 mt-3 mb-4">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "{current.scenario}"
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {current.options.map((opt, idx) => {
            let btnStyle = "border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-slate-300";
            if (selected === idx) {
              btnStyle = "border-cyan-400 bg-cyan-500/10 text-cyan-300 font-medium";
            }
            if (answered) {
              if (idx === current.correctIndex) {
                btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
              } else if (selected === idx) {
                btnStyle = "border-red-500 bg-red-500/10 text-red-400";
              } else {
                btnStyle = "border-white/5 bg-white/1 text-slate-600 cursor-not-allowed";
              }
            }
            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => handleSelect(idx)}
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] font-mono text-slate-500">
            Scenario {currentIdx + 1} of {total}
          </span>
          {!answered ? (
            <button
              disabled={selected === null}
              onClick={handleVerify}
              className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide transition-all cursor-pointer disabled:opacity-40"
            >
              Verify Choice
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{currentIdx < total - 1 ? "Next Scenario" : "See Results"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Panel */}
      {answered && (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
              selected === current.correctIndex
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold">
              {selected === current.correctIndex ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Correct! You identified the scam correctly.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Incorrect. Let's learn from this.</span>
                </>
              )}
            </div>
            <p className="text-[12px] opacity-90 leading-relaxed mb-3">
              {current.explanation}
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-1.5 mb-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-bold text-cyan-300 font-mono uppercase tracking-wide">
                  Safer Response
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.correctAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tips */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-bold text-sm">Safety Tips</h3>
        </div>
        <ul className="space-y-2">
          {current.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
              Scam Awareness Progress
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {completedCount} of {SCAM_SIMULATIONS.length} scenarios completed
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((completedCount / SCAM_SIMULATIONS.length) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
