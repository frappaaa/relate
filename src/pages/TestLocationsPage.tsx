
import React from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import { useLocationData } from '@/hooks/use-location-data';
import { useNavigate } from 'react-router-dom';
import LocationFilters from '@/components/test-locations/LocationFilters';

const TestLocationsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    isLocating,
    isLoading,
    handleSearch,
    findNearMe
  } = useLocationData();
  
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="mb-4">
        <LocationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          availableCategories={[]}
          selectedCategories={[]}
          handleCategoryToggle={() => {}}
          isLocating={isLocating}
          findNearMe={findNearMe}
        />
      </div>
      
      <div className="h-full min-h-[300px]">
        <LocationMap />
      </div>
    </div>
  );
};

export default TestLocationsPage;
