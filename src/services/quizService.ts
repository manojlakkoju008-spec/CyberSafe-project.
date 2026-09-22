import {
  QuizQuestion,
  QuizCategory,
  QuizDifficulty,
  QuizMode,
  QuizAssessmentResult,
  CategoryPerformanceResult,
  AreaToImprove,
} from '../types';
import { QUIZ_CATEGORIES_METADATA } from '../data/quizQuestionsData';
import { fetchAllQuizQuestions } from './contentService';

/**
 * Normalizes question fields ensuring compatibility between admin edits and legacy formats.
 */
export function normalizeQuizQuestion(raw: any): QuizQuestion {
  const category = (raw.category || raw.topic || 'Phishing') as QuizCategory;
  const difficulty: QuizDifficulty =
    raw.difficulty === 'beginner' || raw.difficulty === 'intermediate' || raw.difficulty === 'advanced'
      ? raw.difficulty
      : 'intermediate';

  const options = Array.isArray(raw.options) && raw.options.length > 0
    ? raw.options
    : [
        { id: 'a', text: 'Action A', isCorrect: false, explanation: 'Incorrect option.' },
        { id: 'b', text: 'Action B', isCorrect: true, explanation: 'Correct safe choice.' },
        { id: 'c', text: 'Action C', isCorrect: false, explanation: 'Incorrect option.' },
        { id: 'd', text: 'Action D', isCorrect: false, explanation: 'Incorrect option.' },
      ];

  const correctOpt = options.find((o: any) => o.isCorrect);
  const correctAnswer = raw.correctAnswer || (correctOpt ? correctOpt.id : 'b');

  const explanation = raw.explanation || (correctOpt?.explanation ? correctOpt.explanation : 'Always prioritize verified channels.');
  const takeaway = raw.educationalTakeaway || raw.takeaway || 'Always verify unusual alerts via official out-of-band channels.';

  return {
    id: Number(raw.id),
    title: raw.title || 'Security Awareness Scenario',
    question: raw.question || 'What is the most secure and appropriate action to take?',
    scenario: raw.scenario || 'You encounter an unexpected request online.',
    options,
    correctAnswer,
    explanation,
    warningSigns: Array.isArray(raw.warningSigns) && raw.warningSigns.length > 0
      ? raw.warningSigns
      : ['Artificial urgency or pressure', 'Unverified sender or origin'],
    category,
    topic: category,
    difficulty,
    takeaway,
    educationalTakeaway: takeaway,
    status: raw.status || 'published',
    updatedAt: raw.updatedAt,
  };
}

/**
 * Fetches all published quiz questions from the service.
 */
export async function getPublishedQuestions(): Promise<QuizQuestion[]> {
  const all = await fetchAllQuizQuestions();
  return all
    .map(normalizeQuizQuestion)
    .filter((q) => q.status !== 'draft');
}

/**
 * Filters and configures questions based on selected mode, category, and difficulty.
 */
export function selectQuestionsForSession(
  allQuestions: QuizQuestion[],
  mode: QuizMode,
  category?: QuizCategory | null,
  difficulty?: 'all' | QuizDifficulty
): QuizQuestion[] {
  let pool = [...allQuestions];

  // Filter by difficulty if explicitly chosen and not 'all'
  if (difficulty && difficulty !== 'all') {
    const diffFiltered = pool.filter((q) => q.difficulty === difficulty);
    if (diffFiltered.length >= 3) {
      pool = diffFiltered;
    }
  }

  if (mode === 'category') {
    if (category) {
      const categoryQuestions = pool.filter((q) => q.category === category);
      if (categoryQuestions.length > 0) {
        return categoryQuestions;
      }
      // fallback to allQuestions matching category without difficulty filter
      const fallbackCat = allQuestions.filter((q) => q.category === category);
      if (fallbackCat.length > 0) return fallbackCat;
    }
  }

  if (mode === 'quick') {
    // Return up to 10 questions across diverse categories
    return shuffleArray(pool).slice(0, 10);
  }

  if (mode === 'assessment') {
    // Comprehensive full assessment: up to 20-25 questions covering broad categories
    return shuffleArray(pool).slice(0, Math.min(20, pool.length));
  }

  if (mode === 'scenario') {
    // Scenario-focused test: prioritize questions with detailed scenarios
    const scenarioPool = pool.filter((q) => q.scenario && q.scenario.length > 50);
    return shuffleArray(scenarioPool.length >= 8 ? scenarioPool : pool).slice(0, 12);
  }

  return pool.slice(0, 10);
}

/**
 * Calculates comprehensive educational assessment results.
 */
export function calculateAssessmentResults(
  questions: QuizQuestion[],
  userAnswers: Record<number, string>,
  mode: QuizMode,
  selectedCategory?: QuizCategory | null
): QuizAssessmentResult {
  let correctCount = 0;
  const categoryStats: Record<string, { total: number; correct: number; incorrect: number }> = {};

  questions.forEach((q) => {
    const cat = q.category || 'Phishing';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { total: 0, correct: 0, incorrect: 0 };
    }
    categoryStats[cat].total += 1;

    const userAnswer = userAnswers[q.id];
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = correctOption && userAnswer === correctOption.id;

    if (isCorrect) {
      correctCount += 1;
      categoryStats[cat].correct += 1;
    } else {
      categoryStats[cat].incorrect += 1;
    }
  });

  const totalQuestions = questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const awarenessScore = scorePercentage;

  // Derive Awareness Tier
  let tier: QuizAssessmentResult['tier'] = {
    label: 'Cyber Sentinel',
    variant: 'safe',
    badgeText: 'Advanced Awareness',
    feedback: 'Outstanding defensive instincts. You consistently identified deception indicators and safely navigated high-risk scenarios.',
  };

  if (scorePercentage < 50) {
    tier = {
      label: 'High Exposure Risk',
      variant: 'danger',
      badgeText: 'Urgent Attention Needed',
      feedback: 'Several common manipulation techniques were missed. Prioritize reviewing the recommended foundational security modules.',
    };
  } else if (scorePercentage < 75) {
    tier = {
      label: 'Foundational Awareness',
      variant: 'warning',
      badgeText: 'Emerging Awareness',
      feedback: 'Good basic safety awareness, but subtle spear-phishing or financial fraud pretexts can still pose a risk. Review the detailed takeaways.',
    };
  } else if (scorePercentage < 90) {
    tier = {
      label: 'Vigilant Defender',
      variant: 'info',
      badgeText: 'Proficient Awareness',
      feedback: 'Strong understanding of cybersecurity threats. You recognized most warning signs and avoided dangerous traps.',
    };
  }

  // Category Breakdown
  const categoryBreakdown: CategoryPerformanceResult[] = Object.entries(categoryStats).map(([catName, stat]) => {
    const catPercent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    let proficiency: CategoryPerformanceResult['proficiency'] = 'proficient';
    if (catPercent < 50) proficiency = 'needs-attention';
    else if (catPercent < 80) proficiency = 'moderate';

    return {
      category: catName as QuizCategory,
      totalQuestions: stat.total,
      correctCount: stat.correct,
      incorrectCount: stat.incorrect,
      percentage: catPercent,
      proficiency,
    };
  });

  // Sort: weakest categories first
  categoryBreakdown.sort((a, b) => a.percentage - b.percentage);

  // Derive Areas to Improve based on incorrect questions
  const areasToImprove: AreaToImprove[] = [];
  const processedCats = new Set<string>();

  questions.forEach((q) => {
    const cat = q.category;
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = correctOption && userAnswers[q.id] === correctOption.id;

    if (!isCorrect && !processedCats.has(cat)) {
      processedCats.add(cat);
      const meta = QUIZ_CATEGORIES_METADATA.find((m) => m.id === cat);
      areasToImprove.push({
        category: cat,
        summary: `Review common red flags and safe verification rules for ${cat}.`,
        conceptToReview: q.educationalTakeaway || q.takeaway || 'Verify unusual digital requests out-of-band.',
        recommendedLearnTitle: meta?.recommendedLearnTopic || `${cat} Prevention Guide`,
        recommendedLearnPage: 'learn',
      });
    }
  });

  return {
    mode,
    categorySelected: selectedCategory,
    totalQuestions,
    correctCount,
    incorrectCount,
    scorePercentage,
    awarenessScore,
    tier,
    categoryBreakdown,
    areasToImprove,
    userAnswers,
    completedAt: new Date().toISOString(),
    disclaimer:
      'The Cyber Awareness Score is for educational simulation purposes only. It measures personal recognition of common deception techniques and does not represent or guarantee technical cybersecurity protection, system security, or immunity from cyberattacks.',
  };
}

// Utility: Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
