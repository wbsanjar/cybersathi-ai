import React, { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "../types";
import { Send, Bot, User, Trash2, ArrowRightLeft, Sparkles, MessageSquare, Mic, HelpCircle, Volume2, VolumeX } from "lucide-react";

interface AIChatbotProps {
  embedded?: boolean;
}

export default function AIChatbot({ embedded = false }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I am **CyberSathi AI**, your personal cybersecurity guard. You can ask me any questions about suspicious messages, weird UPI transactions, phishing websites, or what immediate actions to take if you have been scammed. How can I protect you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Voice recognition setup
  const startVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => handleSend(transcript), 300);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // Text-to-speech for assistant responses
  const speakText = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, "").replace(/#/g, ""));
      utterance.lang = "en-IN";
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Suggested pre-set quick prompts
  const suggestions = [
    "Is this UPI QR link safe?",
    "What is Skype Digital Arrest scam?",
    "How to register a complaint on 1930?",
    "Someone sent a fake Paytm screenshot, what now?"
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || input;
    if (!rawText.trim()) return;

    if (!textToSend) setInput("");

    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: rawText,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.response || "I am currently offline. Please check your API key secrets config.",
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "❌ Sorry! I was unable to connect to the Gemini backend server. Ensure that the `GEMINI_API_KEY` is loaded and active in the AI Studio platform under **Settings > Secrets**.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Chat history cleared. How can I help you check for safety?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div 
      className={`glass-card rounded-2xl flex flex-col overflow-hidden relative ${
        embedded ? "h-[580px] w-full" : "h-[520px] w-[360px] shadow-[0_10px_35px_rgba(0,0,0,0.8)] border-cyan-500/20"
      }`}
      id="chatbot-container"
    >
      {/* Absolute background visual details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="bg-black/30 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white/10"></span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight flex items-center gap-1">
              <span>CyberSathi AI</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </h3>
            <span className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">AI SEC CORE ENROLLED</span>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-1.5 rounded hover:bg-white/5 border border-transparent hover:border-white/10 text-slate-400 hover:text-red-400 transition"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/10 backdrop-blur-sm">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {/* Robot avatar left */}
              {!isUser && (
                <div className="h-7 w-7 rounded-full bg-white/2 border border-white/5 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                isUser 
                  ? "bg-cyan-500/10 border border-cyan-400/45 text-cyan-200 font-semibold rounded-tr-none shadow-[0_0_12px_rgba(0,229,255,0.1)]" 
                  : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none font-sans shadow-[0_2px_10px_rgba(255,255,255,0.02)]"
              }`}>
                {/* Simulated Markdown renderer */}
                <div className="whitespace-pre-wrap select-text">
                  {m.content.split("**").map((part, pIdx) => {
                    if (pIdx % 2 === 1) {
                      return <strong key={pIdx} className="font-extrabold text-cyan-300">{part}</strong>;
                    }
                    return part;
                  })}
                </div>
                {!isUser && (
                  <button
                    onClick={() => speakText(m.content)}
                    className="mt-1.5 text-[9px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition"
                    title="Read aloud"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isSpeaking ? "Stop" : "Listen"}</span>
                  </button>
                )}
              </div>

              {/* User avatar right */}
              {isUser && (
                <div className="h-7 w-7 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="h-7 w-7 rounded-full bg-white/2 border border-white/5 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick chips */}
      {messages.length === 1 && !isTyping && (
        <div className="px-4 pb-2.5 pt-1.5 bg-black/20">
          <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Frequently Asked:</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] sm:text-[11px] bg-white/2 hover:bg-white/5 hover:border-white/10 border border-white/5 rounded px-2 py-1 text-slate-400 transition-all font-sans text-left"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 bg-black/20 border-t border-white/5 flex gap-2 items-center backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask CyberSathi AI about scams..."
          className="flex-1 glass-input rounded-xl py-2 px-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
        />
        
        {/* Voice input button */}
        <button 
          onClick={startVoiceInput}
          className={`p-2 rounded-xl border transition ${
            isListening 
              ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" 
              : "bg-white/2 border-white/5 hover:border-cyan-400/50 hover:text-cyan-400 text-slate-400"
          }`}
          title={isListening ? "Listening..." : "Voice Input"}
        >
          <Mic className={`w-4 h-4 ${isListening ? "animate-bounce" : ""}`} />
        </button>

        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl glass-btn-primary transition flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
