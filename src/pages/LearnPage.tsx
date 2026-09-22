import React, { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { ThreatItem, SafetyBasic, SeverityLevel } from '../types';
import { THREATS_DATA } from '../data/threatsData';
import { BASICS_DATA } from '../data/basicsData';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IconHelper } from '../components/common/IconHelper';

interface LearnPageProps {
  initialSearchQuery?: string;
  onNavigateToReport?: (incidentId?: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ 
  initialSearchQuery = '',
  onNavigateToReport 
}) => {
  const [activeTab, setActiveTab] = useState<'threats' | 'basics'>('threats');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  const [selectedBasic, setSelectedBasic] = useState<SafetyBasic | null>(null);

  // If initialSearch matches an item id directly, select it
  React.useEffect(() => {
    if (initialSearchQuery) {
      const matchThreat = THREATS_DATA.find(t => t.id === initialSearchQuery);
      if (matchThreat) {
        setSelectedThreat(matchThreat);
        setActiveTab('threats');
        return;
      }
      const matchBasic = BASICS_DATA.find(b => b.id === initialSearchQuery);
      if (matchBasic) {
        setSelectedBasic(matchBasic);
        setActiveTab('basics');
        return;
      }
    }
  }, [initialSearchQuery]);

  // Filtered threats
  const filteredThreats = useMemo(() => {
    return THREATS_DATA.filter(threat => {
      const matchesSearch = 
        threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.redFlags.some(flag => flag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSeverity = selectedSeverity === 'all' || threat.severity === selectedSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [searchQuery, selectedSeverity]);

  // Filtered basics
  const filteredBasics = useMemo(() => {
    return BASICS_DATA.filter(basic => {
      return (
        basic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        basic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        basic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        basic.checklist.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understand Common Cyber Threats & Practical Habits
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive, jargon-free guides analyzing the anatomy of modern online attacks and everyday protective protocols designed to keep you and your family safe.
        </p>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          {/* Main Tab Toggles */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('threats')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'threats'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10 Major Cyber Threats
            </button>
            <button
              onClick={() => setActiveTab('basics')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'basics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10 Digital Safety Foundations
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, red flags..."
              className="w-full pl-9 pr-8 py-2 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Threat Severity Filters (Only on Threats tab) */}
        {activeTab === 'threats' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium">Filter by Severity:</span>
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize cursor-pointer transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Grid */}
      {activeTab === 'threats' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThreats.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-medium">No threats match your search criteria.</p>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedSeverity('all'); }}>
                Reset filters
              </Button>
            </div>
          ) : (
            filteredThreats.map((threat) => (
              <Card
                key={threat.id}
                hoverable
                onClick={() => setSelectedThreat(threat)}
                className="p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <IconHelper name={threat.iconName} className="w-5 h-5" />
                    </div>
                    <Badge
                      variant={
                        threat.severity === 'critical'
                          ? 'danger'
                          : threat.severity === 'high'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {threat.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {threat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {threat.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>View Red Flags & Defenses</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBasics.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-medium">No habits match your search criteria.</p>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                Reset search
              </Button>
            </div>
          ) : (
            filteredBasics.map((basic) => (
              <Card
                key={basic.id}
                hoverable
                onClick={() => setSelectedBasic(basic)}
                className="p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IconHelper name={basic.iconName} className="w-5 h-5" />
                    </div>
                    <Badge variant="neutral" size="sm">
                      {basic.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {basic.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {basic.summary}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 italic">
                    💡 <span className="font-semibold not-italic text-slate-800">Key Fact:</span> {basic.quickStat}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>View Step-by-Step Checklist</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Threat Deep-Dive Drawer Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconHelper name={selectedThreat.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedThreat.title}</h2>
                    <Badge
                      variant={
                        selectedThreat.severity === 'critical'
                          ? 'danger'
                          : selectedThreat.severity === 'high'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{selectedThreat.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
              {/* Overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h3>
                <p className="text-slate-800 leading-relaxed">{selectedThreat.fullDesc}</p>
              </div>

              {/* Red Flags */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Key Warning Signs & Red Flags</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
                  {selectedThreat.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real World Scenario */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>Real-World Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  "{selectedThreat.realExample}"
                </p>
              </div>

              {/* Immediate Action Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Immediate Action Steps (If Targeted or Compromised)
                </h3>
                <div className="space-y-2">
                  {selectedThreat.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-Term Prevention */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Long-Term Preventative Habits
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedThreat.preventionTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSelectedThreat(null)}>
                Close Guide
              </Button>
              {onNavigateToReport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedThreat(null);
                    onNavigateToReport();
                  }}
                  className="text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50"
                >
                  Need to Report an Incident?
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Safety Basic Deep-Dive Modal */}
      {selectedBasic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <IconHelper name={selectedBasic.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedBasic.title}</h2>
                  <p className="text-xs text-slate-500 font-medium">{selectedBasic.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBasic(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">In-Depth Guidance</h3>
                <p className="text-slate-800 leading-relaxed">{selectedBasic.detail}</p>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Action Steps</h3>
                <div className="space-y-2">
                  {selectedBasic.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfall */}
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Common Pitfall to Avoid</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-950">{selectedBasic.commonPitfall}</p>
              </div>

              {/* Stat Fact */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs sm:text-sm text-blue-900">
                <span className="font-bold">Research Finding: </span>
                {selectedBasic.quickStat}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedBasic(null)}>
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
