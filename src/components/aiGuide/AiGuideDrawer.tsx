import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  X,
  RotateCcw,
  Send,
  Loader2,
} from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';
import { AiGuideMessageBubble } from './AiGuideMessageBubble';
import { AiGuideQuickSuggestions } from './AiGuideQuickSuggestions';

export const AiGuideDrawer: React.FC = () => {
  const {
    isOpen,
    closeGuide,
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    activeContextPage,
  } = useAiGuide();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [isOpen, messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const text = inputVal;
    setInputVal('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const getPageContextLabel = () => {
    switch (activeContextPage) {
      case 'detect':
        return 'Detect (URL & Link Scanner)';
      case 'report':
        return 'Report (Incident Guidance & Evidence)';
      case 'learn':
        return 'Learn (Concepts & Methodologies)';
      case 'prevent':
        return 'Prevent (Personalized Checklists)';
      case 'quiz':
        return 'Quiz (Interactive Practice)';
      case 'home':
        return 'Home';
      default:
        return activeContextPage;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop on mobile */}
      <div
        onClick={closeGuide}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-150"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-10 w-full sm:w-[480px] lg:w-[520px] bg-[#F7F9FC] h-full flex flex-col shadow-xl border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#0B1F33] text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1261A0] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">CyberSafe AI Assistant</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-blue-200 border border-slate-700">
                  Assistant
                </span>
              </div>
              <p className="text-xs text-slate-300">Calm cybersecurity guidance & incident readiness.</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearConversation}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeGuide}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calm Context Status Bar */}
        <div className="bg-[#102C48] text-slate-300 px-6 py-1.5 text-[11px] flex items-center justify-between border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#19A974]"></span>
            <span>Active Context:</span>
            <span className="font-semibold text-white">{getPageContextLabel()}</span>
          </div>
          <span className="text-[10px] text-slate-400">Calm guidance mode</span>
        </div>

        {/* Scrollable Messages Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <AiGuideMessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs max-w-[85%] text-[#667085]">
              <Loader2 className="w-4 h-4 text-[#1261A0] animate-spin shrink-0" />
              <div className="text-xs font-medium">
                Evaluating cybersecurity situation & preparing structured guidance...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions based on context */}
        <AiGuideQuickSuggestions />

        {/* Input Bar */}
        <div className="bg-white border-t border-[#E5E7EB] p-4 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what happened or ask a security question..."
              className="flex-1 bg-[#F7F9FC] border border-[#E5E7EB] focus:border-[#1261A0] focus:bg-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors text-[#14202B] placeholder:text-[#667085]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className={`p-2.5 rounded-lg text-white transition-colors cursor-pointer shadow-xs ${
                inputVal.trim() && !isLoading
                  ? 'bg-[#1261A0] hover:bg-[#0E4D80]'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Academic & Emergency Legal Boundary Notice */}
          <div className="mt-2 text-[10px] text-[#667085] text-center leading-tight">
            CyberSafe AI Assistant provides educational awareness and incident triage. For active financial cybercrime in India, dial <strong className="text-[#0B1F33]">1930</strong> or report at <strong className="text-[#0B1F33]">cybercrime.gov.in</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
