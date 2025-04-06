
import React, { useState } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import { useLocationData } from '@/hooks/use-location-data';
import { useNavigate } from 'react-router-dom';
import LocationFilters from '@/components/test-locations/LocationFilters';
import LocationList from '@/components/test-locations/LocationList';

const TestLocationsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredLocations,
    isLocating,
    isLoading,
    availableCategories,
    selectedCategories,
    handleSearch,
    handleCategoryToggle,
    findNearMe
  } = useLocationData();
  
  const navigate = useNavigate();
  
  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="mb-4">
        <LocationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
          isLocating={isLocating}
          findNearMe={findNearMe}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 h-full">
        <div className="h-full min-h-[300px] md:min-h-0">
          <LocationMap />
        </div>
        <div className="overflow-y-auto">
          <LocationList
            isLoading={isLoading}
            filteredLocations={filteredLocations}
            handleViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default TestLocationsPage;
