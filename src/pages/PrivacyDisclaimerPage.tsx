import React from 'react';
import { ShieldCheck, Lock, EyeOff, Search, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { PageType } from '../types';
import { INDIA_REPORTING_INFO } from '../data/reportData';

interface PrivacyDisclaimerPageProps {
  initialTab?: 'privacy' | 'disclaimer';
  onNavigate: (page: PageType) => void;
}

export const PrivacyDisclaimerPage: React.FC<PrivacyDisclaimerPageProps> = ({ 
  initialTab = 'privacy',
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'disclaimer'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy Architecture</span>
        </button>
        <button
          onClick={() => setActiveTab('disclaimer')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'disclaimer'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Educational Disclaimer & Limitations</span>
        </button>
      </div>

      {activeTab === 'privacy' ? (
        /* Privacy Section */
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Zero Data Collection Standard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Architecture & Commitment
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              CyberSafe is engineered as an educational public safety initiative. We believe a security platform should never compromise your privacy or collect your personal data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3 border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">No User Accounts or Tracking</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CyberSafe requires no accounts, email registrations, or user passwords. We do not use persistent advertising cookies, fingerprinting pixels, or third-party behavioral analytics.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Client-Side URL Analysis</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you analyze a link in <strong>Check Before You Click</strong>, the evaluation executes entirely within your browser's local sandbox. CyberSafe does not transmit the URL to external marketing databases and <strong>never</strong> visits or fetches the submitted website.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Local Checklist Storage</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your progress in the Personal Safety Checklist is stored solely in your browser's standard local storage (<code className="text-slate-800 font-mono text-xs">localStorage</code>) so you can resume your audit later. Clearing your browser cache removes this data instantly.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">No Incident Data Collection</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Evidence Checklist and Incident Response sections are purely instructional tools. CyberSafe does not collect, record, or upload files, transaction IDs, or police complaint materials.
              </p>
            </Card>
          </div>

          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs">
            <span className="text-slate-700 font-medium">
              Want to review official Indian cyber security resources?
            </span>
            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 hover:text-blue-800 underline inline-flex items-center gap-1"
            >
              <span>{INDIA_REPORTING_INFO.portalLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Disclaimer Section */
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Legal & Institutional Scope</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Educational Scope & Disclaimer
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              Please read these standard boundaries regarding the scope and operational characteristics of the CyberSafe platform.
            </p>
          </div>

          {/* Mandatory Verbatim Disclaimer Box */}
          <Card className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-4 border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Institutional Statement</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-slate-100">
              "CyberSafe is an educational and assistance platform. It is not a government agency and does not replace official reporting systems, law enforcement, emergency services or professional legal advice."
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              CyberSafe is an academic community initiative designed to build practical cyber safety awareness for everyday internet users. It is not affiliated with the Government of India, the Ministry of Home Affairs, state police departments, or any official law enforcement authority.
            </p>
          </Card>

          {/* Specific URL Detector Limitation */}
          <Card className="p-6 sm:p-8 border-slate-200 space-y-4 bg-white">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Search className="w-4 h-4 text-amber-600" />
              <span>URL Risk Assessment Limitation</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              "A heuristic URL assessment cannot guarantee that a website is safe or malicious."
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The <em>Check Before You Click</em> tool analyzes address syntax, protocol usage, IP formats, and known deception heuristics in real time. However, heuristic analysis cannot foresee newly registered benign domains that become compromised, or sophisticated polymorphic phishing vectors.
            </p>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1 font-medium">
              <div>Key Safety Rule:</div>
              <p>
                A "Low Risk" score does not mean a webpage is 100% safe. Always verify the domain name in your browser's address bar, and never share OTPs, UPI PINs, or banking passwords with unsolicited contacts.
              </p>
            </div>
          </Card>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('report')}
            >
              View Official Reporting Information
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('learn')}
            >
              Explore Educational Guides
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
