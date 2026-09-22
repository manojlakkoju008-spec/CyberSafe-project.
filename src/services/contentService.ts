import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ThreatItem, SecurityMethodologyGuide, QuizQuestion, ContentAuditLog } from '../types';
import { THREATS_DATA } from '../data/threatsData';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { INDIA_REPORTING_INFO } from '../data/reportData';

// Baseline Prevention Methodologies
export const DEFAULT_METHODOLOGIES: SecurityMethodologyGuide[] = [
  {
    id: 'nist-csf-citizen',
    title: 'NIST Cybersecurity Framework for Citizens',
    standard: 'NIST CSF 2.0',
    summary: 'A structured 5-pillar approach adapted for personal, household, and small business safety: Identify, Protect, Detect, Respond, and Recover.',
    targetAudience: 'General Citizens, Remote Workers, Families',
    category: 'Framework Standards',
    status: 'published',
    updatedAt: new Date().toISOString(),
    phases: [
      {
        phaseName: '1. Identify (Digital Asset Inventory)',
        description: 'Map out all accounts, connected devices, and sensitive personal records you manage.',
        actionItems: [
          'List all primary email accounts, banking profiles, and password recovery numbers.',
          'Identify dormant old accounts and close them to reduce credential leak exposure.',
          'Review authorized third-party OAuth apps connected to Google, Apple, or Microsoft accounts.'
        ]
      },
      {
        phaseName: '2. Protect (Access Defense & Hygiene)',
        description: 'Implement defensive barriers against credential theft and unauthorized access.',
        actionItems: [
          'Enforce Hardware/App-based Multi-Factor Authentication (Authenticator apps or FIDO2 keys).',
          'Deploy an encrypted password manager and eliminate reused passwords.',
          'Enable automatic software and firmware security updates on phones, PCs, and home Wi-Fi routers.'
        ]
      },
      {
        phaseName: '3. Detect (Early Warning Indicators)',
        description: 'Recognize suspicious activity, unrecognized logins, and unauthorized transaction alerts.',
        actionItems: [
          'Enable instant push or SMS alerts for all debit and credit card charges.',
          'Check active sessions in Google/Apple account security dashboards weekly.',
          'Inspect unexpected password reset emails and never click confirmation links inside them.'
        ]
      },
      {
        phaseName: '4. Respond (Immediate Incident Containment)',
        description: 'Execute rapid containment when a compromise or scam is suspected.',
        actionItems: [
          'Immediately call National Cyber Helpline 1930 for financial UPI or bank fraud.',
          'Change master credentials and disconnect infected devices from the local Wi-Fi network.',
          'Take screenshots of fraudulent transaction references, numbers, and sender handles for evidence.'
        ]
      },
      {
        phaseName: '5. Recover (System Restoration & Hardening)',
        description: 'Restore clean device states, re-secure identities, and prevent re-infection.',
        actionItems: [
          'Restore personal documents strictly from verified offline clean backups.',
          'File an official incident report on cybercrime.gov.in with all preserved evidence.',
          'Perform a post-incident security audit on all linked financial and recovery accounts.'
        ]
      }
    ]
  },
  {
    id: 'zero-trust-personal',
    title: 'Personal Zero Trust Principles',
    standard: 'Zero Trust for Citizens',
    summary: 'Never automatically trust any incoming message, caller, or pop-up link. Always independently verify through official, out-of-band channels.',
    targetAudience: 'Students, Professionals, Senior Citizens',
    category: 'Operational Mindset',
    status: 'published',
    updatedAt: new Date().toISOString(),
    phases: [
      {
        phaseName: 'Verify Explicitly (Out-of-Band Validation)',
        description: 'Never rely on sender name display or caller ID because telephone headers and emails can be spoofed.',
        actionItems: [
          'If receiving an urgent bank alert, hang up and dial the official number printed on the back of your debit card.',
          'Verify unexpected parcel delivery text messages directly through your official carrier app.',
          'Treat all requests demanding gift cards, remote screen sharing, or instant UPI transfers as fraudulent.'
        ]
      },
      {
        phaseName: 'Least Privilege Access',
        description: 'Grant apps and services only the minimum permissions necessary to function.',
        actionItems: [
          'Revoke camera, microphone, and contacts permissions from apps that do not genuinely need them.',
          'Never use administrative or root accounts for everyday web browsing and document editing.',
          'Use disposable or alias email addresses for promotional newsletters and forums.'
        ]
      }
    ]
  }
];

// Local in-memory caches with persistent overrides
let cachedThreats: ThreatItem[] = THREATS_DATA.map((t) => ({
  ...t,
  status: 'published' as const,
  updatedAt: new Date().toISOString(),
}));

let cachedMethodologies: SecurityMethodologyGuide[] = DEFAULT_METHODOLOGIES;

let cachedQuizQuestions: QuizQuestion[] = QUIZ_QUESTIONS.map((q) => ({
  ...q,
  status: 'published' as const,
  updatedAt: new Date().toISOString(),
}));

let cachedReportingInfo = {
  ...INDIA_REPORTING_INFO,
  updatedAt: new Date().toISOString(),
};

let auditLogs: ContentAuditLog[] = [
  {
    id: 'log-seed-1',
    adminId: 'system_bootstrap',
    action: 'publish',
    entityType: 'threat',
    entityId: 'phishing',
    timestamp: new Date().toISOString(),
    changeSummary: 'Seeded foundational 10 CyberSafe threat guides with NIST CSF framework mappings.',
  },
  {
    id: 'log-seed-2',
    adminId: 'system_bootstrap',
    action: 'publish',
    entityType: 'quiz_question',
    entityId: '1',
    timestamp: new Date().toISOString(),
    changeSummary: 'Published 10 interactive cybersecurity awareness challenge questions.',
  }
];

// ====================================================
// THREATS (LEARNING RESOURCES) CRUD
// ====================================================

export async function fetchAllThreats(): Promise<ThreatItem[]> {
  try {
    const snap = await getDocs(collection(db, 'content_threats'));
    if (!snap.empty) {
      const dbThreats: ThreatItem[] = [];
      snap.forEach((docSnap) => {
        dbThreats.push(docSnap.data() as ThreatItem);
      });
      // Merge with default list for any that don't exist in DB
      const dbMap = new Map(dbThreats.map((t) => [t.id, t]));
      const merged = cachedThreats.map((t) => dbMap.get(t.id) || t);
      // Also add any completely new items created in DB
      dbThreats.forEach((t) => {
        if (!merged.some((m) => m.id === t.id)) {
          merged.push(t);
        }
      });
      cachedThreats = merged;
      return merged;
    }
  } catch (err) {
    console.warn('Firestore content_threats query fallback to local cache:', err);
  }
  return cachedThreats;
}

export async function saveThreat(threat: ThreatItem, adminId: string): Promise<void> {
  const itemToSave: ThreatItem = {
    ...threat,
    status: threat.status || 'published',
    updatedAt: new Date().toISOString(),
  };

  // Update local cache
  const idx = cachedThreats.findIndex((t) => t.id === threat.id);
  const isNew = idx === -1;
  if (isNew) {
    cachedThreats = [itemToSave, ...cachedThreats];
  } else {
    cachedThreats = cachedThreats.map((t) => (t.id === threat.id ? itemToSave : t));
  }

  // Record Audit
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: isNew ? 'create' : 'update',
    entityType: 'threat',
    entityId: threat.id,
    timestamp: new Date().toISOString(),
    changeSummary: `${isNew ? 'Created' : 'Updated'} threat resource "${threat.title}" (${threat.severity})`,
  });

  // Persist to Firestore
  try {
    const ref = doc(db, 'content_threats', threat.id);
    await setDoc(ref, itemToSave);
  } catch (err) {
    console.warn('Firestore write failed, retained in local cache:', err);
    throw err;
  }
}

export async function deleteThreat(threatId: string, adminId: string): Promise<void> {
  const existing = cachedThreats.find((t) => t.id === threatId);
  cachedThreats = cachedThreats.filter((t) => t.id !== threatId);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'delete',
    entityType: 'threat',
    entityId: threatId,
    timestamp: new Date().toISOString(),
    changeSummary: `Deleted threat resource "${existing?.title || threatId}"`,
  });

  try {
    const ref = doc(db, 'content_threats', threatId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore delete failed:', err);
    throw err;
  }
}

export async function toggleThreatPublish(threatId: string, adminId: string): Promise<ThreatItem | null> {
  const item = cachedThreats.find((t) => t.id === threatId);
  if (!item) return null;

  const newStatus: 'published' | 'draft' = item.status === 'published' ? 'draft' : 'published';
  const updated: ThreatItem = {
    ...item,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  cachedThreats = cachedThreats.map((t) => (t.id === threatId ? updated : t));

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'publish',
    entityType: 'threat',
    entityId: threatId,
    timestamp: new Date().toISOString(),
    changeSummary: `Changed status of "${item.title}" to ${newStatus}`,
  });

  try {
    const ref = doc(db, 'content_threats', threatId);
    await updateDoc(ref, { status: newStatus, updatedAt: updated.updatedAt });
  } catch (err) {
    console.warn('Firestore update failed:', err);
  }
  return updated;
}

// ====================================================
// PREVENTION METHODOLOGIES CRUD
// ====================================================

export async function fetchAllMethodologies(): Promise<SecurityMethodologyGuide[]> {
  try {
    const snap = await getDocs(collection(db, 'content_preventions'));
    if (!snap.empty) {
      const list: SecurityMethodologyGuide[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as SecurityMethodologyGuide);
      });
      const dbMap = new Map(list.map((m) => [m.id, m]));
      const merged = cachedMethodologies.map((m) => dbMap.get(m.id) || m);
      list.forEach((item) => {
        if (!merged.some((m) => m.id === item.id)) {
          merged.push(item);
        }
      });
      cachedMethodologies = merged;
      return merged;
    }
  } catch (err) {
    console.warn('Firestore content_preventions query fallback:', err);
  }
  return cachedMethodologies;
}

export async function saveMethodology(guide: SecurityMethodologyGuide, adminId: string): Promise<void> {
  const itemToSave: SecurityMethodologyGuide = {
    ...guide,
    status: guide.status || 'published',
    updatedAt: new Date().toISOString(),
  };

  const idx = cachedMethodologies.findIndex((m) => m.id === guide.id);
  const isNew = idx === -1;
  if (isNew) {
    cachedMethodologies = [itemToSave, ...cachedMethodologies];
  } else {
    cachedMethodologies = cachedMethodologies.map((m) => (m.id === guide.id ? itemToSave : m));
  }

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: isNew ? 'create' : 'update',
    entityType: 'basic',
    entityId: guide.id,
    timestamp: new Date().toISOString(),
    changeSummary: `${isNew ? 'Created' : 'Updated'} prevention methodology "${guide.title}"`,
  });

  try {
    const ref = doc(db, 'content_preventions', guide.id);
    await setDoc(ref, itemToSave);
  } catch (err) {
    console.warn('Firestore save methodology failed:', err);
    throw err;
  }
}

export async function deleteMethodology(guideId: string, adminId: string): Promise<void> {
  const existing = cachedMethodologies.find((m) => m.id === guideId);
  cachedMethodologies = cachedMethodologies.filter((m) => m.id !== guideId);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'delete',
    entityType: 'basic',
    entityId: guideId,
    timestamp: new Date().toISOString(),
    changeSummary: `Deleted prevention methodology "${existing?.title || guideId}"`,
  });

  try {
    const ref = doc(db, 'content_preventions', guideId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore delete methodology failed:', err);
    throw err;
  }
}

export async function toggleMethodologyPublish(guideId: string, adminId: string): Promise<SecurityMethodologyGuide | null> {
  const item = cachedMethodologies.find((m) => m.id === guideId);
  if (!item) return null;

  const newStatus: 'published' | 'draft' = item.status === 'published' ? 'draft' : 'published';
  const updated: SecurityMethodologyGuide = {
    ...item,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  cachedMethodologies = cachedMethodologies.map((m) => (m.id === guideId ? updated : m));

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'publish',
    entityType: 'basic',
    entityId: guideId,
    timestamp: new Date().toISOString(),
    changeSummary: `Changed methodology status "${item.title}" to ${newStatus}`,
  });

  try {
    const ref = doc(db, 'content_preventions', guideId);
    await updateDoc(ref, { status: newStatus, updatedAt: updated.updatedAt });
  } catch (err) {
    console.warn('Firestore update failed:', err);
  }
  return updated;
}

// ====================================================
// QUIZ QUESTIONS CRUD
// ====================================================

export async function fetchAllQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const snap = await getDocs(collection(db, 'content_quiz'));
    if (!snap.empty) {
      const list: QuizQuestion[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as QuizQuestion);
      });
      const dbMap = new Map(list.map((q) => [q.id, q]));
      const merged = cachedQuizQuestions.map((q) => dbMap.get(q.id) || q);
      list.forEach((item) => {
        if (!merged.some((m) => m.id === item.id)) {
          merged.push(item);
        }
      });
      cachedQuizQuestions = merged;
      return merged;
    }
  } catch (err) {
    console.warn('Firestore content_quiz query fallback:', err);
  }
  return cachedQuizQuestions;
}

export async function saveQuizQuestion(question: QuizQuestion, adminId: string): Promise<void> {
  const itemToSave: QuizQuestion = {
    ...question,
    status: question.status || 'published',
    updatedAt: new Date().toISOString(),
  };

  const idx = cachedQuizQuestions.findIndex((q) => q.id === question.id);
  const isNew = idx === -1;
  if (isNew) {
    cachedQuizQuestions = [...cachedQuizQuestions, itemToSave];
  } else {
    cachedQuizQuestions = cachedQuizQuestions.map((q) => (q.id === question.id ? itemToSave : q));
  }

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: isNew ? 'create' : 'update',
    entityType: 'quiz_question',
    entityId: String(question.id),
    timestamp: new Date().toISOString(),
    changeSummary: `${isNew ? 'Added' : 'Updated'} quiz scenario question #${question.id} ("${question.title}")`,
  });

  try {
    const ref = doc(db, 'content_quiz', String(question.id));
    await setDoc(ref, itemToSave);
  } catch (err) {
    console.warn('Firestore save quiz failed:', err);
    throw err;
  }
}

export async function deleteQuizQuestion(questionId: number, adminId: string): Promise<void> {
  const existing = cachedQuizQuestions.find((q) => q.id === questionId);
  cachedQuizQuestions = cachedQuizQuestions.filter((q) => q.id !== questionId);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'delete',
    entityType: 'quiz_question',
    entityId: String(questionId),
    timestamp: new Date().toISOString(),
    changeSummary: `Deleted quiz question #${questionId} ("${existing?.title || 'Scenario'}")`,
  });

  try {
    const ref = doc(db, 'content_quiz', String(questionId));
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore delete quiz failed:', err);
    throw err;
  }
}

export async function toggleQuizPublish(questionId: number, adminId: string): Promise<QuizQuestion | null> {
  const item = cachedQuizQuestions.find((q) => q.id === questionId);
  if (!item) return null;

  const newStatus: 'published' | 'draft' = item.status === 'published' ? 'draft' : 'published';
  const updated: QuizQuestion = {
    ...item,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  cachedQuizQuestions = cachedQuizQuestions.map((q) => (q.id === questionId ? updated : q));

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'publish',
    entityType: 'quiz_question',
    entityId: String(questionId),
    timestamp: new Date().toISOString(),
    changeSummary: `Changed quiz question #${questionId} status to ${newStatus}`,
  });

  try {
    const ref = doc(db, 'content_quiz', String(questionId));
    await updateDoc(ref, { status: newStatus, updatedAt: updated.updatedAt });
  } catch (err) {
    console.warn('Firestore update quiz failed:', err);
  }
  return updated;
}

// ====================================================
// REPORTING & HELPLINE CONFIG
// ====================================================

export async function fetchReportingConfig() {
  try {
    const snap = await getDocs(collection(db, 'content_reporting'));
    if (!snap.empty) {
      const data = snap.docs[0].data();
      cachedReportingInfo = {
        ...cachedReportingInfo,
        ...data,
      };
    }
  } catch (err) {
    console.warn('Firestore reporting query fallback:', err);
  }
  return cachedReportingInfo;
}

export async function saveReportingConfig(config: typeof cachedReportingInfo, adminId: string) {
  cachedReportingInfo = {
    ...config,
    updatedAt: new Date().toISOString(),
  };

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId,
    action: 'update',
    entityType: 'category',
    entityId: 'helpline_config',
    timestamp: new Date().toISOString(),
    changeSummary: `Updated National Helpline & Portal guidelines (${config.helplineNumber})`,
  });

  try {
    const ref = doc(db, 'content_reporting', 'main_config');
    await setDoc(ref, cachedReportingInfo);
  } catch (err) {
    console.warn('Firestore save reporting failed:', err);
    throw err;
  }
}

// ====================================================
// AUDIT LOGS
// ====================================================

export function getAuditLogs(): ContentAuditLog[] {
  return [...auditLogs];
}
