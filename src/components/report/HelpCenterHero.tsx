import React from 'react';
import { MapPin, LifeBuoy, FileText } from 'lucide-react';

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
    <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB] pt-10 pb-12 sm:pt-16 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-5">
          {/* Public Service Identity Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBF5FB] border border-[#C2E0F4] text-[#0C4A7A] text-xs font-semibold tracking-wider uppercase">
            <LifeBuoy className="w-3.5 h-3.5 text-[#1261A0]" />
            <span>CyberSafe Incident Help Center</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0B1F33] tracking-tight leading-[1.12]">
            Get the right help for a cyber incident.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#667085] leading-relaxed font-normal">
            Understand what to do, find verified nearby assistance, and reach the official reporting channel.
          </p>

          {/* Action Row */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToReport}
              className="px-5 py-2.5 rounded-lg bg-[#1261A0] hover:bg-[#0E4D80] text-white font-semibold text-sm shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Report Cybercrime</span>
            </button>

            <button
              type="button"
              onClick={onScrollToMap}
              className="px-5 py-2.5 rounded-lg bg-[#0B1F33] hover:bg-[#102C48] text-white font-semibold text-sm shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-blue-300" />
              <span>Find Nearby Help</span>
            </button>

            <button
              type="button"
              onClick={onScrollToGuide}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#F7F9FC] text-[#0B1F33] font-semibold text-sm border border-[#E5E7EB] hover:border-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <LifeBuoy className="w-4 h-4 text-[#667085]" />
              <span>What should I do?</span>
            </button>
          </div>

          {/* Urgent Golden Hour Banner */}
          <div className="pt-3 flex items-center gap-2.5 text-xs text-[#667085]">
            <span className="w-2 h-2 rounded-full bg-[#DC3545] shrink-0" />
            <span>
              If you lost money in the last 2 hours, call <strong className="text-[#DC3545] font-bold">1930</strong> immediately to freeze transferred funds in the Golden Hour.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
