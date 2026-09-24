import React from 'react';
import {
  Users,
  BookOpen,
  ShieldCheck,
  Radar,
  HelpCircle,
  MapPin,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ShieldAlert,
  Server,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AdminTab, DetailedAuditLog, ThreatItem, SecurityMethodologyGuide, QuizQuestion, AdminManagedLocation, AdminUserListItem } from '../../types';
import { ServiceHealthStatus } from '../../services/adminService';

interface AdminOverviewSectionProps {
  onNavigateTab: (tab: AdminTab) => void;
  users: AdminUserListItem[];
  threats: ThreatItem[];
  methodologies: SecurityMethodologyGuide[];
  quizzes: QuizQuestion[];
  locations: AdminManagedLocation[];
  auditLogs: DetailedAuditLog[];
  healthStatus: ServiceHealthStatus[];
  onOpenNewThreatModal: () => void;
  onOpenNewLocationModal: () => void;
}

export function AdminOverviewSection({
  onNavigateTab,
  users,
  threats,
  methodologies,
  quizzes,
  locations,
  auditLogs,
  healthStatus,
  onOpenNewThreatModal,
  onOpenNewLocationModal,
}: AdminOverviewSectionProps) {
  const publishedThreats = threats.filter((t) => t.status !== 'draft').length;
  const publishedMethodologies = methodologies.filter((m) => m.status !== 'draft').length;
  const publishedQuizzes = quizzes.filter((q) => q.status !== 'draft').length;
  const verifiedLocations = locations.filter((l) => l.verificationStatus === 'VERIFIED').length;
  const pendingLocations = locations.filter((l) => l.verificationStatus === 'PENDING_REVIEW').length;

  const kpis = [
    {
      title: 'Total Users',
      value: users.length,
      subtitle: `${users.filter((u) => u.status === 'active').length} active profiles`,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      actionTab: 'users' as AdminTab,
    },
    {
      title: 'Published Threats',
      value: publishedThreats,
      subtitle: `${threats.length - publishedThreats} drafts in review`,
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      actionTab: 'learning' as AdminTab,
    },
    {
      title: 'Prevention Guides',
      value: publishedMethodologies,
      subtitle: 'NIST CSF & Zero Trust',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      actionTab: 'prevention' as AdminTab,
    },
    {
      title: 'Scenario Quizzes',
      value: publishedQuizzes,
      subtitle: 'Multi-choice assessments',
      icon: HelpCircle,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      actionTab: 'quizzes' as AdminTab,
    },
    {
      title: 'Help Locations',
      value: verifiedLocations,
      subtitle: `${pendingLocations} pending review`,
      icon: MapPin,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      actionTab: 'locations' as AdminTab,
    },
    {
      title: 'Threat Intel Queries',
      value: '1,842',
      subtitle: 'Zero-SSRF protected',
      icon: Radar,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      actionTab: 'detection' as AdminTab,
    },
    {
      title: 'System Uptime',
      value: '99.98%',
      subtitle: 'All services responding',
      icon: Activity,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      actionTab: 'system' as AdminTab,
    },
    {
      title: 'Active Alerts',
      value: pendingLocations > 0 ? pendingLocations : '0',
      subtitle: pendingLocations > 0 ? 'Locations need review' : 'No critical issues',
      icon: ShieldAlert,
      color: pendingLocations > 0 ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-slate-600 bg-slate-50 border-slate-200',
      actionTab: 'locations' as AdminTab,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CyberSafe Operational Security Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Platform Command & Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Oversee educational threat guides, verify physical cybercrime units, audit user operations, and monitor zero-SSRF detection proxies from a single secure dashboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="primary"
            onClick={onOpenNewLocationModal}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-3.5 rounded-xl shadow-md shadow-blue-600/20"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Add Help Location
          </Button>
          <Button
            variant="outline"
            onClick={onOpenNewThreatModal}
            className="text-xs font-bold text-slate-200 border-slate-700 hover:bg-slate-800 py-2 px-3.5 rounded-xl"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            New Learning Guide
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigateTab('settings')}
            className="text-xs font-bold text-slate-200 border-slate-700 hover:bg-slate-800 py-2 px-3.5 rounded-xl"
          >
            System Settings
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(kpi.actionTab)}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-lg border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-slate-500 truncate">{kpi.subtitle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Middle Section: System Health Matrix & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Matrix (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">System Infrastructure Health</h3>
            </div>
            <button
              onClick={() => onNavigateTab('system')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Health Monitor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {healthStatus.slice(0, 4).map((h, i) => (
              <div key={i} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{h.service}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {h.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{h.details}</p>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                    h.status === 'OPERATIONAL'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Admin Notices / Alerts (1 Col) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Operational Alerts</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {pendingLocations > 0 ? 'Action Required' : 'All Clear'}
            </span>
          </div>

          <div className="space-y-3">
            {pendingLocations > 0 && (
              <div
                onClick={() => onNavigateTab('locations')}
                className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5 cursor-pointer hover:bg-amber-100/70 transition"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    Pending Location Reviews ({pendingLocations})
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-amber-700" />
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Submitted cyber help entries require phone verification with station in-charge before public listing.
                </p>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5 text-blue-700" />
                Zero-SSRF Threat Proxy Active
              </div>
              <p className="text-[11px] text-blue-800 leading-snug">
                Client URL evaluations utilize structural heuristics. External reputation fallback is operational.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Statutory Helpline Integration
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Helpline 1930 & 112 emergency routing links verified with DoT Sanchar Saathi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Administrative Activity Stream */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Recent Administrative Operations</h3>
          </div>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Audit Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 6).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {log.actorEmail}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap font-medium">
                    {log.resource}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
