import React from 'react';
import { ShieldCheck, ExternalLink, PhoneCall, AlertTriangle, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { PageType } from '../../types';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Emergency Helpline Strip */}
      <div className="border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">CyberSafe Platform</div>
              <p className="text-xs text-slate-400">Cyber Safety Awareness and Cybercrime Prevention Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
              <span className="text-slate-400">Cybercrime Helpline:</span>
              <a href="tel:1930" className="text-rose-400 font-extrabold text-sm hover:underline">
                1930
              </a>
            </div>

            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <span>{INDIA_REPORTING_INFO.portalLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Tagline */}
        <div className="space-y-3 md:col-span-1">
          <div className="text-lg font-black tracking-tight text-white">CyberSafe</div>
          <p className="text-xs font-medium text-slate-300">
            "Practical cybersecurity awareness for everyday digital life."
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            An academic community project dedicated to digital resilience, scam recognition, and rapid incident containment for citizens, students, and families.
          </p>
        </div>

        {/* Primary Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Platform Features</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('learn')} 
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Learn: Threat Guides & Basics
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('prevent')} 
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Prevent: Personal Safety Checklist
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('detect')} 
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Detect: Check Before You Click (URL)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('report')} 
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Report: Official Channels & Containment
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('quiz')} 
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Quiz: Can You Spot the Scam?
              </button>
            </li>
          </ul>
        </div>

        {/* Institutional & Legal Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Policy & Scope</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('privacy')} 
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Architecture</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('disclaimer')} 
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Disclaimer & Boundaries</span>
              </button>
            </li>
            <li>
              <a 
                href={INDIA_REPORTING_INFO.portalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-slate-400"
              >
                <span>National Cyber Crime Portal (India)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Mandatory Explicit Disclaimers Column */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Public Safety Disclaimer</h4>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>"CyberSafe is an educational and assistance platform. It is not a government agency and does not replace official reporting systems, law enforcement, emergency services or professional legal advice."</strong>
            </p>
            <p className="text-[11px] text-slate-400 border-t border-slate-700 pt-1.5">
              <strong>"A heuristic URL assessment cannot guarantee that a website is safe or malicious."</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} CyberSafe • Academic Community Project for Cyber Safety Awareness and Cybercrime Prevention.
        </p>
      </div>
    </footer>
  );
};
