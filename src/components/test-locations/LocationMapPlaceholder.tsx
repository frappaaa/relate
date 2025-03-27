
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapPlaceholderProps {
  coordinates?: [number, number];
}

const LocationMapPlaceholder: React.FC<LocationMapPlaceholderProps> = ({ coordinates }) => {
  return (
    <div className="h-[200px] rounded-xl bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <MapPin className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
};

export default LocationMapPlaceholder;
