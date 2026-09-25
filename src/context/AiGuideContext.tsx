import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { PageType } from '../types';
import { AiGuideMessage, AiGuideAction } from '../types/aiGuide';
import { askAiGuide } from '../services/aiGuideService';

interface AiGuideContextValue {
  isOpen: boolean;
  openGuide: (initialPrompt?: string) => void;
  closeGuide: () => void;
  toggleGuide: () => void;
  messages: AiGuideMessage[];
  isLoading: boolean;
  activeContextPage: PageType;
  setActiveContextPage: (page: PageType) => void;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  pendingActionConfirmation: AiGuideAction | null;
  requestActionExecution: (action: AiGuideAction) => void;
  confirmPendingAction: () => void;
  cancelPendingAction: () => void;
  executeDirectAction: (action: AiGuideAction) => void;
  onNavigate?: (page: PageType, queryOrIncidentId?: string, url?: string, areaId?: string, category?: string) => void;
  setOnNavigate: (fn: (page: PageType, queryOrIncidentId?: string, url?: string, areaId?: string, category?: string) => void) => void;
}

const AiGuideContext = createContext<AiGuideContextValue | undefined>(undefined);

const INITIAL_WELCOME_MESSAGE: AiGuideMessage = {
  id: 'welcome-0',
  role: 'assistant',
  content: "Hi, I'm CyberSafe AI Guide.\n\nI can help you understand a suspicious situation, learn cybersecurity, analyze what to do next, or find the right CyberSafe tool.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  intent: 'GENERAL_CYBERSECURITY',
  suggestedActions: [
    {
      id: 'welcome-something-happened',
      type: 'navigate_report',
      label: 'Something happened to me',
      description: 'Emergency triage and incident containment',
      payload: { incidentId: 'financial-fraud' },
    },
    {
      id: 'welcome-check-link',
      type: 'navigate_detect',
      label: 'Check a suspicious link',
      description: 'Inspect URLs safely with CyberSafe Detect',
      payload: {},
    },
    {
      id: 'welcome-learn',
      type: 'navigate_learn',
      label: 'Learn cybersecurity',
      description: 'Explore frameworks and defensive concepts',
      payload: {},
    },
    {
      id: 'welcome-report',
      type: 'navigate_report',
      label: 'Report an incident',
      description: 'Evidence readiness and official reporting routes',
      payload: {},
    },
    {
      id: 'welcome-nearby',
      type: 'navigate_nearby',
      label: 'Find nearby help',
      description: 'Locate local police and cyber cells',
      payload: { searchQuery: 'cyber' },
    },
    {
      id: 'welcome-prevent',
      type: 'navigate_prevent',
      label: 'Improve my security',
      description: 'Personalized checklists and defense methods',
      payload: { areaId: 'passwords' },
    },
  ],
};

const STORAGE_KEY = 'cybersafe_ai_guide_messages';

export const AiGuideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeContextPage, setActiveContextPage] = useState<PageType>('home');
  const [pendingActionConfirmation, setPendingActionConfirmation] = useState<AiGuideAction | null>(null);
  const onNavigateRef = useRef<
    ((page: PageType, queryOrIncidentId?: string, url?: string, areaId?: string, category?: string) => void) | null
  >(null);

  const setOnNavigate = useCallback(
    (fn: (page: PageType, queryOrIncidentId?: string, url?: string, areaId?: string, category?: string) => void) => {
      onNavigateRef.current = fn;
    },
    []
  );

  const [messages, setMessages] = useState<AiGuideMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const openGuide = (initialPrompt?: string) => {
    setIsOpen(true);
    if (initialPrompt && initialPrompt.trim()) {
      sendMessage(initialPrompt.trim());
    }
  };

  const closeGuide = () => {
    setIsOpen(false);
  };

  const toggleGuide = () => {
    setIsOpen((prev) => !prev);
  };

  const clearConversation = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const executeDirectAction = (action: AiGuideAction) => {
    if (!onNavigateRef.current) return;

    switch (action.type) {
      case 'navigate_detect':
        onNavigateRef.current('detect', undefined, action.payload.url);
        break;
      case 'navigate_report':
        onNavigateRef.current('report', action.payload.incidentId, action.payload.url);
        break;
      case 'navigate_learn':
        onNavigateRef.current('learn', action.payload.searchQuery);
        break;
      case 'navigate_prevent':
        onNavigateRef.current('prevent', action.payload.searchQuery, undefined, action.payload.areaId);
        break;
      case 'navigate_quiz':
        onNavigateRef.current('quiz', action.payload.category as string);
        break;
      case 'navigate_nearby':
        onNavigateRef.current('report', 'nearby');
        break;
      case 'open_external_confirmed':
        if (action.payload.externalUrl) {
          window.open(action.payload.externalUrl, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'dial_helpline':
        if (action.payload.helplineNumber) {
          window.location.href = `tel:${action.payload.helplineNumber}`;
        }
        break;
    }
  };

  const requestActionExecution = (action: AiGuideAction) => {
    if (action.requiresConfirmation) {
      setPendingActionConfirmation(action);
    } else {
      executeDirectAction(action);
    }
  };

  const confirmPendingAction = () => {
    if (pendingActionConfirmation) {
      executeDirectAction(pendingActionConfirmation);
      setPendingActionConfirmation(null);
    }
  };

  const cancelPendingAction = () => {
    setPendingActionConfirmation(null);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AiGuideMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextPage: activeContextPage,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      // Map history for context
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const response = await askAiGuide({
        message: trimmed,
        conversationHistory: history,
        contextPage: activeContextPage,
      });

      const assistantMsg: AiGuideMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        structuredGuidance: response.structuredGuidance,
        suggestedActions: response.suggestedActions,
        contextPage: activeContextPage,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback message if totally failed
      const errorMsg: AiGuideMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "I ran into an issue connecting to the reasoning service, but you can always inspect URLs directly in CyberSafe Detect or organize an official complaint in Report.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          {
            id: 'err-detect',
            type: 'navigate_detect',
            label: 'Open CyberSafe Detect',
            payload: {},
          },
          {
            id: 'err-report',
            type: 'navigate_report',
            label: 'Open Incident Report Guide',
            payload: { incidentId: 'financial-fraud' },
          },
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AiGuideContext.Provider
      value={{
        isOpen,
        openGuide,
        closeGuide,
        toggleGuide,
        messages,
        isLoading,
        activeContextPage,
        setActiveContextPage,
        sendMessage,
        clearConversation,
        pendingActionConfirmation,
        requestActionExecution,
        confirmPendingAction,
        cancelPendingAction,
        executeDirectAction,
        setOnNavigate,
      }}
    >
      {children}
    </AiGuideContext.Provider>
  );
};

export function useAiGuide() {
  const context = useContext(AiGuideContext);
  if (!context) {
    throw new Error('useAiGuide must be used within an AiGuideProvider');
  }
  return context;
}
