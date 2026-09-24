import React from 'react';
import { Bot, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';

export const AiGuideFloatingButton: React.FC = () => {
  const { isOpen, toggleGuide, activeContextPage } = useAiGuide();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 group select-none">
      <button
        onClick={toggleGuide}
        className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30 cursor-pointer backdrop-blur-sm"
        title="Open CyberSafe AI Guide"
        aria-label="Open CyberSafe AI Guide"
      >
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-blue-600/80 text-white shadow-inner">
          <Shield className="w-4 h-4 text-blue-200" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span>CyberSafe AI Guide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-blue-200/90 font-medium">Incident & Safety Assistance</p>
        </div>
        <span className="sm:hidden text-xs font-bold pr-0.5">AI Guide</span>
      </button>
    </div>
  );
};
