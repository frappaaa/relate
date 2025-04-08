
import React, { useEffect, useState } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const UserLocationControl: React.FC = () => {
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

export default UserLocationControl;
