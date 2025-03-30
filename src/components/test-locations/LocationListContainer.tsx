
import React from 'react';
import LocationList from './LocationList';
import { TestLocation } from '@/services/locationService';

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
    <div className="space-y-4">
      <LocationList 
        isLoading={isLoading} 
        filteredLocations={filteredLocations} 
        handleViewDetails={handleViewDetails} 
      />
    </div>
  );
};

export default LocationListContainer;
