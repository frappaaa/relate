
import { supabase } from '@/integrations/supabase/client';
import { TestLocation } from '@/types/locations';
import { transformLocationData } from './transformLocationData';

export const fetchLocationById = async (id: string): Promise<TestLocation | null> => {
  try {
    const { data, error } = await supabase
      .from('test_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching location details:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform the data from Supabase to match our application format
    return transformLocationData(data);
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};
