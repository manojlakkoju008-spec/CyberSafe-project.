import React from 'react';
import { ShieldAlert, MapPin, ArrowRight, LifeBuoy, FileText, PhoneCall } from 'lucide-react';
import { Button } from '../common/Button';

interface HelpCenterHeroProps {
  onScrollToReport: () => void;
  onScrollToMap: () => void;
  onScrollToGuide: () => void;
}

export const HelpCenterHero: React.FC<HelpCenterHeroProps> = ({
  onScrollToReport,
  onScrollToMap,
  onScrollToGuide,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-10 sm:pt-12 sm:pb-14">
      {/* Subtle geometric background grid for public service security aesthetic */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-4">
          {/* Public Service Identity Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
            <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
            <span>CYBERSAFE INCIDENT HELP CENTER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Get the right help for a cyber incident.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Understand what to do, find nearby assistance, and reach the official reporting channel.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToReport}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Report Cybercrime</span>
            </button>

            <button
              type="button"
              onClick={onScrollToMap}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Find Nearby Help</span>
            </button>

            <button
              type="button"
              onClick={onScrollToGuide}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4 text-slate-600" />
              <span>What should I do?</span>
            </button>
          </div>

          {/* Urgent Golden Hour Banner */}
          <div className="pt-4 flex items-center gap-2.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span>
              If you lost money in the last 2 hours, call <strong className="text-rose-600 font-bold">1930</strong> immediately to freeze transferred funds.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
