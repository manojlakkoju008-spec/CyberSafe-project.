import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize server-side Gemini client utility
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

import { generateExpertGuidance } from './src/utils/aiGuideExpertEngine';

// Strict body parser limits to prevent payload abuse
app.use(express.json({ limit: '64kb' }));

// =========================================================================
// SECURITY & SSRF PROTECTION RATE LIMITER
// =========================================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40;

function rateLimitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      status: 'THREAT INTELLIGENCE UNAVAILABLE',
      isAvailable: false,
      error: 'Rate limit exceeded. Please wait a moment before checking more URLs.',
    });
  }

  record.count++;
  next();
}

// In-memory threat intel cache
interface CachedThreatResult {
  data: {
    status: string;
    provider: string;
    threatTypes: string[];
    isAvailable: boolean;
    details?: string;
    sourceConfidence?: string;
  };
  timestamp: number;
}
const threatIntelCache = new Map<string, CachedThreatResult>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * POST /api/threat-intel
 * Secure server-side threat-intelligence proxy.
 *
 * CRITICAL ZERO-SSRF ARCHITECTURE:
 * Never connects to, crawls, downloads from, or visits the user-supplied URL.
 * Only queries configured threat reputation providers or returns honest offline/fallback status.
 */
app.post('/api/threat-intel', rateLimitMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.length > 2048) {
      return res.status(400).json({
        status: 'INVALID URL',
        isAvailable: false,
        error: 'Invalid URL. Input must be a valid string under 2048 characters.',
      });
    }

    // Validate protocol safely
    let parsed: URL;
    try {
      parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return res.status(400).json({
          status: 'INVALID URL',
          isAvailable: false,
          error: 'Only standard HTTP and HTTPS web URLs are permitted for reputation lookup.',
        });
      }
    } catch {
      return res.status(400).json({
        status: 'INVALID URL',
        isAvailable: false,
        error: 'RFC URL syntax error.',
      });
    }

    // Check cache
    const cacheKey = parsed.toString();
    const cached = threatIntelCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const vtKey = process.env.VIRUSTOTAL_API_KEY;
    const gsbKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY || process.env.THREAT_INTEL_API_KEY;

    // If an external key is configured (e.g. VirusTotal v3)
    if (vtKey) {
      try {
        const domain = parsed.hostname;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        // Query VirusTotal domain report (safe metadata lookup, NOT fetching user's URL)
        const vtResp = await fetch(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`, {
          headers: { 'x-apikey': vtKey },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (vtResp.ok) {
          const vtData = await vtResp.json();
          const stats = vtData?.data?.attributes?.last_analysis_stats;
          const maliciousCount = stats?.malicious || 0;
          const suspiciousCount = stats?.suspicious || 0;

          let status = 'NO KNOWN THREAT FOUND';
          const threatTypes: string[] = [];

          if (maliciousCount >= 3) {
            status = 'KNOWN MALICIOUS';
            threatTypes.push('MALICIOUS_REPUTATION');
          } else if (maliciousCount > 0 || suspiciousCount >= 2) {
            status = 'SUSPICIOUS';
            threatTypes.push('SUSPICIOUS_REPUTATION');
          }

          const resultData = {
            status,
            provider: 'VirusTotal Intelligence API',
            threatTypes,
            isAvailable: true,
            details: `Reputation statistics: ${maliciousCount} malicious flags, ${suspiciousCount} suspicious flags reported by security vendors.`,
            sourceConfidence: 'High',
          };

          threatIntelCache.set(cacheKey, { data: resultData, timestamp: Date.now() });
          return res.json(resultData);
        }
      } catch {
        // Fall through to unavailable response
      }
    }

    // Default Academic Fallback Response
    // Accurately discloses that external threat verification is unconfigured/unavailable
    const fallbackData = {
      status: 'THREAT INTELLIGENCE UNAVAILABLE',
      provider: 'CyberSafe Local Engine',
      threatTypes: [],
      isAvailable: false,
      details: 'No external threat intelligence API key (e.g., VIRUSTOTAL_API_KEY or GOOGLE_SAFE_BROWSING_API_KEY) is configured on this academic server instance. All evaluations proceed using local structural heuristics.',
      sourceConfidence: 'Unrated',
    };

    return res.json(fallbackData);
  } catch {
    return res.status(500).json({
      status: 'THREAT INTELLIGENCE UNAVAILABLE',
      provider: 'CyberSafe Threat Feed Proxy',
      threatTypes: [],
      isAvailable: false,
      details: 'An unexpected error occurred during threat reputation verification.',
    });
  }
});

// =========================================================================
// CYBERSAFE AI GUIDE PROXY & COGNITIVE REASONING ROUTE
// =========================================================================
const AI_GUIDE_SYSTEM_INSTRUCTION = `You are CyberSafe AI Guide, the intelligent cybersecurity awareness, incident guidance, and platform navigation assistant for the CyberSafe web application.

CORE PRINCIPLES & PERSONA:
1. Act as a CALM CYBERSECURITY GUIDE.
2. You are NOT a police officer, NOT a lawyer, NOT a bank employee, NOT a human investigator, and NOT a guarantee engine.
3. Be reassuring, non-judgmental, objective, structured, and practical.
4. When an incident is active, structure your guidance clearly:
   - What Happened (Classification & acknowledgment)
   - What To Do Now (Immediate actionable steps in numbered sequence)
   - What NOT To Do (Warnings: never pay recovery fees, never share OTP, never delete evidence)
   - What To Preserve (Exact evidence list: UTR, debit SMS, caller ID, screenshots, headers)
   - Where To Report (Official channels: 1930 Helpline, cybercrime.gov.in, Bank fraud desk, Chakshu)
   - Learning & Prevention (Understanding the attack mechanism)
5. CyberSafe Platform Actions (always recommend safe next actions within the app where relevant):
   - "navigate_detect": to analyze URLs safely in CyberSafe Detect (zero-SSRF inspection)
   - "navigate_report": to prepare formal incident reports with prefilled incidentId (e.g. "financial-fraud", "upi-payment-fraud", "phishing-smishing", "account-takeover", "malware-ransomware", "cyberstalking-harassment")
   - "navigate_nearby": to locate nearby verified police stations and dedicated cyber cells
   - "navigate_learn": to deep dive into learning topics
   - "navigate_prevent": to open personalized prevention checklists (areaId: "passwords", "mfa", "device-security", etc.)
   - "navigate_quiz": to practice recognizing dangerous scenarios in the interactive quiz
   - "dial_helpline": for emergency financial fraud (helplineNumber: "1930", helplineLabel: "National Cyber Crime Helpline (India)", requiresConfirmation: true)

IMPORTANT: In India, the official emergency response for financial cybercrime is the toll-free 24/7 Helpline 1930 (operated by I4C, MHA) and the National Cyber Crime Reporting Portal (cybercrime.gov.in). Emphasize the "Golden Hours" (first 1-2 hours) for freezing stolen money across recipient accounts.

Return valid JSON adhering strictly to:
{
  "intent": "FINANCIAL_FRAUD" | "SUSPICIOUS_URL" | "PHISHING" | "ACCOUNT_COMPROMISE" | "MALWARE" | "CYBERSTALKING" | "IDENTITY_THEFT" | "LEARNING" | "PREVENTION" | "REPORTING" | "GENERAL_CYBERSECURITY",
  "reply": "Comprehensive Markdown response with clear headers and bullet points.",
  "structuredGuidance": {
    "whatHappened": "Short explanation",
    "immediateActions": ["step 1", "step 2", ...],
    "whatToAvoid": ["avoid 1", "avoid 2", ...],
    "evidenceToPreserve": ["evidence 1", "evidence 2", ...],
    "officialReporting": [
      { "name": "...", "helpline": "...", "url": "...", "notes": "..." }
    ],
    "learningRecommendation": "..."
  },
  "suggestedActions": [
    {
      "id": "action_id",
      "type": "navigate_detect" | "navigate_report" | "navigate_nearby" | "navigate_learn" | "navigate_prevent" | "navigate_quiz" | "dial_helpline",
      "label": "Button Label",
      "description": "Short subtitle",
      "payload": { "url": "...", "incidentId": "...", "searchQuery": "...", "areaId": "...", "category": "..." },
      "requiresConfirmation": boolean,
      "confirmationTitle": "...",
      "confirmationMessage": "..."
    }
  ]
}`;

app.post('/api/ai-guide', rateLimitMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory, contextPage } = req.body;

    if (!message || typeof message !== 'string' || message.length > 4000) {
      return res.status(400).json({
        error: 'Invalid message. Must be a non-empty string under 4000 characters.',
      });
    }

    if (ai) {
      try {
        const historyText = Array.isArray(conversationHistory)
          ? conversationHistory
              .slice(-6)
              .map((h: { role: string; content: string }) => `${h.role}: ${h.content}`)
              .join('\n')
          : '';

        const prompt = `Current Page Context: ${contextPage || 'home'}\n\nRecent History:\n${historyText}\n\nUser Question:\n${message}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: AI_GUIDE_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            intent: parsed.intent || 'GENERAL_CYBERSECURITY',
            reply: parsed.reply || '',
            structuredGuidance: parsed.structuredGuidance || undefined,
            suggestedActions: parsed.suggestedActions || [],
            engineUsed: 'gemini-3.8-flash',
          });
        }
      } catch (geminiErr) {
        console.warn('[AI Guide] Gemini call failed or quota exceeded, using expert fallback:', geminiErr);
      }
    }

    // High-fidelity academic expert fallback
    const fallbackResponse = generateExpertGuidance(message, contextPage);
    return res.json(fallbackResponse);
  } catch (err) {
    console.error('[AI Guide] Internal error:', err);
    const fallback = generateExpertGuidance(req.body?.message || '', req.body?.contextPage);
    return res.json(fallback);
  }
});

// =========================================================================
// VITE DEV MIDDLEWARE / STATIC ASSETS
// =========================================================================
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberSafe Server] Listening on http://0.0.0.0:${PORT} (Mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
