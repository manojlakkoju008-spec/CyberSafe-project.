import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Users,
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Key,
  Layers,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  PhoneCall,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  Clock,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ThreatItem, SecurityMethodologyGuide, QuizQuestion, ContentAuditLog } from '../types';
import {
  fetchAllThreats,
  saveThreat,
  deleteThreat,
  toggleThreatPublish,
  fetchAllMethodologies,
  saveMethodology,
  deleteMethodology,
  toggleMethodologyPublish,
  fetchAllQuizQuestions,
  saveQuizQuestion,
  deleteQuizQuestion,
  toggleQuizPublish,
  fetchReportingConfig,
  saveReportingConfig,
  getAuditLogs,
} from '../services/contentService';
import { AdminThreatModal } from '../components/admin/AdminThreatModal';
import { AdminMethodologyModal } from '../components/admin/AdminMethodologyModal';
import { AdminQuizModal } from '../components/admin/AdminQuizModal';
import { AdminDeleteConfirmModal } from '../components/admin/AdminDeleteConfirmModal';

interface AdminPageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
}

type AdminTab = 'overview' | 'threats' | 'methodologies' | 'quiz' | 'reporting' | 'security';

export function AdminPage({ onNavigateHome, onNavigateToAuth }: AdminPageProps) {
  const { user, firebaseUser, isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data states
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [methodologies, setMethodologies] = useState<SecurityMethodologyGuide[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [reportingConfig, setReportingConfig] = useState({
    helplineNumber: '1930',
    helplineName: 'National Cyber Crime Reporting Helpline',
    helplineShortDesc: 'Toll-free 24/7 emergency response for citizen financial cyber fraud and immediate interbank liaison',
    portalUrl: 'https://cybercrime.gov.in/',
    portalLabel: 'Official Government Portal',
    portalName: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
    disclaimerTitle: 'Official Reporting Notice & Advisory Boundary',
    disclaimer: 'CyberSafe is an academic community project and is NOT affiliated with the Government of India, police departments, or any official law enforcement authority. CyberSafe does not accept, record, or submit cybercrime reports.',
    updatedAt: new Date().toISOString(),
  });
  const [auditLogList, setAuditLogList] = useState<ContentAuditLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter states
  const [threatSearch, setThreatSearch] = useState('');
  const [threatCategoryFilter, setThreatCategoryFilter] = useState('all');
  const [quizSearch, setQuizSearch] = useState('');
  const [quizTopicFilter, setQuizTopicFilter] = useState('all');
  const [quizDifficultyFilter, setQuizDifficultyFilter] = useState('all');
  const [quizStatusFilter, setQuizStatusFilter] = useState('all');

  // Modals state
  const [threatModalOpen, setThreatModalOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);

  const [methodologyModalOpen, setMethodologyModalOpen] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState<SecurityMethodologyGuide | null>(null);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuizQuestion, setSelectedQuizQuestion] = useState<QuizQuestion | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string | number;
    title: string;
    type: 'threat' | 'methodology' | 'quiz';
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load initial content
  const loadAllContent = async () => {
    setIsLoadingData(true);
    try {
      const [tList, mList, qList, rConfig] = await Promise.all([
        fetchAllThreats(),
        fetchAllMethodologies(),
        fetchAllQuizQuestions(),
        fetchReportingConfig(),
      ]);
      setThreats(tList);
      setMethodologies(mList);
      setQuizQuestions(qList);
      setReportingConfig(rConfig as any);
      setAuditLogList(getAuditLogs());
    } catch (err) {
      console.error('Error loading admin content:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllContent();
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ====================================================
  // THREAT ACTIONS
  // ====================================================
  const handleOpenCreateThreat = () => {
    setSelectedThreat(null);
    setThreatModalOpen(true);
  };

  const handleOpenEditThreat = (t: ThreatItem) => {
    setSelectedThreat(t);
    setThreatModalOpen(true);
  };

  const handleSaveThreat = async (t: ThreatItem) => {
    await saveThreat(t, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast(`Threat resource "${t.title}" saved successfully.`);
  };

  const handleToggleThreatPublish = async (id: string) => {
    await toggleThreatPublish(id, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast('Threat publication status toggled.');
  };

  // ====================================================
  // METHODOLOGY ACTIONS
  // ====================================================
  const handleOpenCreateMethodology = () => {
    setSelectedMethodology(null);
    setMethodologyModalOpen(true);
  };

  const handleOpenEditMethodology = (m: SecurityMethodologyGuide) => {
    setSelectedMethodology(m);
    setMethodologyModalOpen(true);
  };

  const handleSaveMethodology = async (m: SecurityMethodologyGuide) => {
    await saveMethodology(m, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast(`Prevention methodology "${m.title}" saved successfully.`);
  };

  const handleToggleMethodologyPublish = async (id: string) => {
    await toggleMethodologyPublish(id, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast('Methodology publication status toggled.');
  };

  // ====================================================
  // QUIZ ACTIONS
  // ====================================================
  const handleOpenCreateQuiz = () => {
    setSelectedQuizQuestion(null);
    setQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (q: QuizQuestion) => {
    setSelectedQuizQuestion(q);
    setQuizModalOpen(true);
  };

  const handleSaveQuiz = async (q: QuizQuestion) => {
    await saveQuizQuestion(q, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast(`Quiz question #${q.id} saved successfully.`);
  };

  const handleToggleQuizPublish = async (id: number) => {
    await toggleQuizPublish(id, firebaseUser?.email || 'admin');
    await loadAllContent();
    showToast('Quiz question status toggled.');
  };

  // ====================================================
  // DELETE DISPATCHER
  // ====================================================
  const handlePromptDelete = (
    id: string | number,
    title: string,
    type: 'threat' | 'methodology' | 'quiz'
  ) => {
    setItemToDelete({ id, title, type });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const adminId = firebaseUser?.email || 'admin';
      if (itemToDelete.type === 'threat') {
        await deleteThreat(String(itemToDelete.id), adminId);
      } else if (itemToDelete.type === 'methodology') {
        await deleteMethodology(String(itemToDelete.id), adminId);
      } else if (itemToDelete.type === 'quiz') {
        await deleteQuizQuestion(Number(itemToDelete.id), adminId);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await loadAllContent();
      showToast(`Deleted ${itemToDelete.type} permanently.`);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ====================================================
  // REPORTING CONFIG ACTIONS
  // ====================================================
  const handleSaveReporting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveReportingConfig(reportingConfig, firebaseUser?.email || 'admin');
      showToast('Reporting guidance and helpline configurations saved.');
    } catch (err) {
      console.error('Error saving reporting config:', err);
    }
  };

  // ====================================================
  // ACCESS CONTROL GATE
  // ====================================================
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto animate-fadeIn">
        <Card className="p-8 text-center bg-white border-slate-200 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Administrator Access Required
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            The CyberSafe Educational Administration Panel is restricted exclusively to authorized staff and faculty administrators.
            Backend Firestore security rules reject all non-admin write operations.
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left mb-6 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Authentication:</span>
              <span className="font-semibold text-slate-800">{isAuthenticated ? 'Signed In' : 'Unauthenticated'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800">{firebaseUser?.email || 'Guest Visitor'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Authorization:</span>
              <span className="font-semibold text-rose-600 capitalize">{user?.role || 'Guest'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={onNavigateHome} className="justify-center text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Return to Public Platform
            </Button>
            {!isAuthenticated && (
              <Button variant="primary" onClick={onNavigateToAuth} className="justify-center text-xs">
                Sign In with Admin Account
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Filtered threats
  const filteredThreats = threats.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(threatSearch.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(threatSearch.toLowerCase());
    const matchesCategory = threatCategoryFilter === 'all' || t.category === threatCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered quizzes
  const filteredQuizzes = quizQuestions.filter((q) => {
    const searchLower = quizSearch.toLowerCase();
    const matchesSearch =
      !quizSearch ||
      q.title.toLowerCase().includes(searchLower) ||
      q.scenario.toLowerCase().includes(searchLower) ||
      (q.educationalTakeaway || q.takeaway || '').toLowerCase().includes(searchLower);
    const matchesTopic =
      quizTopicFilter === 'all' ||
      q.topic === quizTopicFilter ||
      q.category === quizTopicFilter;
    const matchesDifficulty =
      quizDifficultyFilter === 'all' || q.difficulty === quizDifficultyFilter;
    const matchesStatus =
      quizStatusFilter === 'all' || (q.status || 'published') === quizStatusFilter;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn text-slate-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Educational Content Administration
            </h1>
            <Badge variant="purple" className="text-[11px] font-bold uppercase tracking-wider">
              Admin Session
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Publish, curate, and audit threat guides, prevention methodologies, scenario assessments, and emergency routing directives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllContent}
            disabled={isLoadingData}
            title="Refresh database records"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>
          <Button variant="outline" onClick={onNavigateHome} className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Exit to Public View
          </Button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-px mb-8 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('threats')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'threats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Threat Guides ({threats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('methodologies')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'methodologies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prevention Frameworks ({methodologies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'quiz'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz Scenarios ({quizQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reporting')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'reporting'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Reporting & Helpline</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security Rules & RBAC</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Inventory Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Threat Catalog</span>
                <ShieldAlert className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{threats.length} Guides</div>
              <p className="text-[11px] text-slate-500 mt-1">
                {threats.filter((t) => t.status !== 'draft').length} published • {threats.filter((t) => t.status === 'draft').length} draft
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Methodologies</span>
                <Layers className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{methodologies.length} Frameworks</div>
              <p className="text-[11px] text-slate-500 mt-1">
                NIST CSF 2.0 & Citizen Zero-Trust
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Quiz Challenges</span>
                <HelpCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{quizQuestions.length} Scenarios</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Interactive real-world assessments
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">National Helpline</span>
                <PhoneCall className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{reportingConfig.helplineNumber}</div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {reportingConfig.portalLabel}
              </p>
            </Card>
          </div>

          {/* Quick Action Shortcuts */}
          <Card className="p-6 bg-slate-900 text-white border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Curriculum Quick Actions</h3>
            <p className="text-xs text-slate-400 mb-5">
              Create and deploy verified cybersecurity educational material across the platform in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={handleOpenCreateThreat}
                className="text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Threat Guide</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenCreateMethodology}
                className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-750 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prevention Methodology</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenCreateQuiz}
                className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-750 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quiz Scenario</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('reporting')}
                className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-750 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Configure Emergency Directives</span>
              </Button>
            </div>
          </Card>

          {/* Recent Activity / Audit Log */}
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Content Audit Records</h3>
                <p className="text-xs text-slate-500">Immutable administrative actions logged on the platform</p>
              </div>
              <Badge variant="neutral" className="text-xs">
                {auditLogList.length} Events Logged
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogList.slice(0, 6).map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      log.action === 'create' ? 'bg-emerald-500' :
                      log.action === 'delete' ? 'bg-rose-500' :
                      log.action === 'publish' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></span>
                    <span className="font-semibold text-slate-800">{log.changeSummary}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="font-mono">{log.adminId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: THREAT GUIDES (LEARN) */}
      {/* ==================================================== */}
      {activeTab === 'threats' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={threatSearch}
                  onChange={(e) => setThreatSearch(e.target.value)}
                  placeholder="Search threat catalog..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <select
                value={threatCategoryFilter}
                onChange={(e) => setThreatCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Deception & Fraud">Deception & Fraud</option>
                <option value="Financial Scams">Financial Scams</option>
                <option value="Malicious Software">Malicious Software</option>
                <option value="Privacy & Identity">Privacy & Identity</option>
                <option value="Network & Infrastructure">Network & Infrastructure</option>
              </select>
            </div>

            <Button variant="primary" onClick={handleOpenCreateThreat} className="text-xs flex items-center gap-1.5 justify-center">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Threat Guide</span>
            </Button>
          </div>

          {/* Table / List */}
          <Card className="bg-white border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Threat Title & Slug</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Severity</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Red Flags / Steps</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        No threat guides found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredThreats.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 text-sm">{t.title}</div>
                          <div className="font-mono text-[10px] text-slate-400">id: {t.id}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{t.category}</td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={
                              t.severity === 'critical'
                                ? 'danger'
                                : t.severity === 'high'
                                ? 'warning'
                                : t.severity === 'medium'
                                ? 'info'
                                : 'neutral'
                            }
                            className="capitalize text-[11px] font-bold"
                          >
                            {t.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleThreatPublish(t.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                              t.status === 'draft'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {t.status === 'draft' ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Published</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {t.redFlags?.length || 0} flags • {t.actionSteps?.length || 0} steps
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditThreat(t)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handlePromptDelete(t.id, t.title, 'threat')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: PREVENTION METHODOLOGIES */}
      {/* ==================================================== */}
      {activeTab === 'methodologies' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Prevention Methodologies & Frameworks</h2>
              <p className="text-xs text-slate-500">Curate structured security standards and multi-phase implementation roadmaps.</p>
            </div>
            <Button variant="primary" onClick={handleOpenCreateMethodology} className="text-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Framework Guide</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodologies.map((m) => (
              <Card key={m.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant="purple" className="text-[11px] font-bold">
                      {m.standard}
                    </Badge>
                    <button
                      onClick={() => handleToggleMethodologyPublish(m.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition ${
                        m.status === 'draft'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {m.status === 'draft' ? 'Draft' : 'Published'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">{m.summary}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4 space-y-1 text-slate-600">
                    <div className="font-semibold text-slate-800">Target: {m.targetAudience}</div>
                    <div>Phases: {m.phases?.length || 0} implementation stages</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditMethodology(m)}
                    className="text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptDelete(m.id, m.title, 'methodology')}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: QUIZ QUESTIONS */}
      {/* ==================================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quiz Scenarios Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Total Scenarios</span>
              <span className="text-lg font-bold text-slate-900">{quizQuestions.length}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Published</span>
              <span className="text-lg font-bold text-emerald-600">
                {quizQuestions.filter((q) => q.status !== 'draft').length}
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Drafts</span>
              <span className="text-lg font-bold text-amber-600">
                {quizQuestions.filter((q) => q.status === 'draft').length}
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-500 font-medium block">Categories Covered</span>
              <span className="text-lg font-bold text-indigo-600">
                {new Set(quizQuestions.map((q) => q.category || q.topic)).size} / 12
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  placeholder="Search scenarios, prompts, takeaways..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <select
                value={quizTopicFilter}
                onChange={(e) => setQuizTopicFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All 12 Categories</option>
                <option value="Phishing">Phishing</option>
                <option value="Password Security">Password Security</option>
                <option value="Account Security">Account Security</option>
                <option value="Online Scams">Online Scams</option>
                <option value="Social Engineering">Social Engineering</option>
                <option value="Financial Fraud">Financial Fraud</option>
                <option value="Privacy">Privacy</option>
                <option value="Social Media Safety">Social Media Safety</option>
                <option value="Mobile Security">Mobile Security</option>
                <option value="Safe Browsing">Safe Browsing</option>
                <option value="Malware Awareness">Malware Awareness</option>
                <option value="Identity Theft">Identity Theft</option>
              </select>

              <select
                value={quizDifficultyFilter}
                onChange={(e) => setQuizDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={quizStatusFilter}
                onChange={(e) => setQuizStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <Button variant="primary" onClick={handleOpenCreateQuiz} className="text-xs flex items-center gap-1.5 justify-center shrink-0">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scenario Question</span>
            </Button>
          </div>

          <Card className="bg-white border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5"># / Title</th>
                    <th className="px-4 py-3.5">Topic</th>
                    <th className="px-4 py-3.5">Difficulty</th>
                    <th className="px-4 py-3.5">Correct Answer Preview</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        No quiz questions found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQuizzes.map((q) => {
                      const correctChoice = q.options?.find((o) => o.isCorrect);
                      return (
                        <tr key={q.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900 text-sm">
                              #{q.id} {q.title}
                            </div>
                            <div className="text-slate-500 text-[11px] line-clamp-1 max-w-md">
                              {q.scenario}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="blue" className="text-[11px] font-semibold">
                              {q.topic}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="capitalize font-semibold text-slate-700">
                              {q.difficulty || 'intermediate'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-emerald-700 max-w-xs truncate" title={correctChoice?.text}>
                            <span className="font-bold uppercase mr-1">[{correctChoice?.id}]:</span>
                            <span>{correctChoice?.text || 'None marked'}</span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleToggleQuizPublish(q.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                                q.status === 'draft'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {q.status === 'draft' ? 'Draft' : 'Published'}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditQuiz(q)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePromptDelete(q.id, q.title, 'quiz')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: REPORTING & HELPLINE GUIDANCE */}
      {/* ==================================================== */}
      {activeTab === 'reporting' && (
        <div className="max-w-3xl space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-slate-900">National Helpline & Emergency Resource Directives</h2>
            <p className="text-xs text-slate-500">
              Configure official statutory phone numbers, portal links, and the non-affiliated academic community disclaimer.
            </p>
          </div>

          <Card className="p-6 bg-white border-slate-200">
            <form onSubmit={handleSaveReporting} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Emergency Helpline Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reportingConfig.helplineNumber}
                    onChange={(e) => setReportingConfig({ ...reportingConfig, helplineNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-rose-600 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">e.g. 1930 (National Cyber Crime Helpline)</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Helpline Agency Label</label>
                  <input
                    type="text"
                    required
                    value={reportingConfig.helplineName}
                    onChange={(e) => setReportingConfig({ ...reportingConfig, helplineName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Government Portal URL</label>
                  <input
                    type="url"
                    required
                    value={reportingConfig.portalUrl}
                    onChange={(e) => setReportingConfig({ ...reportingConfig, portalUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portal Display Title</label>
                  <input
                    type="text"
                    required
                    value={reportingConfig.portalName}
                    onChange={(e) => setReportingConfig({ ...reportingConfig, portalName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Statutory Academic Disclaimer Notice
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportingConfig.disclaimer}
                  onChange={(e) => setReportingConfig({ ...reportingConfig, disclaimer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" type="submit" className="text-xs flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Emergency Directives</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: SECURITY & AUDIT */}
      {/* ==================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fadeIn max-w-4xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Security Architecture & Database Rules Audit</h2>
            <p className="text-xs text-slate-500">
              Zero-trust authorization policy enforced directly at the Cloud Firestore database layer.
            </p>
          </div>

          <Card className="p-6 bg-white border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Verified Platform Administrator</h3>
                <p className="text-xs text-slate-500">Authenticated via Firebase Authentication with token claims</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Admin Identity:</span>
                <span className="font-bold text-slate-900">{firebaseUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admin UID:</span>
                <span className="font-bold text-slate-900">{firebaseUser?.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Firestore Rules Version:</span>
                <span className="font-bold text-emerald-600">rules_version = '2' (Deployed)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Policy Rules</h4>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                <pre>{`match /content_threats/{threatId} {
  allow read: if isValidId(threatId);
  allow write: if isAdmin() && isValidId(threatId);
}
match /content_preventions/{prevId} {
  allow read: if isValidId(prevId);
  allow write: if isAdmin() && isValidId(prevId);
}
match /content_quiz/{quizId} {
  allow read: if isValidId(quizId);
  allow write: if isAdmin() && isValidId(quizId);
}`}</pre>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODALS */}
      {/* ==================================================== */}
      <AdminThreatModal
        isOpen={threatModalOpen}
        threat={selectedThreat}
        onSave={handleSaveThreat}
        onClose={() => setThreatModalOpen(false)}
      />

      <AdminMethodologyModal
        isOpen={methodologyModalOpen}
        methodology={selectedMethodology}
        onSave={handleSaveMethodology}
        onClose={() => setMethodologyModalOpen(false)}
      />

      <AdminQuizModal
        isOpen={quizModalOpen}
        question={selectedQuizQuestion}
        existingQuestionsCount={quizQuestions.length}
        onSave={handleSaveQuiz}
        onClose={() => setQuizModalOpen(false)}
      />

      <AdminDeleteConfirmModal
        isOpen={deleteModalOpen}
        itemTitle={itemToDelete?.title || ''}
        itemType={itemToDelete?.type === 'threat' ? 'Threat Guide' : itemToDelete?.type === 'methodology' ? 'Methodology' : 'Quiz Question'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
