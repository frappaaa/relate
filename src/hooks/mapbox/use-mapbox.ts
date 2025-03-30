
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from './constants';

// Inizializza il token Mapbox con un valore fisso
mapboxgl.accessToken = MAPBOX_TOKEN;

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
  
  // Create and initialize the map
  useEffect(() => {
    if (!container || !coordinates) return;
    
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
  }, [container, coordinates, zoom, interactive]);
  
  return { map, isLoaded, error };
}
