import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export function AuthPage({ initialMode = 'login', onSuccess, onNavigateHome }: AuthPageProps) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, sendResetEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'student' | 'individual' | 'senior' | 'educator'>('individual');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const getFriendlyAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address (e.g., yourname@domain.com).';
    }
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Incorrect email or password. Please re-check your details or use Forgot Password.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please switch to Sign In.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 8 characters long for adequate protection.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network communication failed. Please check your internet connection.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in was canceled before completing.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is configuring. Please use Google Sign-In or try again shortly.';
    }
    return err?.message || 'An unexpected authentication error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email format.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await sendResetEmail(email);
        setSuccessMessage('Password reset link sent! Check your inbox to set a new password.');
        setIsLoading(false);
      } catch (err) {
        setErrorMessage(getFriendlyAuthError(err));
        setIsLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onSuccess();
      } else {
        if (!displayName.trim()) {
          setErrorMessage('Please provide your name or alias.');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName, userType);
        onSuccess();
      }
    } catch (err) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      setErrorMessage(getFriendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Platform Badge & Context */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-4">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Academic Community Digital Protection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login' && 'Sign in to CyberSafe'}
          {mode === 'register' && 'Create Your Free Safety Profile'}
          {mode === 'forgot' && 'Reset Your Password'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Save your personal security checklists, track awareness quiz progress, and access customized defense guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Educational Security Commitments */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 bg-slate-900 text-slate-100 border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Our Privacy Guarantee</h3>
                <p className="text-xs text-slate-400">Strict Non-Commercial Platform</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Personal Profiling:</strong> We never sell, rent, or monetize your safety data or browsing habits.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Unnecessary Data:</strong> We never demand phone numbers, physical addresses, or sensitive credentials.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Encrypted Account Records:</strong> Passwords are protected via industry-standard cryptographic hashing.</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Public content is always free</span>
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Browse as Guest &rarr;
              </button>
            </div>
          </Card>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Community Awareness Notice</p>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                CyberSafe is an educational initiative. You can browse all threat guides, checklists, and the detector without logging in.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7">
          <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm">
            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all text-center ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all text-center ${
                    mode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* 1-Click Google Sign In */}
            {mode !== 'forgot' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative px-3 bg-white text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Or with email credentials
                  </span>
                </div>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name or Alias <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Sharma"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Primary User Category <span className="text-slate-400 font-normal">(for tailored safety guides)</span>
                    </label>
                    <select
                      value={userType}
                      onChange={(e: any) => setUserType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    >
                      <option value="individual">General Individual / Home User</option>
                      <option value="student">Student / Academic Learner</option>
                      <option value="senior">Senior Citizen / Elder Protection</option>
                      <option value="educator">Educator / Community Volunteer</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-2.5 text-sm font-semibold shadow-xs"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : mode === 'login' ? (
                    <span className="flex items-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : mode === 'register' ? (
                    <span className="flex items-center gap-2">
                      <span>Complete Registration</span>
                      <Sparkles className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Send Password Reset Link</span>
                      <KeyRound className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {mode === 'forgot' && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
