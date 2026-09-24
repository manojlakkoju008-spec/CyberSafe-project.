import { NearbyHelpLocation, NearbyLocationCategory, UserCoordinates } from '../types';

/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Validates and formats an external URL.
 */
export function sanitizeExternalUrl(urlStr?: string): string | undefined {
  if (!urlStr) return undefined;
  try {
    const trimmed = urlStr.trim();
    if (!trimmed) return undefined;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // invalid URL format
  }
  return undefined;
}

/**
 * Generates an external directions URL for Google Maps / Universal navigation.
 */
export function getDirectionsUrl(lat: number, lon: number, name?: string): string {
  const query = name ? `${name}, ${lat},${lon}` : `${lat},${lon}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/**
 * Overpass API public endpoints (with fallback redundancy).
 */
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

/**
 * Tests if location tags indicate a dedicated cybercrime unit / cyber cell.
 * STRICT RULE: Only label as cybercrime when underlying location data actually identifies it that way.
 */
function isCybercrimeFacility(tags: Record<string, string>): boolean {
  const combined = [
    tags.name,
    tags['name:en'],
    tags.official_name,
    tags.operator,
    tags.description,
    tags.branch,
    tags.police,
    tags.department,
    tags.note,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return /\b(cyber|cybercrime|cyber\s*cell|cyber\s*police|cyber\s*crime\s*police|cyber\s*than?a|cyber\s*security)\b/i.test(combined);
}

/**
 * Determines appropriate category based on OSM tags without false claims.
 */
function categorizeLocation(tags: Record<string, string>): { category: NearbyLocationCategory; isCyber: boolean } {
  const isCyber = isCybercrimeFacility(tags);
  if (isCyber) {
    return { category: 'CYBERCRIME / CYBER CELL', isCyber: true };
  }

  if (tags.amenity === 'police') {
    return { category: 'POLICE STATION', isCyber: false };
  }

  if (tags.office === 'government' || tags.government) {
    return { category: 'GOVERNMENT SUPPORT', isCyber: false };
  }

  return { category: 'OTHER RELEVANT HELP', isCyber: false };
}

/**
 * Builds a readable clean address string from OSM address tags.
 */
function formatOsmAddress(tags: Record<string, string>, defaultCity?: string): string {
  if (tags['addr:full']) {
    return tags['addr:full'];
  }

  const parts: string[] = [];
  if (tags['addr:housenumber'] || tags['addr:street']) {
    parts.push([tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' '));
  }
  if (tags['addr:suburb'] || tags['addr:neighbourhood']) {
    parts.push(tags['addr:suburb'] || tags['addr:neighbourhood']);
  }
  if (tags['addr:city'] || tags['addr:district']) {
    parts.push(tags['addr:city'] || tags['addr:district']);
  } else if (defaultCity) {
    parts.push(defaultCity);
  }
  if (tags['addr:state']) {
    parts.push(tags['addr:state']);
  }
  if (tags['addr:postcode']) {
    parts.push(tags['addr:postcode']);
  }

  return parts.length > 0 ? parts.join(', ') : 'Address details not specified in public records';
}

// In-memory cache to avoid repeated queries within same session
const queryCache = new Map<string, { data: { locations: NearbyHelpLocation[]; searchRadiusKm: number; hasCyberCell: boolean }; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches real police and reporting locations around coordinates using OpenStreetMap Overpass API.
 * Supports explicit radius (5000m, 10000m, 25000m) with fallback.
 */
export async function fetchNearbyPoliceLocations(
  lat: number,
  lon: number,
  requestedRadiusMeters = 5000,
  autoExpand = true
): Promise<{ locations: NearbyHelpLocation[]; searchRadiusKm: number; hasCyberCell: boolean }> {
  // Round coordinates to ~100m for cache lookup
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}-${requestedRadiusMeters}-${autoExpand}`;
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const radiiToTry = autoExpand 
    ? [requestedRadiusMeters, 10000, 25000].filter((r, idx, arr) => arr.indexOf(r) === idx && r >= requestedRadiusMeters)
    : [requestedRadiusMeters];

  let finalLocations: NearbyHelpLocation[] = [];
  let successfulRadiusKm = Math.round(requestedRadiusMeters / 1000);

  for (const radius of radiiToTry) {
    const currentRadiusKm = Math.round(radius / 1000);
    const query = `[out:json][timeout:20];
(
  node["amenity"="police"](around:${radius},${lat},${lon});
  way["amenity"="police"](around:${radius},${lat},${lon});
  relation["amenity"="police"](around:${radius},${lat},${lon});
  node["office"="government"]["government"~"police|cybercrime|justice",i](around:${radius},${lat},${lon});
);
out center tags;`;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          continue; // try next endpoint
        }

        const data = await response.json();
        const elements: any[] = data.elements || [];

        const parsed: NearbyHelpLocation[] = [];
        const seenIds = new Set<string>();

        for (const el of elements) {
          const tags = el.tags || {};
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;

          if (elLat === undefined || elLon === undefined) continue;

          const rawName = tags.name || tags['name:en'] || tags.official_name;
          // Skip if missing name and tags are completely generic
          const name = rawName || (tags.amenity === 'police' ? 'Police Station' : 'Government Office');

          const { category, isCyber } = categorizeLocation(tags);
          const distance = calculateDistanceKm(lat, lon, elLat, elLon);
          const id = `${el.type}-${el.id}`;

          if (seenIds.has(id)) continue;
          seenIds.add(id);

          parsed.push({
            id,
            name,
            category,
            isCyberDedicated: isCyber,
            latitude: elLat,
            longitude: elLon,
            distanceKm: distance,
            address: formatOsmAddress(tags),
            city: tags['addr:city'],
            state: tags['addr:state'],
            postcode: tags['addr:postcode'],
            phone: tags.phone || tags['contact:phone'] || tags.mobile,
            website: sanitizeExternalUrl(tags.website || tags['contact:website']),
            openingHours: tags.opening_hours,
            osmType: el.type,
            osmId: el.id,
            verifiedSource: 'OpenStreetMap',
          });
        }

        // Sort ascending by distance
        parsed.sort((a, b) => a.distanceKm - b.distanceKm);

        if (parsed.length > 0) {
          finalLocations = parsed;
          successfulRadiusKm = currentRadiusKm;
          // If we found 3 or more locations (or any cyber cell), we can stop expanding
          if (parsed.length >= 3 || parsed.some((p) => p.isCyberDedicated)) {
            break;
          }
        }
      } catch (err) {
        console.warn(`Overpass query error on ${endpoint}:`, err);
        // Continue to fallback endpoint
      }
    }

    if (finalLocations.length >= 3 || finalLocations.some((l) => l.isCyberDedicated)) {
      break;
    }
  }

  // Cap results at a reasonable, performant maximum (e.g., 20 locations)
  const cappedLocations = finalLocations.slice(0, 20);
  const hasCyberCell = cappedLocations.some((l) => l.isCyberDedicated);

  const result = {
    locations: cappedLocations,
    searchRadiusKm: successfulRadiusKm,
    hasCyberCell,
  };

  queryCache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}

/**
 * Reverse geocodes coordinates to a clean human-readable locality string.
 */
export async function reverseGeocodeLocality(lat: number, lon: number): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || addr.town || addr.county;
      const city = addr.city || addr.state_district || addr.state;
      if (locality && city && locality !== city) {
        return `${locality}, ${city}`;
      }
      return locality || city || data.name || undefined;
    }
  } catch {
    // non-fatal
  }
  return undefined;
}

/**
 * Manually searches for a city, locality, or PIN code using Nominatim.
 */
export async function searchLocationByQuery(query: string): Promise<UserCoordinates | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        const item = list[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return {
            latitude: lat,
            longitude: lon,
            localityLabel: item.display_name?.split(',').slice(0, 2).join(',').trim() || trimmed,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Geocoding manual search failed:', err);
  }

  return null;
}
