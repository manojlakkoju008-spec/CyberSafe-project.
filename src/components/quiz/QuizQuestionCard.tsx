import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  MessageSquareWarning,
} from 'lucide-react';
import { QuizQuestion, QuizOption } from '../../types';
import { Button } from '../common/Button';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  onNext,
  isLast,
}) => {
  const isAnswered = Boolean(selectedOptionId);
  const correctOption = question.options.find((o) => o.isCorrect);
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isUserCorrect = selectedOption?.isCorrect ?? false;

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div id={`quiz-question-card-${question.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Question Header & Scenario */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Title & Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {question.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              {question.difficulty}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {question.title}
          </h2>
        </div>

        {/* Realistic Scenario Context Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            <MessageSquareWarning className="w-4 h-4 text-amber-500" />
            <span>Realistic Incident Scenario</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
            {question.scenario}
          </p>
        </div>

        {/* Question Prompt */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>{question.question}</span>
          </h3>
        </div>

        {/* Choices Options List */}
        <div className="space-y-3 pt-2">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const letter = letters[idx] || String(idx + 1);

            let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (isAnswered) {
              if (option.isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium ring-1 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
              } else if (isSelected && !option.isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-50/60 text-rose-950 font-medium ring-1 ring-rose-500/30';
                badgeStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            } else if (isSelected) {
              optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-medium ring-2 ring-indigo-500/20';
              badgeStyle = 'bg-indigo-600 text-white border-indigo-600';
            }

            return (
              <button
                key={option.id}
                type="button"
                id={`quiz-option-${question.id}-${option.id}`}
                disabled={isAnswered}
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 text-sm sm:text-base leading-snug cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border transition ${badgeStyle}`}
                >
                  {letter}
                </span>
                <span className="flex-1 pt-0.5">{option.text}</span>
                {isAnswered && (
                  <span className="shrink-0 pt-0.5">
                    {option.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Post-Selection Educational Feedback */}
        {isAnswered && (
          <div className="space-y-4 pt-4 border-t border-slate-200 animate-fadeIn">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isUserCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isUserCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-bold">
                  {isUserCorrect ? 'Safest Defensive Action Selected' : 'Vulnerable Decision Detected'}
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {selectedOption?.explanation || question.explanation}
                </p>
                {!isUserCorrect && correctOption && (
                  <p className="text-slate-800 font-semibold pt-1">
                    Safe Choice: {correctOption.text}
                  </p>
                )}
              </div>
            </div>

            {/* Warning Signs (Red Flags) */}
            {question.warningSigns && question.warningSigns.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Warning Signs & Red Flags to Recognize:</span>
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-700 pl-1">
                  {question.warningSigns.map((flag, i) => (
                    <li key={i} className="leading-relaxed">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Educational Takeaway */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 text-xs sm:text-sm flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900 block mb-0.5">Educational Takeaway:</span>
                <p className="text-slate-700 leading-relaxed">
                  {question.educationalTakeaway || question.takeaway}
                </p>
              </div>
            </div>

            {/* Next / Submit Button */}
            <div className="pt-2 flex justify-end">
              <Button
                id="quiz-next-question-btn"
                variant="primary"
                onClick={onNext}
                className="px-6 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{isLast ? 'Complete Assessment' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
