
import { TestLocation } from '@/types/locations';
import { fetchTestLocations } from './testLocations/fetchLocations';
import { fetchLocationById } from './testLocations/fetchLocationById';
import { transformLocationData } from './testLocations/transformLocationData';

export type { TestLocation } from '@/types/locations';

// Re-export the functions from the other files
export {
  fetchLocationById,
  transformLocationData,
  fetchTestLocations
};

// Main function that maintains backwards compatibility
export const fetchLocations = async (
  page = 0, 
  pageSize = 10, 
  searchQuery = '', 
  categories: string[] = []
): Promise<{ data: TestLocation[], count: number }> => {
  return await fetchTestLocations(page, pageSize, searchQuery, categories);
};
