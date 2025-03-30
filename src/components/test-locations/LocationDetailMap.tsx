
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useMapbox, addMapMarker, addMapNavigation, geocodeAddress, getMapboxToken } from '@/hooks/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

interface LocationDetailMapProps {
  coordinates?: [number, number];
  locationName: string;
  address: string;
}

const LocationDetailMap: React.FC<LocationDetailMapProps> = ({ 
  coordinates, 
  locationName, 
  address 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [geocodedCoordinates, setGeocodedCoordinates] = useState<[number, number] | undefined>(coordinates);
  const [isGeocoding, setIsGeocoding] = useState(!coordinates && !!address);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(true);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        setIsTokenLoading(true);
        const token = await getMapboxToken();
        setMapboxToken(token);
        if (token) {
          mapboxgl.accessToken = token;
        } else {
          setMapError('Errore nel recupero del token Mapbox');
        }
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
        setMapError('Errore nel caricamento del token Mapbox');
      } finally {
        setIsTokenLoading(false);
      }
    }
    
    fetchToken();
  }, []);
  
  useEffect(() => {
    async function getCoordinates() {
      if (!coordinates && address && mapboxToken) {
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
  }, [coordinates, address, mapboxToken]);
  
  useEffect(() => {
    if (!mapContainer.current || !geocodedCoordinates || !mapboxToken || isTokenLoading) return;
    
    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [geocodedCoordinates[1], geocodedCoordinates[0]],
        zoom: 14,
        interactive: true
      });
      
      mapInstance.on('load', () => {
        setMap(mapInstance);
        
        addMapMarker(mapInstance, geocodedCoordinates, `<h3>${locationName}</h3>`);
        addMapNavigation(mapInstance);
      });
      
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Si è verificato un errore durante il caricamento della mappa');
      });
      
      return () => {
        mapInstance.remove();
        setMap(null);
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Impossibile inizializzare la mappa');
      return undefined;
    }
  }, [geocodedCoordinates, mapboxToken, isTokenLoading, locationName]);

  if (isTokenLoading || isGeocoding) {
    return (
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            {isTokenLoading ? 'Caricamento mappa...' : 'Ricerca indirizzo sulla mappa...'}
          </p>
        </div>
      </div>
    );
  }

  if ((!geocodedCoordinates && !isGeocoding) || mapError) {
    return (
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">
            {mapError || 'Indirizzo non trovato sulla mappa'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
    </div>
  );
};

export default LocationDetailMap;
