import React, { useState } from 'react';
import {
  FileQuestion,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Save,
  Layers,
  ChevronRight,
  X,
  FileText,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { REPORT_CATEGORIES } from '../../data/reportData';
import { CybercrimeCategory } from '../../types';

interface AdminReportsSectionProps {
  reportingConfig: {
    helplineNumber: string;
    helplineName: string;
    portalUrl: string;
    disclaimer: string;
  };
  onSaveReportingConfig: (config: any) => Promise<void>;
  globalSearch: string;
}

export function AdminReportsSection({
  reportingConfig,
  onSaveReportingConfig,
  globalSearch,
}: AdminReportsSectionProps) {
  const [helpline, setHelpline] = useState(reportingConfig.helplineNumber);
  const [portalUrl, setPortalUrl] = useState(reportingConfig.portalUrl);
  const [disclaimer, setDisclaimer] = useState(reportingConfig.disclaimer);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected category for viewing guidance
  const [selectedCategory, setSelectedCategory] = useState<CybercrimeCategory | null>(null);

  const handleSaveStatutoryConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveReportingConfig({
        ...reportingConfig,
        helplineNumber: helpline.trim(),
        portalUrl: portalUrl.trim(),
        disclaimer: disclaimer.trim(),
        updatedAt: new Date().toISOString(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Save failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const effectiveSearch = globalSearch.toLowerCase().trim();
  const filteredCategories = REPORT_CATEGORIES.filter((c: CybercrimeCategory) =>
    !effectiveSearch ||
    c.title.toLowerCase().includes(effectiveSearch) ||
    (c.tagline && c.tagline.toLowerCase().includes(effectiveSearch))
  );

  return (
    <div className="space-y-6">
      {/* Statutory Emergency Helpline Configuration Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Reporting & Helpline Routing
            </h3>
          </div>
          <span className="text-xs text-slate-400">Citizen Helpline Router</span>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Statutory reporting configuration and advisories successfully saved.</span>
          </div>
        )}

        <form onSubmit={handleSaveStatutoryConfig} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Emergency Helpline Number *
              </label>
              <input
                type="text"
                required
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: 1930 (National Citizen Financial Cyber Fraud Helpline)
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Official Reporting Portal URL *
              </label>
              <input
                type="url"
                required
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: https://cybercrime.gov.in/
              </span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Public Legal Disclaimer & Advisory Boundary *
            </label>
            <textarea
              rows={3}
              required
              value={disclaimer}
              onChange={(e) => setDisclaimer(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-5 rounded-xl shadow-md shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? 'Updating...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </div>

      {/* Incident Categories Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Incident Categories & Triage Guides</h3>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              {filteredCategories.length} categories
            </span>
          </div>
          <span className="text-xs text-slate-400">Click to review category triage guidance</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCategories.map((cat: CybercrimeCategory) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {cat.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{cat.tagline}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-blue-600 font-semibold hidden sm:inline">
                  View Triage Guide
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedCategory.title}</h3>
                <p className="text-[11px] text-slate-500">{selectedCategory.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Immediate Actions */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-600">
                  What To Do Now
                </h4>
                <ul className="space-y-1 list-disc pl-4 text-slate-700">
                  {selectedCategory.immediateActions.map((action: string, idx: number) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* What To Preserve */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-600">
                  What Evidence To Preserve
                </h4>
                <ul className="space-y-1 list-disc pl-4 text-slate-700">
                  {selectedCategory.evidenceToPreserve.map((evidence: string, idx: number) => (
                    <li key={idx}>{evidence}</li>
                  ))}
                </ul>
              </div>

              {/* What To Avoid */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-rose-600">
                  What To Avoid Doing
                </h4>
                <ul className="space-y-1 list-disc pl-4 text-slate-700">
                  {selectedCategory.warningsWhatNotToDo.map((avoid: string, idx: number) => (
                    <li key={idx}>{avoid}</li>
                  ))}
                </ul>
              </div>

              {/* Where To Report */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-[11px]">Primary Reporting Channel</h4>
                {selectedCategory.relevantOfficialReportingRoute.map((route, idx) => (
                  <p key={idx} className="text-slate-600">
                    <strong>{route.name}:</strong> {route.description} {route.url && `(${route.url})`}
                  </p>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
