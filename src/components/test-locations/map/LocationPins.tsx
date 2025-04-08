
import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useGeocode } from '@/hooks/use-geocode';
import { fetchLocations, TestLocation } from '@/services/locationService';

// Initialize default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationPins: React.FC = () => {
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

export default LocationPins;
