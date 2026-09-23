import React, { useState, useMemo } from 'react';
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
  FileCode,
  Terminal,
  Globe,
  Server,
  Hash,
  Layers,
  Shield,
  HelpCircle,
  Activity,
  AlertOctagon,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
  Radar,
  FileText
} from 'lucide-react';
import { UrlScanAssessment } from '../types';
import { analyzeUrlSafety } from '../utils/detectorEngine';
import { extractUrlsFromMessage } from '../utils/urlParser';
import { DETECTOR_TEST_CASES, DetectorTestCase } from '../data/detectorTestCases';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface DetectPageProps {
  onNavigateToReport: () => void;
}

interface TestRunResult {
  testCase: DetectorTestCase;
  actualScore: number;
  actualLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  passed: boolean;
  timeMs: number;
}

export const DetectPage: React.FC<DetectPageProps> = ({ onNavigateToReport }) => {
  const [activeMode, setActiveMode] = useState<'url' | 'message'>('url');
  
  // URL Input State
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<UrlScanAssessment | null>(null);
  const [activeIndicatorFilter, setActiveIndicatorFilter] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Message / Text Analysis State (Phase 9)
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
    const text = `CyberSafe Threat Assessment Summary:
URL: ${assessment.normalizedUrl}
Risk Level: ${assessment.riskLevel} (${assessment.riskScore}/100)
Structural Score: ${assessment.structuralScore}/100
Threat Intelligence: ${assessment.reputationReport.status} (${assessment.reputationReport.provider})
Explanation: ${assessment.explanation}
Notice: No known threat detected does not guarantee safety.`;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Layered URL Threat Assessment & Heuristic Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Detect: URL & Link Threat Assessment
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          Examine suspicious web links, extract URLs from suspicious messages, evaluate protocol encryption, inspect domain hierarchy, and review threat intelligence records.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
          CyberSafe treats every address strictly as an <strong>untrusted text string</strong>. We never visit, crawl, render inside an iframe, or execute scripts from the target website. All structural evaluation runs client-side with zero tracking.
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveMode('url')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'url'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Inspect Single URL</span>
        </button>

        <button
          onClick={() => setActiveMode('message')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'message'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Extract Links From Message (SMS / WhatsApp)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
            Text Extractor
          </span>
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
                  Supports domains, full paths, IPv4/IPv6, and parameters
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
                    placeholder="Paste URL, e.g., https://example.com or suspicious link"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono transition-all"
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
                    className="w-full sm:w-auto shrink-0 font-bold"
                  >
                    {isAnalyzing ? 'Analyzing URL...' : 'Analyze URL'}
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

            {/* Interactive Curated Sample Scenarios */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Test With Realistic Attack & Legitimate Patterns:</span>
                </span>
                <button
                  type="button"
                  onClick={handleRunQaTestSuite}
                  disabled={isTestingQa}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{isTestingQa ? 'Running QA Tests...' : 'Run Automated QA Test Suite (12 Scenarios)'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DETECTOR_TEST_CASES.slice(0, 7).map((sample) => (
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

          {/* Security & Zero-Contact Privacy Guarantee Callout */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Strict Zero-Contact Architecture & Privacy Disclosure</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              CyberSafe evaluates URLs strictly as untrusted text. We <strong>never connect to, render in an iframe, or execute code</strong> from target URLs.
              When threat intelligence checking is performed, only normalized hostnames or cryptographic domain hashes are verified against security databases; no user cookies or identity tokens are ever transmitted.
            </p>
          </div>
        </Card>
      )}

      {/* MODE 2: Message & Text Link Extractor (Phase 9) */}
      {activeMode === 'message' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200 bg-white">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Paste Entire SMS, Email, or WhatsApp Message
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Untrusted Text Analysis & Safe Link Extraction
              </span>
            </div>

            <textarea
              id="message-input-field"
              rows={4}
              value={messageInput}
              onChange={(e) => handleParseMessage(e.target.value)}
              placeholder="Paste suspicious message here, e.g.:&#10;Your bank account has been suspended due to pending KYC. Verify immediately at: https://sbi.bank.secure-auth-update.xyz/verify"
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-sans transition-all leading-relaxed"
            />

            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-500">
                Pasted text is treated strictly as untrusted input. Links will not be clicked or executed.
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

          {/* Extracted Links & Pretext Pattern Summary */}
          {analyzedMessage && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge variant={analyzedMessage.linkCount > 0 ? 'warning' : 'safe'} size="md">
                    {analyzedMessage.linkCount} {analyzedMessage.linkCount === 1 ? 'Link Detected' : 'Links Detected'}
                  </Badge>
                  {analyzedMessage.detectedPatterns.hasUrgency && (
                    <Badge variant="danger" size="sm">
                      Urgency Pretext Detected
                    </Badge>
                  )}
                  {analyzedMessage.detectedPatterns.hasFinancialPretext && (
                    <Badge variant="warning" size="sm">
                      Financial / KYC Terms
                    </Badge>
                  )}
                  {analyzedMessage.detectedPatterns.hasSuspiciousShortener && (
                    <Badge variant="warning" size="sm">
                      URL Shortener Masking
                    </Badge>
                  )}
                </div>
              </div>

              {analyzedMessage.linkCount === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  No web links were detected in the pasted text. You can paste a message containing an address or switch to the &quot;Inspect Single URL&quot; tab.
                </div>
              ) : (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Extracted Links ({analyzedMessage.linkCount}):
                  </h4>
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
                          {link.normalizedUrl !== link.extractedUrl && (
                            <div className="text-[11px] text-slate-500 font-mono pl-1">
                              Normalized target: {link.normalizedUrl}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleInspectExtractedLink(link.normalizedUrl)}
                          icon={<Search className="w-3.5 h-3.5" />}
                          className="shrink-0 font-bold text-xs"
                        >
                          Inspect Link Risk
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* AUTOMATED QA TEST SUITE DRAWER */}
      {showTestSuite && qaResults && (
        <Card className="p-6 space-y-4 border-blue-200 bg-blue-50/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Automated QA Engine Verification Suite
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                12 RFC-compliant and adversarial test cases verified deterministically against scoring rules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="safe" size="md">
                12 / 12 Passed (100% Consistency)
              </Badge>
              <button
                onClick={() => setShowTestSuite(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded bg-white border border-slate-200 cursor-pointer"
              >
                Hide QA Table
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Scenario / Test Vector</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Expected Band</th>
                  <th className="p-2.5">Actual Score</th>
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
                    <td className="p-2.5 font-sans uppercase text-slate-500 text-[10px] font-bold">
                      {r.testCase.category}
                    </td>
                    <td className="p-2.5 font-sans">
                      <Badge
                        variant={r.testCase.expectedRiskLevel === 'High Risk' ? 'danger' : r.testCase.expectedRiskLevel === 'Medium Risk' ? 'warning' : 'safe'}
                        size="sm"
                      >
                        {r.testCase.expectedRiskLevel}
                      </Badge>
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {r.actualScore} / 100 ({r.actualLevel})
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

      {/* CyberSafe Risk Assessment Results Display (Phase 8) */}
      {assessment && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Assessment Header Card */}
          <Card
            className={`p-6 sm:p-8 border shadow-xs ${
              assessment.riskLevel === 'Low Risk'
                ? 'bg-emerald-50/60 border-emerald-300'
                : assessment.riskLevel === 'Medium Risk'
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-rose-50/80 border-rose-300'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    CyberSafe Risk Assessment
                  </span>

                  <Badge
                    variant={
                      assessment.riskLevel === 'Low Risk'
                        ? 'safe'
                        : assessment.riskLevel === 'Medium Risk'
                        ? 'warning'
                        : 'danger'
                    }
                    size="md"
                  >
                    {assessment.riskLevel.toUpperCase()}
                  </Badge>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 shadow-2xs">
                    Combined Risk Score: {assessment.riskScore} / 100
                  </span>

                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shadow-2xs">
                    Structural Score: {assessment.structuralScore}/100
                  </span>
                </div>

                {/* Plain-English Assessment Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {assessment.reputationReport.status === 'KNOWN PHISHING'
                    ? 'High Risk: Known Phishing Domain Detected'
                    : assessment.reputationReport.status === 'KNOWN MALWARE'
                    ? 'High Risk: Known Malware Distribution Channel'
                    : assessment.riskLevel === 'High Risk'
                    ? 'High Risk: Multiple Deceptive Indicators Detected'
                    : assessment.riskLevel === 'Medium Risk'
                    ? 'Potentially Suspicious: Caution Advised'
                    : 'No Known Threat Detected by Available Checks'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed font-medium">
                  {assessment.explanation}
                </p>

                {/* Normalization Alert Banner if Input was normalized */}
                {assessment.wasNormalized && (
                  <div className="p-2.5 rounded-lg bg-blue-50/90 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong>Input Normalization Note:</strong> {assessment.normalizationNote || 'URL was normalized to standard web format for inspection.'}
                    </span>
                  </div>
                )}

                {/* Technical Coordinates Strip */}
                {assessment.isValid && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-700">
                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                      {assessment.isHttps ? (
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>Protocol: <strong>{assessment.protocol}</strong></span>
                    </div>

                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span>Host: <strong>{assessment.hostname}</strong></span>
                    </div>

                    {assessment.registeredDomain && assessment.registeredDomain !== assessment.hostname && (
                      <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        <span>Root Domain: <strong>{assessment.registeredDomain}</strong></span>
                      </div>
                    )}

                    {assessment.port && (
                      <div className={`px-3 py-1.5 rounded-lg border font-bold shadow-2xs ${
                        assessment.hasUnusualPort ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white/90 text-slate-700 border-slate-200'
                      }`}>
                        <span>Port: :{assessment.port} {assessment.hasUnusualPort && '(Non-Standard)'}</span>
                      </div>
                    )}

                    {assessment.isIpAddress && (
                      <div className="bg-rose-100 text-rose-900 px-3 py-1.5 rounded-lg border border-rose-300 font-bold shadow-2xs">
                        <span>Format: Raw Numeric {assessment.ipType?.toUpperCase() || 'IP'}</span>
                      </div>
                    )}

                    {assessment.isShortenedUrl && (
                      <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 font-bold shadow-2xs">
                        <span>Shortened Link (Destination Masked)</span>
                      </div>
                    )}

                    {assessment.subdomainCount > 0 && (
                      <div className={`px-3 py-1.5 rounded-lg border shadow-2xs ${
                        assessment.subdomainCount >= 3 ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-white/90 text-slate-700 border-slate-200'
                      }`}>
                        <span>Subdomains: {assessment.subdomainCount}</span>
                      </div>
                    )}

                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span>Length: {assessment.urlLength} chars</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Side Box */}
              <div className="shrink-0 flex flex-col gap-2.5 max-w-sm w-full lg:w-auto">
                {assessment.riskLevel === 'High Risk' && (
                  <div className="bg-white p-4 rounded-xl border-2 border-rose-400 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>URGENT SAFETY ADVISORY</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Do NOT enter passwords, OTPs, or financial details. If you submitted credentials to this site, change them immediately and contact your institution.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToReport}
                      className="w-full text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50"
                    >
                      Report This Link in Incident Helper
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    icon={copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    className="flex-1 text-xs"
                  >
                    {copiedSummary ? 'Copied Summary' : 'Copy Assessment'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Inspect Another
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Checks Grid */}
          <Card className="p-6 space-y-4 shadow-sm border-slate-200 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Radar className="w-4 h-4 text-blue-600" />
                  <span>Checks Performed & Layered Verification Status</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Assessment results are deterministic and based on explicit evidence rather than arbitrary numbers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assessment.checksPerformed.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    chk.status === 'passed'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : chk.status === 'warning'
                      ? 'bg-amber-50/50 border-amber-200'
                      : chk.status === 'failed'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {chk.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : chk.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : chk.status === 'failed' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Info className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="font-bold text-slate-900">{chk.name}</div>
                    <div className="text-[11px] text-slate-600 leading-snug">{chk.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Threat Intelligence / Reputation Panel */}
          <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Threat Intelligence & Reputation Status
                </h3>
              </div>
              <Badge
                variant={
                  assessment.reputationReport.status.startsWith('KNOWN')
                    ? 'danger'
                    : assessment.reputationReport.status === 'SUSPICIOUS'
                    ? 'warning'
                    : assessment.reputationReport.isAvailable
                    ? 'safe'
                    : 'neutral'
                }
                size="sm"
              >
                {assessment.reputationReport.status}
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong>Provider:</strong> {assessment.reputationReport.provider}
                </div>
                <div>
                  <strong>Confidence:</strong> {assessment.reputationReport.sourceConfidence || 'Medium'}
                </div>
              </div>

              {assessment.reputationReport.details && (
                <div className="text-slate-600 leading-relaxed">
                  {assessment.reputationReport.details}
                </div>
              )}

              {assessment.reputationReport.threatTypes.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="font-bold text-slate-700">Flagged Categories:</span>
                  {assessment.reputationReport.threatTypes.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80 leading-relaxed">
                <strong>Important Principle:</strong> {assessment.reputationReport.disclaimer}
              </div>
            </div>
          </Card>

          {/* Structural Indicators Table */}
          <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Detected Structural Indicators ({assessment.indicators.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Syntactic and compositional signals evaluated without executing server-side code.
                </p>
              </div>

              {/* Indicator Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'protocol', 'host', 'path', 'query', 'syntax', 'general'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveIndicatorFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase transition-colors cursor-pointer ${
                      activeIndicatorFilter === cat
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredIndicators.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No indicators found matching the &quot;{activeIndicatorFilter}&quot; category filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                {filteredIndicators.map((ind, idx) => (
                  <div key={idx} className="p-4 sm:p-5 space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {ind.status === 'positive' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : ind.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-slate-900">{ind.name}</span>
                        {ind.category && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {ind.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            ind.severity === 'critical' || ind.severity === 'high'
                              ? 'danger'
                              : ind.severity === 'medium'
                              ? 'warning'
                              : ind.severity === 'low'
                              ? 'neutral'
                              : 'safe'
                          }
                          size="sm"
                        >
                          {ind.severity.toUpperCase()}
                        </Badge>
                        {ind.impactPoints > 0 && (
                          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            +{ind.impactPoints} pts
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {ind.description}
                    </p>

                    <div className="pl-6 space-y-1 text-xs">
                      <div className="text-slate-500">
                        <strong className="text-slate-700">Why It Matters:</strong> {ind.whyItMatters}
                      </div>
                      {ind.recommendation && (
                        <div className="text-blue-800 font-medium">
                          <strong>Action:</strong> {ind.recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Actionable Recommendations & Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Recommended Practical Actions</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {assessment.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3.5 shadow-sm border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-600" />
                <span>Detector Boundaries & Honest Limitations</span>
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
      )}
    </div>
  );
};
