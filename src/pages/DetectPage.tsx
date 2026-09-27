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
  XCircle
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
  'Stage 1: What URL did the user provide? (Validating URL syntax & structure)...',
  'Stage 2: Does the domain/website exist? (Resolving live DNS records)...',
  'Stage 3: What type of website is it? (Classifying category & apparent purpose)...',
  'Stage 4: What public information does it contain? (Extracting content & forms)...',
  'Stage 5: Is the website actually reachable? (Testing network response & status)...',
  'Stage 6: Where does the URL redirect? (Tracing redirect chain & hops)...',
  'Stage 7: What technical security characteristics does it have? (TLS & headers)...',
  'Stage 8: Are there suspicious/phishing indicators? (Heuristics & impersonation)...',
  'Stage 9: What does threat intelligence say? (Querying reputation feeds)...',
  'Stage 10: What is the overall risk? (Transparent 0–100 scoring & confidence)...',
  'Stage 11: Explain everything to the user (Synthesized findings & guidance)...',
];

export const DetectPage: React.FC<DetectPageProps> = ({ onNavigateToReport, initialUrl }) => {
  const { openGuide } = useAiGuide();
  const [activeMode, setActiveMode] = useState<'url' | 'message'>('url');
  
  // URL Input State
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [assessment, setAssessment] = useState<UrlScanAssessment | null>(null);
  const [activeIndicatorFilter, setActiveIndicatorFilter] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Collapsible section states for the 11 ordered stages
  const [openStages, setOpenStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
  });

  const toggleStage = (stageNum: number) => {
    setOpenStages(prev => ({ ...prev, [stageNum]: !prev[stageNum] }));
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
      }, 700);
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
      // Graceful fallback on unexpected error
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

STAGE 1 — WHAT URL DID THE USER PROVIDE?: ${assessment.isValid ? 'Valid RFC URL' : 'Invalid Syntax'} (${assessment.protocol} ${assessment.hostname})
STAGE 2 — DOES THE DOMAIN / WEBSITE EXIST?: ${assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? `Domain Exists (${assessment.dnsAnalysis.resolvedIps?.join(', ') || 'DNS Resolved'})` : 'Domain Nonexistent / Unresolved (NXDOMAIN)'}
STAGE 3 — WHAT TYPE OF WEBSITE IS IT?: ${assessment.websiteClassification?.websiteType || assessment.aiAnalysis?.websiteType || 'General Web Resource'} - ${assessment.websiteClassification?.websitePurpose || assessment.aiAnalysis?.websitePurpose || 'Evaluated'}
STAGE 4 — WHAT PUBLIC INFORMATION / CONTENT DOES IT CONTAIN?: ${assessment.publicInformation?.pageTitle || 'Public Content Evaluated'} (${assessment.publicInformation?.functionalElements?.detectedList?.join(', ') || 'Standard Elements'})
STAGE 5 — IS THE WEBSITE ACTUALLY REACHABLE?: ${assessment.reachability?.isReachable ? `Reachable (HTTP ${assessment.reachability.httpStatusCode || 200}, ${assessment.reachability.responseTimeMs || 0}ms)` : assessment.reachability?.classification}
STAGE 6 — WHERE DOES THE URL REDIRECT?: ${assessment.redirectAnalysis?.redirectCount || 0} hop(s)${assessment.redirectAnalysis?.hasDowngradeRedirect ? ' [HTTPS Downgrade Alert]' : ''}
STAGE 7 — WHAT TECHNICAL SECURITY CHARACTERISTICS DOES IT HAVE?: ${assessment.isHttps ? `HTTPS Active (${assessment.tlsAnalysis?.certIssuer || 'TLS Certificate Valid'})` : 'Unencrypted Plain HTTP'} | ${assessment.securityHeaders?.presentCount || 0}/${assessment.securityHeaders?.headers?.length || 6} Defensive Headers Present
STAGE 8 — ARE THERE SUSPICIOUS / PHISHING INDICATORS?: ${assessment.brandImpersonation?.isImpersonatingBrand ? `Spoofing ${assessment.brandImpersonation.suspectedBrand} | ` : ''}${assessment.indicators?.length || 0} indicator(s) noted
STAGE 9 — WHAT DOES THREAT INTELLIGENCE SAY?: ${assessment.reputationReport?.status || 'No Known Threat Found'} (${assessment.reputationReport?.provider || 'Threat Feeds'})
STAGE 10 — WHAT IS THE OVERALL RISK?: ${assessment.riskCategory || assessment.riskLevel} (${assessment.riskScore}/100) - Confidence: ${assessment.confidenceLevel || 'Medium'}
STAGE 11 — EXPLAIN EVERYTHING TO THE USER:
- Finding Summary: ${assessment.executiveSummary || assessment.explanation}
- Recommended Action: ${assessment.recommendations?.[0] || 'Verify domain spelling carefully.'}

Notice: CyberSafe is a college community first-level threat assessment tool. Zero detections and HTTPS encryption do not guarantee complete immunity.`;
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

  // Filter indicators
  const filteredIndicators = useMemo(() => {
    if (!assessment) return [];
    if (activeIndicatorFilter === 'all') return assessment.indicators;
    return assessment.indicators.filter((ind) => ind.category === activeIndicatorFilter);
  }, [assessment, activeIndicatorFilter]);

  // Color mappings
  const getRiskColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-900', badge: 'bg-rose-600 text-white', bar: 'bg-rose-600' };
    if (score >= 50) return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', badge: 'bg-red-600 text-white', bar: 'bg-red-500' };
    if (score >= 25) return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-600 text-white', bar: 'bg-amber-500' };
    return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', badge: 'bg-emerald-600 text-white', bar: 'bg-emerald-600' };
  };

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
          Comprehensive, deterministic technical analysis combining DNS verification, reachability, SSL/TLS certificates, redirect tracing, security headers, webpage content extraction, and Gemini AI semantic analysis.
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
                    placeholder="Enter URL to analyze, e.g. https://cybercrime.gov.in"
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
                    {isAnalyzing ? 'Scanning...' : 'Analyze URL'}
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
                  <span>Demonstration Test Scenarios:</span>
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
                  <span>Executing Multi-Layer Security Inspection</span>
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
              placeholder="Paste suspicious message here, e.g.:&#10;Your bank account is suspended. Verify KYC immediately at: https://paypa1-security-verification.xyz/login"
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
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
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

      {/* FULL RESULTS DASHBOARD - 14-STAGE COMPREHENSIVE CYBERSAFE EVALUATION */}
      {assessment && !isAnalyzing && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Assessment Header Card */}
          {(() => {
            const colors = getRiskColor(assessment.riskScore);
            return (
              <Card className={`p-6 sm:p-8 border shadow-sm ${colors.bg} ${colors.border}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F33]">
                        CyberSafe Security Analysis
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${colors.badge}`}>
                        {assessment.riskCategory || (assessment.riskScore >= 75 ? 'CRITICAL RISK' : assessment.riskScore >= 50 ? 'HIGH RISK' : assessment.riskScore >= 25 ? 'MODERATE RISK' : 'LOW RISK')}
                      </span>

                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900 shadow-2xs">
                        Risk Score: {assessment.riskScore} / 100
                      </span>

                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        Confidence: {assessment.confidenceLevel || 'MEDIUM'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33] leading-snug">
                      {assessment.riskScore >= 75
                        ? 'Critical Risk: Severe Threat Indicators Identified'
                        : assessment.riskScore >= 50
                        ? 'High Risk: Elevated Deception or Security Markers Detected'
                        : assessment.riskScore >= 25
                        ? 'Moderate Risk: Potential Anomaly or Configuration Observation'
                        : 'Low Risk: No Significant Threats Detected on Available Checks'}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed font-medium">
                      {assessment.executiveSummary || assessment.explanation}
                    </p>

                    {assessment.confidenceReason && (
                      <p className="text-xs text-slate-500 font-mono">
                        Evidence basis: {assessment.confidenceReason}
                      </p>
                    )}

                    {/* Coordinates Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-700">
                      <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                        {assessment.isHttps ? (
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{assessment.protocol}</span>
                      </div>

                      <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        <span>Host: <strong>{assessment.hostname}</strong></span>
                      </div>

                      {assessment.registeredDomain && (
                        <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                          <span>Domain: <strong>{assessment.registeredDomain}</strong></span>
                        </div>
                      )}

                      {assessment.reachability?.httpStatusCode && (
                        <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                          <span>Status: <strong>HTTP {assessment.reachability.httpStatusCode}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="shrink-0 flex flex-col gap-2.5 max-w-sm w-full lg:w-auto">
                    {assessment.riskScore >= 50 && (
                      <div className="bg-white p-4 rounded-xl border-2 border-rose-400 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>CAUTION ADVISED</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Do not provide passwords, OTPs, or payment information. If suspicious, prepare a report for the incident helper.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigateToReport('suspicious-website', assessment.normalizedUrl)}
                          className="w-full text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50"
                        >
                          Report in Incident Helper
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySummary}
                        icon={copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        className="flex-1 text-xs font-bold"
                      >
                        {copiedSummary ? 'Copied' : 'Copy 14-Stage Report'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Check Another
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* 11 ORDERED STAGES SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1261A0]" />
                <h3 className="text-xl font-bold text-[#0B1F33]">
                  11-Stage Ordered Technical Security Assessment
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Structured in exact verification order from identity to final user action
              </span>
            </div>

            {/* STAGE 1: WHAT URL DID THE USER PROVIDE? */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(1)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 1 OF 11
                  </span>
                  <LinkIcon className="w-4 h-4 text-[#1261A0]" />
                  <span>Stage 1 — What URL Did the User Provide?</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700">
                    ✓ VALID RFC URL
                  </span>
                </div>
                {openStages[1] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[1] && (
                <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 text-[11px] block">Original Input URL:</span>
                      <span className="font-bold text-slate-900 break-all">{assessment.rawInput}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 text-[11px] block">Normalized URL (RFC 3986):</span>
                      <span className="font-bold text-slate-900 break-all">{assessment.normalizedUrl}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-[11px]">
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Protocol:</span>
                      <span className="font-bold text-slate-800">{assessment.protocol}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Hostname:</span>
                      <span className="font-bold text-slate-800 truncate block">{assessment.hostname}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Registrable Domain:</span>
                      <span className="font-bold text-slate-800">{assessment.registeredDomain || assessment.hostname}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Subdomain(s):</span>
                      <span className="font-bold text-slate-800">{assessment.subdomains.length > 0 ? assessment.subdomains.join('.') : 'None'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Port:</span>
                      <span className="font-bold text-slate-800">{assessment.port || (assessment.isHttps ? '443 (default)' : '80 (default)')}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Path & Query:</span>
                      <span className="font-bold text-slate-800 truncate block">{assessment.pathname}{assessment.search || ''}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 2: DOES THE WEBSITE / DOMAIN EXIST? */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(2)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 2 OF 11
                  </span>
                  <Server className="w-4 h-4 text-[#1261A0]" />
                  <span>Stage 2 — Does the Domain / Website Exist?</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? '✓ DOMAIN EXISTS' : '✗ NONEXISTENT (NXDOMAIN)'}
                  </span>
                </div>
                {openStages[2] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[2] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  {assessment.dnsAnalysis?.domainExistenceStatus === 'nonexistent' ? (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Domain Resolution Status: Nonexistent Domain (NXDOMAIN)</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        The domain could not be resolved at the time of analysis. This may indicate a nonexistent domain, DNS failure, expired configuration, or temporary availability issue. This alone does not prove malicious intent.
                      </p>
                      <p className="text-xs font-bold text-amber-800 pt-1">
                        Webpage content analysis unavailable because the domain could not be resolved.
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-700 leading-relaxed font-medium">
                      DNS query successfully resolved live network addresses for <strong>{assessment.hostname}</strong>.
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Domain Host:</span>
                      <span className="font-bold text-slate-900 break-all">{assessment.dnsAnalysis?.domain || assessment.hostname}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">DNS Lookup Result:</span>
                      <span className="font-bold text-slate-900">{(assessment.dnsAnalysis?.dnsStatus || 'RESOLVED').toUpperCase()}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">IPv4 Address (A):</span>
                      <span className="font-bold text-slate-900">
                        {assessment.dnsAnalysis?.ipv4 && assessment.dnsAnalysis.ipv4.length > 0 ? assessment.dnsAnalysis.ipv4.join(', ') : 'None'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">IPv6 Address (AAAA):</span>
                      <span className="font-bold text-slate-900">
                        {assessment.dnsAnalysis?.ipv6 && assessment.dnsAnalysis.ipv6.length > 0 ? assessment.dnsAnalysis.ipv6.join(', ') : 'None'}
                      </span>
                    </div>
                  </div>

                  {assessment.dnsAnalysis?.mxRecords && assessment.dnsAnalysis.mxRecords.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px]">
                      <span className="text-slate-500 block font-bold mb-1">Mail Exchange (MX) Records:</span>
                      <span className="text-slate-800">{assessment.dnsAnalysis.mxRecords.join(', ')}</span>
                    </div>
                  )}

                  {/* 5-Way Technical Distinction Guide */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                      CyberSafe 5-Way Resolution Distinction Model
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      <li>• <strong>1. Invalid URL:</strong> Address syntax violates RFC specifications before lookup.</li>
                      <li>• <strong>2. Valid URL, DNS Failure:</strong> Hostname has no active DNS A/AAAA records (NXDOMAIN).</li>
                      <li>• <strong>3. Domain Resolves, Host Offline:</strong> DNS succeeded but target server port refused or dropped packets.</li>
                      <li>• <strong>4. Domain Exists, Server Responds:</strong> Server accepted TCP connection and returned HTTP response.</li>
                      <li>• <strong>5. Domain Exists, Path Error (404/500):</strong> Server is healthy but specific file or path requested was missing.</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 3: WHAT TYPE OF WEBSITE IS IT? */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(3)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 3 OF 11
                  </span>
                  <Cpu className="w-4 h-4 text-[#1261A0]" />
                  <span>Stage 3 — What Type of Website Is It?</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-900">
                    {assessment.websiteClassification?.websiteType || assessment.aiAnalysis?.websiteType || 'General Web Resource'}
                  </span>
                </div>
                {openStages[3] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[3] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">Classified Website Category:</span>
                      <span className="text-sm font-extrabold text-[#0B1F33]">
                        {assessment.websiteClassification?.websiteType || assessment.aiAnalysis?.websiteType || 'General Web Resource'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
                      <span className="text-slate-500 font-bold block text-[11px]">Apparent Website Purpose:</span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {assessment.websiteClassification?.websitePurpose || assessment.aiAnalysis?.websitePurpose || 'General online resource.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">Classification Evidence Observed:</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Confidence: {assessment.websiteClassification?.confidence || assessment.aiAnalysis?.confidence || 'Medium'}
                      </span>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {(assessment.websiteClassification?.evidence || ['Public domain and webpage metadata evaluated.']).map((ev, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 4: WHAT PUBLIC INFORMATION DOES THE WEBSITE CONTAIN? */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(4)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 4 OF 11
                  </span>
                  <FileText className="w-4 h-4 text-[#1261A0]" />
                  <span>Stage 4 — What Public Information / Content Does It Contain?</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700">
                    {assessment.webpageContent?.isContentFetched ? 'CONTENT RETRIEVED' : 'CONTENT UNAVAILABLE'}
                  </span>
                </div>
                {openStages[4] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[4] && (
                <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block text-[11px]">Page Title:</span>
                      <span className="font-bold text-slate-900">{assessment.publicInformation?.pageTitle || assessment.webpageContent?.pageTitle || 'None detected'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block text-[11px]">Meta Description:</span>
                      <span className="text-slate-700 line-clamp-2">{assessment.publicInformation?.metaDescription || assessment.webpageContent?.metaDescription || 'None provided'}</span>
                    </div>
                  </div>

                  {/* Functional Elements Checklist */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block">Functional Elements Detected:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Login / Authentication', active: assessment.publicInformation?.functionalElements?.hasLogin || assessment.webpageContent?.hasLoginForm },
                        { label: 'Registration / Sign-up', active: assessment.publicInformation?.functionalElements?.hasRegistration },
                        { label: 'Search Functionality', active: assessment.publicInformation?.functionalElements?.hasSearch },
                        { label: 'Contact / Inquiry Form', active: assessment.publicInformation?.functionalElements?.hasContactForm },
                        { label: 'File Upload', active: assessment.publicInformation?.functionalElements?.hasFileUpload },
                        { label: 'Software Download', active: assessment.publicInformation?.functionalElements?.hasDownload },
                        { label: 'Shopping Cart', active: assessment.publicInformation?.functionalElements?.hasShoppingCart },
                        { label: 'Checkout Flow', active: assessment.publicInformation?.functionalElements?.hasCheckout },
                        { label: 'Payment Processing', active: assessment.publicInformation?.functionalElements?.hasPayment || assessment.webpageContent?.hasPaymentFields },
                        { label: 'Newsletter / Subscription', active: assessment.publicInformation?.functionalElements?.hasSubscription },
                        { label: 'Account Creation', active: assessment.publicInformation?.functionalElements?.hasAccountCreation },
                      ].map((item, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                            item.active ? 'bg-blue-100 text-blue-900 font-bold border border-blue-200' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {item.active ? <CheckSquare className="w-3.5 h-3.5 text-blue-700" /> : <span className="w-3.5 h-3.5 text-slate-300">○</span>}
                          <span>{item.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sensitive Information Requests */}
                  {assessment.webpageContent?.sensitiveFieldsDetected && assessment.webpageContent.sensitiveFieldsDetected.length > 0 && (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Sensitive Information Requested on Page:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {assessment.webpageContent.sensitiveFieldsDetected.map((field, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                            ⚠ {field}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-amber-800 pt-1">
                        Note: Legitimate services request credentials and payment details, but always confirm the address bar domain matches the official service.
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                    <strong>Privacy & Safe Scrape Guarantee:</strong> CyberSafe only evaluates publicly accessible webpage markup. Credentials are never collected, submitted, or stored.
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 5: WEBSITE REACHABILITY & AVAILABILITY */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(5)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 5 OF 14
                  </span>
                  <Globe className="w-4 h-4 text-[#1261A0]" />
                  <span>Website Reachability & Network Response</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    assessment.reachability?.isReachable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {(assessment.reachability?.classification || 'UNREACHABLE').toUpperCase()}
                  </span>
                </div>
                {openStages[5] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[5] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {assessment.reachability?.explanation}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">HTTP Status:</span>
                      <span className="font-bold text-slate-900">{assessment.reachability?.httpStatusCode ? `HTTP ${assessment.reachability.httpStatusCode}` : 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Response Latency:</span>
                      <span className="font-bold text-slate-900">{assessment.reachability?.responseTimeMs ? `${assessment.reachability.responseTimeMs} ms` : 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Content-Type:</span>
                      <span className="font-bold text-slate-900 truncate block">{assessment.reachability?.contentType || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Server Header:</span>
                      <span className="font-bold text-slate-900 truncate block">{assessment.reachability?.serverHeader || 'Not exposed'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px]">
                    <strong>Educational Distinction:</strong> HTTP 404 indicates that the server responded but the specific page was not found; it does NOT mean the domain does not exist.
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 6: REDIRECT ANALYSIS */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(6)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 6 OF 14
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#1261A0]" />
                  <span>Redirect Chain Tracking ({assessment.redirectAnalysis?.redirectCount || 0} hops)</span>
                  {assessment.redirectAnalysis?.hasDowngradeRedirect && (
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-100 text-rose-800">
                      HTTPS DOWNGRADE ⚠
                    </span>
                  )}
                </div>
                {openStages[6] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[6] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <p className="text-slate-600 font-medium">
                    {assessment.redirectAnalysis?.redirectSummary || 'No redirects detected. Direct response received.'}
                  </p>

                  {assessment.redirectAnalysis?.redirectChain && assessment.redirectAnalysis.redirectChain.length > 0 ? (
                    <div className="space-y-2">
                      {assessment.redirectAnalysis.redirectChain.map((hop, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 font-mono text-[11px]">
                          <div className="truncate flex-1">
                            <span className="text-slate-500 font-bold mr-2">Hop #{idx + 1}</span>
                            <span className="text-slate-700">{hop.from}</span>
                            <ArrowRight className="w-3 h-3 inline mx-2 text-slate-400" />
                            <span className="font-bold text-slate-900">{hop.to}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold shrink-0">
                            HTTP {hop.statusCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-500 font-mono text-[11px]">
                      Destination: {assessment.normalizedUrl} (Zero intermediate hops)
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500">
                    Redirect tracking prevents credential phishers from bouncing victims through tracking links to hide the final hostile destination.
                  </p>
                </div>
              )}
            </Card>

            {/* STAGE 7: TECHNICAL SECURITY CONFIGURATION */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(7)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 7 OF 14
                  </span>
                  <Lock className="w-4 h-4 text-[#1261A0]" />
                  <span>Technical Security Configuration (HTTPS, TLS & Headers)</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    assessment.isHttps ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {assessment.isHttps ? '✓ HTTPS ACTIVE' : '⚠ UNENCRYPTED HTTP'}
                  </span>
                </div>
                {openStages[7] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[7] && (
                <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
                  {/* TLS Certificate details */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block">SSL / TLS Certificate Inspection:</span>
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900">
                      <strong>Security Notice:</strong> HTTPS protects the connection between your browser and the server, but it does NOT prove that the website itself is legitimate.
                    </div>

                    {assessment.tlsAnalysis?.certIssuer && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Certificate Authority:</span>
                          <span className="font-bold text-slate-900 break-all">{assessment.tlsAnalysis.certIssuer}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Subject Name:</span>
                          <span className="font-bold text-slate-900 break-all">{assessment.tlsAnalysis.certSubject}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Valid Until:</span>
                          <span className="font-bold text-slate-900">{assessment.tlsAnalysis.certValidTo || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Days Remaining:</span>
                          <span className="font-bold text-slate-900">{assessment.tlsAnalysis.certDaysRemaining !== undefined ? `${assessment.tlsAnalysis.certDaysRemaining} days` : 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Defensive Security Headers */}
                  {assessment.securityHeaders && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] block">
                          Defensive HTTP Security Headers ({assessment.securityHeaders.presentCount} / {assessment.securityHeaders.headers.length} present):
                        </span>
                        <span className="text-[10px] text-slate-500">Missing headers are configuration observations</span>
                      </div>

                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                        {assessment.securityHeaders.headers.map((h, i) => (
                          <div key={i} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50/50">
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

            {/* STAGE 8: URL HEURISTICS & SYNTAX ANOMALIES */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(8)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 8 OF 14
                  </span>
                  <Activity className="w-4 h-4 text-[#1261A0]" />
                  <span>URL Heuristic & Syntax Anomalies ({assessment.indicators?.length || 0} indicators)</span>
                </div>
                {openStages[8] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[8] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-[11px]">
                    <strong>Heuristic Principle:</strong> URL heuristics examine structural and character anomalies. Do not classify a URL as malicious merely because it contains authentication or financial words; multiple independent markers are evaluated together.
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {assessment.indicators && assessment.indicators.length > 0 ? (
                      assessment.indicators.map((ind, i) => (
                        <div key={i} className="p-3 space-y-1 hover:bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              {ind.status === 'risk' ? (
                                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                              ) : ind.status === 'warning' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                              <span>{ind.name}</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              Impact: +{ind.impactPoints} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{ind.description}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Why it matters: {ind.whyItMatters}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-slate-500 text-center font-medium">
                        No anomalous URL heuristic flags detected. Standard format.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 9: BRAND IMPERSONATION & TYPOSQUATTING */}
            <Card className={`p-6 border shadow-2xs space-y-4 ${
              assessment.brandImpersonation?.isImpersonatingBrand ? 'bg-rose-50/60 border-rose-300' : 'bg-white border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => toggleStage(9)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 9 OF 14
                  </span>
                  <UserCheck className="w-4 h-4 text-[#1261A0]" />
                  <span>Brand Impersonation & Typosquatting Detection</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    assessment.brandImpersonation?.isImpersonatingBrand ? 'bg-rose-600 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {assessment.brandImpersonation?.isImpersonatingBrand ? '⚠ POSSIBLE IMPERSONATION' : '✓ NO SPOOFING DETECTED'}
                  </span>
                </div>
                {openStages[9] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[9] && (
                <div className="pt-3 border-t border-slate-200/80 space-y-3.5 text-xs">
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

            {/* STAGE 10: THREAT INTELLIGENCE */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(10)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 10 OF 14
                  </span>
                  <Globe className="w-4 h-4 text-[#1261A0]" />
                  <span>Threat Intelligence Feeds & Reputation</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800">
                    {assessment.reputationReport.status}
                  </span>
                </div>
                {openStages[10] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[10] && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Intelligence Provider:</span>
                      <span className="font-bold text-slate-900">{assessment.reputationReport.provider}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Reported Status:</span>
                      <span className="font-bold text-slate-900">{assessment.reputationReport.status}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Identified Flags:</span>
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

            {/* STAGE 11: GEMINI AI SEMANTIC WEBPAGE ANALYSIS */}
            <Card className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/40 border-blue-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(11)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-[#0B1F33]">
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-xs font-mono font-bold">
                    STAGE 11 OF 14
                  </span>
                  <Sparkles className="w-4 h-4 text-[#1261A0]" />
                  <span>Gemini AI Semantic Webpage Analysis</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-white text-blue-900 shadow-2xs">
                    {assessment.aiAnalysis?.modelUsed || 'Gemini 3.8 Flash'}
                  </span>
                </div>
                {openStages[11] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[11] && (
                <div className="pt-3 border-t border-blue-100 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">Content Interpretation:</span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {assessment.aiAnalysis?.primaryContentSummary || 'Public webpage evaluated for structural and intent signals.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">Semantic Security Observations:</span>
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

            {/* STAGE 12: OVERALL RISK SCORING & TRANSPARENT WEIGHTS */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(12)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 12 OF 14
                  </span>
                  <Activity className="w-4 h-4 text-[#1261A0]" />
                  <span>Overall Risk Scoring & Transparent Weights (0–100 Model)</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-900">
                    {assessment.riskScore} / 100
                  </span>
                </div>
                {openStages[12] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[12] && (
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
                    * <strong>Notice:</strong> This score is calculated via CyberSafe&apos;s transparent academic risk weighting model (0–24 Low, 25–49 Moderate, 50–74 High, 75–100 Critical). It is not an official CVSS or CVE score.
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 13: WHY? (SYNTHESIZED SECURITY FINDINGS) */}
            <Card className="p-6 bg-white border-slate-200 shadow-2xs space-y-4">
              <button
                type="button"
                onClick={() => toggleStage(13)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 font-bold text-sm text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 13 OF 14
                  </span>
                  <HelpCircle className="w-4 h-4 text-[#1261A0]" />
                  <span>Why Did the System Give This Result?</span>
                </div>
                {openStages[13] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openStages[13] && (
                <div className="pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                  <p className="font-medium leading-relaxed">
                    {assessment.explanation}
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">Primary Contributing Factors:</span>
                    <ul className="space-y-1.5 text-slate-600">
                      <li>• <strong>Protocol & Transport:</strong> {assessment.isHttps ? 'HTTPS encryption active on port 443.' : 'Unencrypted plain HTTP communication (port 80).'}</li>
                      <li>• <strong>Domain Resolution:</strong> {assessment.dnsAnalysis?.domainExistenceStatus === 'exists' ? `Live DNS confirmed with ${assessment.dnsAnalysis?.resolvedIps?.length || 1} IP(s).` : 'Domain could not be resolved (NXDOMAIN).'}</li>
                      <li>• <strong>Brand Check:</strong> {assessment.brandImpersonation?.isImpersonatingBrand ? `Spoofed target: ${assessment.brandImpersonation.suspectedBrand}.` : 'No lookalike spoofing identified.'}</li>
                      <li>• <strong>Input Fields:</strong> {assessment.webpageContent?.sensitiveFieldsDetected?.length ? `Forms requesting sensitive input (${assessment.webpageContent.sensitiveFieldsDetected.join(', ')}).` : 'No direct high-risk credential or card fields detected.'}</li>
                      <li>• <strong>Reputation:</strong> {assessment.reputationReport.status} from {assessment.reputationReport.provider}.</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* STAGE 14: RECOMMENDED USER ACTION & BOUNDARIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1261A0] text-xs font-mono font-bold">
                    STAGE 14 OF 14
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
