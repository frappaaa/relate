
import { useState, useCallback } from 'react';

interface GeocodingResult {
  lat: number;
  lng: number;
}

type GeocodingStatus = 'idle' | 'loading' | 'success' | 'error';

export const useGeocode = () => {
  const [geocodingStatus, setGeocodingStatus] = useState<GeocodingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Cache previously geocoded addresses to avoid repeated API calls
  const geocodeCache = new Map<string, GeocodingResult>();

  const geocodeAddress = useCallback(async (address: string): Promise<GeocodingResult | null> => {
    if (!address) return null;

    // Check cache first
    if (geocodeCache.has(address)) {
      return geocodeCache.get(address)!;
    }

    setGeocodingStatus('loading');
    setError(null);

    try {
      // Use OpenStreetMap's Nominatim service (free but has rate limits)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'it', // Prefer Italian results
            'User-Agent': 'Relate Health App' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        
        // Cache the result
        geocodeCache.set(address, result);
        
        setGeocodingStatus('success');
        return result;
      } else {
        setGeocodingStatus('error');
        setError('No results found for this address');
        return null;
      }
    } catch (err) {
      setGeocodingStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error during geocoding');
      console.error('Geocoding error:', err);
      return null;
    }
  }, []);

  return {
    geocodeAddress,
    geocodingStatus,
    error
  };
};
