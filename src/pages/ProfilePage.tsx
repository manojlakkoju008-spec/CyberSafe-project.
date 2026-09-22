import React from 'react';
import {
  User,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  LogOut,
  Sparkles,
  ArrowRight,
  Award,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface ProfilePageProps {
  onNavigateToChecklist: () => void;
  onNavigateToQuiz: () => void;
  onNavigateToAdmin: () => void;
  onNavigateHome: () => void;
}

export function ProfilePage({
  onNavigateToChecklist,
  onNavigateToQuiz,
  onNavigateToAdmin,
  onNavigateHome,
}: ProfilePageProps) {
  const { user, firebaseUser, isAdmin, logout } = useAuth();

  if (!firebaseUser) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center">
        <Card className="p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Not Signed In</h2>
          <p className="text-sm text-slate-600 mb-6">
            You are currently exploring in Guest Mode. Sign in to view your safety profile and quiz records.
          </p>
          <Button variant="primary" onClick={onNavigateHome} className="w-full justify-center">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    onNavigateHome();
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Member';

  const completedChecklistCount = user?.completedChecklistIds?.length || 0;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white">
            {(user?.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{user?.displayName || 'CyberSafe Member'}</h1>
              {isAdmin ? (
                <Badge variant="purple" className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                  Verified Admin
                </Badge>
              ) : (
                <Badge variant="blue" className="px-2.5 py-0.5 text-xs font-semibold">
                  Community Member
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <span>{firebaseUser.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500 text-xs">
                <Calendar className="w-3 h-3" />
                Joined {formattedDate}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button variant="primary" onClick={onNavigateToAdmin} className="text-xs">
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Admin Portal
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid: Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Checklist Progress */}
        <Card className="p-6 bg-white border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Personal Safety Habits</h3>
            <p className="text-xs text-slate-500 mb-4">Completed prevention hygiene items across accounts and devices.</p>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 mb-2">
              {completedChecklistCount} <span className="text-sm font-normal text-slate-500">/ 16 items</span>
            </div>
            <Button variant="outline" onClick={onNavigateToChecklist} className="w-full justify-center text-xs">
              Update Checklist &rarr;
            </Button>
          </div>
        </Card>

        {/* Card 2: Awareness Quiz Status */}
        <Card className="p-6 bg-white border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Awareness Assessments</h3>
            <p className="text-xs text-slate-500 mb-4">Realistic scenario tests identifying phishing, SMS scams & UPI fraud.</p>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 mb-2">
              10 <span className="text-sm font-normal text-slate-500">Scenarios Ready</span>
            </div>
            <Button variant="outline" onClick={onNavigateToQuiz} className="w-full justify-center text-xs">
              Take / Retake Quiz &rarr;
            </Button>
          </div>
        </Card>

        {/* Card 3: Security Posture */}
        <Card className="p-6 bg-slate-900 text-white border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Security Health Rating</h3>
            <p className="text-xs text-slate-400 mb-4">Calculated based on verified multi-factor adoption and device hygiene.</p>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active Community Protection</span>
            </div>
            <p className="text-[11px] text-slate-400">Zero data shared with commercial trackers.</p>
          </div>
        </Card>
      </div>

      {/* Account Info Details */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-4">Account Security Details</h3>
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-600">Email Address</span>
            <span className="font-mono text-xs font-semibold text-slate-800">{firebaseUser.email}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-600">Account Authorization</span>
            <span className="font-semibold text-slate-800 capitalize">{user?.role || 'Member'}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-600">Target User Persona</span>
            <span className="font-semibold text-slate-800 capitalize">{user?.userType || 'Individual'}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-slate-600">Authentication Method</span>
            <span className="text-xs font-medium text-slate-700">
              {firebaseUser.providerData[0]?.providerId === 'google.com' ? 'Google Sign-In' : 'Password Credentials'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
