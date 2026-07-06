import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../data";
import { Shield, Award, HelpCircle, ArrowRight, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";

interface QuizSectionProps {
  onQuizCompleted: (score: number) => void;
  t: (key: string) => string;
}

export default function QuizSection({ onQuizCompleted, t }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleOptionSelect = (optIdx: number) => {
    if (hasAnswered) return;
    setSelectedOpt(optIdx);
  };

  const handleVerify = () => {
    if (selectedOpt === null) return;
    setHasAnswered(true);
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setHasAnswered(false);
    
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResult(true);
      // Fire callback to parent app to update personal score
      const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
      onQuizCompleted(percentage);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setHasAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  // Determine badge award
  const getBadgeDetails = () => {
    const finalScore = score;
    if (finalScore === QUIZ_QUESTIONS.length) {
      return {
        title: "Cyber Shield Overlord",
        color: "text-cyan-400 border-cyan-400/20 bg-cyan-500/5",
        desc: "Stellar performance! You have flawless instincts against phishing, fake customer cares, and OTP traps."
      };
    } else if (finalScore >= 3) {
      return {
        title: "Phishing Detective",
        color: "text-purple-400 border-purple-400/20 bg-purple-500/5",
        desc: "Great job! You recognize typical social engineering tricks, but stay alert for lookalike links."
      };
    } else {
      return {
        title: "Vulnerable Netizen",
        color: "text-amber-400 border-amber-400/20 bg-amber-500/5",
        desc: "Your defense score is vulnerable. Study the explanations carefully to safeguard your accounts."
      };
    }
  };

  const badge = getBadgeDetails();

  return (
    <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto relative overflow-hidden" id="cyber-quiz-box">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <HelpCircle className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white font-bold text-base">CyberSathi Awareness Challenge</h3>
        {!showResult && (
          <span className="text-xs font-mono text-slate-500 ml-auto">
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
        )}
      </div>

      {!showResult ? (
        <div className="space-y-6">
          {/* Question Text */}
          <h4 className="text-white font-semibold text-base sm:text-lg leading-relaxed">
            {currentQuestion.question}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => {
              let btnStyle = "border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-slate-300";
              
              if (selectedOpt === idx) {
                btnStyle = "border-cyan-400 bg-cyan-500/10 text-cyan-300 font-medium";
              }

              if (hasAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
                } else if (selectedOpt === idx) {
                  btnStyle = "border-red-500 bg-red-500/10 text-red-400";
                } else {
                  btnStyle = "border-white/5 bg-white/1 text-slate-600 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all duration-200 focus:outline-none flex gap-3 ${btnStyle}`}
                >
                  <span className="font-mono font-bold text-slate-500 select-none">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Verification Feedback Block */}
          {hasAnswered && (
            <div className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm transition-all duration-300 ${
              selectedOpt === currentQuestion.correctIndex 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" 
                : "bg-red-950/20 border-red-500/30 text-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-1.5 font-bold">
                {selectedOpt === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Scam Hook Triggered</span>
                  </>
                )}
              </div>
              <p className="text-[12px] opacity-90 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-xs font-mono text-slate-500">
              Current Score: {score} Correct
            </span>

            {!hasAnswered ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleVerify}
                className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide transition-all cursor-pointer"
              >
                Verify Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wide transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Results"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* SCORE / BADGES RESULTS PAGE */
        <div className="text-center py-6 space-y-6">
          <Award className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
          
          <div>
            <h4 className="text-2xl font-bold text-white mb-1">Challenge Completed!</h4>
            <p className="text-slate-400 text-sm">You answered {score} out of {QUIZ_QUESTIONS.length} questions correctly.</p>
          </div>

          {/* Badge Display Box */}
          <div className={`max-w-md mx-auto rounded-xl border p-5 ${badge.color}`}>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block mb-1">AWARDED CYBER BADGE</span>
            <h5 className="text-lg font-bold text-white mb-2">{badge.title}</h5>
            <p className="text-xs opacity-80 leading-relaxed">{badge.desc}</p>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={handleReset}
              className="bg-white/2 border border-white/5 hover:border-white/10 text-slate-300 font-bold py-3 px-6 rounded-lg text-xs font-mono uppercase tracking-wide flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
