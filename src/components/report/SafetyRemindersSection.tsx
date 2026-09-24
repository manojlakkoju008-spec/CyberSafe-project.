import React from 'react';
import { Ban, AlertOctagon, Lock, ShieldAlert, FileWarning, EyeOff } from 'lucide-react';
import { SAFETY_REMINDERS_DO_NOT } from '../../data/reportData';

export const SafetyRemindersSection: React.FC = () => {
  return (
    <section id="safety-reminders" className="py-12 bg-rose-50/40 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
            <span>Critical Protective Rules</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Before you report: What NOT to do
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Perpetrators frequently exploit anxiety and urgency to initiate secondary scams. Keep these strict defensive safeguards in mind before and during your reporting journey.
          </p>
        </div>

        {/* 6 Core DO NOT Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAFETY_REMINDERS_DO_NOT.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                  <Ban className="w-4 h-4 text-rose-600" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {item.rule}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-rose-700">
                Rule of Thumb: Stop & Verify independently
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Secondary Scam Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Beware of "Cyber Recovery Specialists" on Social Media</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pl-6">
            Scammers monitor comments on X (Twitter), Instagram, and YouTube. Anyone messaging you claiming "I know an ethical hacker who got my money back in 2 hours" is a secondary scammer attempting to steal more funds. Official recovery is only executed through statutory banking lien (via 1930) or court order.
          </p>
        </div>
      </div>
    </section>
  );
};
