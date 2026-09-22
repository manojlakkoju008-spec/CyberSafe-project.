import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Layers } from 'lucide-react';
import { SecurityMethodologyGuide } from '../../types';
import { Button } from '../common/Button';

interface AdminMethodologyModalProps {
  isOpen: boolean;
  methodology: SecurityMethodologyGuide | null;
  onSave: (guide: SecurityMethodologyGuide) => Promise<void>;
  onClose: () => void;
}

export const AdminMethodologyModal: React.FC<AdminMethodologyModalProps> = ({
  isOpen,
  methodology,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [standard, setStandard] = useState<'NIST CSF 2.0' | 'CIS Controls v8' | 'Zero Trust for Citizens' | 'Digital Hygiene Lifecycle'>('NIST CSF 2.0');
  const [category, setCategory] = useState('Framework Standards');
  const [targetAudience, setTargetAudience] = useState('General Citizens & Remote Workers');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  
  const [phases, setPhases] = useState<{
    phaseName: string;
    description: string;
    actionItemsText: string;
  }[]>([
    { phaseName: 'Phase 1: Identify', description: 'Catalog all digital assets', actionItemsText: 'Audit accounts\nList devices' }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (methodology) {
      setTitle(methodology.title || '');
      setStandard(methodology.standard || 'NIST CSF 2.0');
      setCategory(methodology.category || 'Framework Standards');
      setTargetAudience(methodology.targetAudience || 'General Citizens & Remote Workers');
      setSummary(methodology.summary || '');
      setStatus(methodology.status || 'published');
      if (methodology.phases && methodology.phases.length > 0) {
        setPhases(
          methodology.phases.map((p) => ({
            phaseName: p.phaseName,
            description: p.description,
            actionItemsText: p.actionItems.join('\n'),
          }))
        );
      } else {
        setPhases([{ phaseName: 'Phase 1', description: '', actionItemsText: '' }]);
      }
    } else {
      setTitle('');
      setStandard('NIST CSF 2.0');
      setCategory('Framework Standards');
      setTargetAudience('General Citizens & Remote Workers');
      setSummary('');
      setStatus('published');
      setPhases([
        { phaseName: 'Phase 1: Identify', description: 'Catalog all accounts and devices', actionItemsText: 'Audit active accounts\nReview permissions' },
        { phaseName: 'Phase 2: Protect', description: 'Deploy defensive controls', actionItemsText: 'Enable Multi-Factor Authentication\nUse password manager' }
      ]);
    }
    setErrorMessage(null);
  }, [methodology, isOpen]);

  if (!isOpen) return null;

  const handlePhaseChange = (index: number, field: string, value: string) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const handleAddPhase = () => {
    setPhases((prev) => [
      ...prev,
      { phaseName: `Phase ${prev.length + 1}`, description: '', actionItemsText: '' }
    ]);
  };

  const handleRemovePhase = (index: number) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a Title for this prevention methodology.');
      return;
    }
    if (!summary.trim()) {
      setErrorMessage('Please provide an executive Summary.');
      return;
    }

    const generatedId = methodology?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const formattedPhases = phases.map((p) => ({
      phaseName: p.phaseName.trim() || 'Core Step',
      description: p.description.trim() || 'Defensive methodology implementation.',
      actionItems: p.actionItemsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }));

    const itemToSave: SecurityMethodologyGuide = {
      id: generatedId,
      title: title.trim(),
      standard,
      category: category.trim(),
      targetAudience: targetAudience.trim(),
      summary: summary.trim(),
      status,
      updatedAt: new Date().toISOString(),
      phases: formattedPhases,
    };

    setIsSaving(true);
    try {
      await onSave(itemToSave);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save prevention methodology.');
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
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {methodology ? 'Edit Prevention Methodology' : 'Create Prevention Methodology'}
            </h2>
            <p className="text-xs text-slate-500">Security Engineering & Standard Framework Guides</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Title & Standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Methodology Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CIS Critical Controls for Home Offices"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Alignment</label>
              <select
                value={standard}
                onChange={(e: any) => setStandard(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                <option value="CIS Controls v8">CIS Controls v8</option>
                <option value="Zero Trust for Citizens">Zero Trust for Citizens</option>
                <option value="Digital Hygiene Lifecycle">Digital Hygiene Lifecycle</option>
              </select>
            </div>
          </div>

          {/* Category, Target Audience, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Framework Standards"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Students & Seniors"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Methodology Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explain the strategic rationale and defense philosophy behind this methodology..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Phases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700">Action Phases & Safeguards</label>
              <button
                type="button"
                onClick={handleAddPhase}
                className="text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Phase</span>
              </button>
            </div>

            <div className="space-y-4">
              {phases.map((phase, idx) => (
                <div key={idx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={phase.phaseName}
                      onChange={(e) => handlePhaseChange(idx, 'phaseName', e.target.value)}
                      placeholder="Phase Name (e.g. 1. Identify Digital Assets)"
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                    {phases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhase(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={phase.description}
                    onChange={(e) => handlePhaseChange(idx, 'description', e.target.value)}
                    placeholder="Brief description of this phase objective..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">
                      Action Items (one per line):
                    </label>
                    <textarea
                      rows={2}
                      value={phase.actionItemsText}
                      onChange={(e) => handlePhaseChange(idx, 'actionItemsText', e.target.value)}
                      placeholder="List specific action items on separate lines..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSaving} className="text-xs">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving} className="text-xs flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700">
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{methodology ? 'Update Methodology' : 'Publish Methodology'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
