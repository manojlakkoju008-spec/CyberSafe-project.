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
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#E5E7EB]">
      {/* Top Academic Community Banner */}
      <div className="bg-[#0B1F33] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#19A974]"></span>
            <span className="font-semibold text-white tracking-tight">Cyber Safety Awareness & Cybercrime Prevention Platform</span>
            <span className="hidden md:inline text-slate-400 font-normal">· Academic Community Initiative</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300 text-xs">
            <span className="text-slate-400">Public Service Resource</span>
            <button 
              type="button"
              onClick={onOpenEmergency}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
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
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1261A0] text-white flex items-center justify-center shadow-xs group-hover:bg-[#0E4D80] transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#0B1F33]">
                  Cyber<span className="text-[#1261A0]">Safe</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 text-[#0B1F33] border border-[#E5E7EB]">
                  Community Ed.
                </span>
              </div>
              <p className="text-[11px] text-[#667085] font-medium hidden sm:block">Digital Safety for Everyone</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1261A0] bg-[#1261A0]/8 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#1261A0] after:rounded-full'
                      : 'text-[#667085] hover:text-[#0B1F33] hover:bg-[#F7F9FC]'
                  }`}
                >
                  <span className={isActive ? 'text-[#1261A0]' : 'text-[#667085]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Link if admin */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider ${
                  currentPage === 'admin'
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-slate-100 text-[#0B1F33] hover:bg-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Action & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Guide Navigation Trigger */}
            <button
              type="button"
              onClick={() => openGuide()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F9FC] hover:bg-slate-100 text-[#0B1F33] border border-[#E5E7EB] text-xs font-semibold cursor-pointer transition-colors shadow-2xs select-none"
              title="Open CyberSafe AI Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1261A0]" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#19A974]"></span>
            </button>

            <Button
              variant="outline"
              size="sm"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-[#DC3545]" />}
              onClick={onOpenEmergency}
              className="text-xs sm:text-sm font-semibold border-rose-200 text-[#DC3545] hover:bg-rose-50/60"
            >
              <span className="hidden sm:inline">Emergency Help</span>
              <span className="sm:hidden">Urgent</span>
            </Button>

            {/* Authentication / Profile State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-slate-300 bg-white hover:bg-[#F7F9FC] transition cursor-pointer text-xs font-semibold text-[#0B1F33]"
                >
                  <div className="w-7 h-7 rounded-md bg-[#1261A0] text-white flex items-center justify-center font-bold text-xs">
                    {(user?.displayName || firebaseUser?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user?.displayName || 'My Profile'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-md border border-[#E5E7EB] py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#E5E7EB]">
                      <p className="font-bold text-[#0B1F33] truncate">{user?.displayName || 'CyberSafe Member'}</p>
                      <p className="text-[#667085] truncate">{firebaseUser?.email}</p>
                      <div className="mt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-[#EBF5FB] text-[#0C4A7A]'
                        }`}>
                          {user?.role || 'Member'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#14202B] hover:bg-[#F7F9FC] text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#667085]" />
                      <span>Account Safety Profile</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleNavClick('admin')}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#0B1F33] hover:bg-[#F7F9FC] text-left font-semibold cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-[#1261A0]" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-[#E5E7EB] my-1"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#DC3545] hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#DC3545]" />
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
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#14202B] hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#1261A0] text-white'
                    : 'text-[#14202B] hover:bg-[#F7F9FC]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile AI Guide Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openGuide();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#F7F9FC] text-[#0B1F33] border border-[#E5E7EB] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#1261A0]" />
            <span>CyberSafe AI Assistant</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'admin'
                  ? 'bg-[#0B1F33] text-white'
                  : 'bg-slate-100 text-[#0B1F33]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Admin Control Center</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#14202B] hover:bg-[#F7F9FC]"
              >
                <UserIcon className="w-4 h-4 text-[#1261A0]" />
                <span>My Safety Profile ({user?.displayName || firebaseUser?.email})</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#DC3545] hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-[#DC3545]" />
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
