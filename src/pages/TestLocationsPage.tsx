
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationFilters from '@/components/test-locations/LocationFilters';
import LocationList from '@/components/test-locations/LocationList';
import { useLocationData } from '@/hooks/use-location-data';

const TestLocationsPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };

  return (
    <div className="space-y-8">
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

      <LocationList 
        isLoading={isLoading} 
        filteredLocations={filteredLocations} 
        handleViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default TestLocationsPage;
