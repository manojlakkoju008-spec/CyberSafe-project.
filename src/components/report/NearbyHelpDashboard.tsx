import React, { useState, useEffect, useRef } from 'react';
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
  Filter,
  Layers,
  ArrowRight,
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

export const NearbyHelpDashboard: React.FC = () => {
  // Coordinates & Results
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [locations, setLocations] = useState<NearbyHelpLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<NearbyHelpLocation | null>(null);
  const [modalLocation, setModalLocation] = useState<NearbyHelpLocation | null>(null);

  // Search & Loading State
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(10);
  const [hasCyberCell, setHasCyberCell] = useState(false);

  // Manual Search Query
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingQuery, setIsSearchingQuery] = useState(false);

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | NearbyLocationCategory>('all');
  const [activeRadius, setActiveRadius] = useState<number>(10); // 5, 10, 25

  // Ref for results list scrolling
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Major cities quick search chips
  const quickCities = [
    { name: 'Hyderabad', query: 'Hyderabad, Telangana' },
    { name: 'Visakhapatnam', query: 'Visakhapatnam, Andhra Pradesh' },
    { name: 'Bengaluru', query: 'Bengaluru, Karnataka' },
    { name: 'Delhi', query: 'New Delhi, Delhi' },
    { name: 'Mumbai', query: 'Mumbai, Maharashtra' },
    { name: 'Chennai', query: 'Chennai, Tamil Nadu' },
  ];

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        'Geolocation is not supported by your current browser. You can enter a city, area or PIN code manually below.'
      );
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

        await executeNearbySearch(lat, lon, activeRadius * 1000, accuracy);
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
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Perform location search
  const executeNearbySearch = async (
    lat: number,
    lon: number,
    radiusMeters = activeRadius * 1000,
    accuracyMeters?: number,
    overrideLocality?: string
  ) => {
    setIsSearchingNearby(true);
    setStatusMessage('Finding nearby reporting locations...');
    setErrorMessage(null);

    try {
      const locality = overrideLocality || (await reverseGeocodeLocality(lat, lon));

      setUserLocation({
        latitude: lat,
        longitude: lon,
        accuracyMeters,
        localityLabel: locality,
      });

      const { locations: foundLocations, searchRadiusKm: radius, hasCyberCell: cyberFound } =
        await fetchNearbyPoliceLocations(lat, lon, radiusMeters, false);

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

  // Manual search submit
  const handleManualSearch = async (queryToUse?: string) => {
    const q = (queryToUse || searchQuery).trim();
    if (!q) return;

    setIsSearchingQuery(true);
    setErrorMessage(null);
    setStatusMessage(`Searching for "${q}"...`);

    try {
      const coords = await searchLocationByQuery(q);
      if (!coords) {
        setErrorMessage(
          `Could not find coordinates for "${q}". Please check the spelling or try adding state/country (e.g. "${q}, India").`
        );
        setIsSearchingQuery(false);
        setStatusMessage(null);
        return;
      }

      await executeNearbySearch(
        coords.latitude,
        coords.longitude,
        activeRadius * 1000,
        undefined,
        coords.localityLabel || q
      );
    } catch (err) {
      console.error('Search error:', err);
      setErrorMessage('Search query failed. Please try again.');
    } finally {
      setIsSearchingQuery(false);
      setStatusMessage(null);
    }
  };

  // Radius change handler
  const handleRadiusChange = (newRadiusKm: number) => {
    setActiveRadius(newRadiusKm);
    if (userLocation) {
      executeNearbySearch(userLocation.latitude, userLocation.longitude, newRadiusKm * 1000);
    }
  };

  // Filtered locations
  const filteredLocations = locations.filter((loc) => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'CYBERCRIME / CYBER CELL') return loc.isCyberDedicated;
    return loc.category === selectedCategoryFilter;
  });

  // Synchronize card click with map
  const handleCardClick = (loc: NearbyHelpLocation) => {
    setSelectedLocation(loc);
  };

  // Scroll card into view when selected on map
  useEffect(() => {
    if (selectedLocation && cardRefs.current[selectedLocation.id]) {
      cardRefs.current[selectedLocation.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedLocation]);

  return (
    <section id="nearby-help-dashboard" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span>Live Geospatial Assistance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Find Nearby Help
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find nearby police stations and relevant reporting locations based on your current location or city.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 max-w-md shadow-2xs flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy First:</strong> Your location is used only to find nearby assistance. CyberSafe does not store or track your precise location.
            </p>
          </div>
        </div>

        {/* Search & Location Bar */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Primary Locate Button */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating || isSearchingNearby}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm transition inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isLocating || isSearchingNearby ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
              <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
            </button>

            <span className="hidden lg:inline text-xs font-bold text-slate-400">or</span>

            {/* Manual Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                placeholder="Search city, area or PIN code (e.g., Hyderabad, 500081, Connaught Place)"
                className="w-full pl-9 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleManualSearch()}
                disabled={isSearchingQuery || !searchQuery.trim()}
                className="absolute right-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                {isSearchingQuery ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Radius Options */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-center">
              <span className="text-[11px] font-bold text-slate-500 px-2">Radius:</span>
              {[5, 10, 25].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => handleRadiusChange(rad)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeRadius === rad
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {rad} km
                </button>
              ))}
            </div>
          </div>

          {/* Quick Hub Suggestions */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Search:</span>
            {quickCities.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setSearchQuery(c.name);
                  handleManualSearch(c.query);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition cursor-pointer"
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Status / Error feedback */}
          {statusMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900 rounded-xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-900 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{errorMessage}</span>
                <div className="text-[11px] text-rose-700">
                  Tip: You can use the search bar above to type any city or locality name without browser permissions.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop 60% Map / 40% Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Section (60% on desktop = 7 or 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3">
            <div className="p-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {userLocation ? (
                <NearbyHelpMap
                  userLocation={userLocation}
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={(loc) => setSelectedLocation(loc)}
                  onOpenDetails={(loc) => setModalLocation(loc)}
                />
              ) : (
                <div className="w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4 border border-slate-200">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div className="max-w-sm space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Interactive Map Ready
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Click <strong>"Use My Location"</strong> or enter a city name above to load verified police stations and cyber assistance desks on the map.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Find Nearby Help</span>
                  </button>
                </div>
              )}
            </div>

            {/* Map Legend & Guidance */}
            {userLocation && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">Search Point:</span>
                  <span className="text-blue-700 font-semibold truncate max-w-xs">
                    {userLocation.localityLabel || 'Current Coordinates'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Radius: {activeRadius} km</span>
                  <span>•</span>
                  <span>Found: {filteredLocations.length} locations</span>
                </div>
              </div>
            )}
          </div>

          {/* Results List Section (40% on desktop = 5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-3">
            {/* Filter Tabs */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter Locations</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredLocations.length} results
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({locations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('POLICE STATION')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedCategoryFilter === 'POLICE STATION'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Police Stations
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('CYBERCRIME / CYBER CELL')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedCategoryFilter === 'CYBERCRIME / CYBER CELL'
                      ? 'bg-cyan-700 text-white'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100'
                  }`}
                >
                  Cyber Desks
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('GOVERNMENT SUPPORT')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                    selectedCategoryFilter === 'GOVERNMENT SUPPORT'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Govt
                </button>
              </div>
            </div>

            {/* Results Cards List */}
            <div className="space-y-3 max-h-[500px] lg:max-h-[560px] overflow-y-auto pr-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  const isCyber = loc.isCyberDedicated;
                  const directionsUrl = getDirectionsUrl(loc.latitude, loc.longitude, loc.name);

                  return (
                    <div
                      key={loc.id}
                      ref={(el) => {
                        cardRefs.current[loc.id] = el;
                      }}
                      onClick={() => handleCardClick(loc)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                                isCyber
                                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                                  : 'bg-slate-100 text-slate-800 border border-slate-300'
                              }`}
                            >
                              {loc.category}
                            </span>
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {loc.distanceKm} km away
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {loc.name}
                          </h4>
                        </div>

                        {isCyber && (
                          <span
                            title="Dedicated Cybercrime Unit"
                            className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-cyan-100 shrink-0 mt-1"
                          />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {loc.address}
                      </p>

                      {/* Action Row */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {loc.phone && (
                            <a
                              href={`tel:${loc.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold inline-flex items-center gap-1 transition"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Call</span>
                            </a>
                          )}
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold inline-flex items-center gap-1 transition"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Directions</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalLocation(loc);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : hasSearched ? (
                /* Empty Result State */
                <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      No nearby {selectedCategoryFilter !== 'all' ? selectedCategoryFilter.toLowerCase() : 'official help'} found within {activeRadius} km
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Dedicated cybercrime cells are often located at district police headquarters. You can expand the search radius or report directly through official online channels.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    {activeRadius < 25 && (
                      <button
                        type="button"
                        onClick={() => handleRadiusChange(25)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Expand Search to 25 km
                      </button>
                    )}
                    {selectedCategoryFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryFilter('all')}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                      >
                        Show All Nearby Police Stations
                      </button>
                    )}
                    <a
                      href="https://cybercrime.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Report on cybercrime.gov.in</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Initial Prompt */
                <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Ready to Search</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Use your location or search your city above to view real police stations and reporting centers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Detail Modal */}
      <LocationDetailModal
        location={modalLocation}
        onClose={() => setModalLocation(null)}
      />
    </section>
  );
};
