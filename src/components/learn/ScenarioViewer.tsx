import React, { useState } from 'react';
import { AttackScenario } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Eye, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  BrainCircuit, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ScenarioViewerProps {
  scenario: AttackScenario;
  onExploreThreat?: (threatId: string) => void;
}

export const ScenarioViewer: React.FC<ScenarioViewerProps> = ({
  scenario,
  onExploreThreat,
}) => {
  const [checkedFlags, setCheckedFlags] = useState<Record<number, boolean>>({});

  const toggleFlag = (idx: number) => {
    setCheckedFlags(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const allFlagsSpotted = scenario.redFlagsPresent.every((_, idx) => checkedFlags[idx]);

  return (
    <Card className="bg-white border-slate-200 overflow-hidden shadow-sm">
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <Badge variant="warning" className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {scenario.threatCategory}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-700/50">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Trigger: {scenario.psychologicalTrigger}</span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {scenario.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {scenario.attackerPretext}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Victim's Screen Experience */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>What Appears On Your Screen</span>
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed relative">
            <div className="absolute top-2 right-2 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">
              Incoming Simulation
            </div>
            {scenario.victimPerspective}
          </div>
        </div>

        {/* Spot The Red Flags Interactive Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Interactive Checklist: Spot The Red Flags ({Object.values(checkedFlags).filter(Boolean).length} / {scenario.redFlagsPresent.length})</span>
            </h4>
            {allFlagsSpotted && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Flags Identified!
              </span>
            )}
          </div>

          <div className="space-y-2">
            {scenario.redFlagsPresent.map((flag, idx) => (
              <label
                key={idx}
                onClick={() => toggleFlag(idx)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                  checkedFlags[idx]
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition ${
                  checkedFlags[idx] ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {checkedFlags[idx] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="leading-relaxed font-medium">{flag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* What You Should Do */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Immediate Safe Action Protocol</span>
          </h4>
          <div className="space-y-2">
            {scenario.whatVictimShouldDo.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Educational Takeaway */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>High-Retention Rule to Remember</span>
          </div>
          <p className="text-slate-800 leading-relaxed font-medium">
            {scenario.takeaway}
          </p>
        </div>

        {/* Related Threat Guide Button */}
        {scenario.relatedThreatId && onExploreThreat && (
          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExploreThreat(scenario.relatedThreatId)}
              className="text-xs flex items-center gap-1.5"
            >
              <span>Explore Full {scenario.threatCategory} Deep Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
