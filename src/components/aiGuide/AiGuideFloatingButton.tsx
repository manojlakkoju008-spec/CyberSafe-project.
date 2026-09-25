import React from 'react';
import { Sparkles, Shield } from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';

export const AiGuideFloatingButton: React.FC = () => {
  const { isOpen, toggleGuide } = useAiGuide();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 group select-none">
      <button
        type="button"
        onClick={toggleGuide}
        className="flex items-center gap-2.5 bg-[#0B1F33] hover:bg-[#102C48] text-white px-4 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-150 border border-slate-700/80 cursor-pointer"
        title="Open CyberSafe AI Assistant"
        aria-label="Open CyberSafe AI Assistant"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1261A0] text-white shadow-xs">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold tracking-tight flex items-center gap-1.5 text-white">
            <span>CyberSafe AI Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#19A974]"></span>
          </div>
          <p className="text-[10px] text-slate-300 font-normal">Incident & Safety Guidance</p>
        </div>
        <span className="sm:hidden text-xs font-semibold pr-0.5">AI Help</span>
      </button>
    </div>
  );
};
