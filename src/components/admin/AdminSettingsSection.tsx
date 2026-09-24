import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  MapPin,
  PhoneCall,
  Radar,
  Lock,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PlatformSystemSettings } from '../../types';

interface AdminSettingsSectionProps {
  settings: PlatformSystemSettings;
  onSaveSettings: (settings: PlatformSystemSettings) => Promise<void>;
  isSuperAdmin: boolean;
}

export function AdminSettingsSection({
  settings,
  onSaveSettings,
  isSuperAdmin,
}: AdminSettingsSectionProps) {
  const [formData, setFormData] = useState<PlatformSystemSettings>({ ...settings });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleExecuteSave = async () => {
    setIsSubmitting(true);
    try {
      await onSaveSettings(formData);
      setSuccessMessage('System configuration and security policies saved.');
      setShowConfirmModal(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Settings update failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Platform Settings & Defensive Policy</h3>
          </div>
          <p className="text-xs text-slate-500">
            Global system parameters, statutory contact points, and geospatial defaults.
          </p>
        </div>

        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
          Last Updated: {new Date(formData.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* 1. General Platform Identification */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>General Platform Properties</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Platform Brand Title</label>
              <input
                type="text"
                required
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Administrative Contact Email</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Platform Maintenance Mode
                </span>
                <span className="text-[11px] text-slate-500">
                  When enabled, displays an operational maintenance banner across all public pages.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Geospatial Discovery Parameters */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Geospatial Discovery Parameters</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Default Search Radius (km)
              </label>
              <input
                type="number"
                min={2}
                max={50}
                value={formData.defaultRadiusKm}
                onChange={(e) =>
                  setFormData({ ...formData, defaultRadiusKm: parseInt(e.target.value, 10) || 10 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Initial radius applied when citizen grants location access.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Maximum Search Radius Limit (km)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={formData.maxRadiusKm}
                onChange={(e) =>
                  setFormData({ ...formData, maxRadiusKm: parseInt(e.target.value, 10) || 50 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Prevents broad geographical Overpass queries that could degrade server performance.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Statutory Emergency Helpline & Portals */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Statutory Citizen Contact Routing</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                National Cyber Crime Helpline Number
              </label>
              <input
                type="text"
                required
                value={formData.nationalHelplineNumber}
                onChange={(e) =>
                  setFormData({ ...formData, nationalHelplineNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Official Incident Reporting Portal URL
              </label>
              <input
                type="url"
                required
                value={formData.officialPortalUrl}
                onChange={(e) =>
                  setFormData({ ...formData, officialPortalUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-xl shadow-md shadow-blue-600/20"
          >
            Save Platform Policy
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Apply System Settings?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              These settings will update platform-wide security policies and will be permanently recorded in the cryptographic audit ledger.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleExecuteSave}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isSubmitting ? 'Saving...' : 'Confirm & Apply'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
