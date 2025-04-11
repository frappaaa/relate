
import { useState, useCallback } from 'react';
import { TestLocation } from '@/types/locations';

export const useLocationFilters = (allLocations: TestLocation[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  /**
   * Extract all unique categories from location data
   */
  const extractCategories = useCallback((locations: TestLocation[]) => {
    if (availableCategories.length === 0 && locations.length > 0) {
      const categories = new Set<string>();
      locations.forEach(location => {
        if (location.category) {
          categories.add(location.category);
        }
      });
      setAvailableCategories(Array.from(categories).sort());
    }
  }, [availableCategories]);

  /**
   * Filter locations based on search query and selected categories
   */
  const filterLocations = useCallback((locations: TestLocation[]): TestLocation[] => {
    if (!locations.length) return [];
    
    let results = [...locations];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.city?.toLowerCase().includes(query) ||
        location.region?.toLowerCase().includes(query) ||
        location.testTypes.some(type => type.toLowerCase().includes(query))
      );
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      results = results.filter(location =>
        location.category && selectedCategories.includes(location.category)
      );
    }
    
    return results;
  }, [searchQuery, selectedCategories]);

  /**
   * Toggle a category selection on/off
   */
  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  }, []);

  /**
   * Handle search form submission
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // The actual filtering is handled by the filterLocations function
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    availableCategories,
    extractCategories,
    filterLocations,
    handleCategoryToggle,
    handleSearch
  };
};
