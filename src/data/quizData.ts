import { QuizQuestion } from '../types';
import { MASTER_QUIZ_QUESTIONS, QUIZ_CATEGORIES_METADATA } from './quizQuestionsData';

export { QUIZ_CATEGORIES_METADATA };

// Export all published questions from master dataset
export const QUIZ_QUESTIONS: QuizQuestion[] = MASTER_QUIZ_QUESTIONS;
