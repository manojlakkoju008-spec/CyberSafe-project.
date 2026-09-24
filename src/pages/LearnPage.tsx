import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  AlertCircle, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  BookOpen,
  Check,
  Layers,
  HelpCircle,
  Eye,
  Zap,
  ListChecks,
  Compass,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { ThreatItem, SafetyBasic, SeverityLevel, PracticalMethodology, AttackScenario, ResourceType } from '../types';
import { THREATS_DATA } from '../data/threatsData';
import { BASICS_DATA } from '../data/basicsData';
import { PRACTICAL_METHODOLOGIES, ATTACK_SCENARIOS, LEARNING_TRACKS } from '../data/learningPlatformData';
import { fetchAllThreats } from '../services/contentService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IconHelper } from '../components/common/IconHelper';
import { MethodologyViewer } from '../components/learn/MethodologyViewer';
import { ScenarioViewer } from '../components/learn/ScenarioViewer';
import { ThreatDeepDiveModal } from '../components/learn/ThreatDeepDiveModal';
import { useAiGuide } from '../context/AiGuideContext';

interface LearnPageProps {
  initialSearchQuery?: string;
  onNavigateToReport?: (incidentId?: string) => void;
}

type LearnTab = 'threats' | 'methodologies' | 'scenarios' | 'checklists' | 'tracks';

export const LearnPage: React.FC<LearnPageProps> = ({ 
  initialSearchQuery = '',
  onNavigateToReport 
}) => {
  const { openGuide } = useAiGuide();
  const [activeTab, setActiveTab] = useState<LearnTab>('threats');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'deep' | 'quick'>('all');
  
  // Threat items loaded from service + local
  const [threatList, setThreatList] = useState<ThreatItem[]>(THREATS_DATA);
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  const [selectedBasic, setSelectedBasic] = useState<SafetyBasic | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  // Completed checklist items in local state
  const [checkedBasicsItems, setCheckedBasicsItems] = useState<Record<string, boolean>>({});

  // Load latest educational content from content service (merges Firestore admin items)
  useEffect(() => {
    let isMounted = true;
    fetchAllThreats()
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          // Filter to only published items for general learners
          setThreatList(items.filter((t) => t.status !== 'draft'));
        }
      })
      .catch((err) => {
        console.warn('Could not fetch remote threats, fallback to local', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle initial search query navigation
  useEffect(() => {
    if (initialSearchQuery) {
      const matchThreat = threatList.find(t => t.id === initialSearchQuery);
      if (matchThreat) {
        setSelectedThreat(matchThreat);
        setActiveTab('threats');
        return;
      }
      const matchBasic = BASICS_DATA.find(b => b.id === initialSearchQuery);
      if (matchBasic) {
        setSelectedBasic(matchBasic);
        setActiveTab('checklists');
        return;
      }
    }
  }, [initialSearchQuery, threatList]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    threatList.forEach(t => set.add(t.category));
    return ['all', ...Array.from(set)];
  }, [threatList]);

  // Filtered threats
  const filteredThreats = useMemo(() => {
    return threatList.filter(threat => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        threat.title.toLowerCase().includes(query) ||
        threat.shortDesc.toLowerCase().includes(query) ||
        threat.category.toLowerCase().includes(query) ||
        threat.redFlags.some(flag => flag.toLowerCase().includes(query)) ||
        threat.preventionTips.some(tip => tip.toLowerCase().includes(query));
      
      const matchesCategory = selectedCategory === 'all' || threat.category === selectedCategory;
      const matchesSeverity = selectedSeverity === 'all' || threat.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [threatList, searchQuery, selectedCategory, selectedSeverity]);

  // Filtered methodologies
  const filteredMethodologies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return PRACTICAL_METHODOLOGIES;
    return PRACTICAL_METHODOLOGIES.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.acronym.toLowerCase().includes(query) ||
      m.shortTagline.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.steps.some(s => s.actionTitle.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ATTACK_SCENARIOS;
    return ATTACK_SCENARIOS.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.threatCategory.toLowerCase().includes(query) ||
      s.attackerPretext.toLowerCase().includes(query) ||
      s.redFlagsPresent.some(f => f.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Toggle checklist item
  const toggleChecklistItem = (itemKey: string) => {
    setCheckedBasicsItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900">
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Structured Cybersecurity Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical Cyber Defense & Threat Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore structured threat catalogs, actionable decision methodologies, interactive attack simulations, and essential step-by-step security checklists.
        </p>
        <div className="pt-1">
          <button
            onClick={() => openGuide('Explain cybersecurity fundamentals and how to protect my digital identity in simple terms.')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-800 border border-blue-200 text-xs font-semibold cursor-pointer transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Need a personalized concept explanation? Ask CyberSafe AI Guide</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab('threats')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'threats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Threat Catalogs & Deep Guides ({threatList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('methodologies')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'methodologies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Practical Methodologies ({PRACTICAL_METHODOLOGIES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'scenarios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4 text-purple-600" />
          <span>Real-World Scenarios ({ATTACK_SCENARIOS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklists')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'checklists'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListChecks className="w-4 h-4 text-emerald-600" />
          <span>Essential Safety Checklists ({BASICS_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'tracks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-rose-500" />
          <span>Learning Tracks ({LEARNING_TRACKS.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, red flags, methodologies, or advice..."
            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns for threats tab */}
        {activeTab === 'threats' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="flex rounded-xl border border-slate-300 bg-white p-0.5 text-xs">
              <button
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setViewMode('deep')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'deep' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deep Guides
              </button>
              <button
                onClick={() => setViewMode('quick')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'quick' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quick Scans
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: THREAT GUIDES & DEEP DIVES */}
      {/* ==================================================== */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          {filteredThreats.length === 0 ? (
            <Card className="p-12 text-center bg-white border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Threat Resources Found</h3>
              <p className="text-xs text-slate-500 mb-4">
                No articles matched your search query or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSeverity('all');
                }}
                className="text-xs"
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredThreats.map((threat) => (
                <Card
                  key={threat.id}
                  className="bg-white border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedThreat(threat)}
                >
                  <div className="p-6 space-y-4">
                    {/* Top badges */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={getSeverityBadgeVariant(threat.severity)} className="capitalize text-[11px] font-bold">
                        {threat.severity}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {threat.category}
                      </span>
                    </div>

                    {/* Threat Title & Icon */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconHelper name={threat.iconName} className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {threat.title}
                      </h3>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {threat.shortDesc}
                    </p>

                    {/* Red Flags Preview or Quick Scan */}
                    {viewMode !== 'quick' ? (
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[11px] text-rose-950 space-y-1">
                        <div className="font-bold text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Top Red Flag:</span>
                        </div>
                        <p className="line-clamp-2 italic">
                          "{threat.redFlags[0] || 'Unsolicited communication demanding urgent action.'}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 space-y-1">
                        <div className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Quick Rule:</span>
                        </div>
                        <p className="line-clamp-2">
                          {threat.actionSteps[0] || 'Never click links sent in unsolicited messages.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Explore Deep Guide</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: PRACTICAL METHODOLOGIES */}
      {/* ==================================================== */}
      {activeTab === 'methodologies' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Methodology-Driven Defense: Cognitive Checklists for Citizens
              </span>
              Cybercriminals rely on emotional urgency to trigger impulsive reactions. Memorizing these structured 4-step decision frameworks trains you to pause, inspect technical evidence, and verify out-of-band before taking any action.
            </div>
          </div>

          <div className="space-y-8">
            {filteredMethodologies.map((methodology) => (
              <MethodologyViewer
                key={methodology.id}
                methodology={methodology}
                onSelectThreat={(tid) => {
                  const match = threatList.find(t => t.id === tid);
                  if (match) {
                    setSelectedThreat(match);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: REAL-WORLD SCENARIOS */}
      {/* ==================================================== */}
      {activeTab === 'scenarios' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5 text-xs text-purple-900 flex items-start gap-3">
            <Eye className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Spot The Trap: Interactive Real-World Attack Breakdowns
              </span>
              Learn how real attacks appear on victim screens. Click the interactive red-flag checkboxes to identify the deceptive triggers and learn the immediate defensive protocol.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScenarios.map((scenario) => (
              <ScenarioViewer
                key={scenario.id}
                scenario={scenario}
                onExploreThreat={(tid) => {
                  const match = threatList.find(t => t.id === tid);
                  if (match) {
                    setSelectedThreat(match);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: ESSENTIAL SAFETY CHECKLISTS */}
      {/* ==================================================== */}
      {activeTab === 'checklists' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Interactive Personal Security Checklist
              </span>
              Complete these foundational security hygiene items to establish a baseline of security across your accounts, devices, and communications.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BASICS_DATA.map((basic) => (
              <Card key={basic.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="blue" className="text-xs">
                      {basic.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {basic.checklist.length} Actions
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <IconHelper name={basic.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{basic.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{basic.summary}</p>
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {basic.checklist.map((item, idx) => {
                      const key = `${basic.id}-${idx}`;
                      const isDone = !!checkedBasicsItems[key];
                      return (
                        <label
                          key={idx}
                          onClick={() => toggleChecklistItem(key)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                            isDone ? 'bg-emerald-50/60 border-emerald-200 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition ${
                            isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`leading-relaxed font-medium ${isDone ? 'line-through' : ''}`}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Common pitfall */}
                  {basic.commonPitfall && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-950">
                      <span className="font-bold text-amber-900 block mb-0.5">Common Pitfall:</span>
                      {basic.commonPitfall}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  Stat: {basic.quickStat}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: STRUCTURED LEARNING TRACKS */}
      {/* ==================================================== */}
      {activeTab === 'tracks' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-5 text-xs text-rose-900 flex items-start gap-3">
            <Compass className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Curated Learning Pathways
              </span>
              Follow these recommended multi-step curriculum tracks curated for specific user roles and everyday scenarios.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_TRACKS.map((track) => (
              <Card key={track.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={track.badgeColor as any} className="text-[11px] font-bold">
                      {track.target}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      ~{track.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{track.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{track.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Curriculum Pathway:
                    </span>
                    {track.modules.map((mod, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (mod.type === 'threat') {
                            const match = threatList.find(t => t.id === mod.id);
                            if (match) setSelectedThreat(match);
                          } else if (mod.type === 'methodology') {
                            setActiveTab('methodologies');
                          } else if (mod.type === 'scenario') {
                            setActiveTab('scenarios');
                          } else {
                            setActiveTab('checklists');
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer text-xs group"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                            {mod.title}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const firstMod = track.modules[0];
                      if (firstMod.type === 'threat') {
                        const match = threatList.find(t => t.id === firstMod.id);
                        if (match) setSelectedThreat(match);
                      } else if (firstMod.type === 'methodology') {
                        setActiveTab('methodologies');
                      }
                    }}
                    className="text-xs w-full justify-center"
                  >
                    <span>Start Track</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* THREAT DEEP DIVE MODAL */}
      {/* ==================================================== */}
      <ThreatDeepDiveModal
        threat={selectedThreat}
        isOpen={!!selectedThreat}
        onClose={() => setSelectedThreat(null)}
        onSelectRelatedThreat={(tid) => {
          const match = threatList.find(t => t.id === tid);
          if (match) setSelectedThreat(match);
        }}
        onNavigateToReport={onNavigateToReport}
      />
    </div>
  );
};
