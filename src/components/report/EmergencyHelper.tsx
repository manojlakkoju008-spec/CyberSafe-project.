import React, { useState } from 'react';
import { 
  PhoneCall, 
  ExternalLink, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Camera, 
  HelpCircle,
  Copy,
  Check,
  Printer,
  ChevronRight,
  ShieldCheck,
  Ban,
  ArrowLeft,
  Info,
  Clock,
  Send,
  Smartphone,
  CreditCard,
  Link as LinkIcon,
  UserX,
  AlertOctagon,
  MapPin,
  Building2
} from 'lucide-react';
import { EMERGENCY_SITUATIONS } from '../../data/emergencyHelperData';
import { INDIA_REPORTING_INFO } from '../../data/reportData';
import { EmergencySituation, EmergencySituationId } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface EmergencyHelperProps {
  initialSituationId?: EmergencySituationId;
  onSelectReportingCategory?: (categoryId: string) => void;
  onFindNearbyHelp?: () => void;
}

export const EmergencyHelper: React.FC<EmergencyHelperProps> = ({
  initialSituationId,
  onSelectReportingCategory,
  onFindNearbyHelp
}) => {
  const [selectedId, setSelectedId] = useState<EmergencySituationId | null>(() => {
    if (initialSituationId && EMERGENCY_SITUATIONS.some(s => s.id === initialSituationId)) {
      return initialSituationId;
    }
    return null; // Start with situation selection view as requested
  });

  const [activeStepTab, setActiveStepTab] = useState<number | 'all'>('all');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const selectedSituation = EMERGENCY_SITUATIONS.find(s => s.id === selectedId) || null;

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  const handleCopySummary = () => {
    if (!selectedSituation) return;
    const text = `CYBERSAFE EMERGENCY ACTION PLAN: ${selectedSituation.title.toUpperCase()}
Timestamp: ${new Date().toLocaleString()}

### STEP 1: WHAT TO DO IMMEDIATELY
${selectedSituation.step1Immediate.bullets.map(b => '• ' + b).join('\n')}

### STEP 2: WHAT TO SECURE
${selectedSituation.step2Secure.bullets.map(b => '• ' + b).join('\n')}

### STEP 3: WHAT EVIDENCE TO PRESERVE
${selectedSituation.step3Evidence.bullets.map(b => '• ' + b).join('\n')}

### STEP 4: WHO TO CONTACT
${selectedSituation.step4Contact.contacts.map(c => `• ${c.label} (${c.role}): ${c.value ? c.value + ' - ' : ''}${c.detail}`).join('\n')}

### STEP 5: WHERE TO REPORT
${selectedSituation.step5Report.routes.map(r => `• ${r.name}${r.url ? ' (' + r.url + ')' : ''}: ${r.description}`).join('\n')}

### STEP 6: WHAT TO AVOID DOING
${selectedSituation.step6Avoid.bullets.map(b => '• ' + b).join('\n')}

Official India Cybercrime Helpline: 1930
Official Government Portal: https://cybercrime.gov.in/
* Note: CyberSafe is an advisory educational tool and does not submit complaints. Never enter sensitive passwords, OTPs, or card PINs on unverified portals.`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to map icon name to icon component
  const renderSituationIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className={className} />;
      case 'Lock': return <Lock className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Link': return <LinkIcon className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'UserX': return <UserX className={className} />;
      case 'AlertOctagon': return <AlertOctagon className={className} />;
      default: return <AlertTriangle className={className} />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Dedicated Emergency Helper Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Interactive Cyber Incident Response</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Emergency Helper: Immediate Incident Triage
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Experiencing a cyber threat or suspected compromise? Select what happened below to get an immediate, calm, 6-step response protocol designed to minimize harm and preserve official evidence.
            </p>
          </div>

          {/* Golden Hour & Financial Fraud Callout Banner */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Financial Cyber Fraud Golden Hour (India)</span>
                </div>
                <div className="text-xs text-slate-300">
                  Debited fraudulently? Contact the National Cybercrime Helpline immediately.
                </div>
              </div>
              <a
                href="tel:1930"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-colors shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 1930</span>
              </a>
            </div>

            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 border border-blue-500/30 hover:border-blue-400/50 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors group"
            >
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                  Official Government Portal
                </div>
                <div className="text-xs text-slate-300 group-hover:text-white transition-colors">
                  cybercrime.gov.in
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
            </a>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* 2. Privacy & Zero-Data Collection Guarantee Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3.5 text-xs sm:text-sm text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-emerald-900 flex items-center gap-2">
            <span>Zero Sensitive Data Collection Guarantee</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">
              Client-Side Advisory
            </span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            CyberSafe will <strong>never</strong> ask you to enter bank account numbers, debit/credit card details, CVVs, passwords, PINs, OTPs, or government IDs. All incident response steps are processed locally inside your browser for your safety.
          </p>
        </div>
      </div>

      {/* 3. The Choice Grid: "Choose What Happened" */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>What happened? Choose your situation:</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Select the option that most accurately describes your immediate emergency.
            </p>
          </div>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Choose different situation</span>
            </button>
          )}
        </div>

        {/* 8 Incident Situation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EMERGENCY_SITUATIONS.map((sit) => {
            const isSelected = selectedId === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => {
                  setSelectedId(sit.id);
                  setActiveStepTab('all');
                  setCompletedSteps([]);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {renderSituationIcon(sit.iconName)}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      sit.urgency === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sit.shortTag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {sit.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {sit.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-rose-700' : 'text-slate-500'}>
                    {isSelected ? 'Active Response' : 'View Protocol'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-rose-600' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. The 6-Step Response Flow */}
      {selectedSituation && (
        <div className="space-y-6 pt-4 border-t border-slate-200">
          {/* Situation Header Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Incident Response Protocol
                </span>
                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  6-Step Action Plan
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedSituation.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {selectedSituation.calmNotice}
              </p>
            </div>

            {/* Quick Actions (Copy / Print / Progress) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copiedSummary ? 'Copied Plan' : 'Copy 6-Step Plan'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print Plan</span>
              </button>
            </div>
          </div>

          {/* Step Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveStepTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                activeStepTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 6 Steps ({completedSteps.length}/6 Done)
            </button>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isDone = completedSteps.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => setActiveStepTab(num)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeStepTab === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>Step {num}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </div>

          {/* The 6 Steps Container */}
          <div className="space-y-6">
            {/* STEP 1: What to do immediately */}
            {(activeStepTab === 'all' || activeStepTab === 1) && (
              <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-rose-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        STEP 1: What to do immediately
                      </h4>
                      <p className="text-xs text-slate-500">{selectedSituation.step1Immediate.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(1)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(1) ? 'Step 1 Completed' : 'Mark Step 1 Done'}</span>
                  </button>
                </div>

                {selectedSituation.step1Immediate.criticalActionCallout && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs sm:text-sm text-rose-950 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{selectedSituation.step1Immediate.criticalActionCallout}</span>
                  </div>
                )}

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedSituation.step1Immediate.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* STEP 2: What to secure */}
            {(activeStepTab === 'all' || activeStepTab === 2) && (
              <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        STEP 2: What to secure
                      </h4>
                      <p className="text-xs text-slate-500">{selectedSituation.step2Secure.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(2)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(2) ? 'Step 2 Completed' : 'Mark Step 2 Done'}</span>
                  </button>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedSituation.step2Secure.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* STEP 3: What evidence to preserve */}
            {(activeStepTab === 'all' || activeStepTab === 3) && (
              <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        STEP 3: What evidence to preserve
                      </h4>
                      <p className="text-xs text-slate-500">{selectedSituation.step3Evidence.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(3)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(3)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(3) ? 'Step 3 Completed' : 'Mark Step 3 Done'}</span>
                  </button>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedSituation.step3Evidence.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* STEP 4: Who to contact */}
            {(activeStepTab === 'all' || activeStepTab === 4) && (
              <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      4
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        STEP 4: Who to contact
                      </h4>
                      <p className="text-xs text-slate-500">{selectedSituation.step4Contact.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(4)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(4)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(4) ? 'Step 4 Completed' : 'Mark Step 4 Done'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {selectedSituation.step4Contact.contacts.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{c.label}</span>
                          {c.isOfficialGov && (
                            <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Official
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-500">{c.role}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.detail}</p>
                      </div>

                      {c.value && (
                        <div className="pt-2">
                          <a
                            href={c.method === 'phone' ? `tel:${c.value}` : '#'}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Dial {c.value}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* STEP 5: Where to report */}
            {(activeStepTab === 'all' || activeStepTab === 5) && (
              <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      5
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                        STEP 5: Where to report
                      </h4>
                      <p className="text-xs text-slate-500">{selectedSituation.step5Report.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(5)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(5)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(5) ? 'Step 5 Completed' : 'Mark Step 5 Done'}</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {selectedSituation.step5Report.routes.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{r.name}</span>
                          {r.isOfficialGov && (
                            <span className="text-[10px] uppercase font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                              Official Government Portal
                            </span>
                          )}
                        </div>

                        {r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors self-start sm:self-auto"
                          >
                            <span>Open Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>

                      {r.notes && (
                        <div className="text-[11px] text-blue-900 font-medium bg-blue-100/60 p-2 rounded-lg">
                          <strong>Filing Guidance:</strong> {r.notes}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Physical Police / Cybercrime Desk Support Option */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 mt-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-sm text-slate-900">
                          Physical Police / Cybercrime Desk Assistance
                        </span>
                      </div>
                      {onFindNearbyHelp && (
                        <button
                          type="button"
                          onClick={onFindNearbyHelp}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shadow-2xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>Find Nearby Help on Map</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      If you require in-person assistance, need to submit physical hardware for forensic imaging, or want to register a physical Zero FIR, locate nearby police stations using our interactive map.
                    </p>
                    {(selectedSituation.id === 'money-stolen' || selectedSituation.id === 'shared-otp') && (
                      <div className="text-[11px] text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium leading-relaxed">
                        <strong>Act quickly for financial cyber fraud:</strong> In-person station visits are not immediately mandatory to initiate interbank account freezes. Your primary and most urgent action is calling the national helpline <strong>1930</strong> and lodging a complaint at <strong>cybercrime.gov.in</strong>.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* STEP 6: What to avoid doing */}
            {(activeStepTab === 'all' || activeStepTab === 6) && (
              <Card className="p-6 border-amber-200 bg-amber-50/40 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-600 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xs">
                      6
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-amber-950">
                        STEP 6: What to avoid doing (Critical Warnings)
                      </h4>
                      <p className="text-xs text-amber-800">{selectedSituation.step6Avoid.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStepCompleted(6)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto ${
                      completedSteps.includes(6)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSteps.includes(6) ? 'Step 6 Completed' : 'Mark Step 6 Done'}</span>
                  </button>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950">
                  {selectedSituation.step6Avoid.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Ban className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Deep link to Full Reporting Category Guide */}
          {onSelectReportingCategory && (
            <div className="p-4 bg-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-0.5">
                <span className="font-bold text-slate-800">Want deeper statutory information?</span>
                <p>Explore full evidence preparation checklists and institutional guidelines for this category.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectReportingCategory(selectedSituation.relatedCategoryId)}
                icon={<ChevronRight className="w-4 h-4" />}
                iconPosition="right"
                className="shrink-0 text-xs font-bold"
              >
                Open Category Guide
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
