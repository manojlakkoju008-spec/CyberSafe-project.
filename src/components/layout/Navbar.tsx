import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  CheckSquare, 
  Search, 
  FileWarning, 
  HelpCircle, 
  AlertTriangle,
  Menu, 
  X, 
  Home,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Lock,
  Sparkles,
} from 'lucide-react';
import { PageType } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useAiGuide } from '../../context/AiGuideContext';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenEmergency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, firebaseUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { openGuide } = useAiGuide();

  const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'prevent', label: 'Prevent', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'detect', label: 'Detect', icon: <Search className="w-4 h-4" /> },
    { id: 'report', label: 'Report', icon: <FileWarning className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Academic Community Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-200">Cyber Safety Awareness & Cybercrime Prevention Platform</span>
            <span className="hidden md:inline text-slate-400">• Academic Community Initiative</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
            <span>Non-Commercial Public Service</span>
            <button 
              onClick={onOpenEmergency}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Suspect an active hack?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Cyber<span className="text-blue-600">Safe</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Community Ed.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Digital Safety for Everyone</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Link if admin */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider ${
                  currentPage === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Action & User Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Guide Navigation Trigger */}
            <button
              onClick={() => openGuide()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-800 border border-blue-200/90 text-xs font-bold cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-95 select-none"
              title="Open CyberSafe AI Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="hidden sm:inline">AI Guide</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            </button>

            <Button
              variant="outline"
              size="sm"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
              onClick={onOpenEmergency}
              className="text-xs sm:text-sm font-medium border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <span className="hidden sm:inline">Emergency Help</span>
              <span className="sm:hidden">Urgent</span>
            </Button>

            {/* Authentication / Profile State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer text-xs font-semibold text-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {(user?.displayName || firebaseUser?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user?.displayName || 'My Profile'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fadeIn text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user?.displayName || 'CyberSafe Member'}</p>
                      <p className="text-slate-500 truncate">{firebaseUser?.email}</p>
                      <div className="mt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user?.role || 'Member'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>Account Safety Profile</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 text-left font-semibold cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-purple-600" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleNavClick('auth')}
                className="text-xs sm:text-sm font-semibold"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile AI Guide Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openGuide();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>CyberSafe AI Guide</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                currentPage === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Admin Control Center</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span>My Safety Profile ({user?.displayName || firebaseUser?.email})</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => handleNavClick('auth')}
              >
                Sign In / Register
              </Button>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="danger"
              size="md"
              className="w-full"
              icon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergency();
              }}
            >
              Suspect an Active Hack? (Emergency Triage)
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
