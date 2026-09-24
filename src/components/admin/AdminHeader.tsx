import React from 'react';
import {
  Menu,
  RefreshCw,
  Search,
  Bell,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { AdminTab, AdminRole } from '../../types';

interface AdminHeaderProps {
  activeTab: AdminTab;
  adminRole: AdminRole;
  adminEmail: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenMobileMenu: () => void;
  onNavigateHome: () => void;
  globalSearch: string;
  onSearchChange: (value: string) => void;
  maintenanceMode?: boolean;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Control Center Overview',
    subtitle: 'System health, real-time KPI metrics, and operational alerts across CyberSafe.',
  },
  users: {
    title: 'User Management',
    subtitle: 'Directory of registered members, role assignments, and account status controls.',
  },
  content: {
    title: 'Content CMS',
    subtitle: 'Unified editorial pipeline for educational threat guides and prevention resources.',
  },
  learning: {
    title: 'Learning Guides (Threats)',
    subtitle: 'Manage cybersecurity incident taxonomies, red flags, and NIST CSF mappings.',
  },
  prevention: {
    title: 'Prevention Methodologies',
    subtitle: 'Structure citizen defense frameworks (NIST CSF 2.0, Zero Trust, CIS Controls).',
  },
  detection: {
    title: 'Threat Detection Admin',
    subtitle: 'Threat reputation providers health, heuristic score thresholds, and zero-SSRF telemetry.',
  },
  reports: {
    title: 'Reports & Help Guidance',
    subtitle: 'Configure incident triage pathways, statutory helpline routing, and evidence templates.',
  },
  locations: {
    title: 'Verified Help Locations',
    subtitle: 'Review, verify, and geocode official cybercrime cells and police assistance stations.',
  },
  quizzes: {
    title: 'Quiz & Scenario Management',
    subtitle: 'Draft, validate, and publish interactive cybersecurity literacy scenario evaluations.',
  },
  announcements: {
    title: 'Platform Announcements',
    subtitle: 'Broadcast emergency safety bulletins and public advisory alerts to users.',
  },
  analytics: {
    title: 'Platform Analytics',
    subtitle: 'Privacy-first aggregated platform telemetry. Zero personal data collected.',
  },
  system: {
    title: 'System Health & Errors',
    subtitle: 'Live infrastructure connectivity checks, Firestore performance, and error monitor.',
  },
  'audit-logs': {
    title: 'Security Audit Logs',
    subtitle: 'Append-only cryptographic administrative activity ledger for compliance and auditing.',
  },
  admins: {
    title: 'Administrator Access Management',
    subtitle: 'Manage privileged administrative roles, provision invitations, and access states.',
  },
  settings: {
    title: 'Platform Settings',
    subtitle: 'Defensive parameters, statutory helpline links, and platform-wide configuration.',
  },
};

export function AdminHeader({
  activeTab,
  adminRole,
  adminEmail,
  onRefresh,
  isRefreshing,
  onOpenMobileMenu,
  onNavigateHome,
  globalSearch,
  onSearchChange,
  maintenanceMode = false,
}: AdminHeaderProps) {
  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Administration',
    subtitle: 'Platform control center',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
      {/* Maintenance Mode Banner */}
      {maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Platform Maintenance Mode is currently ENABLED. Public access may be restricted.</span>
        </div>
      )}

      <div className="px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-slate-500 tracking-wider">
              <span>CyberSafe Admin</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">{activeTab}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {currentTabInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Search, Refresh, Status, Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Filter in ${activeTab}...`}
              value={globalSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh platform data"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* System Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Systems Online</span>
          </div>

          {/* Return to Public Portal */}
          <button
            onClick={onNavigateHome}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Public Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
