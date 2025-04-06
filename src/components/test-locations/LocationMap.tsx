
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-fix.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';

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
    // Fix: Use L.Control instead of L.control
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

const LocationMap: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [center] = useState<[number, number]>([41.9028, 12.4964]); // Default center on Italy

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={center} />
          <UserLocationControl />
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
