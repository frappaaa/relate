
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useMapbox, addMapMarker, addMapNavigation, geocodeAddress } from '@/hooks/use-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationDetailMapProps {
  coordinates?: [number, number];
  locationName: string;
  address: string; // Added address for geocoding
}

const LocationDetailMap: React.FC<LocationDetailMapProps> = ({ 
  coordinates, 
  locationName, 
  address 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [geocodedCoordinates, setGeocodedCoordinates] = useState<[number, number] | undefined>(coordinates);
  const [isGeocoding, setIsGeocoding] = useState(!coordinates && !!address);
  
  // Try to geocode the address if coordinates are not provided
  useEffect(() => {
    async function getCoordinates() {
      if (!coordinates && address) {
        setIsGeocoding(true);
        try {
          const coords = await geocodeAddress(address);
          if (coords) {
            setGeocodedCoordinates(coords);
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        } finally {
          setIsGeocoding(false);
        }
      }
    }
    
    getCoordinates();
  }, [coordinates, address]);
  
  const { map, isLoaded, error } = useMapbox({
    container: mapContainer.current,
    coordinates: geocodedCoordinates,
    zoom: 14
  });
  
  // Aggiungi marker e controlli di navigazione quando la mappa è caricata
  React.useEffect(() => {
    if (isLoaded && map && geocodedCoordinates) {
      // Aggiungi marker per la posizione
      addMapMarker(map, geocodedCoordinates, `<h3>${locationName}</h3>`);
      
      // Aggiungi controlli di navigazione
      addMapNavigation(map);
    }
  }, [isLoaded, map, geocodedCoordinates, locationName]);

  if (isGeocoding) {
    return (
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Ricerca indirizzo sulla mappa...</p>
        </div>
      </div>
    );
  }

  if (!geocodedCoordinates && !isGeocoding) {
    return (
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">Indirizzo non trovato sulla mappa</p>
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
