
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LocationDetailAddressProps {
  address?: string;
  city?: string;
  region?: string;
  distance?: string;
}

const LocationDetailAddress: React.FC<LocationDetailAddressProps> = ({
  address,
  city,
  region,
  distance
}) => {
  if (!address && !city && !region) return null;

  return (
    <div className="flex items-center text-muted-foreground mb-4">
      <MapPin className="h-4 w-4 mr-2 shrink-0" />
      <span>
        {address}
        {(city || region) && 
          `, ${city || region}`
        }
      </span>
      {distance && (
        <Badge variant="outline" className="ml-2">
          {distance}
        </Badge>
      )}
    </div>
  );
};

export default LocationDetailAddress;
