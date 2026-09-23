import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

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
