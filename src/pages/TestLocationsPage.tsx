
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationsMap from '@/components/test-locations/LocationsMap';
import LeftPanel from '@/components/test-locations/LeftPanel';
import { useLocationFilter } from '@/hooks/use-location-filter';

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
  } = useLocationFilter();

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };

  return (
    <div className="fixed inset-0 flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
      {/* Map container - takes up full screen with lower z-index */}
      <div className="absolute inset-0 z-0">
        <LocationsMap 
          locations={filteredLocations}
          isLoading={isLoading}
          findNearMe={findNearMe} 
          isLocating={isLocating}
          onSelectLocation={handleViewDetails}
        />
      </div>
      
      {/* Left panel overlay with search and locations list */}
      <LeftPanel 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        handleCategoryToggle={handleCategoryToggle}
        isLoading={isLoading}
        filteredLocations={filteredLocations}
        handleViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default TestLocationsPage;
