import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookOpen,
  ShieldCheck,
  Radar,
  FileQuestion,
  MapPin,
  HelpCircle,
  Megaphone,
  BarChart3,
  Activity,
  ScrollText,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AdminTab, AdminRole } from '../../types';
import { getRolePermissions } from '../../services/adminService';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  adminRole: AdminRole;
  adminEmail: string;
  onLogout: () => void;
  onNavigateHome: () => void;
  pendingLocationsCount?: number;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  requiredPermission?: keyof ReturnType<typeof getRolePermissions>;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  adminRole,
  adminEmail,
  onLogout,
  onNavigateHome,
  pendingLocationsCount = 0,
}: AdminSidebarProps) {
  const permissions = getRolePermissions(adminRole);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, requiredPermission: 'canManageUsers' },
    { id: 'content', label: 'Content CMS', icon: FolderOpen, requiredPermission: 'canManageContent' },
    { id: 'learning', label: 'Learning Guides', icon: BookOpen, requiredPermission: 'canManageContent' },
    { id: 'prevention', label: 'Prevention', icon: ShieldCheck, requiredPermission: 'canManageContent' },
    { id: 'detection', label: 'Threat Detection', icon: Radar },
    { id: 'reports', label: 'Reports & Help', icon: FileQuestion },
    {
      id: 'locations',
      label: 'Help Locations',
      icon: MapPin,
      badge: pendingLocationsCount > 0 ? pendingLocationsCount : undefined,
      requiredPermission: 'canManageLocations',
    },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, requiredPermission: 'canManageQuizzes' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, requiredPermission: 'canManageAnnouncements' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, requiredPermission: 'canViewAnalytics' },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText, requiredPermission: 'canViewAuditLogs' },
    { id: 'admins', label: 'Admin Team', icon: UserCheck, requiredPermission: 'canManageAdmins' },
    { id: 'settings', label: 'Settings', icon: Settings, requiredPermission: 'canManageSettings' },
  ];

  // Filter based on role permissions
  const filteredItems = navItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return permissions[item.requiredPermission];
  });

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 select-none z-30 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">CyberSafe</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Control
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">Admin Console</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Strip */}
      {!collapsed && (
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Role</span>
          <span
            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
              adminRole === 'SUPER_ADMIN'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : adminRole === 'ADMIN'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {adminRole}
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Account Strip */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <button
          onClick={onNavigateHome}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Return to public portal"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span className="truncate">Public Portal</span>}
        </button>

        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Session</p>
            <p className="text-xs text-slate-200 font-mono truncate">{adminEmail}</p>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign out of administration"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
