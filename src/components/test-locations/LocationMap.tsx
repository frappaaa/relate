
import React, { useState } from 'react';
import MapContainer from './map/MapContainer';
import L from 'leaflet';
import './leaflet-fix.css';

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

const LocationMap: React.FC = () => {
  const [center] = useState<[number, number]>([41.9028, 12.4964]); // Default center on Italy

  return <MapContainer center={center} />;
};

export default LocationMap;
