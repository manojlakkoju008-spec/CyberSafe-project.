import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  CheckSquare, 
  Search, 
  FileWarning, 
  HelpCircle, 
  AlertTriangle,
  Lock,
  Smartphone,
  Key,
  Shield,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  Bot
} from 'lucide-react';
import { PageType } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { THREATS_DATA } from '../data/threatsData';
import { useAiGuide } from '../context/AiGuideContext';

interface HomePageProps {
  onNavigate: (page: PageType, filterQuery?: string) => void;
  onOpenEmergency: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenEmergency }) => {
  const { openGuide } = useAiGuide();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('learn', searchQuery.trim());
    } else {
      onNavigate('learn');
    }
  };

  const coreTools = [
    {
      page: 'learn' as PageType,
      title: 'Threat Intelligence & Basics',
      desc: 'Explore 10 major threat blueprints and 10 foundational digital safety practices with real-world examples and red flags.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      badge: '10 Threats & 10 Basics',
      badgeVariant: 'info' as const
    },
    {
      page: 'prevent' as PageType,
      title: 'Digital Safety Health Checklist',
      desc: 'Interactive 16-point security self-audit that calculates your personal protection score and produces custom remediation steps.',
      icon: <CheckSquare className="w-6 h-6 text-emerald-600" />,
      badge: 'Interactive Score (0-100%)',
      badgeVariant: 'safe' as const
    },
    {
      page: 'detect' as PageType,
      title: 'Link & Message Risk Analyzer',
      desc: 'Client-side heuristic engine to scan suspicious URLs, email extracts, and SMS text messages for phishing and homoglyph traps.',
      icon: <Search className="w-6 h-6 text-amber-600" />,
      badge: 'Heuristic Threat Scanner',
      badgeVariant: 'warning' as const
    },
    {
      page: 'report' as PageType,
      title: 'Incident Guidance & Triage',
      desc: 'Victim emergency response wizard with 15-minute containment actions, evidence guides, and official federal reporting portals.',
      icon: <FileWarning className="w-6 h-6 text-rose-600" />,
      badge: 'Emergency Triage & Templates',
      badgeVariant: 'danger' as const
    },
    {
      page: 'quiz' as PageType,
      title: 'Awareness Readiness Assessment',
      desc: 'Test your scam-detection instincts through 10 real-world scenarios with instant pedagogical explanations and scoring.',
      icon: <HelpCircle className="w-6 h-6 text-indigo-600" />,
      badge: '10 Scenario Challenges',
      badgeVariant: 'info' as const
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border border-blue-100/80 rounded-3xl p-6 sm:p-12 shadow-xs">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Academic Community Initiative • Public Digital Literacy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Calm, Practical Digital Safety for Everyday People.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              CyberSafe equips internet users with practical habits to outsmart phishing, secure accounts and personal devices, analyze suspicious links, and take rapid containment action during cyber incidents.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search threats, red flags, or safety habits (e.g. ransomware, MFA, Zelle)..."
                  className="w-full pl-11 pr-28 py-3.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-600">Popular:</span>
                {['Phishing', 'Passphrases', 'Public Wi-Fi', 'SMS Scams', 'Ransomware'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onNavigate('learn', term)}
                    className="hover:text-blue-600 underline cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button
                variant="secondary"
                size="md"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => onNavigate('prevent')}
              >
                Start Safety Checklist & Score
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={<Search className="w-4 h-4 text-slate-600" />}
                onClick={() => onNavigate('detect')}
              >
                Inspect Suspicious URL or Text
              </Button>
              <Button
                variant="ghost"
                size="md"
                icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
                onClick={onOpenEmergency}
                className="text-rose-700 hover:bg-rose-50"
              >
                I Suspect an Active Breach
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CyberSafe AI Guide Intelligent Assistant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-800/40 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Intelligent Cybersecurity & Incident Layer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Meet CyberSafe AI Guide
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Not sure what to do? Describe any suspicious situation, scam message, or incident. CyberSafe AI Guide provides calm, structured steps, preserves necessary evidence, and guides you to the right tools.
              </p>

              {/* Sample Prompt Chips */}
              <div className="pt-2">
                <span className="text-xs text-blue-200 font-semibold block mb-2">Try asking directly:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'I received a message saying my bank account will be blocked.',
                    'I lost money through UPI.',
                    'My Instagram account was hacked.',
                    'I clicked a suspicious link.',
                    'I gave someone my OTP by mistake.',
                    'Teach me how phishing works.',
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => openGuide(sample)}
                      className="text-xs bg-slate-800/90 hover:bg-blue-600/90 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 hover:border-blue-400 transition-all cursor-pointer text-left"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => openGuide()}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open CyberSafe AI Guide</span>
              </button>
              <button
                onClick={() => openGuide('I think I have been scammed. What should I do right now?')}
                className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Emergency Incident Triage</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Capabilities</h2>
            <p className="text-sm text-slate-600">Everything you need to learn, audit, detect, and resolve cyber risks in one place.</p>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full w-fit">
            Academic Community Project Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTools.map((tool) => (
            <Card
              key={tool.page}
              hoverable
              onClick={() => onNavigate(tool.page)}
              className="p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <Badge variant={tool.badgeVariant} size="sm">
                    {tool.badge}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Access module</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* The 3 Golden Rules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Core Foundations</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">The 3 Golden Rules of Everyday Safety</h2>
            <p className="text-sm text-slate-400">
              According to cybersecurity research, adhering consistently to these three simple habits eliminates over 90% of consumer cyber incidents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Unique Passphrases + Vault</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never reuse passwords. Use 4-word random passphrases (e.g. <span className="text-blue-300 font-mono">sunset-tulip-rocket-gravel</span>) stored securely inside a modern password manager.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">MFA Everywhere</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Turn on Multi-Factor Authentication on your primary email, banking, and social accounts. Stolen passwords alone cannot breach an MFA-protected account.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Auto-Updates Turned On</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enable automatic system and application updates on your phone and laptop. Security patches close the exact holes cybercriminals exploit with automated malware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Threat Spotlights</h2>
            <p className="text-sm text-slate-600">Deep-dive into the four most widespread threats targeting everyday internet users right now.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('learn')}
          >
            Explore all 10 threat guides
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {THREATS_DATA.slice(0, 4).map((threat) => (
            <Card
              key={threat.id}
              hoverable
              onClick={() => onNavigate('learn', threat.id)}
              className="p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={threat.severity === 'critical' ? 'danger' : 'warning'} size="sm">
                    {threat.severity.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">{threat.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600">
                  {threat.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {threat.shortDesc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600">
                <span>View Red Flags & Defenses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency Response Triage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Are you dealing with an active cyber incident?</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                If your account was hijacked, your device locked by ransomware, or you entered banking details into a phishing site, access our Step-by-Step Triage Wizard for immediate containment and official report links.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              variant="danger"
              size="md"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => onNavigate('report')}
            >
              Open Incident Report Wizard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
