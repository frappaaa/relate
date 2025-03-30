
import { supabase } from '@/integrations/supabase/client';
import { transformLocationData } from './transformers';
import { sampleLocations } from './sampleData';
import { geocodeAddress } from '@/hooks/use-mapbox';
import { TestLocation } from './types';

// Function to insert sample locations if the database is empty
export async function insertSampleLocations() {
  for (const location of sampleLocations) {
    const { error } = await supabase
      .from('test_locations')
      .insert([location]);
      
    if (error) {
      console.error('Error inserting sample location:', error);
    }
  }
}

// Function to fetch a location by ID
export async function fetchLocationById(id: string): Promise<TestLocation | null> {
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
    
    // Transform data from Supabase into the application format
    return transformLocationData(data);
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

// Function to fetch all locations
export async function fetchLocations(): Promise<TestLocation[]> {
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
      // If there's no data, insert some sample data
      await insertSampleLocations();
      const { data: newData } = await supabase
        .from('test_locations')
        .select('*')
        .order('name');
      
      return (newData || []).map(transformLocationData);
    }
    
    // Transform the data to adapt it to the application format
    const locations = await Promise.all(data.map(async (loc) => {
      const transformedLocation = transformLocationData(loc);
      
      // If the coordinates aren't available, try to geocode the address
      if (!transformedLocation.coordinates) {
        const fullAddress = `${transformedLocation.address}, ${transformedLocation.city || transformedLocation.region || 'Italia'}`;
        try {
          const coordinates = await geocodeAddress(fullAddress);
          if (coordinates) {
            transformedLocation.coordinates = coordinates;
            
            // Update coordinates in the database for future use
            await supabase
              .from('test_locations')
              .update({ coordinates: [coordinates[0], coordinates[1]] })
              .eq('id', transformedLocation.id);
          }
        } catch (error) {
          console.error('Geocoding failed for address:', fullAddress, error);
        }
      }
      
      return transformedLocation;
    }));
    
    return locations;
  } catch (error) {
    console.error('Error fetching test locations:', error);
    throw error;
  }
}
