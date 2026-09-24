import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  MailWarning,
  Globe,
  Lock,
  UserX,
  ShieldAlert,
  AlertOctagon,
  Cpu,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Ban,
  ShieldCheck,
  Building2,
  Phone,
} from 'lucide-react';
import { REPORT_CATEGORIES } from '../../data/reportData';
import { CybercrimeCategory } from '../../types';

interface SmartReportingGuideProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onPrepareSummaryWithCategory: (categoryTitle: string) => void;
}

export const SmartReportingGuide: React.FC<SmartReportingGuideProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onPrepareSummaryWithCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'todo' | 'preserve' | 'where' | 'avoid'>('todo');

  const selectedCategory =
    REPORT_CATEGORIES.find((c) => c.id === selectedCategoryId) || REPORT_CATEGORIES[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'financial-fraud':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'upi-payment-fraud':
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'phishing':
        return <MailWarning className="w-5 h-5 text-amber-600" />;
      case 'suspicious-website':
      case 'malicious-website':
        return <Globe className="w-5 h-5 text-cyan-600" />;
      case 'hacked-account':
      case 'account-hacking':
        return <Lock className="w-5 h-5 text-rose-600" />;
      case 'social-media-abuse':
      case 'fake-profile':
        return <UserX className="w-5 h-5 text-purple-600" />;
      case 'identity-theft':
        return <ShieldAlert className="w-5 h-5 text-orange-600" />;
      case 'cyberstalking-harassment':
      case 'cyberbullying':
        return <AlertOctagon className="w-5 h-5 text-pink-600" />;
      case 'malware-ransomware':
        return <Cpu className="w-5 h-5 text-red-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  // 10 canonical categories in order
  const displayCategories = [
    REPORT_CATEGORIES.find((c) => c.id === 'financial-fraud'),
    REPORT_CATEGORIES.find((c) => c.id === 'upi-payment-fraud'),
    REPORT_CATEGORIES.find((c) => c.id === 'phishing'),
    REPORT_CATEGORIES.find((c) => c.id === 'suspicious-website' || c.id === 'malicious-website'),
    REPORT_CATEGORIES.find((c) => c.id === 'hacked-account' || c.id === 'account-hacking'),
    REPORT_CATEGORIES.find((c) => c.id === 'social-media-abuse' || c.id === 'fake-profile'),
    REPORT_CATEGORIES.find((c) => c.id === 'identity-theft'),
    REPORT_CATEGORIES.find((c) => c.id === 'cyberstalking-harassment' || c.id === 'cyberbullying'),
    REPORT_CATEGORIES.find((c) => c.id === 'malware-ransomware'),
    REPORT_CATEGORIES.find((c) => c.id === 'other-incident' || c.id === 'other-cybercrime'),
  ].filter(Boolean) as CybercrimeCategory[];

  return (
    <section id="smart-reporting-guide" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <span>Incident Triage & Playbooks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            What happened? Select your cyber incident.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every cyber incident requires specific preservation steps and reporting channels. Select your scenario below to see immediate actions, evidence to secure, and verified official filing routes.
          </p>
        </div>

        {/* 10 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {cat.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] font-semibold text-blue-700 mt-auto">
                  <span>{isSelected ? 'Viewing' : 'Select'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Category Guidance Panel */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/60 overflow-hidden shadow-sm">
          {/* Header Bar */}
          <div className="p-6 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                {getCategoryIcon(selectedCategory.id)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    Selected Playbook
                  </span>
                  <span className="text-xs text-slate-500">Official Standard Guidance</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedCategory.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onPrepareSummaryWithCategory(selectedCategory.title)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer self-start md:self-auto"
            >
              <span>Build Report Summary for this Incident</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Interactive Facet Tabs */}
          <div className="px-6 pt-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('todo')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-2 ${
                  activeTab === 'todo'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT TO DO NOW</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preserve')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-2 ${
                  activeTab === 'preserve'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>WHAT TO PRESERVE</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('where')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-2 ${
                  activeTab === 'where'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>WHERE TO REPORT</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('avoid')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-2 ${
                  activeTab === 'avoid'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>WHAT TO AVOID</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {/* Tab 1: WHAT TO DO NOW */}
            {activeTab === 'todo' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Immediate Containment & Safety Actions</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Execute these initial steps to stop further financial loss or account compromise.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {selectedCategory.immediateActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedCategory.accountProtectionSteps && selectedCategory.accountProtectionSteps.length > 0 && (
                  <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Account & Perimeter Hardening Steps:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedCategory.accountProtectionSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/80 rounded-xl border border-slate-200/70 text-xs text-slate-700 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: WHAT TO PRESERVE */}
            {activeTab === 'preserve' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    <span>Evidence to Secure Before Filing</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Law enforcement and bank dispute cells require digital proof. Secure these items locally without sharing credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCategory.evidenceToPreserve.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">Evidence Item #{idx + 1}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pl-6">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Privacy Reminder:</strong> Never share passwords, PINs, OTPs, or CVV as evidence. Keep all screenshots and logs saved securely on your local device.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: WHERE TO REPORT */}
            {activeTab === 'where' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Official Verified Reporting Portals & Helplines</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Submit your incident through these authorized statutory routes. CyberSafe does not submit reports on your behalf.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCategory.relevantOfficialReportingRoute.map((route, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              route.isOfficialGov
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {route.isOfficialGov ? 'Official Government Portal' : 'Public Safety Service'}
                          </span>
                          {route.helpline && (
                            <span className="font-mono font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Dial: {route.helpline}
                            </span>
                          )}
                        </div>

                        <h5 className="font-bold text-sm text-slate-900">{route.name}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{route.description}</p>
                        {route.notes && (
                          <p className="text-[11px] text-blue-700 font-medium pt-1">
                            Note: {route.notes}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        {route.url && (
                          <a
                            href={route.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition"
                          >
                            <span>Open Official Channel</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {route.helpline && !route.url && (
                          <a
                            href={`tel:${route.helpline}`}
                            className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call {route.helpline}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: WHAT TO AVOID */}
            {activeTab === 'avoid' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Critical Warnings: What NOT to Do</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Cybercriminals exploit panic to execute secondary scams. Avoid these dangerous mistakes.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {selectedCategory.warningsWhatNotToDo.map((warning, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        ✕
                      </span>
                      <p className="text-xs sm:text-sm text-rose-950 font-semibold leading-relaxed">
                        {warning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
