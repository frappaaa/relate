
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ChangeMapViewProps {
  center: [number, number];
}

const ChangeMapView: React.FC<ChangeMapViewProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

export default ChangeMapView;
