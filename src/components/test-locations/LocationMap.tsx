
import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  findNearMe: () => void;
  isLocating: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({ findNearMe, isLocating }) => {
  return (
    <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden mb-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Mappa dei centri di test</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <Button 
          size="sm" 
          variant="secondary" 
          className="shadow-md"
          onClick={findNearMe}
          disabled={isLocating}
        >
          {isLocating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Localizzando...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Trova vicino a me
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationMap;
