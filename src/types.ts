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
  type: "UPI Scam" | "Phishing" | "Malware" | "Ransomware" | "Fake App" | "Social Engineering" | "Investment Scam";
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

export interface ScamAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  date: string;
  platform: string;
  affectedUsers: string;
  source: string;
}

export interface AwarenessArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "article" | "video" | "guide" | "news";
  imageUrl: string;
  readTime: string;
  author: string;
  date: string;
}

export interface SecurityChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "password" | "device" | "social" | "banking" | "network" | "general";
  completed: boolean;
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
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  cyberScore: number;
  isActive: boolean;
  lastScan: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "fraud_alert" | "login_alert" | "device_alert" | "scam_alert" | "password_leak" | "tip";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "analyst";
  status: "active" | "suspended";
  lastActive: string;
  reportsHandled: number;
}

export interface FraudReport {
  id: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  amount: number;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  date: string;
  evidenceUrls: string[];
  assignedTo?: string;
  resolution?: string;
}

export interface ScamSimulation {
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  correctAction: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tips: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "unread" | "read" | "replied";
}

export type UserRole = "citizen" | "officer" | "super_admin";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  twoFactorEnabled: boolean;
  organizationName?: string;
  designation?: string;
  badgeNumber?: string;
  jurisdiction?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalScans: number;
  totalReports: number;
  fraudsPrevented: number;
  amountSaved: number;
  activeSessions: number;
  threatLevel: "low" | "medium" | "high" | "critical";
  dailyActiveUsers: number;
  monthlyGrowth: number;
}

export interface BusinessEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  riskLevel: "low" | "medium" | "high";
  lastPhishTest: string;
  trainingCompleted: boolean;
}

export interface OfficerCase {
  id: string;
  caseNumber: string;
  complainantName: string;
  complainantPhone: string;
  type: string;
  description: string;
  amount: number;
  status: "assigned" | "investigating" | "under_review" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "critical";
  assignedAt: string;
  evidenceCount: number;
  lastUpdated: string;
  resolution?: string;
}
