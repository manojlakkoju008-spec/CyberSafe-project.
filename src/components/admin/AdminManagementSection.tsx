import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  X,
  Lock,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AdminUserRecord, AdminRole } from '../../types';

interface AdminManagementSectionProps {
  adminTeam: AdminUserRecord[];
  onInviteAdmin: (email: string, displayName: string, role: AdminRole) => Promise<void>;
  onUpdateRole: (uid: string, role: AdminRole) => Promise<void>;
  onToggleStatus: (uid: string, status: 'active' | 'suspended') => Promise<void>;
  currentAdminEmail: string;
}

export function AdminManagementSection({
  adminTeam,
  onInviteAdmin,
  onUpdateRole,
  onToggleStatus,
  currentAdminEmail,
}: AdminManagementSectionProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('CONTENT_EDITOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Role modification confirmation modal
  const [roleModalData, setRoleModalData] = useState<{
    admin: AdminUserRecord;
    newRole: AdminRole;
  } | null>(null);

  // Status toggle confirmation modal
  const [statusModalData, setStatusModalData] = useState<{
    admin: AdminUserRecord;
    targetStatus: 'active' | 'suspended';
  } | null>(null);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      setErrorMessage('Please enter a valid administrator email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onInviteAdmin(inviteEmail.trim(), inviteName.trim(), inviteRole);
      setSuccessMessage(`Administrator ${inviteEmail} has been provisioned.`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to provision administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!roleModalData) return;
    setIsSubmitting(true);
    try {
      await onUpdateRole(roleModalData.admin.uid, roleModalData.newRole);
      setSuccessMessage(`Role for ${roleModalData.admin.email} updated to ${roleModalData.newRole}.`);
      setRoleModalData(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Role change failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusModalData) return;
    setIsSubmitting(true);
    try {
      await onToggleStatus(statusModalData.admin.uid, statusModalData.targetStatus);
      setSuccessMessage(`Administrator ${statusModalData.admin.email} status changed to ${statusModalData.targetStatus}.`);
      setStatusModalData(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Status update failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Invite Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Privileged Administrator Registry</h3>
            <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
              Super Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Control platform role assignments, provision new staff administrators, or suspend access.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setIsInviteModalOpen(true);
            setErrorMessage(null);
          }}
          className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Provision Administrator
        </Button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Team Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Active Administrative Staff</h4>
          <span className="text-xs text-slate-400">{adminTeam.length} privileged accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned By</th>
                <th className="py-3 px-4">Assigned Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminTeam.map((admin) => {
                const isRoot = admin.role === 'SUPER_ADMIN';
                return (
                  <tr key={admin.uid} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{admin.displayName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{admin.email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          admin.role === 'SUPER_ADMIN'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : admin.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          admin.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">
                      {admin.assignedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(admin.assignedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {!isRoot ? (
                        <>
                          <select
                            value={admin.role}
                            onChange={(e) =>
                              setRoleModalData({
                                admin,
                                newRole: e.target.value as AdminRole,
                              })
                            }
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="CONTENT_EDITOR">CONTENT_EDITOR</option>
                            <option value="LOCATION_MANAGER">LOCATION_MANAGER</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="ANALYST">ANALYST</option>
                          </select>

                          {admin.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setStatusModalData({
                                  admin,
                                  targetStatus: 'suspended',
                                })
                              }
                              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] font-semibold py-1 px-2.5"
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setStatusModalData({
                                  admin,
                                  targetStatus: 'active',
                                })
                              }
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-[11px] font-semibold py-1 px-2.5"
                            >
                              Reactivate
                            </Button>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 italic">
                          Protected Root Account
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Admin Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Provision Administrator</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-800 block mb-1">Administrator Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="editor@cybersafe.org"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Devendra Patel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">RBAC Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                >
                  <option value="CONTENT_EDITOR">CONTENT_EDITOR (Guides, Methodologies, Quizzes)</option>
                  <option value="LOCATION_MANAGER">LOCATION_MANAGER (Nearby Help & Cyber Cells)</option>
                  <option value="MODERATOR">MODERATOR (Reports & Guidance Triage)</option>
                  <option value="ANALYST">ANALYST (Read-Only Analytics & Audits)</option>
                  <option value="ADMIN">ADMIN (Full Operational Management)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
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
                  {isSubmitting ? 'Provisioning...' : 'Provision Access'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleModalData && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Confirm Role Modification</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to alter the administrative privileges of <strong>{roleModalData.admin.email}</strong> to <strong>{roleModalData.newRole}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleModalData(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleConfirmRoleChange}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                Confirm Role Change
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Modal */}
      {statusModalData && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">
                {statusModalData.targetStatus === 'suspended' ? 'Suspend Administrator' : 'Reactivate Access'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {statusModalData.targetStatus === 'suspended'
                ? `Suspending ${statusModalData.admin.email} will immediately revoke their administrative session and block all privileged operations.`
                : `Restore administrative access for ${statusModalData.admin.email}?`}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusModalData(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleConfirmStatusToggle}
                className={`text-xs font-bold text-white ${
                  statusModalData.targetStatus === 'suspended'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
