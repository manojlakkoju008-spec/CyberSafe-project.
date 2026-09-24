import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { GUIDED_ACTION_FLOWS, INDIA_REPORTING_INFO } from '../../data/reportData';

interface ImmediateHelpStripProps {
  onSelectCategory?: (categoryId: string) => void;
}

export const ImmediateHelpStrip: React.FC<ImmediateHelpStripProps> = ({ onSelectCategory }) => {
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);

  const toggleFlow = (flowId: string) => {
    setActiveFlowId((prev) => (prev === flowId ? null : flowId));
  };

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>Immediate Help & Emergency Dispatch</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct emergency contacts and fast-track guidance for active cyber incidents.
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
            24/7 Emergency Line Active
          </span>
        </div>

        {/* 3 Core Emergency Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 1930 Helpline */}
          <div className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-xs hover:border-rose-300 transition space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                Financial Cyber Fraud
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                <Clock className="w-3.5 h-3.5" />
                <span>Golden Hour</span>
              </span>
            </div>

            <div>
              <div className="text-3xl font-black text-rose-600 font-mono tracking-tight">1930</div>
              <div className="text-sm font-bold text-slate-900">National Cyber Crime Helpline</div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Toll-free emergency line operated by the Indian Cyber Crime Coordination Centre (I4C). Directly freezes debited funds across interbank beneficiary accounts.
              </p>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <a
                href="tel:1930"
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930 Now</span>
              </a>
            </div>
          </div>

          {/* Card 2: 112 Emergency Police */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">
                Urgent Physical Safety
              </span>
              <span className="text-[11px] font-bold text-slate-500">All States</span>
            </div>

            <div>
              <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">112</div>
              <div className="text-sm font-bold text-slate-900">National Emergency Response</div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Unified emergency helpline for real-world physical danger, urgent extortion, in-person stalking, physical harassment, or immediate police dispatch.
              </p>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <a
                href="tel:112"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112 Emergency</span>
              </a>
            </div>
          </div>

          {/* Card 3: cybercrime.gov.in */}
          <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-xs hover:border-blue-300 transition space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                Official Government Portal
              </span>
              <span className="text-[11px] font-bold text-blue-700">MHA India</span>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono tracking-tight truncate">
                cybercrime.gov.in
              </div>
              <div className="text-sm font-bold text-slate-900">Statutory Online Filing</div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Official Government of India portal for filing legal cybercrime complaints, obtaining official FIR acknowledgements, and tracking case progress.
              </p>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <span>Open Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Rapid "What Happened?" Crisis Guides */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Fast Response Playbooks:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {GUIDED_ACTION_FLOWS.map((flow) => {
              const isExpanded = activeFlowId === flow.id;
              return (
                <div
                  key={flow.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFlow(flow.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">
                        {flow.badge}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {flow.title}
                      </h3>
                    </div>
                    <div className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
                      <div className="space-y-2">
                        {flow.steps.map((st) => (
                          <div key={st.step} className="flex items-start gap-2.5 text-xs">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {st.step}
                            </span>
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900">{st.action}</span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{st.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {onSelectCategory && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              const targetId =
                                flow.id === 'money-lost'
                                  ? 'financial-fraud'
                                  : flow.id === 'suspicious-link'
                                  ? 'phishing'
                                  : 'account-hacking';
                              onSelectCategory(targetId);
                            }}
                            className="text-xs text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Explore detailed category guide & evidence steps</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
