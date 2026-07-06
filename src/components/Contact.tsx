import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Shield, ExternalLink, ChevronRight, CheckCircle, Copy, AlertTriangle } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const emergencyContacts = [
    { number: "1930", label: "National Cyber Crime Helpline", desc: "24/7 - Report cyber fraud immediately within the golden hour to block fund transfers." },
    { number: "181", label: "Women Cyber Helpline", desc: "MHA cell for tracking digital harassment, identity spoofing, and online threats." },
    { number: "112", label: "Emergency Services", desc: "Unified emergency number for police, fire, and ambulance across India." }
  ];

  const contactInfo = [
    { icon: MapPin, title: "Head Office", details: ["CyberSathi AI Security Pvt. Ltd.", "B-7, Sector 44, Noida", "Uttar Pradesh - 201301, India"] },
    { icon: Mail, title: "Email Support", details: ["help@cybersathi.ai", "complaints@cybersathi.ai", "Response within 4-6 hours"] },
    { icon: Clock, title: "Working Hours", details: ["Monday - Saturday: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 4:00 PM", "Emergency helpline: 24/7"] }
  ];

  const socialLinks = [
    { name: "Twitter / X", handle: "@CyberSathiAI", url: "#", color: "text-cyan-400" },
    { name: "Instagram", handle: "@cybersathi_official", url: "#", color: "text-purple-400" },
    { name: "Facebook", handle: "CyberSathiAI", url: "#", color: "text-blue-400" },
    { name: "LinkedIn", handle: "CyberSathi AI", url: "#", color: "text-emerald-400" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to send message: ${err.message || "Please try again later."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8" id="contact-page">
      {/* Header Section */}
      <div className="glass-card border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Get in Touch with CyberSathi AI</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl mt-1">
                Have a security concern, feedback, or need assistance? Our team is here to help you stay safe online. 
                For immediate fraud reporting, use the Emergency Response system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Panel - Contact Info & Emergency */}
        <div className="lg:col-span-2 space-y-6">

          {/* Emergency Contacts */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Emergency Helplines</span>
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((item, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-3.5 rounded-lg flex items-start gap-3 hover:bg-white/[0.04] transition-all">
                  <span className="text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-semibold text-xs">{item.label}</h4>
                      <span className="text-sm font-bold text-red-400 font-mono select-all bg-red-500/10 px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-500/20 transition-all"
                        onClick={() => copyToClipboard(item.number, idx)}
                        title="Click to copy"
                      >
                        {copiedIndex === idx ? (
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Copied!</span>
                        ) : item.number}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Contact Information</span>
            </h3>
            <div className="space-y-4">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-semibold">{item.title}</h4>
                    {item.details.map((line, lIdx) => (
                      <p key={lIdx} className={`${lIdx === item.details.length - 1 ? "text-cyan-400/70" : "text-slate-400"} text-[10px] font-mono leading-relaxed`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat CTA */}
          <div className="glass-card border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Live Chat Support</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  Chat instantly with our AI assistant or connect with a human agent during working hours.
                </p>
                <button className="mt-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Start Live Chat
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              <span>Follow Us</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/2 border border-white/5 hover:bg-white/[0.04] hover:border-white/10 rounded-lg p-3 transition-all group"
                >
                  <p className={`text-xs font-bold ${social.color} group-hover:underline`}>{social.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{social.handle}</p>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel - Contact Form */}
        <div className="lg:col-span-3 space-y-6">

          {isSubmitted ? (
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold text-lg mt-4">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you for reaching out. Our team will review your message and respond within 4-6 business hours. 
                  For urgent fraud-related issues, please call 1930 immediately.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 glass-btn-primary py-2.5 px-6 rounded-lg text-xs font-mono"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Send us a Message</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amit Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input rounded-lg py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amit@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input rounded-lg py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Security Concern, Feedback, Report Issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full glass-input rounded-lg py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Message</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Describe your concern, question, or feedback in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full glass-input rounded-lg py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-btn-primary py-3 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Quick Response Guarantee */}
          <div className="glass-card rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/2 border border-white/5 rounded-xl p-3.5">
                <Mail className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <p className="text-xs text-white font-semibold">Email Response</p>
                <p className="text-[10px] text-slate-500 font-mono">Within 4-6 hours</p>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-xl p-3.5">
                <MessageCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-xs text-white font-semibold">Live Chat</p>
                <p className="text-[10px] text-slate-500 font-mono">Instant during hours</p>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-xl p-3.5">
                <Phone className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                <p className="text-xs text-white font-semibold">Emergency Hotline</p>
                <p className="text-[10px] text-slate-500 font-mono">1930 - 24/7 Available</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
