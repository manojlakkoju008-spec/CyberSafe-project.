import React from 'react';
import { AlertCircle, X, ShieldAlert, WifiOff, Key, PhoneCall, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-base font-bold text-slate-900">
                Suspect an Active Security Incident?
              </h2>
              <p className="text-xs text-rose-700">Immediate first-response containment protocols</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Steps */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Urgent 1930 Callout */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs text-slate-400 font-bold uppercase">Financial Cyber Fraud Helpline (India)</div>
              <div className="text-xl font-extrabold text-rose-400">Dial 1930 Immediately</div>
            </div>
            <a
              href="tel:1930"
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Call 1930
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Stay calm. Immediate, methodical containment stops attackers from expanding unauthorized access:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cut Internet Connectivity</span>
                </div>
                If your computer or phone was infected with malware or remote access software, disconnect Wi-Fi and mobile data immediately.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Change Passwords from a Known Clean Device</span>
                </div>
                Use a separate trusted smartphone or laptop to reset your primary email and banking credentials. Revoke all active sessions.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>Alert Your Bank Customer Care</span>
                </div>
                If payment credentials, card numbers, or OTPs were compromised, call the bank fraud number on your debit card to freeze accounts.
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
            <span className="font-bold">Official Law Enforcement Reporting:</span>
            <p className="text-blue-800">
              Register formal complaints on the National Cyber Crime Reporting Portal (cybercrime.gov.in).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => {
              onClose();
              onNavigateToReport();
            }}
          >
            Open Incident Reporting Guide
          </Button>
        </div>
      </div>
    </div>
  );
};
