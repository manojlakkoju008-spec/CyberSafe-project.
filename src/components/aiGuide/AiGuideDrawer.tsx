import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  X,
  RotateCcw,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowRight
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-10 w-full sm:w-[480px] lg:w-[520px] bg-slate-50 h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-white">CyberSafe AI Guide</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Assistant
                </span>
              </div>
              <p className="text-xs text-slate-300">Your cybersecurity awareness and incident guide.</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearConversation}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={closeGuide}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calm Context Status Bar */}
        <div className="bg-slate-800/90 text-slate-300 px-5 py-1.5 text-[11px] flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active Context:</span>
            <span className="font-semibold text-white">{getPageContextLabel()}</span>
          </div>
          <span className="text-[10px] text-slate-400">Calm guidance mode</span>
        </div>

        {/* Scrollable Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <AiGuideMessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-[85%] text-slate-600">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
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
        <div className="bg-white border-t border-slate-200 p-3.5 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what happened or ask a security question..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition-all cursor-pointer shadow-xs ${
                inputVal.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Academic & Emergency Legal Boundary Notice */}
          <div className="mt-2 text-[10px] text-slate-400 text-center leading-tight">
            CyberSafe AI Guide assists with safety awareness and incident readiness. For active financial cybercrime in India, dial <strong className="text-slate-600">1930</strong> or file at <strong className="text-slate-600">cybercrime.gov.in</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
