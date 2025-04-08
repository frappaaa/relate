
import React, { useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import ChangeMapView from './ChangeMapView';
import UserLocationControl from './UserLocationControl';
import LocationPins from './LocationPins';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  center: [number, number];
}

const MapContainer: React.FC<MapContainerProps> = ({ center }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <LeafletMapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapLoaded(true)}
          zoomControl={true}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={center} />
          <UserLocationControl />
          <LocationPins />
        </LeafletMapContainer>
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

export default MapContainer;
