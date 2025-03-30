
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import LocationsMap from '@/components/test-locations/LocationsMap';
import LocationList from '@/components/test-locations/LocationList';
import ServiceFilterTags from '@/components/test-locations/ServiceFilterTags';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { fetchLocations, TestLocation } from '@/services/locationService';

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>([]);
  const [allLocations, setAllLocations] = useState<TestLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLocations();
        setAllLocations(data);
        setFilteredLocations(data);
        
        // Estrai tutti i servizi disponibili dalle sedi
        const services = new Set<string>();
        data.forEach(location => {
          location.testTypes.forEach(type => services.add(type));
        });
        setAvailableServices(Array.from(services).sort());
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
    
    // Filtro per query di ricerca
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
    
    // Filtro per servizi selezionati
    if (selectedServices.length > 0) {
      filtered = filtered.filter(location => 
        selectedServices.every(service => location.testTypes.includes(service))
      );
    }
    
    setFilteredLocations(filtered);
  };

  // Applica i filtri quando cambiano i parametri di ricerca o i servizi selezionati
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedServices, allLocations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      // Se il servizio è già selezionato, rimuovilo
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      }
      // Altrimenti, aggiungilo
      return [...prev, service];
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
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dove fare i test</h1>
        <p className="text-muted-foreground">Trova centri medici e laboratori vicino a te</p>
      </section>

      <LocationsMap 
        locations={filteredLocations}
        isLoading={isLoading}
        findNearMe={findNearMe} 
        isLocating={isLocating}
        onSelectLocation={handleViewDetails}
      />

      <LocationSearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />
      
      <ServiceFilterTags 
        availableServices={availableServices} 
        selectedServices={selectedServices} 
        onServiceToggle={handleServiceToggle} 
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
