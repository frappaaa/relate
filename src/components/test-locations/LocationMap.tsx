
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

// This is a placeholder token - in production, this should be stored securely
// and loaded from environment variables or a backend service
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGxhY2Vob2xkZXJ0b2tlbiIsImEiOiJjbHRva2VucGxhY2Vob2xkZXIifQ.tokenplaceholder';

const LocationMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.4964, 41.9028], // Default center on Italy
        zoom: 5
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add geolocate control
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      map.current.addControl(geolocateControl);

      // Map load event
      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Try to geolocate the user when the map loads (on mobile only)
        if (isMobile) {
          setTimeout(() => {
            geolocateControl.trigger();
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [isMobile]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Caricamento mappa...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-center text-muted-foreground bg-background/70">
        È necessario inserire un token Mapbox valido per visualizzare correttamente la mappa
      </div>
    </div>
  );
};

export default LocationMap;
