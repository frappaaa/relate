
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mapboxgl from 'mapbox-gl';
import { initializeMapbox } from '@/hooks/use-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  region?: string;
  coordinates?: [number, number];
}

interface LocationsMapProps {
  locations: TestLocation[];
  isLoading: boolean;
  findNearMe: () => void;
  isLocating: boolean;
  onSelectLocation: (locationId: string) => void;
  onError?: (error: string) => void;
}

const LocationsMap: React.FC<LocationsMapProps> = ({
  locations,
  isLoading,
  findNearMe,
  isLocating,
  onSelectLocation,
  onError
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<boolean>(false);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Inizializza Mapbox e la mappa
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const initMap = async () => {
      try {
        console.log("Initializing map...");
        const initialized = await initializeMapbox();
        
        if (!initialized) {
          const error = 'Failed to initialize Mapbox token';
          console.error(error);
          setErrorMessage('Impossibile ottenere il token Mapbox');
          setMapError(true);
          if (onError) onError(error);
          return;
        }
        
        try {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [12.4964, 41.9028], // Default center (Rome, Italy)
            zoom: 5
          });
          
          map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          
          map.current.on('load', () => {
            console.log('Map loaded successfully');
            setMapInitialized(true);
          });
          
          // Gestione errori mappa
          map.current.on('error', (e) => {
            console.error('Mapbox error:', e);
            setErrorMessage('Si è verificato un errore durante il caricamento della mappa');
            setMapError(true);
            if (onError) onError(`Map error: ${e.error?.message || 'Unknown error'}`);
          });
        } catch (mapInitError) {
          console.error('Map initialization error:', mapInitError);
          setErrorMessage('Errore nell\'inizializzazione della mappa');
          setMapError(true);
          if (onError) onError(`Map initialization error: ${(mapInitError as Error).message || 'Unknown error'}`);
        }
      } catch (tokenError) {
        console.error('Failed to initialize map:', tokenError);
        setErrorMessage('Impossibile inizializzare la mappa');
        setMapError(true);
        if (onError) onError(`Token error: ${(tokenError as Error).message || 'Unknown error'}`);
      }
    };
    
    initMap();
    
    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    };
  }, [onError]);
  
  // Aggiorna i marker quando cambiano le locations
  useEffect(() => {
    if (!map.current || isLoading || mapError || !mapInitialized) {
      console.log('Skipping marker update', { 
        mapExists: !!map.current, 
        isLoading, 
        mapError, 
        mapInitialized 
      });
      return;
    }
    
    console.log('Updating markers', { locationCount: locations.length });
    
    // Rimuovi marker esistenti
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Aggiungi marker per le posizioni con coordinate
    const locationsWithCoords = locations.filter(loc => loc.coordinates);
    console.log('Locations with coordinates:', locationsWithCoords.length);
    
    if (locationsWithCoords.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locationsWithCoords.forEach(location => {
      if (!location.coordinates || !map.current) return;
      
      // Crea contenuto popup
      const cityOrRegion = location.city || location.region || '';
      const popupHtml = `
        <div class="p-2">
          <h3 class="font-bold mb-1">${location.name}</h3>
          <p class="text-sm">${location.address}${cityOrRegion ? ', ' + cityOrRegion : ''}</p>
        </div>
      `;
      
      // Crea marker
      const marker = new mapboxgl.Marker({ color: '#0ea5e9' })
        .setLngLat([location.coordinates[1], location.coordinates[0]])
        .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
        .addTo(map.current);
      
      // Aggiungi handler click
      marker.getElement().addEventListener('click', () => {
        onSelectLocation(location.id);
      });
      
      markers.current.push(marker);
      
      // Estendi i bounds per includere questa posizione
      bounds.extend([location.coordinates[1], location.coordinates[0]]);
    });
    
    // Adatta la mappa ai bounds con padding
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [locations, isLoading, onSelectLocation, mapError, mapInitialized]);

  return (
    <div className="space-y-4">
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden mb-8">
        <div ref={mapContainer} className="w-full h-full" />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
            <MapPin className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">{errorMessage || 'Errore di caricamento mappa'}</p>
            {errorMessage === 'Impossibile ottenere il token Mapbox' && (
              <Alert variant="warning" className="mt-2 max-w-md">
                <AlertDescription>
                  Verifica che il token Mapbox sia configurato correttamente nell'Edge Function.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <div className="absolute bottom-4 right-4">
          <Button 
            size="sm" 
            variant="secondary" 
            className="shadow-md"
            onClick={findNearMe}
            disabled={isLocating || mapError}
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
    </div>
  );
};

export default LocationsMap;
