
import React, { useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useMapbox, addMapMarker, addMapNavigation } from '@/hooks/use-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationDetailMapProps {
  coordinates?: [number, number];
  locationName: string;
}

const LocationDetailMap: React.FC<LocationDetailMapProps> = ({ coordinates, locationName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, isLoaded, error } = useMapbox({
    container: mapContainer.current,
    coordinates,
    zoom: 14
  });
  
  // Aggiungi marker e controlli di navigazione quando la mappa è caricata
  React.useEffect(() => {
    if (isLoaded && map && coordinates) {
      // Aggiungi marker per la posizione
      addMapMarker(map, coordinates, `<h3>${locationName}</h3>`);
      
      // Aggiungi controlli di navigazione
      addMapNavigation(map);
    }
  }, [isLoaded, map, coordinates, locationName]);

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
  );
};

export default LocationDetailMap;
