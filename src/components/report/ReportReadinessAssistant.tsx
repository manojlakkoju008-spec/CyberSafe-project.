import React from 'react';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Lock,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { REPORT_PREPARATION_CHECKLIST } from '../../data/reportData';
import { ReportReadyItem } from '../../types';

interface ReportReadinessAssistantProps {
  checkedItemIds: string[];
  onToggleItem: (id: string) => void;
  onResetItems: () => void;
  onScrollToSummaryBuilder?: () => void;
}

export const ReportReadinessAssistant: React.FC<ReportReadinessAssistantProps> = ({
  checkedItemIds,
  onToggleItem,
  onResetItems,
  onScrollToSummaryBuilder,
}) => {
  const totalItems = REPORT_PREPARATION_CHECKLIST.length;
  const checkedCount = checkedItemIds.length;
  const percentage = Math.round((checkedCount / totalItems) * 100);

  // Qualitative readiness status
  const getReadinessTier = () => {
    if (checkedCount >= 8) {
      return {
        label: 'Comprehensive Digital Docket',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-600',
        detail: 'You have gathered robust documentation. This significantly accelerates police verification and bank dispute resolution.',
      };
    }
    if (checkedCount >= 5) {
      return {
        label: 'Good Initial Preparation',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        barColor: 'bg-blue-600',
        detail: 'You hold sufficient factual proof to lodge an official complaint on cybercrime.gov.in or with your bank.',
      };
    }
    if (checkedCount >= 2) {
      return {
        label: 'Preliminary Information',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        detail: 'You have basic details. Gathering screenshots, transaction IDs, or caller numbers will help investigating officers.',
      };
    }
    return {
      label: 'Early Preparation Stage',
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      barColor: 'bg-slate-400',
      detail: 'Start by noting down the exact date/time and the perpetrator phone number or web address.',
    };
  };

  const tier = getReadinessTier();

  return (
    <section id="report-readiness-assistant" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              <FileCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Report Ready Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Prepare before you report.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Police officers and bank fraud desks need concrete factual evidence to trace scammers. Check off the items you currently possess to measure your reporting readiness.
            </p>
          </div>

          {/* Reset Action */}
          {checkedCount > 0 && (
            <button
              type="button"
              onClick={onResetItems}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Checklist</span>
            </button>
          )}
        </div>

        {/* Readiness Meter Card */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Preparedness Level
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  Report readiness: {checkedCount} / {totalItems}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.color}`}
                >
                  {tier.label}
                </span>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <span className="text-lg font-black text-slate-700 font-mono">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full ${tier.barColor} transition-all duration-300 rounded-full`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {tier.detail}
          </p>

          {/* Strict Legal Disclaimer Callout */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2 shadow-2xs">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Important Guidance Boundary:</strong> This is an assistance checklist, NOT a legal score. It does NOT determine whether a complaint is valid or accepted by police. Even if you only have a phone number or transaction ID, you should still lodge a report.
            </p>
          </div>
        </div>

        {/* Sensitive Credential Warning Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-black text-sm text-rose-900 uppercase tracking-wide">
              Critical Evidence Safety Rule
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-normal pl-7">
            <strong>Never share your password, OTP, UPI PIN, card CVV, recovery code, or wallet private key as evidence.</strong> Legitimate police officers and cyber portal staff will NEVER ask for passwords. Preserve screenshots and logs securely on your local device only.
          </p>
        </div>

        {/* 10-Item Interactive Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {REPORT_PREPARATION_CHECKLIST.map((item) => {
            const isChecked = checkedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'bg-blue-50/60 border-blue-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <button
                  type="button"
                  aria-checked={isChecked}
                  className="mt-0.5 shrink-0 focus:outline-none"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold leading-snug ${
                        isChecked ? 'text-blue-950 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-[11px] text-slate-400 font-mono pt-0.5">
                    {item.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bridge Action to Summary Builder */}
        {onScrollToSummaryBuilder && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onScrollToSummaryBuilder}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>Done gathering items? Proceed to Build Report Summary</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
