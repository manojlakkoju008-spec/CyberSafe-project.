import React from 'react';
import {
  Zap,
  Layers,
  Award,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { QuizMode, QuizCategory, QuizDifficulty, QuizQuestion } from '../../types';
import { QUIZ_CATEGORIES_METADATA } from '../../data/quizQuestionsData';
import { Button } from '../common/Button';

interface QuizModeSelectorProps {
  questions: QuizQuestion[];
  selectedMode: QuizMode;
  selectedCategory: QuizCategory | null;
  selectedDifficulty: 'all' | QuizDifficulty;
  onSelectMode: (mode: QuizMode) => void;
  onSelectCategory: (category: QuizCategory) => void;
  onSelectDifficulty: (difficulty: 'all' | QuizDifficulty) => void;
  onStartQuiz: () => void;
}

export const QuizModeSelector: React.FC<QuizModeSelectorProps> = ({
  questions,
  selectedMode,
  selectedCategory,
  selectedDifficulty,
  onSelectMode,
  onSelectCategory,
  onSelectDifficulty,
  onStartQuiz,
}) => {
  // Count questions per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Mode configurations
  const MODES = [
    {
      id: 'quick' as QuizMode,
      title: 'Quick Quiz',
      tag: '10 Questions',
      time: '~5 mins',
      icon: Zap,
      color: 'amber',
      description: 'Rapid 10-question pulse check covering the most common phishing and fraud tactics.',
    },
    {
      id: 'category' as QuizMode,
      title: 'Category Quiz',
      tag: 'Targeted Domain',
      time: '3–8 mins',
      icon: Layers,
      color: 'blue',
      description: 'Zero in on a specific domain such as UPI Fraud, Passwords, Mobile Security, or Privacy.',
    },
    {
      id: 'assessment' as QuizMode,
      title: 'Full Assessment',
      tag: '20+ Questions',
      time: '~15 mins',
      icon: Award,
      color: 'emerald',
      description: 'Comprehensive evaluation evaluating all 12 cybersecurity disciplines with in-depth analytics.',
    },
    {
      id: 'scenario' as QuizMode,
      title: 'Scenario Quiz',
      tag: 'Real Situations',
      time: '~8 mins',
      icon: Compass,
      color: 'purple',
      description: 'Context-rich, realistic dilemmas simulating actual SMS, email, and social engineering attacks.',
    },
  ];

  return (
    <div id="quiz-mode-selector-container" className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Cyber Awareness Assessment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
            Evaluate Your Defensive Instincts
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Test how effectively you identify digital deception, social engineering, and financial traps in simulated real-world scenarios.
          </p>
        </div>
      </div>

      {/* Mode Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Select Assessment Mode</span>
            <span className="text-xs font-normal text-slate-500">Choose how you want to test</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                id={`quiz-mode-btn-${m.id}`}
                onClick={() => onSelectMode(m.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
                  </span>
                )}
                <div>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{m.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {m.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-[11px] font-medium text-slate-500">
                  <span>{m.tag}</span>
                  <span>{m.time}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Picker (Visible when Category Quiz is active) */}
      {selectedMode === 'category' && (
        <div id="quiz-category-picker" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Choose Knowledge Domain
              </h3>
              <p className="text-xs text-slate-500">
                Select from all 12 core cybersecurity categories to target
              </p>
            </div>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                Active: {selectedCategory}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {QUIZ_CATEGORIES_METADATA.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isCatSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`quiz-cat-choice-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition text-xs flex flex-col justify-between cursor-pointer ${
                    isCatSelected
                      ? 'border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900">{cat.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-semibold">
                      {count} Qs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Options Bar: Difficulty & Start */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Difficulty Preference:</span>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                id={`quiz-difficulty-${lvl}`}
                onClick={() => onSelectDifficulty(lvl)}
                className={`px-3 py-1 rounded-md font-medium capitalize transition cursor-pointer ${
                  selectedDifficulty === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'Mixed' : lvl}
              </button>
            ))}
          </div>
        </div>

        <Button
          id="quiz-start-session-btn"
          variant="primary"
          onClick={onStartQuiz}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>Begin Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
