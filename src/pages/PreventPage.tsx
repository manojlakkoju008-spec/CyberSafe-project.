import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckSquare, 
  Search, 
  BookOpen, 
  Sparkles, 
  Filter, 
  Info, 
  ArrowRight,
  ShieldAlert,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { PreventionMethodology, PreventionAreaId } from '../types';
import { PREVENTION_METHODOLOGIES } from '../data/preventMethodologies';
import { CHECKLIST_ITEMS } from '../data/checklistData';
import { MethodologyCard } from '../components/prevent/MethodologyCard';
import { MethodologyDetailModal } from '../components/prevent/MethodologyDetailModal';
import { PersonalSafetyPlan } from '../components/prevent/PersonalSafetyPlan';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const STORAGE_KEY = 'cybersafe_checklist_completed';

interface PreventPageProps {
  onNavigateToReport?: () => void;
  initialAreaId?: string;
  initialSearchQuery?: string;
}

export const PreventPage: React.FC<PreventPageProps> = ({
  onNavigateToReport,
  initialAreaId,
  initialSearchQuery,
}) => {
  const { user } = useAuth();

  // Completed items state (backed by localStorage and optionally synced to Firestore user profile)
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      if (user?.completedChecklistIds && user.completedChecklistIds.length > 0) {
        return user.completedChecklistIds;
      }
      return [
        'os-auto-updates', 
        'device-biometric-pin', 
        'mfa-primary-email', 
        'password-manager-unique-passwords'
      ];
    } catch {
      return ['os-auto-updates', 'device-biometric-pin', 'mfa-primary-email'];
    }
  });

  // Main View Mode: 'methodologies' | 'plan'
  const [viewMode, setViewMode] = useState<'methodologies' | 'plan'>('methodologies');

  // Search & Filtering for Methodologies
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active selected methodology for the deep modal
  const [selectedMethodology, setSelectedMethodology] = useState<PreventionMethodology | null>(null);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setViewMode('methodologies');
    }
    if (initialAreaId) {
      const match = PREVENTION_METHODOLOGIES.find(
        (m) => m.areaId === initialAreaId || m.id === initialAreaId
      );
      if (match) {
        setSelectedMethodology(match);
        setViewMode('methodologies');
      }
    }
  }, [initialAreaId, initialSearchQuery]);

  // Sync state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
    } catch (err) {
      console.warn('Unable to save checklist progress to localStorage', err);
    }

    // If user is authenticated, sync to their Firestore profile
    if (user?.uid) {
      try {
        const userRef = doc(db, 'users', user.uid);
        updateDoc(userRef, { completedChecklistIds: completedIds }).catch(() => {});
      } catch {
        // graceful ignore
      }
    }
  }, [completedIds, user?.uid]);

  // Toggle item in checklist
  const toggleItem = (id: string) => {
    setCompletedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Preset handlers
  const handleApplyPreset = (preset: 'student' | 'remote' | 'senior' | 'citizen' | 'clear') => {
    if (preset === 'clear') {
      setCompletedIds([]);
      return;
    }
    if (preset === 'citizen') {
      setCompletedIds([
        'mfa-primary-email',
        'password-manager-unique-passwords',
        'os-auto-updates',
        'device-biometric-pin',
        'upi-payment-pin-rule',
        'transaction-alerts-enabled',
        'scam-pause-reflex'
      ]);
    } else if (preset === 'student') {
      setCompletedIds([
        'os-auto-updates', 
        'device-biometric-pin', 
        'password-manager-unique-passwords', 
        'mfa-primary-email',
        'trusted-vpn-public-wifi',
        'social-media-privacy-scrub'
      ]);
    } else if (preset === 'remote') {
      setCompletedIds([
        'os-auto-updates',
        'device-biometric-pin',
        'mfa-primary-email',
        'password-manager-unique-passwords',
        'recovery-email-audit',
        'change-router-admin-password',
        'router-wpa3-guest-network',
        'trusted-vpn-public-wifi',
        'three-two-one-backups',
        'full-disk-encryption',
        'audit-logged-in-sessions'
      ]);
    } else if (preset === 'senior') {
      setCompletedIds([
        'device-biometric-pin',
        'os-auto-updates',
        'trusted-apps-only',
        'upi-payment-pin-rule',
        'transaction-alerts-enabled',
        'scam-pause-reflex',
        'id-document-watermarking'
      ]);
    }
  };

  // Open modal by area ID (used by Personal Safety Plan links)
  const handleSelectByAreaId = (areaId: PreventionAreaId) => {
    const found = PREVENTION_METHODOLOGIES.find(m => m.areaId === areaId);
    if (found) {
      setSelectedMethodology(found);
    }
  };

  // Filter methodologies
  const filteredMethodologies = useMemo(() => {
    return PREVENTION_METHODOLOGIES.filter(m => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.whatShouldIDo.toLowerCase().includes(q) ||
        m.risk.summary.toLowerCase().includes(q) ||
        m.recommendedPractice.goldenRule.toLowerCase().includes(q) ||
        m.areaId.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Overall completion score for quick header indicator
  const habitCompletionRate = useMemo(() => {
    return Math.round((completedIds.length / CHECKLIST_ITEMS.length) * 100);
  }, [completedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Practical Methodology-Based Safety System</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Prevent: Structured Cyber Hygiene & Habit Formation
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Move beyond passive cybersecurity tips. Learn exact, step-by-step methodologies across <strong>14 key prevention areas</strong>, understand what to do, how and when to do it, and evaluate your personal habit maturity index with an actionable, gap-detecting safety plan.
        </p>
      </div>

      {/* Main Mode Navigation Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-slate-200">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('methodologies')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'methodologies'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Methodologies & Action Guides</span>
            <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
              14 Areas
            </span>
          </button>

          <button
            onClick={() => setViewMode('plan')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'plan'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Personal Safety Plan & Habit Audit</span>
            <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
              {habitCompletionRate}%
            </span>
          </button>
        </div>

        {/* View mode prompt */}
        <div className="text-xs text-slate-500 px-3 hidden md:flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {viewMode === 'methodologies' 
              ? 'Browse step-by-step methods, risks, common traps & emergency playbooks.'
              : 'Audit your habit completeness and generate educational recommendations.'
            }
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: METHODOLOGIES & ACTION GUIDES */}
      {viewMode === 'methodologies' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search password security, MFA, UPI, Wi-Fi, phishing..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All 14 Areas' },
                { id: 'accounts', label: 'Accounts (3)' },
                { id: 'devices', label: 'Devices (2)' },
                { id: 'network', label: 'Network (2)' },
                { id: 'communications', label: 'Email (1)' },
                { id: 'social', label: 'Social (1)' },
                { id: 'financial', label: 'Financial (2)' },
                { id: 'privacy', label: 'Privacy & PII (2)' },
                { id: 'scams', label: 'Scam Defense (1)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredMethodologies.length}</strong> of <strong>14</strong> structured methodologies
            </span>
            <span className="hidden sm:inline">
              Click any card to inspect Risk, Step-by-Step Method, Traps & Emergency Triage
            </span>
          </div>

          {/* Methodology Cards Grid */}
          {filteredMethodologies.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-base font-bold text-slate-800">No methodologies match your search</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader terms like "password", "updates", "Wi-Fi", "shopping", or reset your category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer pt-2"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMethodologies.map(methodology => (
                <MethodologyCard
                  key={methodology.id}
                  methodology={methodology}
                  onSelect={setSelectedMethodology}
                  completedItemIds={completedIds}
                />
              ))}
            </div>
          )}

          {/* Bottom Educational Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Ready to Audit Your Habits?</span>
              </div>
              <h3 className="text-xl font-bold">
                Evaluate Your Personal Digital Safety Plan
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Take the interactive self-audit to detect missing habits across account credentials, device encryption, Wi-Fi security, and financial transaction alerts.
              </p>
            </div>

            <button
              onClick={() => {
                setViewMode('plan');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Open Personal Safety Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PERSONAL SAFETY PLAN & HABIT AUDIT */}
      {viewMode === 'plan' && (
        <div className="animate-in fade-in duration-200">
          <PersonalSafetyPlan
            completedIds={completedIds}
            onToggleItem={toggleItem}
            onApplyPreset={handleApplyPreset}
            onSelectMethodologyByAreaId={handleSelectByAreaId}
          />
        </div>
      )}

      {/* Deep Methodology Detail Modal */}
      <MethodologyDetailModal
        methodology={selectedMethodology}
        onClose={() => setSelectedMethodology(null)}
        completedItemIds={completedIds}
        onToggleChecklistItem={toggleItem}
        onOpenReport={onNavigateToReport}
      />
    </div>
  );
};
