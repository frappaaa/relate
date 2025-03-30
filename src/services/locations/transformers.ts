
import { TestLocation } from './types';

// Function helper for transforming data from Supabase into the application format
export function transformLocationData(data: any): TestLocation {
  // Extract the city from the address if not specified separately
  const city = data.region || data.address.split(',').pop()?.trim() || '';
  
  // Convert the services into types of test if necessary
  const testTypes = data.services || ['HIV', 'Sifilide'];
  
  // Convert the opening hours into the application format if present
  let hours;
  if (data.opening_hours) {
    try {
      // If opening_hours is a JSONB field, it could already be an object
      const openingHours = typeof data.opening_hours === 'string' 
        ? JSON.parse(data.opening_hours) 
        : data.opening_hours;
        
      hours = Object.entries(openingHours).map(([day, hoursStr]) => ({
        day,
        hours: String(hoursStr)
      }));
    } catch (e) {
      console.warn('Failed to parse opening hours:', e);
    }
  }
  
  // Convert the coordinates into the format [lat, lng] if necessary
  let coordinates: [number, number] | undefined;
  if (data.coordinates && Array.isArray(data.coordinates) && data.coordinates.length === 2) {
    coordinates = [Number(data.coordinates[0]), Number(data.coordinates[1])];
  }
  
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    city: city,
    testTypes: testTypes,
    phone: data.contacts,
    website: data.website,
    hours: hours,
    description: data.description,
    coordinates: coordinates,
    category: data.category,
    region: data.region,
    email: data.email,
    social: data.social,
    services: data.services,
    images: data.images,
    source: data.source,
    lastVerifiedDate: data.last_verified_date
  };
}
