import { AuthUser, FraudReport, OfficerCase } from "./types";

export const MOCK_USERS: AuthUser[] = [
  {
    id: "cit-1", fullName: "Amit Kumar", email: "amit.kumar@gmail.com", phone: "+91 98765 43210",
    role: "citizen", joinedAt: "2026-01-15", twoFactorEnabled: false,
  },
  {
    id: "cit-2", fullName: "Priya Sharma", email: "priya.sharma@yahoo.com", phone: "+91 87654 32109",
    role: "citizen", joinedAt: "2026-03-20", twoFactorEnabled: true,
  },
  {
    id: "off-1", fullName: "Inspector Vikram Singh", email: "vikram.singh@cybercell.gov.in", phone: "+91 77665 54433",
    role: "officer", joinedAt: "2025-08-01", twoFactorEnabled: true,
    badgeNumber: "CBI/CYBER/2024/1187", jurisdiction: "Delhi NCR",
  },
  {
    id: "off-2", fullName: "Sub-Inspector Ananya Patel", email: "ananya.patel@cybercell.gov.in", phone: "+91 66554 43322",
    role: "officer", joinedAt: "2025-11-15", twoFactorEnabled: true,
    badgeNumber: "MHA/CYBER/2025/0452", jurisdiction: "Maharashtra",
  },
  {
    id: "admin-1", fullName: "Dr. Aditya Sharma", email: "aditya@cybersathi.ai", phone: "+91 99999 88877",
    role: "super_admin", joinedAt: "2024-06-01", twoFactorEnabled: true,
    designation: "Platform Director",
  },
  {
    id: "admin-2", fullName: "Sneha Reddy", email: "sneha@cybersathi.ai", phone: "+91 88877 66655",
    role: "super_admin", joinedAt: "2024-09-01", twoFactorEnabled: true,
    designation: "Security Operations Lead",
  },
];

export const OFFICER_CASES: OfficerCase[] = [
  { id: "case-1", caseNumber: "CYBER/2026/0842", complainantName: "Sunita Devi", complainantPhone: "+91 98765 12345", type: "Digital Arrest", description: "Caller posed as CBI officer, demanded ₹85,000 via UPI to avoid 'digital arrest'.", amount: 85000, status: "investigating", priority: "critical", assignedAt: "2026-07-04", evidenceCount: 3, lastUpdated: "2026-07-05" },
  { id: "case-2", caseNumber: "CYBER/2026/0841", complainantName: "Rohan Mehta", complainantPhone: "+91 87654 23456", type: "Phishing Link", description: "SBI KYC update SMS link stole login credentials. Unauthorized transfer of ₹12,000.", amount: 12000, status: "investigating", priority: "high", assignedAt: "2026-07-03", evidenceCount: 2, lastUpdated: "2026-07-05" },
  { id: "case-3", caseNumber: "CYBER/2026/0840", complainantName: "Deepa Roy", complainantPhone: "+91 76543 34567", type: "Investment Scam", description: "Telegram task scam. Paid ₹5,000 for 'premium tasks' after earning ₹500 initially.", amount: 5000, status: "under_review", priority: "medium", assignedAt: "2026-07-02", evidenceCount: 5, lastUpdated: "2026-07-04" },
  { id: "case-4", caseNumber: "CYBER/2026/0839", complainantName: "Mohan Lal", complainantPhone: "+91 65432 45678", type: "Fake App", description: "Installed 'Paytm Merchant APK' from WhatsApp. App stole contacts and SMS data.", amount: 0, status: "resolved", priority: "low", assignedAt: "2026-07-01", evidenceCount: 1, lastUpdated: "2026-07-03", resolution: "No financial loss. Advised factory reset. Malware sample submitted to CERT-In." },
  { id: "case-5", caseNumber: "CYBER/2026/0838", complainantName: "Kavita Singh", complainantPhone: "+91 54321 56789", type: "UPI QR Scam", description: "Customer at shop scanned her QR to 'pay' but instead ₹6,200 was debited from her account.", amount: 6200, status: "assigned", priority: "high", assignedAt: "2026-07-05", evidenceCount: 2, lastUpdated: "2026-07-05" },
  { id: "case-6", caseNumber: "CYBER/2026/0837", complainantName: "Vijay Kumar", complainantPhone: "+91 43210 67890", type: "SMS/OTP Fraud", description: "Received fake electricity disconnection SMS, called the number and shared OTP. Lost ₹22,000.", amount: 22000, status: "investigating", priority: "critical", assignedAt: "2026-07-02", evidenceCount: 4, lastUpdated: "2026-07-04" },
  { id: "case-7", caseNumber: "CYBER/2026/0836", complainantName: "Pooja Jain", complainantPhone: "+91 32109 78901", type: "Phishing Link", description: "Fake Netflix payment page entered card details. Fraudulent transaction of ₹4,999.", amount: 4999, status: "resolved", priority: "medium", assignedAt: "2026-06-30", evidenceCount: 2, lastUpdated: "2026-07-02", resolution: "Card blocked. Chargeback initiated. Amount recovered." },
  { id: "case-8", caseNumber: "CYBER/2026/0835", complainantName: "Ravi Sharma", complainantPhone: "+91 21098 89012", type: "UPI QR Scam", description: "Fake QR code at a tea stall led to unauthorized ₹4,500 deduction from GPay.", amount: 4500, status: "assigned", priority: "medium", assignedAt: "2026-07-05", evidenceCount: 1, lastUpdated: "2026-07-05" },
];

export const COMPLAINT_CATEGORIES = [
  "UPI QR Scam",
  "Phishing Link",
  "SMS/OTP Fraud",
  "Digital Arrest",
  "Investment Scam",
  "Fake App",
  "Impersonation",
  "SIM Swap",
  "Loan App Harassment",
  "Social Media Scam",
  "Fake Job Offer",
  "Other",
];

export const CASE_STATS = {
  totalCases: 1284,
  resolvedCases: 872,
  activeCases: 412,
  avgResolutionDays: 3.2,
  amountRecovered: 38500000,
};
