import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { QuizQuestion, QuizCategory, QuizOption } from '../../types';

interface AdminQuizzesSectionProps {
  quizzes: QuizQuestion[];
  onSaveQuiz: (quiz: QuizQuestion) => Promise<void>;
  onDeleteQuiz: (id: number) => Promise<void>;
  globalSearch: string;
}

const QUIZ_CATEGORIES: QuizCategory[] = [
  'Phishing',
  'Password Security',
  'Account Security',
  'Online Scams',
  'Social Engineering',
  'Financial Fraud',
  'Privacy',
  'Social Media Safety',
  'Mobile Security',
  'Safe Browsing',
  'Malware Awareness',
  'Identity Theft',
];

export function AdminQuizzesSection({
  quizzes,
  onSaveQuiz,
  onDeleteQuiz,
  globalSearch,
}: AdminQuizzesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  const filteredQuizzes = quizzes.filter((q) => {
    const matchSearch =
      !effectiveSearch ||
      q.question.toLowerCase().includes(effectiveSearch) ||
      (q.explanation && q.explanation.toLowerCase().includes(effectiveSearch)) ||
      (q.category && q.category.toLowerCase().includes(effectiveSearch));

    const matchDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    const matchStatus = statusFilter === 'all' || (q.status || 'published') === statusFilter;

    return matchSearch && matchDiff && matchStatus;
  });

  const handleOpenNew = () => {
    setEditingQuiz({
      id: Date.now(),
      title: 'Urgent OTP Disclosure Request',
      topic: 'Phishing Defense',
      scenario: 'You receive an urgent message requesting your two-factor authorization code.',
      question:
        'A customer support representative asks for your one-time SMS verification code to resolve a frozen transaction. What should you do?',
      options: [
        {
          id: 'opt-a',
          text: 'Read the code immediately to unfreeze the account',
          isCorrect: false,
          explanation: 'Never disclose OTPs to anyone under any pretext.',
        },
        {
          id: 'opt-b',
          text: 'Refuse and terminate communication; OTPs must never be disclosed',
          isCorrect: true,
          explanation: 'Official representatives will never ask for an OTP.',
        },
        {
          id: 'opt-c',
          text: 'Ask the representative for their employee badge number first',
          isCorrect: false,
          explanation: 'Badge numbers can easily be fabricated by scammers.',
        },
      ],
      correctAnswer: 'opt-b',
      explanation:
        'Banks and service providers will never request your one-time password (OTP) over phone, email, or chat.',
      warningSigns: ['Unsolicited incoming call', 'Urgency pretext', 'Asking for verification code'],
      takeaway: 'Never share one-time passwords with anyone.',
      educationalTakeaway:
        'Disclosing an OTP allows unauthorized fund transfers or account takeovers.',
      category: 'Phishing',
      difficulty: 'intermediate',
      status: 'published',
    });
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleOptionTextChange = (index: number, text: string) => {
    if (!editingQuiz) return;
    const nextOpts = [...editingQuiz.options];
    nextOpts[index] = { ...nextOpts[index], text };
    setEditingQuiz({ ...editingQuiz, options: nextOpts });
  };

  const handleAddOption = () => {
    if (!editingQuiz || editingQuiz.options.length >= 6) return;
    const newId = `opt-${Date.now()}`;
    setEditingQuiz({
      ...editingQuiz,
      options: [
        ...editingQuiz.options,
        { id: newId, text: 'New option answer', isCorrect: false, explanation: '' },
      ],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!editingQuiz || editingQuiz.options.length <= 2) return;
    const removedId = editingQuiz.options[index].id;
    const nextOpts = editingQuiz.options.filter((_, i) => i !== index);
    let nextCorrect = editingQuiz.correctAnswer;
    if (nextCorrect === removedId) {
      nextCorrect = nextOpts[0].id;
      nextOpts[0].isCorrect = true;
    }
    setEditingQuiz({ ...editingQuiz, options: nextOpts, correctAnswer: nextCorrect });
  };

  const handleSetCorrectOption = (optId: string) => {
    if (!editingQuiz) return;
    const nextOpts = editingQuiz.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optId,
    }));
    setEditingQuiz({ ...editingQuiz, options: nextOpts, correctAnswer: optId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;

    if (!editingQuiz.question.trim()) {
      setValidationError('Scenario question text is required.');
      return;
    }

    if (editingQuiz.options.some((o) => !o.text.trim())) {
      setValidationError('All answer options must contain text.');
      return;
    }

    if (!editingQuiz.explanation || !editingQuiz.explanation.trim()) {
      setValidationError('Educational takeaway/explanation is required.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      await onSaveQuiz(editingQuiz);
      setIsModalOpen(false);
      setEditingQuiz(null);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Cyber Literacy Question Bank</h3>
            <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              {filteredQuizzes.length} questions
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Interactive scenario evaluations, citizen literacy challenges, and educational takeaways.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenNew}
          className="w-full sm:w-auto text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Quiz Question
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Question & Scenario</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Options Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50/60 transition group">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {quiz.question}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{quiz.explanation}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {quiz.category || 'Phishing'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap capitalize text-slate-700">
                    {quiz.difficulty}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    {quiz.options.length} options
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        quiz.status === 'published' || !quiz.status
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {quiz.status || 'published'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-700 border-slate-200 hover:bg-slate-100 text-[11px] py-1 px-2"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirmId(quiz.id)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && editingQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-900">
                {editingQuiz.question ? 'Edit Quiz Question' : 'New Quiz Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-800 block mb-1">Scenario Question *</label>
                <textarea
                  rows={2}
                  required
                  value={editingQuiz.question}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category</label>
                  <select
                    value={editingQuiz.category}
                    onChange={(e) =>
                      setEditingQuiz({ ...editingQuiz, category: e.target.value as QuizCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {QUIZ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Difficulty</label>
                  <select
                    value={editingQuiz.difficulty}
                    onChange={(e) =>
                      setEditingQuiz({ ...editingQuiz, difficulty: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Status</label>
                  <select
                    value={editingQuiz.status || 'published'}
                    onChange={(e) =>
                      setEditingQuiz({ ...editingQuiz, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Options list with correct answer radio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    Answer Choices (Select radio button for the correct answer)
                  </label>
                  {editingQuiz.options.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {editingQuiz.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={opt.isCorrect || editingQuiz.correctAnswer === opt.id}
                        onChange={() => handleSetCorrectOption(opt.id)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {editingQuiz.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Educational Takeaway / Explanation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingQuiz.explanation || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                  placeholder="Explain why the correct answer is safest and cite relevant cyber defense protocols..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Delete Question</h4>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this scenario question from the question bank?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  await onDeleteQuiz(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
