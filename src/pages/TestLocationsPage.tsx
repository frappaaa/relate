
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import LocationMap from '@/components/test-locations/LocationMap';
import LocationList from '@/components/test-locations/LocationList';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  coordinates?: [number, number]; // [latitude, longitude]
}

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [allLocations, setAllLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://script.google.com/macros/s/AKfycbyY_by3TUuC9f771RqXfBarbTDxDEIp9BFbqbtqtoU/dev');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Transform the API data to match our TestLocation interface
        const transformedData = data.map((item: any) => ({
          id: item.id || String(Math.random()),
          name: item.name,
          address: item.address,
          city: item.city,
          testTypes: item.testTypes || [],
          coordinates: item.coordinates || undefined
        }));
        
        setAllLocations(transformedData);
        setFilteredLocations(transformedData);
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

    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = allLocations.filter(
      location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.testTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredLocations(filtered);
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
        
        // Calculate distance for each location
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
        
        // Sort by distance
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
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dove fare i test</h1>
        <p className="text-muted-foreground">Trova centri medici e laboratori vicino a te</p>
      </section>

      <LocationMap 
        findNearMe={findNearMe} 
        isLocating={isLocating} 
      />

      <LocationSearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />

      <LocationList 
        isLoading={isLoading} 
        filteredLocations={filteredLocations} 
        handleViewDetails={handleViewDetails} 
      />
    </div>
  );
};

export default TestLocationsPage;
