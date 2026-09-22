import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';
import {
  QuizQuestion,
  QuizCategory,
  QuizDifficulty,
  QuizMode,
  QuizAssessmentResult,
  UserQuizRecord
} from '../types';
import {
  getPublishedQuestions,
  selectQuestionsForSession,
  calculateAssessmentResults
} from '../services/quizService';
import { QuizModeSelector } from '../components/quiz/QuizModeSelector';
import { QuizProgressHeader } from '../components/quiz/QuizProgressHeader';
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard';
import { QuizQuestionNav } from '../components/quiz/QuizQuestionNav';
import { QuizResultsSummary } from '../components/quiz/QuizResultsSummary';
import { QuizScenarioReview } from '../components/quiz/QuizScenarioReview';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';

interface QuizPageProps {
  onNavigateToLearn: () => void;
  onNavigateToPrevent: () => void;
}

type QuizStage = 'select_mode' | 'in_progress' | 'results' | 'review';

export const QuizPage: React.FC<QuizPageProps> = ({
  onNavigateToLearn,
  onNavigateToPrevent,
}) => {
  const { user } = useAuth();

  // All published questions loaded from service/Firestore
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Configuration state
  const [activeStage, setActiveStage] = useState<QuizStage>('select_mode');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('quick');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>('Phishing');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | QuizDifficulty>('all');

  // Active Session state
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<QuizAssessmentResult | null>(null);

  // Load published questions on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoadingQuestions(true);
        const questions = await getPublishedQuestions();
        if (isMounted) {
          setAllQuestions(questions);
        }
      } catch (err) {
        console.warn('Failed to load published quiz questions:', err);
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Start a new quiz session with the selected filters
  const handleStartSession = () => {
    const questions = selectQuestionsForSession(
      allQuestions,
      selectedMode,
      selectedCategory,
      selectedDifficulty
    );

    if (questions.length === 0) {
      alert('No published questions found matching your filter criteria. Please choose another category or difficulty.');
      return;
    }

    setSessionQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setAssessmentResult(null);
    setActiveStage('in_progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select an option for current question
  const handleSelectOption = (optionId: string) => {
    const currentQ = sessionQuestions[currentIndex];
    if (!currentQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinishAssessment();
    }
  };

  // Previous Question
  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < sessionQuestions.length) {
      setCurrentIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Compute final results and save to profile
  const handleFinishAssessment = async () => {
    const results = calculateAssessmentResults(
      sessionQuestions,
      userAnswers,
      selectedMode,
      selectedCategory
    );
    setAssessmentResult(results);
    setActiveStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to user profile history if logged in
    if (user && user.uid) {
      try {
        const record: UserQuizRecord = {
          quizId: `quiz-${Date.now()}`,
          quizTitle: `${selectedMode.toUpperCase()} Assessment: ${selectedMode === 'category' ? selectedCategory : 'Cyber Defense'}`,
          score: results.correctCount,
          total: results.totalQuestions,
          completedAt: new Date().toISOString(),
          category: selectedMode === 'category' ? (selectedCategory || 'General') : 'Mixed Assessment',
        };

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          quizHistory: arrayUnion(record),
        });
      } catch (err) {
        console.warn('Could not persist quiz record to user profile:', err);
      }
    }
  };

  // Retake current mode
  const handleRetake = () => {
    handleStartSession();
  };

  // Return to mode selector
  const handleChangeMode = () => {
    setActiveStage('select_mode');
    setSessionQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    setAssessmentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Review questions view
  const handleReviewQuestions = () => {
    setActiveStage('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from review to results
  const handleBackToResults = () => {
    setActiveStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate live current score
  const liveScore = useMemo(() => {
    return sessionQuestions.reduce((acc, q) => {
      const userChoice = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      return correctOpt && userChoice === correctOpt.id ? acc + 1 : acc;
    }, 0);
  }, [sessionQuestions, userAnswers]);

  if (isLoadingQuestions) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Loading cybersecurity assessment library...
        </p>
      </div>
    );
  }

  const currentQ = sessionQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* 1. STAGE: SELECT MODE */}
      {activeStage === 'select_mode' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <QuizModeSelector
            questions={allQuestions}
            selectedMode={selectedMode}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            onSelectMode={setSelectedMode}
            onSelectCategory={setSelectedCategory}
            onSelectDifficulty={setSelectedDifficulty}
            onStartQuiz={handleStartSession}
          />
        </div>
      )}

      {/* 2. STAGE: IN PROGRESS */}
      {activeStage === 'in_progress' && currentQ && (
        <div>
          <QuizProgressHeader
            currentIndex={currentIndex}
            totalQuestions={sessionQuestions.length}
            mode={selectedMode}
            category={currentQ.category}
            difficulty={currentQ.difficulty}
            score={liveScore}
            onExit={handleChangeMode}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
            <QuizQuestionCard
              question={currentQ}
              selectedOptionId={userAnswers[currentQ.id] || null}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
              isLast={currentIndex === sessionQuestions.length - 1}
            />

            <QuizQuestionNav
              questions={sessionQuestions}
              currentIndex={currentIndex}
              userAnswers={userAnswers}
              onJumpToQuestion={handleJumpToQuestion}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onFinish={handleFinishAssessment}
            />
          </div>
        </div>
      )}

      {/* 3. STAGE: RESULTS SUMMARY */}
      {activeStage === 'results' && assessmentResult && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <QuizResultsSummary
            results={assessmentResult}
            onRetake={handleRetake}
            onChangeMode={handleChangeMode}
            onReviewQuestions={handleReviewQuestions}
            onNavigateToLearn={onNavigateToLearn}
            onNavigateToPrevent={onNavigateToPrevent}
          />
        </div>
      )}

      {/* 4. STAGE: SCENARIO IN-DEPTH REVIEW */}
      {activeStage === 'review' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <QuizScenarioReview
            questions={sessionQuestions}
            userAnswers={userAnswers}
            onBackToResults={handleBackToResults}
          />
        </div>
      )}
    </div>
  );
};
