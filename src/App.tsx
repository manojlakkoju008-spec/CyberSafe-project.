import React, { useState, useEffect, useCallback } from 'react';
import { PageType, QuizCategory } from './types';
import { AuthProvider } from './context/AuthContext';
import { AiGuideProvider, useAiGuide } from './context/AiGuideContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EmergencyModal } from './components/common/EmergencyModal';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PreventPage } from './pages/PreventPage';
import { DetectPage } from './pages/DetectPage';
import { ReportPage } from './pages/ReportPage';
import { QuizPage } from './pages/QuizPage';
import { PrivacyDisclaimerPage } from './pages/PrivacyDisclaimerPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AiGuideDrawer } from './components/aiGuide/AiGuideDrawer';
import { AiGuideFloatingButton } from './components/aiGuide/AiGuideFloatingButton';
import { AiGuideActionConfirmationModal } from './components/aiGuide/AiGuideActionConfirmationModal';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [learnSearchQuery, setLearnSearchQuery] = useState<string>('');
  const [reportIncidentId, setReportIncidentId] = useState<string | undefined>(undefined);
  const [reportUrl, setReportUrl] = useState<string | undefined>(undefined);
  const [detectUrl, setDetectUrl] = useState<string | undefined>(undefined);
  const [preventAreaId, setPreventAreaId] = useState<string | undefined>(undefined);
  const [quizCategory, setQuizCategory] = useState<string | undefined>(undefined);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  // Listen for Google Maps quota exceeded event
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setGmpQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const { setActiveContextPage, setOnNavigate } = useAiGuide();

  // Sync active page context with AI Guide
  useEffect(() => {
    setActiveContextPage(currentPage);
  }, [currentPage, setActiveContextPage]);

  const navigateTo = useCallback((
    page: PageType,
    queryOrIncidentId?: string,
    url?: string,
    areaId?: string,
    category?: string
  ) => {
    if (page === 'learn') {
      setLearnSearchQuery(queryOrIncidentId || '');
    } else if (page === 'report') {
      setReportIncidentId(queryOrIncidentId);
      setReportUrl(url);
    } else if (page === 'detect') {
      setDetectUrl(url);
    } else if (page === 'prevent') {
      setPreventAreaId(areaId || queryOrIncidentId);
    } else if (page === 'quiz') {
      setQuizCategory(category || queryOrIncidentId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Wire AI Guide navigation callback
  useEffect(() => {
    setOnNavigate(navigateTo);
  }, [setOnNavigate, navigateTo]);

  const handleOpenEmergency = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Google Maps Quota Warning Banner */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Navigation */}
      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => navigateTo(p)}
          onOpenEmergency={handleOpenEmergency}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(p, query) => navigateTo(p, query)}
            onOpenEmergency={handleOpenEmergency}
          />
        )}

        {currentPage === 'learn' && (
          <LearnPage
            initialSearchQuery={learnSearchQuery}
            onNavigateToReport={(incidentId) => navigateTo('report', incidentId)}
          />
        )}

        {currentPage === 'prevent' && (
          <PreventPage
            initialAreaId={preventAreaId}
            initialSearchQuery={learnSearchQuery}
            onNavigateToReport={() => navigateTo('report')}
          />
        )}

        {currentPage === 'detect' && (
          <DetectPage
            initialUrl={detectUrl}
            onNavigateToReport={(incidentId, url) => navigateTo('report', incidentId, url)}
          />
        )}

        {currentPage === 'report' && (
          <ReportPage
            initialIncidentId={reportIncidentId}
            initialUrl={reportUrl}
          />
        )}

        {currentPage === 'quiz' && (
          <QuizPage
            initialCategory={quizCategory}
            onNavigateToLearn={() => navigateTo('learn')}
            onNavigateToPrevent={() => navigateTo('prevent')}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyDisclaimerPage
            initialTab="privacy"
            onNavigate={(p) => navigateTo(p)}
          />
        )}

        {currentPage === 'disclaimer' && (
          <PrivacyDisclaimerPage
            initialTab="disclaimer"
            onNavigate={(p) => navigateTo(p)}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            initialMode="login"
            onSuccess={() => navigateTo('profile')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onNavigateToChecklist={() => navigateTo('prevent')}
            onNavigateToQuiz={() => navigateTo('quiz')}
            onNavigateToAdmin={() => navigateTo('admin')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToAuth={() => navigateTo('auth')}
          />
        )}
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && <Footer onNavigate={(p) => navigateTo(p)} />}

      {/* Emergency Triage Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={handleCloseEmergency}
        onNavigateToReport={(scenarioOrCategoryId) => {
          navigateTo('report', scenarioOrCategoryId);
        }}
      />

      {/* CyberSafe AI Guide Components */}
      <AiGuideDrawer />
      <AiGuideFloatingButton />
      <AiGuideActionConfirmationModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AiGuideProvider>
        <AppContent />
      </AiGuideProvider>
    </AuthProvider>
  );
}
