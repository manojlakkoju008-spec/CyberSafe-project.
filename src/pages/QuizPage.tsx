import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Lightbulb, 
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Info,
  ShieldAlert
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface QuizPageProps {
  onNavigateToLearn: () => void;
  onNavigateToPrevent: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ 
  onNavigateToLearn, 
  onNavigateToPrevent 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOptionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  // Calculate score
  const correctCount = Object.entries(userAnswers).reduce((acc, [qId, optId]) => {
    const q = QUIZ_QUESTIONS.find(item => String(item.id) === String(qId));
    if (!q) return acc;
    const chosen = q.options.find(o => o.id === optId);
    return chosen?.isCorrect ? acc + 1 : acc;
  }, 0);

  const getScoreSummary = () => {
    if (correctCount >= 9) {
      return {
        badgeText: 'Exceptional Vigilance',
        variant: 'safe' as const,
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        feedback: 'Outstanding scam awareness! You successfully identified high-pressure social engineering tactics, lookalike domains, UPI fraud traps, and fake investment offerings.',
        reviewConcepts: [
          'Continue keeping your software and authentication mechanisms hardened.',
          'Help family members and colleagues recognize the same deceptive signals.'
        ]
      };
    } else if (correctCount >= 7) {
      return {
        badgeText: 'Safety Conscious with Minor Gaps',
        variant: 'info' as const,
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        feedback: 'Good baseline security awareness! You caught the majority of scam attempts, but fell for a few subtle psychological urgency or technical deception tricks.',
        reviewConcepts: [
          'Review the fundamental rule of UPI: Receiving money never requires a PIN or scanning a QR code.',
          'Always inspect sender email addresses and verify urgent alerts out-of-band.'
        ]
      };
    } else if (correctCount >= 5) {
      return {
        badgeText: 'Moderate Exposure Risk',
        variant: 'warning' as const,
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        feedback: 'You are vulnerable to realistic pretexting, fake customer support lines, and urgent banking alerts. Criminal syndicates specifically rely on these common blind spots.',
        reviewConcepts: [
          'Never install remote desktop tools (AnyDesk, TeamViewer) at the request of customer care callers.',
          'Never share 6-digit OTPs over phone calls, even if the caller threatens immediate power disconnection.'
        ]
      };
    } else {
      return {
        badgeText: 'High Exposure - Study Recommended',
        variant: 'danger' as const,
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        feedback: 'Several decisions in this assessment would have led to unauthorized account takeovers or direct financial losses. We strongly encourage working through our Learn and Prevent sections.',
        reviewConcepts: [
          'Study our 10 Threat Guides in the Learn section.',
          'Follow the step-by-step Personal Safety Checklist in the Prevent section to lock down your accounts.'
        ]
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interactive Cyber Awareness Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Can You Spot the Scam?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Test your digital instincts against 10 realistic scenarios covering phishing emails, fake bank alerts, marketplace QR scams, task job offers, and emergency family impersonations.
        </p>
      </div>

      {/* Privacy & Educational Clarity Guarantee */}
      <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Educational Assessment:</strong> No login or personal information is collected. Your answers are evaluated entirely in your browser.
        </span>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Scenario {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="font-bold text-slate-800">
                {Math.round(((currentIndex) / QUIZ_QUESTIONS.length) * 100)}% Completed
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden p-0.5">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {currentQuestion.topic}
                </Badge>
                <span className="text-xs font-bold text-slate-500">
                  {currentQuestion.title}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Question {currentIndex + 1}</span>
            </div>

            {/* Scenario Box */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>The Realistic Scenario:</span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                "{currentQuestion.scenario}"
              </p>
            </div>

            {/* Question Prompt */}
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionClasses = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                if (isAnswerSubmitted) {
                  if (option.isCorrect) {
                    optionClasses = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-xs';
                  } else if (isSelected && !option.isCorrect) {
                    optionClasses = 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs';
                  } else {
                    optionClasses = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionClasses = 'bg-blue-50/90 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionClasses}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-extrabold mt-0.5 ${
                      isAnswerSubmitted && option.isCorrect
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isAnswerSubmitted && isSelected && !option.isCorrect
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}>
                      {option.id.toUpperCase()}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed flex-1">
                      {option.text}
                    </span>
                    {isAnswerSubmitted && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Pedagogical Feedback (Shown after confirm) */}
            {isAnswerSubmitted && (
              <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
                {/* Specific option explanation */}
                {(() => {
                  const chosenOpt = currentQuestion.options.find(o => o.id === selectedOptionId);
                  if (!chosenOpt) return null;

                  return (
                    <div className={`p-4 rounded-xl border space-y-1.5 ${
                      chosenOpt.isCorrect 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        {chosenOpt.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct Evaluation!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Vulnerable Decision:</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">{chosenOpt.explanation}</p>
                    </div>
                  );
                })()}

                {/* Warning Signs & Key Takeaway */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Warning Signs in This Scenario</span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {currentQuestion.warningSigns.map((ws, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{ws}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-blue-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Key Safety Takeaway</span>
                    </div>
                    <p className="text-xs leading-relaxed">{currentQuestion.takeaway}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {!isAnswerSubmitted ? 'Select an answer choice above' : 'Review the warning signs above'}
              </span>

              {!isAnswerSubmitted ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                >
                  Confirm Answer
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={handleNextQuestion}
                >
                  {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Final Awareness Score'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Quiz Completion & Results Dashboard */
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className={`p-8 ${getScoreSummary().bgColor} border border-slate-200 space-y-6 text-center shadow-sm`}>
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-blue-600 border border-slate-200">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Educational Assessment Results
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Cyber Awareness Score
              </h2>
              {/* Exact format: X / 10 */}
              <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                {correctCount} / 10
              </div>
              <div className="inline-block pt-1">
                <Badge variant={getScoreSummary().variant} size="md">
                  {getScoreSummary().badgeText}
                </Badge>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              {getScoreSummary().feedback}
            </p>

            {/* Key Concepts to Review */}
            <div className="bg-white/90 p-4 rounded-xl border border-slate-200 max-w-lg mx-auto text-left space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Key Concepts You Should Review:</span>
              </div>
              <ul className="space-y-1.5 text-slate-700">
                {getScoreSummary().reviewConcepts.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white/60 rounded-lg text-[11px] text-slate-500 max-w-md mx-auto">
              * This score is an educational simulation reflecting situational scam detection. It does not certify that your accounts or devices are immune to security threats.
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200/80">
              <Button
                variant="outline"
                size="md"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleRestart}
                className="bg-white"
              >
                Restart Quiz
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={onNavigateToLearn}
              >
                Return to Learn Section
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<ShieldCheck className="w-4 h-4" />}
                onClick={onNavigateToPrevent}
              >
                Take Safety Checklist
              </Button>
            </div>
          </Card>

          {/* Review of all 10 Scenarios */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Comprehensive Scenario Review (10 Questions)
            </h3>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const userChoiceId = userAnswers[q.id];
                const userChoice = q.options.find(o => o.id === userChoiceId);
                const correctChoice = q.options.find(o => o.isCorrect);
                const isUserCorrect = userChoice?.isCorrect;

                return (
                  <Card key={q.id} className="p-5 space-y-3 border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{q.title}</span>
                        <Badge variant="neutral" size="sm">
                          {q.topic}
                        </Badge>
                      </div>
                      <Badge variant={isUserCorrect ? 'safe' : 'danger'} size="sm">
                        {isUserCorrect ? 'CORRECT' : 'VULNERABLE CHOICE'}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      "{q.scenario}"
                    </p>

                    <div className="text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-600">Your decision: </span>
                        <span className={isUserCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {userChoice?.text || 'Not answered'}
                        </span>
                      </div>
                      {!isUserCorrect && (
                        <div>
                          <span className="font-bold text-slate-600">Safest approach: </span>
                          <span className="text-emerald-700 font-medium">
                            {correctChoice?.text}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-blue-950 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span><strong>Key Principle:</strong> {q.takeaway}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
