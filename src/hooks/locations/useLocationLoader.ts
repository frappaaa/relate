
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';

export const useLocationLoader = () => {
  const [allLocations, setAllLocations] = useState<TestLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load all location data from API
   */
  const loadAllLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, count } = await fetchLocations(
        0,
        1000, // Large number to get all results
        '', // No search query for initial load
        []  // No category filters for initial load
      );
      
      setAllLocations(data);
      return data;
    } catch (error) {
      console.error('Error fetching test locations:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei centri test.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update the stored location data
   */
  const updateLocations = useCallback((locations: TestLocation[]) => {
    setAllLocations(locations);
  }, []);

  return {
    allLocations,
    isLoading,
    loadAllLocations,
    updateLocations
  };
};
