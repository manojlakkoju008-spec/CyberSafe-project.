import React from 'react';
import { ChevronLeft, Zap, Layers, Award, Compass, ShieldCheck } from 'lucide-react';
import { QuizMode, QuizCategory, QuizDifficulty } from '../../types';

interface QuizProgressHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  mode: QuizMode;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  score: number;
  onExit: () => void;
}

export const QuizProgressHeader: React.FC<QuizProgressHeaderProps> = ({
  currentIndex,
  totalQuestions,
  mode,
  category,
  difficulty,
  score,
  onExit,
}) => {
  const percentComplete = Math.round(((currentIndex) / totalQuestions) * 100);

  const getModeIcon = () => {
    switch (mode) {
      case 'quick':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'category':
        return <Layers className="w-3.5 h-3.5 text-blue-500" />;
      case 'assessment':
        return <Award className="w-3.5 h-3.5 text-emerald-500" />;
      case 'scenario':
        return <Compass className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const getDifficultyBadge = (diff: QuizDifficulty) => {
    switch (diff) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="quiz-progress-header" className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Back / Exit Button */}
          <button
            type="button"
            id="quiz-exit-btn"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Change Mode</span>
          </button>

          {/* Mode & Category info */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
              {getModeIcon()}
              <span className="capitalize">{mode}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-800 font-bold truncate">{category}</span>
            <span className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full border capitalize font-semibold ${getDifficultyBadge(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Score: <strong className="text-slate-900 font-bold">{score}</strong>
            </span>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
            <span>
              Question <strong className="text-slate-800">{currentIndex + 1}</strong> of {totalQuestions}
            </span>
            <span>{percentComplete}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
