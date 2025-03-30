
import React from 'react';
import LocationSearch from './LocationSearch';
import LocationListContainer from './LocationListContainer';
import { TestLocation } from '@/services/locationService';
import { useIsMobile } from '@/hooks/use-mobile';

interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  isLoading: boolean;
  filteredLocations: TestLocation[];
  handleViewDetails: (locationId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableCategories,
  selectedCategories,
  handleCategoryToggle,
  isLoading,
  filteredLocations,
  handleViewDetails
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      absolute top-0 left-0 bottom-0 z-10
      ${isMobile ? 'w-full bg-white p-4' : 'w-[400px] bg-white/95 shadow-lg rounded-r-lg flex flex-col'}
    `}>
      {/* Search and filters section - fixed at the top */}
      <div className="p-6 pb-4">
        <LocationSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
        />
      </div>
      
      {/* Location list - scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <LocationListContainer
          isLoading={isLoading}
          filteredLocations={filteredLocations}
          handleViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
