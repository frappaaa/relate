
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { initializeMapbox, addMapMarker, addMapNavigation } from '@/hooks/use-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

interface LocationDetailMapProps {
  coordinates?: [number, number];
  locationName: string;
}

const LocationDetailMap: React.FC<LocationDetailMapProps> = ({ coordinates, locationName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;
    
    const initMap = async () => {
      try {
        const initialized = await initializeMapbox();
        
        if (!initialized) {
          setError('Impossibile inizializzare il token Mapbox');
          return;
        }
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [coordinates[1], coordinates[0]], // Mapbox usa [lng, lat]
          zoom: 14
        });
        
        map.current.on('load', () => {
          setIsLoaded(true);
          
          // Aggiungi marker per la posizione
          addMapMarker(map.current!, coordinates, `<h3>${locationName}</h3>`);
          
          // Aggiungi controlli di navigazione
          addMapNavigation(map.current!);
        });
        
        map.current.on('error', (e) => {
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
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsLoaded(false);
      }
    };
  }, [coordinates, locationName]);

  if (!coordinates) {
    return (
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">Coordinate non disponibili</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div ref={mapContainer} className="h-full w-full" />
        
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Caricamento mappa...</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailMap;
