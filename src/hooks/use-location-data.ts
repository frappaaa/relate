
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';

export const useLocationData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const loadSearchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, count } = await fetchLocations(
        0,
        1000, // Large number to get all results
        searchQuery,
        selectedCategories
      );
      
      setFilteredLocations(data);
      
      // Extract unique categories from locations on first load
      if (availableCategories.length === 0 && data.length > 0) {
        const categories = new Set<string>();
        data.forEach(location => {
          if (location.category) {
            categories.add(location.category);
          }
        });
        setAvailableCategories(Array.from(categories).sort());
      }
    } catch (error) {
      console.error('Error fetching test locations:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei centri test.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories, availableCategories]);

  // Initial load
  useEffect(() => {
    loadSearchResults();
  }, []);

  // When filters change
  useEffect(() => {
    if (!isLoading) {
      // Apply filters
      const handler = setTimeout(() => {
        loadSearchResults();
      }, 300); // Debounce search
      
      return () => clearTimeout(handler);
    }
  }, [searchQuery, selectedCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSearchResults();
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredLocations,
    isLoading,
    availableCategories,
    selectedCategories,
    handleSearch,
    handleCategoryToggle,
    loadSearchResults, // Export this for integration with useNearbyLocations
    setFilteredLocations // Export this for integration with useNearbyLocations
  };
};
