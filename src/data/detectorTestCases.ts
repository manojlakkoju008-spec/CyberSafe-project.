export interface DetectorTestCase {
  id: string;
  name: string;
  category: 'normal' | 'protocol' | 'ip' | 'length' | 'subdomains' | 'punycode' | 'path' | 'query' | 'userinfo' | 'malformed' | 'port' | 'tld';
  url: string;
  expectedRiskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  description: string;
  keySignalsToDetect: string[];
}

export const DETECTOR_TEST_CASES: DetectorTestCase[] = [
  {
    id: 'tc-normal-https',
    name: 'Standard Legitimate HTTPS Domain',
    category: 'normal',
    url: 'https://cybercrime.gov.in/',
    expectedRiskLevel: 'Low Risk',
    description: 'A standard public portal with valid HTTPS encryption, clean domain depth, standard port, and zero obfuscation markers.',
    keySignalsToDetect: ['HTTPS TLS verified', 'Standard domain structure', 'No deceptive characters']
  },
  {
    id: 'tc-unencrypted-http',
    name: 'Unencrypted Plain HTTP Domain',
    category: 'protocol',
    url: 'http://example-news-archive.org/articles/weekly-brief',
    expectedRiskLevel: 'Low Risk',
    description: 'Standard domain but using plain HTTP (port 80) without TLS encryption, exposing transmitted data to cleartext interception.',
    keySignalsToDetect: ['Unencrypted HTTP protocol (+25 pts)', 'Standard domain format']
  },
  {
    id: 'tc-raw-ip-address',
    name: 'Numeric IP Address with Custom Port',
    category: 'ip',
    url: 'http://192.168.1.105:8080/banking/auth',
    expectedRiskLevel: 'High Risk',
    description: 'Direct numeric IP address operating on a non-standard port (8080) over unencrypted HTTP, typical of ad-hoc phishing hosts.',
    keySignalsToDetect: ['Direct numeric IP address (+40 pts)', 'Unencrypted HTTP (+25 pts)', 'Non-standard port 8080 (+20 pts)']
  },
  {
    id: 'tc-long-url',
    name: 'Exceptionally Long URL with Deep Query',
    category: 'length',
    url: 'https://cdn-static-media-delivery.example-cdn-network.net/assets/v2/cache/system/user/session/tracking/events/collect?session_id=987234987234987234987234&tracking_key=a87b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0&campaign=urgent_account_action_required',
    expectedRiskLevel: 'Medium Risk',
    description: 'URL exceeding 200 characters with high parameter volume, a pattern often used to conceal target hostnames on mobile screens.',
    keySignalsToDetect: ['Excessive URL length (+15 pts)', 'Excessive query parameters (+10 pts)', 'Urgency keyword (+10 pts)']
  },
  {
    id: 'tc-excessive-subdomains',
    name: 'Deceptive Subdomain Stacking',
    category: 'subdomains',
    url: 'https://login.sbi.bank.secure-auth-update.xyz/verify',
    expectedRiskLevel: 'High Risk',
    description: 'Phishing domain stacking 4+ subdomains with trusted banking names on a disposable .xyz TLD to exploit mobile URL bar truncation.',
    keySignalsToDetect: ['Excessive subdomains (+20 pts)', 'High-risk .xyz TLD (+20 pts)', 'Security/auth keywords (+20 pts)']
  },
  {
    id: 'tc-punycode-homograph',
    name: 'Punycode Internationalized Homograph',
    category: 'punycode',
    url: 'https://xn--pple-43d.com/support/login',
    expectedRiskLevel: 'Medium Risk',
    description: 'Punycode domain (xn--pple-43d.com) visually masquerading as a major brand (Apple) using non-Latin characters.',
    keySignalsToDetect: ['Punycode IDN encoding xn-- (+30 pts)', 'Auth keyword (+10 pts)']
  },
  {
    id: 'tc-suspicious-path-apk',
    name: 'Dangerous Executable / APK in URL Path',
    category: 'path',
    url: 'https://updates-service.net/downloads/urgent-security-patch.apk',
    expectedRiskLevel: 'High Risk',
    description: 'Direct link pointing to an Android application package (.apk) file disguised as an urgent security update.',
    keySignalsToDetect: ['Dangerous file package .apk (+35 pts)', 'Urgency/security keywords (+10 pts)', 'Unusually long hostname (+15 pts)']
  },
  {
    id: 'tc-open-redirect-param',
    name: 'Potential Open-Redirect Query Parameter',
    category: 'query',
    url: 'https://legitimate-portal.org/login?redirect=https://evil-harvest.top&victim=user@target.com&token=4892348923',
    expectedRiskLevel: 'Medium Risk',
    description: 'URL containing an open-redirect parameter (?redirect=...) and victim email, commonly exploited to bounce users to credential harvesters.',
    keySignalsToDetect: ['Potential open redirect parameter (+15 pts)', 'Targeted email in query (+10 pts)', 'Auth keywords (+10 pts)']
  },
  {
    id: 'tc-userinfo-at-symbol',
    name: 'Embedded "@" Symbol Userinfo Deception',
    category: 'userinfo',
    url: 'https://google.com@phishing-trap-server.top/login',
    expectedRiskLevel: 'High Risk',
    description: 'RFC 3986 userinfo trick where browser treats "google.com" as username and actually navigates to "phishing-trap-server.top".',
    keySignalsToDetect: ['Embedded @ symbol (+45 pts)', 'High-risk .top TLD (+20 pts)', 'Auth keyword (+10 pts)']
  },
  {
    id: 'tc-unusual-port',
    name: 'Non-Standard Web Port (:8888)',
    category: 'port',
    url: 'http://banking-portal-secure.net:8888/kyc-update',
    expectedRiskLevel: 'High Risk',
    description: 'Unencrypted banking pretext running on an unusual port 8888 instead of standard ports 80/443.',
    keySignalsToDetect: ['Unencrypted HTTP (+25 pts)', 'Unusual port 8888 (+20 pts)', 'Financial KYC keywords (+20 pts)']
  },
  {
    id: 'tc-high-risk-tld-scam',
    name: 'Disposable High-Risk TLD with Financial Urgency',
    category: 'tld',
    url: 'https://instant-cashback-kyc-verify.top/claim-prize',
    expectedRiskLevel: 'High Risk',
    description: 'Disposable .top TLD combining multiple urgent financial buzzwords (cashback, kyc, prize, instant).',
    keySignalsToDetect: ['High-risk .top TLD (+20 pts)', 'Heavy financial/auth keywords (+20 pts)', 'Long domain name (+15 pts)']
  },
  {
    id: 'tc-malformed-syntax',
    name: 'Malformed URL Syntax with Invalid Characters',
    category: 'malformed',
    url: 'ht tp://in valid-url [bracket] %%%@@',
    expectedRiskLevel: 'High Risk',
    description: 'Malformed string violating RFC web syntax rules, which causes browser confusion or injection flaws.',
    keySignalsToDetect: ['Invalid URL syntax (+65 pts)', 'Malformed host/scheme structure']
  }
];
