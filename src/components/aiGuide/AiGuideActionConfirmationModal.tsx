import React from 'react';
import { ExternalLink, PhoneCall, ShieldAlert } from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';

export const AiGuideActionConfirmationModal: React.FC = () => {
  const { pendingActionConfirmation, confirmPendingAction, cancelPendingAction } = useAiGuide();

  if (!pendingActionConfirmation) return null;

  const isCall = pendingActionConfirmation.type === 'dial_helpline';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#E5E7EB] overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isCall ? 'bg-amber-100 text-amber-800' : 'bg-[#EBF5FB] text-[#1261A0]'
            }`}>
              {isCall ? <PhoneCall className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1F33]">
                {pendingActionConfirmation.confirmationTitle || 'Confirm Action'}
              </h3>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed font-normal">
                {pendingActionConfirmation.confirmationMessage ||
                  'You are about to execute an external action. CyberSafe ensures you confirm before proceeding.'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5E7EB] text-xs text-[#14202B] space-y-1">
            <div className="font-semibold text-[#0B1F33] flex items-center gap-1.5">
              <span>Action Target:</span>
              <span className="text-[#1261A0]">{pendingActionConfirmation.label}</span>
            </div>
            {pendingActionConfirmation.payload.helplineNumber && (
              <div>Number: <strong className="text-[#0B1F33]">{pendingActionConfirmation.payload.helplineNumber}</strong></div>
            )}
            {pendingActionConfirmation.payload.externalUrl && (
              <div className="truncate text-[#667085] font-mono text-[11px]">
                {pendingActionConfirmation.payload.externalUrl}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#F7F9FC] px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={cancelPendingAction}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#667085] hover:text-[#0B1F33] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmPendingAction}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isCall ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1261A0] hover:bg-[#0E4D80]'
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
