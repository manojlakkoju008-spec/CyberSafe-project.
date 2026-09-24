import React, { useState } from 'react';
import {
  Shield,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  BookOpen,
  ArrowRight,
  Search,
  CheckSquare,
  HelpCircle,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Phone
} from 'lucide-react';
import { AiGuideMessage, AiGuideAction } from '../../types/aiGuide';
import { useAiGuide } from '../../context/AiGuideContext';

interface AiGuideMessageBubbleProps {
  message: AiGuideMessage;
}

export const AiGuideMessageBubble: React.FC<AiGuideMessageBubbleProps> = ({ message }) => {
  const { requestActionExecution } = useAiGuide();
  const isUser = message.role === 'user';
  const [showFullGuidance, setShowFullGuidance] = useState(true);

  const renderActionIcon = (type: string) => {
    switch (type) {
      case 'navigate_detect':
        return <Search className="w-3.5 h-3.5 text-blue-600" />;
      case 'navigate_report':
        return <FileText className="w-3.5 h-3.5 text-rose-600" />;
      case 'navigate_nearby':
        return <Building className="w-3.5 h-3.5 text-emerald-600" />;
      case 'navigate_learn':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600" />;
      case 'navigate_prevent':
        return <CheckSquare className="w-3.5 h-3.5 text-teal-600" />;
      case 'navigate_quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'dial_helpline':
        return <PhoneCall className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          <div className="text-[10px] text-blue-200 text-right mt-1.5 font-medium">{message.timestamp}</div>
        </div>
      </div>
    );
  }

  const structured = message.structuredGuidance;

  return (
    <div className="flex gap-3 mb-5 max-w-[95%]">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 border border-slate-700">
        <Shield className="w-4 h-4 text-blue-400" />
      </div>

      <div className="flex-1 space-y-3">
        {/* Main Response Container */}
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs text-slate-800 text-xs sm:text-sm">
          {/* Main Answer Text */}
          <div className="prose prose-sm prose-slate max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Structured Guidance Collapsible / Expandable Section */}
          {structured && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Structured Incident Protocol</span>
                </span>
                <button
                  onClick={() => setShowFullGuidance(!showFullGuidance)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>{showFullGuidance ? 'Collapse' : 'Expand Protocol'}</span>
                  {showFullGuidance ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showFullGuidance && (
                <div className="space-y-3 pt-1">
                  {/* Immediate Actions */}
                  {structured.immediateActions && structured.immediateActions.length > 0 && (
                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                      <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Immediate Actions To Take</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                        {structured.immediateActions.map((action, idx) => (
                          <li key={idx} className="leading-snug pl-1">
                            <span className="text-slate-800 font-medium">{action}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* What to Avoid */}
                  {structured.whatToAvoid && structured.whatToAvoid.length > 0 && (
                    <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3">
                      <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>What NOT To Do (Avoid Secondary Harm)</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                        {structured.whatToAvoid.map((item, idx) => (
                          <li key={idx} className="leading-snug pl-1">
                            <span className="text-slate-800 font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evidence to Preserve */}
                  {structured.evidenceToPreserve && structured.evidenceToPreserve.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Evidence To Preserve For Authorities</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                        {structured.evidenceToPreserve.map((ev, idx) => (
                          <li key={idx} className="leading-snug pl-1">
                            <span className="text-slate-800">{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Official Reporting Routes */}
                  {structured.officialReporting && structured.officialReporting.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <Building className="w-3.5 h-3.5 text-slate-700" />
                        <span>Official Reporting Channels</span>
                      </div>
                      <div className="space-y-2">
                        {structured.officialReporting.map((route, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-white border border-slate-200">
                            <div>
                              <span className="font-bold text-slate-900">{route.name}</span>
                              {route.notes && <p className="text-[11px] text-slate-500">{route.notes}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {route.helpline && (
                                <button
                                  onClick={() =>
                                    requestActionExecution({
                                      id: `call-${route.helpline}`,
                                      type: 'dial_helpline',
                                      label: `Call ${route.helpline}`,
                                      payload: { helplineNumber: route.helpline },
                                      requiresConfirmation: true,
                                      confirmationTitle: `Call Helpline ${route.helpline}`,
                                      confirmationMessage: `You are about to dial ${route.helpline} (${route.name}).`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] hover:bg-amber-200 transition-colors cursor-pointer"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Call {route.helpline}</span>
                                </button>
                              )}
                              {route.url && (
                                <button
                                  onClick={() =>
                                    requestActionExecution({
                                      id: `link-${idx}`,
                                      type: 'open_external_confirmed',
                                      label: route.name,
                                      payload: { externalUrl: route.url },
                                      requiresConfirmation: true,
                                      confirmationTitle: 'Open Official Government Portal',
                                      confirmationMessage: `You are opening ${route.url}. Always verify the lock icon and official domain.`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Portal</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-right mt-2">{message.timestamp}</div>
        </div>

        {/* Suggested Action Chips / Buttons */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-600 px-1">Recommended CyberSafe Actions:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.suggestedActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => requestActionExecution(action)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-left transition-all duration-150 cursor-pointer shadow-xs group"
                >
                  <div className="flex items-start gap-2 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {renderActionIcon(action.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                        {action.label}
                      </div>
                      {action.description && (
                        <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
