export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ScanResult {
  status: "Safe" | "Suspicious" | "Fraud";
  riskScore: number;
  scamType?: string;
  indicators?: string[];
  recommendation?: string;
  threatDetails?: string;
  findings?: string[];
  decodedContent?: string;
  extractedText?: string;
  detectedAnomalies?: string[];
  forensicAnalysis?: string;
  transcriptAnalysis?: string;
  vulnerabilitiesExploited?: string[];
  actionSteps?: string[];
  highlights?: Array<{
    text: string;
    severity: "low" | "medium" | "high";
    reason: string;
  }>;
}

export interface ThreatFeedItem {
  id: string;
  title: string;
  type: "UPI Scam" | "Phishing" | "Malware" | "Ransomware" | "Fake App";
  density: "High" | "Medium" | "Low";
  target: string;
  timestamp: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: "Alert" | "Guide" | "News";
  readTime: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  cyberScore: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    badge: string;
  }>;
  scannedHistory: Array<{
    id: string;
    type: string;
    input: string;
    status: string;
    score: number;
    date: string;
  }>;
}
