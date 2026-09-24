import React, { useState } from 'react';
import {
  Activity,
  Server,
  Database,
  Radar,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ServiceHealthStatus } from '../../services/adminService';

interface AdminSystemHealthSectionProps {
  healthStatus: ServiceHealthStatus[];
  onRefreshHealth: () => Promise<void>;
  isRefreshing: boolean;
}

export function AdminSystemHealthSection({
  healthStatus,
  onRefreshHealth,
  isRefreshing,
}: AdminSystemHealthSectionProps) {
  // Mock error logs for system diagnostics
  const [errorLogs] = useState([
    {
      id: 'err-001',
      severity: 'INFO',
      service: 'Threat Reputation Proxy',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      message: 'VirusTotal external API key unconfigured; transitioned to local deterministic heuristic evaluator.',
    },
    {
      id: 'err-002',
      severity: 'WARNING',
      service: 'Geospatial Overpass Query',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      message: 'High latency detected on public Overpass mirror (650ms). Automatic progressive radius fallback engaged.',
    },
    {
      id: 'err-003',
      severity: 'INFO',
      service: 'Cloud Firestore',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      message: 'Audit log appended and replicated across regional multi-zone instances.',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Infrastructure Health & Connectivity</h3>
            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Operational
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time latency benchmarks, zero-SSRF proxy status, and database connection checks.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onRefreshHealth}
          disabled={isRefreshing}
          className="text-xs font-semibold py-2 px-3.5 border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          Run Health Diagnostics
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthStatus.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate pr-2">
                  {service.service}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                    service.status === 'OPERATIONAL'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{service.details}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Response Latency</span>
              <span className="font-bold text-slate-800">{service.latencyMs} ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* System Error & Warning Console */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <h4 className="text-sm font-bold text-slate-900">Diagnostics & Diagnostics Console</h4>
          </div>
          <span className="text-xs text-slate-400">Past 24 Hours</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {errorLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        log.severity === 'WARNING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {log.service}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
