import React from 'react';
import { ShieldCheck, ExternalLink, Lock, FileText } from 'lucide-react';
import { PageType } from '../../types';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1F33] text-slate-300 text-sm border-t border-slate-800">
      {/* Emergency Helpline Strip */}
      <div className="border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1261A0]/20 text-[#2878B5] border border-[#1261A0]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#19A974]" />
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-tight">CyberSafe Platform</div>
              <p className="text-xs text-slate-400">Cyber Safety Awareness & Cybercrime Prevention Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-[#102C48] px-3.5 py-2 rounded-lg border border-slate-700/80 flex items-center gap-2">
              <span className="text-slate-300 font-medium">National Cybercrime Helpline:</span>
              <a href="tel:1930" className="text-[#DC3545] font-extrabold text-sm hover:underline">
                1930
              </a>
            </div>

            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1261A0] hover:bg-[#0E4D80] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{INDIA_REPORTING_INFO.portalLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Purpose */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Cyber<span className="text-[#2878B5]">Safe</span></span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            "Calm, practical cybersecurity guidance for everyday digital life."
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            An academic community project dedicated to digital resilience, scam recognition, and rapid incident containment for citizens, students, and families.
          </p>
        </div>

        {/* Primary Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Platform Tools</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('learn')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                Learn: Threat Blueprints & Safety Basics
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('prevent')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                Prevent: 16-Point Safety Health Checklist
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('detect')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                Detect: URL & Message Threat Scanner
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('report')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                Report: Containment & Nearby Assistance
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('quiz')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                Quiz: Scam Recognition Assessment
              </button>
            </li>
          </ul>
        </div>

        {/* Institutional & Legal Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Policy & Governance</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('privacy')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#19A974]" />
                <span>Zero-Logging Privacy Architecture</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => onNavigate('disclaimer')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Disclaimer & Educational Boundaries</span>
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
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Public Safety Notice</h4>
          <div className="p-4 rounded-xl bg-[#102C48] border border-slate-700/80 text-xs text-slate-300 leading-relaxed space-y-2.5">
            <p>
              <strong>CyberSafe is an educational and public assistance platform. It is not a law enforcement agency and does not replace official police reporting systems, emergency services, or professional legal counsel.</strong>
            </p>
            <p className="text-[11px] text-slate-400 border-t border-slate-700/80 pt-2">
              A heuristic URL or message scan is advisory and cannot guarantee that an external web resource is safe or malicious.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} CyberSafe • Academic Community Project for Cyber Safety Awareness and Cybercrime Prevention.
        </p>
      </div>
    </footer>
  );
};
