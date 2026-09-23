import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Phone,
  Globe,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { NearbyHelpLocation } from '../../types';
import { getDirectionsUrl } from '../../services/nearbyHelpService';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

interface LocationDetailModalProps {
  location: NearbyHelpLocation | null;
  onClose: () => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({ location, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!location) return null;

  const isCyber = location.isCyberDedicated;
  const directionsUrl = getDirectionsUrl(location.latitude, location.longitude, location.name);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                  isCyber
                    ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                {location.category}
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {location.distanceKm} km away
              </span>
            </div>
            <h2 id="location-detail-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {location.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Important Verification Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-amber-900 block">
                Verify Before Visiting:
              </span>
              <p className="text-amber-900/90 leading-relaxed font-normal">
                Verify the location and operating hours before visiting. While police stations operate 24/7, specialized cyber desks or investigating officers may have specific public consultation hours.
              </p>
            </div>
          </div>

          {/* Address Block */}
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-slate-500">
                Physical Location
              </span>
              <p className="text-slate-800 leading-relaxed">{location.address}</p>
              <p className="text-[11px] text-slate-400 font-mono pt-0.5">
                Coordinates: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            </div>
          </div>

          {/* Contact & Hours if available */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {location.phone && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Telephone</span>
                  <a
                    href={`tel:${location.phone}`}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>
              </div>
            )}

            {location.website && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Official Website</span>
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-1 truncate max-w-[140px]"
                  >
                    <span>Visit Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {location.openingHours && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 sm:col-span-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Recorded Hours</span>
                  <span className="text-slate-600">{location.openingHours}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cybercrime vs Police Clarification */}
          {!isCyber && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">
                  Police Station Protocol Notice:
                </span>
                <p className="leading-relaxed">
                  This facility is recorded as a general police station. In India, local police stations can accept written cybercrime complaints or file a Zero FIR, but technical forensic investigation is typically coordinated through district cyber cells or state headquarters.
                </p>
              </div>
            </div>
          )}

          {/* Data Transparency Guarantee */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Verified Geospatial Source: {location.verifiedSource}</span>
            <span>OSM ID: {location.osmId || 'N/A'}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Need statutory online filing instead? Call <strong className="text-rose-600 font-bold">1930</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
