import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Phone,
  Building,
  Edit2,
  Archive,
  Eye,
  X,
  AlertTriangle,
  Globe,
  Navigation,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  AdminManagedLocation,
  LocationType,
  LocationVerificationStatus,
} from '../../types';
import { validateCoordinates } from '../../services/adminService';

interface AdminLocationsSectionProps {
  locations: AdminManagedLocation[];
  onSaveLocation: (location: AdminManagedLocation) => Promise<void>;
  onVerifyLocation: (id: string) => Promise<void>;
  onArchiveLocation: (id: string) => Promise<void>;
  globalSearch: string;
  isLocationManager: boolean;
}

export function AdminLocationsSection({
  locations,
  onSaveLocation,
  onVerifyLocation,
  onArchiveLocation,
  globalSearch,
  isLocationManager,
}: AdminLocationsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingLocation, setEditingLocation] = useState<AdminManagedLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewLocation, setPreviewLocation] = useState<AdminManagedLocation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveSearch = (searchQuery || globalSearch).toLowerCase().trim();

  const filteredLocations = locations.filter((loc) => {
    const matchSearch =
      !effectiveSearch ||
      loc.name.toLowerCase().includes(effectiveSearch) ||
      loc.city.toLowerCase().includes(effectiveSearch) ||
      loc.state.toLowerCase().includes(effectiveSearch) ||
      (loc.phone && loc.phone.includes(effectiveSearch));

    const matchStatus = statusFilter === 'all' || loc.verificationStatus === statusFilter;
    const matchType = typeFilter === 'all' || loc.locationType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const handleOpenNewLocation = () => {
    setEditingLocation({
      id: `loc-custom-${Date.now()}`,
      name: '',
      locationType: 'CYBER_CELL',
      address: '',
      city: '',
      state: '',
      country: 'India',
      latitude: 20.5937,
      longitude: 78.9629,
      phone: '',
      website: '',
      openingHours: '24/7 Police Station',
      source: 'Official Police Directory',
      sourceUrl: '',
      verificationStatus: 'PENDING_REVIEW',
      notes: '',
      updatedAt: new Date().toISOString(),
    });
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;

    if (!editingLocation.name.trim()) {
      setValidationError('Location name is required.');
      return;
    }

    const coordCheck = validateCoordinates(
      Number(editingLocation.latitude),
      Number(editingLocation.longitude)
    );
    if (!coordCheck.valid) {
      setValidationError(coordCheck.error || 'Invalid geographic coordinates.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      await onSaveLocation({
        ...editingLocation,
        latitude: Number(editingLocation.latitude),
        longitude: Number(editingLocation.longitude),
      });
      setIsModalOpen(false);
      setEditingLocation(null);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Verified Assistance Registry</h3>
            <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              {filteredLocations.length} locations
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Physical cyber cells, nodal police stations, and certified emergency support centers.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenNewLocation}
          className="w-full sm:w-auto text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Help Location
        </Button>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by station name, city, state, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="CYBER_CELL">Cyber Cell</option>
            <option value="CYBERCRIME_UNIT">Cybercrime Unit</option>
            <option value="POLICE_STATION">Police Station</option>
            <option value="GOVERNMENT_ASSISTANCE">Govt Support</option>
          </select>
        </div>
      </div>

      {/* Locations Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Station / Center</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50/60 transition group">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{loc.address}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {loc.locationType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{loc.city}</div>
                    <div className="text-[10px] text-slate-400">{loc.state}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                    {loc.phone || '—'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        loc.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : loc.verificationStatus === 'PENDING_REVIEW'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : loc.verificationStatus === 'ARCHIVED'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {loc.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    {loc.verificationStatus !== 'VERIFIED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerifyLocation(loc.id)}
                        className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[11px] font-semibold py-1 px-2 rounded-lg"
                        title="Mark verified"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Verify
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingLocation(loc);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-700 border-slate-200 hover:bg-slate-100 text-[11px] font-semibold py-1 px-2 rounded-lg"
                      title="Edit location"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>

                    {loc.verificationStatus !== 'ARCHIVED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onArchiveLocation(loc.id)}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] font-semibold py-1 px-2 rounded-lg"
                        title="Archive location"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && editingLocation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingLocation.name ? 'Edit Help Location' : 'Register Help Location'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-800 block mb-1">Station / Center Name *</label>
                <input
                  type="text"
                  required
                  value={editingLocation.name}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, name: e.target.value })
                  }
                  placeholder="Special Cell Cyber Crime Police Station"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Location Type</label>
                  <select
                    value={editingLocation.locationType}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        locationType: e.target.value as LocationType,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="CYBER_CELL">Cyber Cell</option>
                    <option value="CYBERCRIME_UNIT">Cybercrime Unit</option>
                    <option value="POLICE_STATION">Police Station</option>
                    <option value="GOVERNMENT_ASSISTANCE">Government Assistance</option>
                    <option value="OTHER_VERIFIED_HELP">Other Verified Help</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Verification Status</label>
                  <select
                    value={editingLocation.verificationStatus}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        verificationStatus: e.target.value as LocationVerificationStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="NEEDS_REVIEW">Needs Review</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingLocation.address}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, address: e.target.value })
                  }
                  placeholder="Sector 17, Dwarka, South West Delhi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">City</label>
                  <input
                    type="text"
                    value={editingLocation.city}
                    onChange={(e) =>
                      setEditingLocation({ ...editingLocation, city: e.target.value })
                    }
                    placeholder="New Delhi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">State / UT</label>
                  <input
                    type="text"
                    value={editingLocation.state}
                    onChange={(e) =>
                      setEditingLocation({ ...editingLocation, state: e.target.value })
                    }
                    placeholder="Delhi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Geographic Coordinates with Validation */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Latitude (-90 to 90) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingLocation.latitude}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Longitude (-180 to 180) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingLocation.longitude}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        longitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Station Phone</label>
                  <input
                    type="text"
                    value={editingLocation.phone || ''}
                    onChange={(e) =>
                      setEditingLocation({ ...editingLocation, phone: e.target.value })
                    }
                    placeholder="011-20892623"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Official Website</label>
                  <input
                    type="url"
                    value={editingLocation.website || ''}
                    onChange={(e) =>
                      setEditingLocation({ ...editingLocation, website: e.target.value })
                    }
                    placeholder="https://delhipolice.gov.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Source Attribution</label>
                <input
                  type="text"
                  value={editingLocation.source}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, source: e.target.value })
                  }
                  placeholder="e.g. State Police Portal or OpenStreetMap"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Internal Verification Notes</label>
                <textarea
                  rows={2}
                  value={editingLocation.notes || ''}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, notes: e.target.value })
                  }
                  placeholder="Verification conducted via phone call with duty officer on 2026-09-20."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save Location'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
