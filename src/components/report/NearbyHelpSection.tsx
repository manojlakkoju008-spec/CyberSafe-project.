import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  Navigation,
  Search,
  Phone,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  PhoneCall,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { NearbyHelpLocation, UserCoordinates, NearbyLocationCategory } from '../../types';
import {
  fetchNearbyPoliceLocations,
  reverseGeocodeLocality,
  searchLocationByQuery,
  getDirectionsUrl,
} from '../../services/nearbyHelpService';
import { NearbyHelpMap } from './NearbyHelpMap';
import { LocationDetailModal } from './LocationDetailModal';
import { INDIA_REPORTING_INFO } from '../../data/reportData';

export const NearbyHelpSection: React.FC = () => {
  // Search & Location State (Strictly in-memory, never stored in localStorage/Firestore/analytics)
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [locations, setLocations] = useState<NearbyHelpLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<NearbyHelpLocation | null>(null);
  const [modalLocation, setModalLocation] = useState<NearbyHelpLocation | null>(null);

  // Status & Progress
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(5);
  const [hasCyberCell, setHasCyberCell] = useState(false);

  // Manual Search Mode
  const [manualQuery, setManualQuery] = useState('');
  const [isManualSearchOpen, setIsManualSearchOpen] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);

  // List Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | NearbyLocationCategory>('all');
  const [listKeyword, setListKeyword] = useState('');

  // 1. Browser Geolocation Trigger
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        'Geolocation is not supported by your current browser. You can enter a city or PIN code manually below.'
      );
      setIsManualSearchOpen(true);
      return;
    }

    setErrorMessage(null);
    setIsLocating(true);
    setStatusMessage('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        await executeNearbySearch(lat, lon, accuracy);
      },
      (err) => {
        setIsLocating(false);
        setStatusMessage(null);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage(
            'Location access was not allowed. You can enable location permission in your browser settings, or manually search for a city or locality below.'
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMessage(
            'Location information is unavailable on your device. Try searching for your city or area manually.'
          );
        } else if (err.code === err.TIMEOUT) {
          setErrorMessage(
            'The request to get your location timed out. Please try again or search manually.'
          );
        } else {
          setErrorMessage(
            'Unable to determine location. Please search for your city or PIN code manually.'
          );
        }
        setIsManualSearchOpen(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // 2. Perform Query around coordinates
  const executeNearbySearch = async (
    lat: number,
    lon: number,
    accuracyMeters?: number,
    overrideLocality?: string
  ) => {
    setIsSearchingNearby(true);
    setStatusMessage('Finding nearby reporting locations...');
    setErrorMessage(null);

    try {
      // Step A: Reverse geocode locality name if not already provided
      const locality = overrideLocality || (await reverseGeocodeLocality(lat, lon));

      setUserLocation({
        latitude: lat,
        longitude: lon,
        accuracyMeters,
        localityLabel: locality,
      });

      // Step B: Query real locations from Overpass API
      const { locations: foundLocations, searchRadiusKm: radius, hasCyberCell: cyberFound } =
        await fetchNearbyPoliceLocations(lat, lon);

      setLocations(foundLocations);
      setSearchRadiusKm(radius);
      setHasCyberCell(cyberFound);
      setHasSearched(true);

      if (foundLocations.length > 0) {
        setSelectedLocation(foundLocations[0]);
      } else {
        setSelectedLocation(null);
      }
    } catch (err) {
      console.error('Failed to search nearby locations:', err);
      setErrorMessage(
        'We encountered a network issue while querying the geospatial database. Please try again or search for another city manually.'
      );
    } finally {
      setIsSearchingNearby(false);
      setStatusMessage(null);
    }
  };

  // 3. Manual Search handler
  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    setIsManualLoading(true);
    setErrorMessage(null);
    setStatusMessage(`Locating "${manualQuery.trim()}"...`);

    const coords = await searchLocationByQuery(manualQuery.trim());
    setIsManualLoading(false);

    if (!coords) {
      setStatusMessage(null);
      setErrorMessage(
        `We couldn't find coordinates for "${manualQuery}". Please verify the city name or try a nearby district / PIN code.`
      );
      return;
    }

    await executeNearbySearch(coords.latitude, coords.longitude, undefined, coords.localityLabel);
  };

  // Reset search
  const handleResetSearch = () => {
    setUserLocation(null);
    setLocations([]);
    setSelectedLocation(null);
    setHasSearched(false);
    setErrorMessage(null);
    setStatusMessage(null);
    setListKeyword('');
    setSelectedCategoryFilter('all');
  };

  // Filtered list
  const filteredLocations = locations.filter((loc) => {
    const matchesCategory =
      selectedCategoryFilter === 'all' || loc.category === selectedCategoryFilter;
    const matchesKeyword =
      !listKeyword ||
      loc.name.toLowerCase().includes(listKeyword.toLowerCase()) ||
      loc.address.toLowerCase().includes(listKeyword.toLowerCase());
    return matchesCategory && matchesKeyword;
  });

  return (
    <section
      id="find-nearby-help"
      aria-label="Find Nearby Help"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8 animate-fadeIn"
    >
      {/* 1. Header & Mandatory Principles */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Assistance & Navigation Tool</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">Physical Incident Support</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Help
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Find nearby police stations and relevant reporting locations based on your current location.
          </p>
        </div>

        {/* Privacy Note Guarantee */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3 max-w-3xl">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold block">Location Privacy Guarantee:</strong>
            <p className="leading-relaxed">
              Your location is used only to find nearby locations. CyberSafe does not store your precise location, does not track your location history, and does not save your coordinates in any database.
            </p>
          </div>
        </div>

        {/* Important Product Principle Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3 max-w-3xl">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-900 font-bold block">Assistance Protocol Transparency:</strong>
            <p className="text-amber-900/90 leading-relaxed font-normal">
              CyberSafe is not a police department and does not submit complaints on your behalf. Visiting a physical station is an optional local step; statutory financial and online reports should always be initiated via the national helpline <strong>1930</strong> or the <strong>Official Government Portal (cybercrime.gov.in)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Action Bar (Find Nearby Help & Manual Fallback) */}
      {!hasSearched ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Ready to Locate Physical Reporting Facilities?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Click below to request one-time browser location access. We will search for police stations and specialized cybercrime units within a 5 to 25 km radius.
            </p>
          </div>

          {/* Primary Geolocation Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              id="find-nearby-help-btn"
              disabled={isLocating || isSearchingNearby}
              onClick={handleRequestLocation}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating || isSearchingNearby ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{statusMessage || 'Locating...'}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>Find Nearby Help</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="manual-search-toggle-btn"
              onClick={() => setIsManualSearchOpen(!isManualSearchOpen)}
              className="px-4 py-3 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{isManualSearchOpen ? 'Hide Manual Search' : 'Search a location manually'}</span>
            </button>
          </div>

          {/* Error / Feedback Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Notice:</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Manual Search Form Accordion */}
          {isManualSearchOpen && (
            <form onSubmit={handleManualSearch} className="pt-2 border-t border-slate-200/80 space-y-3 animate-fadeIn">
              <label htmlFor="manual-search-input" className="block text-xs font-bold text-slate-700">
                Enter City, Locality, or PIN Code:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="manual-search-input"
                    type="text"
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    placeholder="e.g. Bengaluru, Connaught Place, Mumbai, 560001"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isManualLoading || !manualQuery.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  {isManualLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search Area</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Ideal for desktops without GPS, users with location denied, or looking up facilities for a family member elsewhere.
              </p>
            </form>
          )}
        </div>
      ) : (
        /* Results Mode Active Bar */
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">
              Active Search Anchor:
            </span>
            <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {userLocation?.localityLabel || `${userLocation?.latitude.toFixed(4)}, ${userLocation?.longitude.toFixed(4)}`}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">
              Found {locations.length} locations within {searchRadiusKm} km
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsManualSearchOpen(!isManualSearchOpen)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              Change Area
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick inline search for new city if opened */}
          {isManualSearchOpen && (
            <form onSubmit={handleManualSearch} className="w-full pt-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Search another city or PIN code..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isManualLoading || !manualQuery.trim()}
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                Search
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. Cybercrime Office Distinction Warning (If no cyber cell nearby) */}
      {hasSearched && !hasCyberCell && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>No Dedicated Cybercrime Cell Found in Immediate Vicinity</span>
          </div>
          <p className="text-amber-900/90 leading-relaxed font-normal">
            No dedicated cybercrime location was identified nearby. You can still contact your nearest police station or use the official online cybercrime reporting channels.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:1930"
              className="px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
              <span>Cybercrime Helpline: 1930</span>
            </a>
            <a
              href={INDIA_REPORTING_INFO.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 transition"
            >
              <span>{INDIA_REPORTING_INFO.portalLabel}: cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-amber-800" />
            </a>
          </div>
        </div>
      )}

      {/* 4. Map & List Two-Column Layout */}
      {hasSearched && userLocation && (
        <div className="space-y-6">
          {/* Top Filters & Keyword Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Locations ({locations.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('CYBERCRIME / CYBER CELL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedCategoryFilter === 'CYBERCRIME / CYBER CELL'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/60'
                }`}
              >
                <span>Cybercrime Desks</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-200/50">
                  {locations.filter((l) => l.isCyberDedicated).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('POLICE STATION')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedCategoryFilter === 'POLICE STATION'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Police Stations ({locations.filter((l) => l.category === 'POLICE STATION').length})
              </button>
            </div>

            {/* Keyword Filter Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listKeyword}
                onChange={(e) => setListKeyword(e.target.value)}
                placeholder="Filter by name or street..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grid Layout: Desktop 2-Column (Map Left, List Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: INTERACTIVE MAP */}
            <div className="lg:col-span-7 space-y-2 sticky top-4">
              <NearbyHelpMap
                userLocation={userLocation}
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                onOpenDetails={(loc) => setModalLocation(loc)}
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Map tiles &copy; OpenStreetMap contributors &copy; CARTO</span>
                <span>Click markers to view quick summary</span>
              </div>
            </div>

            {/* RIGHT COLUMN: NEARBY LOCATIONS LIST (SORTED BY DISTANCE) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nearby Facilities ({filteredLocations.length})
                </span>
                <span className="text-xs text-slate-400">Sorted by distance</span>
              </div>

              {filteredLocations.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800">No Facilities Match Filter</h4>
                    <p className="text-xs text-slate-500">
                      Try clearing the filter or expanding your search query.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryFilter('all');
                      setListKeyword('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                  {filteredLocations.map((loc) => {
                    const isSelected = selectedLocation?.id === loc.id;
                    const isCyber = loc.isCyberDedicated;
                    const directionsUrl = getDirectionsUrl(loc.latitude, loc.longitude, loc.name);

                    return (
                      <div
                        key={loc.id}
                        id={`location-card-${loc.id}`}
                        onClick={() => setSelectedLocation(loc)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                        }`}
                      >
                        {/* Top: Category & Distance */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isCyber
                                ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            {loc.category}
                          </span>
                          <span className="font-extrabold text-blue-700 text-xs">
                            {loc.distanceKm} km away
                          </span>
                        </div>

                        {/* Title & Address */}
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {loc.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {loc.address}
                          </p>
                        </div>

                        {/* Phone if available */}
                        {loc.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <a
                              href={`tel:${loc.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline font-medium text-emerald-700"
                            >
                              {loc.phone}
                            </a>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalLocation(loc);
                            }}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
                          >
                            View Details
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLocation(loc);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                            >
                              View on Map
                            </button>
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1 transition shadow-2xs"
                            >
                              <span>Directions</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Location Details Modal */}
      <LocationDetailModal
        location={modalLocation}
        onClose={() => setModalLocation(null)}
      />
    </section>
  );
};
