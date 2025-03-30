
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, getMapboxToken } from './constants';

interface UseMapboxProps {
  container: HTMLDivElement | null;
  coordinates?: [number, number]; // [latitude, longitude]
  zoom?: number;
  interactive?: boolean;
}

export function useMapbox({ 
  container, 
  coordinates, 
  zoom = 14,
  interactive = true
}: UseMapboxProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(MAPBOX_TOKEN);
  
  // Fetch token if not available
  useEffect(() => {
    async function fetchToken() {
      try {
        const mapboxToken = await getMapboxToken();
        if (mapboxToken) {
          setToken(mapboxToken);
          mapboxgl.accessToken = mapboxToken;
        } else {
          setError('Impossibile recuperare il token Mapbox');
        }
      } catch (err) {
        console.error('Failed to fetch Mapbox token:', err);
        setError('Errore nel caricamento del token Mapbox');
      }
    }
    
    if (!token) {
      fetchToken();
    } else {
      mapboxgl.accessToken = token;
    }
  }, [token]);
  
  // Create and initialize the map
  useEffect(() => {
    if (!container || !coordinates || !token) return;
    
    try {
      const mapInstance = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
        zoom,
        interactive
      });
      
      mapInstance.on('load', () => {
        setIsLoaded(true);
        setMap(mapInstance);
      });
      
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        setError('Si è verificato un errore durante il caricamento della mappa');
      });
      
      return () => {
        mapInstance.remove();
        setMap(null);
        setIsLoaded(false);
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setError('Impossibile inizializzare la mappa');
      return undefined;
    }
  }, [container, coordinates, zoom, interactive, token]);
  
  return { map, isLoaded, error };
}
