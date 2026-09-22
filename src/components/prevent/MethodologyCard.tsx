import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { PreventionMethodology } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

interface MethodologyCardProps {
  methodology: PreventionMethodology;
  onSelect: (methodology: PreventionMethodology) => void;
  completedItemIds: string[];
}

export const MethodologyCard: React.FC<MethodologyCardProps> = ({
  methodology,
  onSelect,
  completedItemIds
}) => {
  // Calculate completed habits in this methodology's quick checklist
  const totalChecks = methodology.quickChecklist.length;
  const completedChecks = methodology.quickChecklist.filter(c => completedItemIds.includes(c.id)).length;
  const isAllComplete = totalChecks > 0 && completedChecks === totalChecks;

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 border-slate-200 bg-white group">
      <div className="space-y-4">
        {/* Top Bar: Icon, Category & Checklist Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0 shadow-2xs">
            <IconHelper name={methodology.iconName} className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <Badge variant="neutral" size="sm">
              {methodology.category.toUpperCase()}
            </Badge>
            {totalChecks > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isAllComplete 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : completedChecks > 0 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {isAllComplete ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                )}
                <span>{completedChecks}/{totalChecks} Habits</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
            {methodology.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {methodology.tagline}
          </p>
        </div>

        {/* The 4 Core Questions Micro-Summary */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">What:</span>
              <span className="text-slate-800 font-medium line-clamp-1">{methodology.whatShouldIDo}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">When:</span>
              <span className="text-slate-800 font-medium line-clamp-1">{methodology.whenShouldIDoIt}</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span className="italic line-clamp-1 text-slate-500">
              💡 {methodology.recommendedPractice.goldenRule}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>7-Part Methodology</span>
        </span>
        <button
          onClick={() => onSelect(methodology)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          <span>Learn & Implement</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};
