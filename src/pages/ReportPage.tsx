import React, { useState, useEffect } from 'react';
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
  ChevronUp,
  Ban,
  Shield,
  Search,
  Sparkles,
  HelpCircle,
  AlertOctagon,
  Copy,
  Check,
  MapPin
} from 'lucide-react';
import { REPORT_CATEGORIES, INDIA_REPORTING_INFO, EVIDENCE_CHECKLIST_ITEMS } from '../data/reportData';
import { EMERGENCY_SITUATIONS } from '../data/emergencyHelperData';
import { EmergencySituationId } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IconHelper } from '../components/common/IconHelper';
import { EmergencyHelper } from '../components/report/EmergencyHelper';
import { NearbyHelpSection } from '../components/report/NearbyHelpSection';

interface ReportPageProps {
  initialIncidentId?: string;
}

type ActiveViewTab = 'emergency-helper' | 'nearby-help' | 'categories' | 'evidence';

export const ReportPage: React.FC<ReportPageProps> = ({ initialIncidentId }) => {
  // Determine if initialIncidentId matches an emergency situation or a report category
  const isEmergencyId = initialIncidentId && EMERGENCY_SITUATIONS.some(s => s.id === initialIncidentId);

  const [activeTab, setActiveTab] = useState<ActiveViewTab>(() => {
    if (isEmergencyId) return 'emergency-helper';
    return 'emergency-helper'; // Default to the dedicated Emergency Helper as primary focus
  });

  const [emergencyHelperScenarioId, setEmergencyHelperScenarioId] = useState<EmergencySituationId | undefined>(() => {
    if (isEmergencyId) return initialIncidentId as EmergencySituationId;
    return undefined;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialIncidentId && REPORT_CATEGORIES.some(c => c.id === initialIncidentId)) {
      return initialIncidentId;
    }
    return 'financial-fraud';
  });

  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState<string[]>([]);
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Update when initialIncidentId changes
  useEffect(() => {
    if (initialIncidentId) {
      if (EMERGENCY_SITUATIONS.some(s => s.id === initialIncidentId)) {
        setActiveTab('emergency-helper');
        setEmergencyHelperScenarioId(initialIncidentId as EmergencySituationId);
      } else if (REPORT_CATEGORIES.some(c => c.id === initialIncidentId)) {
        setActiveTab('categories');
        setSelectedCategoryId(initialIncidentId);
      }
    }
  }, [initialIncidentId]);

  const selectedCategory = REPORT_CATEGORIES.find(c => c.id === selectedCategoryId) || REPORT_CATEGORIES[0];

  const filteredCategories = REPORT_CATEGORIES.filter(c => 
    c.title.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    c.tagline.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const toggleEvidence = (id: string) => {
    setCheckedEvidenceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('1930').then(() => {
      setCopiedHelpline(true);
      setTimeout(() => setCopiedHelpline(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
      {/* 1. Header & Mandatory Non-Affiliation Clarity */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Incident Guidance & Official Reporting Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Emergency Assistance & Reporting Guide
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Get calm, structured incident response instructions and verified official reporting routes for cybercrime in India.
        </p>

        {/* Prominent Non-Affiliation and Non-Submission Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-amber-900">
              {INDIA_REPORTING_INFO.disclaimerTitle}:
            </span>
            <p className="text-amber-900/90 leading-relaxed">
              {INDIA_REPORTING_INFO.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Prominent Financial Fraud Emergency Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-rose-900/50 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Urgent Financial Cyber Fraud Notice</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Money Debited Unauthorizedly? Act Within the Golden Hour
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              Immediately call the National Cybercrime Helpline <strong>1930</strong> and your bank fraud desk. The initial 1 to 2 hours provide the highest probability of freezing recipient beneficiary accounts across interbank channels before funds are withdrawn.
            </p>

            <div className="pt-2 text-[11px] sm:text-xs text-rose-200/90 bg-rose-950/60 p-3 rounded-xl border border-rose-800/40">
              <strong>Important Transparency Notice:</strong> While prompt reporting triggers immediate beneficiary account liens through the citizen financial fraud management system, <em>fund recovery is never guaranteed</em>. It depends on whether the stolen funds remain in the target account at the time of freezing.
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <div className="bg-slate-800/90 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Cybercrime Helpline
                </div>
                <div className="text-3xl font-black text-rose-400 font-mono tracking-tight">
                  1930
                </div>
                <div className="text-[11px] text-slate-400">Toll-free, 24/7 across India</div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <a
                  href="tel:1930"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 1930</span>
                </a>
                <button
                  onClick={handleCopyHelpline}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-bold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedHelpline ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHelpline ? 'Copied' : 'Copy 1930'}</span>
                </button>
              </div>
            </div>

            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/90 border border-blue-500/40 hover:border-blue-400/60 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors group"
            >
              <div>
                <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                  <span>{INDIA_REPORTING_INFO.portalLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
                <div className="text-sm font-extrabold text-white group-hover:text-blue-200 transition-colors">
                  cybercrime.gov.in
                </div>
                <div className="text-[11px] text-slate-400">Statutory Police FIR & Complaint Portal</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* 3. Primary Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('emergency-helper')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'emergency-helper'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Helper (Instant Triage)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold">
            8 Scenarios
          </span>
        </button>

        <button
          onClick={() => setActiveTab('nearby-help')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'nearby-help'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Find Nearby Help</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold">
            Map & Police
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Category Reporting Guide</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
            9 Categories
          </span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'evidence'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Evidence Preservation Toolkit</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
            Checklist
          </span>
        </button>
      </div>

      {/* 4. Tab 1: Emergency Helper */}
      {activeTab === 'emergency-helper' && (
        <div className="space-y-10 animate-fadeIn">
          <EmergencyHelper
            initialSituationId={emergencyHelperScenarioId}
            onSelectReportingCategory={(catId) => {
              setSelectedCategoryId(catId);
              setActiveTab('categories');
            }}
            onFindNearbyHelp={() => {
              const el = document.getElementById('find-nearby-help');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveTab('nearby-help');
              }
            }}
          />

          {/* Integrated Find Nearby Help Map & List Section */}
          <NearbyHelpSection />
        </div>
      )}

      {/* 4b. Dedicated Tab: Find Nearby Help */}
      {activeTab === 'nearby-help' && (
        <div className="animate-fadeIn">
          <NearbyHelpSection />
        </div>
      )}

      {/* 5. Tab 2: Category Reporting Guide (All 9 Categories with 5 Facets) */}
      {activeTab === 'categories' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Subheader and Category Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Official Incident Reporting Guide
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Structured protocols for all 9 cybercrime categories with immediate actions, evidence, and official routes.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter 9 crime categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 9 Category Selector Tabs/Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <IconHelper name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold truncate">{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Category View with all 5 mandatory facets */}
          <div className="space-y-6">
            {/* Category Banner */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <IconHelper name={selectedCategory.iconName} className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Reporting Framework
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                      Category {REPORT_CATEGORIES.findIndex(c => c.id === selectedCategory.id) + 1} of 9
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {selectedCategory.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {selectedCategory.tagline}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('emergency-helper');
                  // Map category to matching emergency situation
                  const matchingSit = EMERGENCY_SITUATIONS.find(s => s.relatedCategoryId === selectedCategory.id);
                  if (matchingSit) {
                    setEmergencyHelperScenarioId(matchingSit.id);
                  }
                }}
                className="text-xs font-bold shrink-0 self-start md:self-center"
              >
                Launch 6-Step Triage
              </Button>
            </div>

            {/* Common Manifestations */}
            {selectedCategory.whatHappened && selectedCategory.whatHappened.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Typical Modus Operandi & Manifestations:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedCategory.whatHappened.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* The 5 Key Facets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FACET 1: Immediate Actions */}
              <Card className="p-6 border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Immediate Actions</h4>
                    <p className="text-xs text-slate-500">First-response containment steps</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedCategory.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* FACET 2: Evidence to Preserve */}
              <Card className="p-6 border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Evidence to Preserve</h4>
                    <p className="text-xs text-slate-500">Essential records for statutory police investigation</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedCategory.evidenceToPreserve.map((evidence, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{evidence}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* FACET 3: Account Protection Steps */}
              <Card className="p-6 border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Account Protection Steps</h4>
                    <p className="text-xs text-slate-500">Prevent secondary compromise & seal account perimeters</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedCategory.accountProtectionSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* FACET 5: Warnings About What Users Should NOT Do */}
              <Card className="p-6 border-amber-200 bg-amber-50/30 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-amber-200">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-amber-950">
                      What NOT to Do (Critical Warnings)
                    </h4>
                    <p className="text-xs text-amber-800">Avoid common secondary fraud traps and pitfalls</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950">
                  {selectedCategory.warningsWhatNotToDo.map((warn, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{warn}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* FACET 4: Relevant Official Reporting Route (Full Width) */}
            <Card className="p-6 border-slate-200 bg-white space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Relevant Official Reporting Routes
                    </h4>
                    <p className="text-xs text-slate-500">Statutory portals and official helplines</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 italic">
                  CyberSafe does not submit reports on your behalf.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.relevantOfficialReportingRoute.map((route, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">{route.name}</span>
                        {route.isOfficialGov && (
                          <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Official Gov
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {route.description}
                      </p>
                      {route.notes && (
                        <div className="text-[11px] text-blue-900 bg-blue-50/70 p-2 rounded-lg font-medium">
                          {route.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      {route.helpline && (
                        <a
                          href={`tel:${route.helpline}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call {route.helpline}</span>
                        </a>
                      )}
                      {route.url && (
                        <a
                          href={route.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                        >
                          <span>Open Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Evidence Preservation Toolkit */}
      {activeTab === 'evidence' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Evidence Preservation Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              When filing a police FIR on <strong>cybercrime.gov.in</strong> or calling <strong>1930</strong>, the strength of your complaint relies heavily on technical evidence. Use this interactive checklist to verify you have preserved every critical item before lodging your report.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero Data Collection Guarantee:</span>
              <p className="text-emerald-800">
                This checklist tracks progress solely inside your browser memory. We never ask for or store transaction details, card numbers, or passwords.
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EVIDENCE_CHECKLIST_ITEMS.map((item) => {
              const isChecked = checkedEvidenceIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEvidence(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`text-sm font-bold ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {item.label}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checklist Counter Summary */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-0.5 text-center sm:text-left">
              <div className="font-bold text-slate-200">
                Preservation Status: {checkedEvidenceIds.length} of {EVIDENCE_CHECKLIST_ITEMS.length} Evidence Items Ready
              </div>
              <div className="text-slate-400">
                Once ready, proceed directly to the Official Government Portal to lodge your complaint.
              </div>
            </div>

            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Go to Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
