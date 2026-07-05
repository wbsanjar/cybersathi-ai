import { QuizQuestion, ThreatFeedItem, NewsItem } from "./types";

// Static Translations for English and Hindi (Bonus Feature)
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "AI-Powered Cyber Fraud Prevention & Response Platform",
    heroSub: "Detect. Prevent. Respond. Protect yourself and your family from UPI scams, phishing, fake calls, malicious links, QR frauds, and financial cyber attacks using state-of-the-art Artificial Intelligence.",
    getStarted: "Get Started",
    reportFraud: "Report Fraud",
    tryAssistant: "Try AI Assistant",
    navHome: "Home",
    navFeatures: "Features",
    navScanner: "AI Scanner",
    navDashboard: "Dashboard",
    navReport: "Report Fraud",
    navResources: "Resources",
    navAbout: "About Us",
    navQuiz: "Cyber Quiz",
    emergencyBtn: "Emergency Response (I am a Victim)",
    liveFeed: "Live Threat Intelligence Feed",
    interactiveMap: "Interactive National Fraud Density Map",
    cyberScore: "Your Personal Cyber Security Score",
  },
  hi: {
    heroTitle: "एआई-संचालित साइबर धोखाधड़ी रोकथाम और प्रतिक्रिया मंच",
    heroSub: "पता लगाएं। रोकें। प्रतिक्रिया दें। कृत्रिम बुद्धिमत्ता (AI) का उपयोग करके यूपीआई (UPI) घोटाले, फ़िशिंग, फर्जी कॉल, दुर्भावनापूर्ण लिंक, क्यूआर घोटाले और वित्तीय साइबर हमलों से खुद को और अपने परिवार को सुरक्षित रखें।",
    getStarted: "शुरू करें",
    reportFraud: "धोखाधड़ी की रिपोर्ट करें",
    tryAssistant: "एआई सहायक से बात करें",
    navHome: "मुख्य पृष्ठ",
    navFeatures: "विशेषताएं",
    navScanner: "एआई स्कैनर",
    navDashboard: "डैशबोर्ड",
    navReport: "रिपोर्ट करें",
    navResources: "संसाधन",
    navAbout: "हमारे बारे में",
    navQuiz: "साइबर क्विज़",
    emergencyBtn: "आपातकालीन प्रतिक्रिया (मैं पीड़ित हूँ)",
    liveFeed: "लाइव साइबर खतरा चेतावनी फ़ीड",
    interactiveMap: "इंटरैक्टिव राष्ट्रीय साइबर धोखाधड़ी मानचित्र",
    cyberScore: "आपका साइबर सुरक्षा स्कोर",
  }
};

// State-wise cyber fraud statistics for India
export const INDIA_STATE_STATS = [
  { id: "IN-JH", name: "Jharkhand (Jamtara)", threatIndex: 98, activeScams: "OTP scams, Bank KYC phishing", hotspots: ["Jamtara", "Deoghar"], color: "#EF4444" },
  { id: "IN-HR", name: "Haryana (Nuh/Mewat)", threatIndex: 94, activeScams: "Olx fake army payments, Sextortion", hotspots: ["Nuh", "Mewat", "Gurugram"], color: "#F59E0B" },
  { id: "IN-RJ", name: "Rajasthan (Bharatpur)", threatIndex: 89, activeScams: "Fake government schemes, QR Pay", hotspots: ["Bharatpur", "Alwar"], color: "#F59E0B" },
  { id: "IN-DL", name: "Delhi NCR", threatIndex: 85, activeScams: "Customs gift scams, Fake job portals", hotspots: ["Noida", "Dwarka", "South Delhi"], color: "#F59E0B" },
  { id: "IN-MH", name: "Maharashtra", threatIndex: 78, activeScams: "Electricity bill blocks, Part-time job scams", hotspots: ["Mumbai Suburbs", "Pune"], color: "#3B82F6" },
  { id: "IN-KA", name: "Karnataka", threatIndex: 72, activeScams: "Aadhar card leaks, Fake crypto investments", hotspots: ["Bengaluru East", "Mangaluru"], color: "#3B82F6" },
  { id: "IN-UP", name: "Uttar Pradesh", threatIndex: 81, activeScams: "Pension update fraud, SIM swap", hotspots: ["Ghaziabad", "Kanpur", "Lucknow"], color: "#F59E0B" },
  { id: "IN-WB", name: "West Bengal", threatIndex: 76, activeScams: "Lottery scams, Fake customer service numbers", hotspots: ["Kolkata", "Siliguri"], color: "#3B82F6" }
];

// Interactive awareness quiz questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "You receive an SMS: 'Your Electricity Power will be disconnected tonight. Call Helpline: 98765-XXXXX immediately.' What is the safest course of action?",
    options: [
      "Call the mobile number in the SMS to check why it's getting blocked.",
      "Ignore it entirely, or verify by visiting your electricity provider's official portal/app directly.",
      "Click the link to download the 'AnyDesk' utility suggested by the support officer.",
      "Pay the small pending fee instantly via UPI to prevent cutoff."
    ],
    correctIndex: 1,
    explanation: "This is a classic utility bill scam. Legitimate companies never send disconnections from standard personal mobile numbers nor demand immediate app downloads like AnyDesk."
  },
  {
    id: 2,
    question: "Do you need to enter your UPI PIN to receive money into your bank account?",
    options: [
      "Yes, the UPI PIN authorizes all transactions, both sending and receiving.",
      "Only if the sender is from a different bank or UPI application.",
      "No! UPI PIN is strictly used to AUTHORIZE DEBITS. You never need a PIN to receive funds.",
      "Yes, but only for transactions above INR 10,000."
    ],
    correctIndex: 2,
    explanation: "Scammers send 'Receive Money Request' links to victims. Scanning this and typing your UPI PIN will immediately deduct money from your account!"
  },
  {
    id: 3,
    question: "You receive a phone call from someone claiming to be a Customs Officer in Mumbai, saying a parcel with drugs/contraband has been found under your name and you face 'digital arrest'. They tell you to stay on a Skype call. What is this?",
    options: [
      "A real police investigation. I must follow instructions immediately to avoid arrest.",
      "A classic 'Digital Arrest' scam. Police never arrest anyone via Skype/Zoom nor request secret transfers.",
      "A minor administrative mix-up. I should transfer money to verify my funds.",
      "A package delivery update from FedEx."
    ],
    correctIndex: 1,
    explanation: "Law enforcement authorities do not conduct investigations on Zoom/Skype, keep citizens in 'digital arrest', or demand immediate financial transfer to verify funds."
  },
  {
    id: 4,
    question: "Which of the following websites is the OFFICIAL portal to report cyber fraud in India?",
    options: [
      "www.cybercrime.gov.in",
      "www.cyber-police-india.net",
      "www.sanchar-saathi-complaints.org",
      "www.indian-cyber-cell.in"
    ],
    correctIndex: 0,
    explanation: "cybercrime.gov.in is the only official government portal run by the Ministry of Home Affairs to file cyber complaints."
  },
  {
    id: 5,
    question: "A website URL displays 'https://www.onlinesbi-secure-update.com/login'. Is this safe?",
    options: [
      "Yes, because it starts with 'https://' which means it is encrypted and safe.",
      "No, because 'onlinesbi-secure-update.com' is a lookalike domain. The official domain is onlinesbi.sbi or sbi.co.in.",
      "Yes, because it contains the keyword 'onlinesbi'.",
      "Yes, it is secure because it has an SSL certificate."
    ],
    correctIndex: 1,
    explanation: "Scammers register lookalike domains containing brand names. Always inspect the domain core (the words right before '.com' or '.in') rather than just trusting the 'https' padlock."
  }
];

// Live Threat Feed
export const LIVE_THREATS: ThreatFeedItem[] = [
  {
    id: "1",
    title: "Fake BSES Electricity Disconnection SMS",
    type: "Phishing",
    density: "High",
    target: "Metropolitan electricity consumers",
    timestamp: "Just Now",
    description: "SMS warnings claiming immediate disconnection. Scammers demand installation of remote screen-control apps to 'update bills'."
  },
  {
    id: "2",
    title: "Fake Paytm APK 'Payment Spoofer' App",
    type: "Fake App",
    density: "High",
    target: "Local retail shopkeepers & merchants",
    timestamp: "5 mins ago",
    description: "Fraudulent application showing simulated payment screenshots and simulated audio alerts of received payments to cheat shopkeepers."
  },
  {
    id: "3",
    title: "SBI YONO Lookalike 'KYC Update' Phishing Link",
    type: "Phishing",
    density: "High",
    target: "SBI Account Holders",
    timestamp: "12 mins ago",
    description: "SMS campaign warning account suspension unless users click a spoofed SBI link to enter credentials and OTP."
  },
  {
    id: "4",
    title: "'Digital Arrest' Skype Video Lures",
    type: "UPI Scam",
    density: "High",
    target: "Professionals & Senior Citizens",
    timestamp: "28 mins ago",
    description: "Scammers pretending to be CBI or Mumbai Customs Officers accusing victims of receiving illegal contraband parcels."
  },
  {
    id: "5",
    title: "FedEx Parcel Duty Pending Scam",
    type: "Phishing",
    density: "Medium",
    target: "Online Shoppers",
    timestamp: "1 hour ago",
    description: "Phishing messages claiming packages are held in warehouse, requesting a small Rs. 50 clearance payment to steal card numbers."
  }
];

// Cybersecurity news articles
export const CYBER_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "MHA Issues Warning Against Skype Calls Mimicking CBI and Police Officers",
    summary: "The Ministry of Home Affairs (MHA) has flagged a spike in 'Digital Arrest' cases where fraudsters hold targets under house arrest on video calls.",
    source: "PIB India",
    date: "July 04, 2026",
    category: "Alert",
    readTime: "3 min read"
  },
  {
    id: "news-2",
    title: "How to Safe-Keep your UPI Accounts: Top 5 Guidelines",
    summary: "Never share UPI pins to receive funds. Check merchant logos carefully, and do not download third-party support utilities.",
    source: "CyberSathi Guide",
    date: "June 30, 2026",
    category: "Guide",
    readTime: "5 min read"
  },
  {
    id: "news-3",
    title: "RBI Directs Banks to Tighten OTP Verification for Peer-to-Peer Transactions",
    summary: "New authentication guidelines are being proposed to check the rising frequency of SIM swapping and unauthorized fund transfers.",
    source: "Financial Express",
    date: "June 25, 2026",
    category: "News",
    readTime: "4 min read"
  }
];

// Immediate quick examples to paste for user testing!
export const MOCK_SAMPLES = {
  sms: [
    {
      title: "Bank KYC Scam SMS",
      text: "Dear SBI Customer, your YONO account is suspended tonight due to pending KYC verification. Please update details now by clicking: http://yono-sbi-verification.in/secure"
    },
    {
      title: "Electricity Disconnection SMS",
      text: "ALERT! Dear electricity consumer, your power will be disconnected at 9:30 PM due to last month unpaid bill. Please contact immediate electricity division manager at 89765-42311."
    },
    {
      title: "FedEx Parcel Scam SMS",
      text: "FedEx Tracker: Your parcel containing confidential files has been held at Mumbai Custom division. Please pay clearance charges of Rs. 49 to release package: https://fedex-custom-duty-pay.org"
    }
  ],
  url: [
    {
      title: "SBI Spoofed Login",
      url: "https://www.onlinesbi-secure-update.com/login"
    },
    {
      title: "Fake Paytm Link",
      url: "https://paytm-reward-scratchcard.net/pay"
    },
    {
      title: "Official Bank Site",
      url: "https://www.onlinesbi.sbi"
    }
  ],
  email: [
    {
      title: "Spoofed HMRC/Tax Refund",
      subject: "IMMEDIATE ACTION: Outstanding Tax Refund of INR 24,500.00 Authorized",
      sender: "claims-refund@income-tax-gov-india.org",
      body: "Dear Taxpayer, our central auditing division has calculated an excess deduction on your account. You are authorized to receive INR 24,500.00 directly to your card. Please download the attached refund application, fill your credit card credentials, and click submit. Failure to claim within 48 hours results in forfeiture of refund."
    }
  ],
  voice: [
    {
      title: "Simulated Custom officer call",
      text: "I am Calling from Mumbai Custom Narcotics Department. We found a FedEx package with your Aadhaar ID containing MDMA drugs sent to Taiwan. If you do not want us to issue a non-bailable warrant, log in to this Skype call and stay in digital arrest."
    },
    {
      title: "Simulated KBC Lottery call",
      text: "Congratulations! You have won Rs 25 Lakh in Kaun Banega Crorepati lottery lucky draw. To claim your cash prize, you have to deposit Rs 12,500 in processing tax to bank manager bank details immediately."
    }
  ]
};
