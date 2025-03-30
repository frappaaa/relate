import React from 'react';
import LocationList from './LocationList';
import { TestLocation } from '@/services/locations';

interface LocationListContainerProps {
  isLoading: boolean;
  filteredLocations: TestLocation[];
  handleViewDetails: (locationId: string) => void;
}

const LocationListContainer: React.FC<LocationListContainerProps> = ({
  isLoading,
  filteredLocations,
  handleViewDetails
}) => {
  return (
    <div className="rounded-lg w-full h-full">
      <LocationList 
        isLoading={isLoading} 
        filteredLocations={filteredLocations} 
        handleViewDetails={handleViewDetails} 
      />
    </div>
  );
};

export default LocationListContainer;
