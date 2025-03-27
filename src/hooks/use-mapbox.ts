
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Initialize Mapbox access token once
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1sb3ZhYmxlIiwiYSI6ImNsNDhpcnUwMDBjZGgzaW56YWd2N3VvN2YifQ.UeP8BnNzNf1UG61U-_VviA';
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

export function addMapMarker(
  map: mapboxgl.Map,
  coordinates: [number, number],
  popupHtml?: string,
  color = '#0ea5e9'
) {
  const marker = new mapboxgl.Marker({ color })
    .setLngLat([coordinates[1], coordinates[0]]);
  
  if (popupHtml) {
    marker.setPopup(new mapboxgl.Popup().setHTML(popupHtml));
  }
  
  marker.addTo(map);
  return marker;
}

export function addMapNavigation(map: mapboxgl.Map, position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right') {
  map.addControl(new mapboxgl.NavigationControl(), position);
}
