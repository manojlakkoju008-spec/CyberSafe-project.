import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NearbyHelpLocation, UserCoordinates } from '../../types';
import { getDirectionsUrl } from '../../services/nearbyHelpService';
import { Crosshair, ExternalLink, ShieldCheck, MapPin, ZoomIn, ZoomOut } from 'lucide-react';

interface NearbyHelpMapProps {
  userLocation: UserCoordinates;
  locations: NearbyHelpLocation[];
  selectedLocation: NearbyHelpLocation | null;
  onSelectLocation: (loc: NearbyHelpLocation) => void;
  onOpenDetails: (loc: NearbyHelpLocation) => void;
}

export const NearbyHelpMap: React.FC<NearbyHelpMapProps> = ({
  userLocation,
  locations,
  selectedLocation,
  onSelectLocation,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 13,
        zoomControl: false, // We render custom CyberSafe styled zoom controls
        attributionControl: false,
      });

      // CartoDB Voyager tiles (clean, neutral, readable, matches CyberSafe palette)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Attribution control in small font at bottom-right
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Center map on user location if coordinates changed
    map.setView([userLocation.latitude, userLocation.longitude], map.getZoom());

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
        <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'custom-user-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindTooltip(
      `<div class="font-bold text-xs text-slate-900">${userLocation.localityLabel ? `Search Point: ${userLocation.localityLabel}` : 'Your Approximate Location'}</div>`,
      { direction: 'top', offset: [0, -14], className: 'cybersafe-map-tooltip' }
    );

    userMarkerRef.current = marker;
  }, [userLocation.latitude, userLocation.longitude, userLocation.localityLabel]);

  // Update Nearby Locations Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous location markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;
      const isCyber = loc.isCyberDedicated;

      let pinColor = 'bg-slate-800 text-white border-slate-700';
      let badgeHtml = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      `;

      if (isCyber) {
        pinColor = 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/50';
        badgeHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" x2="22" y1="20" y2="20"/>
          </svg>
        `;
      } else if (loc.category === 'GOVERNMENT SUPPORT') {
        pinColor = 'bg-indigo-700 text-white border-indigo-500';
      }

      const ringClass = isSelected ? 'ring-4 ring-blue-500 scale-110 z-50' : 'hover:scale-105';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${ringClass}">
          <div class="w-8 h-8 rounded-full ${pinColor} border-2 shadow-md flex items-center justify-center">
            ${badgeHtml}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${pinColor}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-loc-marker',
        iconSize: [32, 34],
        iconAnchor: [16, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon }).addTo(map);

      // Compact, elegant popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900 space-y-1.5 max-w-[240px] text-xs font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            isCyber
              ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
              : 'bg-slate-100 text-slate-800 border border-slate-300'
          }">${loc.category}</span>
          <span class="text-slate-500 font-bold ml-auto">${loc.distanceKm} km</span>
        </div>
        <div class="font-bold text-sm text-slate-900 leading-tight">${loc.name}</div>
        <div class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${loc.address}</div>
        <div class="pt-2 flex items-center gap-2 border-t border-slate-100 mt-2">
          <button id="popup-details-${loc.id}" class="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-center transition cursor-pointer">
            View Details
          </button>
          <a href="${getDirectionsUrl(loc.latitude, loc.longitude, loc.name)}" target="_blank" rel="noopener noreferrer" class="py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg inline-flex items-center gap-1 transition">
            <span>Directions</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, closeButton: false });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`popup-details-${loc.id}`);
        if (detailsBtn) {
          detailsBtn.onclick = () => {
            onOpenDetails(loc);
          };
        }
      });

      markersRef.current[loc.id] = marker;
    });

    // Fit map bounds to show user and closest locations if available
    if (locations.length > 0) {
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        ...locations.map((l) => [l.latitude, l.longitude] as [number, number]),
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [locations, selectedLocation]);

  // Pan to selected location if it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocation) return;

    map.panTo([selectedLocation.latitude, selectedLocation.longitude], {
      animate: true,
      duration: 0.6,
    });

    const marker = markersRef.current[selectedLocation.id];
    if (marker && !marker.isPopupOpen()) {
      marker.openPopup();
    }
  }, [selectedLocation]);

  // Recenter helper
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([userLocation.latitude, userLocation.longitude], 14, { animate: true });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Custom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 shadow-md rounded-xl overflow-hidden border border-slate-200 bg-white/95 backdrop-blur-xs">
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
