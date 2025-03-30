
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
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Dove fare i test</h1>
      
      <LocationSearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />
      
      <ServiceFilterTags 
        availableServices={availableCategories} 
        selectedServices={selectedCategories} 
        onServiceToggle={handleCategoryToggle}
        isCategories={true}
      />
    </div>
  );
};

export default LocationSearch;
