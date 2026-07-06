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

  console.log("[Server] Running with local data (NeonDB disabled)");

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

  // 9. APK File Scanner
  app.post("/api/scan/apk", async (req: Request, res: Response) => {
    try {
      const { apkName, apkPermissions, apkSize, apkSource } = req.body;
      const client = getAIClient();

      const prompt = `Analyze this Android APK file for malware, spyware, or fraud indicators:
APK Name: "${apkName || "Unknown"}"
APK Source: "${apkSource || "Unknown (sideloaded)"}"
APK Size: "${apkSize || "N/A"}"
Requested Permissions: "${apkPermissions || "None specified"}"

Provide a security analysis in JSON format:
1. "status": "Safe", "Suspicious", or "Fraud"
2. "riskScore": integer between 0 and 100
3. "malwareIndicators": string array of suspicious behaviors/permissions
4. "permissionAnalysis": analysis of dangerous permissions requested
5. "threatDetails": detailed explanation of risks
6. "recommendation": clear action steps`;

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
              malwareIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              permissionAnalysis: { type: Type.STRING },
              threatDetails: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["status", "riskScore", "malwareIndicators", "permissionAnalysis", "threatDetails", "recommendation"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("APK Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze APK." });
    }
  });

  // 10. Deepfake Image Detection
  app.post("/api/scan/deepfake", async (req: Request, res: Response) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Image is required" });
      }

      const client = getAIClient();
      const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const mimeType = imageBase64.includes(",") ? imageBase64.split(",")[0].split(":")[1].split(";")[0] : "image/png";

      const prompt = `You are a deepfake detection expert. Analyze this image for signs of AI-generated or manipulated content:
- Look for unnatural facial features, inconsistent lighting, weird eye reflections, missing details
- Check for digital artifacts, compression inconsistencies, blending artifacts
- Evaluate if this appears to be a real photograph, AI-generated (GAN/Diffusion), or a deepfake manipulation

Return JSON with:
1. "status": "Authentic", "Suspicious", or "Deepfake"
2. "confidenceScore": integer 0-100
3. "detectedAnomalies": string array of suspicious findings
4. "forensicAnalysis": detailed explanation
5. "verdict": conclusive statement
6. "recommendation": what to do about this image`;

      const imagePart = {
        inlineData: { mimeType, data: base64Data },
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
              confidenceScore: { type: Type.INTEGER },
              detectedAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
              forensicAnalysis: { type: Type.STRING },
              verdict: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["status", "confidenceScore", "detectedAnomalies", "forensicAnalysis", "verdict", "recommendation"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Deepfake Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image." });
    }
  });

  // 11. Document Verification
  app.post("/api/scan/document", async (req: Request, res: Response) => {
    try {
      const { documentBase64, documentType } = req.body;
      if (!documentBase64) {
        return res.status(400).json({ error: "Document image is required" });
      }

      const client = getAIClient();
      const base64Data = documentBase64.includes(",") ? documentBase64.split(",")[1] : documentBase64;
      const mimeType = documentBase64.includes(",") ? documentBase64.split(",")[0].split(":")[1].split(";")[0] : "image/png";

      const prompt = `You are a document forensic verification expert. Analyze this ${documentType || "document"} image for:
- Signs of forgery, tampering, or digital alteration
- Font inconsistencies, spacing anomalies, logo mismatches
- Missing security features (watermarks, holograms, microprinting)
- Whether it appears authentic or forged

Return JSON:
1. "status": "Authentic", "Suspicious", or "Forged"
2. "riskScore": integer 0-100
3. "detectedAnomalies": string array of findings
4. "forensicAnalysis": detailed explanation
5. "authenticityMarkers": string array of positive signs found
6. "recommendation": what to do`;

      const imagePart = {
        inlineData: { mimeType, data: base64Data },
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
              detectedAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
              forensicAnalysis: { type: Type.STRING },
              authenticityMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendation: { type: Type.STRING }
            },
            required: ["status", "riskScore", "detectedAnomalies", "forensicAnalysis", "authenticityMarkers", "recommendation"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Document Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze document." });
    }
  });

  // 12. Social Media Profile Analysis
  app.post("/api/scan/social", async (req: Request, res: Response) => {
    try {
      const { profileUrl, profileName, profileDescription, platform, followersCount } = req.body;
      const client = getAIClient();

      const prompt = `Analyze this social media profile for impersonation, fake account indicators, or scam risks:
Platform: "${platform || "Unknown"}"
Profile URL: "${profileUrl || "N/A"}"
Profile Name: "${profileName || "N/A"}"
Description: "${profileDescription || "N/A"}"
Follower Count: "${followersCount || "N/A"}"

Return JSON:
1. "status": "Legitimate", "Suspicious", or "Fake/Impersonation"
2. "riskScore": integer 0-100
3. "impersonationIndicators": string array (e.g., "Mimicking official brand handle", "Suspicious follower count", "Phishing URL in bio")
4. "verificationStatus": analysis of whether account appears verified/legitimate
5. "threatDetails": explanation of risks
6. "recommendation": what actions to take`;

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
              impersonationIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              verificationStatus: { type: Type.STRING },
              threatDetails: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["status", "riskScore", "impersonationIndicators", "verificationStatus", "threatDetails", "recommendation"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Social Scan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze profile." });
    }
  });

  // 13. Generate Fraud Report
  app.post("/api/scan/fraud-report", async (req: Request, res: Response) => {
    try {
      const { fullName, contactNo, email, fraudType, description, amount, dateTime, evidenceProvided } = req.body;
      const client = getAIClient();

      const prompt = `Generate a comprehensive cyber fraud report based on the following details:

Victim Name: ${fullName || "N/A"}
Contact: ${contactNo || "N/A"}
Email: ${email || "N/A"}
Fraud Type: ${fraudType || "Cyber Fraud"}
Description: ${description || "N/A"}
Amount Lost: Rs. ${amount || "0"}
Date/Time: ${dateTime || new Date().toLocaleString()}
Evidence Available: ${evidenceProvided || "None"}

Generate a JSON report containing:
1. "reportId": auto-generated unique ID
2. "incidentSummary": 2-3 sentence summary
3. "fraudClassification": the specific type of cyber fraud
4. "actionPlan": array of immediate steps the victim should take
5. "legalProvisions": applicable Indian cyber laws (e.g., IT Act 2000 sections)
6. "evidenceChecklist": what evidence to collect and preserve
7. "reportingChannels": where to file the complaint (cybercrime.gov.in, 1930, bank)
8. "preventionTips": how to avoid similar frauds in future`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reportId: { type: Type.STRING },
              incidentSummary: { type: Type.STRING },
              fraudClassification: { type: Type.STRING },
              actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              legalProvisions: { type: Type.ARRAY, items: { type: Type.STRING } },
              evidenceChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
              reportingChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["reportId", "incidentSummary", "fraudClassification", "actionPlan", "legalProvisions", "evidenceChecklist", "reportingChannels", "preventionTips"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Fraud Report error:", error);
      res.status(500).json({ error: error.message || "Failed to generate report." });
    }
  });

  // 14. Generate FIR Draft
  app.post("/api/emergency/fir", async (req: Request, res: Response) => {
    try {
      const { fullName, contactNo, address, fraudType, incidentDetails, lossAmount, suspects, evidenceList, policeStation } = req.body;

      const firDraft = `
FIRST INFORMATION REPORT (FIR) - DRAFT
Generated by CyberSathi AI Platform

TO,
The Station House Officer (SHO),
${policeStation || "Local Cyber Crime Police Station"},
India.

Date: ${new Date().toDateString()}
Time: ${new Date().toLocaleTimeString()}

INFORMATION REPORTED UNDER SECTION 154 CrPC / IT ACT 2000

1. Name of Complainant: ${fullName || "N/A"}
2. Father's/Husband's Name: [Father's/Husband's Name]
3. Address: ${address || "N/A"}
4. Contact Number: ${contactNo || "N/A"}

TYPE OF FRAUD: ${fraudType || "Financial Cyber Fraud"}

DETAILED DESCRIPTION OF INCIDENT:
${incidentDetails || "The complainant reports that they fell victim to a cyber fraud operation..."}

FINANCIAL LOSS: INR ${lossAmount || "0"}

SUSPECT DETAILS (IF KNOWN):
${suspects || "Unknown. Suspects operated through online channels."}

EVIDENCE COLLECTED:
${evidenceList || "Screenshots, transaction IDs, call recordings (to be attached)"}

LEGAL PROVISIONS INVOKED:
- Section 66D, IT Act 2000 (Cheating by impersonation using computer)
- Section 420 IPC (Cheating and dishonestly inducing delivery of property)
- Section 379 IPC (Theft) [if applicable]

COMPLAINT STATEMENT:
I, ${fullName || "the complainant"}, hereby state that the above information is true and correct to the best of my knowledge. I request immediate investigation and action to recover the lost funds and bring the perpetrators to justice.

Signature: ____________________

____________________
${fullName || "Complainant Name"}

---
Note: This is an AI-generated draft. Please verify all details and sign in person at your nearest cyber crime police station.
      `;

      res.json({ firText: firDraft.trim() });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate FIR draft." });
    }
  });

  // 15. Evidence Collection Guidance
  app.post("/api/emergency/evidence", async (req: Request, res: Response) => {
    try {
      const { fraudType } = req.body;

      const client = getAIClient();
      const prompt = `Generate a comprehensive evidence collection guide for a cyber fraud victim. The fraud type is: "${fraudType || "General Cyber Fraud"}"

Return JSON with:
1. "guideTitle": string
2. "digitalEvidence": array of what digital evidence to collect (screenshots, transaction IDs, call logs, etc.)
3. "preservationSteps": array of steps to preserve evidence without tampering
4. "documentationGuide": how to document everything properly
5. "legalAdmissibility": how to ensure evidence is admissible in court
6. "checklist": array of items to collect before visiting police station`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              guideTitle: { type: Type.STRING },
              digitalEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
              preservationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              documentationGuide: { type: Type.STRING },
              legalAdmissibility: { type: Type.STRING },
              checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["guideTitle", "digitalEvidence", "preservationSteps", "documentationGuide", "legalAdmissibility", "checklist"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Evidence Guide error:", error);
      res.status(500).json({ error: error.message || "Failed to generate evidence guide." });
    }
  });

  // 16. Admin Analytics
  app.get("/api/admin/analytics", (req: Request, res: Response) => {
    res.json({
      totalUsers: 45892,
      totalScans: 128450,
      totalReports: 8245,
      fraudsPrevented: 48210,
      amountSaved: 48500000,
      activeSessions: 1284,
      threatLevel: "medium",
      dailyActiveUsers: 5892,
      monthlyGrowth: 23.5,
      recentReports: [
        { id: "FR-2026-001", type: "UPI Scam", status: "Investigating", date: "July 04, 2026", amount: 45000 },
        { id: "FR-2026-002", type: "Phishing", status: "Resolved", date: "July 03, 2026", amount: 12000 },
        { id: "FR-2026-003", type: "Investment Scam", status: "Pending", date: "July 02, 2026", amount: 250000 },
        { id: "FR-2026-004", type: "Fake Call", status: "Resolved", date: "July 01, 2026", amount: 5000 },
      ],
      topScams: [
        { name: "UPI QR Scams", count: 4520 },
        { name: "Phishing URLs", count: 3890 },
        { name: "SMS Fraud", count: 2150 },
        { name: "Investment Scams", count: 1840 },
        { name: "Fake Calls", count: 1200 }
      ],
      userGrowth: [
        { month: "Jan", users: 12000 },
        { month: "Feb", users: 15500 },
        { month: "Mar", users: 19800 },
        { month: "Apr", users: 25600 },
        { month: "May", users: 34200 },
        { month: "Jun", users: 45892 }
      ]
    });
  });

  // 17. Smart Notification Generator
  app.post("/api/notify", async (req: Request, res: Response) => {
    try {
      const { type, context } = req.body;
      const client = getAIClient();

      const prompt = `Generate a security notification for a cyber safety platform.
Notification Type: "${type || "general"}"
Context: "${context || "User scanned a suspicious URL"}"

Return JSON:
1. "title": short alert title
2. "message": detailed message (1-2 sentences)
3. "severity": "low", "medium", "high", or "critical"
4. "actionRequired": what the user should do
5. "icon": relevant emoji`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              severity: { type: Type.STRING },
              actionRequired: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["title", "message", "severity", "actionRequired", "icon"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate notification." });
    }
  });

  // 9 (original). Generate Emergency Response Official Document
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

  // ─── DATABASE API ROUTES (disabled - using local data) ─────────

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
