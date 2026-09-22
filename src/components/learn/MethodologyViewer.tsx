import React, { useState } from 'react';
import { PracticalMethodology } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface MethodologyViewerProps {
  methodology: PracticalMethodology;
  onSelectThreat?: (threatId: string) => void;
}

export const MethodologyViewer: React.FC<MethodologyViewerProps> = ({
  methodology,
  onSelectThreat,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = methodology.steps[activeStepIndex] || methodology.steps[0];

  return (
    <Card className="bg-white border-slate-200 overflow-hidden shadow-sm">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <Badge variant="purple" className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {methodology.category}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">
            {methodology.steps.length}-Step Protective Method
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {methodology.title}
        </h3>
        <div className="font-mono text-xs sm:text-sm text-purple-400 font-bold tracking-wider mb-3">
          {methodology.acronym}
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {methodology.shortTagline}
        </p>

        {/* When to use callout */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">When to use: </span>
            {methodology.whenToUse}
          </div>
        </div>
      </div>

      {/* Step Progress Navigation */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2">
        {methodology.steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStepIndex(idx)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeStepIndex === idx
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
              activeStepIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {idx + 1}
            </span>
            <span>{step.stepLabel}</span>
          </button>
        ))}
      </div>

      {/* Active Step Content */}
      <div className="p-6 space-y-6">
        <div>
          <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 mb-1">
            Step {activeStepIndex + 1} of {methodology.steps.length}: {activeStep.stepLabel}
          </div>
          <h4 className="text-lg font-black text-slate-900 mb-2">
            {activeStep.actionTitle}
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeStep.description}
          </p>
        </div>

        {/* Real-World Practical Example */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Practical Example in the Real World</span>
          </div>
          <p className="text-slate-800 italic leading-relaxed">
            "{activeStep.practicalExample}"
          </p>
        </div>

        {/* Pitfall to Avoid */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Critical Pitfall to Avoid</span>
          </div>
          <p className="text-slate-800 leading-relaxed">
            {activeStep.pitfallToAvoid}
          </p>
        </div>

        {/* Step Navigation Controls & Why It Works */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 max-w-md">
            <span className="font-bold text-slate-700">Why this works: </span>
            {methodology.whyItWorks}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeStepIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStepIndex(activeStepIndex - 1)}
                className="text-xs"
              >
                Previous Step
              </Button>
            )}
            {activeStepIndex < methodology.steps.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                className="text-xs flex items-center gap-1"
              >
                <span>Next: {methodology.steps[activeStepIndex + 1].stepLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Protocol Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Related Threats */}
        {methodology.relatedThreatIds && methodology.relatedThreatIds.length > 0 && onSelectThreat && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Related Threat Guides:</span>
            {methodology.relatedThreatIds.map((tid) => (
              <button
                key={tid}
                onClick={() => onSelectThreat(tid)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition cursor-pointer"
              >
                #{tid}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
