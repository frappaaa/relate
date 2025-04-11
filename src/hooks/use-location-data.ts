
import { useState, useEffect } from 'react';
import { TestLocation } from '@/types/locations';
import { useLocationLoader } from './locations/useLocationLoader';
import { useLocationFilters } from './locations/useLocationFilters';
import { useLocationGeolocation } from './locations/useLocationGeolocation';

export const useLocationData = () => {
  const { allLocations, isLoading, loadAllLocations, updateLocations } = useLocationLoader();
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    availableCategories,
    extractCategories,
    filterLocations,
    handleCategoryToggle,
    handleSearch
  } = useLocationFilters(allLocations);

  const handleLocationsWithDistance = (updatedLocations: TestLocation[]) => {
    updateLocations(updatedLocations);
    const filtered = filterLocations(updatedLocations);
    setFilteredLocations(filtered);
  };

  const { isLocating, findNearMe } = useLocationGeolocation(handleLocationsWithDistance);

  // Load locations when component mounts
  useEffect(() => {
    loadAllLocations().then(data => {
      setFilteredLocations(data);
      extractCategories(data);
    });
  }, [loadAllLocations, extractCategories]);

  // Apply filters whenever search query or selected categories change
  useEffect(() => {
    if (!isLoading) {
      const handler = setTimeout(() => {
        const filtered = filterLocations(allLocations);
        setFilteredLocations(filtered);
      }, 300); // Debounce search
      
      return () => clearTimeout(handler);
    }
  }, [searchQuery, selectedCategories, filterLocations, allLocations, isLoading]);

  // Wrap the findNearMe function to use the current allLocations
  const handleFindNearMe = () => {
    findNearMe(allLocations);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredLocations,
    isLocating,
    isLoading,
    availableCategories,
    selectedCategories,
    handleSearch,
    handleCategoryToggle,
    findNearMe: handleFindNearMe
  };
};
