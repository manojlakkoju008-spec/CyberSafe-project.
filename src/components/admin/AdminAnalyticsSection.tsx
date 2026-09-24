import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Users,
  Radar,
  HelpCircle,
  MapPin,
  FileQuestion,
  Lock,
} from 'lucide-react';
import { Card } from '../common/Card';

export function AdminAnalyticsSection() {
  const categoryTrends = [
    { name: 'Financial Fraud & UPI Scams', count: 642, pct: 35 },
    { name: 'Phishing & Fake Banking Portals', count: 428, pct: 23 },
    { name: 'Hacked Social Media & Impersonation', count: 290, pct: 16 },
    { name: 'Online Shopping & Delivery Fraud', count: 215, pct: 12 },
    { name: 'Identity Theft & SIM Swap', count: 154, pct: 8 },
    { name: 'Malware & Ransomware Inquiries', count: 113, pct: 6 },
  ];

  const quizCompletionStats = [
    { topic: 'Phishing & Social Engineering', completionRate: '88%', avgScore: '82%' },
    { topic: 'Password & Account Hygiene', completionRate: '94%', avgScore: '89%' },
    { topic: 'UPI & Payment Security', completionRate: '91%', avgScore: '78%' },
    { topic: 'Public Wi-Fi & Mobile Defense', completionRate: '79%', avgScore: '74%' },
  ];

  const geospatialRadiusDistribution = [
    { radius: '5 km (Walkable / Local PS)', share: '32%' },
    { radius: '10 km (Default District Hub)', share: '46%' },
    { radius: '25 km (Regional Cybercrime Unit)', share: '18%' },
    { radius: '50 km (State CID Headquarter)', share: '4%' },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Aggregated Privacy-Conscious Telemetry
            </h3>
            <p className="text-xs text-slate-500">
              CyberSafe adheres to strict data minimization. Zero personal identifiable information (PII), raw URLs, or locations are tracked.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
          Zero-PII Compliance
        </span>
      </div>

      {/* Top Aggregated Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Citizen Consults</span>
          <div className="text-2xl font-black text-slate-900">4,280+</div>
          <p className="text-[11px] text-emerald-600 font-medium">↑ 18% month over month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Incident Triage Walkthroughs</span>
          <div className="text-2xl font-black text-slate-900">1,842</div>
          <p className="text-[11px] text-blue-600 font-medium">1930 Helpline Routing</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Quizzes Completed</span>
          <div className="text-2xl font-black text-slate-900">1,215</div>
          <p className="text-[11px] text-purple-600 font-medium">85.4% Avg Score</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Geospatial Station Lookups</span>
          <div className="text-2xl font-black text-slate-900">2,610</div>
          <p className="text-[11px] text-amber-600 font-medium">Verified Police & Cells</p>
        </div>
      </div>

      {/* Incident Category Distribution & Quiz Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Top Inquired Cybercrime Vectors</h4>
            </div>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryTrends.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-slate-500 shrink-0 ml-2">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning & Quiz Completion Rates */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-900">Educational Module Mastery</h4>
            </div>
            <span className="text-xs text-slate-400">Aggregated Scores</span>
          </div>

          <div className="divide-y divide-slate-100">
            {quizCompletionStats.map((q, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{q.topic}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Completion</span>
                    <span className="font-mono font-bold text-slate-700">{q.completionRate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Avg Score</span>
                    <span className="font-mono font-bold text-emerald-600">{q.avgScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Geospatial Radius Stats */}
          <div className="pt-3 border-t border-slate-150 space-y-2">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Map Query Radius Distribution</span>
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {geospatialRadiusDistribution.map((r, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">{r.radius}</span>
                  <span className="font-mono font-bold text-slate-800">{r.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
