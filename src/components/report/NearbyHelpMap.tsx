import React, { useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { NearbyHelpLocation, UserCoordinates } from '../../types';
import { getDirectionsUrl } from '../../services/nearbyHelpService';
import { Crosshair, ExternalLink, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';

interface NearbyHelpMapProps {
  userLocation: UserCoordinates;
  locations: NearbyHelpLocation[];
  selectedLocation: NearbyHelpLocation | null;
  onSelectLocation: (loc: NearbyHelpLocation) => void;
  onOpenDetails: (loc: NearbyHelpLocation) => void;
}

// Map Controls & Behavior sub-component inside APIProvider & Map context
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
          className="p-2.5 hover:bg-slate-100 text-slate-700 transition cursor-pointer border-b border-slate-100"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
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

export const NearbyHelpMap: React.FC<NearbyHelpMapProps> = ({
  userLocation,
  locations,
  selectedLocation,
  onSelectLocation,
  onOpenDetails,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-600" />
        <h3 className="text-base font-bold text-slate-900">Google Maps Platform Key Required</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Please configure <code className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable the interactive Google Maps view.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
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

          {/* User Location Marker */}
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
