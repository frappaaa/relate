
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LocationDetailServicesProps {
  services?: string[];
  testTypes?: string[];
}

const LocationDetailServices: React.FC<LocationDetailServicesProps> = ({ 
  services, 
  testTypes 
}) => {
  const hasServices = services && services.length > 0;
  const hasTestTypes = testTypes && testTypes.length > 0;
  
  if (!hasServices && !hasTestTypes) return null;
  
  const items = hasServices ? services : testTypes;
  
  return (
    <>
      <Separator className="my-4" />
      <div>
        <p className="font-medium mb-2">Servizi disponibili:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {items?.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationDetailServices;
