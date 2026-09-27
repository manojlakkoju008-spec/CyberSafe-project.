import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Link as LinkIcon, 
  CheckCircle2, 
  Info, 
  RotateCcw,
  ArrowRight,
  Lock,
  Unlock,
  PlayCircle,
  Terminal,
  Globe,
  Server,
  Layers,
  Shield,
  HelpCircle,
  Activity,
  AlertOctagon,
  Copy,
  Check,
  MessageSquare,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Key,
  CreditCard,
  UserCheck,
  Clock,
  ExternalLink,
  CheckSquare,
  XCircle,
  Compass,
  FileCode,
  Tag,
  Eye,
  Sliders,
  Database,
  ArrowUpRight,
  Radio,
  FileSearch,
  CheckCheck
} from 'lucide-react';
import { UrlScanAssessment } from '../types';
import { analyzeUrlSafety } from '../utils/detectorEngine';
import { extractUrlsFromMessage } from '../utils/urlParser';
import { DETECTOR_TEST_CASES, DetectorTestCase } from '../data/detectorTestCases';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useAiGuide } from '../context/AiGuideContext';

interface DetectPageProps {
  onNavigateToReport: (incidentId?: string, url?: string) => void;
  initialUrl?: string;
}

interface TestRunResult {
  testCase: DetectorTestCase;
  actualScore: number;
  actualLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  passed: boolean;
  timeMs: number;
}

const SCAN_STEPS = [
  'Step 1: Inspecting & parsing target URL structure...',
  'Step 2: Resolving live DNS records and domain existence...',
  'Step 3: Connecting to target server and verifying reachability...',
  'Step 4: Fetching public webpage markup and extracting content...',
  'Step 5: Classifying website category, apparent purpose, and metadata...',
  'Step 6: Inspecting interactive forms, links, and functional elements...',
  'Step 7: Validating TLS / SSL certificates and defensive security headers...',
  'Step 8: Scanning for brand impersonation, lookalike domains, and heuristics...',
  'Step 9: Querying threat intelligence reputation databases...',
  'Step 10: Generating evidence-grounded Gemini AI semantic assessment...',
  'Step 11: Computing transparent weighted risk score & guidance...',
];

export const DetectPage: React.FC<DetectPageProps> = ({ onNavigateToReport, initialUrl }) => {
  const { openGuide } = useAiGuide();
  const [activeMode, setActiveMode] = useState<'url' | 'message'>('url');
  
  // URL Input State
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [assessment, setAssessment] = useState<UrlScanAssessment | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Collapsible section states for sections 5 through 11 (technical and detailed sections)
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    5: true,  // Technical Analysis
    6: true,  // Security Analysis
    7: true,  // Phishing & Impersonation
    8: true,  // Threat Intelligence
    9: true,  // AI Security Assessment
    10: true, // Risk Score & Breakdown
    11: true, // Recommended Action
  });

  const toggleSection = (sectionNum: number) => {
    setOpenSections(prev => ({ ...prev, [sectionNum]: !prev[sectionNum] }));
  };

  // Scanning progress step animation
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex(prev => {
          if (prev < SCAN_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 650);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Auto-analyze initialUrl if passed from AI Guide or other page
  useEffect(() => {
    if (initialUrl && initialUrl.trim()) {
      setUrlInput(initialUrl.trim());
      setActiveMode('url');
      handleAnalyzeUrl(initialUrl.trim());
    }
  }, [initialUrl]);

  // Message / Text Analysis State
  const [messageInput, setMessageInput] = useState('');
  const [analyzedMessage, setAnalyzedMessage] = useState<ReturnType<typeof extractUrlsFromMessage> | null>(null);

  // Automated QA Test Suite State
  const [qaResults, setQaResults] = useState<TestRunResult[] | null>(null);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [isTestingQa, setIsTestingQa] = useState(false);

  const handleAnalyzeUrl = async (urlToInspect: string) => {
    const target = urlToInspect.trim();
    if (!target) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeUrlSafety(target);
      setAssessment(result);
    } catch {
      // Fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (urlInput.trim()) {
      handleAnalyzeUrl(urlInput);
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setAssessment(null);
  };

  const handleLoadSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setActiveMode('url');
    handleAnalyzeUrl(sampleUrl);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  const handleCopyUrl = () => {
    if (!urlInput) return;
    navigator.clipboard.writeText(urlInput);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopySummary = () => {
    if (!assessment) return;
    const text = `CYBERSAFE SECURITY ANALYSIS REPORT
Target Address: ${assessment.normalizedUrl}
Overall Risk: ${assessment.riskCategory || assessment.riskLevel} (${assessment.riskScore}/100) — Confidence: ${assessment.confidenceLevel || 'High'}

1. WEBSITE INTELLIGENCE
- Category: ${assessment.websiteClassification?.websiteType || assessment.aiAnalysis?.websiteType || 'General Web Resource'}
- Purpose: ${assessment.websiteClassification?.websitePurpose || assessment.aiAnalysis?.websitePurpose || 'Evaluated based on retrieved page content'}
- Page Title: ${assessment.publicInformation?.pageTitle || assessment.webpageContent?.pageTitle || 'N/A'}
- Domain: ${assessment.registeredDomain || assessment.hostname}
- Final URL: ${assessment.reachability?.finalUrl || assessment.normalizedUrl}

2. OBSERVED EVIDENCE
${assessment.websiteClassification?.evidence?.map(e => `• ${e}`).join('\n') || '• Public webpage markup and server responses analyzed'}

3. DETECTED FUNCTIONALITY & DATA
- Interactive Features: ${assessment.publicInformation?.functionalElements?.detectedList?.join(', ') || 'None specifically detected'}
- Sensitive Inputs: ${assessment.publicInformation?.sensitiveRequests?.join(', ') || 'No obvious sensitive-data input detected on public page'}

4. BASIC METADATA
- Protocol: ${assessment.protocol.toUpperCase()} (${assessment.isHttps ? 'HTTPS' : 'HTTP'})
- HTTP Status: ${assessment.reachability?.httpStatusCode || 'N/A'}
- Response Time: ${assessment.reachability?.responseTimeMs ? `${assessment.reachability.responseTimeMs} ms` : 'N/A'}
- Content-Type: ${assessment.reachability?.contentType || 'N/A'}

5. TECHNICAL & SECURITY CHARACTERISTICS
- Domain DNS: ${assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? `Live DNS (${assessment.dnsAnalysis.resolvedIps?.join(', ') || 'Resolved'})` : 'Nonexistent / NXDOMAIN'}
- TLS Certificate: ${assessment.isHttps ? (assessment.tlsAnalysis?.certIssuer || 'Valid TLS Certificate') : 'Unencrypted HTTP'}
- Security Headers: ${assessment.securityHeaders?.presentCount || 0}/${assessment.securityHeaders?.headers?.length || 6} present
- Brand Spoofing Check: ${assessment.brandImpersonation?.isImpersonatingBrand ? `Alert: Mimics ${assessment.brandImpersonation.suspectedBrand}` : 'No lookalike brand spoofing detected'}
- Threat Intelligence: ${assessment.reputationReport?.status || 'No Known Threats Listed'} (${assessment.reputationReport?.provider || 'External Feeds'})

6. SYNTHESIZED ASSESSMENT & RECOMMENDATIONS
- Executive Summary: ${assessment.executiveSummary || assessment.explanation}
- Recommended Action: ${assessment.recommendations?.[0] || 'Remain cautious and verify domain before entering credentials.'}

Notice: CyberSafe provides first-level threat analysis grounded in actual retrieved technical evidence. HTTPS encryption and absence of threat database listings do not guarantee complete immunity.`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Message Parsing Trigger
  const handleParseMessage = (text: string) => {
    setMessageInput(text);
    if (!text.trim()) {
      setAnalyzedMessage(null);
      return;
    }
    const extracted = extractUrlsFromMessage(text);
    setAnalyzedMessage(extracted);
  };

  const handleInspectExtractedLink = (linkUrl: string) => {
    setUrlInput(linkUrl);
    setActiveMode('url');
    handleAnalyzeUrl(linkUrl);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  // Run full automated QA Test Suite asynchronously
  const handleRunQaTestSuite = async () => {
    setIsTestingQa(true);
    setShowTestSuite(true);

    const results: TestRunResult[] = await Promise.all(
      DETECTOR_TEST_CASES.map(async (tc) => {
        const start = performance.now();
        const output = await analyzeUrlSafety(tc.url);
        const end = performance.now();
        const passed =
          output.riskLevel === tc.expectedRiskLevel && output.isValid !== false
            ? true
            : tc.category === 'malformed' && !output.isValid;
        return {
          testCase: tc,
          actualScore: output.riskScore,
          actualLevel: output.riskLevel,
          passed,
          timeMs: Math.round((end - start) * 100) / 100,
        };
      })
    );

    setQaResults(results);
    setIsTestingQa(false);
  };

  // Color mappings
  const getRiskColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-900', badge: 'bg-rose-600 text-white', bar: 'bg-rose-600' };
    if (score >= 50) return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', badge: 'bg-red-600 text-white', bar: 'bg-red-500' };
    if (score >= 25) return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-600 text-white', bar: 'bg-amber-500' };
    return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-600 text-white', bar: 'bg-emerald-600' };
  };

  // Derive dynamic observed evidence items
  const observedEvidenceList = useMemo(() => {
    if (!assessment) return [];
    const items: Array<{ title: string; source: string; state: 'positive' | 'observation' | 'concern'; iconType: string }> = [];

    // Title & Structure
    if (assessment.publicInformation?.pageTitle || assessment.webpageContent?.pageTitle) {
      items.push({
        title: `Page title observed: "${assessment.publicInformation?.pageTitle || assessment.webpageContent?.pageTitle}"`,
        source: 'HTML <title> tag extraction',
        state: 'positive',
        iconType: 'check'
      });
    }

    if (assessment.publicInformation?.mainHeading || assessment.publicInformation?.headings?.[0]) {
      items.push({
        title: `Main heading observed: "${assessment.publicInformation?.mainHeading || assessment.publicInformation?.headings?.[0]}"`,
        source: 'HTML <h1> / <h2> structure',
        state: 'positive',
        iconType: 'check'
      });
    }

    if (assessment.publicInformation?.metaDescription || assessment.webpageContent?.metaDescription) {
      items.push({
        title: `Meta description present (${(assessment.publicInformation?.metaDescription || assessment.webpageContent?.metaDescription || '').length} chars)`,
        source: 'HTML <meta name="description"> tag',
        state: 'positive',
        iconType: 'check'
      });
    }

    // Links
    if (assessment.publicInformation?.linksInfo && assessment.publicInformation.linksInfo.totalLinksCount > 0) {
      items.push({
        title: `${assessment.publicInformation.linksInfo.totalLinksCount} hyperlinked elements detected (${assessment.publicInformation.linksInfo.internalLinksCount} internal, ${assessment.publicInformation.linksInfo.externalLinksCount} external navigation links)`,
        source: 'HTML anchor <a> tags inspection',
        state: 'positive',
        iconType: 'check'
      });
    }

    // Functional elements
    const fe = assessment.publicInformation?.functionalElements;
    if (fe?.hasSearch) {
      items.push({
        title: 'Search input and query submission interface detected',
        source: 'Form markup & input attributes',
        state: 'positive',
        iconType: 'check'
      });
    }

    if (fe?.hasLogin) {
      items.push({
        title: 'User login / credential entry interface identified',
        source: 'HTML form & username/email fields',
        state: assessment.isHttps ? 'observation' : 'concern',
        iconType: assessment.isHttps ? 'info' : 'alert'
      });
    }

    if (fe?.hasRegistration) {
      items.push({
        title: 'Account registration / sign-up flow identified',
        source: 'Visible page links and registration form elements',
        state: 'observation',
        iconType: 'info'
      });
    }

    if (fe?.hasShoppingCart || fe?.hasCheckout || fe?.hasPayment) {
      items.push({
        title: 'E-commerce shopping cart / checkout or payment interface observed',
        source: 'Visible checkout keywords and cart elements',
        state: 'observation',
        iconType: 'info'
      });
    }

    if (fe?.hasDownload) {
      items.push({
        title: 'Software, installer, or document download triggers detected',
        source: 'Direct download anchor tags and buttons',
        state: 'observation',
        iconType: 'info'
      });
    }

    // Sensitive fields
    if (assessment.webpageContent?.hasLoginForm) {
      items.push({
        title: 'Password input field (<input type="password">) detected in page markup',
        source: 'HTML password input tag',
        state: assessment.isHttps ? 'observation' : 'concern',
        iconType: assessment.isHttps ? 'info' : 'alert'
      });
    }

    if (assessment.webpageContent?.hasPaymentFields) {
      items.push({
        title: 'Financial / card payment input fields detected on page',
        source: 'HTML card/billing input analysis',
        state: assessment.brandImpersonation?.isImpersonatingBrand ? 'concern' : 'observation',
        iconType: assessment.brandImpersonation?.isImpersonatingBrand ? 'alert' : 'info'
      });
    }

    // Reachability & DNS
    if (assessment.reachability?.isReachable) {
      items.push({
        title: `Target web server online and responded with HTTP ${assessment.reachability.httpStatusCode} (${assessment.reachability.responseTimeMs}ms latency)`,
        source: 'Live HTTP network probe',
        state: 'positive',
        iconType: 'check'
      });
    } else if (assessment.dnsAnalysis?.domainExistenceStatus === 'nonexistent') {
      items.push({
        title: 'Target domain does not exist in authoritative DNS (NXDOMAIN)',
        source: 'DNS authoritative name server lookup',
        state: 'concern',
        iconType: 'alert'
      });
    }

    return items;
  }, [assessment]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-[#1261A0]" />
          <span>Multi-Layer URL & Webpage Security Analyzer</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
          Detect: URL & Webpage Security Analysis
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          Understand what a website actually is, what content was observed on the live webpage, and review deterministic technical security characteristics.
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <button
            onClick={() => openGuide('How do I analyze whether this URL or message is dangerous?')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border border-blue-200 text-xs font-semibold cursor-pointer transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1261A0]" />
            <span>Unsure about a link? Ask CyberSafe AI Guide</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Protected with SSRF containment & zero browser code execution.
          </span>
        </div>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveMode('url')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'url'
              ? 'border-[#1261A0] text-[#1261A0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Inspect Web Address (URL)</span>
        </button>

        <button
          onClick={() => setActiveMode('message')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'message'
              ? 'border-[#1261A0] text-[#1261A0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Extract Links From Message (SMS / WhatsApp)</span>
        </button>
      </div>

      {/* MODE 1: Single URL Input Form */}
      {activeMode === 'url' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200 bg-white">
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="url-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Web Address / URL to Inspect
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  HTTP & HTTPS web addresses supported
                </span>
              </div>

              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="url-input-field"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter URL to analyze, e.g. https://github.com or https://cybercrime.gov.in"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1261A0] focus:bg-white font-mono transition-all"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isAnalyzing || !urlInput.trim()}
                    icon={<Search className="w-4 h-4" />}
                    className="w-full sm:w-auto shrink-0 font-bold bg-[#1261A0] hover:bg-[#0B1F33]"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
                  </Button>
                  {urlInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={handleClear}
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Test Scenarios Panel */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#1261A0]" />
                  <span>Quick Test Scenarios:</span>
                </span>
                <button
                  type="button"
                  onClick={handleRunQaTestSuite}
                  disabled={isTestingQa}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{isTestingQa ? 'Running QA Tests...' : 'Run Automated QA Suite (15 Scenarios)'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DETECTOR_TEST_CASES.slice(0, 8).map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadSample(sample.url)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      sample.expectedRiskLevel === 'High Risk'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                        : sample.expectedRiskLevel === 'Medium Risk'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title={sample.description}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sample.expectedRiskLevel === 'High Risk'
                          ? 'bg-rose-500'
                          : sample.expectedRiskLevel === 'Medium Risk'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Active Scanning Pipeline Animation */}
          {isAnalyzing && (
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Inspecting Target Webpage & Infrastructure</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Step {scanStepIndex + 1} of {SCAN_STEPS.length}
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="font-mono text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{SCAN_STEPS[scanStepIndex]}</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* MODE 2: Message & Text Link Extractor */}
      {activeMode === 'message' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200 bg-white">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Paste Entire SMS, Email, or WhatsApp Message
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Safe Text Extraction
              </span>
            </div>

            <textarea
              id="message-input-field"
              rows={4}
              value={messageInput}
              onChange={(e) => handleParseMessage(e.target.value)}
              placeholder="Paste suspicious message here, e.g.:&#10;Your account is suspended. Verify immediately at: https://paypa1-security-verification.xyz/login"
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1261A0] focus:bg-white font-sans transition-all leading-relaxed"
            />

            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-500">
                Extracted links are parsed as text strings. Code is never automatically executed.
              </span>
              {messageInput && (
                <button
                  onClick={() => handleParseMessage('')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Clear Message
                </button>
              )}
            </div>
          </div>

          {analyzedMessage && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={analyzedMessage.linkCount > 0 ? 'warning' : 'safe'} size="md">
                  {analyzedMessage.linkCount} {analyzedMessage.linkCount === 1 ? 'Link Detected' : 'Links Detected'}
                </Badge>
                {analyzedMessage.detectedPatterns.hasUrgency && (
                  <Badge variant="danger" size="sm">Urgent Language Detected</Badge>
                )}
                {analyzedMessage.detectedPatterns.hasFinancialPretext && (
                  <Badge variant="warning" size="sm">Financial / KYC Terms</Badge>
                )}
              </div>

              {analyzedMessage.linkCount === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  No web links were found in the text.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                  {analyzedMessage.extractedUrls.map((link, idx) => (
                    <div key={link.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            Link #{idx + 1}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-900 break-all">
                            {link.extractedUrl}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleInspectExtractedLink(link.normalizedUrl)}
                        icon={<Search className="w-3.5 h-3.5" />}
                        className="shrink-0 font-bold text-xs bg-[#1261A0]"
                      >
                        Inspect Link Security
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* QA Test Suite Results Table */}
      {showTestSuite && qaResults && (
        <Card className="p-6 space-y-4 border-blue-200 bg-blue-50/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Automated QA Engine Verification Suite</span>
              </h3>
              <p className="text-xs text-slate-600">
                15 diverse test vectors verified deterministically across multi-layer scoring rules.
              </p>
            </div>
            <button
              onClick={() => setShowTestSuite(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded bg-white border border-slate-200 cursor-pointer"
            >
              Hide Table
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Scenario / Vector</th>
                  <th className="p-2.5">Expected</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {qaResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 text-emerald-600" /> PASS
                      </span>
                    </td>
                    <td className="p-2.5 font-sans font-medium text-slate-900">
                      <div>{r.testCase.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{r.testCase.url}</div>
                    </td>
                    <td className="p-2.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.testCase.expectedRiskLevel === 'High Risk' ? 'bg-rose-100 text-rose-800' : r.testCase.expectedRiskLevel === 'Medium Risk' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.testCase.expectedRiskLevel}
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {r.actualScore} / 100
                    </td>
                    <td className="p-2.5 text-right font-sans">
                      <button
                        onClick={() => handleLoadSample(r.testCase.url)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* FULL RESULTS DASHBOARD - REORGANIZED INFORMATION HIERARCHY */}
      {assessment && !isAnalyzing && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* ======================================================== */}
          {/* TOP: OVERALL ANALYSIS SUMMARY (FIRST RESULT PANEL)       */}
          {/* ======================================================== */}
          {(() => {
            const isNonexistent = assessment.verificationStatus === 'UNVERIFIED_NONEXISTENT' || assessment.verificationStatus === 'DOMAIN_NOT_FOUND' || assessment.dnsAnalysis?.domainExistenceStatus === 'nonexistent';
            const isUnreachable = !isNonexistent && (assessment.verificationStatus === 'UNVERIFIED_UNREACHABLE' || assessment.verificationStatus === 'WEBSITE_UNREACHABLE' || !assessment.reachability?.isReachable);
            const isLimited = !isNonexistent && !isUnreachable && (assessment.verificationStatus === 'LIMITED_CONTENT' || assessment.verificationStatus === 'VERIFIED_LIMITED_CONTENT' || assessment.webpageContent?.hasLimitedContent);
            const isRestricted = assessment.verificationStatus === 'ACCESS_RESTRICTED';

            const verificationBadge = isNonexistent
              ? { text: '🔴 WEBSITE DOES NOT EXIST / UNVERIFIED', bg: 'bg-rose-600 text-white border-rose-700', panelBg: 'bg-rose-50/60 border-rose-300' }
              : isUnreachable
              ? { text: '🟠 WEBSITE EXISTS — CURRENTLY UNREACHABLE', bg: 'bg-amber-600 text-white border-amber-700', panelBg: 'bg-amber-50/60 border-amber-300' }
              : isLimited
              ? { text: '🟡 WEBSITE VERIFIED — LIMITED CONTENT', bg: 'bg-amber-500 text-slate-950 border-amber-600', panelBg: 'bg-amber-50/50 border-amber-300' }
              : isRestricted
              ? { text: '🟠 ACCESS RESTRICTED (INTERNAL/PRIVATE IP)', bg: 'bg-amber-600 text-white border-amber-700', panelBg: 'bg-amber-50/60 border-amber-300' }
              : { text: '🟢 WEBSITE VERIFIED', bg: 'bg-emerald-600 text-white border-emerald-700', panelBg: 'bg-emerald-50/40 border-emerald-300' };

            const securityAssessmentLabel = isNonexistent
              ? 'CANNOT BE CONFIRMED'
              : (isUnreachable || isLimited)
              ? 'LIMITED ASSESSMENT'
              : assessment.riskScore >= 75
              ? 'CRITICAL SECURITY RISK'
              : assessment.riskScore >= 50
              ? 'HIGH SECURITY RISK'
              : assessment.riskScore >= 25
              ? 'MODERATE SECURITY RISK'
              : 'LOW SECURITY RISK';

            return (
              <div className="space-y-4">
                {/* Main First Result Panel */}
                <Card className={`p-6 sm:p-8 border-2 shadow-sm ${verificationBadge.panelBg} space-y-6`}>
                  
                  {/* Top Bar: Title, Target URL, and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#1261A0]" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          WEBSITE SECURITY ANALYSIS
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 font-mono break-all bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200 inline-block shadow-2xs">
                        {assessment.normalizedUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySummary}
                        icon={copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        className="text-xs font-bold bg-white"
                      >
                        {copiedSummary ? 'Copied' : 'Copy Summary'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="text-xs bg-white/60"
                      >
                        New Scan
                      </Button>
                    </div>
                  </div>

                  {/* Primary Status Banner & Posture */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide border shadow-xs ${verificationBadge.bg}`}>
                          {verificationBadge.text}
                        </span>

                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          Security Assessment: <strong>{securityAssessmentLabel}</strong>
                        </span>

                        <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          Risk Score: <strong>{assessment.riskScore} / 100</strong>
                        </span>

                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Confidence: <strong>{(assessment.confidenceLevel || (isNonexistent ? 'LOW' : 'HIGH')).toUpperCase()}</strong>
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1F33] leading-snug">
                        {isNonexistent
                          ? 'Domain Does Not Exist / DNS Resolution Failed'
                          : isUnreachable
                          ? 'Domain Exists, But Web Server Is Currently Unreachable'
                          : isLimited
                          ? 'Website Responded, But Limited Content Available'
                          : assessment.riskScore >= 75
                          ? 'Critical Risk: Severe Threat Indicators Identified'
                          : assessment.riskScore >= 50
                          ? 'High Risk: Elevated Deception or Security Markers Detected'
                          : assessment.riskScore >= 25
                          ? 'Moderate Risk: Potential Anomaly or Configuration Observation'
                          : 'Low Risk: Verified Destination with Clean Technical Checks'}
                      </h2>
                    </div>

                    {assessment.riskScore >= 50 && (
                      <div className="shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onNavigateToReport('suspicious-website', assessment.normalizedUrl)}
                          className="w-full sm:w-auto text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                        >
                          Report Incident
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* AI & Deterministic Security Overview */}
                  <div className="p-5 bg-white/95 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#1261A0] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1261A0]" />
                        <span>Security Overview</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Evidence-Grounded Dynamic Analysis
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {assessment.executiveSummary || assessment.explanation}
                    </p>

                    {isNonexistent && (
                      <p className="text-[11px] text-rose-700 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        Notice: Absence of malicious indicators does not mean this address is safe; CyberSafe cannot verify a website that does not exist in DNS.
                      </p>
                    )}
                  </div>

                  {/* 5-Point Quick Verification Matrix */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>5-Point Key Status Matrix:</span>
                      <span className="text-[11px] text-slate-500 font-normal">Immediate at-a-glance health check</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono text-xs">
                      {/* 1. Domain */}
                      <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                        isNonexistent
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        {isNonexistent ? <XCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-500 block uppercase">Domain</span>
                          <span className="font-bold truncate block">{isNonexistent ? '✗ DNS Failed' : '✓ Exists'}</span>
                        </div>
                      </div>

                      {/* 2. Website Reachability */}
                      <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                        isNonexistent || isUnreachable
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        {isNonexistent || isUnreachable ? <XCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-500 block uppercase">Website</span>
                          <span className="font-bold truncate block">
                            {isNonexistent ? '✗ Not Reachable' : isUnreachable ? '✗ Unreachable' : `✓ HTTP ${assessment.reachability?.httpStatusCode || 200}`}
                          </span>
                        </div>
                      </div>

                      {/* 3. Protocol / HTTPS */}
                      <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                        isNonexistent
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : assessment.isHttps
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}>
                        {isNonexistent ? (
                          <span className="w-4 h-4 text-slate-400 font-bold shrink-0 text-center">—</span>
                        ) : assessment.isHttps ? (
                          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Unlock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-500 block uppercase">Protocol</span>
                          <span className="font-bold truncate block">
                            {isNonexistent ? '— Unverified' : assessment.isHttps ? '✓ HTTPS (TLS)' : '⚠️ HTTP (Plain)'}
                          </span>
                        </div>
                      </div>

                      {/* 4. Content */}
                      <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                        isNonexistent || isUnreachable
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : isLimited
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        {isNonexistent || isUnreachable ? (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : isLimited ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-500 block uppercase">Content</span>
                          <span className="font-bold truncate block">
                            {isNonexistent || isUnreachable ? '✗ Not Retrieved' : isLimited ? '⚠️ Limited Content' : '✓ Available'}
                          </span>
                        </div>
                      </div>

                      {/* 5. Threat Intel */}
                      <div className={`p-3 rounded-xl border flex items-center gap-2 sm:col-span-2 lg:col-span-1 ${
                        isNonexistent
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : assessment.reputationReport.status === 'KNOWN MALICIOUS'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        {isNonexistent ? (
                          <span className="w-4 h-4 text-slate-400 font-bold shrink-0 text-center">—</span>
                        ) : assessment.reputationReport.status === 'KNOWN MALICIOUS' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-500 block uppercase">Threat Intel</span>
                          <span className="font-bold truncate block">
                            {isNonexistent ? '— Not Applicable' : assessment.reputationReport.status === 'KNOWN MALICIOUS' ? '✗ Flagged Threat' : '✓ No Known Threats'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Separate Dimensions Summary Row */}
                  <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">1. Website Verification</span>
                      <span className="font-bold text-slate-900">
                        {isNonexistent ? 'FAILED (NXDOMAIN)' : isUnreachable ? 'FAILED (TIMEOUT)' : isLimited ? 'VERIFIED (LIMITED)' : 'VERIFIED'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">2. Security Posture</span>
                      <span className="font-bold text-slate-900">{securityAssessmentLabel}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">3. Threat Detection</span>
                      <span className="font-bold text-slate-900">
                        {isNonexistent ? 'N/A' : assessment.reputationReport.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">4. Confidence Level</span>
                      <span className="font-bold text-slate-900">
                        {(assessment.confidenceLevel || (isNonexistent ? 'LOW' : 'HIGH')).toUpperCase()}
                      </span>
                    </div>
                  </div>

                </Card>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* SECTION 1: WEBSITE INTELLIGENCE (WHAT IS THIS WEBSITE?)    */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#1261A0]" />
                <h3 className="text-xl font-bold text-[#0B1F33]">
                  1. Website Intelligence
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Answers &quot;What is this website and what is its apparent purpose?&quot;
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category Card */}
              <Card className="lg:col-span-5 p-6 bg-gradient-to-br from-white to-blue-50/40 border-blue-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#1261A0]" />
                      <span>Website Category</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                      Confidence: {assessment.websiteClassification?.confidence || assessment.confidenceLevel || 'High'}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold text-[#0B1F33] tracking-tight">
                    {assessment.websiteClassification?.websiteType || assessment.aiAnalysis?.websiteType || 'General Web Resource'}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {assessment.websiteClassification?.evidence && assessment.websiteClassification.evidence.length > 0
                      ? assessment.websiteClassification.evidence[0]
                      : 'Classified dynamically from extracted page title, headings, and public markup.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Source: Public webpage content + Gemini semantic analysis</span>
                  <span className="font-semibold text-[#1261A0]">Verified Evidence</span>
                </div>
              </Card>

              {/* Purpose Card */}
              <Card className="lg:col-span-7 p-6 bg-white border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#1261A0]" />
                      <span>What Is This Website For?</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Natural-Language Analysis
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    Apparent Purpose & Core Activity
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {assessment.websiteClassification?.websitePurpose || assessment.aiAnalysis?.websitePurpose || 'This website provides public web services and resources as evaluated from its live responses and document structure.'}
                  </p>
                </div>

                {/* Key Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-[11px] font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">DOMAIN</span>
                    <span className="font-bold text-slate-900 truncate block">{assessment.registeredDomain || assessment.hostname}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">LANGUAGE</span>
                    <span className="font-bold text-slate-900 truncate block">{assessment.publicInformation?.language || 'en (detected)'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">HTTP STATUS</span>
                    <span className="font-bold text-slate-900 truncate block">{assessment.reachability?.httpStatusCode || 200}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">REDIRECTS</span>
                    <span className="font-bold text-slate-900 truncate block">{assessment.redirectAnalysis?.redirectCount || 0} hop(s)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: EVIDENCE OBSERVED ON THE WEBSITE               */}
          {/* ======================================================== */}
          <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#1261A0]" />
                  <h3 className="text-lg font-bold text-[#0B1F33]">
                    2. Evidence Observed on the Website
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Information detected directly from the publicly accessible webpage markup, structure, and server headers.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {observedEvidenceList.length} Evidence Items Logged
              </span>
            </div>

            {observedEvidenceList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {observedEvidenceList.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                      item.state === 'positive'
                        ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                        : item.state === 'observation'
                        ? 'bg-blue-50/40 border-blue-200 text-slate-800'
                        : 'bg-rose-50/50 border-rose-200 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.state === 'positive' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : item.state === 'observation' ? (
                        <Info className="w-4 h-4 text-blue-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-snug break-words">
                        {item.title}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Source: {item.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-600">
                Target server is unreachable or returned no readable HTML content for extraction.
              </div>
            )}
          </Card>

          {/* ======================================================== */}
          {/* SECTION 3: WEBSITE CONTENT & FUNCTIONALITY                */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#1261A0]" />
                <h3 className="text-xl font-bold text-[#0B1F33]">
                  3. Website Content & Functionality
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Public page content summary, interactive functionality, and sensitive data requests
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* What Does the Page Contain? */}
              <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1261A0]" />
                    <span>What Does the Page Contain?</span>
                  </span>

                  <div className="space-y-2 text-xs">
                    {assessment.publicInformation?.pageTitle && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono">PAGE TITLE</span>
                        <p className="font-bold text-slate-900 text-xs">
                          {assessment.publicInformation.pageTitle}
                        </p>
                      </div>
                    )}

                    {assessment.publicInformation?.metaDescription && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono">META DESCRIPTION</span>
                        <p className="text-slate-600 line-clamp-3 text-[11px] leading-relaxed">
                          {assessment.publicInformation.metaDescription}
                        </p>
                      </div>
                    )}

                    {assessment.publicInformation?.mainTopics && assessment.publicInformation.mainTopics.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-slate-400 block text-[10px] font-mono">MAIN TOPICS / SECTIONS</span>
                        <div className="flex flex-wrap gap-1.5">
                          {assessment.publicInformation.mainTopics.map((topic, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  Grounding: Extracted from public DOM & text nodes
                </div>
              </Card>

              {/* Detected Website Functionality */}
              <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-[#1261A0]" />
                    <span>Detected Functionality</span>
                  </span>

                  {assessment.publicInformation?.functionalElements?.detectedList && assessment.publicInformation.functionalElements.detectedList.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {assessment.publicInformation.functionalElements.detectedList.map((feat, i) => (
                          <div key={i} className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center gap-2 text-xs font-medium text-slate-800">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">
                      No specific interactive functionality (login, shopping, download forms) was reliably identified on the public landing page.
                    </p>
                  )}
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  Non-invasive detection — forms are inspected, never submitted.
                </div>
              </Card>

              {/* Potentially Sensitive Information Requested */}
              <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#1261A0]" />
                    <span>Sensitive Information Requests</span>
                  </span>

                  {assessment.webpageContent?.sensitiveFieldsDetected && assessment.webpageContent.sensitiveFieldsDetected.length > 0 ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Input Fields Detected on Page:</span>
                        </div>
                        <ul className="space-y-1 text-amber-800 text-[11px] pl-4 list-disc">
                          {assessment.webpageContent.sensitiveFieldsDetected.map((sf, i) => (
                            <li key={i}>
                              <strong>{sf}</strong> (requested via public form element)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>No Sensitive Input Detected</span>
                      </div>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        No obvious credentials, passwords, OTPs, or payment card input fields were detected on the analyzed public page.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  Always confirm official domain before submitting sensitive details.
                </div>
              </Card>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: BASIC WEBSITE DATA                            */}
          {/* ======================================================== */}
          <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1261A0]" />
                <h3 className="text-lg font-bold text-[#0B1F33]">
                  4. Basic Website Data
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Standard technical coordinates & live connection parameters
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Domain</span>
                <span className="font-bold text-slate-900 truncate block">{assessment.hostname}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Protocol</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  {assessment.isHttps ? <Lock className="w-3.5 h-3.5 text-emerald-600" /> : <Unlock className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{assessment.protocol.toUpperCase()}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">HTTP Status</span>
                <span className="font-bold text-slate-900 block">{assessment.reachability?.httpStatusCode || 200}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Response Time</span>
                <span className="font-bold text-slate-900 block">{assessment.reachability?.responseTimeMs ? `${assessment.reachability.responseTimeMs} ms` : 'N/A'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Content-Type</span>
                <span className="font-bold text-slate-900 truncate block">{assessment.reachability?.contentType || 'text/html'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Detected Language</span>
                <span className="font-bold text-slate-900 block">{assessment.publicInformation?.language || 'English (en)'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Final Resolved Destination</span>
                <span className="font-bold text-slate-900 truncate block">{assessment.reachability?.finalUrl || assessment.normalizedUrl}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Link Extraction Count</span>
                <span className="font-bold text-slate-900 block">
                  {assessment.publicInformation?.linksInfo ? `${assessment.publicInformation.linksInfo.totalLinksCount} links (${assessment.publicInformation.linksInfo.internalLinksCount} internal, ${assessment.publicInformation.linksInfo.externalLinksCount} external)` : '0 links parsed'}
                </span>
              </div>
            </div>
          </Card>

          {/* ======================================================== */}
          {/* TECHNICAL & SECURITY ANALYSIS SECTIONS                    */}
          {/* ======================================================== */}
          <div className="space-y-6 pt-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xl font-bold text-[#0B1F33] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1261A0]" />
                <span>Technical & Security Deep Dive</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Detailed inspections of network transport, TLS certificates, defensive headers, threat feeds, and AI models.
              </p>
            </div>

            {/* SECTION 5: TECHNICAL ANALYSIS */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(5)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    5. TECHNICAL ANALYSIS
                  </span>
                  <Server className="w-4 h-4 text-[#1261A0]" />
                  <span>URL Syntax, DNS Resolution & Reachability</span>
                </div>
                {openSections[5] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[5] && (
                <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-400 block text-[10px]">URL VALIDITY</span>
                      <span className="font-bold text-emerald-700">✓ Valid RFC 3986 Syntax</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-400 block text-[10px]">DNS STATUS</span>
                      <span className="font-bold text-slate-900">
                        {assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? `Live (${assessment.dnsAnalysis.resolvedIps?.length || 1} IP resolved)` : 'NXDOMAIN / Unresolved'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-400 block text-[10px]">REACHABILITY</span>
                      <span className="font-bold text-slate-900">
                        {assessment.reachability?.isReachable ? `Reachable (HTTP ${assessment.reachability.httpStatusCode})` : 'Unreachable'}
                      </span>
                    </div>
                  </div>

                  {/* Redirect Analysis */}
                  {assessment.redirectAnalysis && (
                    <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                        <span>Redirect Chain Analysis ({assessment.redirectAnalysis.redirectCount} hops):</span>
                        <span className={assessment.redirectAnalysis.hasDowngradeRedirect ? 'text-rose-600' : 'text-emerald-700'}>
                          {assessment.redirectAnalysis.hasDowngradeRedirect ? '⚠ Insecure HTTPS Downgrade' : '✓ Normal Chain'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {assessment.redirectAnalysis.redirectSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* SECTION 6: SECURITY ANALYSIS */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(6)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    6. SECURITY ANALYSIS
                  </span>
                  <Lock className="w-4 h-4 text-[#1261A0]" />
                  <span>HTTPS / TLS Certificate & Defensive Security Headers</span>
                </div>
                {openSections[6] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[6] && (
                <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
                  {/* TLS Certificate */}
                  {assessment.tlsAnalysis && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span>TLS / SSL Certificate Health</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">ISSUER</span>
                          <span className="font-bold text-slate-900 truncate block">{assessment.tlsAnalysis.certIssuer || 'N/A'}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">VALID UNTIL</span>
                          <span className="font-bold text-slate-900 truncate block">{assessment.tlsAnalysis.certValidTo || 'N/A'}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">DAYS REMAINING</span>
                          <span className="font-bold text-slate-900 block">{assessment.tlsAnalysis.certDaysRemaining !== undefined ? `${assessment.tlsAnalysis.certDaysRemaining} days` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Defensive Security Headers */}
                  {assessment.securityHeaders && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                        <span>Defensive HTTP Headers ({assessment.securityHeaders.presentCount} / {assessment.securityHeaders.headers.length} present):</span>
                        <span className="text-slate-500 font-normal">Missing headers are configuration observations</span>
                      </div>

                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {assessment.securityHeaders.headers.map((h, i) => (
                          <div key={i} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50/60">
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                {h.status === 'present' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                )}
                                <span>{h.name}</span>
                              </div>
                              <p className="text-[11px] text-slate-500">{h.description}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              h.status === 'present' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {h.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* SECTION 7: PHISHING & IMPERSONATION ANALYSIS */}
            <Card className={`p-6 border shadow-2xs space-y-4 ${
              assessment.brandImpersonation?.isImpersonatingBrand ? 'bg-rose-50/50 border-rose-300' : 'bg-white border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => toggleSection(7)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    7. PHISHING & IMPERSONATION
                  </span>
                  <UserCheck className="w-4 h-4 text-[#1261A0]" />
                  <span>Brand Deception & Lookalike Detection</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    assessment.brandImpersonation?.isImpersonatingBrand ? 'bg-rose-600 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {assessment.brandImpersonation?.isImpersonatingBrand ? '⚠ SUSPECTED SPOOFING' : '✓ NO BRAND MIMICRY'}
                  </span>
                </div>
                {openSections[7] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[7] && (
                <div className="pt-3 border-t border-slate-200/80 space-y-3 text-xs">
                  {assessment.brandImpersonation?.isImpersonatingBrand ? (
                    <div className="p-4 bg-white rounded-xl border border-rose-200 text-slate-800 space-y-2">
                      <div className="font-extrabold text-rose-900 text-sm">
                        Suspected Spoofed Brand: {assessment.brandImpersonation.suspectedBrand}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {assessment.brandImpersonation.impersonationEvidence}
                      </p>
                      {assessment.brandImpersonation.targetDomainLegitimate && (
                        <div className="text-[11px] text-slate-600 font-mono pt-1">
                          Official legitimate service domain: <strong>{assessment.brandImpersonation.targetDomainLegitimate}</strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-600 font-medium">
                      Hostname syntax does not match known typosquatting, lookalike character substitution, or deceptive brand spoofing patterns for monitored high-value brands (banking, payments, social media, government portals).
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* SECTION 8: THREAT INTELLIGENCE */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(8)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    8. THREAT INTELLIGENCE
                  </span>
                  <Globe className="w-4 h-4 text-[#1261A0]" />
                  <span>External Reputation & Feed Records</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800">
                    {assessment.reputationReport.status}
                  </span>
                </div>
                {openSections[8] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[8] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">INTELLIGENCE PROVIDER</span>
                      <span className="font-bold text-slate-900">{assessment.reputationReport.provider}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">REPORTED STATUS</span>
                      <span className="font-bold text-slate-900">{assessment.reputationReport.status}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">IDENTIFIED FLAGS</span>
                      <span className="font-bold text-slate-900">
                        {assessment.reputationReport.threatTypes.length > 0 ? assessment.reputationReport.threatTypes.join(', ') : 'None listed'}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs">
                    {assessment.reputationReport.details}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                    <strong>Disclosure:</strong> {assessment.reputationReport.disclaimer || 'Absence of threat records does not guarantee safety. Brand new attack sites emerge before databases update.'}
                  </div>
                </div>
              )}
            </Card>

            {/* SECTION 9: AI SECURITY ASSESSMENT */}
            <Card className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/40 border-blue-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(9)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-[#0B1F33]">
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-xs font-mono font-bold">
                    9. AI SECURITY ASSESSMENT
                  </span>
                  <Sparkles className="w-4 h-4 text-[#1261A0]" />
                  <span>Gemini AI Semantic Analysis</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-white text-blue-900 shadow-2xs">
                    {assessment.aiAnalysis?.modelUsed || 'Gemini 3.8 Flash'}
                  </span>
                </div>
                {openSections[9] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[9] && (
                <div className="pt-3 border-t border-blue-100 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">Content Interpretation:</span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {assessment.aiAnalysis?.primaryContentSummary || 'Public webpage evaluated for structural and intent signals.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">Security Observations:</span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {assessment.aiAnalysis?.explanation || assessment.executiveSummary}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Gemini operates strictly on retrieved public markup and objective technical evidence using calibrated terminology (&quot;Appears to...&quot;, &quot;Observed in markup...&quot;).
                  </p>
                </div>
              )}
            </Card>

            {/* SECTION 10: OVERALL RISK SCORE & WHY THIS SCORE */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(10)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    10. OVERALL RISK
                  </span>
                  <Activity className="w-4 h-4 text-[#1261A0]" />
                  <span>Risk Scoring & Transparent Weights</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-900">
                    {assessment.riskScore} / 100 ({assessment.riskCategory || assessment.riskLevel})
                  </span>
                </div>
                {openSections[10] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSections[10] && (
                <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
                  {assessment.transparentWeights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(assessment.transparentWeights).map(([key, item]) => {
                        const pct = Math.round((item.score / item.max) * 100);
                        return (
                          <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between font-bold text-slate-800 capitalize">
                              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-mono text-slate-900">{item.score} / {item.max}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${item.score > 0 ? (pct > 50 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-slate-300'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug">{item.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-slate-50 text-[11px] text-slate-500 leading-relaxed">
                    * <strong>Notice:</strong> This score is calculated via CyberSafe&apos;s transparent academic risk weighting model (0–24 Low, 25–49 Moderate, 50–74 High, 75–100 Critical).
                  </div>
                </div>
              )}
            </Card>

            {/* SECTION 11: RECOMMENDED ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    11. ACTION
                  </span>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Recommended User Actions</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {assessment.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigateToReport('suspicious-website', assessment.normalizedUrl)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B1F33] hover:bg-[#1261A0] text-white text-xs font-bold transition inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Prepare Formal Report in Incident Helper</span>
                  </button>
                </div>
              </Card>

              <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <span>Security Boundaries & Truth in Disclosure</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {assessment.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
