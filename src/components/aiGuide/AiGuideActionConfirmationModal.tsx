import React from 'react';
import { AlertTriangle, ExternalLink, PhoneCall, Check, X, ShieldAlert } from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';

export const AiGuideActionConfirmationModal: React.FC = () => {
  const { pendingActionConfirmation, confirmPendingAction, cancelPendingAction } = useAiGuide();

  if (!pendingActionConfirmation) return null;

  const isCall = pendingActionConfirmation.type === 'dial_helpline';
  const isExternal = pendingActionConfirmation.type === 'open_external_confirmed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCall ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isCall ? <PhoneCall className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {pendingActionConfirmation.confirmationTitle || 'Confirm Action'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {pendingActionConfirmation.confirmationMessage ||
                  'You are about to execute an external action. CyberSafe ensures you confirm before proceeding.'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>Action Target:</span>
              <span className="text-blue-700">{pendingActionConfirmation.label}</span>
            </div>
            {pendingActionConfirmation.payload.helplineNumber && (
              <div>Number: <strong className="text-slate-900">{pendingActionConfirmation.payload.helplineNumber}</strong></div>
            )}
            {pendingActionConfirmation.payload.externalUrl && (
              <div className="truncate text-slate-500 font-mono text-[11px]">
                {pendingActionConfirmation.payload.externalUrl}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={cancelPendingAction}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmPendingAction}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isCall ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCall ? <PhoneCall className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
            <span>Confirm & Proceed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
