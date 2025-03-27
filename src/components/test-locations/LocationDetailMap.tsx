
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationDetailMapProps {
  coordinates?: [number, number];
  locationName: string;
}

const LocationDetailMap: React.FC<LocationDetailMapProps> = ({ coordinates, locationName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your Mapbox token
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1sb3ZhYmxlIiwiYSI6ImNsNDhpcnUwMDBjZGgzaW56YWd2N3VvN2YifQ.UeP8BnNzNf1UG61U-_VviA';
    
    if (!coordinates || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
        zoom: 14
      });
      
      map.current.on('load', () => {
        setMapLoaded(true);
        
        if (map.current) {
          // Add marker
          new mapboxgl.Marker({ color: '#0ea5e9' })
            .setLngLat([coordinates[1], coordinates[0]])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${locationName}</h3>`))
            .addTo(map.current);
          
          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        }
      });
      
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Si è verificato un errore durante il caricamento della mappa');
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Impossibile inizializzare la mappa');
    }
    
    return () => {
      map.current?.remove();
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
    <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
      
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Caricamento mappa...</p>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-destructive">{mapError}</p>
        </div>
      )}
    </div>
  );
};

export default LocationDetailMap;
