export type PageType = 
  | 'home' 
  | 'learn' 
  | 'prevent' 
  | 'detect' 
  | 'report' 
  | 'quiz' 
  | 'privacy' 
  | 'disclaimer'
  | 'auth'
  | 'admin'
  | 'profile';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// ==========================================
// WORKSTREAM 2 & 3: USER & AUTH ARCHITECTURE
// ==========================================
export type UserRole = 'admin' | 'educator' | 'member' | 'guest';

export interface UserQuizRecord {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  completedAt: string;
  category: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  userType?: 'student' | 'individual' | 'senior' | 'educator';
  completedChecklistIds: string[];
  quizHistory: UserQuizRecord[];
  savedThreatIds: string[];
  savedBasicIds: string[];
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// WORKSTREAM 4: LEARNING RESOURCES & METHODOLOGIES
// ==========================================
export interface ThreatItem {
  id: string;
  title: string;
  category: string;
  severity: SeverityLevel;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  redFlags: string[];
  realExample: string;
  actionSteps: string[];
  preventionTips: string[];
  frameworkMappings?: {
    nistCsf?: string; // e.g., 'PR.AC - Identity Management & Access Control'
    cisControl?: string; // e.g., 'CIS Control 6: Access Control Management'
    owaspRef?: string;
  };
  lastUpdated?: string;
}

export interface SafetyBasic {
  id: string;
  title: string;
  category: string;
  iconName: string;
  summary: string;
  detail: string;
  checklist: string[];
  commonPitfall: string;
  quickStat: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SecurityMethodologyGuide {
  id: string;
  title: string;
  standard: 'NIST CSF 2.0' | 'CIS Controls v8' | 'Zero Trust for Citizens' | 'Digital Hygiene Lifecycle';
  summary: string;
  targetAudience: string;
  phases: {
    phaseName: string;
    description: string;
    actionItems: string[];
  }[];
}

// ==========================================
// WORKSTREAM 5: PREVENTION & PERSONALIZED GUIDANCE
// ==========================================
export interface ChecklistItem {
  id: string;
  category: 'accounts' | 'devices' | 'network' | 'privacy';
  title: string;
  description: string;
  impact: 'essential' | 'recommended' | 'advanced';
  estimatedMinutes: number;
  whyItMatters: string;
  howToGuide: string;
  verificationQuestion?: string;
}

export interface PersonaSafetyRecommendation {
  personaId: 'student' | 'remote-worker' | 'senior' | 'parent';
  personaTitle: string;
  description: string;
  primaryRisks: string[];
  recommendedChecklistIds: string[];
  recommendedGuideIds: string[];
}

// ==========================================
// WORKSTREAM 6: ADVANCED DETECTION FUNCTIONALITY
// ==========================================
export interface UrlIndicator {
  name: string;
  status: 'positive' | 'warning' | 'risk';
  description: string;
  impactPoints: number;
  iconType: 'check' | 'alert' | 'danger';
}

export interface UrlScanAssessment {
  rawInput: string;
  isValid: boolean;
  protocol: string;
  hostname: string;
  pathname: string;
  isHttps: boolean;
  isIpAddress: boolean;
  hasAtSymbol: boolean;
  subdomainCount: number;
  isPunycode: boolean;
  hasSuspiciousKeywords: boolean;
  suspiciousKeywordsFound: string[];
  hasExcessiveParams: boolean;
  hasSuspiciousEncoding: boolean;
  urlLength: number;
  hostnameLength: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  indicators: UrlIndicator[];
  explanation: string;
  recommendations: string[];
  errorMessage?: string;
  scannedAt?: string;
}

export interface SmishingMessageAssessment {
  rawMessage: string;
  extractedUrls: string[];
  urgencyLevel: 'low' | 'moderate' | 'high' | 'critical';
  suspiciousPhonePatterns: boolean;
  financialKeywordsFound: string[];
  threatIndicators: string[];
  riskScore: number;
  recommendation: string;
}

// ==========================================
// WORKSTREAM 7: REPORTING & EMERGENCY HELPER
// ==========================================
export interface CybercrimeCategory {
  id: string;
  title: string;
  iconName: string;
  tagline: string;
  whatHappened: string[];
  evidenceToPreserve: string[];
  immediateSafetySteps: string[];
  whereToReport: {
    name: string;
    description: string;
    url?: string;
    helpline?: string;
    isOfficialGov?: boolean;
  }[];
}

export interface IncidentReportDraft {
  incidentType: string;
  dateOfOccurrence: string;
  financialLossAmount?: string;
  suspectIdentifiers: {
    phoneNumber?: string;
    emailAddress?: string;
    websiteUrl?: string;
    socialMediaHandle?: string;
    bankAccountOrUpi?: string;
    transactionReferenceId?: string;
  };
  narrativeDescription: string;
  evidencePreservedSummary: string[];
  targetReportingAgency: string;
}

// ==========================================
// WORKSTREAM 8: EXPANDED QUIZ SYSTEM
// ==========================================
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  topic: string;
  scenario: string;
  question: string;
  options: QuizOption[];
  warningSigns: string[];
  takeaway: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizModule {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  estimatedMinutes: number;
  questions: QuizQuestion[];
}

// ==========================================
// WORKSTREAM 3: ADMIN & CONTENT MANAGEMENT
// ==========================================
export interface ContentAuditLog {
  id: string;
  adminId: string;
  action: 'create' | 'update' | 'delete' | 'publish';
  entityType: 'threat' | 'basic' | 'quiz_question' | 'category';
  entityId: string;
  timestamp: string;
  changeSummary: string;
}
