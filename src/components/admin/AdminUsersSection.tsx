import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  XCircle,
  Mail,
  Key,
  Calendar,
  Clock,
  MoreVertical,
  X,
  AlertTriangle,
  UserCheck,
  Award,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AdminUserListItem, UserRole } from '../../types';

interface AdminUsersSectionProps {
  users: AdminUserListItem[];
  onUpdateUserStatus: (uid: string, status: 'active' | 'disabled') => Promise<void>;
  onUpdateUserRole: (uid: string, role: UserRole) => Promise<void>;
  onTriggerPasswordReset: (email: string) => Promise<void>;
  globalSearch: string;
}

export function AdminUsersSection({
  users,
  onUpdateUserStatus,
  onUpdateUserRole,
  onTriggerPasswordReset,
  globalSearch,
}: AdminUsersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Confirmation state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: 'disable' | 'enable' | 'reset-pass' | 'change-role';
    newRole?: UserRole;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionType: 'disable',
  });

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !effectiveSearch ||
      u.displayName.toLowerCase().includes(effectiveSearch) ||
      u.email.toLowerCase().includes(effectiveSearch) ||
      u.userType?.toLowerCase().includes(effectiveSearch);

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const handleExecuteConfirmedAction = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      if (confirmDialog.actionType === 'disable') {
        await onUpdateUserStatus(selectedUser.uid, 'disabled');
        setSelectedUser((prev) => (prev ? { ...prev, status: 'disabled' } : null));
        setActionSuccessMessage(`Account for ${selectedUser.email} has been disabled.`);
      } else if (confirmDialog.actionType === 'enable') {
        await onUpdateUserStatus(selectedUser.uid, 'active');
        setSelectedUser((prev) => (prev ? { ...prev, status: 'active' } : null));
        setActionSuccessMessage(`Account for ${selectedUser.email} has been activated.`);
      } else if (confirmDialog.actionType === 'reset-pass') {
        await onTriggerPasswordReset(selectedUser.email);
        setActionSuccessMessage(`Password recovery email dispatched to ${selectedUser.email}.`);
      } else if (confirmDialog.actionType === 'change-role' && confirmDialog.newRole) {
        await onUpdateUserRole(selectedUser.uid, confirmDialog.newRole);
        setSelectedUser((prev) => (prev ? { ...prev, role: confirmDialog.newRole! } : null));
        setActionSuccessMessage(`Role for ${selectedUser.email} updated to ${confirmDialog.newRole}.`);
      }
    } catch (err: any) {
      alert(`Action failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or persona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline font-medium">Filters:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="educator">Educator</option>
            <option value="member">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Action Success Toast */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">User Directory</h3>
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredUsers.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Click any user row to view details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Persona</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-blue-50/40 transition cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        user.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : user.role === 'educator'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 capitalize">
                    {user.userType || 'individual'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span title="Completed Checklists">✓ {user.completedChecklistsCount || 0}</span>
                      <span className="text-slate-300">|</span>
                      <span title="Completed Quizzes">🎯 {user.quizzesCompletedCount || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                      }}
                      className="text-[11px] font-semibold py-1 px-2.5 rounded-lg border-slate-200"
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal / Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {selectedUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedUser.displayName}</h3>
                  <p className="text-[11px] font-mono text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Account Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">UID</span>
                  <p className="font-mono text-[11px] text-slate-800 truncate">{selectedUser.uid}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Persona</span>
                  <p className="capitalize font-semibold text-slate-800">{selectedUser.userType || 'Individual'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Joined Date</span>
                  <p className="font-mono text-[11px] text-slate-800">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Account Status</span>
                  <p className="capitalize font-bold text-slate-800">{selectedUser.status}</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">Platform Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['member', 'educator', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        if (r !== selectedUser.role) {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Modify Platform Role',
                            message: `Are you sure you want to change the role of ${selectedUser.email} from ${selectedUser.role} to ${r}?`,
                            actionType: 'change-role',
                            newRole: r,
                          });
                        }
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition cursor-pointer ${
                        selectedUser.role === r
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block">Security Controls</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedUser.status === 'active' ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Disable User Account',
                          message: `Disabling this account will immediately revoke platform authentication for ${selectedUser.email}.`,
                          actionType: 'disable',
                        })
                      }
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-semibold py-2"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Disable Account
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Activate User Account',
                          message: `Re-enabling this account will restore authentication access for ${selectedUser.email}.`,
                          actionType: 'enable',
                        })
                      }
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs font-semibold py-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Reactivate Account
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Trigger Password Reset',
                        message: `Send an official Firebase password reset email to ${selectedUser.email}?`,
                        actionType: 'reset-pass',
                      })
                    }
                    className="text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold py-2"
                  >
                    <Key className="w-3.5 h-3.5 mr-1.5" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="text-xs font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">{confirmDialog.title}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="text-xs text-slate-600"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isProcessing}
                onClick={handleExecuteConfirmedAction}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isProcessing ? 'Applying...' : 'Confirm Action'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
