
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { fetchLocations, TestLocation } from '@/services/locationService';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

export const useNearbyLocations = () => {
  const [isLocating, setIsLocating] = useState(false);

  const findNearMe = async (
    setLocations: (locations: TestLocation[]) => void
  ) => {
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
      position => {
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
            
            setLocations(sortedLocations);
            
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
      }, 
      error => {
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
      }, 
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return {
    isLocating,
    findNearMe
  };
};
