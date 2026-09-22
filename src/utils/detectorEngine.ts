import { UrlScanAssessment, UrlIndicator, UrlScoreBreakdownItem } from '../types';

// High-Risk disposable or heavily abused TLDs (statistically correlated with temporary spam/phishing infrastructure)
const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'loan', 'cfd', 'gq', 'tk', 'ml', 'ga', 
  'cc', 'buzz', 'rest', 'cam', 'vip', 'icu', 'sbs', 'monster', 'hair', 
  'bond', 'fit', 'beauty', 'surf', 'country', 'stream', 'party', 'gdn'
]);

// URL Shortener Domains that mask the real destination
const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'rebrand.ly', 
  'cutt.ly', 'tiny.cc', 'shorturl.at', 'bl.ink', 'trib.al'
]);

// High-Risk Executable or Script File Extensions
const DANGEROUS_FILE_EXTENSIONS = [
  '.exe', '.scr', '.apk', '.bat', '.cmd', '.vbs', '.ps1', '.iso', '.zip', 
  '.jar', '.dmg', '.msi', '.hta', '.pif', '.reg', '.tar.gz'
];

// Open Redirect Query Parameter Keys
const OPEN_REDIRECT_PARAM_KEYS = new Set([
  'redirect', 'redirect_uri', 'redirect_url', 'url', 'next', 'dest', 
  'destination', 'target', 'return', 'return_url', 'goto', 'r', 'out', 'link'
]);

// Keywords associated with Phishing, Account Panic, and Financial Exploits
const AUTH_URGENCY_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security', 
  'account', 'update', 'confirm', 'password', 'recovery', 'recover', 
  'unlock', 'suspended', 'urgent', 'alert', 're-activate', 'validate'
];

const FINANCIAL_KEYWORDS = [
  'banking', 'netbanking', 'wallet', 'billing', 'invoice', 'refund', 
  'cashback', 'kyc', 'pan-card', 'aadhaar', 'lottery', 'prize', 
  'tax-refund', 'upi-pin', 'rewards', 'payout', 'crypto', 'bonus'
];

// Multi-part country-code TLDs for accurate registered domain parsing
const MULTI_PART_TLDS = new Set([
  'co.in', 'gov.in', 'ac.in', 'org.in', 'net.in', 'res.in', 'edu.in',
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'net.uk',
  'com.au', 'net.au', 'org.au', 'gov.au', 'edu.au',
  'co.nz', 'org.nz', 'govt.nz',
  'co.za', 'gov.za',
  'com.br', 'gov.br',
  'com.sg', 'gov.sg',
  'co.jp', 'ne.jp', 'ac.jp', 'go.jp'
]);

// IPv4 regular expression
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Parses registered domain and subdomains accurately considering two-part ccTLDs.
 */
function parseDomainParts(hostname: string): { registeredDomain: string; subdomains: string[]; tld: string } {
  const parts = hostname.toLowerCase().split('.').filter(Boolean);
  if (parts.length <= 1) {
    return { registeredDomain: hostname, subdomains: [], tld: parts[0] || '' };
  }

  // Check for multi-part TLD (e.g., .co.in, .gov.in)
  if (parts.length >= 3) {
    const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    if (MULTI_PART_TLDS.has(lastTwo)) {
      const registeredDomain = `${parts[parts.length - 3]}.${lastTwo}`;
      const subdomains = parts.slice(0, parts.length - 3);
      return { registeredDomain, subdomains, tld: lastTwo };
    }
  }

  // Standard single-part TLD (e.g., .com, .org, .xyz)
  const tld = parts[parts.length - 1];
  const registeredDomain = `${parts[parts.length - 2]}.${tld}`;
  const subdomains = parts.slice(0, parts.length - 2);
  return { registeredDomain, subdomains, tld };
}

/**
 * Standard Educational Limitations Notice.
 */
const STANDARD_LIMITATIONS = [
  'Heuristic analysis inspects address syntax, structural composition, and known deceptive patterns purely on the client side.',
  'It cannot evaluate server-side runtime behavior or detect if an otherwise legitimate domain has been compromised.',
  'A Low Risk score indicates that no suspicious syntactic anomalies were detected, but it does not guarantee that the webpage content is benign.',
  'Remote HTTP redirects (301/302 status codes) cannot be determined without connecting to the server, which CyberSafe avoids to preserve your safety and privacy.'
];

const STANDARD_REDIRECT_NOTICE = 
  'Note on HTTP Redirects: Server-side HTTP redirects (such as 301/302 status codes or JavaScript meta-refreshes) cannot be determined without actively connecting to the remote web server. Because CyberSafe maintains a strict zero-contact security boundary to protect your device from drive-by malware and tracking, remote redirect chains are not followed.';

/**
 * Safely analyzes a suspicious URL string purely on the client-side.
 * CRITICAL ZERO-CONTACT ARCHITECTURE:
 * Never visits, crawls, fetches, executes, or renders the target URL.
 * Treats the input strictly as an untrusted text string.
 */
export function analyzeUrlSafety(inputUrl: string): UrlScanAssessment {
  const trimmed = (inputUrl || '').trim();

  // 1. Empty or whitespace-only input
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
      riskScore: 0,
      riskLevel: 'Low Risk',
      scoreBreakdown: [],
      indicators: [],
      explanation: 'Please enter a web address (URL) to begin the heuristic evaluation.',
      recommendations: ['Paste a link you wish to inspect before opening it in your browser.'],
      limitations: STANDARD_LIMITATIONS,
      redirectNotice: STANDARD_REDIRECT_NOTICE,
      errorMessage: 'No URL entered.'
    };
  }

  // 2. Syntax Sanity & Malformed Character Pre-Checks
  // Reject URLs with embedded spaces or raw unescaped control characters
  const hasEmbeddedSpaces = /\s/.test(trimmed);
  const hasInvalidBrackets = (trimmed.match(/\[/g) || []).length !== (trimmed.match(/\]/g) || []).length;
  const hasMultipleAt = (trimmed.match(/@/g) || []).length > 1;

  // Check for dangerous non-web schemes directly in raw input
  const rawSchemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  const rawScheme = rawSchemeMatch ? rawSchemeMatch[1].toLowerCase() : '';
  const isDangerousScheme = ['javascript', 'data', 'file', 'blob', 'vbscript'].includes(rawScheme);

  // Normalize scheme for standard Web URLs if user omitted it
  let urlString = trimmed;
  let missingScheme = false;
  if (!rawScheme) {
    // If user provided domain like "example.com" or "192.168.1.1"
    urlString = 'https://' + trimmed;
    missingScheme = true;
  }

  let parsed: URL;
  try {
    if (hasEmbeddedSpaces || hasInvalidBrackets || hasMultipleAt) {
      throw new Error('Malformed URL formatting');
    }
    parsed = new URL(urlString);
    if (!parsed.hostname && !isDangerousScheme) {
      throw new Error('Missing hostname');
    }
  } catch {
    // Malformed URL response
    const malformedIndicators: UrlIndicator[] = [
      {
        name: 'Invalid or Malformed URL Syntax',
        category: 'syntax',
        status: 'risk',
        description: 'The string could not be parsed as a standard RFC-compliant web address. Malformed URLs often exploit parser differentials between security filters and web browsers.',
        whyItMatters: 'Attackers intentionally format malformed links with illegal characters, double schemes, or broken authorities to trigger unexpected parser behaviors or hide the true destination domain.',
        impactPoints: 65,
        iconType: 'danger'
      }
    ];

    const malformedBreakdown: UrlScoreBreakdownItem[] = [
      {
        indicatorName: 'Invalid or Malformed URL Syntax',
        category: 'syntax',
        points: 65,
        reason: 'Failed standard RFC URL syntax parsing due to illegal characters, broken structure, or invalid scheme.'
      }
    ];

    return {
      rawInput: trimmed,
      isValid: false,
      protocol: rawScheme ? `${rawScheme}:` : 'invalid',
      hostname: 'invalid',
      pathname: '',
      isHttps: false,
      isIpAddress: false,
      hasAtSymbol: trimmed.includes('@'),
      subdomainCount: 0,
      subdomains: [],
      registeredDomain: 'invalid',
      isPunycode: false,
      hasSuspiciousKeywords: false,
      suspiciousKeywordsFound: [],
      hasExcessiveParams: false,
      paramCount: 0,
      hasOpenRedirectParam: false,
      hasSuspiciousEncoding: /%[0-9a-fA-F]{2}/.test(trimmed),
      encodedSequencesCount: (trimmed.match(/%[0-9a-fA-F]{2}/g) || []).length,
      suspiciousCharacters: hasEmbeddedSpaces ? ['Space character (\\s)'] : ['Malformed syntax sequence'],
      hasUnusualPort: false,
      hasDangerousExtension: false,
      urlLength: trimmed.length,
      hostnameLength: 0,
      riskScore: 65,
      riskLevel: 'High Risk',
      scoreBreakdown: malformedBreakdown,
      indicators: malformedIndicators,
      explanation: 'The entered text is not a valid RFC-compliant URL structure. Malformed addresses present high risk because browsers may interpret or normalize them unpredictably.',
      recommendations: [
        'Do not click or open this string in emails or messages.',
        'Never paste malformed addresses directly into your browser address bar.',
        'Look up the official organization directly via a trusted search engine or known bookmark.'
      ],
      limitations: STANDARD_LIMITATIONS,
      redirectNotice: STANDARD_REDIRECT_NOTICE,
      errorMessage: 'Invalid URL syntax: Address failed standard RFC URI parsing specifications.'
    };
  }

  // Successfully parsed URL components
  const protocol = parsed.protocol.toLowerCase();
  const hostname = (parsed.hostname || '').toLowerCase().replace(/\.$/, ''); // strip trailing dot
  const port = parsed.port;
  const pathname = parsed.pathname;
  const search = parsed.search;
  const urlLength = trimmed.length;
  const hostnameLength = hostname.length;

  const indicators: UrlIndicator[] = [];
  const scoreBreakdown: UrlScoreBreakdownItem[] = [];

  // Helper to transparently record points
  const addIndicatorScore = (
    name: string,
    category: 'protocol' | 'host' | 'path' | 'query' | 'syntax' | 'general',
    status: 'positive' | 'warning' | 'risk',
    description: string,
    whyItMatters: string,
    points: number,
    iconType: 'check' | 'alert' | 'danger'
  ) => {
    indicators.push({
      name,
      category,
      status,
      description,
      whyItMatters,
      impactPoints: points,
      iconType
    });
    if (points > 0) {
      scoreBreakdown.push({
        indicatorName: name,
        category,
        points,
        reason: description
      });
    }
  };

  // ==========================================
  // 1. PROTOCOL & HTTPS ANALYSIS
  // ==========================================
  const isHttps = protocol === 'https:';
  if (isHttps) {
    addIndicatorScore(
      'HTTPS TLS Encryption Active',
      'protocol',
      'positive',
      'The link uses HTTPS encryption (TLS), protecting network transit against eavesdropping and tampering.',
      'HTTPS guarantees that communication between your browser and the remote server is encrypted. Note: While essential for privacy, HTTPS does not guarantee that the website content or owner is trustworthy.',
      0,
      'check'
    );
  } else if (protocol === 'http:') {
    addIndicatorScore(
      'Unencrypted Plain HTTP Protocol (No TLS)',
      'protocol',
      'risk',
      'The URL uses plain unencrypted HTTP. Any passwords, credentials, or personal information submitted over this connection are transmitted in cleartext.',
      'Unencrypted HTTP connections are vulnerable to Man-in-the-Middle (MitM) eavesdropping, session token hijacking, and content tampering on local networks (such as public Wi-Fi).',
      25,
      'danger'
    );
  } else {
    addIndicatorScore(
      `Dangerous or Non-Standard Protocol (${protocol})`,
      'protocol',
      'risk',
      `The URL specifies a non-standard protocol (${protocol}) rather than standard HTTP/HTTPS web schemes.`,
      'Protocols such as javascript:, data:, or custom application schemes can execute client-side code directly or launch local applications without web security sandbox boundaries.',
      40,
      'danger'
    );
  }

  // ==========================================
  // 2. UNUSUAL NETWORK PORT ANALYSIS
  // ==========================================
  const isStandardPort = !port || (isHttps && port === '443') || (protocol === 'http:' && port === '80');
  const hasUnusualPort = !isStandardPort;
  if (hasUnusualPort) {
    addIndicatorScore(
      `Non-Standard Network Port (:${port})`,
      'protocol',
      'warning',
      `The address specifies an uncommon web port (:${port}) instead of default web ports (80 for HTTP, 443 for HTTPS).`,
      'Legitimate public services almost never require users to specify custom port numbers. Attackers frequently run phishing kits, backdoors, or rogue web servers on non-standard ports (like 8080, 8443, 8888, or 3000) to host services on residential connections or bypass corporate gateway firewalls.',
      20,
      'alert'
    );
  }

  // ==========================================
  // 3. HOSTNAME & IP ADDRESS ANALYSIS
  // ==========================================
  const isIpv4 = IPV4_REGEX.test(hostname);
  const isIpv6 = (hostname.startsWith('[') && hostname.endsWith(']')) || hostname.includes(':');
  const isNumericIntegerIp = /^\d+$/.test(hostname);
  const isIpAddress = isIpv4 || isIpv6 || isNumericIntegerIp;
  const ipType = isIpv6 ? 'ipv6' : isIpAddress ? 'ipv4' : undefined;

  if (isIpAddress) {
    addIndicatorScore(
      `Direct Numeric IP Address (${ipType?.toUpperCase() || 'IP'}) in Place of Domain`,
      'host',
      'risk',
      'The destination is addressed directly by raw IP address rather than a registered DNS domain name.',
      'Legitimate consumer services rely on human-readable domain names for branding, SSL certificate validation, and reputation management. Scammers deploy phishing pages directly on raw IP addresses to evade domain takedown requests and avoid registering whois identity records.',
      40,
      'danger'
    );
  } else {
    addIndicatorScore(
      'Standard DNS Domain Name Format',
      'host',
      'positive',
      'The host uses standard DNS naming rather than an unmapped raw IP address.',
      'DNS names are bound by registrar regulations, certificate transparency monitoring, and whois accountability.',
      0,
      'check'
    );
  }

  // Parse Domain Hierarchy (Registered Domain vs Subdomains)
  const { registeredDomain, subdomains, tld } = parseDomainParts(hostname);
  const subdomainCount = subdomains.length;

  // ==========================================
  // 4. SUBDOMAIN STACKING ANALYSIS
  // ==========================================
  if (!isIpAddress && subdomainCount >= 3) {
    addIndicatorScore(
      `Excessive Subdomain Stacking (${subdomainCount} subdomains: ${subdomains.join('.')})`,
      'host',
      'warning',
      `The hostname contains ${subdomainCount} separate subdomain levels before the root domain (${registeredDomain}).`,
      'Attackers frequently chain multiple subdomains containing trusted institution names (e.g., login.sbi.bank.attacker.com) to exploit small mobile phone address bars that truncate the real registered domain at the end.',
      20,
      'alert'
    );
  } else if (!isIpAddress && subdomainCount <= 2) {
    addIndicatorScore(
      'Normal Subdomain Hierarchy',
      'host',
      'positive',
      'The domain depth adheres to standard organizational web practices.',
      'Standard domain depth reduces confusion and makes the true registered service clear to the user.',
      0,
      'check'
    );
  }

  // ==========================================
  // 5. HIGH-RISK DISPOSABLE TLD ANALYSIS
  // ==========================================
  if (!isIpAddress && HIGH_RISK_TLDS.has(tld)) {
    addIndicatorScore(
      `High-Risk / Low-Cost Top-Level Domain (.${tld})`,
      'host',
      'warning',
      `The domain ends with ".${tld}". This extension has a statistically elevated association with temporary phishing campaigns.`,
      'Certain TLDs offer ultra-cheap or unverified domain registrations, making them widely favored for short-lived phishing campaigns that are discarded once blacklisted.',
      20,
      'alert'
    );
  }

  // ==========================================
  // 6. URL SHORTENER SERVICE ANALYSIS
  // ==========================================
  const isShortener = SHORTENER_DOMAINS.has(hostname) || SHORTENER_DOMAINS.has(registeredDomain);
  if (isShortener) {
    addIndicatorScore(
      `URL Shortener Service Detected (${hostname})`,
      'host',
      'warning',
      `The address belongs to a link-shortening service (${hostname}) that masks the real destination website.`,
      'Link shorteners hide the real destination domain, path, and security posture. Cyber criminals use them extensively in SMS (smishing) and social media messages so recipients cannot inspect the domain before clicking.',
      20,
      'alert'
    );
  }

  // ==========================================
  // 7. PUNYCODE & HOMOGRAPH ATTACK ANALYSIS
  // ==========================================
  const isPunycode = hostname.includes('xn--');
  // Also check for non-ASCII characters in raw input
  const nonAsciiMatch = trimmed.match(/[^\x00-\x7F]/g);
  if (isPunycode || (nonAsciiMatch && nonAsciiMatch.length > 0)) {
    addIndicatorScore(
      'Punycode / Internationalized Domain Name (xn--)',
      'host',
      'warning',
      'The domain utilizes Punycode encoding or mixed international characters.',
      'While legitimate for international languages, Punycode is frequently abused for homoglyph attacks—registering domains where Cyrillic, Greek, or Latin characters look identical to familiar brand letters (e.g. replacing Latin "a" with Cyrillic "а") to trick users.',
      30,
      'alert'
    );
  }

  // ==========================================
  // 8. EMBEDDED "@" SYMBOL IN AUTHORITY (USERINFO DECEPTION)
  // ==========================================
  // RFC 3986 specifies that @ in the authority separates userinfo from the host.
  // Attackers write https://google.com@phishing.com so users only notice the trusted prefix.
  // Note: An @ in the query string (?email=user@domain.com) is NOT userinfo deception.
  const authorityPart = trimmed
    .replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0];
  const hasAtSymbol = authorityPart.includes('@') || Boolean(parsed.username) || Boolean(parsed.password);

  if (hasAtSymbol) {
    addIndicatorScore(
      'Embedded "@" Character in Authority (Userinfo Deception)',
      'syntax',
      'risk',
      'The URL contains an "@" symbol in the authority component before the hostname.',
      'According to standard URL specifications (RFC 3986), any characters appearing BEFORE the "@" are treated as username credentials, and the browser navigates to the hostname placed AFTER the "@". Scammers exploit this by writing "https://google.com@phishing-trap.com" so users mistakenly think they are visiting Google.',
      45,
      'danger'
    );
  }

  // ==========================================
  // 9. DANGEROUS FILE EXTENSION IN PATH
  // ==========================================
  const matchedExt = DANGEROUS_FILE_EXTENSIONS.find(ext => pathname.toLowerCase().endsWith(ext));
  const hasDangerousExtension = Boolean(matchedExt);
  if (hasDangerousExtension) {
    addIndicatorScore(
      `Dangerous Executable or Package File in Path (${matchedExt})`,
      'path',
      'risk',
      `The URL path terminates with an executable program, script, or installation package (${matchedExt}).`,
      'Direct links pointing to executable packages or scripts (.apk, .exe, .scr, .bat) frequently initiate automatic drive-by downloads of malware, remote-access trojans, or spyware when opened.',
      40,
      'danger'
    );
  }

  // ==========================================
  // 10. SUSPICIOUS CHARACTERS & URL ENCODING
  // ==========================================
  const percentMatches = (trimmed.match(/%[0-9a-fA-F]{2}/g) || []).length;
  const hasDoubleEncoding = /%25[0-9a-fA-F]{2}/i.test(trimmed);
  const hasNullByte = /%00|\0/.test(trimmed);
  const hasDirectoryTraversal = /\/\.\.\/|\.\.%2f|\/\.\.%2f/i.test(trimmed) || pathname.includes('//');
  
  const suspiciousCharacters: string[] = [];
  if (hasNullByte) suspiciousCharacters.push('Null Byte (%00)');
  if (hasDoubleEncoding) suspiciousCharacters.push('Double Percent-Encoding (%25xx)');
  if (hasDirectoryTraversal) suspiciousCharacters.push('Directory Traversal (/../ or //)');

  const hasSuspiciousEncoding = percentMatches >= 3 || hasDoubleEncoding || hasNullByte || hasDirectoryTraversal;
  if (hasSuspiciousEncoding) {
    const points = (hasNullByte || hasDoubleEncoding) ? 25 : 15;
    addIndicatorScore(
      `Heavy Character Encoding or Obfuscation (${percentMatches} encoded sequences)`,
      'syntax',
      'warning',
      `The URL exhibits obfuscated sequences: ${suspiciousCharacters.join(', ') || `${percentMatches} percent-encoded bytes`}.`,
      'Attackers use multiple percent-encodings, null bytes, or traversal sequences to disguise keywords, bypass security gateway inspection rules, or manipulate web application routing.',
      points,
      'alert'
    );
  }

  // ==========================================
  // 11. QUERY PARAMETERS & OPEN REDIRECT MARKERS
  // ==========================================
  let paramCount = 0;
  let hasOpenRedirectParam = false;
  let openRedirectKey = '';
  let hasTargetedEmail = false;

  try {
    parsed.searchParams.forEach((value, key) => {
      paramCount++;
      const lowerKey = key.toLowerCase();
      if (OPEN_REDIRECT_PARAM_KEYS.has(lowerKey)) {
        hasOpenRedirectParam = true;
        openRedirectKey = key;
      }
      if (lowerKey === 'email' || lowerKey === 'victim' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        hasTargetedEmail = true;
      }
    });
  } catch {
    paramCount = 0;
  }

  if (hasOpenRedirectParam) {
    addIndicatorScore(
      `Potential Open-Redirect Parameter Detected (?${openRedirectKey}=...)`,
      'query',
      'warning',
      `The URL contains parameter "?${openRedirectKey}=" commonly used to pass external destinations to redirection scripts.`,
      'Vulnerable web applications containing open redirect scripts are abused by scammers to make phishing links appear to originate from legitimate corporate domains before bouncing the user elsewhere. (Note: Whether the server actually redirects cannot be verified without visiting the remote site).',
      15,
      'alert'
    );
  }

  if (hasTargetedEmail) {
    addIndicatorScore(
      'Targeted Recipient Identifier in Query Parameters',
      'query',
      'warning',
      'The query parameters contain an email address or recipient identifier.',
      'Spear-phishing kits pre-fill login forms with the victim’s email address passed via query strings to make the fraudulent login page appear personalized and convincing.',
      10,
      'alert'
    );
  }

  const hasExcessiveParams = paramCount >= 5;
  if (hasExcessiveParams) {
    addIndicatorScore(
      `Excessive Query Parameters (${paramCount} parameters)`,
      'query',
      'warning',
      `The address carries an unusually high number of query arguments (${paramCount} parameters).`,
      'While legitimate tracking URLs use query strings, extensive parameter chains are also used to pass obfuscated base64 payloads, dynamic campaign keys, or victim telemetry.',
      10,
      'alert'
    );
  }

  // ==========================================
  // 12. LENGTH ANOMALIES (URL & HOSTNAME)
  // ==========================================
  if (hostnameLength > 30) {
    addIndicatorScore(
      `Unusually Long Domain Hostname (${hostnameLength} characters)`,
      'host',
      'warning',
      `The hostname is ${hostnameLength} characters long.`,
      'Domain names exceeding 30 characters are often registered by typosquatters and brand impersonators to chain multiple institutional keywords together.',
      15,
      'alert'
    );
  }

  if (urlLength > 200) {
    addIndicatorScore(
      `Excessively Long URL (${urlLength} characters)`,
      'general',
      'warning',
      `The overall web address is exceptionally long (${urlLength} characters).`,
      'Exceptionally long URLs are frequently crafted to push the real domain off the edge of mobile browser address bars so the recipient cannot easily verify the destination.',
      15,
      'alert'
    );
  } else if (urlLength > 120) {
    addIndicatorScore(
      `Unusually Long URL (${urlLength} characters)`,
      'general',
      'warning',
      `The web address is longer than typical consumer links (${urlLength} characters).`,
      'Long URLs are often used to conceal deceptive sub-paths or embed serialized session payloads.',
      10,
      'alert'
    );
  }

  // Check for consecutive hyphens in hostname
  if (hostname.includes('--') && !isPunycode) {
    addIndicatorScore(
      'Consecutive Hyphens in Hostname ("--")',
      'host',
      'warning',
      'The hostname contains consecutive hyphens, a known pattern in algorithmically generated domains.',
      'Threat actors often insert double-hyphens to register look-alike variations of corporate domain names that have already been claimed.',
      15,
      'alert'
    );
  }

  // ==========================================
  // 13. SUSPICIOUS AUTH & FINANCIAL KEYWORDS
  // ==========================================
  const foundKeywords: string[] = [];
  const domainTextToScan = hostname.toLowerCase();
  const fullTextToScan = (hostname + pathname + search).toLowerCase();

  for (const kw of [...AUTH_URGENCY_KEYWORDS, ...FINANCIAL_KEYWORDS]) {
    if (fullTextToScan.includes(kw)) {
      foundKeywords.push(kw);
    }
  }

  const hasSuspiciousKeywords = foundKeywords.length > 0;
  if (hasSuspiciousKeywords) {
    // Determine if keyword appears in the domain/subdomain vs path
    const inDomain = AUTH_URGENCY_KEYWORDS.some(kw => domainTextToScan.includes(kw)) ||
                     FINANCIAL_KEYWORDS.some(kw => domainTextToScan.includes(kw));

    const keywordPoints = inDomain ? (foundKeywords.length >= 3 ? 25 : 20) : (foundKeywords.length >= 3 ? 15 : 10);

    addIndicatorScore(
      `Urgency, Security or Financial Keywords (${foundKeywords.slice(0, 4).join(', ')})`,
      inDomain ? 'host' : 'path',
      'warning',
      `The URL contains sensitive keywords: ${foundKeywords.join(', ')}.`,
      'Phishing campaigns rely on urgency and financial buzzwords (such as kyc, pan-card, verify, refund, suspended) to manipulate victims emotionally into acting without verifying the authenticity of the address.',
      keywordPoints,
      'alert'
    );
  }

  // ==========================================
  // 14. DETERMINISTIC SCORING & BAND CALCULATION
  // ==========================================
  // Sum of all transparent heuristic points
  const rawSum = scoreBreakdown.reduce((acc, item) => acc + item.points, 0);
  const finalRiskScore = Math.min(100, Math.max(0, rawSum));

  // Strict score bands mandated:
  // 0–29: Low Risk
  // 30–59: Medium Risk
  // 60–100: High Risk
  let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  let explanation = '';
  const recommendations: string[] = [];

  if (finalRiskScore >= 60) {
    riskLevel = 'High Risk';
    explanation = 
      'This URL exhibits multiple strong structural anomalies commonly associated with credential phishing, unencrypted transmission, or malicious payload delivery. The detected indicators indicate elevated risk to account security and personal data.';
    recommendations.push('Do not enter passwords, OTPs, PINs, bank card numbers, or personal identity documents on this site.');
    recommendations.push('Do not download, install, or run any software, APK, or document files delivered from this address.');
    recommendations.push('Verify the legitimate website directly by searching for the official institution in a trusted search engine or using known official bookmarks.');
    recommendations.push('If you already entered account credentials or payment details at this link, take immediate containment steps via the Report section.');
  } else if (finalRiskScore >= 30) {
    riskLevel = 'Medium Risk';
    explanation = 
      'This URL presents several ambiguous or caution-worthy structural characteristics—such as unencrypted HTTP, URL shorteners, non-standard ports, or sensitive security keywords. While some legitimate services exhibit these traits, independent verification is strongly advised before proceeding.';
    recommendations.push('Carefully inspect the exact destination hostname and spelling before submitting any login credentials.');
    recommendations.push('Confirm that the root domain legitimately belongs to the service claiming to contact you.');
    recommendations.push('If you received this link unexpectedly via SMS, WhatsApp, or email, contact the sender through an independent, official channel to confirm.');
  } else {
    riskLevel = 'Low Risk';
    explanation = 
      'This URL conforms to standard, conventional web conventions with active HTTPS encryption, standard domain depth, and no high-risk obfuscation patterns detected in its syntax.';
    recommendations.push('Always confirm the address bar matches the service you expect to use before entering account credentials.');
    recommendations.push('Never share one-time passcodes (OTPs) or UPI PINs regardless of how authentic a website appears.');
  }

  return {
    rawInput: trimmed,
    isValid: true,
    protocol,
    hostname,
    port: port || undefined,
    pathname,
    search: search || undefined,
    isHttps,
    isIpAddress,
    ipType,
    hasAtSymbol,
    subdomainCount,
    subdomains,
    registeredDomain,
    isPunycode,
    punycodeDetails: isPunycode ? hostname : undefined,
    hasSuspiciousKeywords,
    suspiciousKeywordsFound: foundKeywords,
    hasExcessiveParams,
    paramCount,
    hasOpenRedirectParam,
    hasSuspiciousEncoding,
    encodedSequencesCount: percentMatches,
    suspiciousCharacters,
    hasUnusualPort,
    hasDangerousExtension,
    dangerousExtension: matchedExt,
    urlLength,
    hostnameLength,
    riskScore: finalRiskScore,
    riskLevel,
    scoreBreakdown,
    indicators,
    explanation,
    recommendations,
    limitations: STANDARD_LIMITATIONS,
    redirectNotice: STANDARD_REDIRECT_NOTICE,
    scannedAt: new Date().toISOString()
  };
}
