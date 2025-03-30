
import { supabase } from '@/integrations/supabase/client';
import { TestLocation } from '@/types/locations';
import { transformLocationData } from './transformLocationData';
import { insertSampleLocations } from './sampleLocations';

export const fetchTestLocations = async (
  page = 0, 
  pageSize = 10, 
  searchQuery = '', 
  categories: string[] = []
): Promise<{ data: TestLocation[], count: number }> => {
  try {
    let query = supabase
      .from('test_locations')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (searchQuery) {
      query = query.or(
        `name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,region.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`
      );
    }
    
    if (categories.length > 0) {
      query = query.in('category', categories);
    }
    
    // Apply pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('name')
      .range(from, to);

    if (error) {
      console.error('Error fetching test locations:', error);
      throw error;
    }
    
    if (!data || data.length === 0 && page === 0) {
      // If no data is found on the first page, insert sample locations
      await insertSampleLocations();
      const { data: newData, count: newCount } = await supabase
        .from('test_locations')
        .select('*', { count: 'exact' })
        .order('name')
        .range(from, to);
      
      return {
        data: (newData || []).map(transformLocationData),
        count: newCount || 0
      };
    }
    
    // Transform the data to adapt to our application format
    return {
      data: (data || []).map(transformLocationData),
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching test locations:', error);
    throw error;
  }
};
