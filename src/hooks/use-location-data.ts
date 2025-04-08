
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

export const useLocationData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
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

  const findNearMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        title: "Errore",
        description: "La geolocalizzazione non è supportata dal tuo browser.",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      
      // Load all locations to calculate distances
      fetchLocations(0, 1000)
        .then(({data: allLocations}) => {
          const locationsWithDistance = allLocations.map(location => {
            if (!location.coordinates) return location;
            const distance = calculateDistance(userLat, userLon, location.coordinates[0], location.coordinates[1]);
            return {
              ...location,
              distance: formatDistance(distance)
            };
          });
          const sortedLocations = [...locationsWithDistance].sort((a, b) => {
            if (!a.distance || !b.distance) return 0;
            return parseFloat(a.distance) - parseFloat(b.distance);
          });
          setFilteredLocations(sortedLocations);
          toast({
            title: "Posizione rilevata",
            description: "I centri sono stati ordinati in base alla distanza da te."
          });
        })
        .catch(error => {
          console.error('Error fetching all locations:', error);
          toast({
            title: "Errore",
            description: "Si è verificato un errore durante il recupero dei centri.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLocating(false);
        });
    }, error => {
      console.error('Geolocation error:', error);
      let errorMessage = "Si è verificato un errore durante il rilevamento della posizione.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "L'accesso alla posizione è stato negato.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Informazioni sulla posizione non disponibili.";
          break;
        case error.TIMEOUT:
          errorMessage = "Richiesta di posizione scaduta.";
          break;
      }
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLocating(false);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
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
    findNearMe
  };
};
