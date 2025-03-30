
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Utilizziamo un token fisso per Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZnJhbmNlc2NvbHVwcGkiLCJhIjoiY204c2sya3cwMDEwODJtcjdweGZtbXNwaSJ9.HCFiHD-mZ1aSqnGzCYlIwg';

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

// Funzione per geocodificare un indirizzo e ottenere le coordinate
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const query = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=it&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Errore nella richiesta di geocoding');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return [latitude, longitude]; // Restituisce [latitude, longitude]
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
