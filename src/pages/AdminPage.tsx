import React, { useState } from 'react';
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
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface AdminPageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
}

export function AdminPage({ onNavigateHome, onNavigateToAuth }: AdminPageProps) {
  const { user, firebaseUser, isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'security'>('overview');

  // Unauthorized State Handler
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto animate-fadeIn">
        <Card className="p-8 text-center bg-white border-slate-200 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Administrator Access Required
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            This module is restricted to verified platform administrators. Your account does not currently hold administrative privileges.
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left mb-6 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Authenticated:</span>
              <span className="font-semibold text-slate-800">{isAuthenticated ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800">{firebaseUser?.email || 'Anonymous Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Effective Role:</span>
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

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administrative Control Center
            </h1>
            <Badge variant="purple" className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              Admin Session Active
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Platform governance, content auditing, and database-level security policy oversight.
          </p>
        </div>

        <Button variant="outline" onClick={onNavigateHome} className="text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Public View
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'content'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Curriculum & Content Inventory
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Security & Rules Audit
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Infrastructure Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase">Auth Backend</span>
                <Key className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">Firebase Auth</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active & Operational
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase">Persistent DB</span>
                <Database className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">Cloud Firestore</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Provisioned & Bound
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase">Security Rules</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">Version 2 Rules</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Deployed & Enforced
              </p>
            </Card>

            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase">Active Admin</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-sm font-bold text-slate-900 truncate" title={firebaseUser?.email || ''}>
                {firebaseUser?.email}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Role: Verified Platform Admin
              </p>
            </Card>
          </div>

          {/* Admin Identity & Security Policy */}
          <Card className="p-6 bg-slate-900 text-white border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Zero-Trust Administrative Safeguard</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              In accordance with CyberSafe security mandates, administrative privileges are not derived from editable client state.
              Authorization is bound directly to verified email claims and Firestore security rule predicates, preventing privilege escalation.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-slate-400">Enforcement Engine: </span>
                <span className="text-white font-mono">Firestore Rules Engine (v2)</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-slate-400">Admin Email: </span>
                <span className="text-white font-mono">{firebaseUser?.email}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Learning Catalog</h3>
              <Badge variant="blue">10 Active Guides</Badge>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Curated threats covering Phishing, Ransomware, UPI Scams, Identity Theft, and Social Engineering.
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between">
                <span>Threat Guides Available</span>
                <span className="font-bold">10 Guides</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between">
                <span>Safety Fundamentals</span>
                <span className="font-bold">10 Modules</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Assessment & Response</h3>
              <Badge variant="emerald">Operational</Badge>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Educational scenario tests and institutional emergency routing channels.
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between">
                <span>Awareness Quiz Scenarios</span>
                <span className="font-bold">10 Scenarios</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between">
                <span>Helpline Routing Hotline</span>
                <span className="font-bold text-rose-600">1930 Helpline</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <Card className="p-6 bg-white border-slate-200 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Security Architecture Audit</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Default-Deny Catch-All Rule</p>
                <p className="text-emerald-800 text-[11px]">
                  Match pattern <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">/{`{document=**}`}</code> strictly rejects all unauthorized read and write operations.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Anti-Privilege Escalation Gate</p>
                <p className="text-emerald-800 text-[11px]">
                  User profile writes mandate <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">role == 'member'</code> unless executed by verified administrative accounts.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Client Heuristic Isolation</p>
                <p className="text-emerald-800 text-[11px]">
                  URL detection engine parses strings locally in the browser sandbox without performing external network queries.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
