
import { supabase } from '@/integrations/supabase/client';
import { TestLocation } from '@/types/locations';
import { transformLocationData } from './transformLocationData';
import { insertSampleLocations } from './sampleLocations';

export const fetchTestLocations = async (): Promise<TestLocation[]> => {
  try {
    const { data, error } = await supabase
      .from('test_locations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching test locations:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // If no data is found, insert sample locations
      await insertSampleLocations();
      const { data: newData } = await supabase
        .from('test_locations')
        .select('*')
        .order('name');
      
      return (newData || []).map(transformLocationData);
    }
    
    // Transform the data to adapt to our application format
    return data.map(transformLocationData);
  } catch (error) {
    console.error('Error fetching test locations:', error);
    throw error;
  }
};
