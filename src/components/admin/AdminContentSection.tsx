import React, { useState } from 'react';
import {
  FolderOpen,
  BookOpen,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { ThreatItem, SecurityMethodologyGuide } from '../../types';

interface AdminContentSectionProps {
  threats: ThreatItem[];
  methodologies: SecurityMethodologyGuide[];
  onSaveThreat: (threat: ThreatItem) => Promise<void>;
  onDeleteThreat: (id: string) => Promise<void>;
  onSaveMethodology: (method: SecurityMethodologyGuide) => Promise<void>;
  onDeleteMethodology: (id: string) => Promise<void>;
  activeSubtype?: 'all' | 'learning' | 'prevention';
  globalSearch: string;
}

export function AdminContentSection({
  threats,
  methodologies,
  onSaveThreat,
  onDeleteThreat,
  onSaveMethodology,
  onDeleteMethodology,
  activeSubtype = 'all',
  globalSearch,
}: AdminContentSectionProps) {
  const [activeTab, setActiveTab] = useState<'threats' | 'methodologies'>(
    activeSubtype === 'prevention' ? 'methodologies' : 'threats'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Editor states
  const [editingThreat, setEditingThreat] = useState<ThreatItem | null>(null);
  const [editingMethod, setEditingMethod] = useState<SecurityMethodologyGuide | null>(null);
  const [previewItem, setPreviewItem] = useState<{ type: 'threat' | 'method'; data: any } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'threat' | 'method'; id: string } | null>(null);

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  // Filtered threats
  const filteredThreats = threats.filter((t) => {
    const matchSearch =
      !effectiveSearch ||
      t.title.toLowerCase().includes(effectiveSearch) ||
      (t.shortDesc && t.shortDesc.toLowerCase().includes(effectiveSearch)) ||
      (t.fullDesc && t.fullDesc.toLowerCase().includes(effectiveSearch)) ||
      t.category.toLowerCase().includes(effectiveSearch);

    const matchStatus = statusFilter === 'all' || (t.status || 'published') === statusFilter;
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;

    return matchSearch && matchStatus && matchCat;
  });

  // Filtered methodologies
  const filteredMethods = methodologies.filter((m) => {
    const matchSearch =
      !effectiveSearch ||
      m.title.toLowerCase().includes(effectiveSearch) ||
      (m.summary && m.summary.toLowerCase().includes(effectiveSearch)) ||
      (m.category && m.category.toLowerCase().includes(effectiveSearch));

    const matchStatus = statusFilter === 'all' || (m.status || 'published') === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleOpenNewThreat = () => {
    setEditingThreat({
      id: `threat-${Date.now()}`,
      title: '',
      category: 'phishing',
      severity: 'medium',
      iconName: 'AlertTriangle',
      shortDesc: '',
      fullDesc: '',
      redFlags: ['Unprompted urgency in communication'],
      realExample: 'Citizen received message stating electricity would be disconnected in 15 minutes.',
      actionSteps: ['Verify directly with sender using official phone directory'],
      preventionTips: ['Never click unverified shortened links in SMS'],
      status: 'draft',
      frameworkMappings: {
        nistCsf: 'PR.AC - Identity Management & Access Control',
      },
    });
  };

  const handleOpenNewMethod = () => {
    setEditingMethod({
      id: `method-${Date.now()}`,
      title: '',
      standard: 'NIST CSF 2.0',
      summary: '',
      targetAudience: 'General Citizens & Digital Consumers',
      category: 'citizen-defense',
      status: 'draft',
      phases: [
        {
          phaseName: 'Identify & Classify Assets',
          description: 'Inventory and classify target credentials and high-value accounts.',
          actionItems: ['List all primary banking, email, and social accounts'],
        },
      ],
    });
  };

  const handleSaveThreatForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingThreat || !editingThreat.title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSaveThreat(editingThreat);
      setEditingThreat(null);
    } catch (err: any) {
      alert(`Failed to save guide: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMethodForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod || !editingMethod.title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSaveMethodology(editingMethod);
      setEditingMethod(null);
    } catch (err: any) {
      alert(`Failed to save methodology: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Switching */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('threats')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'threats'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Learning Guides (Threats)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              {threats.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('methodologies')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'methodologies'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prevention Methodologies</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              {methodologies.length}
            </span>
          </button>
        </div>

        <Button
          variant="primary"
          onClick={activeTab === 'threats' ? handleOpenNewThreat : handleOpenNewMethod}
          className="w-full sm:w-auto text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {activeTab === 'threats' ? 'New Learning Guide' : 'New Prevention Guide'}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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

      {/* Content Items List */}
      {activeTab === 'threats' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Framework Mapping</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {threat.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {threat.shortDesc || threat.fullDesc}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {threat.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          threat.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : threat.severity === 'high'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {threat.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {threat.frameworkMappings?.nistCsf || 'NIST CSF'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          threat.status === 'published' || !threat.status
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {threat.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewItem({ type: 'threat', data: threat })}
                        className="text-slate-600 border-slate-200 hover:bg-slate-100 text-[11px] py-1 px-2"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingThreat(threat)}
                        className="text-slate-700 border-slate-200 hover:bg-slate-100 text-[11px] py-1 px-2"
                        title="Edit Guide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm({ type: 'threat', id: threat.id })}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2"
                        title="Delete Guide"
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
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Title & Framework</th>
                  <th className="py-3 px-4">Target Audience</th>
                  <th className="py-3 px-4">Phases Count</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMethods.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{m.standard || 'NIST CSF 2.0'}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      {m.targetAudience}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                      {m.phases?.length || 0} defense phases
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          m.status === 'published' || !m.status
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewItem({ type: 'method', data: m })}
                        className="text-slate-600 border-slate-200 hover:bg-slate-100 text-[11px] py-1 px-2"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMethod(m)}
                        className="text-slate-700 border-slate-200 hover:bg-slate-100 text-[11px] py-1 px-2"
                        title="Edit Guide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm({ type: 'method', id: m.id })}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2"
                        title="Delete Guide"
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
      )}

      {/* Edit Threat Modal */}
      {editingThreat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-900">
                {editingThreat.title ? 'Edit Threat Guide' : 'New Threat Guide'}
              </h3>
              <button
                onClick={() => setEditingThreat(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveThreatForm} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Threat Title *</label>
                <input
                  type="text"
                  required
                  value={editingThreat.title}
                  onChange={(e) => setEditingThreat({ ...editingThreat, title: e.target.value })}
                  placeholder="e.g. Reverse-Engineered APK Banking Malware"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={editingThreat.shortDesc}
                  onChange={(e) =>
                    setEditingThreat({ ...editingThreat, shortDesc: e.target.value })
                  }
                  placeholder="Concise 1-sentence synopsis"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Detailed Analysis *</label>
                <textarea
                  rows={3}
                  required
                  value={editingThreat.fullDesc}
                  onChange={(e) =>
                    setEditingThreat({ ...editingThreat, fullDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingThreat.category}
                    onChange={(e) =>
                      setEditingThreat({ ...editingThreat, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Severity</label>
                  <select
                    value={editingThreat.severity}
                    onChange={(e) =>
                      setEditingThreat({ ...editingThreat, severity: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Status</label>
                  <select
                    value={editingThreat.status || 'published'}
                    onChange={(e) =>
                      setEditingThreat({ ...editingThreat, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Red Flags (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingThreat.redFlags.join('\n')}
                  onChange={(e) =>
                    setEditingThreat({
                      ...editingThreat,
                      redFlags: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Defense Action Steps (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingThreat.actionSteps.join('\n')}
                  onChange={(e) =>
                    setEditingThreat({
                      ...editingThreat,
                      actionSteps: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingThreat(null)}
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
                  {isSubmitting ? 'Saving...' : 'Save Guide'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Methodology Modal */}
      {editingMethod && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-900">
                {editingMethod.title ? 'Edit Prevention Guide' : 'New Prevention Guide'}
              </h3>
              <button
                onClick={() => setEditingMethod(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMethodForm} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  value={editingMethod.title}
                  onChange={(e) => setEditingMethod({ ...editingMethod, title: e.target.value })}
                  placeholder="e.g. Identity & Access Fortress Checklist"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={editingMethod.summary}
                  onChange={(e) =>
                    setEditingMethod({ ...editingMethod, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Standard / Framework</label>
                  <select
                    value={editingMethod.standard}
                    onChange={(e) =>
                      setEditingMethod({ ...editingMethod, standard: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                    <option value="CIS Controls v8">CIS Controls v8</option>
                    <option value="Zero Trust for Citizens">Zero Trust for Citizens</option>
                    <option value="Digital Hygiene Lifecycle">Digital Hygiene Lifecycle</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Status</label>
                  <select
                    value={editingMethod.status || 'published'}
                    onChange={(e) =>
                      setEditingMethod({ ...editingMethod, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={editingMethod.targetAudience}
                  onChange={(e) =>
                    setEditingMethod({ ...editingMethod, targetAudience: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMethod(null)}
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
                  {isSubmitting ? 'Saving...' : 'Save Guide'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Preview: {previewItem.data.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {previewItem.type === 'threat' ? previewItem.data.category : previewItem.data.standard}
                </span>
                <h4 className="text-base font-bold text-slate-900 pt-1">
                  {previewItem.data.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {previewItem.type === 'threat'
                    ? previewItem.data.shortDesc || previewItem.data.fullDesc
                    : previewItem.data.summary}
                </p>
              </div>

              {previewItem.type === 'threat' && previewItem.data.redFlags && (
                <div className="space-y-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <h5 className="font-bold text-amber-900 text-[11px]">Identified Red Flags:</h5>
                  <ul className="list-disc pl-4 text-amber-800 space-y-0.5">
                    {previewItem.data.redFlags.map((rf: string, idx: number) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Confirm Deletion</h4>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this {deleteConfirm.type === 'threat' ? 'learning guide' : 'prevention methodology'}?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  if (deleteConfirm.type === 'threat') {
                    await onDeleteThreat(deleteConfirm.id);
                  } else {
                    await onDeleteMethodology(deleteConfirm.id);
                  }
                  setDeleteConfirm(null);
                }}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
