
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

const ITEMS_PER_PAGE = 10;

export const useLocationData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const loadSearchResults = useCallback(async (newSearch: boolean = false) => {
    try {
      const currentPage = newSearch ? 0 : page;
      setIsLoading(newSearch);
      setLoadingMore(!newSearch && page > 0);
      
      const { data, count } = await fetchLocations(
        currentPage,
        ITEMS_PER_PAGE,
        searchQuery,
        selectedCategories
      );
      
      setTotalCount(count);
      setHasMore(currentPage * ITEMS_PER_PAGE + data.length < count);
      
      if (newSearch) {
        setFilteredLocations(data);
        setPage(0);
      } else {
        setFilteredLocations(prev => [...prev, ...data]);
      }
      
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
      setLoadingMore(false);
    }
  }, [page, searchQuery, selectedCategories, availableCategories]);

  // Initial load
  useEffect(() => {
    loadSearchResults(true);
  }, []);

  // When filters change
  useEffect(() => {
    if (!isLoading) {
      // Apply filters and reset pagination
      const handler = setTimeout(() => {
        loadSearchResults(true);
      }, 300); // Debounce search
      
      return () => clearTimeout(handler);
    }
  }, [searchQuery, selectedCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSearchResults(true); // Reset and search from page 0
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
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
      
      // First load all locations to calculate distances
      fetchLocations(0, 100)
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
          setHasMore(false);
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
    loadingMore,
    availableCategories,
    selectedCategories,
    hasMore,
    handleSearch,
    handleLoadMore,
    handleCategoryToggle,
    findNearMe
  };
};
