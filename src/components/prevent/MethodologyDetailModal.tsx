import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  AlertOctagon,
  LifeBuoy,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { PreventionMethodology } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface MethodologyDetailModalProps {
  methodology: PreventionMethodology | null;
  onClose: () => void;
  completedItemIds: string[];
  onToggleChecklistItem: (id: string) => void;
  onOpenReport?: () => void;
}

export const MethodologyDetailModal: React.FC<MethodologyDetailModalProps> = ({
  methodology,
  onClose,
  completedItemIds,
  onToggleChecklistItem,
  onOpenReport
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'mistakes' | 'emergency'>('overview');

  if (!methodology) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700 shrink-0 shadow-xs">
              <IconHelper name={methodology.iconName} className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="blue" size="sm">
                  {methodology.category.toUpperCase()}
                </Badge>
                {methodology.recommendedPractice.standardsReference && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                    {methodology.recommendedPractice.standardsReference}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {methodology.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {methodology.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-5 sm:px-6 border-b border-slate-200 bg-white overflow-x-auto py-2 text-xs sm:text-sm">
          {[
            { id: 'overview', label: '1. Risk & 4 Questions', icon: HelpCircle },
            { id: 'steps', label: '2. Step-by-Step Method', icon: BookOpen },
            { id: 'mistakes', label: '3. Common Mistakes', icon: AlertTriangle },
            { id: 'emergency', label: '4. If Something Goes Wrong', icon: LifeBuoy }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: OVERVIEW & 4 CORE QUESTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* The 4 Core Questions Matrix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    The 4 Core Questions Answered
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[11px] font-extrabold">Q1</span>
                      What should I do?
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {methodology.whatShouldIDo}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">Q2</span>
                      How should I do it?
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {methodology.howShouldIDoIt}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[11px] font-extrabold">Q3</span>
                      When should I do it?
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {methodology.whenShouldIDoIt}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">Q4</span>
                      Why does it matter?
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {methodology.whyDoesItMatter}
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Risk Deep-Dive */}
              <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Threat Profile & Risk Breakdown</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {methodology.risk.summary}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Primary Threat Actors:</span>
                    <span className="text-slate-600">{methodology.risk.threatActors.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Potential Consequence:</span>
                    <span className="text-slate-600">{methodology.risk.potentialImpact}</span>
                  </div>
                </div>

                {/* Real-World Case Scenario */}
                <div className="p-3.5 rounded-lg bg-white border border-rose-200/80 space-y-1 text-xs text-slate-700">
                  <span className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Real-World Incident Example:
                  </span>
                  <p className="italic font-mono text-[11px] sm:text-xs text-slate-800">
                    "{methodology.risk.realWorldScenario}"
                  </p>
                </div>
              </div>

              {/* 2. Why It Matters Detail */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Critical Impact Insights
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {methodology.whyItMattersDetail.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Golden Rule Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                    Defensive Golden Rule
                  </span>
                  <p className="text-sm font-semibold text-slate-100">
                    {methodology.recommendedPractice.goldenRule}
                  </p>
                </div>
              </div>

              {/* Quick Checklist Embed */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Quick Habit Checklist ({methodology.quickChecklist.length} Items)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Syncs with your Safety Plan
                  </span>
                </div>
                <div className="space-y-2">
                  {methodology.quickChecklist.map((check) => {
                    const isChecked = completedItemIds.includes(check.id);
                    return (
                      <label 
                        key={check.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleChecklistItem(check.id)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1 text-xs sm:text-sm">
                          <span className={isChecked ? 'line-through text-slate-400' : 'text-slate-800'}>
                            {check.itemText}
                          </span>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {check.priority}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP METHOD */}
          {activeTab === 'steps' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {methodology.recommendedPractice.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Follow this structured implementation sequence to build resilient, durable defensive habits.
                </p>
              </div>

              <div className="space-y-4">
                {methodology.stepByStepMethod.map((step) => (
                  <div 
                    key={step.stepNumber}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {step.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.timing}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {step.description}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 space-y-1">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                        Actionable Walkthrough:
                      </span>
                      <p>{step.actionableDetail}</p>
                    </div>

                    {step.proTip && (
                      <div className="flex items-start gap-2 text-xs text-blue-900 bg-blue-50/80 p-2.5 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span><strong>Pro-Tip:</strong> {step.proTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMMON MISTAKES */}
          {activeTab === 'mistakes' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Critical Misconceptions & Antipatterns
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Avoid these widespread traps that give a false sense of security while leaving accounts vulnerable.
                </p>
              </div>

              <div className="space-y-4">
                {methodology.commonMistakes.map((mistake, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                          Mistake #{idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {mistake.mistake}
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-amber-200 text-xs sm:text-sm space-y-1">
                      <span className="font-bold text-rose-800 text-xs uppercase tracking-wider block">
                        Why it is dangerous:
                      </span>
                      <p className="text-slate-700">{mistake.whyItsDangerous}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm space-y-1">
                      <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider block">
                        Recommended Alternative:
                      </span>
                      <p className="text-emerald-950 font-medium">{mistake.betterAlternative}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WHAT TO DO IF SOMETHING GOES WRONG */}
          {activeTab === 'emergency' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-rose-600 text-white flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-200">
                    <LifeBuoy className="w-4 h-4" />
                    <span>Emergency Incident Playbook</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Incident Triage & Rapid Containment
                  </h3>
                </div>
                {onOpenReport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenReport}
                    className="bg-white text-rose-700 hover:bg-rose-50 border-white text-xs shrink-0 font-bold"
                  >
                    File Cyber Report
                  </Button>
                )}
              </div>

              {/* 3-Stage Response Sequence */}
              <div className="space-y-4">
                {/* Stage 1: Immediate */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-[11px] font-extrabold">1</span>
                    Immediate Containment (First 15 Minutes)
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-7 list-disc">
                    {methodology.whatToDoIfSomethingGoesWrong.immediateActions.map((act, i) => (
                      <li key={i} className="font-medium">{act}</li>
                    ))}
                  </ul>
                </div>

                {/* Stage 2: Containment */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">2</span>
                    Secondary Containment & Isolation (Within 2 Hours)
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-7 list-disc">
                    {methodology.whatToDoIfSomethingGoesWrong.containmentSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Stage 3: Recovery */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center text-[11px] font-extrabold">3</span>
                    Restoration, Forensics & Statutory Reporting
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-7 list-disc">
                    {methodology.whatToDoIfSomethingGoesWrong.recoverySteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* National Emergency Directory Banner */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-blue-600" />
                  Statutory Assistance & Reporting Hotlines:
                </span>
                <p className="text-slate-600">
                  • <strong>Financial Cyber Fraud (India):</strong> Call National Helpline <strong>1930</strong> immediately to interdict money transfers.
                </p>
                <p className="text-slate-600">
                  • <strong>Official Cyber Portal:</strong> Report incidents at <strong>cybercrime.gov.in</strong> (India) or <strong>reportfraud.ftc.gov / IC3.gov</strong> (US).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 hidden sm:block">
            <span>Methodology Area: </span>
            <strong className="text-slate-800">{methodology.title}</strong>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close Guide
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const nextTab = activeTab === 'overview' ? 'steps' : activeTab === 'steps' ? 'mistakes' : activeTab === 'mistakes' ? 'emergency' : 'overview';
                setActiveTab(nextTab as any);
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {activeTab === 'emergency' ? 'Back to Overview' : 'Next Section'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
