
import { TestLocation } from '@/types/locations';
import { fetchTestLocations } from './testLocations/fetchLocations';
import { fetchLocationById } from './testLocations/fetchLocationById';
import { transformLocationData } from './testLocations/transformLocationData';

export type { TestLocation } from '@/types/locations';

// Re-export the main functions
export {
  fetchLocations,
  fetchLocationById,
  transformLocationData
};

// Main function that maintains backwards compatibility
export const fetchLocations = async (): Promise<TestLocation[]> => {
  return await fetchTestLocations();
};

