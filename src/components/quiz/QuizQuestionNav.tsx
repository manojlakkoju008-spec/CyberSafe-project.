import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizQuestionNavProps {
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: Record<number, string>;
  onJumpToQuestion: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export const QuizQuestionNav: React.FC<QuizQuestionNavProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onJumpToQuestion,
  onPrevious,
  onNext,
  onFinish,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const currentAnswered = Boolean(userAnswers[questions[currentIndex]?.id]);
  const allAnswered = questions.every((q) => Boolean(userAnswers[q.id]));

  return (
    <div id="quiz-question-navigation" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
      {/* Top Question Jump Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Question Navigator
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {Object.keys(userAnswers).length} of {questions.length} Answered
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const userChoice = userAnswers[q.id];
          const hasAnswered = Boolean(userChoice);
          const correctOption = q.options.find((o) => o.isCorrect);
          const isCorrect = correctOption && userChoice === correctOption.id;

          let btnClass = 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100';

          if (hasAnswered) {
            if (isCorrect) {
              btnClass = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
            } else {
              btnClass = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
            }
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-indigo-500 ring-offset-1 border-indigo-600 font-extrabold';
          }

          return (
            <button
              key={q.id}
              type="button"
              id={`quiz-jump-btn-${idx + 1}`}
              onClick={() => onJumpToQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border flex items-center justify-center transition cursor-pointer ${btnClass}`}
              title={`Question ${idx + 1}: ${q.title}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          id="quiz-nav-prev-btn"
          disabled={isFirst}
          onClick={onPrevious}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {isLast ? (
          <button
            type="button"
            id="quiz-nav-finish-btn"
            disabled={!currentAnswered && !allAnswered}
            onClick={onFinish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish Assessment</span>
          </button>
        ) : (
          <button
            type="button"
            id="quiz-nav-next-btn"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
