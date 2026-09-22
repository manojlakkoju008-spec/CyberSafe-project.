import React, { useState } from 'react';
import { 
  FileWarning, 
  PhoneCall, 
  ExternalLink, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Camera, 
  Clock, 
  Info, 
  KeyRound, 
  Smartphone, 
  Building2, 
  FileText,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { REPORT_CATEGORIES, INDIA_REPORTING_INFO, EVIDENCE_CHECKLIST_ITEMS } from '../data/reportData';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IconHelper } from '../components/common/IconHelper';

interface ReportPageProps {
  initialIncidentId?: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({ initialIncidentId }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialIncidentId && REPORT_CATEGORIES.some(c => c.id === initialIncidentId)) {
      return initialIncidentId;
    }
    return 'financial-fraud';
  });
  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState<string[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const selectedCategory = REPORT_CATEGORIES.find(c => c.id === selectedCategoryId) || REPORT_CATEGORIES[0];

  const toggleEvidence = (id: string) => {
    setCheckedEvidenceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header & Mandatory Non-Affiliation Clarity */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <FileWarning className="w-3.5 h-3.5" />
          <span>Official Reporting Guidance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Need to Report a Cybercrime?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          Step-by-step guidance on how to secure your accounts, preserve vital evidence, and report cyber incidents directly to verified official authorities.
        </p>
      </div>

      {/* Critical Mandatory Disclaimer Banner */}
      <div className="p-4 sm:p-5 bg-amber-50/90 rounded-2xl border-2 border-amber-300 flex items-start gap-3.5 text-xs sm:text-sm text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-amber-900 uppercase tracking-wide">
            CyberSafe is NOT a government reporting portal
          </div>
          <p className="leading-relaxed text-amber-900">
            CyberSafe is an academic educational platform. We do <strong>not</strong> accept, record, or file police complaints. Do not submit sensitive passwords, PINs, or private documents to this website. We connect you with official government hotlines and law enforcement filing portals.
          </p>
        </div>
      </div>

      {/* 2. Visual Prominent Emergency Section: Financial Cyber Fraud (Helpline 1930) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Emergency Financial Fraud Response</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Victim of an Unauthorized Financial Transaction?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              When money has been fraudulently debited via UPI, net banking, or cards, the initial hours are critical. Contact the National Cybercrime Helpline and your bank immediately to attempt an interbank fund freeze.
            </p>
          </div>

          {/* Quick Helpline Box */}
          <div className="shrink-0 bg-slate-800/90 border border-slate-700 p-5 rounded-2xl text-center space-y-2 min-w-[220px]">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              National Helpline (India)
            </div>
            <a 
              href="tel:1930" 
              className="text-4xl font-black text-rose-400 tracking-tight hover:text-rose-300 transition-colors block"
            >
              1930
            </a>
            <div className="text-[11px] text-slate-400">Toll-free 24/7 emergency line</div>
          </div>
        </div>

        {/* Action Steps & Government Portal Link */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>Dial 1930 Immediately</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Have your bank account number, debit reference (UTR), transaction timestamp, and beneficiary UPI ID ready for the operator.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>Alert Your Bank Fraud Cell</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Call your bank’s 24/7 customer care to freeze your net banking, block cards, and file an unauthorized transaction dispute form.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>File on Official Gov Portal</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Lodge an official formal grievance on the Ministry of Home Affairs portal.
              </p>
            </div>
            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors mt-2"
            >
              <span>{INDIA_REPORTING_INFO.portalLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Clear Truth in Recovery Disclaimer */}
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          * Note: CyberSafe cannot stop, reverse, or guarantee the recovery of any funds. Recovery depends strictly on banking protocols, interbank lien capabilities, and law enforcement investigations.
        </div>
      </div>

      {/* 3. Section: "If Your Account Was Compromised" (Sequential Actions) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <span>If Your Account Was Compromised</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            If you suspect unauthorized access to your email, banking, or social media account, execute these five actions in order:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '1',
              title: 'Change Master Password',
              desc: 'Do this immediately from a known trusted device (not the compromised machine). Use a unique 15+ character passphrase.',
              icon: KeyRound
            },
            {
              step: '2',
              title: 'Enable MFA',
              desc: 'Activate Multi-Factor Authentication. Prefer an authenticator app (Google Authenticator, Microsoft Authenticator) over SMS.',
              icon: Smartphone
            },
            {
              step: '3',
              title: 'Revoke Active Sessions',
              desc: 'Navigate to account security settings and select "Log out of all other devices" to terminate the attacker’s active access tokens.',
              icon: ShieldAlert
            },
            {
              step: '4',
              title: 'Contact Service Provider',
              desc: 'Inform the platform support team (Google, Meta, Apple, or bank) through their official verified recovery portal.',
              icon: Building2
            },
            {
              step: '5',
              title: 'Preserve Evidence',
              desc: 'Save email alerts of password changes, device login notifications, and unfamiliar IP addresses before deleting anything.',
              icon: Camera
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="p-4 sm:p-5 border-slate-200 bg-white flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-xs font-extrabold flex items-center justify-center border border-blue-200">
                      Step {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Section: Interactive Evidence Checklist */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-600" />
            <span>Evidence Checklist</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Police officers, cyber cells, and bank dispute teams require tangible digital records. Review and mark off the evidence you have gathered before filing your formal complaint:
          </p>
        </div>

        <Card className="p-6 bg-slate-50 border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EVIDENCE_CHECKLIST_ITEMS.map((item) => {
              const isChecked = checkedEvidenceIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEvidence(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold leading-snug">{item.label}</div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4">
            <span>
              <strong>Privacy Note:</strong> This checklist is strictly informational and runs locally. CyberSafe does not collect, request, or upload your files.
            </span>
            <span className="font-bold text-blue-700 shrink-0">
              {checkedEvidenceIds.length} of {EVIDENCE_CHECKLIST_ITEMS.length} items checked
            </span>
          </div>
        </Card>
      </div>

      {/* 5. Section: Cybercrime Categories Deep Dive */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Cybercrime Incident Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a cybercrime category to view what happened, evidence to preserve, immediate safety steps, and authorized reporting channels.
          </p>
        </div>

        {/* Category Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REPORT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <IconHelper name={cat.iconName} className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Details Card */}
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Action Guide
              </span>
              <Badge variant="neutral" size="sm">
                Category Guidance
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {selectedCategory.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {selectedCategory.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. What Happened? */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>1. What happened? (Common Examples)</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedCategory.whatHappened.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Evidence to Preserve */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>2. What evidence should be preserved?</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedCategory.evidenceToPreserve.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Immediate Safety Steps */}
            <div className="space-y-3 p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>3. Immediate Safety Steps</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {selectedCategory.immediateSafetySteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-rose-700">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Where to Report */}
            <div className="space-y-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>4. Where to Report (Authorized Channels)</span>
                </h4>
                <div className="space-y-3 mt-3">
                  {selectedCategory.whereToReport.map((ch, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{ch.name}</span>
                        {ch.isOfficialGov && (
                          <span className="text-[10px] uppercase font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Official Gov
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{ch.description}</p>
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        {ch.helpline && (
                          <span className="font-bold text-rose-700">Helpline: {ch.helpline}</span>
                        )}
                        {ch.url && (
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800 font-bold underline inline-flex items-center gap-1"
                          >
                            <span>{ch.isOfficialGov ? 'Official Government Portal' : 'Open Portal'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. Direct Portal Referral Box */}
      <Card className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs uppercase font-bold text-slate-400">Direct Official Government Link</div>
          <div className="text-lg font-bold">National Cyber Crime Reporting Portal (India)</div>
          <p className="text-xs text-slate-300">
            For all formal complaints, FIR registration, and tracking of cyber investigation progress.
          </p>
        </div>
        <a
          href={INDIA_REPORTING_INFO.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm transition-colors shrink-0 shadow-sm"
        >
          <span>Official Government Portal</span>
          <ExternalLink className="w-4 h-4 text-slate-700" />
        </a>
      </Card>
    </div>
  );
};
