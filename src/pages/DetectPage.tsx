import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Link as LinkIcon, 
  ExternalLink, 
  CheckCircle2, 
  Info, 
  RotateCcw,
  ArrowRight,
  Shield,
  FileCode,
  Lock,
  Unlock
} from 'lucide-react';
import { UrlScanAssessment } from '../types';
import { analyzeUrlSafety } from '../utils/detectorEngine';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface DetectPageProps {
  onNavigateToReport: () => void;
}

export const DetectPage: React.FC<DetectPageProps> = ({ onNavigateToReport }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<UrlScanAssessment | null>(null);

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    // Realistic client-side processing feedback
    setTimeout(() => {
      const result = analyzeUrlSafety(urlInput);
      setAssessment(result);
      setIsAnalyzing(false);
    }, 250);
  };

  const handleClear = () => {
    setUrlInput('');
    setAssessment(null);
  };

  const handleLoadSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeUrlSafety(sampleUrl);
      setAssessment(result);
      setIsAnalyzing(false);
    }, 250);
  };

  const sampleUrls = [
    {
      label: 'Phishing Keyword & High-Risk TLD',
      url: 'https://sbi-netbanking-login-verify.xyz/auth'
    },
    {
      label: 'Raw Numeric IP Address (Unencrypted HTTP)',
      url: 'http://192.168.1.105/banking/update-kyc.php'
    },
    {
      label: 'Deceptive Subdomain Stacking',
      url: 'https://paytm.com.secure-wallet-recovery.online/claim'
    },
    {
      label: 'Obfuscated "@" Symbol Redirect',
      url: 'https://google.com@phishing-trap-server.top/login'
    },
    {
      label: 'Clean Official Domain (Baseline)',
      url: 'https://cybercrime.gov.in/'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
          <Search className="w-3.5 h-3.5" />
          <span>Client-Side URL Risk Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Check Before You Click.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          Analyze a suspicious URL and understand the signals that may indicate increased risk.
        </p>
        <p className="text-sm text-slate-500 leading-relaxed">
          Paste any link you received via SMS, WhatsApp, email, or social media to inspect its protocol, hostname structure, suspicious keywords, and domain characteristics before opening it.
        </p>
      </div>

      {/* URL Input Form Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Web Address / URL to Inspect
            </label>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="url-input-field"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste a URL, for example https://example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isAnalyzing || !urlInput.trim()}
                  icon={<Search className="w-4 h-4" />}
                  className="w-full sm:w-auto shrink-0"
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

          {/* Sample Testing Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500">
              Try a sample scenario to see how heuristic detection works:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sampleUrls.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Security & Zero-Contact Privacy Guarantee Callout */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Privacy & Zero-Contact Security Architecture</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            CyberSafe treats every submitted URL strictly as an untrusted text string. We <strong>never</strong> visit, fetch, crawl, or render the target website, and no data is sent to external advertising networks. Analysis is executed 100% locally within your browser.
          </p>
        </div>
      </Card>

      {/* CyberSafe Risk Assessment Results Display */}
      {assessment && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Assessment Header Card */}
          <Card
            className={`p-6 sm:p-8 border ${
              assessment.riskLevel === 'Low Risk'
                ? 'bg-emerald-50/70 border-emerald-300'
                : assessment.riskLevel === 'Medium Risk'
                ? 'bg-amber-50/80 border-amber-300'
                : 'bg-rose-50/90 border-rose-300'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    CyberSafe Risk Assessment
                  </span>

                  {/* Accessible Badging: text + color */}
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

                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Score: {assessment.riskScore} / 100
                  </span>
                </div>

                {/* Plain-English Explanation */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {assessment.riskLevel === 'High Risk'
                    ? 'Elevated Risk: Multiple Deceptive Characteristics Detected'
                    : assessment.riskLevel === 'Medium Risk'
                    ? 'Caution Advised: Unverified or Ambiguous Domain Signals'
                    : 'Low Risk: Conforms to Standard Web Security Conventions'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed">
                  {assessment.explanation}
                </p>

                {/* Technical Coordinates Strip */}
                {assessment.isValid && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-700">
                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      {assessment.isHttps ? (
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>Protocol: <strong>{assessment.protocol}</strong></span>
                    </div>

                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200">
                      <span>Hostname: <strong>{assessment.hostname}</strong></span>
                    </div>

                    {assessment.isIpAddress && (
                      <div className="bg-rose-100 text-rose-900 px-3 py-1.5 rounded-lg border border-rose-200 font-bold">
                        <span>Format: Raw Numeric IP</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* High-Risk Prominent Warning Action Box */}
              {assessment.riskLevel === 'High Risk' && (
                <div className="shrink-0 bg-white p-5 rounded-2xl border-2 border-rose-400 shadow-md space-y-3 max-w-sm">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>URGENT SAFETY ADVISORY</span>
                  </div>
                  <p className="text-xs text-rose-950 font-bold leading-relaxed">
                    Do not enter passwords, OTPs, payment information or personal information on this site.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If you were tricked into submitting banking credentials or personal documents, take immediate containment steps:
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full text-xs"
                    onClick={onNavigateToReport}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    Open Incident Containment Guide
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Indicators Breakdown & Transparent Explanations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Transparent Indicators */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>Detected Indicators ({assessment.indicators.length})</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Heuristic Signals</span>
              </div>

              <div className="space-y-3">
                {assessment.indicators.map((ind, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 border transition-all ${
                      ind.status === 'risk'
                        ? 'bg-rose-50/60 border-rose-200'
                        : ind.status === 'warning'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                          {ind.iconType === 'danger' && (
                            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          {ind.iconType === 'alert' && (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          {ind.iconType === 'check' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <span>{ind.name}</span>
                        </div>

                        {ind.impactPoints > 0 ? (
                          <span className="text-xs font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded border border-rose-200 shrink-0">
                            +{ind.impactPoints} Risk Pts
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            Passed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pl-6">
                        {ind.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Recommendations & Methodology */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5 space-y-3 border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Actionable Recommendations</span>
                </h3>

                <ul className="space-y-2.5">
                  {assessment.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Transparent Methodology & Scoring Guide */}
              <Card className="p-5 space-y-3 bg-slate-50 border-slate-200 text-xs text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>How CyberSafe Scores URLs</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 font-medium">
                    <span className="text-emerald-700 font-bold">0 – 29</span>
                    <span>Low Risk (Clean syntax, HTTPS, standard host)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 font-medium">
                    <span className="text-amber-700 font-bold">30 – 59</span>
                    <span>Medium Risk (Shorteners, auth keywords, deep subdomains)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 font-medium">
                    <span className="text-rose-700 font-bold">60 – 100</span>
                    <span>High Risk (Raw IP, unencrypted, @ symbol, malware extensions)</span>
                  </div>
                </div>
              </Card>

              {/* Mandatory Heuristic Limitation Box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 text-xs text-slate-500">
                <span className="font-bold text-slate-700">Important Technical Limitation:</span>
                <p className="leading-relaxed">
                  A heuristic URL assessment evaluates address syntax and known threat markers; it cannot guarantee that a website is definitively safe or malicious. Advanced attackers can host malicious scripts on legitimate compromised domains. Always verify unknown services independently.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
