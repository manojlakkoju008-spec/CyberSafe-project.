import React, { useState } from 'react';
import { PageType } from './types';
import { AuthProvider } from './context/AuthContext';
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [learnSearchQuery, setLearnSearchQuery] = useState<string>('');
  const [reportIncidentId, setReportIncidentId] = useState<string | undefined>(undefined);
  const [reportUrl, setReportUrl] = useState<string | undefined>(undefined);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const navigateTo = (page: PageType, queryOrIncidentId?: string, url?: string) => {
    if (page === 'learn') {
      setLearnSearchQuery(queryOrIncidentId || '');
    } else if (page === 'report') {
      setReportIncidentId(queryOrIncidentId);
      setReportUrl(url);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmergency = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => navigateTo(p)}
        onOpenEmergency={handleOpenEmergency}
      />

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
            onNavigateToReport={() => navigateTo('report')}
          />
        )}

        {currentPage === 'detect' && (
          <DetectPage
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
      <Footer onNavigate={(p) => navigateTo(p)} />

      {/* Emergency Triage Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={handleCloseEmergency}
        onNavigateToReport={(scenarioOrCategoryId) => {
          navigateTo('report', scenarioOrCategoryId);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
