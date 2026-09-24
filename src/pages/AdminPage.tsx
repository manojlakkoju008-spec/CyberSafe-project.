import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowLeft,
  RefreshCw,
  LogOut,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  AdminTab,
  AdminRole,
  ThreatItem,
  SecurityMethodologyGuide,
  QuizQuestion,
  AdminManagedLocation,
  PlatformAnnouncement,
  PlatformSystemSettings,
  DetailedAuditLog,
  AdminUserRecord,
  AdminUserListItem,
  DetectionAdminMetrics,
  UserRole,
} from '../types';

import {
  fetchAllThreats,
  saveThreat,
  deleteThreat,
  fetchAllMethodologies,
  saveMethodology,
  deleteMethodology,
  fetchAllQuizQuestions,
  saveQuizQuestion,
  deleteQuizQuestion,
  fetchReportingConfig,
  saveReportingConfig,
} from '../services/contentService';

import {
  fetchCurrentAdminRole,
  getRolePermissions,
  fetchAdminLocations,
  saveAdminLocation,
  verifyLocationRecord,
  archiveLocationRecord,
  fetchSystemSettings,
  saveSystemSettings,
  fetchAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  fetchDetailedAuditLogs,
  fetchAdminTeam,
  inviteAdminUser,
  updateAdminRole,
  toggleAdminStatus,
  fetchAdminUserList,
  updateUserAccountStatus,
  updateUserAccountRole,
  runHealthDiagnostics,
  fetchDetectionMetrics,
  ServiceHealthStatus,
} from '../services/adminService';

// Admin Subcomponents
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminLoginPrompt } from '../components/admin/AdminLoginPrompt';
import { AdminOverviewSection } from '../components/admin/AdminOverviewSection';
import { AdminUsersSection } from '../components/admin/AdminUsersSection';
import { AdminContentSection } from '../components/admin/AdminContentSection';
import { AdminLocationsSection } from '../components/admin/AdminLocationsSection';
import { AdminDetectionSection } from '../components/admin/AdminDetectionSection';
import { AdminReportsSection } from '../components/admin/AdminReportsSection';
import { AdminQuizzesSection } from '../components/admin/AdminQuizzesSection';
import { AdminAnnouncementsSection } from '../components/admin/AdminAnnouncementsSection';
import { AdminAnalyticsSection } from '../components/admin/AdminAnalyticsSection';
import { AdminSystemHealthSection } from '../components/admin/AdminSystemHealthSection';
import { AdminAuditLogsSection } from '../components/admin/AdminAuditLogsSection';
import { AdminManagementSection } from '../components/admin/AdminManagementSection';
import { AdminSettingsSection } from '../components/admin/AdminSettingsSection';

interface AdminPageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
}

export function AdminPage({ onNavigateHome, onNavigateToAuth }: AdminPageProps) {
  const { user, firebaseUser, isAdmin, isAuthenticated, logout, sendResetEmail } = useAuth();

  // Navigation & Shell State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // RBAC & Role State
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);

  // Platform Data Stores
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [methodologies, setMethodologies] = useState<SecurityMethodologyGuide[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [locations, setLocations] = useState<AdminManagedLocation[]>([]);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [auditLogs, setAuditLogs] = useState<DetailedAuditLog[]>([]);
  const [adminTeam, setAdminTeam] = useState<AdminUserRecord[]>([]);
  const [healthStatus, setHealthStatus] = useState<ServiceHealthStatus[]>([]);
  const [detectionMetrics, setDetectionMetrics] = useState<DetectionAdminMetrics>({
    totalRequests: 1842,
    localHeuristicRequests: 1842,
    externalReputationRequests: 624,
    flaggedMaliciousCount: 312,
    flaggedSuspiciousCount: 489,
    cleanCount: 1041,
    avgLatencyMs: 38,
    fallbackCount: 1218,
    rateLimitBlocks: 3,
  });

  const [settings, setSettings] = useState<PlatformSystemSettings>({
    id: 'global_config',
    platformName: 'CyberSafe Control Center',
    contactEmail: 'security@cybersafe.org',
    maintenanceMode: false,
    defaultRadiusKm: 10,
    maxRadiusKm: 50,
    structuralThresholdMedium: 30,
    structuralThresholdHigh: 60,
    threatIntelCacheMinutes: 10,
    nationalHelplineNumber: '1930',
    officialPortalUrl: 'https://cybercrime.gov.in/',
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  });

  const [reportingConfig, setReportingConfig] = useState({
    helplineNumber: '1930',
    helplineName: 'National Cyber Crime Reporting Helpline',
    portalUrl: 'https://cybercrime.gov.in/',
    disclaimer:
      'CyberSafe is an independent cybersecurity literacy platform and does not submit complaints directly to police authorities.',
  });

  // Check administrative authorization
  const checkRole = useCallback(async () => {
    setIsLoadingAuth(true);
    if (!isAuthenticated || !user?.email) {
      setAdminRole(null);
      setIsLoadingAuth(false);
      return;
    }

    try {
      const role = await fetchCurrentAdminRole(user.email, user.uid);
      setAdminRole(role);
    } catch (err) {
      console.error('Role resolution failed:', err);
      setAdminRole(null);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [isAuthenticated, user?.email, user?.uid]);

  useEffect(() => {
    checkRole();
  }, [checkRole]);

  // Load all platform datasets
  const loadAllData = useCallback(async () => {
    if (!adminRole) return;
    setIsRefreshing(true);
    try {
      const [
        usersData,
        threatsData,
        methodsData,
        quizzesData,
        locationsData,
        announcementsData,
        settingsData,
        reportingData,
        logsData,
        teamData,
        healthData,
      ] = await Promise.all([
        fetchAdminUserList(),
        fetchAllThreats(),
        fetchAllMethodologies(),
        fetchAllQuizQuestions(),
        fetchAdminLocations(),
        fetchAnnouncements(),
        fetchSystemSettings(),
        fetchReportingConfig(),
        fetchDetailedAuditLogs(),
        fetchAdminTeam(),
        runHealthDiagnostics(),
      ]);

      setUsers(usersData);
      setThreats(threatsData);
      setMethodologies(methodsData);
      setQuizzes(quizzesData);
      setLocations(locationsData);
      setAnnouncements(announcementsData);
      setSettings(settingsData);
      setReportingConfig(reportingData as any);
      setAuditLogs(logsData);
      setAdminTeam(teamData);
      setHealthStatus(healthData);
      setDetectionMetrics(fetchDetectionMetrics());
    } catch (err) {
      console.error('Error loading admin datasets:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [adminRole]);

  useEffect(() => {
    if (adminRole) {
      loadAllData();
    }
  }, [adminRole, loadAllData]);

  // If user is not authenticated or not an admin, show dedicated Admin Login Prompt
  if (!isAuthenticated || !adminRole) {
    if (isLoadingAuth) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono uppercase tracking-wider">Verifying Cryptographic Privileges...</p>
        </div>
      );
    }

    return (
      <AdminLoginPrompt
        onNavigateHome={onNavigateHome}
        onSuccess={checkRole}
      />
    );
  }

  // Pending location counter for badge
  const pendingLocationsCount = locations.filter(
    (l) => l.verificationStatus === 'PENDING_REVIEW'
  ).length;

  const permissions = getRolePermissions(adminRole);

  // Handlers for Data Mutations
  const handleSaveLocation = async (loc: AdminManagedLocation) => {
    await saveAdminLocation(loc);
    const updated = await fetchAdminLocations();
    setLocations(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleVerifyLocation = async (id: string) => {
    await verifyLocationRecord(id, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAdminLocations();
    setLocations(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleArchiveLocation = async (id: string) => {
    await archiveLocationRecord(id);
    const updated = await fetchAdminLocations();
    setLocations(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleSaveThreat = async (threat: ThreatItem) => {
    await saveThreat(threat, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllThreats();
    setThreats(updated);
  };

  const handleDeleteThreat = async (id: string) => {
    await deleteThreat(id, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllThreats();
    setThreats(updated);
  };

  const handleSaveMethodology = async (method: SecurityMethodologyGuide) => {
    await saveMethodology(method, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllMethodologies();
    setMethodologies(updated);
  };

  const handleDeleteMethodology = async (id: string) => {
    await deleteMethodology(id, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllMethodologies();
    setMethodologies(updated);
  };

  const handleSaveQuiz = async (quiz: QuizQuestion) => {
    await saveQuizQuestion(quiz, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllQuizQuestions();
    setQuizzes(updated);
  };

  const handleDeleteQuiz = async (id: number) => {
    await deleteQuizQuestion(id, user?.email || 'admin@cybersafe.org');
    const updated = await fetchAllQuizQuestions();
    setQuizzes(updated);
  };

  const handleSaveAnnouncement = async (ann: PlatformAnnouncement) => {
    await saveAnnouncement(ann);
    const updated = await fetchAnnouncements();
    setAnnouncements(updated);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
    const updated = await fetchAnnouncements();
    setAnnouncements(updated);
  };

  const handleSaveSettings = async (newSettings: PlatformSystemSettings) => {
    await saveSystemSettings(newSettings);
    setSettings(newSettings);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleSaveReportingConfig = async (newConfig: any) => {
    await saveReportingConfig(newConfig, user?.email || 'admin@cybersafe.org');
    setReportingConfig(newConfig);
  };

  const handleUpdateUserStatus = async (uid: string, status: 'active' | 'disabled') => {
    await updateUserAccountStatus(uid, status);
    const updated = await fetchAdminUserList();
    setUsers(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleUpdateUserRole = async (uid: string, role: UserRole) => {
    await updateUserAccountRole(uid, role);
    const updated = await fetchAdminUserList();
    setUsers(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleTriggerPasswordReset = async (email: string) => {
    await sendResetEmail(email);
  };

  const handleInviteAdmin = async (email: string, displayName: string, role: AdminRole) => {
    await inviteAdminUser(email, displayName, role);
    const updated = await fetchAdminTeam();
    setAdminTeam(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleUpdateRole = async (uid: string, role: AdminRole) => {
    await updateAdminRole(uid, role);
    const updated = await fetchAdminTeam();
    setAdminTeam(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleToggleStatus = async (uid: string, status: 'active' | 'suspended') => {
    await toggleAdminStatus(uid, status);
    const updated = await fetchAdminTeam();
    setAdminTeam(updated);
    const logs = await fetchDetailedAuditLogs();
    setAuditLogs(logs);
  };

  const handleRefreshHealth = async () => {
    setIsRefreshing(true);
    try {
      const h = await runHealthDiagnostics();
      setHealthStatus(h);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          adminRole={adminRole}
          adminEmail={user?.email || 'admin@cybersafe.org'}
          onLogout={logout}
          onNavigateHome={onNavigateHome}
          pendingLocationsCount={pendingLocationsCount}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              collapsed={false}
              onToggleCollapse={() => {}}
              adminRole={adminRole}
              adminEmail={user?.email || 'admin@cybersafe.org'}
              onLogout={logout}
              onNavigateHome={onNavigateHome}
              pendingLocationsCount={pendingLocationsCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          adminRole={adminRole}
          adminEmail={user?.email || 'admin@cybersafe.org'}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateHome={onNavigateHome}
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
          maintenanceMode={settings.maintenanceMode}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverviewSection
              onNavigateTab={setActiveTab}
              users={users}
              threats={threats}
              methodologies={methodologies}
              quizzes={quizzes}
              locations={locations}
              auditLogs={auditLogs}
              healthStatus={healthStatus}
              onOpenNewThreatModal={() => setActiveTab('learning')}
              onOpenNewLocationModal={() => setActiveTab('locations')}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersSection
              users={users}
              onUpdateUserStatus={handleUpdateUserStatus}
              onUpdateUserRole={handleUpdateUserRole}
              onTriggerPasswordReset={handleTriggerPasswordReset}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'content' && (
            <AdminContentSection
              threats={threats}
              methodologies={methodologies}
              onSaveThreat={handleSaveThreat}
              onDeleteThreat={handleDeleteThreat}
              onSaveMethodology={handleSaveMethodology}
              onDeleteMethodology={handleDeleteMethodology}
              activeSubtype="all"
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'learning' && (
            <AdminContentSection
              threats={threats}
              methodologies={methodologies}
              onSaveThreat={handleSaveThreat}
              onDeleteThreat={handleDeleteThreat}
              onSaveMethodology={handleSaveMethodology}
              onDeleteMethodology={handleDeleteMethodology}
              activeSubtype="learning"
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'prevention' && (
            <AdminContentSection
              threats={threats}
              methodologies={methodologies}
              onSaveThreat={handleSaveThreat}
              onDeleteThreat={handleDeleteThreat}
              onSaveMethodology={handleSaveMethodology}
              onDeleteMethodology={handleDeleteMethodology}
              activeSubtype="prevention"
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'detection' && (
            <AdminDetectionSection
              metrics={detectionMetrics}
              settings={settings}
              onSaveSettings={handleSaveSettings}
              isAdmin={permissions.canManageSettings}
            />
          )}

          {activeTab === 'reports' && (
            <AdminReportsSection
              reportingConfig={reportingConfig}
              onSaveReportingConfig={handleSaveReportingConfig}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'locations' && (
            <AdminLocationsSection
              locations={locations}
              onSaveLocation={handleSaveLocation}
              onVerifyLocation={handleVerifyLocation}
              onArchiveLocation={handleArchiveLocation}
              globalSearch={globalSearch}
              isLocationManager={permissions.canManageLocations}
            />
          )}

          {activeTab === 'quizzes' && (
            <AdminQuizzesSection
              quizzes={quizzes}
              onSaveQuiz={handleSaveQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'announcements' && (
            <AdminAnnouncementsSection
              announcements={announcements}
              onSaveAnnouncement={handleSaveAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'analytics' && <AdminAnalyticsSection />}

          {activeTab === 'system' && (
            <AdminSystemHealthSection
              healthStatus={healthStatus}
              onRefreshHealth={handleRefreshHealth}
              isRefreshing={isRefreshing}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AdminAuditLogsSection
              logs={auditLogs}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'admins' && (
            <AdminManagementSection
              adminTeam={adminTeam}
              onInviteAdmin={handleInviteAdmin}
              onUpdateRole={handleUpdateRole}
              onToggleStatus={handleToggleStatus}
              currentAdminEmail={user?.email || ''}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsSection
              settings={settings}
              onSaveSettings={handleSaveSettings}
              isSuperAdmin={permissions.canManageAdmins}
            />
          )}
        </main>
      </div>
    </div>
  );
}
