import React from 'react';
import { ShieldCheck, Info, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

export const CyberSafeDisclaimerSection: React.FC = () => {
  return (
    <section className="py-12 bg-slate-100 border-t border-slate-200 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                Statutory Boundary & Transparency
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                CyberSafe Role, Boundary & Public Service Notice
              </h3>
            </div>
          </div>

          {/* 4 Pillars of Boundary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Not Law Enforcement</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CyberSafe is an independent academic initiative. CyberSafe itself is NOT a police department, investigative agency, or tribunal.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Not a Government Portal</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CyberSafe is NOT the Ministry of Home Affairs or cybercrime.gov.in. All official legal complaints must be submitted directly on official portals.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Zero Direct Filing</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CyberSafe does NOT submit, register, forward, or process police FIRs or bank claims on behalf of victims.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Zero Outcome Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CyberSafe does NOT guarantee fund recovery, case resolution, or police response times. Recovery depends on statutory banking procedures.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              {INDIA_REPORTING_INFO.disclaimer}
            </span>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 font-bold inline-flex items-center gap-1 shrink-0"
            >
              <span>Visit cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
