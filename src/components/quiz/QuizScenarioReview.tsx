import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Filter,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { Button } from '../common/Button';

interface QuizScenarioReviewProps {
  questions: QuizQuestion[];
  userAnswers: Record<number, string>;
  onBackToResults: () => void;
}

export const QuizScenarioReview: React.FC<QuizScenarioReviewProps> = ({
  questions,
  userAnswers,
  onBackToResults,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  const filteredQuestions = questions.filter((q) => {
    const userChoice = userAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    const isCorrect = correctOpt && userChoice === correctOpt.id;

    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div id="quiz-scenario-review" className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessment Summary</span>
        </button>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
            {(['all', 'incorrect', 'correct'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md font-medium capitalize transition cursor-pointer ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Scenarios Match Filter</h3>
            <p className="text-xs text-slate-500">
              {filter === 'incorrect' ? 'Flawless performance! You answered all scenarios correctly.' : 'No items match your selected filter.'}
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userChoice = userAnswers[q.id];
            const correctOpt = q.options.find((o) => o.isCorrect);
            const userOpt = q.options.find((o) => o.id === userChoice);
            const isCorrect = correctOpt && userChoice === correctOpt.id;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>{isCorrect ? 'Safe Decision' : 'Vulnerable Decision'}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Scenario #{q.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">
                      {q.category}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize font-medium">
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {q.title}
                </h3>

                {/* Scenario Context */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700">
                  <strong className="text-slate-900 block mb-1">Scenario Context:</strong>
                  {q.scenario}
                </div>

                {/* Question & User Choice vs Safe Choice */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900 shrink-0">Prompt:</span>
                      <span className="text-slate-700">{q.question}</span>
                    </div>
                  </div>

                  {/* User Answer */}
                  <div
                    className={`p-3 rounded-lg border ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                        : 'border-rose-200 bg-rose-50/50 text-rose-950'
                    }`}
                  >
                    <span className="font-bold block mb-0.5">
                      Your Selected Action:
                    </span>
                    <p className="text-slate-700">
                      {userOpt ? userOpt.text : 'Not answered'}
                    </p>
                    <p className="text-xs text-slate-600 pt-1 italic font-normal">
                      Feedback: {userOpt?.explanation || q.explanation}
                    </p>
                  </div>

                  {/* Safest Option (if user was incorrect) */}
                  {!isCorrect && correctOpt && (
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 text-emerald-950">
                      <span className="font-bold block mb-0.5 text-emerald-900">
                        Recommended Defensive Action:
                      </span>
                      <p className="text-slate-700">{correctOpt.text}</p>
                      <p className="text-xs text-slate-600 pt-1 italic font-normal">
                        Defensive rationale: {correctOpt.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Warning Signs & Educational Takeaway */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {q.warningSigns && q.warningSigns.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-amber-950">
                      <span className="font-bold flex items-center gap-1 text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Warning Signs
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {q.warningSigns.map((w, wi) => (
                          <li key={wi}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/70 text-indigo-950">
                    <span className="font-bold flex items-center gap-1 text-indigo-900 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                      Key Principle
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {q.educationalTakeaway || q.takeaway}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={onBackToResults}
          className="text-xs sm:text-sm font-semibold px-6 py-2.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Return to Assessment Summary</span>
        </Button>
      </div>
    </div>
  );
};
