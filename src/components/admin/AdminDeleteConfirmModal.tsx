import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../common/Button';

interface AdminDeleteConfirmModalProps {
  isOpen: boolean;
  itemTitle: string;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  isOpen,
  itemTitle,
  itemType,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">Accidental Deletion Prevention</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Are you sure you want to permanently delete the {itemType}:
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 mb-6 break-words">
          "{itemTitle}"
        </div>

        <p className="text-xs text-rose-600 font-medium mb-6">
          Warning: This content will be removed from the public curriculum and database.
        </p>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting} className="text-xs">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-xs flex items-center gap-1.5"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
