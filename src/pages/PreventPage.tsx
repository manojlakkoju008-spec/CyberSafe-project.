import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertCircle, 
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
  ShieldAlert
} from 'lucide-react';
import { ChecklistItem } from '../types';
import { CHECKLIST_ITEMS } from '../data/checklistData';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

const STORAGE_KEY = 'cybersafe_checklist_completed';

export const PreventPage: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['os-auto-updates', 'device-biometric-pin'];
    } catch {
      return ['os-auto-updates', 'device-biometric-pin'];
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
    } catch (err) {
      console.warn('Unable to save checklist progress to localStorage', err);
    }
  }, [completedIds]);

  const toggleItem = (id: string) => {
    setCompletedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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

  // Score classification
  const scoreInfo = useMemo(() => {
    if (score >= 90) {
      return {
        label: 'Hardened Digital Defense',
        variant: 'safe' as const,
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        barColor: 'bg-emerald-500',
        desc: 'Exceptional security posture. Your core accounts, personal data, and endpoints are heavily fortified against opportunistic and automated cyber threats.'
      };
    } else if (score >= 70) {
      return {
        label: 'Strong Security Posture',
        variant: 'info' as const,
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        barColor: 'bg-blue-600',
        desc: 'Solid foundational baseline. Complete a few remaining high-impact recommendations below to shield against credential theft and data loss.'
      };
    } else if (score >= 40) {
      return {
        label: 'Moderate Protection - Gaps Present',
        variant: 'warning' as const,
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        barColor: 'bg-amber-500',
        desc: 'Basic protections are active, but critical vulnerabilities (such as missing MFA or unverified backups) expose you to credential stuffing and phishing.'
      };
    } else {
      return {
        label: 'Vulnerable - Action Needed',
        variant: 'danger' as const,
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        barColor: 'bg-rose-500',
        desc: 'Significant exposure. Complete the essential checklist items to avoid account hijackings, identity theft, or ransomware data loss.'
      };
    }
  }, [score]);

  // Filter items
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

  // Presets
  const applyPreset = (preset: 'student' | 'remote' | 'clear') => {
    if (preset === 'clear') {
      setCompletedIds([]);
      return;
    }
    if (preset === 'student') {
      setCompletedIds(['os-auto-updates', 'device-biometric-pin', 'password-manager-unique-passwords', 'mfa-primary-email']);
    }
    if (preset === 'remote') {
      setCompletedIds([
        'os-auto-updates',
        'device-biometric-pin',
        'mfa-primary-email',
        'password-manager-unique-passwords',
        'change-router-admin-password',
        'trusted-vpn-public-wifi',
        'three-two-one-backups',
        'audit-logged-in-sessions'
      ]);
    }
  };

  // Export action plan as text file
  const handleExportPlan = () => {
    const lines = [
      '==================================================',
      'CYBERSAFE - DIGITAL SAFETY SELF-ASSESSMENT REPORT',
      'Academic Community Cyber Safety Awareness Platform',
      `Date Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      `Security Score: ${score}% (${scoreInfo.label})`,
      `Completed Tasks: ${completedIds.length} / ${CHECKLIST_ITEMS.length}`,
      '==================================================\n',
      'SUMMARY OF COMPLETED SAFEGUARDS:'
    ];

    CHECKLIST_ITEMS.filter(item => completedIds.includes(item.id)).forEach((item, idx) => {
      lines.push(`  [✓] ${item.title} (${item.category.toUpperCase()} - ${item.impact})`);
    });

    lines.push('\nPRIORITY ACTION ITEMS REMAINING:');
    CHECKLIST_ITEMS.filter(item => !completedIds.includes(item.id)).forEach((item, idx) => {
      lines.push(`\n  [ ] ${item.title}`);
      lines.push(`      Category: ${item.category} | Impact: ${item.impact.toUpperCase()} | Est. Time: ${item.estimatedMinutes} mins`);
      lines.push(`      Why: ${item.whyItMatters}`);
      lines.push(`      How-To: ${item.howToGuide}`);
    });

    lines.push('\n==================================================');
    lines.push('Keep this report as a reminder. Re-assess every 6 months.');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberSafe_Action_Plan_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Interactive Self-Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Digital Safety Health Checklist & Score
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Evaluate and strengthen your cybersecurity habits across accounts, personal devices, home networks, and data privacy. Check off completed items to calculate your real-time resilience score.
        </p>
      </div>

      {/* Score Dashboard Card */}
      <Card className={`p-6 sm:p-8 ${scoreInfo.bgColor} border ${scoreInfo.borderColor} space-y-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Security Posture Index
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
                ({completedIds.length} of {CHECKLIST_ITEMS.length} safeguards implemented)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
              {scoreInfo.desc}
            </p>
          </div>

          {/* Quick Actions & Presets */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4 text-slate-700" />}
              onClick={handleExportPlan}
              className="text-xs bg-white"
            >
              Export Action Plan (.txt)
            </Button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <span>Presets:</span>
              <button 
                onClick={() => applyPreset('student')}
                className="hover:text-blue-600 underline cursor-pointer"
              >
                Student
              </button>
              <span>•</span>
              <button 
                onClick={() => applyPreset('remote')}
                className="hover:text-blue-600 underline cursor-pointer"
              >
                Remote Work
              </button>
              <span>•</span>
              <button 
                onClick={() => applyPreset('clear')}
                className="hover:text-rose-600 underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-white/80 rounded-full h-3.5 overflow-hidden border border-slate-200/80 p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${scoreInfo.barColor}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>0% Vulnerable</span>
            <span>50% Baseline</span>
            <span>100% Hardened</span>
          </div>
        </div>
      </Card>

      {/* Dynamic Priority Recommendations (If Any Incomplete) */}
      {priorityRecommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Highest-Impact Next Steps for You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityRecommendations.map((rec) => (
              <div 
                key={rec.id}
                className="bg-white rounded-xl border border-amber-200 p-4 space-y-3 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={rec.impact === 'essential' ? 'danger' : 'warning'} size="sm">
                      {rec.impact.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {rec.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{rec.whyItMatters}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleItem(rec.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Mark Completed</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpandedItemId(expandedItemId === rec.id ? null : rec.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Instructions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Checklist Section */}
      <div className="space-y-6">
        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Safeguards', count: CHECKLIST_ITEMS.length },
              { id: 'accounts', label: 'Accounts', count: CHECKLIST_ITEMS.filter(i => i.category === 'accounts').length },
              { id: 'devices', label: 'Devices', count: CHECKLIST_ITEMS.filter(i => i.category === 'devices').length },
              { id: 'network', label: 'Network', count: CHECKLIST_ITEMS.filter(i => i.category === 'network').length },
              { id: 'privacy', label: 'Privacy & Data', count: CHECKLIST_ITEMS.filter(i => i.category === 'privacy').length },
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

          {/* Toggle Pending Only */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterPendingOnly}
              onChange={(e) => setFilterPendingOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Show Pending Only</span>
          </label>
        </div>

        {/* Checklist Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No pending items in this category!</p>
              <p className="text-xs text-slate-500">You have completed all selected safeguards.</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isCompleted = completedIds.includes(item.id);
              const isExpanded = expandedItemId === item.id;

              return (
                <Card 
                  key={item.id}
                  className={`p-4 sm:p-5 transition-all ${
                    isCompleted ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
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
                          <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100 text-blue-950 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-blue-900">
                              <Info className="w-3.5 h-3.5 text-blue-600" />
                              Why This Matters
                            </span>
                            <p>{item.whyItMatters}</p>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 space-y-1">
                            <span className="font-bold text-slate-900">How to Implement</span>
                            <p className="leading-relaxed">{item.howToGuide}</p>
                          </div>
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
