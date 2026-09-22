import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ThreatItem, SeverityLevel } from '../../types';
import { Button } from '../common/Button';

interface AdminThreatModalProps {
  isOpen: boolean;
  threat: ThreatItem | null;
  onSave: (threat: ThreatItem) => Promise<void>;
  onClose: () => void;
}

export const AdminThreatModal: React.FC<AdminThreatModalProps> = ({
  isOpen,
  threat,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Deception & Fraud');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [iconName, setIconName] = useState('MailWarning');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [realExample, setRealExample] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  
  const [redFlags, setRedFlags] = useState<string[]>(['']);
  const [actionSteps, setActionSteps] = useState<string[]>(['']);
  const [preventionTips, setPreventionTips] = useState<string[]>(['']);
  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (threat) {
      setTitle(threat.title || '');
      setCategory(threat.category || 'Deception & Fraud');
      setSeverity(threat.severity || 'high');
      setIconName(threat.iconName || 'MailWarning');
      setShortDesc(threat.shortDesc || '');
      setFullDesc(threat.fullDesc || '');
      setRealExample(threat.realExample || '');
      setStatus(threat.status || 'published');
      setRedFlags(threat.redFlags?.length ? [...threat.redFlags] : ['']);
      setActionSteps(threat.actionSteps?.length ? [...threat.actionSteps] : ['']);
      setPreventionTips(threat.preventionTips?.length ? [...threat.preventionTips] : ['']);
    } else {
      setTitle('');
      setCategory('Deception & Fraud');
      setSeverity('high');
      setIconName('MailWarning');
      setShortDesc('');
      setFullDesc('');
      setRealExample('');
      setStatus('published');
      setRedFlags(['']);
      setActionSteps(['']);
      setPreventionTips(['']);
    }
    setErrorMessage(null);
  }, [threat, isOpen]);

  if (!isOpen) return null;

  const handleArrayChange = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const handleAddArrayItem = (setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList((prev) => [...prev, '']);
  };

  const handleRemoveArrayItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    if (list.length <= 1) {
      setList(['']);
    } else {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a descriptive Threat Title.');
      return;
    }
    if (!shortDesc.trim()) {
      setErrorMessage('Please provide a Short Overview description.');
      return;
    }

    const cleanedRedFlags = redFlags.map((s) => s.trim()).filter(Boolean);
    const cleanedActions = actionSteps.map((s) => s.trim()).filter(Boolean);
    const cleanedTips = preventionTips.map((s) => s.trim()).filter(Boolean);

    const generatedId = threat?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const itemToSave: ThreatItem = {
      id: generatedId,
      title: title.trim(),
      category: category.trim(),
      severity,
      iconName,
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc.trim() || shortDesc.trim(),
      redFlags: cleanedRedFlags.length ? cleanedRedFlags : ['Look out for urgent language', 'Verify sender headers'],
      actionSteps: cleanedActions.length ? cleanedActions : ['Do not click suspicious links', 'Change compromised credentials'],
      preventionTips: cleanedTips.length ? cleanedTips : ['Enable Multi-Factor Authentication', 'Use strong passwords'],
      realExample: realExample.trim() || 'A user received an urgent pretext asking them to confirm banking details.',
      status,
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await onSave(itemToSave);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save threat guide. Verify permissions.');
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
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {threat ? 'Edit Threat Resource' : 'Create New Learning Resource'}
            </h2>
            <p className="text-xs text-slate-500">Curriculum Threat Guide Catalog Management</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Threat Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Deepfake Voice Impersonation"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Deception & Fraud">Deception & Fraud</option>
                <option value="Financial Scams">Financial Scams</option>
                <option value="Malicious Software">Malicious Software</option>
                <option value="Privacy & Identity">Privacy & Identity</option>
                <option value="Network & Infrastructure">Network & Infrastructure</option>
                <option value="Emerging AI Threats">Emerging AI Threats</option>
              </select>
            </div>
          </div>

          {/* Row 2: Severity, Icon, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e: any) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="critical">Critical (Immediate Financial/Identity Loss)</option>
                <option value="high">High (Direct Credential/Device Risk)</option>
                <option value="medium">Medium (Moderate Exploitation Risk)</option>
                <option value="low">Low (General Hygiene/Spam)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Icon Representation</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="MailWarning">MailWarning (Phishing)</option>
                <option value="Smartphone">Smartphone (SMS/Calling)</option>
                <option value="Lock">Lock (Ransomware)</option>
                <option value="CreditCard">CreditCard (Banking/UPI)</option>
                <option value="Wifi">Wifi (Public Networks)</option>
                <option value="Users">Users (Social Engineering)</option>
                <option value="ShieldAlert">ShieldAlert (General Threat)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="published">Published (Visible Publicly)</option>
                <option value="draft">Draft (Admin Only)</option>
              </select>
            </div>
          </div>

          {/* Short & Full Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Short Summary Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="A concise 1-2 sentence overview for the card..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full In-Depth Educational Guide</label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Comprehensive explanation of how attackers execute this threat..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Real-world Scenario */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Real-World Incident Example</label>
            <textarea
              rows={2}
              value={realExample}
              onChange={(e) => setRealExample(e.target.value)}
              placeholder="Describe a realistic victim scenario illustrating the scam in action..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Red Flags Dynamic Array */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Red Flags & Warning Signs</label>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setRedFlags)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Red Flag</span>
              </button>
            </div>
            <div className="space-y-2">
              {redFlags.map((flag, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => handleArrayChange(redFlags, setRedFlags, idx, e.target.value)}
                    placeholder="e.g. Artificial urgency demanding action within 15 minutes"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(redFlags, setRedFlags, idx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Steps Dynamic Array */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Immediate Action Steps (What to Do If Targeted)</label>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setActionSteps)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
            <div className="space-y-2">
              {actionSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayChange(actionSteps, setActionSteps, idx, e.target.value)}
                    placeholder="e.g. Disconnect the device from local Wi-Fi immediately"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(actionSteps, setActionSteps, idx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention Tips Dynamic Array */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Long-Term Prevention Tips</label>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setPreventionTips)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prevention Tip</span>
              </button>
            </div>
            <div className="space-y-2">
              {preventionTips.map((tip, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleArrayChange(preventionTips, setPreventionTips, idx, e.target.value)}
                    placeholder="e.g. Enforce hardware security keys (FIDO2) for primary accounts"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(preventionTips, setPreventionTips, idx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSaving} className="text-xs">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving} className="text-xs flex items-center gap-1.5">
              {isSaving ? (
                <span>Saving to Database...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{threat ? 'Update Threat Guide' : 'Publish to Curriculum'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
