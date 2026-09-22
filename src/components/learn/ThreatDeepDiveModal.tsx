import React, { useState } from 'react';
import { ThreatItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { IconHelper } from '../common/IconHelper';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Check,
  Copy,
  Printer
} from 'lucide-react';

interface ThreatDeepDiveModalProps {
  threat: ThreatItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelatedThreat?: (threatId: string) => void;
  onNavigateToReport?: (incidentId?: string) => void;
}

export const ThreatDeepDiveModal: React.FC<ThreatDeepDiveModalProps> = ({
  threat,
  isOpen,
  onClose,
  onSelectRelatedThreat,
  onNavigateToReport,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !threat) return null;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?tab=learn&threat=' + threat.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 animate-fadeIn max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate pr-4">
            <span className="text-slate-400">Learn</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-600">{threat.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 truncate">{threat.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy share link"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Threat Title & Hero Banner */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <IconHelper name={threat.iconName} className="w-7 h-7" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getSeverityBadgeVariant(threat.severity)} className="capitalize font-bold text-xs">
                  {threat.severity} Severity Threat
                </Badge>
                <Badge variant="neutral" className="text-xs">
                  {threat.category}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>3-4 min read</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {threat.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {threat.shortDesc}
              </p>
            </div>
          </div>

          {/* Detailed Educational Walkthrough */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Anatomy of the Attack & How It Works</span>
            </h2>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{threat.fullDesc}</p>
            </div>
          </div>

          {/* Real-World Case Study (The Pretext & Trap) */}
          {threat.realExample && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Realistic Victim Case Study: What Happens in Real Life</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-mono italic">
                "{threat.realExample}"
              </p>
            </div>
          )}

          {/* Red Flags / Warning Signs Checklist */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Critical Warning Signs (Red Flags in Plain Sight)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {threat.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <span className="leading-relaxed font-medium">{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Response Protocol: "What to Do Right Now" */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Immediate Action Steps if You Are Targeted</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {Object.values(completedSteps).filter(Boolean).length} of {threat.actionSteps.length} checked
              </span>
            </div>

            <div className="space-y-2.5">
              {threat.actionSteps.map((step, idx) => (
                <label
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                    completedSteps[idx]
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition ${
                      completedSteps[idx]
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {completedSteps[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`leading-relaxed font-medium ${completedSteps[idx] ? 'line-through text-slate-500' : ''}`}>
                    {step}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Long-Term Preventive Habits */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Proactive Long-Term Prevention Habits</span>
            </h2>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 divide-y divide-blue-100 text-xs">
              {threat.preventionTips.map((tip, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5 text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Direct Route */}
          {onNavigateToReport && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>Already Lost Money or Data to this Attack?</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Access official statutory reporting instructions for cybercrime.gov.in and National Helpline 1930.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateToReport(threat.id);
                }}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white shrink-0 font-bold"
              >
                <span>Report This Incident</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
