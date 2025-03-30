
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LocationsMap from '@/components/test-locations/LocationsMap';
import LeftPanel from '@/components/test-locations/LeftPanel';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { fetchLocations, TestLocation } from '@/services/locationService';

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [allLocations, setAllLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLocations();
        setAllLocations(data);
        setFilteredLocations(data);
        
        // Extract all unique categories from locations
        const categories = new Set<string>();
        data.forEach(location => {
          if (location.category) {
            categories.add(location.category);
          } else if (location.testTypes && location.testTypes.length > 0) {
            // Use first test type as fallback category if no category is specified
            categories.add(location.testTypes[0]);
          }
        });
        setAvailableCategories(Array.from(categories).sort());
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
    };

    loadLocations();
  }, []);

  const applyFilters = () => {
    let filtered = [...allLocations];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        location => 
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (location.city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (location.region?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          location.testTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(location => {
        const locationCategory = location.category || 
                              (location.testTypes && location.testTypes.length > 0 ? location.testTypes[0] : "");
        return selectedCategories.includes(locationCategory);
      });
    }
    
    setFilteredLocations(filtered);
  };

  // Apply filters when search parameters or categories change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategories, allLocations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
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
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        const locationsWithDistance = allLocations.map(location => {
          if (!location.coordinates) return location;
          
          const distance = calculateDistance(
            userLat, 
            userLon, 
            location.coordinates[0], 
            location.coordinates[1]
          );
          
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
        setIsLocating(false);
        
        toast({
          title: "Posizione rilevata",
          description: "I centri sono stati ordinati in base alla distanza da te.",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Si è verificato un errore durante il rilevamento della posizione.";
        
        switch(error.code) {
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
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden">
      {/* Map container - takes up full screen but with lower z-index */}
      <div className="absolute inset-0 z-0">
        <LocationsMap 
          locations={filteredLocations}
          isLoading={isLoading}
          findNearMe={findNearMe} 
          isLocating={isLocating}
          onSelectLocation={handleViewDetails}
        />
      </div>
      
      {/* Left panel overlay with search and locations list */}
      <LeftPanel 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        handleCategoryToggle={handleCategoryToggle}
        isLoading={isLoading}
        filteredLocations={filteredLocations}
        handleViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default TestLocationsPage;
