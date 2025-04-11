
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

export const useLocationData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allLocations, setAllLocations] = useState<TestLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initial load of all locations
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
      setFilteredLocations(data);
      
      // Extract unique categories
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
  }, [availableCategories]);

  // Filter locations based on search query and categories
  const filterLocations = useCallback(() => {
    if (!allLocations.length) return;
    
    let results = [...allLocations];
    
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
    
    setFilteredLocations(results);
  }, [searchQuery, selectedCategories, allLocations]);

  // Load locations when component mounts
  useEffect(() => {
    loadAllLocations();
  }, []);

  // Apply filters whenever search query or selected categories change
  useEffect(() => {
    if (!isLoading) {
      const handler = setTimeout(() => {
        filterLocations();
      }, 300); // Debounce search
      
      return () => clearTimeout(handler);
    }
  }, [searchQuery, selectedCategories, filterLocations, isLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterLocations();
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
      
      if (!allLocations.length) {
        loadAllLocations().then(() => {
          calculateDistances(userLat, userLon, allLocations);
        });
      } else {
        calculateDistances(userLat, userLon, allLocations);
      }
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

  const calculateDistances = (userLat: number, userLon: number, locations: TestLocation[]) => {
    const locationsWithDistance = locations.map(location => {
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
    
    setAllLocations(sortedLocations);
    // Apply current filters to the updated locations with distances
    const filtered = applyFilters(sortedLocations);
    setFilteredLocations(filtered);
    
    toast({
      title: "Posizione rilevata",
      description: "I centri sono stati ordinati in base alla distanza da te."
    });
    
    setIsLocating(false);
  };

  const applyFilters = (locations: TestLocation[]) => {
    let results = locations;
    
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
