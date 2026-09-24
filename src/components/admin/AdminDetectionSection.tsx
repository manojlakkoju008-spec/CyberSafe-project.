import React, { useState } from 'react';
import {
  Radar,
  ShieldCheck,
  AlertTriangle,
  Server,
  Zap,
  Lock,
  Clock,
  CheckCircle2,
  Sliders,
  Save,
  RotateCcw,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DetectionAdminMetrics, PlatformSystemSettings } from '../../types';

interface AdminDetectionSectionProps {
  metrics: DetectionAdminMetrics;
  settings: PlatformSystemSettings;
  onSaveSettings: (settings: PlatformSystemSettings) => Promise<void>;
  isAdmin: boolean;
}

export function AdminDetectionSection({
  metrics,
  settings,
  onSaveSettings,
  isAdmin,
}: AdminDetectionSectionProps) {
  const [thresholdMedium, setThresholdMedium] = useState(settings.structuralThresholdMedium);
  const [thresholdHigh, setThresholdHigh] = useState(settings.structuralThresholdHigh);
  const [cacheTTL, setCacheTTL] = useState(settings.threatIntelCacheMinutes);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings({
        ...settings,
        structuralThresholdMedium: Number(thresholdMedium),
        structuralThresholdHigh: Number(thresholdHigh),
        threatIntelCacheMinutes: Number(cacheTTL),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save detection settings: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zero-SSRF Security Assurance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero-SSRF Invariant Protected</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Threat Intelligence Engine Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The CyberSafe detection proxy never fetches, executes, or connects directly to user-entered URLs. Only domain metadata and cryptographic hash digests are queried against reputation feeds or analyzed locally.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Latency</span>
            <span className="text-base font-black text-emerald-400 font-mono">{metrics.avgLatencyMs}ms</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Protected Queries</span>
            <span className="text-base font-black text-white font-mono">{metrics.totalRequests.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Local Structural Analysis */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Structural Heuristics</span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {metrics.localHeuristicRequests.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            Internal evaluation analyzing IP literals, brand spoofing, punycode obfuscation, and suspicious top-level domains.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Operational Mode:</span>
            <span className="font-semibold text-slate-800">Deterministic</span>
          </div>
        </div>

        {/* External Threat Reputation (VirusTotal) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">VirusTotal v3 Proxy</span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Proxy Ready
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {metrics.externalReputationRequests.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            Server-side reputation proxy. Falls back gracefully to local analysis when external API keys are unconfigured.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Fallback Engaged:</span>
            <span className="font-semibold text-amber-600">{metrics.fallbackCount} queries</span>
          </div>
        </div>

        {/* Zero-SSRF In-Memory Cache */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Intel Cache Engine</span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              TTL {settings.threatIntelCacheMinutes}m
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {cacheTTL} min TTL
          </div>
          <p className="text-[11px] text-slate-500">
            High-performance in-memory cache to prevent repetitive upstream API queries and minimize latency for citizens.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Rate Limit Blocks:</span>
            <span className="font-semibold text-slate-800">{metrics.rateLimitBlocks}</span>
          </div>
        </div>
      </div>

      {/* Detection Threshold Configuration Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-150 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Detection Sensitivity Configuration</h3>
          </div>
          <span className="text-xs text-slate-400">Restricted to Administrators</span>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Detection sensitivity thresholds updated and saved to system policy.</span>
          </div>
        )}

        <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Medium Risk Threshold Score (0 - 100)
              </label>
              <input
                type="number"
                min={10}
                max={50}
                value={thresholdMedium}
                onChange={(e) => setThresholdMedium(parseInt(e.target.value, 10) || 30)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Score above this triggers "Medium Suspicious" rating.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                High Risk / Malicious Threshold Score (0 - 100)
              </label>
              <input
                type="number"
                min={51}
                max={90}
                value={thresholdHigh}
                onChange={(e) => setThresholdHigh(parseInt(e.target.value, 10) || 60)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Score above this triggers "High Risk / Likely Phishing" flag.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Reputation Cache Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={cacheTTL}
                onChange={(e) => setCacheTTL(parseInt(e.target.value, 10) || 10)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Duration to hold clean/malicious domain reports in memory.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl"
            >
              {isSaving ? 'Updating Thresholds...' : 'Save Detection Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
