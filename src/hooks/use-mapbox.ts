
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseMapboxProps {
  container: HTMLDivElement | null;
  coordinates?: [number, number]; // [latitude, longitude]
  zoom?: number;
  interactive?: boolean;
}

// Funzione per ottenere il token Mapbox dall'edge function
async function getMapboxToken(): Promise<string | null> {
  try {
    console.log('Fetching Mapbox token...');
    const { data, error } = await supabase.functions.invoke('get-mapbox-token');
    
    if (error) {
      console.error('Error fetching Mapbox token:', error);
      toast({
        title: "Errore",
        description: "Impossibile ottenere il token per la mappa",
        variant: "destructive"
      });
      return null;
    }
    
    if (!data?.token) {
      console.error('No token received from edge function');
      toast({
        title: "Errore",
        description: "Token Mapbox non disponibile",
        variant: "destructive" 
      });
      return null;
    }
    
    console.log('Mapbox token received successfully');
    return data.token;
  } catch (error) {
    console.error('Exception fetching Mapbox token:', error);
    toast({
      title: "Errore",
      description: "Impossibile ottenere il token per la mappa",
      variant: "destructive"
    });
    return null;
  }
}

let tokenPromise: Promise<string | null> | null = null;

// Funzione per inizializzare il token Mapbox
export async function initializeMapbox(): Promise<boolean> {
  if (!tokenPromise) {
    tokenPromise = getMapboxToken();
  }
  
  const token = await tokenPromise;
  
  if (!token) {
    console.error('Failed to get Mapbox token');
    return false;
  }
  
  try {
    mapboxgl.accessToken = token;
    return true;
  } catch (error) {
    console.error('Error setting Mapbox token:', error);
    return false;
  }
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
  
  // Inizializza la mappa dopo aver recuperato il token
  useEffect(() => {
    if (!container || !coordinates) return;
    
    let mapInstance: mapboxgl.Map | null = null;
    
    const initMap = async () => {
      const initialized = await initializeMapbox();
      
      if (!initialized) {
        setError('Impossibile inizializzare il token Mapbox');
        return;
      }
      
      try {
        mapInstance = new mapboxgl.Map({
          container,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [coordinates[1], coordinates[0]], // Mapbox usa [lng, lat]
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
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setError('Impossibile inizializzare la mappa');
      }
    };
    
    initMap();
    
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMap(null);
        setIsLoaded(false);
      }
    };
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
