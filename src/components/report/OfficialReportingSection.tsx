import React from 'react';
import {
  Building2,
  Globe,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

export const OfficialReportingSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Access the Official Portal',
      desc: 'Visit https://cybercrime.gov.in/ directly from a secure web browser.',
    },
    {
      step: 2,
      title: 'Select Appropriate Category',
      desc: 'Choose "Report Financial Fraud" if money was debited, or "Report Other Cyber Crimes" for account hacking, harassment, or phishing.',
    },
    {
      step: 3,
      title: 'Citizen Registration / Mobile Login',
      desc: 'Authenticate with your state and mobile number using official SMS OTP. Anonymous reporting is also supported for cyber harassment.',
    },
    {
      step: 4,
      title: 'Enter Incident & Suspect Identifiers',
      desc: 'Paste your generated incident narrative and input the suspect phone number, URL, or beneficiary bank account.',
    },
    {
      step: 5,
      title: 'Upload Evidence & Save Acknowledgment',
      desc: 'Attach bank statement PDFs or screenshot captures (under 5MB). Once submitted, securely record your formal Complaint Acknowledgment Number.',
    },
  ];

  return (
    <section id="official-reporting-options" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Statutory Government Channels</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Reporting Options in India
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Statutory authorities empowered under the Information Technology Act to investigate incidents, direct banks to freeze fraud accounts, and prosecute offenders.
          </p>
        </div>

        {/* 3 Major Official Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: 1930 Helpline */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                  Emergency Line
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">24/7 National</span>
              </div>
              <div className="text-3xl font-black text-rose-600 font-mono tracking-tight">1930</div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                National Cyber Crime Reporting Helpline
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects directly to the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS). Coordinates instant interbank lien across sender and recipient accounts.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80">
              <a
                href="tel:1930"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-2 transition shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930 Helpline</span>
              </a>
            </div>
          </div>

          {/* Card 2: cybercrime.gov.in */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                  Central Portal
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Ministry of Home Affairs</span>
              </div>
              <div className="text-2xl font-black text-blue-700 font-mono tracking-tight truncate">
                cybercrime.gov.in
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                National Cyber Crime Reporting Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The apex national online portal for citizens to register formal cybercrime complaints. Transmits cases to concerned state police cyber cells for official FIR registration.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80">
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-2 transition shadow-xs"
              >
                <span>Open cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Sanchar Saathi & CERT-In */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Telecom & Technical
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">DoT / MeitY</span>
              </div>
              <div className="text-2xl font-black text-indigo-700 font-mono tracking-tight truncate">
                Sanchar Saathi
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                Chakshu & TAFCOP Telecom Portals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report fraudulent WhatsApp/SMS numbers on <strong>Chakshu</strong>, or check and disconnect unauthorized mobile SIM cards issued in your name on <strong>TAFCOP</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80">
              <a
                href="https://sancharsaathi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-2 transition shadow-xs"
              >
                <span>Visit Sanchar Saathi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough: How Filing on cybercrime.gov.in Works */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-slate-100 shadow-md space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
              Official Workflow
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Step-by-step: How to file on cybercrime.gov.in
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filing on the official portal takes approximately 10 to 15 minutes. Here is the exact statutory sequence:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            {steps.map((st) => (
              <div
                key={st.step}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                    {st.step}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{st.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
            <span>
              Always keep a physical or PDF copy of the Complaint Acknowledgment Number for your bank dispute.
            </span>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 shrink-0"
            >
              <span>Lodge Report on cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
