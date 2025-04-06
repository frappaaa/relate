import React from 'react';

interface LocationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  isLocating: boolean;
  findNearMe: () => void;
}

const LocationFilters: React.FC<LocationFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableCategories,
  selectedCategories,
  handleCategoryToggle,
  isLocating,
  findNearMe
}) => {
  return (
    <div className="space-y-8">
    </div>
  );
};

export default LocationFilters;
