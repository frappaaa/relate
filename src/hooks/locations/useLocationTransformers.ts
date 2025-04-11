
import { TestLocation } from '@/types/locations';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

/**
 * Helper functions for transforming location data
 */
export const useLocationTransformers = () => {
  /**
   * Adds distance information to location objects based on user coordinates
   */
  const addDistanceToLocations = (
    userLat: number, 
    userLon: number, 
    locations: TestLocation[]
  ): TestLocation[] => {
    const locationsWithDistance = locations.map(location => {
      if (!location.coordinates) return location;
      const distance = calculateDistance(userLat, userLon, location.coordinates[0], location.coordinates[1]);
      return {
        ...location,
        distance: formatDistance(distance)
      };
    });
    
    return locationsWithDistance;
  };

  /**
   * Sorts locations by distance (closest first)
   */
  const sortLocationsByDistance = (locations: TestLocation[]): TestLocation[] => {
    return [...locations].sort((a, b) => {
      if (!a.distance || !b.distance) return 0;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
  };

  return {
    addDistanceToLocations,
    sortLocationsByDistance
  };
};
