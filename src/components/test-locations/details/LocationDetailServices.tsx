
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LocationDetailServicesProps {
  services?: string[];
  testTypes?: string[];
}

const LocationDetailServices: React.FC<LocationDetailServicesProps> = ({ 
  services
}) => {
  // Only show the component if services exist and have items
  if (!services || services.length === 0) return null;
  
  return (
    <>
      <Separator className="my-4" />
      <div>
        <p className="font-medium mb-2">Servizi disponibili:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((service) => (
            <Badge key={service} variant="secondary">
              {service}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationDetailServices;
