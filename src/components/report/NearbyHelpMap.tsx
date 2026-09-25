import React, { useEffect, useCallback, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import { NearbyHelpLocation, UserCoordinates } from '../../types';
import { getDirectionsUrl } from '../../services/nearbyHelpService';
import {
  Crosshair,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  Globe,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface NearbyHelpMapProps {
  userLocation: UserCoordinates;
  locations: NearbyHelpLocation[];
  selectedLocation: NearbyHelpLocation | null;
  onSelectLocation: (loc: NearbyHelpLocation) => void;
  onOpenDetails: (loc: NearbyHelpLocation) => void;
}

// Controller component inside APIProvider and Map context
const MapController: React.FC<{
  userLocation: UserCoordinates;
  locations: NearbyHelpLocation[];
  selectedLocation: NearbyHelpLocation | null;
}> = ({ userLocation, locations, selectedLocation }) => {
  const map = useMap();

  // Pan to user location when coordinates update
  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
  }, [map, userLocation.latitude, userLocation.longitude]);

  // Pan to selected location
  useEffect(() => {
    if (!map || !selectedLocation) return;
    map.panTo({ lat: selectedLocation.latitude, lng: selectedLocation.longitude });
  }, [map, selectedLocation]);

  // Fit bounds when new locations list arrives
  useEffect(() => {
    if (!map || locations.length === 0) return;
    try {
      const g = (window as unknown as { google?: typeof google }).google;
      if (!g?.maps) return;
      const bounds = new g.maps.LatLngBounds();
      bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      locations.forEach((loc) => {
        bounds.extend({ lat: loc.latitude, lng: loc.longitude });
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    } catch {
      // Fallback if google namespace is initializing
    }
  }, [map, locations, userLocation.latitude, userLocation.longitude]);

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom() ?? 13;
    map.setZoom(currentZoom + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom() ?? 13;
    map.setZoom(currentZoom - 1);
  }, [map]);

  const handleRecenter = useCallback(() => {
    if (!map) return;
    map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    map.setZoom(14);
  }, [map, userLocation.latitude, userLocation.longitude]);

  return (
    <>
      {/* Floating Custom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 shadow-md rounded-xl overflow-hidden border border-slate-200 bg-white/95 backdrop-blur-xs">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className="p-2.5 hover:bg-slate-100 text-slate-700 transition cursor-pointer border-b border-slate-100"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          className="p-2.5 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <button
          type="button"
          onClick={handleRecenter}
          className="px-3 py-2 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-50 transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
          <span>Center My Location</span>
        </button>
      </div>
    </>
  );
};

// Internal status observer hook component inside APIProvider
const ApiStatusWatcher: React.FC<{
  onError: (type: string) => void;
}> = ({ onError }) => {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === 'AUTH_FAILURE') {
      onError('AUTH_FAILURE');
    } else if (status === 'FAILED') {
      onError('LOAD_FAILED');
    }
  }, [status, onError]);

  return null;
};

export const NearbyHelpMap: React.FC<NearbyHelpMapProps> = ({
  userLocation,
  locations,
  selectedLocation,
  onSelectLocation,
  onOpenDetails,
}) => {
  // Read Vite build-time environment variable safely
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

  // Session override for instant preview validation
  const [sessionKey, setSessionKey] = useState<string>(() => {
    try {
      return (sessionStorage.getItem('CYBERSAFE_MAPS_KEY_OVERRIDE') || '').trim();
    } catch {
      return '';
    }
  });

  const [inputKey, setInputKey] = useState('');
  const [isCopiedOrigin, setIsCopiedOrigin] = useState(false);
  const [authErrorType, setAuthErrorType] = useState<string | null>(null);
  const [showOverrideInput, setShowOverrideInput] = useState(false);

  const activeApiKey = envKey || sessionKey;
  const currentOrigin = typeof window !== 'undefined' ? `${window.location.origin}/*` : 'https://*.vercel.app/*';

  // Listen for Google Maps runtime diagnostic events
  useEffect(() => {
    const handleAuthFailure = () => setAuthErrorType('AUTH_FAILURE');
    const handleRefererError = () => setAuthErrorType('REFERER_ERROR');
    const handleApiNotActivated = () => setAuthErrorType('API_NOT_ACTIVATED');
    const handleInvalidKey = () => setAuthErrorType('INVALID_KEY');
    const handleBillingError = () => setAuthErrorType('BILLING_ERROR');

    window.addEventListener('gmp-auth-failure', handleAuthFailure);
    window.addEventListener('gmp-referer-error', handleRefererError);
    window.addEventListener('gmp-api-not-activated', handleApiNotActivated);
    window.addEventListener('gmp-invalid-key', handleInvalidKey);
    window.addEventListener('gmp-billing-error', handleBillingError);

    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFailure);
      window.removeEventListener('gmp-referer-error', handleRefererError);
      window.removeEventListener('gmp-api-not-activated', handleApiNotActivated);
      window.removeEventListener('gmp-invalid-key', handleInvalidKey);
      window.removeEventListener('gmp-billing-error', handleBillingError);
    };
  }, []);

  const handleApplySessionKey = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputKey.trim();
    if (!clean) return;
    try {
      sessionStorage.setItem('CYBERSAFE_MAPS_KEY_OVERRIDE', clean);
      setSessionKey(clean);
      setAuthErrorType(null);
    } catch {
      // Ignored
    }
  };

  const handleClearSessionKey = () => {
    try {
      sessionStorage.removeItem('CYBERSAFE_MAPS_KEY_OVERRIDE');
      setSessionKey('');
      setAuthErrorType(null);
      setInputKey('');
    } catch {
      // Ignored
    }
  };

  const handleCopyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    setIsCopiedOrigin(true);
    setTimeout(() => setIsCopiedOrigin(false), 2000);
  };

  // 1. Missing API Key State (Vercel / Build configuration guide)
  if (!activeApiKey) {
    return (
      <div className="relative w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Google Maps Platform Key Required
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mb-6 leading-relaxed">
          The interactive map requires a Google Maps API Key. In Vite applications deployed to Vercel, the key is baked into the frontend bundle at build time using the variable name:
        </p>

        <div className="bg-slate-900 text-slate-100 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold mb-6 flex items-center gap-2 shadow-xs">
          <span>VITE_GOOGLE_MAPS_API_KEY</span>
        </div>

        {/* Quick Resolution Checklist for Vercel */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6 shadow-xs text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>To Enable on Vercel:</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
            <li>
              Go to <strong>Vercel Dashboard</strong> &rarr; <strong>Project Settings</strong> &rarr; <strong>Environment Variables</strong>.
            </li>
            <li>
              Add Key: <code className="px-1 py-0.5 bg-slate-100 text-slate-800 rounded font-mono font-semibold">VITE_GOOGLE_MAPS_API_KEY</code> with your key value. Check <strong>Production</strong> and <strong>Preview</strong>.
            </li>
            <li>
              Go to <strong>Deployments</strong> &rarr; click <code className="px-1 py-0.5 bg-slate-100 text-slate-800 rounded font-mono">...</code> &rarr; <strong>Redeploy</strong> (Vite bundles the key during build).
            </li>
          </ol>
        </div>

        {/* Quick Session Key Testing Field */}
        <div className="w-full max-w-md">
          {!showOverrideInput ? (
            <button
              type="button"
              onClick={() => setShowOverrideInput(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
            >
              Have a key right now? Test it in this session without redeploying &rarr;
            </button>
          ) : (
            <form onSubmit={handleApplySessionKey} className="bg-white border border-blue-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <label htmlFor="temp-key-input" className="block text-left text-xs font-bold text-slate-900">
                Test API Key in Current Browser Session:
              </label>
              <div className="flex gap-2">
                <input
                  id="temp-key-input"
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputKey.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs"
                >
                  Load Map
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-left">
                Key will be stored in this session only for testing. For production, add it to Vercel Environment Variables.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 2. Google Maps API Runtime Error State (Referrer, Invalid Key, API not active)
  if (authErrorType) {
    let errorTitle = 'Google Maps Authorization Error';
    let errorDescription = 'Google Maps failed to authorize this request. Please review your Google Cloud settings.';
    let recommendation = '';

    if (authErrorType === 'REFERER_ERROR') {
      errorTitle = 'Google Maps HTTP Referrer Restriction Mismatch';
      errorDescription = `Your API key in Google Cloud Console has HTTP Referrer restrictions that do not include this domain (${currentOrigin}).`;
      recommendation = `In Google Cloud Console -> APIs & Services -> Credentials -> Edit API Key -> Under "Website restrictions", add "${currentOrigin}" and click Save.`;
    } else if (authErrorType === 'API_NOT_ACTIVATED') {
      errorTitle = 'Maps JavaScript API Not Activated';
      errorDescription = 'The Maps JavaScript API has not been enabled in your Google Cloud Project.';
      recommendation = 'In Google Cloud Console -> APIs & Services -> Library -> Search for "Maps JavaScript API" and click "Enable".';
    } else if (authErrorType === 'INVALID_KEY') {
      errorTitle = 'Invalid Google Maps API Key';
      errorDescription = 'The API key provided was not recognized by Google Maps Platform.';
      recommendation = 'Double-check that the key string copied into Vercel or your session has no trailing spaces or missing characters.';
    } else if (authErrorType === 'BILLING_ERROR') {
      errorTitle = 'Google Cloud Billing Account Required';
      errorDescription = 'Google Maps Platform APIs require an active billing account linked to your Google Cloud project.';
      recommendation = 'Link a billing account in Google Cloud Console (Google provides a monthly free tier credit of $200 for maps).';
    }

    return (
      <div className="relative w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] rounded-3xl overflow-hidden border border-rose-200 bg-rose-50/70 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">{errorTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{errorDescription}</p>
        </div>

        {recommendation && (
          <div className="w-full max-w-md bg-white border border-rose-200 rounded-2xl p-4 text-left space-y-2 shadow-xs text-xs text-slate-700">
            <span className="font-bold text-rose-900 block">How to Fix in Google Cloud:</span>
            <p className="leading-relaxed">{recommendation}</p>

            {authErrorType === 'REFERER_ERROR' && (
              <div className="pt-2 flex items-center gap-2">
                <code className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-mono text-[11px] truncate flex-1">
                  {currentOrigin}
                </code>
                <button
                  type="button"
                  onClick={handleCopyOrigin}
                  className="px-2.5 py-1 bg-slate-800 text-white font-bold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
                >
                  {isCopiedOrigin ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopiedOrigin ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setAuthErrorType(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Map</span>
          </button>

          {sessionKey && (
            <button
              type="button"
              onClick={handleClearSessionKey}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Clear Session Key
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 max-w-sm pt-2">
          Note: You can still view all verified nearby facilities, contact info, and navigation links in the list beside this map.
        </p>
      </div>
    );
  }

  // 3. Active Interactive Map View
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <APIProvider
        apiKey={activeApiKey}
        libraries={['marker']}
        onError={() => setAuthErrorType('LOAD_FAILED')}
      >
        <ApiStatusWatcher onError={(type) => setAuthErrorType(type)} />
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={true}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController
            userLocation={userLocation}
            locations={locations}
            selectedLocation={selectedLocation}
          />

          {/* User Location Marker with Radar Pulse */}
          <AdvancedMarker
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            title={userLocation.localityLabel ? `Search Point: ${userLocation.localityLabel}` : 'Your Approximate Location'}
            zIndex={100}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
              <div className="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </AdvancedMarker>

          {/* Nearby Police & Cyber Facilities */}
          {locations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            const isCyber = loc.isCyberDedicated;

            return (
              <AdvancedMarker
                key={loc.id}
                position={{ lat: loc.latitude, lng: loc.longitude }}
                title={loc.name}
                zIndex={isSelected ? 60 : 20}
                onClick={() => onSelectLocation(loc)}
              >
                <div
                  className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
                    isSelected ? 'ring-4 ring-blue-500 scale-110 z-50' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center ${
                      isCyber
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/50'
                        : loc.category === 'GOVERNMENT SUPPORT'
                        ? 'bg-indigo-700 text-white border-indigo-500'
                        : 'bg-slate-800 text-white border-slate-700'
                    }`}
                  >
                    {isCyber ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="12" x="3" y="4" rx="2" />
                        <line x1="2" x2="22" y1="20" y2="20" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-1 w-2 h-2 rotate-45 ${
                      isCyber
                        ? 'bg-cyan-600'
                        : loc.category === 'GOVERNMENT SUPPORT'
                        ? 'bg-indigo-700'
                        : 'bg-slate-800'
                    }`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Interactive Location InfoWindow */}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              pixelOffset={[0, -36]}
              headerDisabled={true}
              onCloseClick={() => {
                // Keep selected or dismiss
              }}
            >
              <div className="p-1 text-slate-900 space-y-1.5 max-w-[240px] text-xs font-sans">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      selectedLocation.isCyberDedicated
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {selectedLocation.category}
                  </span>
                  <span className="text-slate-500 font-bold ml-auto">
                    {selectedLocation.distanceKm} km
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 leading-tight">
                  {selectedLocation.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {selectedLocation.address}
                </div>
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => onOpenDetails(selectedLocation)}
                    className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-center transition cursor-pointer"
                  >
                    View Details
                  </button>
                  <a
                    href={getDirectionsUrl(
                      selectedLocation.latitude,
                      selectedLocation.longitude,
                      selectedLocation.name
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg inline-flex items-center gap-1 transition"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-xs">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span>You</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block"></span>
          <span>Police Station</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block"></span>
          <span>Cybercrime Desk</span>
        </div>
      </div>
    </div>
  );
};
