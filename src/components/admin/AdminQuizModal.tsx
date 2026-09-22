import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, HelpCircle, CheckCircle2 } from 'lucide-react';
import { QuizQuestion, QuizOption } from '../../types';
import { Button } from '../common/Button';

interface AdminQuizModalProps {
  isOpen: boolean;
  question: QuizQuestion | null;
  existingQuestionsCount: number;
  onSave: (question: QuizQuestion) => Promise<void>;
  onClose: () => void;
}

export const AdminQuizModal: React.FC<AdminQuizModalProps> = ({
  isOpen,
  question,
  existingQuestionsCount,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Phishing');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [scenario, setScenario] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [takeaway, setTakeaway] = useState('');
  
  const [options, setOptions] = useState<QuizOption[]>([
    { id: 'a', text: '', isCorrect: false, explanation: '' },
    { id: 'b', text: '', isCorrect: true, explanation: '' },
    { id: 'c', text: '', isCorrect: false, explanation: '' },
    { id: 'd', text: '', isCorrect: false, explanation: '' },
  ]);

  const [warningSigns, setWarningSigns] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setTitle(question.title || '');
      setTopic(question.topic || 'Phishing');
      setDifficulty(question.difficulty || 'intermediate');
      setStatus(question.status || 'published');
      setScenario(question.scenario || '');
      setQuestionText(question.question || '');
      setTakeaway(question.takeaway || '');
      setOptions(question.options?.length === 4 ? question.options : [
        { id: 'a', text: question.options?.[0]?.text || '', isCorrect: question.options?.[0]?.isCorrect ?? false, explanation: question.options?.[0]?.explanation || '' },
        { id: 'b', text: question.options?.[1]?.text || '', isCorrect: question.options?.[1]?.isCorrect ?? true, explanation: question.options?.[1]?.explanation || '' },
        { id: 'c', text: question.options?.[2]?.text || '', isCorrect: question.options?.[2]?.isCorrect ?? false, explanation: question.options?.[2]?.explanation || '' },
        { id: 'd', text: question.options?.[3]?.text || '', isCorrect: question.options?.[3]?.isCorrect ?? false, explanation: question.options?.[3]?.explanation || '' },
      ]);
      setWarningSigns(question.warningSigns?.length ? [...question.warningSigns] : ['']);
    } else {
      setTitle('');
      setTopic('Phishing');
      setDifficulty('intermediate');
      setStatus('published');
      setScenario('');
      setQuestionText('What is the most secure and appropriate action to take?');
      setTakeaway('');
      setOptions([
        { id: 'a', text: '', isCorrect: false, explanation: '' },
        { id: 'b', text: '', isCorrect: true, explanation: '' },
        { id: 'c', text: '', isCorrect: false, explanation: '' },
        { id: 'd', text: '', isCorrect: false, explanation: '' },
      ]);
      setWarningSigns(['']);
    }
    setErrorMessage(null);
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  const handleOptionExplanationChange = (index: number, explanation: string) => {
    const updated = [...options];
    updated[index].explanation = explanation;
    setOptions(updated);
  };

  const handleSetCorrectOption = (correctIndex: number) => {
    const updated = options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === correctIndex,
    }));
    setOptions(updated);
  };

  const handleWarningSignChange = (idx: number, val: string) => {
    const updated = [...warningSigns];
    updated[idx] = val;
    setWarningSigns(updated);
  };

  const handleAddWarningSign = () => {
    setWarningSigns((prev) => [...prev, '']);
  };

  const handleRemoveWarningSign = (idx: number) => {
    if (warningSigns.length <= 1) {
      setWarningSigns(['']);
    } else {
      setWarningSigns(warningSigns.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a Title for this scenario question.');
      return;
    }
    if (!scenario.trim()) {
      setErrorMessage('Please describe the realistic Scenario.');
      return;
    }
    if (!questionText.trim()) {
      setErrorMessage('Please write the Question prompt.');
      return;
    }

    const emptyOption = options.find((opt) => !opt.text.trim());
    if (emptyOption) {
      setErrorMessage(`Please fill out text for Choice ${emptyOption.id.toUpperCase()}.`);
      return;
    }

    const hasCorrect = options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      setErrorMessage('Please designate one choice as the Correct Answer.');
      return;
    }

    const targetId = question ? question.id : existingQuestionsCount + 1;
    const cleanedSigns = warningSigns.map((s) => s.trim()).filter(Boolean);

    const correctOpt = options.find((opt) => opt.isCorrect);

    const itemToSave: QuizQuestion = {
      id: targetId,
      title: title.trim(),
      topic: topic.trim(),
      category: topic.trim() as any,
      difficulty,
      status,
      scenario: scenario.trim(),
      question: questionText.trim(),
      options: options.map((opt) => ({
        id: opt.id,
        text: opt.text.trim(),
        isCorrect: opt.isCorrect,
        explanation: opt.explanation.trim() || (opt.isCorrect ? 'Correct action.' : 'Incorrect action.'),
      })),
      correctAnswer: correctOpt?.id || 'b',
      explanation: correctOpt?.explanation || 'Always prioritize verified official channels.',
      warningSigns: cleanedSigns.length ? cleanedSigns : ['Artificial urgency or pressure'],
      takeaway: takeaway.trim() || 'Always verify unexpected requests out-of-band.',
      educationalTakeaway: takeaway.trim() || 'Always verify unexpected requests out-of-band.',
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await onSave(itemToSave);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save quiz scenario.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {question ? `Edit Quiz Question #${question.id}` : 'Create Awareness Quiz Scenario'}
            </h2>
            <p className="text-xs text-slate-500">Interactive Scenario Assessment Challenge Builder</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Row 1: Title, Topic, Difficulty, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Scenario Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent UPI Payment Request from Unknown Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Topic / Category</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="Phishing">Phishing</option>
                <option value="Password Security">Password Security</option>
                <option value="Account Security">Account Security</option>
                <option value="Online Scams">Online Scams</option>
                <option value="Social Engineering">Social Engineering</option>
                <option value="Financial Fraud">Financial Fraud</option>
                <option value="Privacy">Privacy</option>
                <option value="Social Media Safety">Social Media Safety</option>
                <option value="Mobile Security">Mobile Security</option>
                <option value="Safe Browsing">Safe Browsing</option>
                <option value="Malware Awareness">Malware Awareness</option>
                <option value="Identity Theft">Identity Theft</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Difficulty & Status</label>
              <div className="flex gap-2">
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-1/2 px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="beginner">Beg.</option>
                  <option value="intermediate">Med.</option>
                  <option value="advanced">Adv.</option>
                </select>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-1/2 px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="published">Pub.</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scenario & Question Prompt */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Realistic Scenario Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Describe the context: e.g. You receive an SMS claiming your electricity connection will be disconnected tonight..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Question Prompt <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the safest immediate action?"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 4 Choices with Radio Selection for Correct Answer */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Choices & Explanations (Select the radio button for the single correct answer)
            </label>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border transition ${
                    opt.isCorrect
                      ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <label className="flex items-center gap-1.5 font-bold text-xs cursor-pointer select-none">
                      <input
                        type="radio"
                        name="correct_option"
                        checked={opt.isCorrect}
                        onChange={() => handleSetCorrectOption(idx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={opt.isCorrect ? 'text-emerald-800' : 'text-slate-700'}>
                        Choice {opt.id.toUpperCase()} {opt.isCorrect && '• (Correct Answer)'}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    placeholder={`Enter choice text for Option ${opt.id.toUpperCase()}...`}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs mb-2 outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={opt.explanation}
                    onChange={(e) => handleOptionExplanationChange(idx, e.target.value)}
                    placeholder={`Feedback explanation displayed when user selects Choice ${opt.id.toUpperCase()}...`}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs & Key Takeaway */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Warning Signs in this Scenario</label>
                <button
                  type="button"
                  onClick={handleAddWarningSign}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sign</span>
                </button>
              </div>
              <div className="space-y-1.5">
                {warningSigns.map((sign, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input
                      type="text"
                      value={sign}
                      onChange={(e) => handleWarningSignChange(idx, e.target.value)}
                      placeholder="e.g. Unverified mobile number"
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWarningSign(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Core Educational Takeaway</label>
              <textarea
                rows={3}
                value={takeaway}
                onChange={(e) => setTakeaway(e.target.value)}
                placeholder="High-retention rule of thumb to remember..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSaving} className="text-xs">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving} className="text-xs flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
              {isSaving ? (
                <span>Saving Quiz Question...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{question ? 'Update Question' : 'Publish Question'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
