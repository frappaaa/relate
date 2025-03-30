import React from 'react';
import LocationSearchBar from './LocationSearchBar';
import ServiceFilterTags from './ServiceFilterTags';
interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
}
const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableCategories,
  selectedCategories,
  handleCategoryToggle
}) => {
  return <div className="space-y-4">
      
      
      <LocationSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
      
      <div className="w-full mt-3">
        <ServiceFilterTags availableServices={availableCategories} selectedServices={selectedCategories} onServiceToggle={handleCategoryToggle} isCategories={true} />
      </div>
    </div>;
};
export default LocationSearch;