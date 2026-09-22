import { UrlScanAssessment, UrlIndicator } from '../types';

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'loan', 'cfd', 'gq', 'tk', 'ml', 'ga', 
  'cc', 'buzz', 'rest', 'cam', 'vip', 'icu', 'sbs', 'monster', 'hair', 'bond', 'fit', 'beauty', 'surf'
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account', 'banking', 
  'update', 'wallet', 'confirm', 'password', 'recovery', 'security', 'billing', 
  'invoice', 'suspended', 'urgent', 'free-gift', 'lottery', 'kyc', 'pan-card', 'aadhaar'
];

const SUSPICIOUS_FILE_EXTENSIONS = [
  '.exe', '.scr', '.apk', '.bat', '.cmd', '.vbs', '.ps1', '.iso', '.zip', '.tar.gz'
];

const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'rebrand.ly', 'cutt.ly', 'tiny.cc'
]);

// IPv4 regex (handles 0.0.0.0 to 255.255.255.255)
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Safely analyzes a suspicious URL string purely on the client-side.
 * CRITICAL: Never visits, fetches, executes, or renders the target URL.
 */
export function analyzeUrlSafety(inputUrl: string): UrlScanAssessment {
  const trimmed = inputUrl.trim();

  // If input is empty
  if (!trimmed) {
    return {
      rawInput: '',
      isValid: false,
      protocol: '',
      hostname: '',
      pathname: '',
      isHttps: false,
      isIpAddress: false,
      hasAtSymbol: false,
      subdomainCount: 0,
      isPunycode: false,
      hasSuspiciousKeywords: false,
      suspiciousKeywordsFound: [],
      hasExcessiveParams: false,
      hasSuspiciousEncoding: false,
      urlLength: 0,
      hostnameLength: 0,
      riskScore: 0,
      riskLevel: 'Low Risk',
      indicators: [],
      explanation: 'Please enter a web address (URL) to begin the heuristic evaluation.',
      recommendations: ['Paste a link you wish to inspect before opening it in your browser.'],
      errorMessage: 'No URL entered.'
    };
  }

  // Prepend scheme if user entered domain directly without protocol
  let urlString = trimmed;
  let addedScheme = false;
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = 'https://' + urlString;
    addedScheme = true;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return {
      rawInput: trimmed,
      isValid: false,
      protocol: 'invalid',
      hostname: 'invalid',
      pathname: '',
      isHttps: false,
      isIpAddress: false,
      hasAtSymbol: trimmed.includes('@'),
      subdomainCount: 0,
      isPunycode: false,
      hasSuspiciousKeywords: false,
      suspiciousKeywordsFound: [],
      hasExcessiveParams: false,
      hasSuspiciousEncoding: /%[0-9a-fA-F]{2}/.test(trimmed),
      urlLength: trimmed.length,
      hostnameLength: 0,
      riskScore: 65,
      riskLevel: 'High Risk',
      indicators: [
        {
          name: 'Invalid or Malformed URL Syntax',
          status: 'risk',
          description: 'The string could not be parsed as a standard RFC-compliant web address. Malformed URLs are frequently used in injection attacks or obfuscation tricks.',
          impactPoints: 65,
          iconType: 'danger'
        }
      ],
      explanation: 'The entered text is not a valid URL structure according to standard web address specifications. Exercise extreme caution as malformed addresses can conceal deceptive redirect destinations.',
      recommendations: [
        'Do not open or click this string in emails or messages.',
        'Verify the legitimate website address directly by searching the official organization in a trusted search engine.'
      ],
      errorMessage: 'Invalid URL syntax: Could not parse protocol, domain or host.'
    };
  }

  const indicators: UrlIndicator[] = [];
  let riskScore = 0; // Starts at 0, accumulates risk points based on transparent heuristic signals

  const protocol = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search;
  const fullUrlLower = parsed.href.toLowerCase();

  // 1. Protocol & HTTPS usage
  const isHttps = protocol === 'https:';
  if (isHttps) {
    indicators.push({
      name: 'HTTPS Encryption Enabled',
      status: 'positive',
      description: 'The link uses the encrypted HTTPS protocol (port 443), protecting network transit against passive interception.',
      impactPoints: 0,
      iconType: 'check'
    });
  } else if (protocol === 'http:') {
    riskScore += 25;
    indicators.push({
      name: 'Unencrypted HTTP Protocol (No TLS)',
      status: 'risk',
      description: 'The URL uses plain HTTP (port 80). Any credentials, passwords, or personal information submitted over this connection are transmitted unencrypted and vulnerable to eavesdropping or tampering.',
      impactPoints: 25,
      iconType: 'danger'
    });
  } else {
    riskScore += 35;
    indicators.push({
      name: `Unusual Protocol: ${protocol}`,
      status: 'risk',
      description: `The URL uses a non-standard protocol (${protocol}) rather than standard web protocols (HTTP/HTTPS). Non-standard protocols may trigger local script execution or custom application handlers.`,
      impactPoints: 35,
      iconType: 'danger'
    });
  }

  // 2. Hostname is a Raw IP Address
  const isIpAddress = IPV4_REGEX.test(hostname) || hostname.startsWith('[') || /^[0-9.]+$/.test(hostname);
  if (isIpAddress) {
    riskScore += 45;
    indicators.push({
      name: 'Raw IP Address in Place of Domain Name',
      status: 'risk',
      description: 'Legitimate consumer websites and public institutions rarely use raw IP addresses for user-facing pages. Attackers frequently deploy servers by numeric IP to circumvent standard domain reputation filters, whois lookups, and domain takedowns.',
      impactPoints: 45,
      iconType: 'danger'
    });
  } else {
    indicators.push({
      name: 'Standard Domain Name Format',
      status: 'positive',
      description: 'The hostname resolves through standard DNS naming rather than an unmapped raw IP address.',
      impactPoints: 0,
      iconType: 'check'
    });
  }

  // 3. Userinfo / Presence of '@' symbol
  const hasAtSymbol = trimmed.includes('@') || parsed.username !== '' || parsed.password !== '';
  if (hasAtSymbol) {
    riskScore += 40;
    indicators.push({
      name: 'Embedded "@" Character (Userinfo Deception)',
      status: 'risk',
      description: 'The "@" character in a URL causes browsers to treat everything before the "@" as user authentication data, routing the user to whatever domain appears AFTER the "@". For example, "https://google.com@attacker.com" actually navigates to attacker.com.',
      impactPoints: 40,
      iconType: 'danger'
    });
  }

  // 4. Punycode / Internationalized Domain Name (IDN)
  const isPunycode = hostname.includes('xn--');
  if (isPunycode) {
    riskScore += 30;
    indicators.push({
      name: 'Punycode Internationalized Domain (xn--)',
      status: 'risk',
      description: 'The domain uses Punycode encoding (prefixed with "xn--"). While legitimate for international scripts, attackers frequently use Punycode for homograph attacks where Cyrillic or Greek characters visually clone English letters (e.g. replacing "a" with Cyrillic "а").',
      impactPoints: 30,
      iconType: 'danger'
    });
  }

  // 5. Excessive Subdomains
  const domainParts = hostname.split('.').filter(Boolean);
  const subdomainCount = Math.max(0, domainParts.length - 2);
  if (domainParts.length >= 4) {
    riskScore += 20;
    indicators.push({
      name: `Excessive Subdomain Stacking (${domainParts.length} levels)`,
      status: 'warning',
      description: `The hostname contains ${domainParts.length} separate domain labels (e.g., "${hostname}"). Phishing operators frequently chain subdomains (e.g. login.sbi.bank.attacker-domain.xyz) to deceive users glancing at the beginning of the address.`,
      impactPoints: 20,
      iconType: 'alert'
    });
  } else if (!isIpAddress && domainParts.length <= 3) {
    indicators.push({
      name: 'Normal Subdomain Structure',
      status: 'positive',
      description: 'The hostname has standard domain depth without deceptive multi-level subdomain stacking.',
      impactPoints: 0,
      iconType: 'check'
    });
  }

  // 6. Suspicious / Disposable High-Risk TLD
  const tld = domainParts.length > 0 ? domainParts[domainParts.length - 1] : '';
  if (SUSPICIOUS_TLDS.has(tld)) {
    riskScore += 25;
    indicators.push({
      name: `High-Risk Top-Level Domain (.${tld})`,
      status: 'warning',
      description: `The domain uses the ".${tld}" extension. While not inherently harmful, certain low-cost or loosely verified TLDs have a statistically disproportionate association with disposable phishing campaigns and botnet infrastructure.`,
      impactPoints: 25,
      iconType: 'alert'
    });
  }

  // 7. URL Shortener Domain
  const isShortener = SHORTENER_DOMAINS.has(hostname);
  if (isShortener) {
    riskScore += 20;
    indicators.push({
      name: 'URL Shortener Service Detected',
      status: 'warning',
      description: `The URL uses a known link-shortening service (${hostname}). Link shorteners obscure the real destination server, preventing you from evaluating the actual target domain before clicking.`,
      impactPoints: 20,
      iconType: 'alert'
    });
  }

  // 8. Suspicious Security/Auth Keywords
  const foundKeywords: string[] = [];
  const textToScan = (hostname + pathname + search).toLowerCase();
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (textToScan.includes(kw)) {
      foundKeywords.push(kw);
    }
  }

  const hasSuspiciousKeywords = foundKeywords.length > 0;
  if (hasSuspiciousKeywords) {
    // If combined with non-HTTPS or non-standard TLD or raw IP, it's higher risk
    const pointIncrement = foundKeywords.length >= 3 ? 25 : 15;
    riskScore += pointIncrement;
    indicators.push({
      name: `Security or Authentication Keywords Detected (${foundKeywords.slice(0, 4).join(', ')})`,
      status: 'warning',
      description: `The URL contains sensitive keywords: ${foundKeywords.join(', ')}. While legitimate banking and login portals naturally use these terms, scammers frequently incorporate them into bogus domain names or paths to generate a false sense of legitimacy or urgency.`,
      impactPoints: pointIncrement,
      iconType: 'alert'
    });
  }

  // 9. Dangerous Executable or Script File Extension in Path
  const hasDangerousExt = SUSPICIOUS_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext));
  if (hasDangerousExt) {
    riskScore += 35;
    indicators.push({
      name: 'Executable or Script File in URL Path',
      status: 'risk',
      description: 'The URL path points directly to an executable file, archive, or script package (.exe, .apk, .zip, etc.). Clicking could trigger an automatic drive-by download of malicious software or a spyware installer.',
      impactPoints: 35,
      iconType: 'danger'
    });
  }

  // 10. URL Encoding / Obfuscation (% characters)
  const percentMatches = (trimmed.match(/%[0-9a-fA-F]{2}/g) || []).length;
  const hasSuspiciousEncoding = percentMatches >= 3 || trimmed.includes('%00') || trimmed.includes('%2f%2f');
  if (hasSuspiciousEncoding) {
    riskScore += 20;
    indicators.push({
      name: `Heavy Percent-Hex URL Encoding (${percentMatches} encoded sequences)`,
      status: 'warning',
      description: 'The URL contains multiple hex-encoded characters (%xx). Attackers frequently double-encode slashes, dots, or control characters to bypass web application firewalls and hide target domain names.',
      impactPoints: 20,
      iconType: 'alert'
    });
  }

  // 11. Excessive Query Parameters
  let paramCount = 0;
  try {
    parsed.searchParams.forEach(() => paramCount++);
  } catch {
    paramCount = 0;
  }
  const hasExcessiveParams = paramCount >= 5;
  if (hasExcessiveParams) {
    riskScore += 10;
    indicators.push({
      name: `Excessive Query Parameters (${paramCount} parameters)`,
      status: 'warning',
      description: `The URL carries ${paramCount} query parameters. Complex tracking strings or base64-encoded query arguments are frequently employed to pass victim identifiers to dynamic phishing kits.`,
      impactPoints: 10,
      iconType: 'alert'
    });
  }

  // 12. Abnormal URL Length
  const urlLength = trimmed.length;
  const hostnameLength = hostname.length;
  if (urlLength > 120) {
    riskScore += 10;
    indicators.push({
      name: `Unusually Long URL (${urlLength} characters)`,
      status: 'warning',
      description: 'The overall URL is exceptionally long. Excessively long URLs are often used to push suspicious domain segments out of sight on mobile browser address bars.',
      impactPoints: 10,
      iconType: 'alert'
    });
  }

  if (hostnameLength > 35) {
    riskScore += 15;
    indicators.push({
      name: `Unusually Long Domain Hostname (${hostnameLength} chars)`,
      status: 'warning',
      description: 'The hostname itself is unusually long. Typosquatting and fake brand registrations often append multiple words to imitate real services.',
      impactPoints: 15,
      iconType: 'alert'
    });
  }

  // 13. Multiple consecutive hyphens in hostname
  if (hostname.includes('--') && !isPunycode) {
    riskScore += 15;
    indicators.push({
      name: 'Consecutive Hyphens in Hostname',
      status: 'warning',
      description: 'The hostname contains consecutive hyphens ("--"), a pattern commonly observed in algorithmically generated phishing domains attempting to mimic corporate subdomains.',
      impactPoints: 15,
      iconType: 'alert'
    });
  }

  // Bound the risk score between 0 and 100
  const finalRiskScore = Math.min(100, Math.max(0, riskScore));

  // Determine categorical Risk Level according to prompt specifications:
  // 0–29 = Low Risk
  // 30–59 = Medium Risk
  // 60–100 = High Risk
  let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  let explanation = '';
  const recommendations: string[] = [];

  if (finalRiskScore >= 60) {
    riskLevel = 'High Risk';
    explanation = 'This URL exhibits multiple strong heuristic indicators commonly associated with phishing campaigns, deceptive redirects, or unencrypted data interception. The structural characteristics present elevated risk to credentials and device security.';
    recommendations.push('Do not enter passwords, OTPs, payment information or personal information.');
    recommendations.push('Do not download or open any attachments or files delivered from this address.');
    recommendations.push('Verify the legitimate website directly through official bookmarks or a known trusted search engine.');
    recommendations.push('If you already entered account credentials or banking PINs at this link, take immediate containment steps via the Report section.');
  } else if (finalRiskScore >= 30) {
    riskLevel = 'Medium Risk';
    explanation = 'This URL presents several ambiguous or caution-worthy structural signals—such as sensitive auth keywords, non-standard domain characteristics, or URL shorteners. While some legitimate services share these traits, careful verification is advised.';
    recommendations.push('Inspect the exact destination hostname carefully before typing any login information.');
    recommendations.push('Check whether the domain genuinely belongs to the institution claiming to contact you.');
    recommendations.push('If the link was received via an unsolicited SMS or WhatsApp message, verify with the sender through an independent official channel.');
  } else {
    riskLevel = 'Low Risk';
    explanation = 'This URL conforms to standard, conventional web conventions with valid HTTPS encryption, standard domain depth, and no high-risk obfuscation patterns detected in its syntax.';
    recommendations.push('Continue practicing standard cyber hygiene: always verify the site address bar matches the expected service.');
    recommendations.push('Never share one-time passcodes (OTPs) or UPI PINs regardless of how authentic a webpage looks.');
  }

  return {
    rawInput: trimmed,
    isValid: true,
    protocol,
    hostname,
    pathname,
    isHttps,
    isIpAddress,
    hasAtSymbol,
    subdomainCount,
    isPunycode,
    hasSuspiciousKeywords,
    suspiciousKeywordsFound: foundKeywords,
    hasExcessiveParams,
    hasSuspiciousEncoding,
    urlLength,
    hostnameLength,
    riskScore: finalRiskScore,
    riskLevel,
    indicators,
    explanation,
    recommendations
  };
}
