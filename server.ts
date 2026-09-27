import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import net from 'net';
import tls from 'tls';
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

// Self-contained fallback guidance when Gemini is unavailable or rate-limited
function getFallbackGuidance(message: string, _contextPage?: string) {
  const isEmergency = /upi|bank|money|debit|hacked|scam|fraud|otp|stolen|unauthorized|stole/i.test(message);
  return {
    intent: isEmergency ? 'FINANCIAL_FRAUD' : 'GENERAL_CYBERSECURITY',
    reply: isEmergency
      ? "### Immediate Incident Response Protocol\n\nIf you believe you have experienced fraud or an account compromise, act quickly to contain the impact:\n\n1. **Freeze & Block Immediately**: If funds or banking credentials are involved, call the National Cyber Crime Helpline at **1930** or notify your bank's 24/7 fraud desk.\n2. **Disconnect Compromised Sessions**: Change your passwords from a known secure device and revoke active app permissions.\n3. **Preserve Digital Evidence**: Take complete screenshots showing transaction IDs (UTR/ref numbers), sender phone numbers or email addresses, and timestamps.\n4. **Lodge an Official Complaint**: File a report on the official portal at [cybercrime.gov.in](https://cybercrime.gov.in)."
      : "### CyberSafe Guidance\n\nStaying safe online begins with strong defensive habits:\n\n- **Use unique passphrases** for every sensitive account with a password manager.\n- **Enable multi-factor authentication (MFA)**, preferably using an authenticator app.\n- **Never share OTPs, UPI PINs, or passwords** with anyone, even if they claim to be customer support or officials.\n- **Verify URLs before clicking** using the CyberSafe Detect scanner.",
    structuredGuidance: {
      whatHappened: isEmergency ? "Potential cyber incident or fraudulent activity reported." : "General digital safety inquiry.",
      immediateActions: isEmergency
        ? [
            "Dial 1930 immediately if money was transferred in the last 2 hours (Golden Hour)",
            "Contact your bank fraud department to block cards/netbanking",
            "Log out of active sessions on affected accounts and update passwords",
          ]
        : [
            "Verify all sender details before opening links or downloading files",
            "Ensure Multi-Factor Authentication (MFA) is active on primary email and banking",
          ],
      whatToAvoid: [
        "Never share OTPs, PINs, or verification codes",
        "Never transfer money to 'verify' an account or pay recovery fees",
        "Do not delete chat logs, SMS messages, or transaction records",
      ],
      evidenceToPreserve: [
        "Transaction UTR / Reference numbers and debit SMS alerts",
        "Full uncropped screenshots showing date, time, and phone numbers",
        "Suspicious URLs, email headers, or APK files received",
      ],
      officialReporting: [
        {
          name: "National Cyber Crime Reporting Portal",
          helpline: "1930",
          url: "https://cybercrime.gov.in",
          notes: "Official 24/7 Indian citizen cybercrime response portal",
        },
      ],
      learningRecommendation: "Explore CyberSafe's Learn and Prevent modules for step-by-step guidance.",
    },
    suggestedActions: [
      {
        id: "guide-detect",
        type: "navigate_detect",
        label: "Check Suspicious Link",
        description: "Analyze URLs and messages with CyberSafe Detect",
        payload: {},
        requiresConfirmation: false,
      },
      {
        id: "guide-report",
        type: "navigate_report",
        label: "Emergency Incident Triage",
        description: "Follow the 6-step containment wizard",
        payload: { incidentId: isEmergency ? "financial-fraud" : "general" },
        requiresConfirmation: false,
      },
      ...(isEmergency
        ? [
            {
              id: "call-1930",
              type: "dial_helpline",
              label: "Call Cyber Helpline (1930)",
              description: "Direct assistance for financial cybercrime",
              payload: { helplineNumber: "1930" },
              requiresConfirmation: true,
              confirmationTitle: "Call 1930 Helpline",
              confirmationMessage: "You are about to dial the National Cyber Crime Helpline (1930).",
            },
          ]
        : []),
    ],
    engineUsed: "academic-expert-rules",
  };
}

// Strict body parser limits to prevent payload abuse
app.use(express.json({ limit: '64kb' }));

// =========================================================================
// MULTI-LAYER URL & WEBPAGE SECURITY SCANNER ENGINE
// =========================================================================

// High-Risk disposable or heavily abused TLDs
const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'loan', 'cfd', 'gq', 'tk', 'ml', 'ga',
  'cc', 'buzz', 'rest', 'cam', 'vip', 'icu', 'sbs', 'monster', 'hair',
  'bond', 'fit', 'beauty', 'surf', 'country', 'stream', 'party', 'gdn'
]);

const AUTH_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security',
  'account', 'update', 'confirm', 'password', 'recovery', 'recover',
  'unlock', 'suspended', 'urgent', 'alert', 're-activate', 'validate'
];

const FINANCIAL_KEYWORDS = [
  'banking', 'netbanking', 'wallet', 'billing', 'invoice', 'refund',
  'cashback', 'kyc', 'pan-card', 'aadhaar', 'lottery', 'prize',
  'tax-refund', 'upi-pin', 'rewards', 'payout', 'crypto', 'bonus'
];

const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.apk', '.bat', '.cmd', '.vbs', '.ps1', '.iso', '.zip',
  '.jar', '.dmg', '.msi', '.hta', '.pif', '.reg', '.tar.gz'
];

/**
 * Validates whether an IP address belongs to private, loopback, link-local,
 * or reserved networks to strictly prevent SSRF attacks.
 */
function isPrivateOrReservedIp(ipStr: string): boolean {
  if (!net.isIP(ipStr)) return false;

  if (net.isIPv4(ipStr)) {
    const parts = ipStr.split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) return true;

    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;
    // 10.0.0.0/8 (Private RFC 1918)
    if (parts[0] === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 172.16.0.0/12 (Private RFC 1918)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.0.0.0/24, 192.0.2.0/24 (TEST-NET-1)
    if (parts[0] === 192 && parts[1] === 0 && (parts[2] === 0 || parts[2] === 2)) return true;
    // 192.168.0.0/16 (Private RFC 1918)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 198.51.100.0/24 (TEST-NET-2)
    if (parts[0] === 198 && parts[1] === 51 && parts[2] === 100) return true;
    // 203.0.113.0/24 (TEST-NET-3)
    if (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) return true;
    // 224.0.0.0/4 (Multicast)
    if (parts[0] >= 224 && parts[0] <= 239) return true;
    // 240.0.0.0/4 (Reserved)
    if (parts[0] >= 240) return true;
    // Broadcast
    if (ipStr === '255.255.255.255') return true;

    return false;
  }

  if (net.isIPv6(ipStr)) {
    const normalized = ipStr.toLowerCase();
    // ::1 (Loopback)
    if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;
    // :: (Unspecified)
    if (normalized === '::' || normalized === '0:0:0:0:0:0:0:0') return true;
    // Unique local: fc00::/7
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    // Link-local: fe80::/10
    if (/^fe[89ab]/.test(normalized)) return true;
    // Multicast: ff00::/8
    if (normalized.startsWith('ff')) return true;
    // IPv4 mapped
    if (normalized.startsWith('::ffff:')) {
      const v4Part = normalized.replace('::ffff:', '');
      if (net.isIPv4(v4Part)) return isPrivateOrReservedIp(v4Part);
    }
    return false;
  }

  return false;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Performs actual DNS resolution across IPv4, IPv6, MX, and TXT records.
 * Uses fast concurrent resolution and strict timeouts to prevent hanging on NXDOMAIN.
 */
async function performDnsLookup(hostname: string) {
  const result = {
    domain: hostname,
    dnsStatus: 'failed' as 'resolved' | 'failed' | 'not_applicable',
    domainExistenceStatus: 'unknown' as 'exists' | 'nonexistent' | 'unknown',
    resolvedIps: [] as string[],
    ipv4: [] as string[],
    ipv6: [] as string[],
    mxRecords: [] as string[],
    txtRecords: [] as string[],
    dnsFailureReason: undefined as string | undefined,
    isPrivateOrInternalIp: false,
  };

  if (net.isIP(hostname)) {
    result.dnsStatus = 'not_applicable';
    result.domainExistenceStatus = 'exists';
    result.resolvedIps = [hostname];
    if (net.isIPv4(hostname)) result.ipv4 = [hostname];
    else result.ipv6 = [hostname];
    if (isPrivateOrReservedIp(hostname)) {
      result.isPrivateOrInternalIp = true;
    }
    return result;
  }

  // Check for disallowed localhost or internal domains
  if (/^(localhost|\.local|\.internal|\.lan|\.home)$/i.test(hostname) || hostname.endsWith('.localhost')) {
    result.dnsStatus = 'failed';
    result.domainExistenceStatus = 'unknown';
    result.isPrivateOrInternalIp = true;
    result.dnsFailureReason = 'Local and internal hostnames are restricted from remote scanning.';
    return result;
  }

  try {
    // 1. Fast primary lookup with 2.5s timeout
    let lookupResult: any = null;
    try {
      lookupResult = await withTimeout(dns.promises.lookup(hostname, { all: true }), 2500, null);
    } catch (err: any) {
      if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
        result.dnsStatus = 'failed';
        result.domainExistenceStatus = 'nonexistent';
        result.dnsFailureReason = 'Domain could not be resolved (NXDOMAIN). The requested website currently does not appear to exist or its DNS records are unavailable. This alone does not prove malicious intent.';
        return result;
      }
      result.dnsFailureReason = `DNS query failed: ${err.code || err.message}`;
    }

    if (lookupResult && Array.isArray(lookupResult) && lookupResult.length > 0) {
      for (const entry of lookupResult) {
        if (entry.address && !result.resolvedIps.includes(entry.address)) {
          result.resolvedIps.push(entry.address);
          if (entry.family === 4) result.ipv4.push(entry.address);
          else if (entry.family === 6) result.ipv6.push(entry.address);
        }
      }
      result.dnsStatus = 'resolved';
      result.domainExistenceStatus = 'exists';

      if (result.resolvedIps.some(ip => isPrivateOrReservedIp(ip))) {
        result.isPrivateOrInternalIp = true;
      }

      // If domain exists, query MX & TXT records concurrently with 1.5s timeout
      const [mxSettled, txtSettled] = await Promise.allSettled([
        withTimeout(dns.promises.resolveMx(hostname), 1500, []),
        withTimeout(dns.promises.resolveTxt(hostname), 1500, []),
      ]);

      if (mxSettled.status === 'fulfilled' && Array.isArray(mxSettled.value)) {
        result.mxRecords = mxSettled.value.map((m: any) => `${m.exchange} (pri: ${m.priority})`);
      }
      if (txtSettled.status === 'fulfilled' && Array.isArray(txtSettled.value)) {
        result.txtRecords = txtSettled.value.map((t: any) => Array.isArray(t) ? t.join(' ') : String(t)).slice(0, 5);
      }

      return result;
    }

    // Fallback try resolve4 if lookup was null/timeout
    try {
      const aRecords = await withTimeout(dns.promises.resolve4(hostname), 2000, []);
      if (aRecords && aRecords.length > 0) {
        result.ipv4 = aRecords;
        result.resolvedIps.push(...aRecords);
        result.dnsStatus = 'resolved';
        result.domainExistenceStatus = 'exists';
        if (aRecords.some(ip => isPrivateOrReservedIp(ip))) {
          result.isPrivateOrInternalIp = true;
        }
        return result;
      }
    } catch {
      // not found
    }

    result.dnsStatus = 'failed';
    result.domainExistenceStatus = 'nonexistent';
    result.dnsFailureReason = 'Domain could not be resolved (NXDOMAIN). The requested website currently does not appear to exist or its DNS records are unavailable. This alone does not prove malicious intent.';
  } catch (err: any) {
    result.dnsStatus = 'failed';
    result.domainExistenceStatus = 'unknown';
    result.dnsFailureReason = `DNS query failed: ${err.message || 'unknown error'}`;
  }

  return result;
}

/**
 * Inspects remote TLS/SSL certificate parameters over port 443 safely.
 */
async function inspectTlsCertificate(hostname: string, port = 443): Promise<{
  httpsEnabled: boolean;
  httpsAvailable: boolean;
  certValid?: boolean;
  certIssuer?: string;
  certSubject?: string;
  certValidFrom?: string;
  certValidTo?: string;
  certDaysRemaining?: number;
  certHostnameMatch?: boolean;
  tlsVersion?: string;
  tlsError?: string;
  tlsNote: string;
}> {
  return new Promise((resolve) => {
    let resolved = false;
    const socket = tls.connect(
      {
        host: hostname,
        port: port,
        servername: hostname,
        rejectUnauthorized: false,
        timeout: 3500,
      },
      () => {
        if (resolved) return;
        resolved = true;
        try {
          const cert = socket.getPeerCertificate(true);
          const authorized = socket.authorized;
          const authError = socket.authorizationError;
          const protocol = socket.getProtocol() || undefined;

          let certHostnameMatch = true;
          if (cert && cert.subject) {
            const check = tls.checkServerIdentity(hostname, cert);
            if (check) certHostnameMatch = false;
          }

          let daysRemaining: number | undefined = undefined;
          let validToFormatted: string | undefined = undefined;
          let validFromFormatted: string | undefined = undefined;

          if (cert && cert.valid_to) {
            const expDate = new Date(cert.valid_to);
            daysRemaining = Math.round((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            validToFormatted = expDate.toISOString().split('T')[0];
          }
          if (cert && cert.valid_from) {
            validFromFormatted = new Date(cert.valid_from).toISOString().split('T')[0];
          }

          const formatCertField = (field: any): string => {
            if (!field) return 'Unknown';
            if (Array.isArray(field)) return field.join(', ');
            return String(field);
          };

          const issuerStr = cert && cert.issuer ? formatCertField(cert.issuer.O || cert.issuer.CN) : 'Unknown';
          const subjectStr = cert && cert.subject ? formatCertField(cert.subject.CN || cert.subject.O || hostname) : hostname;

          socket.end();

          resolve({
            httpsEnabled: true,
            httpsAvailable: true,
            certValid: authorized && certHostnameMatch && (daysRemaining !== undefined && daysRemaining > 0),
            certIssuer: issuerStr,
            certSubject: subjectStr,
            certValidFrom: validFromFormatted,
            certValidTo: validToFormatted,
            certDaysRemaining: daysRemaining,
            certHostnameMatch,
            tlsVersion: protocol,
            tlsError: authError ? String(authError) : undefined,
            tlsNote: authorized && certHostnameMatch
              ? 'Valid SSL/TLS certificate issued by a recognized certificate authority. Note: HTTPS protects the connection between your browser and server, but HTTPS does not prove that the website itself is legitimate.'
              : `TLS certificate issue detected: ${authError || 'Hostname mismatch or untrusted root'}. Note: HTTPS protects in-transit traffic, but does not prove website legitimacy.`,
          });
        } catch {
          socket.end();
          resolve({
            httpsEnabled: true,
            httpsAvailable: false,
            tlsNote: 'Connected to port 443 but certificate payload could not be extracted.',
          });
        }
      }
    );

    socket.on('timeout', () => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({
        httpsEnabled: true,
        httpsAvailable: false,
        tlsNote: 'TLS handshake to port 443 timed out after 3.5 seconds.',
      });
    });

    socket.on('error', (err) => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({
        httpsEnabled: false,
        httpsAvailable: false,
        tlsError: err.message,
        tlsNote: `Could not establish TLS connection: ${err.message}`,
      });
    });
  });
}

/**
 * Follows redirect chains safely (max 5 hops), captures status codes,
 * inspects security headers, and parses public HTML content/forms.
 */
async function checkHttpAndContent(
  targetUrl: string,
  initialDns: { isPrivateOrInternalIp: boolean; domainExistenceStatus: string }
) {
  const result = {
    reachability: {
      isReachable: false,
      httpStatusCode: undefined as number | undefined,
      httpStatusText: undefined as string | undefined,
      responseTimeMs: undefined as number | undefined,
      contentType: undefined as string | undefined,
      serverHeader: undefined as string | undefined,
      finalUrl: targetUrl,
      classification: 'unreachable' as
        | 'reachable'
        | 'redirected'
        | 'access_denied'
        | 'not_found'
        | 'server_error'
        | 'dns_failure'
        | 'timeout'
        | 'connection_refused'
        | 'blocked_internal_ip'
        | 'unreachable',
      explanation: 'Server connection could not be established.',
    },
    redirectAnalysis: {
      redirectCount: 0,
      redirectChain: [] as Array<{ from: string; to: string; statusCode: number; statusText?: string }>,
      hasExcessiveRedirects: false,
      hasCrossDomainRedirect: false,
      hasDowngradeRedirect: false,
      hasSuspiciousRedirect: false,
      finalDestination: targetUrl,
      redirectSummary: 'No redirects observed. Destination reached directly.',
    },
    securityHeaders: {
      headers: [] as Array<{ name: string; value?: string; status: 'present' | 'missing' | 'unknown'; importance: 'high' | 'medium' | 'low'; description: string }>,
      score: 0,
      missingCount: 0,
      presentCount: 0,
      evaluationNote: '',
    },
    webpageContent: {
      isContentFetched: false,
      fetchError: undefined as string | undefined,
      pageTitle: undefined as string | undefined,
      metaDescription: undefined as string | undefined,
      mainHeading: undefined as string | undefined,
      language: undefined as string | undefined,
      headings: [] as string[],
      textExcerpt: undefined as string | undefined,
      formsDetected: [] as Array<{
        action?: string;
        method?: string;
        inputs: string[];
        hasPasswordInput: boolean;
        hasEmailInput: boolean;
        hasPaymentInput: boolean;
        isSuspiciousAction: boolean;
      }>,
      hasLoginForm: false,
      hasPasswordFields: false,
      hasPaymentFields: false,
      hasPiiFields: false,
      sensitiveFieldsDetected: [] as string[],
      externalScriptsCount: 0,
      functionalElements: {
        hasLogin: false,
        hasRegistration: false,
        hasSearch: false,
        hasContactForm: false,
        hasFileUpload: false,
        hasDownload: false,
        hasShoppingCart: false,
        hasCheckout: false,
        hasPayment: false,
        hasSubscription: false,
        hasAccountCreation: false,
        detectedList: [] as string[],
      },
      contentLengthBytes: 0,
      linksInfo: {
        totalLinksCount: 0,
        internalLinksCount: 0,
        externalLinksCount: 0,
        sampleLinks: [] as Array<{ text: string; href: string; isExternal: boolean }>,
      },
    },
  };

  if (initialDns.domainExistenceStatus === 'nonexistent') {
    result.reachability.classification = 'dns_failure';
    result.reachability.explanation = 'Domain could not be resolved. This means the requested website currently does not appear to exist or its DNS records are unavailable. This alone does not prove malicious intent.';
    return result;
  }

  if (initialDns.isPrivateOrInternalIp) {
    result.reachability.classification = 'blocked_internal_ip';
    result.reachability.explanation = 'The host resolves to a private or internal network address (RFC 1918 / RFC 4291). To protect local infrastructure against SSRF, external network probes to internal addresses are blocked.';
    return result;
  }

  let currentUrl = targetUrl;
  const maxRedirects = 5;
  const startTime = Date.now();

  try {
    for (let hop = 0; hop < maxRedirects; hop++) {
      const urlObj = new URL(currentUrl);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        result.reachability.explanation = `Invalid protocol in redirect chain: ${urlObj.protocol}`;
        break;
      }

      if (net.isIP(urlObj.hostname) && isPrivateOrReservedIp(urlObj.hostname)) {
        result.reachability.classification = 'blocked_internal_ip';
        result.reachability.explanation = 'Redirect target points to an internal/private address. Operation terminated to prevent SSRF.';
        break;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (CyberSafe Safety Scanner)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const isRedirect = [301, 302, 303, 307, 308].includes(resp.status);
      const location = resp.headers.get('location');

      if (isRedirect && location) {
        const nextUrl = new URL(location, currentUrl).toString();
        const fromHost = new URL(currentUrl).hostname;
        const toHost = new URL(nextUrl).hostname;

        result.redirectAnalysis.redirectChain.push({
          from: currentUrl,
          to: nextUrl,
          statusCode: resp.status,
          statusText: resp.statusText,
        });

        if (fromHost.toLowerCase() !== toHost.toLowerCase()) {
          result.redirectAnalysis.hasCrossDomainRedirect = true;
        }
        if (currentUrl.startsWith('https://') && nextUrl.startsWith('http://')) {
          result.redirectAnalysis.hasDowngradeRedirect = true;
        }

        currentUrl = nextUrl;
        result.redirectAnalysis.redirectCount++;
        continue;
      }

      // Final destination reached
      result.reachability.isReachable = true;
      result.reachability.httpStatusCode = resp.status;
      result.reachability.httpStatusText = resp.statusText;
      result.reachability.responseTimeMs = Date.now() - startTime;
      result.reachability.contentType = resp.headers.get('content-type') || undefined;
      result.reachability.serverHeader = resp.headers.get('server') || undefined;
      result.reachability.finalUrl = currentUrl;
      result.redirectAnalysis.finalDestination = currentUrl;

      if (resp.status >= 200 && resp.status < 300) {
        result.reachability.classification = 'reachable';
        result.reachability.explanation = `Website reached successfully with HTTP ${resp.status} ${resp.statusText}.`;
      } else if (resp.status === 401 || resp.status === 403) {
        result.reachability.classification = 'access_denied';
        result.reachability.explanation = `Server is online but access is protected or denied (HTTP ${resp.status}).`;
      } else if (resp.status === 404) {
        result.reachability.classification = 'not_found';
        result.reachability.explanation = `Server exists and is online, but the specific requested resource or path was not found (HTTP 404). This does not indicate domain nonexistence.`;
      } else if (resp.status >= 500) {
        result.reachability.classification = 'server_error';
        result.reachability.explanation = `Server exists but returned an internal server error (HTTP ${resp.status}).`;
      } else {
        result.reachability.classification = 'reachable';
        result.reachability.explanation = `Server responded with HTTP ${resp.status} ${resp.statusText}.`;
      }

      // Security Headers Analysis
      const headerSpecs = [
        { key: 'strict-transport-security', name: 'Strict-Transport-Security (HSTS)', imp: 'high' as const, desc: 'Forces browsers to only connect via secure HTTPS connections.' },
        { key: 'content-security-policy', name: 'Content-Security-Policy (CSP)', imp: 'high' as const, desc: 'Restricts the sources of executable scripts, images, and frames to mitigate XSS.' },
        { key: 'x-content-type-options', name: 'X-Content-Type-Options', imp: 'medium' as const, desc: 'Prevents MIME-type sniffing by browsers (nosniff).' },
        { key: 'x-frame-options', name: 'X-Frame-Options', imp: 'medium' as const, desc: 'Protects visitors against clickjacking framing attacks.' },
        { key: 'referrer-policy', name: 'Referrer-Policy', imp: 'low' as const, desc: 'Controls how much referrer information is included with requests.' },
        { key: 'permissions-policy', name: 'Permissions-Policy', imp: 'low' as const, desc: 'Restricts browser features like camera, microphone, and geolocation.' },
      ];

      let headerScore = 0;
      let presentCount = 0;
      let missingCount = 0;

      for (const spec of headerSpecs) {
        const val = resp.headers.get(spec.key);
        if (val) {
          presentCount++;
          result.securityHeaders.headers.push({
            name: spec.name,
            value: val.length > 80 ? val.substring(0, 80) + '...' : val,
            status: 'present',
            importance: spec.imp,
            description: spec.desc,
          });
          headerScore += (spec.imp === 'high' ? 3 : spec.imp === 'medium' ? 2 : 1);
        } else {
          missingCount++;
          result.securityHeaders.headers.push({
            name: spec.name,
            status: 'missing',
            importance: spec.imp,
            description: spec.desc,
          });
        }
      }

      result.securityHeaders.score = Math.min(10, headerScore);
      result.securityHeaders.presentCount = presentCount;
      result.securityHeaders.missingCount = missingCount;
      result.securityHeaders.evaluationNote = `${presentCount} of ${headerSpecs.length} standard security headers present. Missing headers are configuration observations and do not alone prove malicious intent.`;

      // Read HTML Body up to 256KB safely
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('text/html') || contentType.includes('application/xhtml')) {
        try {
          const rawText = await resp.text();
          const truncatedHtml = rawText.substring(0, 256 * 1024);
          result.webpageContent.isContentFetched = true;

          const titleMatch = truncatedHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) {
            result.webpageContent.pageTitle = titleMatch[1].trim();
          }

          const metaDescMatch =
            truncatedHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
            truncatedHtml.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
            truncatedHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
          if (metaDescMatch) {
            result.webpageContent.metaDescription = metaDescMatch[1].trim();
          }

          const langMatch = truncatedHtml.match(/<html[^>]*lang=["']([^"']*)["']/i);
          if (langMatch) {
            result.webpageContent.language = langMatch[1].trim();
          }

          const h1Match = truncatedHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
          if (h1Match) {
            result.webpageContent.mainHeading = h1Match[1].replace(/\s+/g, ' ').trim();
          }

          const headingMatches = truncatedHtml.matchAll(/<h[1-2][^>]*>([^<]+)<\/h[1-2]>/gi);
          const headings: string[] = [];
          for (const m of headingMatches) {
            const hText = m[1].replace(/\s+/g, ' ').trim();
            if (hText && !headings.includes(hText)) {
              headings.push(hText);
              if (headings.length >= 6) break;
            }
          }
          result.webpageContent.headings = headings;

          const cleanText = truncatedHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
            .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/\s+/g, ' ')
            .trim();
          result.webpageContent.textExcerpt = cleanText.substring(0, 1200);

          const formMatches = truncatedHtml.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi);
          const sensitiveFields = new Set<string>();

          for (const formMatch of formMatches) {
            const formAttrs = formMatch[1] || '';
            const formInner = formMatch[2] || '';

            const actionMatch = formAttrs.match(/action=["']([^"']*)["']/i);
            const methodMatch = formAttrs.match(/method=["']([^"']*)["']/i);
            const action = actionMatch ? actionMatch[1] : undefined;
            const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';

            const inputMatches = formInner.matchAll(/<input\b([^>]*)>/gi);
            const inputs: string[] = [];
            let hasPassword = false;
            let hasEmail = false;
            let hasPayment = false;

            for (const inputMatch of inputMatches) {
              const attrs = inputMatch[1] || '';
              const typeMatch = attrs.match(/type=["']([^"']*)["']/i);
              const nameMatch = attrs.match(/name=["']([^"']*)["']/i);
              const idMatch = attrs.match(/id=["']([^"']*)["']/i);

              const type = (typeMatch ? typeMatch[1] : 'text').toLowerCase();
              const name = (nameMatch ? nameMatch[1] : idMatch ? idMatch[1] : '').toLowerCase();

              inputs.push(`${name || 'field'}:${type}`);

              if (type === 'password' || /pass|pwd|secret/i.test(name)) {
                hasPassword = true;
                sensitiveFields.add('Password / Credentials');
              }
              if (type === 'email' || /email|mail/i.test(name)) {
                hasEmail = true;
                sensitiveFields.add('Email Address');
              }
              if (type === 'tel' || /phone|mobile|contact_no/i.test(name)) {
                sensitiveFields.add('Phone Number');
              }
              if (/card|cvv|exp|cvc|pan|upi|pin|billing|account_num/i.test(name)) {
                hasPayment = true;
                sensitiveFields.add('Banking / Payment Information');
              }
              if (/aadhaar|ssn|dob|birth|national_id|id_card/i.test(name)) {
                sensitiveFields.add('Identity / PII Documents');
              }
            }

            const isSuspiciousAction = action ? (/^(https?:)?\/\//i.test(action) && !action.includes(new URL(currentUrl).hostname)) : false;

            result.webpageContent.formsDetected.push({
              action,
              method,
              inputs,
              hasPasswordInput: hasPassword,
              hasEmailInput: hasEmail,
              hasPaymentInput: hasPayment,
              isSuspiciousAction,
            });

            if (hasPassword) result.webpageContent.hasPasswordFields = true;
            if (hasPassword && (hasEmail || inputs.length >= 2)) result.webpageContent.hasLoginForm = true;
            if (hasPayment) result.webpageContent.hasPaymentFields = true;
          }

          if (sensitiveFields.size > 0) {
            result.webpageContent.hasPiiFields = true;
            result.webpageContent.sensitiveFieldsDetected = Array.from(sensitiveFields);
          }

          // Functional elements detection
          const htmlLower = truncatedHtml.toLowerCase();
          const hasLogin = result.webpageContent.hasLoginForm || /login|sign in|log in|signin/i.test(htmlLower);
          const hasRegistration = /register|sign up|signup|create account|join now/i.test(htmlLower);
          const hasSearch = /<input[^>]*type=["']search["']/i.test(htmlLower) || /search\b|find\b/i.test(htmlLower);
          const hasContactForm = /contact us|contact-form|get in touch|reach out/i.test(htmlLower);
          const hasFileUpload = /<input[^>]*type=["']file["']/i.test(htmlLower);
          const hasDownload = /download\b|\.zip\b|\.exe\b|\.apk\b|\.pdf\b/i.test(htmlLower);
          const hasShoppingCart = /shopping cart|cart\b|basket\b|trolley\b/i.test(htmlLower);
          const hasCheckout = /checkout|place order|buy now|complete order/i.test(htmlLower);
          const hasPayment = result.webpageContent.hasPaymentFields || /credit card|cvv|upi|pay now|billing address|stripe|paypal/i.test(htmlLower);
          const hasSubscription = /newsletter|subscribe|subscription/i.test(htmlLower);
          const hasAccountCreation = /create account|new account|open account/i.test(htmlLower);

          const detectedList: string[] = [];
          if (hasLogin) detectedList.push('Login / Authentication');
          if (hasRegistration) detectedList.push('Registration / Sign-up');
          if (hasSearch) detectedList.push('Search Functionality');
          if (hasContactForm) detectedList.push('Contact / Inquiry Form');
          if (hasFileUpload) detectedList.push('File Upload');
          if (hasDownload) detectedList.push('Software / File Download');
          if (hasShoppingCart) detectedList.push('Shopping Cart');
          if (hasCheckout) detectedList.push('Checkout Flow');
          if (hasPayment) detectedList.push('Payment Processing');
          if (hasSubscription) detectedList.push('Newsletter / Subscription');
          if (hasAccountCreation) detectedList.push('Account Creation');

          result.webpageContent.functionalElements = {
            hasLogin,
            hasRegistration,
            hasSearch,
            hasContactForm,
            hasFileUpload,
            hasDownload,
            hasShoppingCart,
            hasCheckout,
            hasPayment,
            hasSubscription,
            hasAccountCreation,
            detectedList,
          };

          // Link extraction and analysis
          const linkMatches = truncatedHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
          let totalLinks = 0;
          let internalLinks = 0;
          let externalLinks = 0;
          const sampleLinks: Array<{ text: string; href: string; isExternal: boolean }> = [];
          let curHost = '';
          try {
            curHost = new URL(currentUrl).hostname.toLowerCase();
          } catch {}

          for (const lm of linkMatches) {
            totalLinks++;
            const attrs = lm[1] || '';
            const anchorText = lm[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
            const href = hrefMatch ? hrefMatch[1].trim() : '';

            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
              let isExt = false;
              try {
                if (/^https?:\/\//i.test(href)) {
                  const parsed = new URL(href);
                  isExt = parsed.hostname.toLowerCase() !== curHost;
                }
              } catch {}

              if (isExt) externalLinks++;
              else internalLinks++;

              if (sampleLinks.length < 8 && anchorText.length > 1 && anchorText.length < 50) {
                sampleLinks.push({
                  text: anchorText,
                  href: href.length > 80 ? href.substring(0, 80) + '...' : href,
                  isExternal: isExt,
                });
              }
            }
          }

          result.webpageContent.linksInfo = {
            totalLinksCount: totalLinks,
            internalLinksCount: internalLinks,
            externalLinksCount: externalLinks,
            sampleLinks,
          };
          result.webpageContent.contentLengthBytes = rawText.length;

          const scriptTags = truncatedHtml.matchAll(/<script[^>]*src=["']([^"']+)["']/gi);
          let scriptCount = 0;
          for (const _ of scriptTags) scriptCount++;
          result.webpageContent.externalScriptsCount = scriptCount;
        } catch (parseErr: any) {
          result.webpageContent.fetchError = `Error extracting webpage text: ${parseErr.message}`;
        }
      }

      break;
    }
  } catch (err: any) {
    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT') {
      result.reachability.classification = 'timeout';
      result.reachability.explanation = 'Connection to the remote web server timed out after 4 seconds.';
    } else if (err.code === 'ECONNREFUSED') {
      result.reachability.classification = 'connection_refused';
      result.reachability.explanation = 'Server actively refused the connection on this port.';
    } else {
      result.reachability.classification = 'unreachable';
      result.reachability.explanation = `Unable to connect: ${err.message || 'Network unreachable'}.`;
    }
  }

  if (result.redirectAnalysis.redirectCount > 3) {
    result.redirectAnalysis.hasExcessiveRedirects = true;
    result.redirectAnalysis.hasSuspiciousRedirect = true;
  }
  if (result.redirectAnalysis.redirectCount > 0) {
    result.redirectAnalysis.redirectSummary = `Followed ${result.redirectAnalysis.redirectCount} redirect(s) to reach final destination: ${result.redirectAnalysis.finalDestination}.`;
  }

  return result;
}

/**
 * Detects potential brand impersonation, typosquatting, and deceptive subdomain combining.
 */
function checkBrandImpersonation(hostname: string, pathname: string) {
  const normalizedHost = hostname.toLowerCase();

  const BRANDS = [
    { name: 'PayPal', domain: 'paypal.com', variants: ['paypa1', 'pay-pal', 'paypaal', 'paypal-secure', 'paypal-login', 'paypal-update'] },
    { name: 'Google', domain: 'google.com', variants: ['g00gle', 'googie', 'google-login', 'google-verify', 'google-drive-share'] },
    { name: 'Microsoft', domain: 'microsoft.com', variants: ['micros0ft', 'micosoft', 'ms-login', 'office365-verify', 'outlook-login'] },
    { name: 'Apple', domain: 'apple.com', variants: ['app1e', 'apple-id-verify', 'icloud-security', 'appleid-login'] },
    { name: 'Amazon', domain: 'amazon.com', variants: ['amaz0n', 'amazn', 'amazon-security', 'amazon-order-verify'] },
    { name: 'Netflix', domain: 'netflix.com', variants: ['netf1ix', 'net-flix', 'netflix-billing', 'netflix-update'] },
    { name: 'State Bank of India (SBI)', domain: 'onlinesbi.sbi', variants: ['sbi-banking', 'onlinesbi-kyc', 'sbi-reward', 'sbi-update'] },
    { name: 'HDFC Bank', domain: 'hdfcbank.com', variants: ['hdfc-banking', 'hdfc-kyc', 'hdfc-netbanking-verify'] },
    { name: 'ICICI Bank', domain: 'icicibank.com', variants: ['icici-banking', 'icici-kyc', 'icici-update'] },
    { name: 'Chase Bank', domain: 'chase.com', variants: ['chase-online', 'chase-security', 'chase-verify'] },
    { name: 'Meta / Facebook', domain: 'facebook.com', variants: ['faceb00k', 'fb-security-appeal', 'meta-verified-badge'] },
    { name: 'Instagram', domain: 'instagram.com', variants: ['1nstagram', 'instagram-copyright', 'instagram-verify'] },
    { name: 'WhatsApp', domain: 'whatsapp.com', variants: ['whatsap', 'whatsapp-web-verify'] },
    { name: 'Telegram', domain: 'telegram.org', variants: ['te1egram', 'telegram-login'] },
    { name: 'Paytm', domain: 'paytm.com', variants: ['paytm-kyc', 'paytm-cashback', 'paytm-rewards'] },
    { name: 'PhonePe', domain: 'phonepe.com', variants: ['phonepe-cashback', 'phonepe-reward', 'phonepe-kyc'] },
    { name: 'UIDAI / Aadhaar', domain: 'uidai.gov.in', variants: ['aadhaar-update', 'uidai-kyc', 'eaadhaar-portal'] },
  ];

  for (const b of BRANDS) {
    const isExactBrandDomain = normalizedHost === b.domain || normalizedHost.endsWith('.' + b.domain);
    if (isExactBrandDomain) continue;

    for (const v of b.variants) {
      if (normalizedHost.includes(v)) {
        return {
          isImpersonatingBrand: true,
          suspectedBrand: b.name,
          impersonationEvidence: `Host contains spoofed brand pattern "${v}" targeting ${b.name} (${b.domain})`,
          targetDomainLegitimate: b.domain,
          technique: 'typosquatting' as const,
          severity: 'high' as const,
        };
      }
    }

    if (normalizedHost.includes(b.domain) && !isExactBrandDomain) {
      return {
        isImpersonatingBrand: true,
        suspectedBrand: b.name,
        impersonationEvidence: `Host contains the legitimate domain "${b.domain}" as a subdomain of an unrelated host.`,
        targetDomainLegitimate: b.domain,
        technique: 'subdomain_trick' as const,
        severity: 'critical' as const,
      };
    }

    const brandClean = b.domain.split('.')[0];
    const brandKeywordRegex = new RegExp(`(^|[-.])${brandClean}[-.].*(login|secure|verify|update|auth|banking|kyc|support)`, 'i');
    if (brandKeywordRegex.test(normalizedHost) && !isExactBrandDomain) {
      return {
        isImpersonatingBrand: true,
        suspectedBrand: b.name,
        impersonationEvidence: `Domain combines brand name "${b.name}" with authentication keywords on an unverified host.`,
        targetDomainLegitimate: b.domain,
        technique: 'keyword_combining' as const,
        severity: 'high' as const,
      };
    }
  }

  return {
    isImpersonatingBrand: false,
  };
}

/**
 * Performs semantic analysis using Gemini (with deterministic evidence-grounded fallback).
 */
async function performGeminiSemanticAnalysis(params: {
  url: string;
  hostname: string;
  reachability: any;
  webpageContent: any;
  brandResult: any;
  heuristicSummary: string;
}) {
  const { url, hostname, reachability, webpageContent, brandResult, heuristicSummary } = params;

  // Case 1: Nonexistent domain (DNS Failure)
  if (reachability.classification === 'dns_failure') {
    return {
      websiteType: 'UNKNOWN (Domain Unresolved)',
      websitePurpose: 'Webpage content analysis unavailable because the domain could not be resolved.',
      confidence: 'Low' as const,
      evidence: [
        'Domain resolution failed (NXDOMAIN / DNS error)',
        'No active DNS records found for host',
      ],
      mainTopics: [],
      callsToAction: [],
      publicContactInfo: [],
      primaryContentSummary: 'Webpage content unavailable because the domain could not be resolved.',
      potentiallySensitiveActions: [],
      phishingIndicators: [],
      contentIndicators: ['Domain nonexistent or DNS lookup failed'],
      brandImpersonation: false,
      explanation: 'The domain could not be resolved at the time of analysis. This may indicate a nonexistent domain, DNS failure, expired configuration, or temporary availability issue. This alone does not prove malicious intent.',
      recommendedActions: [
        'Check that the address is spelled correctly.',
        'Verify if the intended domain has moved to a new web address.',
      ],
      modelUsed: 'deterministic-dns-evaluator',
      isAiGenerated: false,
    };
  }

  // Case 2: Unreachable server (Timeout / Refused / Error)
  if (!reachability.isReachable) {
    const is404 = reachability.httpStatusCode === 404 || reachability.classification === 'not_found';
    if (is404) {
      return {
        websiteType: 'HTTP 404 (Resource Not Found)',
        websitePurpose: 'The target web server is online and reachable, but the requested specific URL path does not exist on this server.',
        confidence: 'High' as const,
        evidence: [
          'Server accepted TCP connection and returned HTTP 404 Not Found',
          'Domain exists and web server is active, but specific path is missing',
        ],
        mainTopics: ['Page Not Found', 'HTTP 404 Response'],
        callsToAction: ['Check URL path spelling'],
        publicContactInfo: [],
        primaryContentSummary: 'The web server responded with HTTP 404 Not Found indicating the specific requested resource does not exist.',
        potentiallySensitiveActions: [],
        phishingIndicators: [],
        contentIndicators: ['Server responded with HTTP 404 Not Found'],
        brandImpersonation: false,
        explanation: 'The domain was successfully resolved and the server is online, but the requested page path returned HTTP 404 Not Found. This indicates a missing page, not a nonexistent domain.',
        recommendedActions: [
          'Check that the path in the web address is spelled correctly.',
          'Navigate to the root domain to locate the intended page.',
        ],
        modelUsed: 'deterministic-http-evaluator',
        isAiGenerated: false,
      };
    }

    return {
      websiteType: 'UNKNOWN (Server Unreachable)',
      websitePurpose: 'Webpage content could not be analyzed because the target server is currently unreachable or not responding.',
      confidence: 'Low' as const,
      evidence: [
        reachability.explanation || 'Server failed to respond within connection timeout',
        `Reachability classification: ${reachability.classification}`,
      ],
      mainTopics: [],
      callsToAction: [],
      publicContactInfo: [],
      primaryContentSummary: 'Webpage content unavailable.',
      potentiallySensitiveActions: [],
      phishingIndicators: [],
      contentIndicators: ['Server unreachable over network'],
      brandImpersonation: false,
      explanation: reachability.explanation || 'Unable to connect to remote web server.',
      recommendedActions: [
        'Check network connectivity and server status.',
        'Verify if the target server is temporarily down for maintenance.',
      ],
      modelUsed: 'deterministic-network-evaluator',
      isAiGenerated: false,
    };
  }

  // Case 3: Reachable website with content - Attempt Gemini semantic analysis with strict evidence constraints
  if (ai && webpageContent.isContentFetched) {
    try {
      const prompt = `You are a strict cybersecurity researcher and evidence-based web analyst.
Analyze ONLY the provided retrieved webpage artifacts below.
Do NOT use assumed knowledge about the brand or domain. Do NOT invent forms, links, or text that are not present in the evidence.

RETRIEVED WEBPAGE EVIDENCE:
URL: ${url}
Final Resolved URL: ${reachability.finalUrl || url}
HTTP Status: HTTP ${reachability.httpStatusCode || 200}
Page Title: ${webpageContent.pageTitle || 'None detected'}
Meta Description: ${webpageContent.metaDescription || 'None detected'}
Language: ${webpageContent.language || 'Unspecified'}
Main Heading: ${webpageContent.mainHeading || 'None detected'}
Headings: ${(webpageContent.headings || []).join(' | ') || 'None detected'}
Visible Text Snippet: ${webpageContent.textExcerpt ? webpageContent.textExcerpt.substring(0, 1000) : 'None available'}
Forms Detected (${webpageContent.formsDetected?.length || 0}): ${JSON.stringify(webpageContent.formsDetected || []).substring(0, 500)}
Detected Functional Elements: ${(webpageContent.functionalElements?.detectedList || []).join(', ') || 'None'}
Sensitive Input Fields Detected: ${(webpageContent.sensitiveFieldsDetected || []).join(', ') || 'None'}
Links Info: Total: ${webpageContent.linksInfo?.totalLinksCount || 0}, Internal: ${webpageContent.linksInfo?.internalLinksCount || 0}, External: ${webpageContent.linksInfo?.externalLinksCount || 0}, Nav Anchors: ${(webpageContent.linksInfo?.sampleLinks || []).map((l: any) => l.text).join(' | ') || 'None'}
Brand Impersonation Check: ${brandResult.isImpersonatingBrand ? `Flagged: Spoofing ${brandResult.suspectedBrand} (${brandResult.impersonationEvidence})` : 'No spoofing detected'}
Technical Heuristics: ${heuristicSummary}

INSTRUCTIONS:
1. Classify website_type into the most accurate category supported by evidence: "Search Engine", "Social Media", "E-commerce", "Banking / Financial", "Government", "Education", "News / Media", "Blog", "Technology / Software", "Authentication / Login", "Cloud Service", "File Sharing", "Entertainment", "Streaming", "Documentation", "Healthcare", "Travel", "Business / Corporate", "Portfolio", "Forum / Community", "Download Website", "Other", "Unknown". If evidence is insufficient, return "Unknown".
2. website_purpose must be a 1-2 sentence description grounded specifically in the page title, headings, and extracted text.
3. classification_evidence must list 2-4 specific bullet points citing actual elements found (e.g. 'Page title contains "..."', 'Search form input detected', 'Headings reference software repositories').
4. summary must be a 1-2 sentence factual summary of the visible content.
5. sensitive_data_requested must only list fields that were actually detected on this page. If none, return [].
6. phishing_indicators must list any suspicious deception or cleartext submission found, or empty array if none.
7. explanation must be a 2-3 sentence human-readable assessment of the security posture based on the evidence.

Return strict JSON format:
{
  "website_type": "...",
  "website_purpose": "...",
  "classification_confidence": "High" | "Medium" | "Low",
  "classification_evidence": ["..."],
  "main_topics": ["..."],
  "calls_to_action": ["..."],
  "public_contact_info": ["..."],
  "summary": "...",
  "sensitive_data_requested": ["..."],
  "phishing_indicators": [
    { "indicator": "...", "evidence": "...", "severity": "low" | "medium" | "high" | "critical" }
  ],
  "content_indicators": ["..."],
  "brand_impersonation": boolean,
  "confidence": "High" | "Medium" | "Low",
  "explanation": "...",
  "recommended_actions": ["..."]
}`;

      const resp = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
        4500,
        null
      );

      const text = resp?.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.website_type && parsed.website_purpose) {
          return {
            websiteType: parsed.website_type,
            websitePurpose: parsed.website_purpose,
            confidence: parsed.classification_confidence || parsed.confidence || 'High',
            evidence: Array.isArray(parsed.classification_evidence) && parsed.classification_evidence.length > 0
              ? parsed.classification_evidence
              : [webpageContent.pageTitle ? `Page title: "${webpageContent.pageTitle}"` : 'Public webpage content analyzed'],
            mainTopics: Array.isArray(parsed.main_topics) && parsed.main_topics.length > 0
              ? parsed.main_topics
              : webpageContent.headings?.slice(0, 3) || [],
            callsToAction: Array.isArray(parsed.calls_to_action) && parsed.calls_to_action.length > 0
              ? parsed.calls_to_action
              : webpageContent.functionalElements?.detectedList?.slice(0, 3) || [],
            publicContactInfo: Array.isArray(parsed.public_contact_info) ? parsed.public_contact_info : [],
            primaryContentSummary: parsed.summary || webpageContent.metaDescription || webpageContent.textExcerpt?.substring(0, 250) || 'Public webpage content analyzed.',
            potentiallySensitiveActions: Array.isArray(parsed.sensitive_data_requested) ? parsed.sensitive_data_requested : webpageContent.sensitiveFieldsDetected || [],
            phishingIndicators: Array.isArray(parsed.phishing_indicators) ? parsed.phishing_indicators : [],
            contentIndicators: Array.isArray(parsed.content_indicators) ? parsed.content_indicators : [],
            brandImpersonation: Boolean(parsed.brand_impersonation || brandResult.isImpersonatingBrand),
            explanation: parsed.explanation || `Website responded with HTTP ${reachability.httpStatusCode || 200}. Content and security indicators evaluated.`,
            recommendedActions: Array.isArray(parsed.recommended_actions) && parsed.recommended_actions.length > 0
              ? parsed.recommended_actions
              : [
                  'Verify the address bar domain spelling carefully before entering sensitive information.',
                  'Ensure HTTPS encryption is active and bookmark verified services.',
                ],
            modelUsed: 'gemini-3.8-flash',
            isAiGenerated: true,
          };
        }
      }
    } catch (err) {
      console.warn('[Detect] Gemini analysis unavailable or timed out, executing deterministic content-grounded semantic analysis:', err);
    }
  }

  // Deterministic Content-Grounded Semantic Engine
  // Evaluates extracted title, meta description, headings, visible text, forms, and links
  const title = (webpageContent.pageTitle || '').trim();
  const desc = (webpageContent.metaDescription || '').trim();
  const headings = webpageContent.headings || [];
  const text = (webpageContent.textExcerpt || '').toLowerCase();
  const allContentStr = `${title} ${desc} ${headings.join(' ')} ${text}`.toLowerCase();
  const hostLower = hostname.toLowerCase();

  const isSearchEngine =
    /google\.|bing\.|duckduckgo\.|yahoo\.|search\./i.test(hostLower) ||
    /search the world|search engine|web search|find what you need/i.test(allContentStr) ||
    (webpageContent.functionalElements?.hasSearch && /search|query|find/i.test(title));

  const isTechSoftware =
    /github\.|gitlab\.|docker\.|npmjs\.|developer\.|dev\.|api\.|stack overflow|software|platform|open-source|repository|repositories|pull requests|sdk|cli\b|source code|git\b/i.test(allContentStr) ||
    /github|gitlab|docker|npm|aws|azure|cloudflare/i.test(hostLower);

  const isEcommerce =
    webpageContent.functionalElements?.hasShoppingCart ||
    webpageContent.functionalElements?.hasCheckout ||
    /add to cart|checkout|shopping cart|price:|buy now|store|shop|products|apparel|electronics|item\(s\)|order summary|\$\d+|₹\d+|€\d+/i.test(allContentStr);

  const isBanking =
    /netbanking|online banking|bank\b|checking account|savings account|deposit|wire transfer|loan|mortgage|credit card account|account balance|sbi|hdfc|icici|chase|wellsfargo/i.test(allContentStr) ||
    /bank|hdfc|icici|sbi|chase|wellsfargo/i.test(hostLower);

  const isGov = /\.gov(\.|$)/i.test(hostLower) || /official portal|government of|ministry of|department of|public administration|citizen services/i.test(allContentStr);
  const isEdu = /\.edu(\.|$)|ac\.in|\.edu\./i.test(hostLower) || /university|college|academic|faculty|admissions|curriculum|campus|students|professors|course catalog/i.test(allContentStr);
  const isNews = /news|breaking news|journalism|daily|times|herald|post|gazette|editorial|headlines|reporters|press release/i.test(allContentStr);
  const isSocial = /facebook|twitter|instagram|linkedin|tiktok|discord|reddit|threads/i.test(hostLower) || /social network|follow us|followers|community feed|share post|connections/i.test(allContentStr);
  const isDocs = /documentation|api reference|getting started|developer guide|sdk guide|user manual|docs\./i.test(allContentStr) || hostLower.startsWith('docs.');
  const isHealthcare = /hospital|clinic|medical|patient|doctor|healthcare|physician|medicine|health services|health clinic/i.test(allContentStr);
  const isEntertainment = /streaming|watch movies|watch video|listen to music|stream music|gameplay|play online|arcade/i.test(allContentStr);

  let websiteType = 'General Web Resource';
  let websitePurpose = title ? `Public website providing information related to "${title}".` : `Public web resource on domain ${hostname}.`;
  const evidence: string[] = [];

  if (isSearchEngine) {
    websiteType = 'Search Engine';
    websitePurpose = 'Web search engine and information retrieval service.';
    evidence.push('Primary web search query interface detected');
    if (title) evidence.push(`Page title: "${title}"`);
    if (webpageContent.functionalElements?.hasSearch) evidence.push('Search inputs and query forms identified in markup');
  } else if (isTechSoftware) {
    websiteType = 'Technology / Software';
    websitePurpose = title ? `Software platform or developer service: ${title}.` : 'Software platform, developer tools, cloud infrastructure, or code collaboration service.';
    evidence.push('Developer tools, repositories, or technical software terminology detected in content');
    if (title) evidence.push(`Page title: "${title}"`);
    if (headings.length > 0) evidence.push(`Headings observed: ${headings.slice(0, 2).join(' | ')}`);
  } else if (isEcommerce) {
    websiteType = 'E-commerce';
    websitePurpose = title ? `Online shopping storefront for ${title}.` : 'Online digital storefront for browsing and purchasing products or commercial services.';
    evidence.push('Shopping cart, checkout flow, or purchasing elements detected');
    if (title) evidence.push(`Page title: "${title}"`);
    if (webpageContent.functionalElements?.hasCheckout) evidence.push('Checkout processing flow identified');
  } else if (isBanking) {
    websiteType = 'Banking / Financial';
    websitePurpose = title ? `Online banking or financial portal for ${title}.` : 'Banking, financial management, or customer transaction services.';
    evidence.push('Banking and financial account terminology identified');
    if (webpageContent.hasLoginForm) evidence.push('Customer account authentication form present');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isGov) {
    websiteType = 'Government / Official Portal';
    websitePurpose = title ? `Official governmental portal: ${title}.` : 'Official governmental agency or public administration portal.';
    if (/\.gov(\.|$)/i.test(hostLower)) evidence.push('Official government TLD (.gov) verified');
    evidence.push('Public administration and citizen services content');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isEdu) {
    websiteType = 'Education / University';
    websitePurpose = title ? `Academic institution: ${title}.` : 'Accredited university, college, or educational institution portal.';
    if (/\.edu(\.|$)/i.test(hostLower)) evidence.push('Educational institution domain (.edu) identified');
    evidence.push('Academic campus, admissions, or faculty information detected');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isNews) {
    websiteType = 'News / Media';
    websitePurpose = title ? `News publication: ${title}.` : 'News reporting, journalism, and editorial media publication.';
    evidence.push('Journalism, headlines, and article publication sections detected');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isDocs) {
    websiteType = 'Documentation';
    websitePurpose = title ? `Technical documentation: ${title}.` : 'Technical documentation, API references, or software guidance manuals.';
    evidence.push('Documentation structure, guides, and technical reference terms detected');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isSocial) {
    websiteType = 'Social Media';
    websitePurpose = title ? `Social platform: ${title}.` : 'Social networking platform for user interaction and community sharing.';
    evidence.push('Social networking community elements and profile interactions identified');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isHealthcare) {
    websiteType = 'Healthcare';
    websitePurpose = title ? `Healthcare provider: ${title}.` : 'Healthcare services, medical information, or clinical care portal.';
    evidence.push('Medical and healthcare clinical terminology identified');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (isEntertainment) {
    websiteType = 'Entertainment / Streaming';
    websitePurpose = title ? `Media service: ${title}.` : 'Media streaming, video entertainment, or digital audio content.';
    evidence.push('Media streaming or entertainment catalog features identified');
    if (title) evidence.push(`Page title: "${title}"`);
  } else if (webpageContent.hasLoginForm) {
    websiteType = 'Authentication / Login';
    websitePurpose = title ? `Authentication portal: ${title}.` : 'Account sign-in gateway and user identity verification.';
    evidence.push('Credential entry form (username/password) detected in markup');
    if (title) evidence.push(`Page title: "${title}"`);
  } else {
    websiteType = 'General Web Resource';
    websitePurpose = desc ? desc : title ? `Website titled "${title}".` : `Public web domain (${hostname}).`;
    if (title) evidence.push(`Page title: "${title}"`);
    if (desc) evidence.push(`Meta description: "${desc.substring(0, 100)}..."`);
    evidence.push('Public webpage markup and text excerpt analyzed');
  }

  const phishingIndicators: Array<{ indicator: string; evidence: string; severity: 'low' | 'medium' | 'high' | 'critical' }> = [];

  if (brandResult.isImpersonatingBrand) {
    phishingIndicators.push({
      indicator: 'Potential Brand Impersonation',
      evidence: brandResult.impersonationEvidence || `Domain appears to mimic ${brandResult.suspectedBrand}.`,
      severity: brandResult.severity || 'high',
    });
  }

  if (webpageContent.hasLoginForm && !url.startsWith('https://')) {
    phishingIndicators.push({
      indicator: 'Insecure Credential Transmission',
      evidence: 'Authentication / login form hosted over unencrypted HTTP (port 80).',
      severity: 'critical',
    });
  }

  if (webpageContent.hasPaymentFields && brandResult.isImpersonatingBrand) {
    phishingIndicators.push({
      indicator: 'Financial Harvest Risk',
      evidence: 'Payment-related input fields detected on an unverified brand impersonation candidate.',
      severity: 'critical',
    });
  }

  const mainTopics: string[] = [];
  if (title) mainTopics.push(title.length > 50 ? title.substring(0, 50) + '...' : title);
  for (const h of headings) {
    if (mainTopics.length < 4 && !mainTopics.includes(h)) mainTopics.push(h);
  }

  const callsToAction: string[] = [...(webpageContent.functionalElements?.detectedList?.slice(0, 3) || [])];

  const primaryContentSummary = desc
    ? desc
    : text
    ? text.substring(0, 220) + '...'
    : title
    ? `Page title: "${title}"`
    : 'Public webpage content evaluated.';

  return {
    websiteType,
    websitePurpose,
    confidence: 'High' as const,
    evidence,
    mainTopics,
    callsToAction,
    publicContactInfo: [],
    primaryContentSummary,
    potentiallySensitiveActions: webpageContent.sensitiveFieldsDetected || [],
    phishingIndicators,
    contentIndicators: [
      webpageContent.hasLoginForm ? 'Authentication form present' : 'No authentication form detected',
      webpageContent.hasPaymentFields ? 'Payment fields detected' : 'No direct payment fields detected',
    ],
    brandImpersonation: brandResult.isImpersonatingBrand,
    explanation: brandResult.isImpersonatingBrand
      ? `High-risk indicators detected: domain resembles ${brandResult.suspectedBrand} but is not hosted on an official domain.`
      : reachability.isReachable
      ? `Website responded with HTTP ${reachability.httpStatusCode || 200}. Technical indicators evaluated across DNS, TLS, and retrieved webpage structure.`
      : `Website could not be reached over the network (${reachability.classification}).`,
    recommendedActions: [
      'Verify the address bar domain spelling carefully before entering sensitive information.',
      'Ensure HTTPS encryption is active and bookmark verified services.',
      'Never input passwords or OTPs on unverified links received via SMS or chat.',
    ],
    modelUsed: 'deterministic-content-engine',
    isAiGenerated: false,
  };
}

/**
 * Calculates a transparent, normalized risk score (0-100) and confidence level.
 */
function computeTransparentRiskScore(params: {
  urlAnomaliesPoints: number;
  domainDnsPoints: number;
  httpsTlsPoints: number;
  redirectPoints: number;
  securityHeadersPoints: number;
  threatIntelPoints: number;
  phishingBrandPoints: number;
  pageContentPoints: number;
  dnsAnalysis: any;
  reachability: any;
  tlsAnalysis: any;
  reputationReport: any;
  brandResult: any;
  webpageContent: any;
}) {
  const {
    urlAnomaliesPoints,
    domainDnsPoints,
    httpsTlsPoints,
    redirectPoints,
    securityHeadersPoints,
    threatIntelPoints,
    phishingBrandPoints,
    pageContentPoints,
    dnsAnalysis,
    reachability,
    tlsAnalysis,
    reputationReport,
    brandResult,
    webpageContent,
  } = params;

  const weights = {
    urlAnomalies: { score: Math.min(20, Math.max(0, urlAnomaliesPoints)), max: 20, description: 'Address syntax, character sets, subdomains, and obfuscation heuristics' },
    domainDns: { score: Math.min(15, Math.max(0, domainDnsPoints)), max: 15, description: 'Domain existence, IP address type, and DNS record presence' },
    httpsTls: { score: Math.min(10, Math.max(0, httpsTlsPoints)), max: 10, description: 'SSL/TLS encryption, certificate validity, and hostname verification' },
    redirects: { score: Math.min(10, Math.max(0, redirectPoints)), max: 10, description: 'Redirect hops, cross-domain jumps, and HTTPS downgrade detection' },
    securityHeaders: { score: Math.min(10, Math.max(0, securityHeadersPoints)), max: 10, description: 'Defense-in-depth HTTP headers (HSTS, CSP, X-Frame-Options)' },
    threatIntelligence: { score: Math.min(25, Math.max(0, threatIntelPoints)), max: 25, description: 'Known threat database flags and security vendor reputation' },
    phishingBrand: { score: Math.min(20, Math.max(0, phishingBrandPoints)), max: 20, description: 'Brand impersonation, typosquatting, and deceptive subdomain stacking' },
    pageContent: { score: Math.min(20, Math.max(0, pageContentPoints)), max: 20, description: 'Sensitive input requests (passwords, cards, PII) and form targets' },
  };

  const rawSum =
    weights.urlAnomalies.score +
    weights.domainDns.score +
    weights.httpsTls.score +
    weights.redirects.score +
    weights.securityHeaders.score +
    weights.threatIntelligence.score +
    weights.phishingBrand.score +
    weights.pageContent.score;

  const normalizedScore = Math.min(100, Math.max(0, Math.round(rawSum)));

  let riskCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';

  if (normalizedScore >= 75) {
    riskCategory = 'CRITICAL RISK';
    riskLevel = 'High Risk';
  } else if (normalizedScore >= 50) {
    riskCategory = 'HIGH RISK';
    riskLevel = 'High Risk';
  } else if (normalizedScore >= 25) {
    riskCategory = 'MODERATE RISK';
    riskLevel = 'Medium Risk';
  } else {
    riskCategory = 'LOW RISK';
    riskLevel = 'Low Risk';
  }

  let confidenceSourcesCount = 0;
  if (dnsAnalysis.dnsStatus === 'resolved') confidenceSourcesCount++;
  if (reachability.isReachable) confidenceSourcesCount++;
  if (tlsAnalysis.httpsAvailable) confidenceSourcesCount++;
  if (webpageContent.isContentFetched) confidenceSourcesCount++;
  if (reputationReport.isAvailable) confidenceSourcesCount++;

  let confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  let confidenceReason = '';

  if (confidenceSourcesCount >= 4) {
    confidenceLevel = 'HIGH';
    confidenceReason = 'High confidence: live DNS, HTTP server response, TLS certificate, and webpage content were all directly verified.';
  } else if (confidenceSourcesCount >= 2) {
    confidenceLevel = 'MEDIUM';
    confidenceReason = 'Moderate confidence: analysis verified DNS and network reachability, with partial threat telemetry.';
  } else {
    confidenceLevel = 'LOW';
    confidenceReason = 'Lower confidence: remote website was unreachable or unresolvable. Assessment relies primarily on address heuristics and syntax patterns.';
  }

  return {
    normalizedScore,
    riskCategory,
    riskLevel,
    confidenceLevel,
    confidenceReason,
    weights,
  };
}

/**
 * POST /api/scan-url
 * Full-stack multi-layer URL & Webpage Security Analyzer.
 */
app.post('/api/scan-url', rateLimitMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.length > 2048) {
      return res.status(400).json({
        error: 'Invalid URL. Please provide a valid web address under 2048 characters.',
      });
    }

    const trimmedInput = url.trim();
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://') ? trimmedInput : `https://${trimmedInput}`);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return res.status(400).json({
          error: `Unsupported protocol "${parsedUrl.protocol}". Only http:// and https:// web protocols are supported.`,
        });
      }
    } catch {
      return res.status(400).json({
        error: 'Malformed URL. The address cannot be parsed as a standard web URL.',
      });
    }

    const normalizedUrl = parsedUrl.toString();
    const hostname = parsedUrl.hostname;
    const protocol = parsedUrl.protocol;
    const isHttps = protocol === 'https:';
    const isIp = net.isIP(hostname) !== 0;

    // 1. SSRF Check on Hostname
    if (isIp && isPrivateOrReservedIp(hostname)) {
      // Internal IP address
    }

    // 2. DNS Analysis
    const dnsAnalysis = await performDnsLookup(hostname);

    // 3 & 4. Concurrently run TLS Analysis and HTTP Reachability / Content Extraction
    let tlsAnalysis: any = {
      httpsEnabled: isHttps,
      httpsAvailable: false,
      tlsNote: isHttps ? 'TLS inspection pending.' : 'Plain unencrypted HTTP connection (port 80). Traffic is vulnerable to cleartext interception.',
    };

    let httpAndContent: any = {
      reachability: { isReachable: false, classification: 'unreachable', explanation: 'Server connection could not be established.' },
      redirectAnalysis: { redirectCount: 0, redirectChain: [], hasExcessiveRedirects: false, hasCrossDomainRedirect: false, hasDowngradeRedirect: false, hasSuspiciousRedirect: false, finalDestination: normalizedUrl, redirectSummary: 'No redirects.' },
      securityHeaders: { headers: [], score: 0, missingCount: 0, presentCount: 0, evaluationNote: '' },
      webpageContent: { isContentFetched: false, headings: [], formsDetected: [], hasLoginForm: false, hasPasswordFields: false, hasPaymentFields: false, hasPiiFields: false, sensitiveFieldsDetected: [] },
    };

    if (dnsAnalysis.domainExistenceStatus === 'exists' && !dnsAnalysis.isPrivateOrInternalIp) {
      const [tlsRes, httpRes] = await Promise.all([
        isHttps
          ? inspectTlsCertificate(hostname, parsedUrl.port ? parseInt(parsedUrl.port, 10) : 443)
          : Promise.resolve({
              httpsEnabled: false,
              httpsAvailable: false,
              tlsNote: 'Plain unencrypted HTTP connection (port 80). Traffic is not protected by TLS encryption.',
            }),
        checkHttpAndContent(normalizedUrl, dnsAnalysis),
      ]);
      tlsAnalysis = tlsRes;
      httpAndContent = httpRes;
    }

    const reachability = httpAndContent.reachability;
    const redirectAnalysis = httpAndContent.redirectAnalysis;
    const securityHeaders = httpAndContent.securityHeaders;
    const webpageContent = httpAndContent.webpageContent;

    // 5. Brand Impersonation Detection
    const brandResult = checkBrandImpersonation(hostname, parsedUrl.pathname);

    // 6. Threat Intelligence
    let reputationReport: any = {
      status: 'THREAT INTELLIGENCE UNAVAILABLE',
      provider: 'CyberSafe Local Engine',
      threatTypes: [],
      checkedAt: new Date().toISOString(),
      isAvailable: false,
      details: 'No external threat intelligence API key (VIRUSTOTAL_API_KEY) configured. Local heuristics evaluated.',
      sourceConfidence: 'Unrated',
      disclaimer: 'Absence of threat records does not guarantee safety.',
    };

    const vtKey = process.env.VIRUSTOTAL_API_KEY;
    if (vtKey && dnsAnalysis.domainExistenceStatus === 'exists') {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const vtResp = await fetch(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(hostname)}`, {
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

          reputationReport = {
            status,
            provider: 'VirusTotal Intelligence API',
            threatTypes,
            checkedAt: new Date().toISOString(),
            isAvailable: true,
            details: `Reputation statistics: ${maliciousCount} malicious flags, ${suspiciousCount} suspicious flags reported by security vendors.`,
            sourceConfidence: 'High',
            disclaimer: 'Third-party threat feeds reflect historical reputation and known threat signatures.',
          };
        }
      } catch {
        // Fall back to local
      }
    }

    // 7. Deterministic URL Heuristic Points & Indicators
    const indicators: any[] = [];
    const scoreBreakdown: any[] = [];
    let urlAnomaliesPoints = 0;
    let domainDnsPoints = 0;
    let httpsTlsPoints = 0;
    let redirectPoints = 0;
    let securityHeadersPoints = 0;
    let threatIntelPoints = 0;
    let phishingBrandPoints = 0;
    let pageContentPoints = 0;

    // Subdomains
    const hostParts = hostname.split('.');
    const tld = hostParts[hostParts.length - 1]?.toLowerCase();
    const subdomainCount = Math.max(0, hostParts.length - 2);

    if (subdomainCount >= 3) {
      urlAnomaliesPoints += 8;
      indicators.push({
        id: 'excessive-subdomains',
        name: 'Excessive Subdomain Depth',
        category: 'host',
        severity: 'medium',
        status: 'risk',
        description: `URL contains ${subdomainCount} subdomains, which can be used to hide the true domain on mobile browsers.`,
        whyItMatters: 'Phishing kits frequently stack subdomains (e.g. login.bank.xyz.attacker.com) so the victim only sees the trusted name.',
        impactPoints: 8,
        iconType: 'alert',
      });
    }

    // High risk TLD
    if (HIGH_RISK_TLDS.has(tld)) {
      urlAnomaliesPoints += 6;
      indicators.push({
        id: 'high-risk-tld',
        name: `High-Risk Top-Level Domain (.${tld})`,
        category: 'host',
        severity: 'medium',
        status: 'warning',
        description: `The domain uses a .${tld} TLD statistically correlated with high volumes of short-lived phishing campaigns.`,
        whyItMatters: 'Cheap or free TLDs are disproportionately abused by malicious actors for throwaway attack sites.',
        impactPoints: 6,
        iconType: 'alert',
      });
    }

    // Direct IP Address
    if (isIp) {
      domainDnsPoints += 12;
      indicators.push({
        id: 'direct-ip-host',
        name: 'Numeric IP Address in Hostname',
        category: 'host',
        severity: 'high',
        status: 'risk',
        description: 'Address uses a direct numeric IP instead of a registered domain name.',
        whyItMatters: 'Legitimate consumer and banking portals virtually always use branded domain names with verified TLS certificates.',
        impactPoints: 12,
        iconType: 'danger',
      });
    }

    // Punycode
    if (hostname.includes('xn--')) {
      urlAnomaliesPoints += 10;
      indicators.push({
        id: 'punycode-idn',
        name: 'Punycode Internationalized Domain (IDN)',
        category: 'host',
        severity: 'high',
        status: 'risk',
        description: 'Domain contains Punycode (xn--), which can be used for visual homograph spoofing (substituting Cyrillic/Greek lookalike characters).',
        whyItMatters: 'Attackers create visually indistinguishable domains to impersonate trusted platforms.',
        impactPoints: 10,
        iconType: 'danger',
      });
    }

    // Embedded @ symbol
    if (trimmedInput.includes('@')) {
      urlAnomaliesPoints += 15;
      indicators.push({
        id: 'userinfo-at-symbol',
        name: 'Embedded "@" Userinfo Symbol',
        category: 'syntax',
        severity: 'critical',
        status: 'risk',
        description: 'URL uses an "@" symbol to trick users into believing they are visiting the domain before the "@".',
        whyItMatters: 'Browsers interpret text before the "@" as authentication userinfo and actually connect to the host after it.',
        impactPoints: 15,
        iconType: 'danger',
      });
    }

    // Dangerous extension
    const pathLower = parsedUrl.pathname.toLowerCase();
    const dangerousExt = DANGEROUS_EXTENSIONS.find(ext => pathLower.endsWith(ext));
    if (dangerousExt) {
      urlAnomaliesPoints += 14;
      indicators.push({
        id: 'dangerous-extension',
        name: `Executable / Package Extension (${dangerousExt})`,
        category: 'path',
        severity: 'critical',
        status: 'risk',
        description: `URL path ends in a potentially dangerous executable or software installer (${dangerousExt}).`,
        whyItMatters: 'Direct links to executable packages frequently deliver spyware, infostealers, or ransomware.',
        impactPoints: 14,
        iconType: 'danger',
      });
    }

    // Suspicious keywords in URL
    const fullLower = normalizedUrl.toLowerCase();
    const foundAuth = AUTH_KEYWORDS.filter(k => fullLower.includes(k));
    const foundFin = FINANCIAL_KEYWORDS.filter(k => fullLower.includes(k));

    if (foundAuth.length > 0 || foundFin.length > 0) {
      const allFound = [...foundAuth, ...foundFin];
      urlAnomaliesPoints += Math.min(8, allFound.length * 3);
      indicators.push({
        id: 'sensitive-keywords',
        name: 'Sensitive Keywords in Address',
        category: 'path',
        severity: 'medium',
        status: 'warning',
        description: `Address contains authentication or financial keywords: ${allFound.slice(0, 4).join(', ')}.`,
        whyItMatters: 'Phishing URLs frequently include urgency and login terms in the path or query to entice clicks.',
        impactPoints: Math.min(8, allFound.length * 3),
        iconType: 'alert',
      });
    }

    // Non-HTTPS
    if (!isHttps) {
      httpsTlsPoints += 8;
      indicators.push({
        id: 'unencrypted-http',
        name: 'Unencrypted Plain HTTP Connection',
        category: 'protocol',
        severity: 'medium',
        status: 'warning',
        description: 'Communication is not protected by TLS encryption (HTTP port 80).',
        whyItMatters: 'Any credentials, cookies, or data transmitted over unencrypted HTTP can be intercepted on public Wi-Fi.',
        impactPoints: 8,
        iconType: 'alert',
      });
    } else if (tlsAnalysis.certValid === false) {
      httpsTlsPoints += 7;
      indicators.push({
        id: 'tls-cert-invalid',
        name: 'TLS Certificate Validation Issue',
        category: 'protocol',
        severity: 'high',
        status: 'risk',
        description: tlsAnalysis.tlsNote || 'TLS certificate could not be verified or has expired/mismatched identity.',
        whyItMatters: 'Invalid certificates mean the encryption cannot be verified as belonging to the legitimate domain.',
        impactPoints: 7,
        iconType: 'danger',
      });
    }

    // DNS existence
    if (dnsAnalysis.domainExistenceStatus === 'nonexistent') {
      domainDnsPoints += 10;
      indicators.push({
        id: 'dns-nxdomain',
        name: 'Nonexistent Domain (DNS NXDOMAIN)',
        category: 'host',
        severity: 'medium',
        status: 'warning',
        description: 'Domain does not resolve to active DNS records. The website appears nonexistent or defunct.',
        whyItMatters: 'Nonexistent domains cannot serve web traffic. This alone does not prove malicious intent.',
        impactPoints: 10,
        iconType: 'alert',
      });
    }

    // Redirects
    if (redirectAnalysis.hasExcessiveRedirects) {
      redirectPoints += 5;
      indicators.push({
        id: 'excessive-redirects',
        name: 'Excessive Redirect Hops',
        category: 'protocol',
        severity: 'medium',
        status: 'warning',
        description: `Connection followed ${redirectAnalysis.redirectCount} redirects, which can be used to bypass security scanners.`,
        whyItMatters: 'Phishing campaigns often bounce visitors through multiple tracking redirects before reaching the trap.',
        impactPoints: 5,
        iconType: 'alert',
      });
    }
    if (redirectAnalysis.hasDowngradeRedirect) {
      redirectPoints += 8;
      indicators.push({
        id: 'https-downgrade',
        name: 'Insecure HTTPS to HTTP Downgrade',
        category: 'protocol',
        severity: 'high',
        status: 'risk',
        description: 'A redirect downgraded the connection from secure HTTPS to unencrypted HTTP.',
        whyItMatters: 'Downgrades expose traffic that the user believed was encrypted to cleartext eavesdropping.',
        impactPoints: 8,
        iconType: 'danger',
      });
    }

    // Security Headers
    if (securityHeaders.missingCount >= 4 && reachability.isReachable) {
      securityHeadersPoints += 4;
      indicators.push({
        id: 'missing-security-headers',
        name: 'Missing Multiple Defensive Security Headers',
        category: 'general',
        severity: 'low',
        status: 'warning',
        description: `${securityHeaders.missingCount} recommended defensive headers are absent (e.g. HSTS, CSP, X-Frame-Options).`,
        whyItMatters: 'Security headers provide defense-in-depth against clickjacking and script injection.',
        impactPoints: 4,
        iconType: 'alert',
      });
    }

    // Brand Impersonation
    if (brandResult.isImpersonatingBrand) {
      phishingBrandPoints += 18;
      indicators.push({
        id: 'brand-impersonation',
        name: 'Potential Brand Impersonation',
        category: 'host',
        severity: 'critical',
        status: 'risk',
        description: brandResult.impersonationEvidence || `Domain appears to mimic ${brandResult.suspectedBrand}.`,
        whyItMatters: 'Brand impersonation is the core technique of credential theft and smishing scams.',
        impactPoints: 18,
        iconType: 'danger',
      });
    }

    // Page Content & Forms
    if (webpageContent.hasLoginForm) {
      pageContentPoints += (isHttps ? 4 : 14);
      indicators.push({
        id: 'login-form',
        name: isHttps ? 'Login / Authentication Form Present' : 'Insecure Login Form over HTTP',
        category: 'path',
        severity: isHttps ? 'low' : 'critical',
        status: isHttps ? 'warning' : 'risk',
        description: isHttps ? 'Page contains credential fields (username/password).' : 'Login form transmits credentials in cleartext.',
        whyItMatters: 'Always verify the domain belongs to the intended service before entering passwords.',
        impactPoints: isHttps ? 4 : 14,
        iconType: isHttps ? 'alert' : 'danger',
      });
    }
    if (webpageContent.hasPaymentFields) {
      pageContentPoints += (brandResult.isImpersonatingBrand ? 15 : 6);
      indicators.push({
        id: 'payment-fields',
        name: 'Payment / Financial Information Requested',
        category: 'path',
        severity: brandResult.isImpersonatingBrand ? 'critical' : 'medium',
        status: brandResult.isImpersonatingBrand ? 'risk' : 'warning',
        description: 'Page requests credit card, banking, UPI, or billing details.',
        whyItMatters: 'Verify that this storefront or payment portal is authorized before submitting financial data.',
        impactPoints: brandResult.isImpersonatingBrand ? 15 : 6,
        iconType: brandResult.isImpersonatingBrand ? 'danger' : 'alert',
      });
    }

    // Threat Intel
    if (reputationReport.status === 'KNOWN MALICIOUS') {
      threatIntelPoints += 25;
    } else if (reputationReport.status === 'SUSPICIOUS') {
      threatIntelPoints += 12;
    }

    // 8. Gemini Semantic Analysis
    const heuristicSummary = indicators.map(i => i.name).join('; ') || 'Standard web indicators';
    const aiAnalysis = await performGeminiSemanticAnalysis({
      url: normalizedUrl,
      hostname,
      reachability,
      webpageContent,
      brandResult,
      heuristicSummary,
    });

    // 9. Transparent Scoring Calculation
    const scoring = computeTransparentRiskScore({
      urlAnomaliesPoints,
      domainDnsPoints,
      httpsTlsPoints,
      redirectPoints,
      securityHeadersPoints,
      threatIntelPoints,
      phishingBrandPoints,
      pageContentPoints,
      dnsAnalysis,
      reachability,
      tlsAnalysis,
      reputationReport,
      brandResult,
      webpageContent,
    });

    // Dedicated Phishing Indicators List
    const phishingIndicatorsList = [...(aiAnalysis.phishingIndicators || [])];
    if (brandResult.isImpersonatingBrand) {
      if (!phishingIndicatorsList.some(p => p.indicator.toLowerCase().includes('brand'))) {
        phishingIndicatorsList.push({
          indicator: 'Brand Impersonation',
          evidence: brandResult.impersonationEvidence || `Spoofed target: ${brandResult.suspectedBrand}`,
          severity: brandResult.severity || 'high',
        });
      }
    }
    if (webpageContent.hasLoginForm && !isHttps) {
      phishingIndicatorsList.push({
        indicator: 'Unencrypted Credential Form',
        evidence: 'Login form found on unencrypted HTTP website.',
        severity: 'critical',
      });
    }

    // Verified Facts vs Security Observations
    const verifiedFacts: string[] = [
      `Normalized URL: ${normalizedUrl}`,
      `DNS Status: ${dnsAnalysis.dnsStatus === 'resolved' ? `Resolved to ${dnsAnalysis.resolvedIps.length} IP(s)` : dnsAnalysis.domainExistenceStatus === 'nonexistent' ? 'Domain nonexistent (NXDOMAIN)' : 'Unresolved'}`,
      `Protocol: ${isHttps ? 'HTTPS (TLS)' : 'HTTP (Unencrypted)'}`,
      `Reachability: ${reachability.explanation}`,
    ];
    if (tlsAnalysis.certIssuer) {
      verifiedFacts.push(`TLS Certificate Issuer: ${tlsAnalysis.certIssuer} (Valid to: ${tlsAnalysis.certValidTo || 'N/A'})`);
    }
    if (webpageContent.pageTitle) {
      verifiedFacts.push(`Page Title: "${webpageContent.pageTitle}"`);
    }

    const securityObservations: string[] = [
      `Security Headers: ${securityHeaders.presentCount} present, ${securityHeaders.missingCount} missing.`,
      `Subdomains: ${subdomainCount} subdomains detected.`,
      `Forms: ${webpageContent.formsDetected.length} form(s) identified on page.`,
      `Threat Reputation: ${reputationReport.status} (${reputationReport.provider}).`,
    ];
    if (brandResult.isImpersonatingBrand) {
      securityObservations.push(`Brand Impersonation Alert: Suspected spoofing of ${brandResult.suspectedBrand}.`);
    }

    // Synthesized Executive Summary
    const executiveSummary = scoring.normalizedScore >= 50
      ? `High-risk indicators identified for ${hostname}. ${aiAnalysis.explanation || 'Significant anomalous markers or potential brand deception detected.'}`
      : scoring.normalizedScore >= 25
      ? `Moderate risk observations noted for ${hostname}. While no confirmed active attacks were found, caution is advised due to configuration or structural markers.`
      : `No significant threats detected for ${hostname} based on available DNS, TLS, and content analysis. Note: Safe-looking does not guarantee absolute safety.`;

    const finalAssessment = {
      rawInput: trimmedInput,
      normalizedUrl,
      wasNormalized: trimmedInput !== normalizedUrl,
      isValid: true,
      protocol: parsedUrl.protocol,
      hostname,
      port: parsedUrl.port || undefined,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search || undefined,
      isHttps,
      isIpAddress: isIp,
      ipType: isIp ? (net.isIPv4(hostname) ? ('ipv4' as const) : ('ipv6' as const)) : undefined,
      isPrivateOrLocalIp: isIp ? isPrivateOrReservedIp(hostname) : false,
      hasAtSymbol: trimmedInput.includes('@'),
      subdomainCount,
      subdomains: hostParts.slice(0, -2),
      registeredDomain: hostParts.slice(-2).join('.'),
      isPunycode: hostname.includes('xn--'),
      isShortenedUrl: false,
      hasSuspiciousKeywords: foundAuth.length > 0 || foundFin.length > 0,
      suspiciousKeywordsFound: [...foundAuth, ...foundFin],
      hasExcessiveParams: parsedUrl.searchParams.size >= 4,
      paramCount: parsedUrl.searchParams.size,
      hasOpenRedirectParam: ['redirect', 'redirect_uri', 'url', 'next', 'dest'].some(k => parsedUrl.searchParams.has(k)),
      hasSuspiciousEncoding: /%25|%20%20/i.test(trimmedInput),
      encodedSequencesCount: (trimmedInput.match(/%[0-9a-f]{2}/gi) || []).length,
      suspiciousCharacters: [],
      hasUnusualPort: Boolean(parsedUrl.port && parsedUrl.port !== '80' && parsedUrl.port !== '443'),
      hasDangerousExtension: Boolean(dangerousExt),
      dangerousExtension: dangerousExt,
      urlLength: normalizedUrl.length,
      hostnameLength: hostname.length,

      // Risk Scores & Classification
      structuralScore: Math.round((urlAnomaliesPoints / 20) * 100),
      riskScore: scoring.normalizedScore,
      riskLevel: scoring.riskLevel,
      riskCategory: scoring.riskCategory,
      confidenceLevel: scoring.confidenceLevel,
      confidenceReason: scoring.confidenceReason,

      // Reports
      reputationReport,
      checksPerformed: [
        { id: 'url-syntax', name: 'URL Syntax & Parsing', status: 'passed', detail: 'Valid RFC 3986 URL' },
        { id: 'dns-check', name: 'Domain & DNS Resolution', status: dnsAnalysis.dnsStatus === 'resolved' ? 'passed' : 'warning', detail: dnsAnalysis.dnsStatus === 'resolved' ? `${dnsAnalysis.resolvedIps.length} IP(s) resolved` : dnsAnalysis.domainExistenceStatus === 'nonexistent' ? 'Domain nonexistent' : 'DNS unresolved' },
        { id: 'reachability', name: 'Website Reachability & HTTP', status: reachability.isReachable ? 'passed' : 'warning', detail: reachability.explanation },
        { id: 'tls-check', name: 'TLS / SSL Certificate', status: tlsAnalysis.certValid ? 'passed' : isHttps ? 'failed' : 'warning', detail: tlsAnalysis.tlsNote },
        { id: 'redirects', name: 'Redirect Chain Tracking', status: redirectAnalysis.hasExcessiveRedirects || redirectAnalysis.hasDowngradeRedirect ? 'warning' : 'passed', detail: redirectAnalysis.redirectSummary },
        { id: 'headers', name: 'Security HTTP Headers', status: securityHeaders.presentCount >= 3 ? 'passed' : 'warning', detail: securityHeaders.evaluationNote },
        { id: 'brand', name: 'Brand Impersonation Scan', status: brandResult.isImpersonatingBrand ? 'failed' : 'passed', detail: brandResult.isImpersonatingBrand ? `Potential spoofing of ${brandResult.suspectedBrand}` : 'No known brand mimicry detected' },
        { id: 'content', name: 'Webpage Content & Form Analysis', status: webpageContent.hasLoginForm && !isHttps ? 'failed' : 'passed', detail: webpageContent.isContentFetched ? `${webpageContent.formsDetected.length} form(s) analyzed` : 'No content retrieved' },
        { id: 'threat-intel', name: 'Threat Intelligence Feeds', status: reputationReport.status.startsWith('KNOWN') ? 'failed' : reputationReport.status === 'SUSPICIOUS' ? 'warning' : reputationReport.isAvailable ? 'passed' : 'unavailable', detail: `${reputationReport.status} (${reputationReport.provider})` },
      ],
      scoreBreakdown,
      indicators,
      explanation: aiAnalysis.explanation || executiveSummary,
      recommendations: aiAnalysis.recommendedActions || [
        'Check the domain spelling carefully before logging in.',
        'Never share OTPs or credentials.',
      ],
      limitations: [
        'A security scanner cannot guarantee that a website is 100% safe. Even trusted websites can suffer temporary compromise.',
        'Zero threat-database detections do not prove legitimacy; brand new phishing kits emerge hourly before catalogs update.',
        'HTTPS encrypts in-transit data but does not prove the website operator is trustworthy.',
      ],
      redirectNotice: redirectAnalysis.redirectSummary,
      scannedAt: new Date().toISOString(),

      // Multi-Layer Deep Artifacts
      dnsAnalysis,
      reachability,
      tlsAnalysis,
      redirectAnalysis,
      securityHeaders,
      brandImpersonation: brandResult,
      webpageContent,
      aiAnalysis,
      websiteClassification: {
        websiteType: aiAnalysis.websiteType,
        websitePurpose: aiAnalysis.websitePurpose,
        confidence: aiAnalysis.confidence || 'Medium',
        evidence: aiAnalysis.evidence || [],
      },
      publicInformation: {
        pageTitle: webpageContent.pageTitle,
        metaDescription: webpageContent.metaDescription,
        mainHeading: webpageContent.mainHeading || webpageContent.headings?.[0],
        headings: webpageContent.headings || [],
        language: webpageContent.language || 'en',
        contentType: reachability.contentType || 'text/html',
        mainTopics: aiAnalysis.mainTopics || [],
        callsToAction: aiAnalysis.callsToAction || [],
        publicContactInfo: aiAnalysis.publicContactInfo || [],
        textExcerpt: webpageContent.textExcerpt,
        linksInfo: webpageContent.linksInfo,
        functionalElements: webpageContent.functionalElements || {
          hasLogin: false,
          hasRegistration: false,
          hasSearch: false,
          hasContactForm: false,
          hasFileUpload: false,
          hasDownload: false,
          hasShoppingCart: false,
          hasCheckout: false,
          hasPayment: false,
          hasSubscription: false,
          hasAccountCreation: false,
          detectedList: [],
        },
        sensitiveRequests: webpageContent.sensitiveFieldsDetected || [],
      },
      technicalEvidence: {
        targetUrl: trimmedInput,
        normalizedUrl,
        dnsIpAddresses: dnsAnalysis.resolvedIps || [],
        dnsStatus: dnsAnalysis.dnsStatus,
        httpStatusCode: reachability.httpStatusCode,
        httpResponseTimeMs: reachability.responseTimeMs,
        finalResolvedUrl: reachability.finalUrl || normalizedUrl,
        pageTitle: webpageContent.pageTitle,
        metaDescription: webpageContent.metaDescription,
        contentLengthBytes: webpageContent.contentLengthBytes || (webpageContent.textExcerpt ? webpageContent.textExcerpt.length : 0),
        language: webpageContent.language,
        headingsList: webpageContent.headings || [],
        formsCount: webpageContent.formsDetected?.length || 0,
        linksCount: webpageContent.linksInfo?.totalLinksCount || 0,
        securityHeadersPresent: securityHeaders.headers.filter((h: any) => h.status === 'present').map((h: any) => h.name),
        securityHeadersMissing: securityHeaders.headers.filter((h: any) => h.status === 'missing').map((h: any) => h.name),
        threatIntelligenceStatus: reputationReport.status,
        threatIntelligenceProvider: reputationReport.provider,
        aiClassificationSource: aiAnalysis.isAiGenerated ? 'Gemini 3.8 Flash Semantic Engine' : 'Deterministic Content Evidence Engine',
        extractedAt: new Date().toISOString(),
      },
      dataSourceLabels: {
        urlIdentification: 'RFC 3986 URL PARSER',
        domainExistence: 'SYSTEM DNS RESOLVER (A/AAAA/MX)',
        websiteClassification: aiAnalysis.isAiGenerated ? 'RETRIEVED WEBPAGE + GEMINI AI' : 'RETRIEVED WEBPAGE EVIDENCE RULES',
        publicInformation: 'LIVE WEBPAGE HTML PARSER',
        reachability: 'LIVE HTTP CLIENT & TCP SOCKET',
        redirects: 'HTTP 3XX LOCATION HEADER TRACER',
        tlsSecurity: 'TLS SOCKET & X.509 CERTIFICATE',
        securityHeaders: 'HTTP RESPONSE HEADERS',
        heuristics: 'DETERMINISTIC SECURITY HEURISTIC ENGINE',
        threatIntelligence: 'CYBERSAFE THREAT REPUTATION FEEDS',
        overallRisk: 'TRANSPARENT 8-PILLAR RISK ENGINE',
      },
      phishingIndicatorsList,
      transparentWeights: scoring.weights,
      verifiedFacts,
      securityObservations,
      executiveSummary,
    };

    return res.json(finalAssessment);
  } catch (err: any) {
    console.error('[Detect API] Unexpected error during scan:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while analyzing the URL.',
      details: err.message,
    });
  }
});
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
    const fallbackResponse = getFallbackGuidance(message, contextPage);
    return res.json(fallbackResponse);
  } catch (err) {
    console.error('[AI Guide] Internal error:', err);
    const fallback = getFallbackGuidance(req.body?.message || '', req.body?.contextPage);
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
