import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Lock,
  Clock,
  Eye,
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DetailedAuditLog } from '../../types';

interface AdminAuditLogsSectionProps {
  logs: DetailedAuditLog[];
  globalSearch: string;
}

export function AdminAuditLogsSection({ logs, globalSearch }: AdminAuditLogsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<DetailedAuditLog | null>(null);

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !effectiveSearch ||
      log.actorEmail.toLowerCase().includes(effectiveSearch) ||
      log.action.toLowerCase().includes(effectiveSearch) ||
      log.resource.toLowerCase().includes(effectiveSearch) ||
      log.details.toLowerCase().includes(effectiveSearch);

    const matchResult = resultFilter === 'all' || log.result === resultFilter;

    return matchSearch && matchResult;
  });

  return (
    <div className="space-y-6">
      {/* Immutability Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Append-Only Cryptographic Audit Ledger</h3>
            <p className="text-xs text-slate-400">
              All administrative actions, role updates, and system changes are immutably logged. Deletions and in-place updates are rejected by Firestore security rules.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold shrink-0">
          Tamper-Evident
        </span>
      </div>

      {/* Filter Strip */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by actor, action, or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Results</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-700" />
            <h4 className="text-sm font-bold text-slate-900">Audit Trail Records</h4>
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredLogs.length} events
            </span>
          </div>
          <span className="text-xs text-slate-400">Click entry to inspect details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-blue-50/30 transition cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {log.actorEmail}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="text-[11px] py-1 px-2 border-slate-200 hover:bg-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Audit Event Payload</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Event ID</span>
                <p className="font-mono text-xs text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {selectedLog.id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Actor</span>
                  <p className="font-medium text-slate-900">{selectedLog.actorEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Role</span>
                  <p className="font-mono text-slate-800">{selectedLog.actorRole}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Timestamp</span>
                  <p className="font-mono text-slate-800">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Result</span>
                  <p className="font-bold text-emerald-600">{selectedLog.result}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Full Description</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                  {selectedLog.details}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Structured JSON</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto mt-1 max-h-40">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
