import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Edit2,
  Trash2,
  X,
  Users,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PlatformAnnouncement } from '../../types';

interface AdminAnnouncementsSectionProps {
  announcements: PlatformAnnouncement[];
  onSaveAnnouncement: (ann: PlatformAnnouncement) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  globalSearch: string;
}

export function AdminAnnouncementsSection({
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  globalSearch,
}: AdminAnnouncementsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingAnn, setEditingAnn] = useState<PlatformAnnouncement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchSearch =
      !effectiveSearch ||
      ann.title.toLowerCase().includes(effectiveSearch) ||
      ann.message.toLowerCase().includes(effectiveSearch);

    const matchStatus = statusFilter === 'all' || ann.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ann.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const handleOpenNew = () => {
    setEditingAnn({
      id: `ann-${Date.now()}`,
      title: '',
      message: '',
      priority: 'medium',
      audience: 'all',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn || !editingAnn.title.trim() || !editingAnn.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSaveAnnouncement(editingAnn);
      setIsModalOpen(false);
      setEditingAnn(null);
    } catch (err: any) {
      alert(`Failed to save announcement: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteAnnouncement(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(`Failed to delete announcement: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Platform Broadcast Notices</h3>
            <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              {filteredAnnouncements.length} notices
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Publish public cyber alerts, statutory notices, and platform updates.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenNew}
          className="w-full sm:w-auto text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Announcement
        </Button>
      </div>

      {/* Filter Strip */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : ann.priority === 'high'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {ann.priority} Priority
                </span>

                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    ann.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ann.status}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  Audience: {ann.audience}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{ann.message}</p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                <span>Created: {new Date(ann.createdAt).toLocaleDateString()}</span>
                {ann.startDate && ann.endDate && (
                  <span>
                    Valid: {ann.startDate} to {ann.endDate}
                  </span>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingAnn(ann);
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 py-1.5 px-3"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(ann.id)}
                className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 py-1.5 px-3"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Delete Announcement</h4>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete this broadcast announcement?
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
                onClick={() => handleDelete(deleteConfirmId)}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete Notice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && editingAnn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingAnn.title ? 'Edit Announcement' : 'New Broadcast Notice'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={editingAnn.title}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                  placeholder="e.g. DoT Sanchar Saathi Golden-Hour Warning"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Notice Message *</label>
                <textarea
                  rows={4}
                  required
                  value={editingAnn.message}
                  onChange={(e) => setEditingAnn({ ...editingAnn, message: e.target.value })}
                  placeholder="Citizen guidance and actionable precautions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Priority</label>
                  <select
                    value={editingAnn.priority}
                    onChange={(e) =>
                      setEditingAnn({ ...editingAnn, priority: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Audience</label>
                  <select
                    value={editingAnn.audience}
                    onChange={(e) =>
                      setEditingAnn({ ...editingAnn, audience: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="all">All Citizens</option>
                    <option value="members">Members</option>
                    <option value="students">Students</option>
                    <option value="seniors">Seniors</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Status</label>
                  <select
                    value={editingAnn.status}
                    onChange={(e) =>
                      setEditingAnn({ ...editingAnn, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingAnn.startDate || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingAnn.endDate || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
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
                  {isSubmitting ? 'Saving...' : 'Save Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
