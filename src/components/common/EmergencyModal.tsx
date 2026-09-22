import React, { useState } from 'react';
import { 
  AlertCircle, 
  X, 
  ShieldAlert, 
  WifiOff, 
  Key, 
  PhoneCall, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Ban,
  Clock
} from 'lucide-react';
import { Button } from './Button';
import { INDIA_REPORTING_INFO } from '../../data/reportData';
import { EMERGENCY_SITUATIONS } from '../../data/emergencyHelperData';
import { EmergencySituation, EmergencySituationId } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport: (scenarioOrCategoryId?: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReport
}) => {
  const [selectedSituationId, setSelectedSituationId] = useState<EmergencySituationId | null>(null);

  if (!isOpen) return null;

  const selectedSituation = EMERGENCY_SITUATIONS.find(s => s.id === selectedSituationId) || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-base font-extrabold text-white">
                Emergency Helper: Incident Triage
              </h2>
              <p className="text-xs text-rose-300">Immediate containment & official response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Urgent Financial Fraud Callout */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-rose-500/30">
            <div className="space-y-0.5">
              <div className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Financial Cyber Fraud Helpline (India)</span>
              </div>
              <div className="text-xs text-slate-300">
                Debited unauthorizedly? Call immediately to freeze beneficiary accounts.
              </div>
            </div>
            <a
              href="tel:1930"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shrink-0 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930</span>
            </a>
          </div>

          {/* VIEW A: Situation Selection (What happened?) */}
          {!selectedSituation ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  What happened? Select your situation:
                </h3>
                <p className="text-xs text-slate-500">
                  Select an incident scenario to see the immediate 6-step protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EMERGENCY_SITUATIONS.map((sit) => (
                  <button
                    key={sit.id}
                    onClick={() => setSelectedSituationId(sit.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                        {sit.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {sit.summary}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* VIEW B: 6-Step Response for the Selected Situation */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => setSelectedSituationId(null)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose another situation</span>
                </button>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {selectedSituation.shortTag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedSituation.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {selectedSituation.calmNotice}
                </p>
              </div>

              {/* The 6 Steps Compact Timeline */}
              <div className="space-y-3">
                {/* STEP 1 */}
                <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-rose-950">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>STEP 1: What to do immediately</span>
                  </div>
                  <ul className="text-xs text-rose-900 space-y-1 pl-7 list-disc">
                    {selectedSituation.step1Immediate.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP 2 */}
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-blue-950">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>STEP 2: What to secure</span>
                  </div>
                  <ul className="text-xs text-blue-900 space-y-1 pl-7 list-disc">
                    {selectedSituation.step2Secure.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP 3 */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>STEP 3: What evidence to preserve</span>
                  </div>
                  <ul className="text-xs text-emerald-900 space-y-1 pl-7 list-disc">
                    {selectedSituation.step3Evidence.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP 4 & 5 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                      4 & 5
                    </span>
                    <span>STEP 4 & 5: Who to contact & Official Reporting</span>
                  </div>
                  <div className="text-xs text-slate-700 pl-7 space-y-1">
                    <div><strong>Helpline:</strong> Dial 1930 (Cybercrime Helpline) or Bank Fraud Cell</div>
                    <div><strong>Official Portal:</strong> {INDIA_REPORTING_INFO.portalLabel} ({INDIA_REPORTING_INFO.portalUrl})</div>
                  </div>
                </div>

                {/* STEP 6 */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-950">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                      6
                    </span>
                    <span>STEP 6: What to avoid doing</span>
                  </div>
                  <ul className="text-xs text-amber-900 space-y-1 pl-7 list-disc">
                    {selectedSituation.step6Avoid.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => {
              onClose();
              onNavigateToReport(selectedSituationId || undefined);
            }}
            className="w-full sm:w-auto font-bold text-xs"
          >
            {selectedSituation ? 'Open Full 6-Step Workspace' : 'Open Emergency Helper'}
          </Button>
        </div>
      </div>
    </div>
  );
};
