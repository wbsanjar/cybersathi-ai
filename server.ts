import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit increased to handle base64 images/screenshots safely
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Helper helper to format prompt responses
  const getAIClient = (): GoogleGenAI => {
    if (!ai) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel.");
    }
    return ai;
  };

  // --- API ROUTES ---

  // 1. Health & Config endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", aiConfigured: !!ai });
  });

  // 2. Chat with Cyber AI
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages, context } = req.body;
      const client = getAIClient();

      const systemInstruction = `You are CyberSathi AI (Cyber Friend AI), an elite cyber-security and fraud-prevention assistant. Your goal is to help users detect, avoid, and respond to cyber fraud, including UPI scams, phishing, fake calls, malicious links, QR scams, fake customer care numbers, and identity theft.
Provide practical, urgent, yet reassuring advice.
If the user indicates they are a victim of a cybercrime, highlight the "Emergency Response" action and provide step-by-step instructions (e.g., dial 1930, report on cybercrime.gov.in, freeze bank accounts immediately).
Format your answers in Markdown. Keep responses clear, professional, and scannable. Under no circumstances should you simulate code execution or output meaningless system logs.`;

      // Construct history for Gemini
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      // Add a guidance context if provided
      if (context) {
        formattedContents.unshift({
          role: "user",
          parts: [{ text: `Context of active scan: ${JSON.stringify(context)}. Give advice based on this.` }]
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text || "I apologize, but I could not analyze that request." });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat with Gemini." });
    }
  });

  // 3. Phishing URL Scanner
  app.post("/api/scan/url", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const client = getAIClient();
      const prompt = `Analyze the following URL for phishing, scam, fake login pages, or malicious redirection:
URL: "${url}"

Provide a detailed safety evaluation in JSON format containing:
1. "status": either "Safe", "Suspicious", or "Fraud"
2. "riskScore": an integer between 0 and 100 (where 100 is highly malicious)
3. "fakeLoginDetected": boolean
4. "reputationFactors": string array of risk/safety indicators (e.g., "Non-standard top-level domain", "Suspicious subdomain mimicking SBI Bank", "No SSL certificate", "Looks like an official UPI gateway clone")
5. "threatDetails": a paragraph of explanation summarizing what this URL claims to be, why it is or is not dangerous, and what users should do.
6. "recommendation": Actionable steps (e.g., "Do not enter login credentials", "Safe to browse")`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              fakeLoginDetected: { type: Type.BOOLEAN },
              reputationFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              threatDetails: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["status", "riskScore", "fakeLoginDetected", "reputationFactors", "threatDetails", "recommendation"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("URL Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze URL." });
    }
  });

  // 4. SMS Scam & OTP Detector
  app.post("/api/scan/sms", async (req: Request, res: Response) => {
    try {
      const { smsText } = req.body;
      if (!smsText) {
        return res.status(400).json({ error: "SMS content is required" });
      }

      const client = getAIClient();
      const prompt = `Analyze the following SMS content for scams, bank fraud, fake OTP request, KYC update scams, lottery/reward scams, electricity bill fraud, or FedEx parcel scams:
SMS Content: "${smsText}"

Analyze and identify any specific malicious sentences, fake contact numbers, or phishing links inside. Return a detailed safety evaluation in JSON format containing:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "scamType": string (e.g., "KYC Update Scam", "Lottery Fraud", "Bank Account Block Scam", "Electricity Bill Scam", "Fake OTP Request", "Safe Message")
4. "indicators": string array of clues (e.g., "Urgent threat of account block", "Asks to download AnyDesk or TeamViewer", "Sends unverified APK link")
5. "highlights": array of objects, where each object has:
   - "text": the exact phrase from the SMS that is suspicious
   - "severity": "low", "medium", or "high"
   - "reason": explanation of why this part is suspicious
6. "actionSteps": string array of urgent actions the user should take (e.g., "Do not click the link", "Do not share OTP", "Report SMS to 1909 or via Sanchar Saathi portal")`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              scamType: { type: Type.STRING },
              indicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              highlights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["text", "severity", "reason"]
                }
              },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["status", "riskScore", "scamType", "indicators", "highlights", "actionSteps"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("SMS Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze SMS." });
    }
  });

  // 5. Email Analyzer
  app.post("/api/scan/email", async (req: Request, res: Response) => {
    try {
      const { emailSubject, emailBody, senderAddress } = req.body;
      if (!emailBody) {
        return res.status(400).json({ error: "Email body is required" });
      }

      const client = getAIClient();
      const prompt = `Analyze the following email details for phishing, business email compromise (BEC), malware lures, spoofing indicators, or payment redirection scams:
Sender Address: "${senderAddress || "Unknown"}"
Subject: "${emailSubject || "No Subject"}"
Body:
"""
${emailBody}
"""

Provide a detailed safety evaluation in JSON format:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "detectedPhishingTechniques": string array of methods (e.g., "Urgency hook", "Spoofed sender domain", "Suspicious links", "Fake attachment lure")
4. "senderEvaluation": string explaining if the sender address looks spoofed or belongs to free email providers like Gmail/Yahoo when mimicking an enterprise
5. "verdictExplanation": detailed summary of why this email is safe, suspicious, or fraud
6. "actionSteps": string array of steps (e.g., "Mark as Phishing", "Do not download attachments", "Verify via secondary channel")`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              detectedPhishingTechniques: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              senderEvaluation: { type: Type.STRING },
              verdictExplanation: { type: Type.STRING },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["status", "riskScore", "detectedPhishingTechniques", "senderEvaluation", "verdictExplanation", "actionSteps"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Email Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze email." });
    }
  });

  // 6. Multimodal QR Code Analyzer
  app.post("/api/scan/qr", async (req: Request, res: Response) => {
    try {
      const { qrImageBase64, qrText } = req.body;
      const client = getAIClient();

      let prompt = "";
      let contents: any = {};

      if (qrImageBase64) {
        // Extract standard base64 format (remove data:image/...;base64, if present)
        const base64Data = qrImageBase64.includes(",") ? qrImageBase64.split(",")[1] : qrImageBase64;
        const mimeType = qrImageBase64.includes(",") ? qrImageBase64.split(",")[0].split(":")[1].split(";")[0] : "image/png";

        prompt = `You are a cyber security scanner analyzing a QR code. Look closely at the QR code image, extract its encoded data, and analyze it. 
If the QR code contains a UPI payment address (like upi://pay?pa=...), inspect if the payee address looks like a scam, is unverified, mimics official brands, or has fishy parameters.
If it contains a URL, check for malicious redirections or phishing domains.
If you cannot decode the exact QR pixels, analyze the contextual background or assume typical QR scams based on standard patterns.

Return a JSON safety evaluation with:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "decodedContent": the UPI link, URL, or plain text hidden in this QR (or your best estimation/mock if undecodable, e.g. "upi://pay?pa=scamster@okhdfc&pn=PaytmUser&am=5000")
4. "qrType": string (e.g., "UPI Pay Request", "URL Redirect", "App Download Lure", "WiFi login", "Plain text")
5. "findings": string array of specific flags (e.g., "Redirects to overseas server", "Hidden transaction amount parameter", "Spoofed SBI logo")
6. "threatDetails": a summary of the risk
7. "actionSteps": string array of recommended steps (e.g., "Do not scan with UPI apps", "Decline payment request in your bank app")`;

        const imagePart = {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        };
        const textPart = { text: prompt };
        contents = { parts: [imagePart, textPart] };
      } else {
        // Text-based QR content scan
        prompt = `Analyze the following decoded QR content: "${qrText}"
Verify if it is a safe UPI payment link, a malicious URL redirection, or a spoofed address.
Provide a detailed safety evaluation in JSON format containing:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "decodedContent": the original string analyzed
4. "qrType": "UPI Pay Request", "URL Redirect", "App Download Lure", or "Plain text"
5. "findings": string array of specific flags
6. "threatDetails": detailed description of risk
7. "actionSteps": string array of recommended steps`;
        contents = prompt;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              decodedContent: { type: Type.STRING },
              qrType: { type: Type.STRING },
              findings: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              threatDetails: { type: Type.STRING },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["status", "riskScore", "decodedContent", "qrType", "findings", "threatDetails", "actionSteps"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("QR Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze QR code." });
    }
  });

  // 7. Multimodal Screenshot Scanner (Fake Payments & Banking App Tampering)
  app.post("/api/scan/screenshot", async (req: Request, res: Response) => {
    try {
      const { screenshotBase64 } = req.body;
      if (!screenshotBase64) {
        return res.status(400).json({ error: "Screenshot image (base64) is required" });
      }

      const client = getAIClient();
      const base64Data = screenshotBase64.includes(",") ? screenshotBase64.split(",")[1] : screenshotBase64;
      const mimeType = screenshotBase64.includes(",") ? screenshotBase64.split(",")[0].split(":")[1].split(";")[0] : "image/png";

      const prompt = `You are an advanced digital forensics OCR and image verification tool. 
Analyze this screenshot. Common scenarios include:
- Fake Paytm/PhonePe payment confirmation screens (look for font mismatches, incorrect spacing, weird time indicators, incorrect UPI transaction IDs, missing bank logos).
- Fake banking app logins.
- Edited payment receipts or forged transactions.
- Fake customer care numbers displayed on unverified sites/Google search.

Evaluate the image and return a JSON safety report containing:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "extractedText": clear text or details read via OCR from the screen (e.g. UPI ID, Amount, Timestamp, Bank name)
4. "detectedAnomalies": string array of digital alteration signs or fraud indicators (e.g., "Font style mismatch on Paytm receipt", "Unusual spacing in Transaction ID", "UPI ID looks unverified", "Customer care number belongs to a generic mobile network rather than toll-free bank line")
5. "forensicAnalysis": a paragraph explaining your technical findings. Explain if it looks edited or authentic.
6. "actionSteps": string array of safety guidelines (e.g., "Cross-check account balance in bank passbook directly", "Do not deliver goods based on this slip", "Report this sender immediately")`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };
      const textPart = { text: prompt };

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              extractedText: { type: Type.STRING },
              detectedAnomalies: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              forensicAnalysis: { type: Type.STRING },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["status", "riskScore", "extractedText", "detectedAnomalies", "forensicAnalysis", "actionSteps"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Screenshot Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze screenshot." });
    }
  });

  // 8. Voice Call Scam / Audio Analyzer
  app.post("/api/scan/audio", async (req: Request, res: Response) => {
    try {
      const { audioText, simulatedAudioAnalysis } = req.body;
      const client = getAIClient();

      let textToAnalyze = audioText || "Emergency loan credit OTP verification SBI officer customer support required.";
      const prompt = `Analyze the following transcript or transcript context of a voice call for social engineering, deepfake indicators, phishing voice templates, fake customer support calls, or blackmail/intimidation tactics:
Call Transcript: "${textToAnalyze}"

Provide a detailed safety evaluation in JSON format containing:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "scamType": string (e.g., "Fake Bank Officer Fraud", "KBC Lottery Call", "Sextortion Blackmail Call", "Urgent Loan Call", "Deepfake Family Impersonation")
4. "vulnerabilitiesExploited": string array (e.g., "Fear of account suspension", "Greed of winning reward", "Urgency hook", "Voice modulation")
5. "transcriptAnalysis": detailed breakdown of the call patterns, trigger words, and suspicious scripts.
6. "actionSteps": string array of steps (e.g., "Disconnect the call immediately", "Never share OTP or CVV over voice call", "Verify by calling the official bank toll-free number")`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              riskScore: { type: Type.INTEGER },
              scamType: { type: Type.STRING },
              vulnerabilitiesExploited: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              transcriptAnalysis: { type: Type.STRING },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["status", "riskScore", "scamType", "vulnerabilitiesExploited", "transcriptAnalysis", "actionSteps"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Audio Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze audio." });
    }
  });

  // 9. Generate Emergency Response Official Document
  app.post("/api/emergency/document", (req: Request, res: Response) => {
    try {
      const { fullName, contactNo, scamType, incidentDetails, lossAmount, bankName, transactionId } = req.body;
      
      const complaintLetter = `
To,
The Cyber Crime Cell / Branch Manager,
${bankName || "All Connected Banking Institutions"},
India.

Subject: IMMEDIATE FREEZE REQUEST FOR FRAUDULENT UPI/FINANCIAL TRANSACTION

Respected Sir/Madam,

I am writing this letter in high urgency to report a financial cyber fraud incident committed against my account details, as summarized below:

1. Victim Full Name: ${fullName || "John Doe"}
2. Contact Mobile Number: ${contactNo || "N/A"}
3. Type of Scam: ${scamType || "UPI / Phishing Cyber Fraud"}
4. Total Loss Amount: INR ${lossAmount || "0"}
5. Date and Time of Incident: ${new Date().toLocaleString()}
6. Forged Bank/UPI Transaction ID: ${transactionId || "N/A"}
7. Detailed Incident Context:
   ${incidentDetails || "The victim was lured into scanning a malicious QR code / clicked a phishing link leading to a fraudulent debit of money without consent."}

I have already initiated a formal complaint on the National Cyber Crime Portal (cybercrime.gov.in) and dialed the National Helpline 1930. 

I request you to immediately:
- Freeze any debit transactions from my bank account.
- Hold / block the beneficiary UPI VPA address and trace the destination nodal account where my funds were transferred.
- Share the beneficiary IP logs, transaction hash, and device ID coordinates with local cyber cell officers.

Thank you.

Sincerely,

____________________
(Signature of Applicant)
Generated via CyberSathi AI Platform
Date: ${new Date().toDateString()}
      `;

      res.json({ letterText: complaintLetter.trim() });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate emergency complaint letter." });
    }
  });

  // --- VITE DEV MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberSathi AI] Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start full-stack server:", error);
});
