
import React from 'react';
import { Loader2 } from 'lucide-react';
import LocationCard from './LocationCard';

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
}

const LocationList: React.FC<LocationListProps> = ({
  isLoading,
  filteredLocations,
  handleViewDetails,
}) => {
  if (isLoading && filteredLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Caricamento centri test...</p>
      </div>
    );
  }

  if (filteredLocations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Nessun risultato trovato</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 w-full box-border max-w-full">
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
    </div>
  );
};

export default LocationList;
