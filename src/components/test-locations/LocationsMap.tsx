
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  region?: string;
  coordinates?: [number, number];
  category?: string;
  testTypes: string[];
}

interface LocationsMapProps {
  locations: TestLocation[];
  isLoading: boolean;
  findNearMe: () => void;
  isLocating: boolean;
  onSelectLocation: (locationId: string) => void;
}

const LocationsMap: React.FC<LocationsMapProps> = ({
  locations,
  isLoading,
  findNearMe,
  isLocating,
  onSelectLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.4964, 41.9028], // Default center (Rome, Italy)
        zoom: 5
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      // Map error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(true);
      });
      
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError(true);
      return undefined;
    }
  }, []);
  
  // Update markers when locations change
  useEffect(() => {
    if (!map.current || isLoading || mapError) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add markers for locations with coordinates
    const locationsWithCoords = locations.filter(loc => loc.coordinates);
    
    if (locationsWithCoords.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locationsWithCoords.forEach(location => {
      if (!location.coordinates || !map.current) return;
      
      // Get display category
      const displayCategory = location.category || 
                           (location.testTypes && location.testTypes.length > 0 ? location.testTypes[0] : "Test");
      
      // Create popup content
      const cityOrRegion = location.city || location.region || '';
      const popupHtml = `
        <div class="p-2">
          <h3 class="font-bold mb-1">${location.name}</h3>
          <p class="text-sm">${location.address}${cityOrRegion ? ', ' + cityOrRegion : ''}</p>
          <span class="inline-block mt-1 text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">${displayCategory}</span>
        </div>
      `;
      
      // Create marker
      const marker = new mapboxgl.Marker({ color: '#e11d48' })
        .setLngLat([location.coordinates[1], location.coordinates[0]])
        .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
        .addTo(map.current);
      
      // Add click handler
      marker.getElement().addEventListener('click', () => {
        onSelectLocation(location.id);
      });
      
      markers.current.push(marker);
      
      // Extend bounds to include this location
      bounds.extend([location.coordinates[1], location.coordinates[0]]);
    });
    
    // Fit map to bounds with padding
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [locations, isLoading, onSelectLocation, mapError]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">Errore di caricamento mappa</p>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          size="sm" 
          variant="default"
          className="shadow-md bg-white text-black hover:bg-gray-100"
          onClick={findNearMe}
          disabled={isLocating}
        >
          {isLocating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Localizzando...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Trova vicino a me
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationsMap;
