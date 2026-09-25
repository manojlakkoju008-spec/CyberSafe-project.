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
  ChevronRight,
  Sparkles,
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
      icon: <BookOpen className="w-5 h-5 text-[#1261A0]" />,
      badge: '10 Threats · 10 Basics',
      badgeVariant: 'info' as const
    },
    {
      page: 'prevent' as PageType,
      title: 'Digital Safety Health Checklist',
      desc: 'Interactive 16-point security self-audit that calculates your personal protection score and produces custom remediation steps.',
      icon: <CheckSquare className="w-5 h-5 text-[#19A974]" />,
      badge: 'Interactive Score 0-100%',
      badgeVariant: 'safe' as const
    },
    {
      page: 'detect' as PageType,
      title: 'Link & Message Risk Analyzer',
      desc: 'Client-side heuristic engine to scan suspicious URLs, email extracts, and SMS text messages for phishing and homoglyph traps.',
      icon: <Search className="w-5 h-5 text-[#F59E0B]" />,
      badge: 'Heuristic Threat Scanner',
      badgeVariant: 'warning' as const
    },
    {
      page: 'report' as PageType,
      title: 'Incident Guidance & Triage',
      desc: 'Victim emergency response wizard with 15-minute containment actions, evidence guides, and official federal reporting portals.',
      icon: <FileWarning className="w-5 h-5 text-[#DC3545]" />,
      badge: 'Emergency Triage & Portals',
      badgeVariant: 'danger' as const
    },
    {
      page: 'quiz' as PageType,
      title: 'Awareness Readiness Assessment',
      desc: 'Test your scam-detection instincts through 10 real-world scenarios with instant pedagogical explanations and scoring.',
      icon: <HelpCircle className="w-5 h-5 text-[#1261A0]" />,
      badge: '10 Scenario Challenges',
      badgeVariant: 'info' as const
    }
  ];

  return (
    <div className="space-y-20 py-10 sm:py-14">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-14 lg:p-16 shadow-xs">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBF5FB] text-[#0C4A7A] text-xs font-semibold border border-[#C2E0F4]">
              <ShieldCheck className="w-4 h-4 text-[#1261A0]" />
              <span>Public Service Initiative · Academic Digital Literacy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#0B1F33] tracking-tight leading-[1.12]">
              Calm, practical digital safety for everyday people.
            </h1>

            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl font-normal">
              CyberSafe equips internet users with practical habits to outsmart phishing, secure accounts and personal devices, analyze suspicious links, and take rapid containment action during cyber incidents.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#667085] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search threats, red flags, or habits (e.g. ransomware, MFA, UPI)..."
                  className="w-full pl-11 pr-24 py-3 bg-white rounded-lg border border-[#E5E7EB] text-[#14202B] text-sm focus:outline-none focus:border-[#1261A0] focus:ring-1 focus:ring-[#1261A0] placeholder:text-[#667085] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-[#1261A0] hover:bg-[#0E4D80] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-[#667085]">
                <span className="font-semibold text-[#0B1F33]">Popular:</span>
                {['Phishing', 'Passphrases', 'Public Wi-Fi', 'SMS Scams', 'Ransomware'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onNavigate('learn', term)}
                    className="hover:text-[#1261A0] underline cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button
                variant="primary"
                size="md"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => onNavigate('prevent')}
              >
                Start Safety Checklist & Score
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<Search className="w-4 h-4 text-[#1261A0]" />}
                onClick={() => onNavigate('detect')}
              >
                Inspect Suspicious URL or Text
              </Button>
              <button
                type="button"
                onClick={onOpenEmergency}
                className="text-xs sm:text-sm font-semibold text-[#DC3545] hover:text-[#B02A37] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-rose-50/60 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>I Suspect an Active Breach</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CyberSafe AI Assistant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F33] rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#102C48] text-blue-200 text-xs font-semibold border border-slate-700/80">
                <Sparkles className="w-3.5 h-3.5 text-[#19A974]" />
                <span>Intelligent Cybersecurity & Incident Layer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Meet CyberSafe AI Assistant
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Not sure what to do? Describe any suspicious situation, scam message, or incident. CyberSafe AI Assistant provides calm, structured steps, preserves necessary evidence, and guides you to the right tools.
              </p>

              {/* Sample Prompt Chips */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-semibold block mb-2.5">Try asking directly:</span>
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
                      type="button"
                      onClick={() => openGuide(sample)}
                      className="text-xs bg-[#102C48] hover:bg-[#1261A0] text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-[#1261A0] transition-colors cursor-pointer text-left"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-white" />}
                onClick={() => openGuide()}
                className="w-full justify-center"
              >
                Open CyberSafe AI Assistant
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => openGuide('I think I have been scammed. What should I do right now?')}
                className="w-full justify-center bg-[#102C48] text-white border-slate-700 hover:bg-[#173E63] hover:text-white"
              >
                Emergency Incident Triage
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">Platform Capabilities</h2>
            <p className="text-sm text-[#667085] mt-1 font-normal">Everything you need to learn, audit, detect, and resolve cyber risks in one place.</p>
          </div>
          <span className="text-xs text-[#667085] font-semibold bg-white border border-[#E5E7EB] px-3 py-1 rounded-md w-fit">
            Academic Community Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTools.map((tool) => (
            <Card
              key={tool.page}
              hoverable
              onClick={() => onNavigate(tool.page)}
              className="p-7 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E5E7EB] flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <Badge variant={tool.badgeVariant} size="sm">
                    {tool.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#0B1F33] group-hover:text-[#1261A0] transition-colors flex items-center gap-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-normal">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E5E7EB] flex items-center text-xs font-semibold text-[#1261A0] group-hover:text-[#0E4D80]">
                <span>Access module</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* The 3 Golden Rules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F33] text-white rounded-3xl p-8 sm:p-14 space-y-8 border border-slate-800">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878B5]">Core Foundations</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">The 3 Golden Rules of Everyday Safety</h2>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Consistently adhering to these three simple habits eliminates over 90% of consumer cyber incidents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#102C48] border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#1261A0]/30 text-blue-300 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Unique Passphrases + Vault</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Never reuse passwords. Use 4-word random passphrases (e.g. <span className="text-blue-200 font-mono">sunset-tulip-rocket-gravel</span>) stored securely inside a modern password manager.
              </p>
            </div>

            <div className="bg-[#102C48] border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#19A974]/30 text-emerald-300 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">MFA Everywhere</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Turn on Multi-Factor Authentication on your primary email, banking, and social accounts. Stolen passwords alone cannot breach an MFA-protected account.
              </p>
            </div>

            <div className="bg-[#102C48] border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Auto-Updates Turned On</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Enable automatic system and application updates on your phone and laptop. Security patches close the exact holes cybercriminals exploit with automated malware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">Threat Spotlights</h2>
            <p className="text-sm text-[#667085] mt-1 font-normal">Deep-dive into the four most widespread threats targeting everyday internet users right now.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowRight className="w-4 h-4 text-[#1261A0]" />}
            iconPosition="right"
            onClick={() => onNavigate('learn')}
            className="text-[#1261A0] font-semibold"
          >
            Explore all 10 threat guides
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {THREATS_DATA.slice(0, 4).map((threat) => (
            <Card
              key={threat.id}
              hoverable
              onClick={() => onNavigate('learn', threat.id)}
              className="p-6 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge variant={threat.severity === 'critical' ? 'danger' : 'warning'} size="sm">
                    {threat.severity.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-semibold text-[#667085]">{threat.category}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1F33] group-hover:text-[#1261A0] transition-colors leading-snug">
                  {threat.title}
                </h3>
                <p className="text-xs text-[#667085] line-clamp-3 leading-relaxed font-normal">
                  {threat.shortDesc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-semibold text-[#1261A0]">
                <span>View Red Flags & Defenses</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency Response Triage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDE8E8]/70 border border-[#F8B4B4] rounded-2xl p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#DC3545] text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#0B1F33]">Are you dealing with an active cyber incident?</h3>
              <p className="text-xs sm:text-sm text-[#667085] max-w-2xl leading-relaxed font-normal">
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
