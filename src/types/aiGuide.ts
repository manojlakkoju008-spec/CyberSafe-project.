import { PageType, QuizCategory } from './index';

export type AiGuideIntent =
  | 'LEARNING'
  | 'PREVENTION'
  | 'SUSPICIOUS_URL'
  | 'PHISHING'
  | 'FINANCIAL_FRAUD'
  | 'ACCOUNT_COMPROMISE'
  | 'SOCIAL_MEDIA_ABUSE'
  | 'IDENTITY_THEFT'
  | 'MALWARE'
  | 'RANSOMWARE'
  | 'CYBERSTALKING'
  | 'ONLINE_HARASSMENT'
  | 'PRIVACY'
  | 'PASSWORD_SECURITY'
  | 'MFA'
  | 'DEVICE_SECURITY'
  | 'REPORTING'
  | 'EMERGENCY'
  | 'GENERAL_CYBERSECURITY'
  | 'UNKNOWN';

export type AiGuideActionType =
  | 'navigate_detect'
  | 'navigate_report'
  | 'navigate_learn'
  | 'navigate_prevent'
  | 'navigate_quiz'
  | 'navigate_nearby'
  | 'open_external_confirmed'
  | 'dial_helpline';

export interface AiGuideActionPayload {
  url?: string;
  incidentId?: string;
  searchQuery?: string;
  areaId?: string;
  category?: QuizCategory | string;
  externalUrl?: string;
  helplineNumber?: string;
  helplineLabel?: string;
}

export interface AiGuideAction {
  id: string;
  type: AiGuideActionType;
  label: string;
  iconName?: string;
  description?: string;
  payload: AiGuideActionPayload;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  badge?: string;
}

export interface OfficialReportingOption {
  name: string;
  helpline?: string;
  url?: string;
  notes?: string;
  isOfficialGov?: boolean;
}

export interface StructuredIncidentGuidance {
  whatHappened?: string;
  immediateActions: string[];
  whatToAvoid: string[];
  evidenceToPreserve: string[];
  officialReporting: OfficialReportingOption[];
  learningRecommendation?: string;
  urgencyLevel?: 'critical' | 'high' | 'moderate' | 'informational';
}

export interface AiGuideMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: AiGuideIntent;
  structuredGuidance?: StructuredIncidentGuidance;
  suggestedActions?: AiGuideAction[];
  contextPage?: PageType;
}

export interface AiGuideRequest {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  contextPage?: PageType;
  userMetadata?: {
    isAuthenticated?: boolean;
    displayName?: string;
  };
}

export interface AiGuideResponse {
  intent: AiGuideIntent;
  reply: string;
  structuredGuidance?: StructuredIncidentGuidance;
  suggestedActions: AiGuideAction[];
  engineUsed: 'gemini-3.8-flash' | 'cybersafe-expert-fallback';
}
