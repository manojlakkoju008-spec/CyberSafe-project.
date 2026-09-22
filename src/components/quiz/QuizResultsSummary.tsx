import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  SlidersHorizontal,
  Info,
  Eye,
  Check
} from 'lucide-react';
import { QuizAssessmentResult, PageType } from '../../types';
import { Button } from '../common/Button';

interface QuizResultsSummaryProps {
  results: QuizAssessmentResult;
  onRetake: () => void;
  onChangeMode: () => void;
  onReviewQuestions: () => void;
  onNavigateToLearn: () => void;
  onNavigateToPrevent: () => void;
}

export const QuizResultsSummary: React.FC<QuizResultsSummaryProps> = ({
  results,
  onRetake,
  onChangeMode,
  onReviewQuestions,
  onNavigateToLearn,
  onNavigateToPrevent,
}) => {
  const {
    awarenessScore,
    totalQuestions,
    correctCount,
    incorrectCount,
    tier,
    categoryBreakdown,
    areasToImprove,
    disclaimer,
  } = results;

  const getTierColor = () => {
    switch (tier.variant) {
      case 'safe':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'danger':
      default:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
        };
    }
  };

  const tierColors = getTierColor();

  return (
    <div id="quiz-results-summary" className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Educational Notice Banner (Critical Requirement) */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <strong className="font-bold block text-amber-900">
            Educational Assessment Notice:
          </strong>
          <p className="text-amber-900/90 leading-relaxed font-normal">
            {disclaimer}
          </p>
        </div>
      </div>

      {/* Primary Score Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assessment Completed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cyber Awareness Score
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              {tier.feedback}
            </p>
          </div>

          {/* Large Circular Score Indicator */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-28 h-28 rounded-full bg-slate-50 border-4 border-slate-100 flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                {awarenessScore}%
              </span>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Awareness
              </span>
            </div>
            <div className="space-y-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${tierColors.badge}`}>
                {tier.badgeText}
              </span>
              <div className="text-sm font-bold text-slate-900">{tier.label}</div>
              <div className="text-xs text-slate-500">
                {correctCount} of {totalQuestions} scenarios safe
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-500 font-medium block mb-1">Total Scenarios</span>
            <span className="text-xl font-bold text-slate-900">{totalQuestions}</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-xs text-emerald-700 font-semibold block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
            </span>
            <span className="text-xl font-bold text-emerald-900">{correctCount}</span>
          </div>
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60">
            <span className="text-xs text-rose-700 font-semibold block mb-1 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Vulnerable
            </span>
            <span className="text-xl font-bold text-rose-900">{incorrectCount}</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
            <span className="text-xs text-indigo-700 font-semibold block mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Accuracy
            </span>
            <span className="text-xl font-bold text-indigo-900">{awarenessScore}%</span>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Category Performance Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Proficiency evaluated across each tested knowledge domain
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryBreakdown.map((item) => {
            const isProficient = item.proficiency === 'proficient';
            const isModerate = item.proficiency === 'moderate';

            let barColor = 'bg-rose-500';
            let badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            let ratingLabel = 'Needs Attention';

            if (isProficient) {
              barColor = 'bg-emerald-500';
              badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              ratingLabel = 'Proficient';
            } else if (isModerate) {
              barColor = 'bg-amber-500';
              badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
              ratingLabel = 'Developing';
            }

            return (
              <div
                key={item.category}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.category}</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold border text-[10px] ${badgeClass}`}>
                    {ratingLabel} ({item.correctCount}/{item.totalQuestions})
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Recognition Score</span>
                  <span className="font-bold text-slate-800">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Areas to Improve (if any mistakes occurred) */}
      {areasToImprove.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Areas to Strengthen
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 -mt-2">
            Targeted recommendations based on vulnerable choices made during this session:
          </p>

          <div className="space-y-3">
            {areasToImprove.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 block">
                    {area.category}
                  </span>
                  <p className="text-slate-600 font-normal">
                    {area.conceptToReview}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToLearn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition shrink-0 self-start sm:self-center cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Review Guide</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Learn & Prevent Resources */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
        <div>
          <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider block mb-1">
            Recommended Action Plan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Reinforce Your Cyber Defense
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Translate awareness into technical protection. Explore in-depth threat intelligence guides or lock down your accounts step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            id="quiz-goto-learn-btn"
            onClick={onNavigateToLearn}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Learn Section
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-200 transition">
                Deep Threat Intelligence Guides
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                Study real-world case studies, technical mechanics, and threat indicators.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition shrink-0" />
          </button>

          <button
            type="button"
            id="quiz-goto-prevent-btn"
            onClick={onNavigateToPrevent}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Prevent Checklists
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-200 transition">
                Personal Hardening Checklists
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                Lock down accounts with 2FA, configure device settings, and generate passphrases.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Actions: Retake, Try Another Mode, Detailed Review */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button
          type="button"
          id="quiz-review-answers-btn"
          onClick={onReviewQuestions}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
        >
          <Eye className="w-4 h-4 text-indigo-600" />
          <span>Review All Questions & Explanations</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            id="quiz-change-mode-btn"
            variant="outline"
            onClick={onChangeMode}
            className="text-xs sm:text-sm font-semibold px-4 py-2.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            <span>Try Another Mode</span>
          </Button>

          <Button
            id="quiz-retake-btn"
            variant="primary"
            onClick={onRetake}
            className="text-xs sm:text-sm font-semibold px-5 py-2.5 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
