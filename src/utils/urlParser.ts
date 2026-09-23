import { ExtractedUrlInfo, MessageTextAnalysis } from '../types';

/**
 * Multi-part country-code top-level domains for accurate registered domain parsing.
 */
export const MULTI_PART_TLDS = new Set([
  'co.in', 'gov.in', 'ac.in', 'org.in', 'net.in', 'res.in', 'edu.in', 'nic.in',
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'net.uk', 'ltd.uk', 'plc.uk',
  'com.au', 'net.au', 'org.au', 'gov.au', 'edu.au',
  'co.nz', 'org.nz', 'govt.nz',
  'co.za', 'gov.za', 'ac.za', 'org.za',
  'com.br', 'gov.br', 'org.br',
  'com.sg', 'gov.sg', 'edu.sg',
  'co.jp', 'ne.jp', 'ac.jp', 'go.jp', 'or.jp',
  'com.cn', 'gov.cn', 'edu.cn', 'org.cn',
  'com.hk', 'gov.hk', 'edu.hk',
  'com.tw', 'gov.tw', 'edu.tw',
  'com.mx', 'gob.mx', 'edu.mx',
  'com.my', 'gov.my', 'edu.my',
  'co.kr', 'go.kr', 'or.kr',
  'com.tr', 'gov.tr', 'edu.tr',
]);

/**
 * Known URL Shortening Services (masks final target).
 */
export const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'rebrand.ly',
  'cutt.ly', 'tiny.cc', 'shorturl.at', 'bl.ink', 'trib.al', 'goo.gl', 'qr.ae',
  'flip.it', 'dlvr.it', 'v.gd', 'snip.ly', 'lnkd.in'
]);

/**
 * IPv4 and IPv6 validation patterns.
 */
export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const IPV6_REGEX = /^\[?([a-fA-F0-9:]+)\]?$/;

/**
 * Checks if an IPv4 address is in private, loopback, or link-local ranges (RFC 1918, RFC 3927).
 */
export function isPrivateOrLocalIpAddress(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || ip === '0.0.0.0') {
    return true;
  }
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length === 4 && !parts.some(isNaN)) {
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (172.16 - 172.31)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  return false;
}

export interface ParsedDomainInfo {
  hostname: string;
  registeredDomain: string;
  subdomains: string[];
  tld: string;
  isIp: boolean;
  ipType?: 'ipv4' | 'ipv6';
  isPrivateIp?: boolean;
}

/**
 * Parses registered domain and subdomains accurately considering two-part ccTLDs.
 */
export function parseDomainParts(hostname: string): ParsedDomainInfo {
  const cleanHost = hostname.toLowerCase().trim().replace(/^\[|\]$/g, '');
  
  // Check IPv4
  if (IPV4_REGEX.test(cleanHost)) {
    return {
      hostname: cleanHost,
      registeredDomain: cleanHost,
      subdomains: [],
      tld: '',
      isIp: true,
      ipType: 'ipv4',
      isPrivateIp: isPrivateOrLocalIpAddress(cleanHost),
    };
  }

  // Check IPv6
  if (cleanHost.includes(':') && (cleanHost === '::1' || cleanHost.split(':').length >= 3)) {
    return {
      hostname: cleanHost,
      registeredDomain: cleanHost,
      subdomains: [],
      tld: '',
      isIp: true,
      ipType: 'ipv6',
      isPrivateIp: cleanHost === '::1' || cleanHost.startsWith('fc') || cleanHost.startsWith('fd') || cleanHost.startsWith('fe80'),
    };
  }

  // Localhost
  if (cleanHost === 'localhost') {
    return {
      hostname: cleanHost,
      registeredDomain: cleanHost,
      subdomains: [],
      tld: '',
      isIp: false,
      isPrivateIp: true,
    };
  }

  const parts = cleanHost.split('.').filter(Boolean);
  if (parts.length <= 1) {
    return {
      hostname: cleanHost,
      registeredDomain: cleanHost,
      subdomains: [],
      tld: parts[0] || '',
      isIp: false,
    };
  }

  // Check for multi-part ccTLD (e.g. .co.in, .gov.in, .co.uk)
  if (parts.length >= 3) {
    const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    if (MULTI_PART_TLDS.has(lastTwo)) {
      const registeredDomain = `${parts[parts.length - 3]}.${lastTwo}`;
      const subdomains = parts.slice(0, parts.length - 3);
      return {
        hostname: cleanHost,
        registeredDomain,
        subdomains,
        tld: lastTwo,
        isIp: false,
      };
    }
  }

  // Standard single-part TLD
  const tld = parts[parts.length - 1];
  const registeredDomain = `${parts[parts.length - 2]}.${tld}`;
  const subdomains = parts.slice(0, parts.length - 2);
  return {
    hostname: cleanHost,
    registeredDomain,
    subdomains,
    tld,
    isIp: false,
  };
}

export interface UrlNormalizationResult {
  rawInput: string;
  normalizedUrl: string;
  wasNormalized: boolean;
  normalizationNotes: string[];
  isValid: boolean;
  errorMessage?: string;
  parsedUrl?: URL;
  domainInfo?: ParsedDomainInfo;
  isDangerousScheme?: boolean;
}

/**
 * Normalizes and validates an untrusted input string into a standard web URL.
 * Handles missing protocol, whitespace, encoded characters, and dangerous non-web schemes.
 */
export function normalizeAndValidateUrl(input: string): UrlNormalizationResult {
  const rawInput = (input || '').trim();
  const notes: string[] = [];

  if (!rawInput) {
    return {
      rawInput: '',
      normalizedUrl: '',
      wasNormalized: false,
      normalizationNotes: [],
      isValid: false,
      errorMessage: 'Please enter a URL to inspect.',
    };
  }

  // Check dangerous non-web schemes directly in raw input
  const schemeMatch = rawInput.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  const rawScheme = schemeMatch ? schemeMatch[1].toLowerCase() : '';
  const dangerousSchemes = ['javascript', 'data', 'file', 'blob', 'vbscript'];

  if (dangerousSchemes.includes(rawScheme)) {
    return {
      rawInput,
      normalizedUrl: rawInput,
      wasNormalized: false,
      normalizationNotes: [`Detected dangerous non-web URI scheme "${rawScheme}:"`],
      isValid: false,
      isDangerousScheme: true,
      errorMessage: `Unsupported or dangerous protocol scheme "${rawScheme}:". CyberSafe only inspects standard Web URLs (http/https).`,
    };
  }

  // Check for embedded whitespace inside URL
  if (/\s/.test(rawInput)) {
    return {
      rawInput,
      normalizedUrl: rawInput,
      wasNormalized: false,
      normalizationNotes: ['URL contains unescaped whitespace characters.'],
      isValid: false,
      errorMessage: 'The entered address contains spaces. Valid URLs cannot contain unescaped whitespace.',
    };
  }

  // Normalize protocol if missing
  let candidate = rawInput;
  let wasNormalized = false;

  if (!rawScheme) {
    // Missing scheme - default safely to https://
    candidate = `https://${rawInput}`;
    wasNormalized = true;
    notes.push('No protocol specified; automatically prefixed with https:// for inspection.');
  }

  try {
    const parsed = new URL(candidate);

    // Only allow http and https protocols for web detection
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        rawInput,
        normalizedUrl: candidate,
        wasNormalized,
        normalizationNotes: notes,
        isValid: false,
        errorMessage: `Protocol "${parsed.protocol}" is not an HTTP or HTTPS web URL.`,
      };
    }

    if (!parsed.hostname) {
      return {
        rawInput,
        normalizedUrl: candidate,
        wasNormalized,
        normalizationNotes: notes,
        isValid: false,
        errorMessage: 'The URL does not contain a valid hostname or domain.',
      };
    }

    const domainInfo = parseDomainParts(parsed.hostname);

    return {
      rawInput,
      normalizedUrl: parsed.toString(),
      wasNormalized,
      normalizationNotes: notes,
      isValid: true,
      parsedUrl: parsed,
      domainInfo,
    };
  } catch (err) {
    return {
      rawInput,
      normalizedUrl: candidate,
      wasNormalized,
      normalizationNotes: notes,
      isValid: false,
      errorMessage: 'Syntax Error: Could not parse input as a standard RFC-compliant URL.',
    };
  }
}

/**
 * Extracts all URLs from an arbitrary text message (e.g. SMS, WhatsApp message, email).
 * Cleans trailing punctuation and validates each extracted link.
 */
export function extractUrlsFromMessage(rawText: string): MessageTextAnalysis {
  const text = (rawText || '').trim();
  if (!text) {
    return {
      rawText: '',
      hasLinks: false,
      linkCount: 0,
      extractedUrls: [],
      detectedPatterns: {
        hasUrgency: false,
        hasFinancialPretext: false,
        hasSuspiciousShortener: false,
        hasCredentialHarvestingWords: false,
      },
    };
  }

  // Regex to extract URLs with or without scheme
  // Matches http://, https://, or www. or domain with common TLDs
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`]+|[a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.(?:com|org|net|in|co\.in|gov\.in|xyz|top|info|biz|me|online|live|site|pro|cc|app|dev|io)(?:\/[^\s<>"'{}|\\^`]*)?/gi;

  const matches: { text: string; index: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    matches.push({ text: match[0], index: match.index });
    if (matches.length >= 20) break; // cap extraction to prevent ReDoS / excessive links
  }

  const extractedUrls: ExtractedUrlInfo[] = [];
  const seenUrls = new Set<string>();

  for (let i = 0; i < matches.length; i++) {
    const item = matches[i];
    // Clean trailing punctuation: .,;:!?)]}>
    let cleaned = item.text.replace(/[.,;:!?)]}>]+$/, '');
    if (!cleaned) continue;

    const normalized = normalizeAndValidateUrl(cleaned);
    const finalUrl = normalized.isValid ? normalized.normalizedUrl : cleaned;

    if (seenUrls.has(finalUrl)) continue;
    seenUrls.add(finalUrl);

    extractedUrls.push({
      id: `link-${i + 1}`,
      originalText: cleaned,
      extractedUrl: cleaned,
      normalizedUrl: finalUrl,
      position: { start: item.index, end: item.index + cleaned.length },
    });
  }

  const lowerText = text.toLowerCase();
  const urgencyWords = ['urgent', 'immediately', 'suspended', 'blocked', '24 hours', 'action required', 'deactivated'];
  const financialWords = ['bank', 'sbi', 'hdfc', 'icici', 'otp', 'pan', 'aadhaar', 'kyc', 'refund', 'cashback', 'credit card', 'debit card'];
  const credentialWords = ['password', 'login', 'signin', 'verify', 'update account', 'security alert'];

  const hasUrgency = urgencyWords.some(w => lowerText.includes(w));
  const hasFinancialPretext = financialWords.some(w => lowerText.includes(w));
  const hasCredentialHarvestingWords = credentialWords.some(w => lowerText.includes(w));
  const hasSuspiciousShortener = extractedUrls.some(u => {
    try {
      const host = new URL(u.normalizedUrl).hostname.toLowerCase();
      return SHORTENER_DOMAINS.has(host);
    } catch {
      return false;
    }
  });

  return {
    rawText: text,
    hasLinks: extractedUrls.length > 0,
    linkCount: extractedUrls.length,
    extractedUrls,
    detectedPatterns: {
      hasUrgency,
      hasFinancialPretext,
      hasSuspiciousShortener,
      hasCredentialHarvestingWords,
    },
  };
}
