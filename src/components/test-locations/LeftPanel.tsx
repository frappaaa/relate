
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
      ${isMobile ? 'w-full bg-white p-4' : 'w-[400px] bg-white/95 shadow-lg p-6 overflow-y-auto rounded-r-lg'}
    `}>
      <div className="space-y-4">
        <LocationSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
        />
        
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
