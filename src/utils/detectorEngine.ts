import {
  UrlScanAssessment,
  UrlIndicator,
  UrlScoreBreakdownItem,
  CheckPerformedItem,
  ThreatIntelligenceReport,
} from '../types';
import {
  normalizeAndValidateUrl,
  SHORTENER_DOMAINS,
  isPrivateOrLocalIpAddress,
} from './urlParser';
import { checkUrlThreatIntelligence } from '../services/threatIntelService';

// High-Risk disposable or heavily abused TLDs (statistically correlated with temporary phishing/spam infrastructure)
export const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'loan', 'cfd', 'gq', 'tk', 'ml', 'ga',
  'cc', 'buzz', 'rest', 'cam', 'vip', 'icu', 'sbs', 'monster', 'hair',
  'bond', 'fit', 'beauty', 'surf', 'country', 'stream', 'party', 'gdn'
]);

// High-Risk Executable or Script File Extensions
export const DANGEROUS_FILE_EXTENSIONS = [
  '.exe', '.scr', '.apk', '.bat', '.cmd', '.vbs', '.ps1', '.iso', '.zip',
  '.jar', '.dmg', '.msi', '.hta', '.pif', '.reg', '.tar.gz'
];

// Open Redirect Query Parameter Keys
export const OPEN_REDIRECT_PARAM_KEYS = new Set([
  'redirect', 'redirect_uri', 'redirect_url', 'url', 'next', 'dest',
  'destination', 'target', 'return', 'return_url', 'goto', 'r', 'out', 'link'
]);

// Keywords associated with Phishing, Account Panic, and Financial Exploits
export const AUTH_URGENCY_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security',
  'account', 'update', 'confirm', 'password', 'recovery', 'recover',
  'unlock', 'suspended', 'urgent', 'alert', 're-activate', 'validate'
];

export const FINANCIAL_KEYWORDS = [
  'banking', 'netbanking', 'wallet', 'billing', 'invoice', 'refund',
  'cashback', 'kyc', 'pan-card', 'aadhaar', 'lottery', 'prize',
  'tax-refund', 'upi-pin', 'rewards', 'payout', 'crypto', 'bonus'
];

// Standard Educational Limitations Notice
export const STANDARD_LIMITATIONS = [
  'A URL detector cannot guarantee that a website is safe. Even legitimate websites can be compromised or host malicious third-party scripts.',
  'A website absent from threat intelligence databases is NOT automatically safe; new phishing domains are registered hourly before being cataloged.',
  'Local structural heuristics analyze address syntax and deceptive formatting purely on the client side without executing server code.',
  'Zero-Contact Security Guarantee: CyberSafe never visits, crawls, renders in an iframe, or executes code from the target website.',
  'Remote server-side HTTP 301/302 redirects are not followed to preserve your privacy and protect your device from drive-by downloads.'
];

export const STANDARD_REDIRECT_NOTICE =
  'Note on HTTP Redirects: Server-side HTTP redirects (such as 301/302 status codes or JavaScript meta-refreshes) cannot be determined without actively connecting to the remote web server. Because CyberSafe maintains a strict zero-contact security boundary to protect your device from drive-by malware and tracking, remote redirect chains are not followed.';

/**
 * Analyzes URL structure deterministically without making any remote connection to the destination.
 * Evaluates 22+ discrete heuristic indicators.
 */
export function analyzeUrlStructure(inputUrl: string): {
  normalizedUrl: string;
  wasNormalized: boolean;
  normalizationNote?: string;
  isValid: boolean;
  protocol: string;
  hostname: string;
  port?: string;
  pathname: string;
  search?: string;
  isHttps: boolean;
  isIpAddress: boolean;
  ipType?: 'ipv4' | 'ipv6';
  isPrivateOrLocalIp?: boolean;
  hasAtSymbol: boolean;
  subdomainCount: number;
  subdomains: string[];
  registeredDomain: string;
  isPunycode: boolean;
  punycodeDetails?: string;
  hasHomographRisk?: boolean;
  unicodeAnalysis?: { isPunycode: boolean; containsNonAscii: boolean; scriptsDetected?: string[] };
  isShortenedUrl?: boolean;
  shortenerDomain?: string;
  hasSuspiciousKeywords: boolean;
  suspiciousKeywordsFound: string[];
  hasExcessiveParams: boolean;
  paramCount: number;
  hasOpenRedirectParam: boolean;
  hasSuspiciousEncoding: boolean;
  encodedSequencesCount: number;
  hasDoubleEncoding?: boolean;
  suspiciousCharacters: string[];
  hasUnusualPort: boolean;
  hasDangerousExtension: boolean;
  dangerousExtension?: string;
  urlLength: number;
  hostnameLength: number;
  structuralScore: number;
  indicators: UrlIndicator[];
  scoreBreakdown: UrlScoreBreakdownItem[];
  explanation: string;
  recommendations: string[];
  errorMessage?: string;
} {
  const norm = normalizeAndValidateUrl(inputUrl);

  if (!norm.isValid || !norm.parsedUrl || !norm.domainInfo) {
    const rawTrimmed = (inputUrl || '').trim();
    const explanation = norm.errorMessage || 'Please enter a valid web address (URL) to begin the evaluation.';

    const invalidIndicators: UrlIndicator[] = [
      {
        name: 'Invalid or Malformed URL Syntax',
        category: 'syntax',
        severity: 'high',
        status: 'risk',
        description: norm.errorMessage || 'The input cannot be parsed as a standard RFC web address.',
        whyItMatters: 'Malformed addresses may be used in injection exploits, non-web schemes, or contain syntax errors.',
        impactPoints: 60,
        iconType: 'danger',
        recommendation: 'Check the URL spelling or copy the full address directly from the address bar.',
      },
    ];

    if (norm.isDangerousScheme) {
      invalidIndicators.push({
        name: 'Dangerous Non-Web Protocol Scheme',
        category: 'protocol',
        severity: 'critical',
        status: 'risk',
        description: 'Input uses an executable URI scheme (e.g. javascript:, data:, file:) rather than standard web protocols.',
        whyItMatters: 'Executable URI schemes can run arbitrary scripts or access local file storage when opened in a browser.',
        impactPoints: 90,
        iconType: 'danger',
        recommendation: 'Do NOT paste or execute this string in your browser address bar.',
      });
    }

    return {
      normalizedUrl: norm.normalizedUrl,
      wasNormalized: norm.wasNormalized,
      normalizationNote: norm.normalizationNotes.join(' '),
      isValid: false,
      protocol: '',
      hostname: '',
      pathname: '',
      isHttps: false,
      isIpAddress: false,
      hasAtSymbol: false,
      subdomainCount: 0,
      subdomains: [],
      registeredDomain: '',
      isPunycode: false,
      hasSuspiciousKeywords: false,
      suspiciousKeywordsFound: [],
      hasExcessiveParams: false,
      paramCount: 0,
      hasOpenRedirectParam: false,
      hasSuspiciousEncoding: false,
      encodedSequencesCount: 0,
      suspiciousCharacters: [],
      hasUnusualPort: false,
      hasDangerousExtension: false,
      urlLength: rawTrimmed.length,
      hostnameLength: 0,
      structuralScore: norm.isDangerousScheme ? 90 : 60,
      indicators: invalidIndicators,
      scoreBreakdown: [
        {
          indicatorName: 'Malformed Syntax / Unsupported Scheme',
          category: 'syntax',
          points: norm.isDangerousScheme ? 90 : 60,
          reason: norm.errorMessage || 'Syntax parsing failure.',
        },
      ],
      explanation,
      recommendations: ['Do not open unverified or malformed links.'],
      errorMessage: norm.errorMessage,
    };
  }

  const parsed = norm.parsedUrl;
  const domainInfo = norm.domainInfo;
  const rawInput = norm.rawInput;
  const normalizedUrl = norm.normalizedUrl;

  const indicators: UrlIndicator[] = [];
  const scoreBreakdown: UrlScoreBreakdownItem[] = [];
  let structuralScore = 0;

  const addPoint = (
    pts: number,
    name: string,
    category: UrlScoreBreakdownItem['category'],
    reason: string
  ) => {
    structuralScore += pts;
    scoreBreakdown.push({ indicatorName: name, category, points: pts, reason });
  };

  // 1. Protocol & HTTPS Check
  const isHttps = parsed.protocol === 'https:';
  if (isHttps) {
    indicators.push({
      name: 'TLS Encrypted Transport (HTTPS)',
      category: 'protocol',
      severity: 'informational',
      status: 'positive',
      description: 'The connection uses HTTPS with Transport Layer Security (TLS) encryption.',
      whyItMatters: 'HTTPS prevents cleartext eavesdropping and tampering in transit. However, HTTPS alone does NOT prove that a website is legitimate; phishing sites frequently use free TLS certificates.',
      impactPoints: 0,
      iconType: 'check',
      recommendation: 'Always verify the domain name itself, even when HTTPS encryption is active.',
    });
  } else {
    addPoint(25, 'Unencrypted Plain HTTP Protocol', 'protocol', 'Transmits credentials and data in cleartext without TLS.');
    indicators.push({
      name: 'Unencrypted Plain HTTP Connection',
      category: 'protocol',
      severity: 'medium',
      status: 'warning',
      description: 'The URL uses plain HTTP (port 80) instead of HTTPS. All data sent to this site can be intercepted or modified on local networks.',
      whyItMatters: 'Modern trustworthy websites use HTTPS by default. Unencrypted HTTP is unacceptable for any form requesting passwords, OTPs, or payments.',
      impactPoints: 25,
      iconType: 'alert',
      recommendation: 'Never submit passwords, personal info, or payment details over plain HTTP.',
    });
  }

  // 2. IP Address Hostname
  const isIpAddress = domainInfo.isIp;
  const ipType = domainInfo.ipType;
  const isPrivateIp = domainInfo.isPrivateIp;

  if (isIpAddress) {
    const pts = isPrivateIp ? 45 : 40;
    addPoint(pts, 'Direct Numeric IP Address Hostname', 'host', isPrivateIp ? 'Points to a private, loopback, or internal network address.' : 'Uses raw numeric IP rather than a registered domain name.');
    indicators.push({
      name: isPrivateIp ? 'Private / Internal Network IP Address' : 'Direct Numeric IP Address Hostname',
      category: 'host',
      severity: 'high',
      status: 'risk',
      description: `The URL connects directly to an IP address (${parsed.hostname}) rather than a registered domain name.${isPrivateIp ? ' This address belongs to a local or internal private network (RFC 1918).' : ''}`,
      whyItMatters: 'Legitimate public organizations use domain names. Attackers often deploy temporary phishing kits on raw IP addresses to bypass domain reputation blocklists.',
      impactPoints: pts,
      iconType: 'danger',
      recommendation: 'Avoid opening numeric IP addresses received in messages or unexpected emails.',
    });
  }

  // 3. Userinfo (@ symbol deception in authority)
  const authorityPart = rawInput.split('?')[0].split('#')[0].replace(/^https?:\/\//i, '').split('/')[0];
  const hasAtSymbol = authorityPart.includes('@') || parsed.username !== '' || parsed.password !== '';
  if (hasAtSymbol) {
    addPoint(45, 'Embedded Userinfo "@" Symbol Deception', 'host', 'Exploits RFC 3986 syntax where the text before "@" is treated as username.');
    indicators.push({
      name: 'Embedded Userinfo "@" Symbol Deception',
      category: 'host',
      severity: 'critical',
      status: 'risk',
      description: 'The URL contains an "@" symbol in the host authority. In standard web syntax, everything before "@" is treated as a username, while the actual destination follows the "@".',
      whyItMatters: 'Attackers craft misleading URLs like "https://google.com@phishing-trap.com" to fool victims into believing they are visiting the domain before the "@".',
      impactPoints: 45,
      iconType: 'danger',
      recommendation: 'Do NOT open this link. The actual destination is not the domain displayed before the "@" symbol.',
    });
  }

  // Check for email address in query parameter (often used in credential harvesting campaigns)
  const hasEmailInQuery = !hasAtSymbol && rawInput.includes('@') && parsed.search.includes('@');
  if (hasEmailInQuery) {
    addPoint(10, 'Targeted Email Parameter in Query', 'query', 'Query string embeds a victim email address.');
    indicators.push({
      name: 'Targeted Email Address in Query',
      category: 'query',
      severity: 'low',
      status: 'warning',
      description: 'The query parameters include an email address, commonly seen in targeted spear-phishing campaigns to pre-fill victim credentials.',
      whyItMatters: 'Phishing campaigns embed victim email addresses in URLs so the counterfeit login page can display their personalized email.',
      impactPoints: 10,
      iconType: 'alert',
      recommendation: 'Verify why your personal email address is attached to this URL parameter.',
    });
  }

  // 4. Punycode & Homograph Analysis
  const isPunycode = parsed.hostname.toLowerCase().startsWith('xn--') || parsed.hostname.toLowerCase().includes('.xn--');
  // Check for non-ASCII characters in raw input
  const nonAsciiMatch = /[^\x00-\x7F]/.test(rawInput);
  const hasHomographRisk = isPunycode || nonAsciiMatch;

  if (hasHomographRisk) {
    addPoint(30, 'Internationalized Domain Name (Punycode / Homograph)', 'host', 'Uses IDN Punycode encoding that can visually imitate trusted Latin domain names.');
    indicators.push({
      name: 'Punycode / Internationalized Domain Homograph',
      category: 'host',
      severity: 'high',
      status: 'warning',
      description: `The hostname contains Punycode encoding (${parsed.hostname}) or non-Latin Unicode characters.`,
      whyItMatters: 'Homograph attacks use lookalike characters from Cyrillic or Greek alphabets (e.g. Cyrillic "а" instead of Latin "a") to create indistinguishable counterfeit domains.',
      impactPoints: 30,
      iconType: 'alert',
      recommendation: 'Carefully inspect the actual ASCII hostname to verify the domain is not impersonating a familiar brand.',
    });
  }

  // 5. URL Shorteners
  const isShortenedUrl = SHORTENER_DOMAINS.has(parsed.hostname.toLowerCase());
  if (isShortenedUrl) {
    addPoint(15, 'URL Shortening Service Detected', 'host', 'Masks the final destination URL.');
    indicators.push({
      name: 'URL Shortener Detected (Hidden Destination)',
      category: 'host',
      severity: 'medium',
      status: 'warning',
      description: `This address uses a public link-shortening service (${parsed.hostname}) which conceals the destination website.`,
      whyItMatters: 'Shortened links hide the final destination. Attackers frequently use them in SMS and social media scams to evade visual detection.',
      impactPoints: 15,
      iconType: 'alert',
      recommendation: 'Shortened links hide the final destination. Verify the destination through a trusted source or unshortener before continuing.',
    });
  }

  // 6. Subdomain Stacking & Depth
  const subdomainCount = domainInfo.subdomains.length;
  if (subdomainCount >= 3) {
    const pts = subdomainCount >= 4 ? 25 : 20;
    addPoint(pts, 'Excessive Subdomain Stacking', 'host', `Features ${subdomainCount} subdomains, often used to conceal target root domains on mobile displays.`);
    indicators.push({
      name: 'Excessive Subdomain Stacking',
      category: 'host',
      severity: 'medium',
      status: 'warning',
      description: `The URL contains ${subdomainCount} subdomains (${domainInfo.subdomains.join('.')}).`,
      whyItMatters: 'Phishing campaigns stack trusted brand names as subdomains (e.g., login.bank.com.fake-server.top) to push the real root domain off-screen on mobile devices.',
      impactPoints: pts,
      iconType: 'alert',
      recommendation: 'Look at the root domain directly before the TLD, not the subdomains at the start of the address.',
    });
  }

  // 7. High-Risk Disposable TLD
  const tld = domainInfo.tld.toLowerCase();
  if (HIGH_RISK_TLDS.has(tld)) {
    addPoint(20, `High-Risk Disposable Top-Level Domain (.${tld})`, 'host', 'Statistically correlated with disposable scam and phishing operations.');
    indicators.push({
      name: `High-Risk Top-Level Domain (.${tld})`,
      category: 'host',
      severity: 'medium',
      status: 'warning',
      description: `The domain uses the .${tld} top-level extension, which has high statistical correlation with disposable spam and credential harvesting.`,
      whyItMatters: 'Extremely cheap or free TLDs are heavily abused by cybercriminals because they can be registered and abandoned rapidly.',
      impactPoints: 20,
      iconType: 'alert',
      recommendation: 'Exercise heightened caution if this domain claims to represent a financial, governmental, or major institutional organization.',
    });
  }

  // 8. Brand Name in Subdomain (Brand Impersonation Trick)
  const knownBrands = ['paypal', 'sbi', 'hdfc', 'icici', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook', 'instagram', 'whatsapp'];
  const brandFoundInSubdomain = domainInfo.subdomains.find(sub => knownBrands.some(b => sub.toLowerCase().includes(b)));
  if (brandFoundInSubdomain && !domainInfo.registeredDomain.toLowerCase().includes(brandFoundInSubdomain.toLowerCase())) {
    addPoint(35, 'Brand Name Impersonation in Subdomain', 'host', `Embeds well-known brand "${brandFoundInSubdomain}" inside a subdomain of an unrelated root domain.`);
    indicators.push({
      name: 'Brand Name Impersonation in Subdomain',
      category: 'host',
      severity: 'high',
      status: 'risk',
      description: `The URL includes "${brandFoundInSubdomain}" in its subdomain, but the actual registered root domain is "${domainInfo.registeredDomain}".`,
      whyItMatters: 'This is a hallmark phishing technique where users see the brand name and assume the site is official.',
      impactPoints: 35,
      iconType: 'danger',
      recommendation: 'Do NOT trust this site. The website belongs to the owner of the root domain, not the brand named in the subdomain.',
    });
  }

  // 9. Hostname & Complete URL Length
  const hostnameLength = parsed.hostname.length;
  const urlLength = rawInput.length;

  if (hostnameLength > 30) {
    const pts = hostnameLength > 45 ? 20 : 15;
    addPoint(pts, 'Abnormally Long Hostname', 'host', `Hostname is ${hostnameLength} characters long.`);
    indicators.push({
      name: 'Abnormally Long Hostname',
      category: 'host',
      severity: 'low',
      status: 'warning',
      description: `The domain name is unusually long (${hostnameLength} characters).`,
      whyItMatters: 'Overly long hostnames are often generated by automated phishing domain generation algorithms (DGAs).',
      impactPoints: pts,
      iconType: 'alert',
      recommendation: 'Verify the authenticity of the organization associated with this domain.',
    });
  }

  // Check for excessive hyphens in hostname (keyword concatenation)
  const hyphenCount = (parsed.hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    addPoint(10, 'Excessive Hyphens in Hostname', 'host', `Hostname contains ${hyphenCount} hyphens.`);
    indicators.push({
      name: 'Excessive Hyphens in Domain',
      category: 'host',
      severity: 'low',
      status: 'warning',
      description: `The domain name contains ${hyphenCount} hyphens, a technique frequently used to concatenate multiple urgent keywords.`,
      whyItMatters: 'Scam domains concatenate keywords (e.g. instant-cashback-kyc-verify) to create a false impression of legitimacy.',
      impactPoints: 10,
      iconType: 'alert',
      recommendation: 'Check the official brand name to see if it normally uses hyphens.',
    });
  }

  if (urlLength > 180) {
    addPoint(15, 'Excessive Complete URL Length', 'general', `Total URL length is ${urlLength} characters.`);
    indicators.push({
      name: 'Excessive Total URL Length',
      category: 'general',
      severity: 'low',
      status: 'warning',
      description: `The complete URL length exceeds 180 characters (${urlLength} characters).`,
      whyItMatters: 'Exceptionally long URLs push suspicious domains out of view on smaller screens and mobile web browsers.',
      impactPoints: 15,
      iconType: 'alert',
      recommendation: 'Inspect the root domain rather than the long trail of path and query parameters.',
    });
  }

  // 10. Non-Standard Port
  let hasUnusualPort = false;
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    const isStandardPort = (isHttps && portNum === 443) || (!isHttps && portNum === 80);
    if (!isStandardPort) {
      hasUnusualPort = true;
      addPoint(20, `Non-Standard Web Port (:${parsed.port})`, 'protocol', 'Operates web services on non-standard ports.');
      indicators.push({
        name: `Non-Standard Web Port (:${parsed.port})`,
        category: 'protocol',
        severity: 'medium',
        status: 'warning',
        description: `The URL specifies a custom communication port (:${parsed.port}) instead of standard web ports 80 or 443.`,
        whyItMatters: 'Phishing hosts and illicit command servers often host ad-hoc web pages on high numbered ports (e.g. 8080, 8888, 3000) to avoid standard web filters.',
        impactPoints: 20,
        iconType: 'alert',
        recommendation: 'Ensure you recognize why this server requires connecting to a non-standard port.',
      });
    }
  }

  // 11. Suspicious File Extensions (Executables, Scripts, APKs)
  const lowerPath = parsed.pathname.toLowerCase();
  const dangerousExt = DANGEROUS_FILE_EXTENSIONS.find(ext => lowerPath.endsWith(ext) || lowerPath.includes(`${ext}/`));
  const hasDangerousExtension = !!dangerousExt;

  if (hasDangerousExtension) {
    const pts = dangerousExt === '.apk' || dangerousExt === '.exe' ? 35 : 25;
    addPoint(pts, `Dangerous Executable Package (${dangerousExt}) in Path`, 'path', 'Direct link to an executable application or script.');
    indicators.push({
      name: `Direct Link to Executable File (${dangerousExt})`,
      category: 'path',
      severity: 'critical',
      status: 'risk',
      description: `The URL directly downloads or references an executable software file (${dangerousExt}).`,
      whyItMatters: 'Malware campaigns frequently distribute unauthorized APKs or Windows executables masquerading as "security updates" or "tax calculators".',
      impactPoints: pts,
      iconType: 'danger',
      recommendation: 'Do NOT download or install files from this link. Only install applications from verified official app stores.',
    });
  }

  // 12. Open Redirect Parameters
  const paramKeys = Array.from(parsed.searchParams.keys());
  const paramCount = paramKeys.length;
  const hasOpenRedirectParam = paramKeys.some(key => OPEN_REDIRECT_PARAM_KEYS.has(key.toLowerCase()));

  if (hasOpenRedirectParam) {
    addPoint(15, 'Potential Open-Redirect Query Parameter', 'query', 'Contains redirect/url parameter that may bounce visitors to an external unverified page.');
    indicators.push({
      name: 'Potential Open-Redirect Parameter Detected',
      category: 'query',
      severity: 'medium',
      status: 'warning',
      description: 'The URL includes a redirection query parameter (e.g. ?redirect= or ?url=) that points to an external destination.',
      whyItMatters: 'Attackers abuse open redirect vulnerabilities on reputable sites to bypass spam filters and bounce users to credential harvesters.',
      impactPoints: 15,
      iconType: 'alert',
      recommendation: 'Ensure you verify the ultimate destination URL specified in the query parameter.',
    });
  }

  // 13. Excessive Query Parameters
  const hasExcessiveParams = paramCount >= 5;
  if (hasExcessiveParams) {
    addPoint(10, `Excessive Query Parameters (${paramCount} parameters)`, 'query', 'Carries an unusually heavy query payload.');
    indicators.push({
      name: 'High Query Parameter Volume',
      category: 'query',
      severity: 'low',
      status: 'warning',
      description: `The URL contains ${paramCount} query parameters.`,
      whyItMatters: 'While tracking systems use query parameters, high volumes of parameters are often employed in tracking victim click-tokens and evasion.',
      impactPoints: 10,
      iconType: 'alert',
      recommendation: 'Review query parameters for any personal data or email addresses included in clear text.',
    });
  }

  // 14. URL Encoding & Double Encoding
  const encodedMatches = rawInput.match(/%[0-9a-fA-F]{2}/g) || [];
  const encodedCount = encodedMatches.length;
  const hasDoubleEncoding = /%25[0-9a-fA-F]{2}/i.test(rawInput);
  const hasSuspiciousEncoding = encodedCount >= 4 || hasDoubleEncoding;

  if (hasSuspiciousEncoding) {
    const pts = hasDoubleEncoding ? 25 : 15;
    addPoint(pts, hasDoubleEncoding ? 'Double URL Encoding Detected (%25)' : 'Excessive Percent-Encoding in URL', 'syntax', 'Uses multiple hex escape sequences to obscure path components.');
    indicators.push({
      name: hasDoubleEncoding ? 'Double URL Encoding (%25) Detected' : 'Excessive URL Percent-Encoding',
      category: 'syntax',
      severity: hasDoubleEncoding ? 'high' : 'medium',
      status: 'warning',
      description: hasDoubleEncoding
        ? 'The URL contains double-encoded characters (%25..), a technique often used to evade web application firewalls and filters.'
        : `The URL contains ${encodedCount} percent-encoded hexadecimal sequences.`,
      whyItMatters: 'Attackers use heavy URL encoding to conceal malicious scripts, directory traversal sequences, or phishing target names from visual inspection.',
      impactPoints: pts,
      iconType: 'alert',
      recommendation: 'Be cautious of addresses that heavily mask words behind hexadecimal percentages.',
    });
  }

  // 15. Suspicious Path Patterns (Directory traversal, consecutive slashes)
  const hasDirectoryTraversal = rawInput.includes('/../') || rawInput.includes('\\..\\');
  const hasMultipleSlashes = /\/{3,}/.test(rawInput) || (parsed.pathname.match(/\/\//g) || []).length > 0;
  if (hasDirectoryTraversal || hasMultipleSlashes) {
    addPoint(20, 'Suspicious Path Separator Anomalies', 'path', 'Contains path traversal or repeated slashes.');
    indicators.push({
      name: 'Suspicious Path Separators',
      category: 'path',
      severity: 'medium',
      status: 'warning',
      description: 'The URL path contains abnormal separators, such as repeated slashes or directory traversal markers (..).',
      whyItMatters: 'Abnormal path formatting is frequently used in web vulnerability exploitation and URL parsing confusion attacks.',
      impactPoints: 20,
      iconType: 'alert',
      recommendation: 'Check the path structure carefully before interacting with this site.',
    });
  }

  // 16. Suspicious Keywords (Auth, Urgency, Financial)
  const fullUrlLower = rawInput.toLowerCase();
  const foundAuthKeywords = AUTH_URGENCY_KEYWORDS.filter(k => fullUrlLower.includes(k));
  const foundFinancialKeywords = FINANCIAL_KEYWORDS.filter(k => fullUrlLower.includes(k));
  const allKeywordsFound = Array.from(new Set([...foundAuthKeywords, ...foundFinancialKeywords]));
  const hasSuspiciousKeywords = allKeywordsFound.length > 0;

  if (hasSuspiciousKeywords) {
    // Only add points if keywords appear outside of recognized trusted government or educational domains
    const isGovOrEdu = tld.endsWith('gov.in') || tld.endsWith('edu.in') || tld.endsWith('gov.uk') || tld.endsWith('gov');
    if (!isGovOrEdu) {
      const pts = allKeywordsFound.length >= 3 ? 20 : 10;
      addPoint(pts, `Sensitive Keywords Detected (${allKeywordsFound.slice(0, 3).join(', ')})`, 'general', 'Contains credential, urgency, or financial terminology.');
      indicators.push({
        name: 'Urgency & Financial Keywords Present',
        category: 'general',
        severity: 'low',
        status: 'warning',
        description: `The URL contains keywords often used in credential harvesting or social engineering: ${allKeywordsFound.slice(0, 4).join(', ')}.`,
        whyItMatters: 'Social engineering links rely on high-urgency keywords to coerce victims into rapid compliance before verifying legitimacy.',
        impactPoints: pts,
        iconType: 'alert',
        recommendation: 'Keywords like "login" or "kyc" on unfamiliar domains are a strong signal to verify the organization through its official app or bookmark.',
      });
    }
  }

  // 17. Suspicious Characters in Host (Repeated hyphens, underscores)
  const suspiciousChars: string[] = [];
  if (parsed.hostname.includes('--') && !isPunycode) suspiciousChars.push('consecutive hyphens');
  if (parsed.hostname.includes('_')) suspiciousChars.push('underscores in host');
  if (suspiciousChars.length > 0) {
    addPoint(10, 'Unusual Hostname Characters', 'host', 'Host contains non-standard characters like double-hyphens or underscores.');
    indicators.push({
      name: 'Unusual Hostname Character Structure',
      category: 'host',
      severity: 'low',
      status: 'warning',
      description: `The hostname contains irregular formatting: ${suspiciousChars.join(', ')}.`,
      whyItMatters: 'Phishing domains often insert hyphens to approximate legitimate brand names (e.g. support--login.com).',
      impactPoints: 10,
      iconType: 'alert',
      recommendation: 'Check the exact spelling against the official brand website.',
    });
  }

  // Cap structural score at 100
  const finalStructuralScore = Math.min(Math.max(structuralScore, 0), 100);

  // Generate plain-English explanation
  let explanation = '';
  if (finalStructuralScore >= 60) {
    explanation = 'High structural risk: The URL exhibits multiple deceptive anomalies, such as non-standard ports, userinfo deception, raw IP addresses, or dangerous executable files.';
  } else if (finalStructuralScore >= 30) {
    explanation = 'Medium structural risk: The URL displays ambiguous characteristics, such as unusual domain depth, unencrypted protocol, or link-shortening patterns.';
  } else {
    explanation = 'Low structural risk: The URL syntax conforms to standard web security conventions with valid encryption and normal domain hierarchy.';
  }

  // Recommendations
  const recommendations: string[] = [];
  if (finalStructuralScore >= 60) {
    recommendations.push('Do NOT open this link or enter passwords, OTPs, or financial information.');
    recommendations.push('Access the organization directly through its verified official mobile application or a bookmarked browser link.');
    recommendations.push('If you received this link in an SMS or email, report it to the platform or your organization security team.');
  } else if (finalStructuralScore >= 30) {
    recommendations.push('Do not enter sensitive login credentials until you independently verify the domain root.');
    recommendations.push('Inspect the root domain carefully before clicking any buttons on the landing page.');
  } else {
    recommendations.push('Continue to verify the website through trusted sources before entering sensitive personal credentials.');
    recommendations.push('Remember that clean URL syntax alone does not prove that a website has not been compromised.');
  }

  return {
    normalizedUrl,
    wasNormalized: norm.wasNormalized,
    normalizationNote: norm.normalizationNotes.join(' '),
    isValid: true,
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port || undefined,
    pathname: parsed.pathname,
    search: parsed.search || undefined,
    isHttps,
    isIpAddress,
    ipType,
    isPrivateOrLocalIp: isPrivateIp,
    hasAtSymbol,
    subdomainCount,
    subdomains: domainInfo.subdomains,
    registeredDomain: domainInfo.registeredDomain,
    isPunycode,
    punycodeDetails: isPunycode ? `Punycode encoded ASCII representation: ${parsed.hostname}` : undefined,
    hasHomographRisk,
    unicodeAnalysis: { isPunycode, containsNonAscii: nonAsciiMatch },
    isShortenedUrl,
    shortenerDomain: isShortenedUrl ? parsed.hostname : undefined,
    hasSuspiciousKeywords,
    suspiciousKeywordsFound: allKeywordsFound,
    hasExcessiveParams,
    paramCount,
    hasOpenRedirectParam,
    hasSuspiciousEncoding,
    encodedSequencesCount: encodedCount,
    hasDoubleEncoding,
    suspiciousCharacters: suspiciousChars,
    hasUnusualPort,
    hasDangerousExtension,
    dangerousExtension: dangerousExt,
    urlLength,
    hostnameLength,
    structuralScore: finalStructuralScore,
    indicators,
    scoreBreakdown,
    explanation,
    recommendations,
  };
}

/**
 * Combined Layered Threat Assessment Engine.
 * Synthesizes:
 * 1. Local Structural Heuristic Analysis
 * 2. Real Threat Intelligence & Reputation Feeds
 * 3. Layered Verification Checks list
 * 4. Deterministic Risk Level (0-29 Low Risk, 30-59 Medium Risk, 60-100 High Risk)
 */
export async function analyzeUrlSafety(inputUrl: string): Promise<UrlScanAssessment> {
  const trimmed = (inputUrl || '').trim();

  // Handle empty input
  if (!trimmed) {
    const emptyReport: ThreatIntelligenceReport = {
      status: 'INVALID URL',
      provider: 'CyberSafe Detection Engine',
      threatTypes: [],
      checkedAt: new Date().toISOString(),
      isAvailable: false,
      disclaimer: STANDARD_LIMITATIONS[0],
    };

    return {
      rawInput: '',
      normalizedUrl: '',
      wasNormalized: false,
      isValid: false,
      protocol: '',
      hostname: '',
      pathname: '',
      isHttps: false,
      isIpAddress: false,
      hasAtSymbol: false,
      subdomainCount: 0,
      subdomains: [],
      registeredDomain: '',
      isPunycode: false,
      hasSuspiciousKeywords: false,
      suspiciousKeywordsFound: [],
      hasExcessiveParams: false,
      paramCount: 0,
      hasOpenRedirectParam: false,
      hasSuspiciousEncoding: false,
      encodedSequencesCount: 0,
      suspiciousCharacters: [],
      hasUnusualPort: false,
      hasDangerousExtension: false,
      urlLength: 0,
      hostnameLength: 0,
      structuralScore: 0,
      riskScore: 0,
      riskLevel: 'Low Risk',
      reputationReport: emptyReport,
      checksPerformed: [
        { id: 'syntax', name: 'URL Syntax & Normalization', status: 'failed', detail: 'No input provided.' },
      ],
      scoreBreakdown: [],
      indicators: [],
      explanation: 'Please enter a web address (URL) or paste a message to begin risk evaluation.',
      recommendations: ['Paste a link or message you wish to inspect before clicking.'],
      limitations: STANDARD_LIMITATIONS,
      redirectNotice: STANDARD_REDIRECT_NOTICE,
      errorMessage: 'No URL entered.',
      scannedAt: new Date().toISOString(),
    };
  }

  // Step 1: Run deterministic local structural analysis
  const struct = analyzeUrlStructure(trimmed);

  // If invalid URL, return immediate assessment
  if (!struct.isValid) {
    const invalidReport: ThreatIntelligenceReport = {
      status: 'INVALID URL',
      provider: 'CyberSafe Reputation Engine',
      threatTypes: [],
      checkedAt: new Date().toISOString(),
      isAvailable: false,
      details: struct.errorMessage,
      disclaimer: STANDARD_LIMITATIONS[0],
    };

    return {
      rawInput: trimmed,
      normalizedUrl: struct.normalizedUrl,
      wasNormalized: struct.wasNormalized,
      normalizationNote: struct.normalizationNote,
      isValid: false,
      protocol: struct.protocol,
      hostname: struct.hostname,
      pathname: struct.pathname,
      isHttps: struct.isHttps,
      isIpAddress: struct.isIpAddress,
      hasAtSymbol: struct.hasAtSymbol,
      subdomainCount: struct.subdomainCount,
      subdomains: struct.subdomains,
      registeredDomain: struct.registeredDomain,
      isPunycode: struct.isPunycode,
      hasSuspiciousKeywords: struct.hasSuspiciousKeywords,
      suspiciousKeywordsFound: struct.suspiciousKeywordsFound,
      hasExcessiveParams: struct.hasExcessiveParams,
      paramCount: struct.paramCount,
      hasOpenRedirectParam: struct.hasOpenRedirectParam,
      hasSuspiciousEncoding: struct.hasSuspiciousEncoding,
      encodedSequencesCount: struct.encodedSequencesCount,
      suspiciousCharacters: struct.suspiciousCharacters,
      hasUnusualPort: struct.hasUnusualPort,
      hasDangerousExtension: struct.hasDangerousExtension,
      urlLength: struct.urlLength,
      hostnameLength: struct.hostnameLength,
      structuralScore: struct.structuralScore,
      riskScore: struct.structuralScore,
      riskLevel: struct.structuralScore >= 60 ? 'High Risk' : struct.structuralScore >= 30 ? 'Medium Risk' : 'Low Risk',
      reputationReport: invalidReport,
      checksPerformed: [
        { id: 'syntax', name: 'URL Syntax & Structure', status: 'failed', detail: struct.errorMessage || 'Malformed syntax' },
        { id: 'threat-intel', name: 'Threat Intelligence Lookup', status: 'unavailable', detail: 'Skipped due to invalid URL syntax' },
      ],
      scoreBreakdown: struct.scoreBreakdown,
      indicators: struct.indicators,
      explanation: struct.explanation,
      recommendations: struct.recommendations,
      limitations: STANDARD_LIMITATIONS,
      redirectNotice: STANDARD_REDIRECT_NOTICE,
      errorMessage: struct.errorMessage,
      scannedAt: new Date().toISOString(),
    };
  }

  // Step 2: Query real threat intelligence layer
  const repReport = await checkUrlThreatIntelligence(struct.normalizedUrl);

  // Step 3: Combine structural risk and threat intelligence deterministically
  let combinedScore = struct.structuralScore;
  let combinedLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Low Risk';

  // Rule: Threat intelligence takes precedence if a known malicious classification exists
  if (
    repReport.status === 'KNOWN MALICIOUS' ||
    repReport.status === 'KNOWN PHISHING' ||
    repReport.status === 'KNOWN MALWARE'
  ) {
    // Elevate score to 90 - 98
    combinedScore = Math.max(combinedScore, 92);
    combinedLevel = 'High Risk';
  } else if (repReport.status === 'SUSPICIOUS') {
    combinedScore = Math.max(combinedScore, 45);
    combinedLevel = combinedScore >= 60 ? 'High Risk' : 'Medium Risk';
  } else {
    // Threat status is 'NO KNOWN THREAT FOUND' or 'THREAT INTELLIGENCE UNAVAILABLE'
    // Score is governed by structural heuristics
    if (combinedScore >= 60) {
      combinedLevel = 'High Risk';
    } else if (combinedScore >= 30) {
      combinedLevel = 'Medium Risk';
    } else {
      combinedLevel = 'Low Risk';
    }
  }

  // Final synthesized plain-English explanation
  let finalExplanation = struct.explanation;
  if (repReport.status === 'KNOWN PHISHING') {
    finalExplanation = `Confirmed Threat: This URL has been identified as an active phishing domain by threat intelligence sources (${repReport.threatTypes.join(', ')}).`;
  } else if (repReport.status === 'KNOWN MALWARE') {
    finalExplanation = `Confirmed Threat: This link is classified as a malware distribution point (${repReport.threatTypes.join(', ')}).`;
  } else if (repReport.status === 'KNOWN MALICIOUS') {
    finalExplanation = `Confirmed Threat: This address matches known malicious cybercrime infrastructure.`;
  } else if (repReport.status === 'SUSPICIOUS') {
    finalExplanation = `Elevated Caution: Threat reputation feeds report suspicious characteristics for this domain, combined with structural indicators.`;
  } else if (!repReport.isAvailable) {
    finalExplanation = `${struct.explanation} (Note: External threat-intelligence verification was unavailable; assessment is based entirely on local structural heuristics.)`;
  }

  // Recommended actions
  const finalRecommendations = [...struct.recommendations];
  if (repReport.status.startsWith('KNOWN')) {
    finalRecommendations.unshift('Do NOT enter passwords, OTPs, payment information or personal details.');
    finalRecommendations.unshift('Close this link immediately.');
  }

  // Build Checks Performed audit list
  const checksPerformed: CheckPerformedItem[] = [
    {
      id: 'url-syntax',
      name: 'URL Normalization & Syntax Check',
      status: 'passed',
      detail: struct.wasNormalized ? `Normalized to RFC-compliant format (${struct.normalizationNote})` : 'Valid RFC-compliant format',
    },
    {
      id: 'encryption',
      name: 'Transport Layer Security (HTTPS)',
      status: struct.isHttps ? 'passed' : 'warning',
      detail: struct.isHttps ? 'HTTPS TLS active (Note: does not guarantee safety)' : 'Unencrypted plain HTTP',
    },
    {
      id: 'host-type',
      name: 'Domain & Host Type Verification',
      status: struct.isIpAddress ? 'failed' : struct.isPunycode ? 'warning' : 'passed',
      detail: struct.isIpAddress ? 'Raw Numeric IP Address' : struct.isPunycode ? 'Punycode IDN Homograph' : 'Standard Named Domain',
    },
    {
      id: 'subdomain-depth',
      name: 'Domain Hierarchy & Subdomain Depth',
      status: struct.subdomainCount >= 3 ? 'warning' : 'passed',
      detail: `${struct.subdomainCount} subdomains detected (Root: ${struct.registeredDomain})`,
    },
    {
      id: 'path-query',
      name: 'Path, Parameter & Encoding Analysis',
      status: struct.hasDangerousExtension ? 'failed' : struct.hasOpenRedirectParam || struct.hasSuspiciousEncoding ? 'warning' : 'passed',
      detail: struct.hasDangerousExtension ? `Dangerous package (${struct.dangerousExtension})` : 'Clean path and query structure',
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence & Reputation Feeds',
      status: repReport.status.startsWith('KNOWN') ? 'failed' : repReport.status === 'SUSPICIOUS' ? 'warning' : repReport.isAvailable ? 'passed' : 'unavailable',
      detail: `${repReport.status} (${repReport.provider})`,
    },
  ];

  return {
    rawInput: trimmed,
    normalizedUrl: struct.normalizedUrl,
    wasNormalized: struct.wasNormalized,
    normalizationNote: struct.normalizationNote,
    isValid: true,
    protocol: struct.protocol,
    hostname: struct.hostname,
    port: struct.port,
    pathname: struct.pathname,
    search: struct.search,
    isHttps: struct.isHttps,
    isIpAddress: struct.isIpAddress,
    ipType: struct.ipType,
    isPrivateOrLocalIp: struct.isPrivateOrLocalIp,
    hasAtSymbol: struct.hasAtSymbol,
    subdomainCount: struct.subdomainCount,
    subdomains: struct.subdomains,
    registeredDomain: struct.registeredDomain,
    isPunycode: struct.isPunycode,
    punycodeDetails: struct.punycodeDetails,
    hasHomographRisk: struct.hasHomographRisk,
    unicodeAnalysis: struct.unicodeAnalysis,
    isShortenedUrl: struct.isShortenedUrl,
    shortenerDomain: struct.shortenerDomain,
    hasSuspiciousKeywords: struct.hasSuspiciousKeywords,
    suspiciousKeywordsFound: struct.suspiciousKeywordsFound,
    hasExcessiveParams: struct.hasExcessiveParams,
    paramCount: struct.paramCount,
    hasOpenRedirectParam: struct.hasOpenRedirectParam,
    hasSuspiciousEncoding: struct.hasSuspiciousEncoding,
    encodedSequencesCount: struct.encodedSequencesCount,
    hasDoubleEncoding: struct.hasDoubleEncoding,
    suspiciousCharacters: struct.suspiciousCharacters,
    hasUnusualPort: struct.hasUnusualPort,
    hasDangerousExtension: struct.hasDangerousExtension,
    dangerousExtension: struct.dangerousExtension,
    urlLength: struct.urlLength,
    hostnameLength: struct.hostnameLength,
    structuralScore: struct.structuralScore,
    riskScore: combinedScore,
    riskLevel: combinedLevel,
    reputationReport: repReport,
    checksPerformed,
    scoreBreakdown: struct.scoreBreakdown,
    indicators: struct.indicators,
    explanation: finalExplanation,
    recommendations: finalRecommendations,
    limitations: STANDARD_LIMITATIONS,
    redirectNotice: STANDARD_REDIRECT_NOTICE,
    errorMessage: undefined,
    scannedAt: new Date().toISOString(),
  };
}
