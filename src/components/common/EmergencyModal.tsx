import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight, 
  ChevronRight,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { Button } from './Button';
import { INDIA_REPORTING_INFO } from '../../data/reportData';
import { EMERGENCY_SITUATIONS } from '../../data/emergencyHelperData';
import { EmergencySituationId } from '../../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5E7EB] shadow-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Header */}
        <div className="bg-[#0B1F33] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DC3545] text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-base font-bold text-white tracking-tight">
                Emergency Helper: Incident Triage
              </h2>
              <p className="text-xs text-slate-300">Immediate containment & official response</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Urgent Financial Fraud Callout */}
          <div className="bg-[#102C48] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700">
            <div className="space-y-0.5">
              <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Financial Cyber Fraud Helpline (India)</span>
              </div>
              <div className="text-xs text-slate-300">
                Unauthorized debit? Dial immediately to freeze recipient accounts.
              </div>
            </div>
            <a
              href="tel:1930"
              className="px-4 py-2 rounded-lg bg-[#DC3545] hover:bg-[#B02A37] text-white font-bold text-xs shrink-0 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930</span>
            </a>
          </div>

          {/* VIEW A: Situation Selection (What happened?) */}
          {!selectedSituation ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#0B1F33]">
                  What happened? Select your situation:
                </h3>
                <p className="text-xs text-[#667085]">
                  Select an incident scenario to see the immediate containment protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EMERGENCY_SITUATIONS.map((sit) => (
                  <button
                    key={sit.id}
                    type="button"
                    onClick={() => setSelectedSituationId(sit.id)}
                    className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#1261A0] hover:bg-[#F7F9FC] text-left transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#0B1F33] group-hover:text-[#1261A0]">
                        {sit.title}
                      </div>
                      <div className="text-[11px] text-[#667085] line-clamp-1">
                        {sit.summary}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#667085] group-hover:text-[#1261A0] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* VIEW B: 6-Step Response for Selected Situation */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setSelectedSituationId(null)}
                  className="text-xs font-semibold text-[#1261A0] hover:text-[#0E4D80] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose another situation</span>
                </button>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-[#DC3545] border border-rose-200">
                  {selectedSituation.shortTag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0B1F33]">
                  {selectedSituation.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed mt-0.5 font-normal">
                  {selectedSituation.calmNotice}
                </p>
              </div>

              {/* The 6 Steps Compact Timeline */}
              <div className="space-y-3">
                {/* STEP 1 */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <span className="w-5 h-5 rounded-md bg-[#DC3545] text-white flex items-center justify-center text-[10px]">
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
                <div className="p-3 rounded-xl bg-[#EBF5FB] border border-[#C2E0F4] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33]">
                    <span className="w-5 h-5 rounded-md bg-[#1261A0] text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>STEP 2: What to secure</span>
                  </div>
                  <ul className="text-xs text-[#0C4A7A] space-y-1 pl-7 list-disc">
                    {selectedSituation.step2Secure.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP 3 */}
                <div className="p-3 rounded-xl bg-[#E8F8F2] border border-[#B6EAD6] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0E7A52]">
                    <span className="w-5 h-5 rounded-md bg-[#19A974] text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>STEP 3: What evidence to preserve</span>
                  </div>
                  <ul className="text-xs text-[#0E7A52] space-y-1 pl-7 list-disc">
                    {selectedSituation.step3Evidence.bullets.slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP 4 & 5 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33]">
                    <span className="w-5 h-5 rounded-md bg-[#0B1F33] text-white flex items-center justify-center text-[10px]">
                      4 & 5
                    </span>
                    <span>STEP 4 & 5: Who to contact & Official Reporting</span>
                  </div>
                  <div className="text-xs text-[#14202B] pl-7 space-y-0.5">
                    <div><strong>Helpline:</strong> Dial 1930 (Cybercrime Helpline) or Bank Fraud Cell</div>
                    <div><strong>Official Portal:</strong> {INDIA_REPORTING_INFO.portalLabel} ({INDIA_REPORTING_INFO.portalUrl})</div>
                  </div>
                </div>

                {/* STEP 6 */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <span className="w-5 h-5 rounded-md bg-[#F59E0B] text-white flex items-center justify-center text-[10px]">
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
        <div className="bg-[#F7F9FC] border-t border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
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
            className="w-full sm:w-auto font-semibold text-xs"
          >
            {selectedSituation ? 'Open Full 6-Step Workspace' : 'Open Emergency Helper'}
          </Button>
        </div>
      </div>
    </div>
  );
};
