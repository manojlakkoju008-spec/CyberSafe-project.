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
  status?: 'published' | 'draft';
  updatedAt?: string;
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
  status?: 'published' | 'draft';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SecurityMethodologyGuide {
  id: string;
  title: string;
  standard: 'NIST CSF 2.0' | 'CIS Controls v8' | 'Zero Trust for Citizens' | 'Digital Hygiene Lifecycle';
  summary: string;
  targetAudience: string;
  category?: string;
  status?: 'published' | 'draft';
  updatedAt?: string;
  phases: {
    phaseName: string;
    description: string;
    actionItems: string[];
  }[];
}

export type ResourceType = 'all' | 'deep-guide' | 'quick-guide' | 'methodology' | 'scenario' | 'checklist';

export interface PracticalMethodology {
  id: string;
  title: string;
  acronym: string;
  shortTagline: string;
  category: string;
  whenToUse: string;
  steps: {
    stepLabel: string;
    actionTitle: string;
    description: string;
    practicalExample: string;
    pitfallToAvoid: string;
  }[];
  whyItWorks: string;
  relatedThreatIds: string[];
}

export interface AttackScenario {
  id: string;
  title: string;
  threatCategory: string;
  attackerPretext: string;
  victimPerspective: string;
  redFlagsPresent: string[];
  psychologicalTrigger: string;
  whatVictimShouldDo: string[];
  takeaway: string;
  relatedThreatId: string;
}

// ==========================================
// WORKSTREAM 5: PREVENTION & PERSONALIZED GUIDANCE
// ==========================================
export type PreventionAreaId =
  | 'passwords'
  | 'mfa'
  | 'account-recovery'
  | 'device-security'
  | 'software-updates'
  | 'safe-browsing'
  | 'email-safety'
  | 'social-media'
  | 'public-wifi'
  | 'online-shopping'
  | 'financial-safety'
  | 'privacy'
  | 'scam-prevention'
  | 'pii-protection';

export type PreventionCategory =
  | 'accounts'
  | 'devices'
  | 'network'
  | 'privacy'
  | 'financial'
  | 'communications'
  | 'social'
  | 'scams';

export interface PreventionMethodology {
  id: string;
  areaId: PreventionAreaId;
  title: string;
  category: PreventionCategory;
  tagline: string;
  iconName: string;
  // Core 4 questions
  whatShouldIDo: string;
  howShouldIDoIt: string;
  whenShouldIDoIt: string;
  whyDoesItMatter: string;
  // 1. Risk
  risk: {
    summary: string;
    threatActors: string[];
    potentialImpact: string;
    realWorldScenario: string;
  };
  // 2. Why it matters
  whyItMattersDetail: string[];
  // 3. Recommended practice
  recommendedPractice: {
    headline: string;
    goldenRule: string;
    standardsReference?: string;
  };
  // 4. Step-by-step method
  stepByStepMethod: {
    stepNumber: number;
    title: string;
    timing: string;
    description: string;
    actionableDetail: string;
    proTip?: string;
  }[];
  // 5. Common mistakes
  commonMistakes: {
    mistake: string;
    whyItsDangerous: string;
    betterAlternative: string;
  }[];
  // 6. Quick checklist
  quickChecklist: {
    id: string;
    itemText: string;
    priority: 'essential' | 'recommended' | 'advanced';
  }[];
  // 7. What to do if something goes wrong
  whatToDoIfSomethingGoesWrong: {
    immediateActions: string[];
    containmentSteps: string[];
    recoverySteps: string[];
    emergencyContactOrHelpline?: string;
  };
  relatedChecklistIds: string[];
}

export interface ChecklistItem {
  id: string;
  category: PreventionCategory;
  areaId?: PreventionAreaId;
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
export type ThreatReputationStatus =
  | 'KNOWN MALICIOUS'
  | 'KNOWN PHISHING'
  | 'KNOWN MALWARE'
  | 'SUSPICIOUS'
  | 'NO KNOWN THREAT FOUND'
  | 'UNKNOWN'
  | 'THREAT INTELLIGENCE UNAVAILABLE'
  | 'INVALID URL';

export interface ThreatIntelligenceReport {
  status: ThreatReputationStatus;
  provider: string;
  threatTypes: string[];
  checkedAt: string;
  isAvailable: boolean;
  details?: string;
  sourceConfidence?: 'High' | 'Medium' | 'Low' | 'Unrated';
  disclaimer: string;
}

export interface CheckPerformedItem {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'unavailable';
  detail: string;
}

export interface UrlIndicator {
  name: string;
  category?: 'protocol' | 'host' | 'path' | 'query' | 'syntax' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'informational';
  status: 'positive' | 'warning' | 'risk';
  description: string;
  whyItMatters: string;
  impactPoints: number;
  iconType: 'check' | 'alert' | 'danger';
  recommendation?: string;
}

export interface UrlScoreBreakdownItem {
  indicatorName: string;
  category: 'protocol' | 'host' | 'path' | 'query' | 'syntax' | 'general';
  points: number;
  reason: string;
}

export interface UrlScanAssessment {
  rawInput: string;
  normalizedUrl: string;
  wasNormalized: boolean;
  normalizationNote?: string;
  isValid: boolean;
  protocol: string;
  hostname: string;
  port?: string;
  pathname: string;
  search?: string;
  isHttps: boolean;
  isIpAddress: boolean;
  ipType?: 'ipv4' | 'ipv6';
  isPrivateOrLocalIp?: boolean;
  hasAtSymbol: boolean;
  subdomainCount: number;
  subdomains: string[];
  registeredDomain: string;
  isPunycode: boolean;
  punycodeDetails?: string;
  hasHomographRisk?: boolean;
  unicodeAnalysis?: { isPunycode: boolean; containsNonAscii: boolean; scriptsDetected?: string[] };
  isShortenedUrl?: boolean;
  shortenerDomain?: string;
  hasSuspiciousKeywords: boolean;
  suspiciousKeywordsFound: string[];
  hasExcessiveParams: boolean;
  paramCount: number;
  hasOpenRedirectParam: boolean;
  hasSuspiciousEncoding: boolean;
  encodedSequencesCount: number;
  hasDoubleEncoding?: boolean;
  suspiciousCharacters: string[];
  hasUnusualPort: boolean;
  hasDangerousExtension: boolean;
  dangerousExtension?: string;
  urlLength: number;
  hostnameLength: number;
  // Layered Risk Assessment
  structuralScore: number; // 0 - 100
  riskScore: number; // Final Combined 0 - 100
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  reputationReport: ThreatIntelligenceReport;
  checksPerformed: CheckPerformedItem[];
  scoreBreakdown: UrlScoreBreakdownItem[];
  indicators: UrlIndicator[];
  explanation: string;
  recommendations: string[];
  limitations: string[];
  redirectNotice: string;
  errorMessage?: string;
  scannedAt?: string;
}

export interface ExtractedUrlInfo {
  id: string;
  originalText: string;
  extractedUrl: string;
  normalizedUrl: string;
  position: { start: number; end: number };
  assessment?: UrlScanAssessment;
}

export interface MessageTextAnalysis {
  rawText: string;
  hasLinks: boolean;
  linkCount: number;
  extractedUrls: ExtractedUrlInfo[];
  detectedPatterns: {
    hasUrgency: boolean;
    hasFinancialPretext: boolean;
    hasSuspiciousShortener: boolean;
    hasCredentialHarvestingWords: boolean;
  };
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
export interface OfficialReportingRoute {
  name: string;
  description: string;
  url?: string;
  helpline?: string;
  isOfficialGov?: boolean;
  notes?: string;
}

export interface CybercrimeCategory {
  id: string;
  title: string;
  iconName: string;
  tagline: string;
  // Core 5 required facets
  immediateActions: string[];
  evidenceToPreserve: string[];
  accountProtectionSteps: string[];
  relevantOfficialReportingRoute: OfficialReportingRoute[];
  warningsWhatNotToDo: string[];
  // Supplementary fields for educational context
  whatHappened?: string[];
  immediateSafetySteps?: string[]; // for backwards compatibility
  whereToReport?: OfficialReportingRoute[]; // for backwards compatibility
}

export type EmergencySituationId =
  | 'money-stolen'
  | 'account-hacked'
  | 'shared-otp'
  | 'clicked-suspicious-link'
  | 'installed-suspicious-app'
  | 'someone-impersonating-me'
  | 'harassed-online'
  | 'shared-personal-info';

export interface EmergencyContactItem {
  label: string;
  role: string;
  method: 'phone' | 'portal' | 'in-app' | 'action';
  value?: string;
  detail: string;
  isOfficialGov?: boolean;
}

export interface EmergencySituation {
  id: EmergencySituationId;
  title: string;
  shortTag: string;
  iconName: string;
  urgency: 'critical' | 'high' | 'urgent';
  summary: string;
  calmNotice: string;
  relatedCategoryId: string;
  // The mandatory 6-step emergency response flow:
  step1Immediate: {
    title: string;
    description: string;
    bullets: string[];
    criticalActionCallout?: string;
  };
  step2Secure: {
    title: string;
    description: string;
    bullets: string[];
  };
  step3Evidence: {
    title: string;
    description: string;
    bullets: string[];
  };
  step4Contact: {
    title: string;
    description: string;
    contacts: EmergencyContactItem[];
  };
  step5Report: {
    title: string;
    description: string;
    routes: OfficialReportingRoute[];
  };
  step6Avoid: {
    title: string;
    description: string;
    bullets: string[];
  };
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
export type QuizCategory =
  | 'Phishing'
  | 'Password Security'
  | 'Account Security'
  | 'Online Scams'
  | 'Social Engineering'
  | 'Financial Fraud'
  | 'Privacy'
  | 'Social Media Safety'
  | 'Mobile Security'
  | 'Safe Browsing'
  | 'Malware Awareness'
  | 'Identity Theft';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuizMode = 'quick' | 'category' | 'assessment' | 'scenario';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  topic: string; // for backward compatibility with existing components
  category: QuizCategory;
  scenario: string;
  question: string;
  options: QuizOption[];
  correctAnswer?: string; // ID of the correct option (e.g., 'a', 'b', 'c', 'd')
  explanation?: string; // Overall question explanation
  warningSigns: string[];
  takeaway: string; // for backward compatibility
  educationalTakeaway: string;
  status?: 'published' | 'draft';
  updatedAt?: string;
  difficulty: QuizDifficulty;
}

export interface QuizCategoryMeta {
  id: QuizCategory;
  label: string;
  description: string;
  iconName: string;
  color: string;
  recommendedLearnTopic?: string;
  recommendedPreventArea?: string;
}

export interface CategoryPerformanceResult {
  category: QuizCategory;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  proficiency: 'proficient' | 'moderate' | 'needs-attention';
}

export interface AreaToImprove {
  category: QuizCategory;
  summary: string;
  conceptToReview: string;
  recommendedLearnTitle: string;
  recommendedLearnPage: PageType;
}

export interface QuizAssessmentResult {
  mode: QuizMode;
  categorySelected?: QuizCategory | null;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  awarenessScore: number; // e.g., 85/100 or 9/10
  tier: {
    label: string;
    variant: 'safe' | 'info' | 'warning' | 'danger';
    badgeText: string;
    feedback: string;
  };
  categoryBreakdown: CategoryPerformanceResult[];
  areasToImprove: AreaToImprove[];
  userAnswers: Record<number, string>;
  completedAt: string;
  disclaimer: string;
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

// ==========================================
// WORKSTREAM 9: FIND NEARBY HELP (GEOSPATIAL REPORTING LOCATIONS)
// ==========================================
export type NearbyLocationCategory =
  | 'POLICE STATION'
  | 'CYBERCRIME / CYBER CELL'
  | 'GOVERNMENT SUPPORT'
  | 'OTHER RELEVANT HELP';

export interface NearbyHelpLocation {
  id: string;
  name: string;
  category: NearbyLocationCategory;
  isCyberDedicated: boolean;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address: string;
  city?: string;
  state?: string;
  postcode?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  osmType?: 'node' | 'way' | 'relation';
  osmId?: number | string;
  verifiedSource: 'OpenStreetMap' | 'Official Directory';
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  localityLabel?: string;
}

export interface NearbySearchFilters {
  category: 'all' | NearbyLocationCategory;
  maxRadiusKm: number;
  searchQuery: string;
}

