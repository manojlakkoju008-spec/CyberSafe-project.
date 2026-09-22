import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  AlertOctagon,
  BookOpen,
  UserCheck,
  Shield,
  Layers
} from 'lucide-react';
import { ChecklistItem, PreventionCategory, PreventionAreaId, PreventionMethodology } from '../../types';
import { CHECKLIST_ITEMS, HABIT_CLUSTERS, HabitCluster } from '../../data/checklistData';
import { PREVENTION_METHODOLOGIES } from '../../data/preventMethodologies';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface PersonalSafetyPlanProps {
  completedIds: string[];
  onToggleItem: (id: string) => void;
  onApplyPreset: (preset: 'student' | 'remote' | 'senior' | 'citizen' | 'clear') => void;
  onSelectMethodologyByAreaId: (areaId: PreventionAreaId) => void;
}

export const PersonalSafetyPlan: React.FC<PersonalSafetyPlanProps> = ({
  completedIds,
  onToggleItem,
  onApplyPreset,
  onSelectMethodologyByAreaId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Weighted score calculation
  const { score, totalPoints, earnedPoints } = useMemo(() => {
    let max = 0;
    let earned = 0;
    CHECKLIST_ITEMS.forEach(item => {
      const weight = item.impact === 'essential' ? 3 : item.impact === 'recommended' ? 2 : 1;
      max += weight;
      if (completedIds.includes(item.id)) {
        earned += weight;
      }
    });
    const calculatedScore = max > 0 ? Math.round((earned / max) * 100) : 0;
    return { score: calculatedScore, totalPoints: max, earnedPoints: earned };
  }, [completedIds]);

  // Educational Habit Score Interpretation (strictly non-guarantee)
  const scoreInfo = useMemo(() => {
    if (score >= 90) {
      return {
        label: 'Disciplined Hygiene Baseline',
        variant: 'safe' as const,
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        barColor: 'bg-emerald-500',
        summary: 'Comprehensive self-reported habit coverage. You have active safeguards across core authentication, devices, and financial channels.',
        advisory: 'Remember: Cyber hygiene significantly reduces opportunistic risk, but vigilance against novel social engineering and zero-day threats remains essential.'
      };
    } else if (score >= 70) {
      return {
        label: 'Moderate Habit Maturity',
        variant: 'info' as const,
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        barColor: 'bg-blue-600',
        summary: 'Solid foundational baseline. Complete a few remaining high-impact recommendations to guard against automated credential stuffing and data loss.',
        advisory: 'Prioritize unverified backup routines and session auditing to fortify your secondary defenses.'
      };
    } else if (score >= 40) {
      return {
        label: 'Emerging Habits - Gaps Present',
        variant: 'warning' as const,
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        barColor: 'bg-amber-500',
        summary: 'Basic protections are active, but critical vulnerabilities (such as missing MFA, unverified backups, or reused passwords) leave you exposed.',
        advisory: 'Focus first on the "High-Impact Priority Steps" below to close your most urgent exposure windows.'
      };
    } else {
      return {
        label: 'High Exposure - Starting Point',
        variant: 'danger' as const,
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        barColor: 'bg-rose-500',
        summary: 'Elevated digital vulnerability. Crucial baseline safeguards like MFA, password managers, and automatic patches are currently unverified.',
        advisory: 'Take 15 minutes today to establish your foundational account and device locks.'
      };
    }
  }, [score]);

  // Habit Clusters Diagnostic Analysis (Account Protection, Device Security, etc.)
  const clusterDiagnostics = useMemo(() => {
    return HABIT_CLUSTERS.map(cluster => {
      const totalInCluster = cluster.requiredItemIds.length;
      const completedInCluster = cluster.requiredItemIds.filter(id => completedIds.includes(id)).length;
      const missingItemIds = cluster.requiredItemIds.filter(id => !completedIds.includes(id));
      const percentage = Math.round((completedInCluster / totalInCluster) * 100);

      let status: 'healthy' | 'partial' | 'critical' = 'critical';
      if (percentage === 100) {
        status = 'healthy';
      } else if (percentage >= 50) {
        status = 'partial';
      }

      return {
        ...cluster,
        totalInCluster,
        completedInCluster,
        missingItemIds,
        percentage,
        status,
        diagnosisMessage: cluster.educationalDiagnosis[status]
      };
    });
  }, [completedIds]);

  // Filtered Checklist items
  const filteredItems = useMemo(() => {
    return CHECKLIST_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesPending = filterPendingOnly ? !completedIds.includes(item.id) : true;
      return matchesCategory && matchesPending;
    });
  }, [activeCategory, filterPendingOnly, completedIds]);

  // Dynamic priority recommendations (top 3 essential unchecked items)
  const priorityRecommendations = useMemo(() => {
    return CHECKLIST_ITEMS.filter(item => !completedIds.includes(item.id))
      .sort((a, b) => {
        const weightA = a.impact === 'essential' ? 3 : a.impact === 'recommended' ? 2 : 1;
        const weightB = b.impact === 'essential' ? 3 : b.impact === 'recommended' ? 2 : 1;
        return weightB - weightA;
      })
      .slice(0, 3);
  }, [completedIds]);

  // Quick Wins (< 5 minutes, incomplete)
  const quickWins = useMemo(() => {
    return CHECKLIST_ITEMS.filter(item => !completedIds.includes(item.id) && item.estimatedMinutes <= 5)
      .slice(0, 3);
  }, [completedIds]);

  // Export action plan as text file
  const handleExportPlan = () => {
    const lines = [
      '=================================================================',
      'CYBERSAFE - PERSONAL DIGITAL SAFETY PLAN & HABIT AUDIT',
      'Educational Cybersecurity Self-Assessment Report',
      `Date Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      `Educational Habit Index: ${score}% (${scoreInfo.label})`,
      `Verified Safeguards: ${completedIds.length} of ${CHECKLIST_ITEMS.length}`,
      '=================================================================\n',
      'IMPORTANT EDUCATIONAL NOTICE:',
      'This checklist and score serve as an educational learning framework to help',
      'cultivate proactive digital hygiene. Completing these items significantly lowers',
      'common opportunistic risks, but no checklist guarantees total immunity from attacks.\n',
      '-----------------------------------------------------------------',
      'HABIT PILLAR DIAGNOSTICS:',
      '-----------------------------------------------------------------'
    ];

    clusterDiagnostics.forEach(cluster => {
      lines.push(`• ${cluster.title}: ${cluster.completedInCluster}/${cluster.totalInCluster} Habits (${cluster.status.toUpperCase()})`);
      lines.push(`  Diagnosis: ${cluster.diagnosisMessage}`);
      if (cluster.missingItemIds.length > 0) {
        lines.push('  Missing Habits:');
        cluster.missingItemIds.forEach(id => {
          const item = CHECKLIST_ITEMS.find(i => i.id === id);
          if (item) lines.push(`    - [ ] ${item.title}`);
        });
      }
      lines.push('');
    });

    lines.push('-----------------------------------------------------------------');
    lines.push('SUMMARY OF VERIFIED DEFENSIVE HABITS:');
    lines.push('-----------------------------------------------------------------');
    CHECKLIST_ITEMS.filter(item => completedIds.includes(item.id)).forEach(item => {
      lines.push(`  [✓] ${item.title} (${item.category.toUpperCase()} - ${item.impact})`);
    });

    lines.push('\n-----------------------------------------------------------------');
    lines.push('PRIORITY ACTION ITEMS REMAINING:');
    lines.push('-----------------------------------------------------------------');
    CHECKLIST_ITEMS.filter(item => !completedIds.includes(item.id)).forEach(item => {
      lines.push(`\n  [ ] ${item.title}`);
      lines.push(`      Pillar: ${item.category} | Impact: ${item.impact.toUpperCase()} | Est. Time: ${item.estimatedMinutes} mins`);
      lines.push(`      Why: ${item.whyItMatters}`);
      lines.push(`      How-To: ${item.howToGuide}`);
    });

    lines.push('\n=================================================================');
    lines.push('Keep this action plan for periodic review. Re-assess every 6 months.');
    lines.push('In case of cyber financial fraud in India, call National Helpline 1930.');
    lines.push('=================================================================');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberSafe_Personal_Safety_Plan_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* Educational Notice Banner (Crucial Requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3.5 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-amber-950">
          <span className="font-bold text-amber-900 block">
            Educational Self-Assessment Notice & Privacy Guarantee
          </span>
          <p className="leading-relaxed text-amber-900/90">
            This personal safety plan and habit score serve as an <strong>educational learning framework</strong> to help you cultivate proactive digital safety habits. Completing these items significantly lowers common opportunistic risks, but <strong>no checklist or score can guarantee immunity</strong> against evolving cyber threats.
          </p>
          <p className="text-[11px] sm:text-xs text-amber-800 font-medium pt-0.5">
            🔒 <strong>Zero Sensitive Data:</strong> CyberSafe evaluates only your self-reported habit checkboxes locally in your browser. We never collect, transmit, or store passwords, email credentials, bank cards, or identity numbers.
          </p>
        </div>
      </div>

      {/* Score & Health Dashboard Card */}
      <Card className={`p-6 sm:p-8 ${scoreInfo.bgColor} border ${scoreInfo.borderColor} space-y-6 shadow-xs`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Educational Habit Maturity Index
              </span>
              <Badge variant={scoreInfo.variant} size="sm">
                {scoreInfo.label}
              </Badge>
            </div>

            <div className="flex items-baseline gap-3">
              <span className={`text-4xl sm:text-6xl font-extrabold tracking-tight ${scoreInfo.textColor}`}>
                {score}%
              </span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                ({completedIds.length} of {CHECKLIST_ITEMS.length} verified safeguards active)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
              {scoreInfo.summary}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 italic max-w-2xl">
              {scoreInfo.advisory}
            </p>
          </div>

          {/* Quick Actions & Presets */}
          <div className="flex flex-col gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4 text-slate-700" />}
              onClick={handleExportPlan}
              className="text-xs bg-white shadow-2xs font-semibold"
            >
              Export Action Plan (.txt)
            </Button>

            {/* Persona Presets */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Quick Persona Baselines:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <button 
                  onClick={() => onApplyPreset('citizen')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer font-medium"
                >
                  Citizen
                </button>
                <button 
                  onClick={() => onApplyPreset('student')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer font-medium"
                >
                  Student
                </button>
                <button 
                  onClick={() => onApplyPreset('remote')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer font-medium"
                >
                  Remote
                </button>
                <button 
                  onClick={() => onApplyPreset('senior')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer font-medium"
                >
                  Senior
                </button>
                <button 
                  onClick={() => onApplyPreset('clear')}
                  className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-white/90 rounded-full h-3.5 overflow-hidden border border-slate-200/80 p-0.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${scoreInfo.barColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>0% High Exposure</span>
            <span>50% Emerging Habits</span>
            <span>100% Comprehensive Baseline</span>
          </div>
        </div>
      </Card>

      {/* Habit Clusters Gap Diagnostic Matrix (Requested Feature) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Habit Pillar Diagnostics & Incomplete Areas
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Identifies specific gaps across your digital defense pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusterDiagnostics.map(cluster => {
            const isFull = cluster.status === 'healthy';
            const isCritical = cluster.status === 'critical';

            return (
              <div 
                key={cluster.id}
                className={`p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between space-y-4 ${
                  isFull 
                    ? 'bg-emerald-50/40 border-emerald-200' 
                    : isCritical 
                    ? 'bg-rose-50/30 border-rose-200 shadow-2xs' 
                    : 'bg-amber-50/30 border-amber-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {isFull ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCritical ? (
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{cluster.title}</span>
                    </h3>

                    <Badge
                      variant={isFull ? 'safe' : isCritical ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {cluster.completedInCluster}/{cluster.totalInCluster} Habits
                    </Badge>
                  </div>

                  {/* Cluster progress line */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-emerald-500' : isCritical ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cluster.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cluster.description}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Diagnostic Finding:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {cluster.diagnosisMessage}
                    </p>
                  </div>

                  {/* Missing Habit Items List */}
                  {cluster.missingItemIds.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Missing Safeguards:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {cluster.missingItemIds.map(missingId => {
                          const item = CHECKLIST_ITEMS.find(i => i.id === missingId);
                          if (!item) return null;
                          return (
                            <li key={missingId} className="flex items-center justify-between gap-1 text-[11px] p-1 rounded hover:bg-white">
                              <span className="line-clamp-1 font-medium text-slate-800">• {item.title}</span>
                              <button
                                onClick={() => onToggleItem(missingId)}
                                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer shrink-0 ml-1"
                              >
                                Mark Done
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Direct Action Link to Methodology */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {isFull ? 'All habits active' : `${cluster.missingItemIds.length} actions needed`}
                  </span>
                  <button
                    onClick={() => onSelectMethodologyByAreaId(cluster.recommendedPracticeId)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Step-by-Step Method</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highest-Impact Priority Next Steps */}
      {priorityRecommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Highest-Impact Next Steps for You
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Closing these essential gaps gives the biggest risk reduction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityRecommendations.map((rec) => (
              <div 
                key={rec.id}
                className="bg-white rounded-2xl border border-amber-200 p-5 space-y-3 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={rec.impact === 'essential' ? 'danger' : 'warning'} size="sm">
                      {rec.impact.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      ~{rec.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{rec.whyItMatters}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onToggleItem(rec.id)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                  >
                    <span>Mark Done</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  {rec.areaId && (
                    <button
                      onClick={() => onSelectMethodologyByAreaId(rec.areaId!)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>How-To Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Checklist Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Comprehensive Digital Safety Checklist</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Audit your accounts, devices, networks, and privacy habits. Check off items as you verify them.
            </p>
          </div>

          {/* Toggle Pending Only */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={filterPendingOnly}
              onChange={(e) => setFilterPendingOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Show Incomplete Only ({CHECKLIST_ITEMS.filter(i => !completedIds.includes(i.id)).length})</span>
          </label>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
          {[
            { id: 'all', label: 'All Items', count: CHECKLIST_ITEMS.length },
            { id: 'accounts', label: 'Accounts', count: CHECKLIST_ITEMS.filter(i => i.category === 'accounts').length },
            { id: 'devices', label: 'Devices', count: CHECKLIST_ITEMS.filter(i => i.category === 'devices').length },
            { id: 'network', label: 'Network', count: CHECKLIST_ITEMS.filter(i => i.category === 'network').length },
            { id: 'financial', label: 'Financial', count: CHECKLIST_ITEMS.filter(i => i.category === 'financial').length },
            { id: 'privacy', label: 'Privacy', count: CHECKLIST_ITEMS.filter(i => i.category === 'privacy').length },
            { id: 'scams', label: 'Scam Defense', count: CHECKLIST_ITEMS.filter(i => i.category === 'scams').length }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Checklist Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2 bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No pending items in this view!</p>
              <p className="text-xs text-slate-500">You have completed and verified all selected safeguards.</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isCompleted = completedIds.includes(item.id);
              const isExpanded = expandedItemId === item.id;

              return (
                <Card 
                  key={item.id}
                  className={`p-4 sm:p-5 transition-all ${
                    isCompleted ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'bg-white border-slate-300 hover:border-blue-500'
                      }`}
                      aria-label={`Toggle ${item.title}`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm sm:text-base font-bold ${
                            isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </h3>
                          <Badge
                            variant={
                              item.impact === 'essential'
                                ? 'danger'
                                : item.impact === 'recommended'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {item.impact}
                          </Badge>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>

                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          ~{item.estimatedMinutes} mins
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="pt-3 mt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150 text-xs sm:text-sm">
                          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-blue-950 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-blue-900">
                              <Info className="w-3.5 h-3.5 text-blue-600" />
                              Why This Matters
                            </span>
                            <p className="leading-relaxed">{item.whyItMatters}</p>
                          </div>

                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 space-y-1">
                            <span className="font-bold text-slate-900">How to Implement</span>
                            <p className="leading-relaxed">{item.howToGuide}</p>
                          </div>

                          {item.areaId && (
                            <div className="pt-1 flex justify-end">
                              <button
                                onClick={() => onSelectMethodologyByAreaId(item.areaId!)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200"
                              >
                                <span>Read Full 7-Part Methodology</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide implementation instructions' : 'View how-to instructions & context'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
