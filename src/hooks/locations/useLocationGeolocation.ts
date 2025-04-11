
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { TestLocation } from '@/types/locations';
import { useLocationTransformers } from './useLocationTransformers';

export const useLocationGeolocation = (
  onLocationsWithDistance: (locations: TestLocation[]) => void
) => {
  const [isLocating, setIsLocating] = useState(false);
  const { addDistanceToLocations, sortLocationsByDistance } = useLocationTransformers();

  /**
   * Find locations near the user based on geolocation
   */
  const findNearMe = useCallback((locations: TestLocation[]) => {
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
        
        // Add distance information to each location
        const locationsWithDistance = addDistanceToLocations(userLat, userLon, locations);
        
        // Sort locations by distance
        const sortedLocations = sortLocationsByDistance(locationsWithDistance);
        
        // Send sorted locations back to parent hook
        onLocationsWithDistance(sortedLocations);
        
        toast({
          title: "Posizione rilevata",
          description: "I centri sono stati ordinati in base alla distanza da te."
        });
        
        setIsLocating(false);
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
  }, [addDistanceToLocations, sortLocationsByDistance, onLocationsWithDistance]);

  return {
    isLocating,
    findNearMe
  };
};
