
import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-fix.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, MapPin } from 'lucide-react';
import L from 'leaflet';
import { fetchLocations, TestLocation } from '@/services/locationService';
import { useGeocode } from '@/hooks/use-geocode';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Initialize default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map recenter
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Component to handle user's location
const UserLocationControl = () => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 13 });
    
    map.on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    });
    
    map.on('locationerror', (e) => {
      console.error('Error finding location:', e.message);
    });
  };

  useEffect(() => {
    // Add locate control button
    const locateControl = new L.Control({ position: 'topright' });
    
    locateControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = '<a class="leaflet-control-locate" href="#" title="Show my location" role="button" aria-label="Show my location" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: white; font-size: 20px;">📍</a>';
      
      div.onclick = handleLocate;
      return div;
    };
    
    locateControl.addTo(map);
    
    return () => {
      // Clean up event listeners
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  return position ? 
    <Marker position={position}>
      <Popup>Tu sei qui</Popup>
    </Marker> : null;
};

// Component to handle location pins from the database
const LocationPins = () => {
  const [locations, setLocations] = useState<TestLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { geocodeAddress, geocodingStatus } = useGeocode();
  
  // Load test locations from database
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const { data } = await fetchLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to load test locations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLocations();
  }, []);
  
  // For locations without coordinates, geocode them
  useEffect(() => {
    const geocodeLocations = async () => {
      // Process only 5 locations at a time to avoid rate limits
      const locationsToGeocode = locations
        .filter(loc => !loc.coordinates)
        .slice(0, 5);
        
      if (locationsToGeocode.length === 0) return;
      
      for (const location of locationsToGeocode) {
        if (!location.address) continue;
        
        try {
          // Use address plus city/region for better accuracy
          const addressToGeocode = `${location.address}, ${location.city || location.region || 'Italia'}`;
          const coordinates = await geocodeAddress(addressToGeocode);
          
          if (coordinates) {
            // Update the location with coordinates in our local state
            setLocations(prev => prev.map(loc => 
              loc.id === location.id 
                ? { ...loc, coordinates: [coordinates.lat, coordinates.lng] } 
                : loc
            ));
          }
        } catch (error) {
          console.error(`Failed to geocode location ${location.name}:`, error);
        }
      }
    };
    
    if (!loading && geocodingStatus !== 'loading') {
      geocodeLocations();
    }
  }, [locations, loading, geocodeAddress, geocodingStatus]);
  
  return (
    <>
      {locations.map(location => (
        location.coordinates && (
          <Marker 
            key={location.id} 
            position={[location.coordinates[0], location.coordinates[1]]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="min-w-40 flex flex-col gap-1">
                <h3 className="font-medium text-base">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.address}</p>
                {location.testTypes && location.testTypes.length > 0 && (
                  <div className="mt-1">
                    <span className="text-xs font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                      {location.category || location.testTypes[0]}
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </>
  );
};

const LocationMap: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [center] = useState<[number, number]>([41.9028, 12.4964]); // Default center on Italy

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0"> {/* Added z-0 to ensure map stays behind other elements */}
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapLoaded(true)}
          zoomControl={true}
          className="z-0" /* Added className with z-0 to ensure map container stays behind */
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={center} />
          <UserLocationControl />
          <LocationPins />
        </MapContainer>
      </div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Caricamento mappa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
