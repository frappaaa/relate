
import React from 'react';
import { Loader2 } from 'lucide-react';
import LocationCard from './LocationCard';
import { Button } from '@/components/ui/button';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  region?: string;
  testTypes: string[];
  distance?: string;
  coordinates?: [number, number];
  category?: string;
}

interface LocationListProps {
  isLoading: boolean;
  filteredLocations: TestLocation[];
  handleViewDetails: (locationId: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
}

const LocationList: React.FC<LocationListProps> = ({
  isLoading,
  filteredLocations,
  handleViewDetails,
  hasMore,
  onLoadMore,
  loadingMore,
}) => {
  if (isLoading && filteredLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Caricamento centri test...</p>
      </div>
    );
  }

  if (filteredLocations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nessun risultato trovato</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredLocations.map((location) => (
        <LocationCard
          key={location.id}
          id={location.id}
          name={location.name}
          address={location.address}
          city={location.city || location.region || ''}
          testTypes={location.testTypes}
          distance={location.distance}
          handleViewDetails={handleViewDetails}
          category={location.category}
        />
      ))}
      
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button 
            onClick={onLoadMore} 
            disabled={loadingMore}
            variant="outline"
            className="w-full max-w-sm"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              'Carica altri risultati'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
