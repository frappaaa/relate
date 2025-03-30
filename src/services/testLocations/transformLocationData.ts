
/**
 * Helper function to transform data from Supabase to match our application format
 */
export function transformLocationData(data: any) {
  // Extract city from address if not specified separately
  const city = data.region || data.address.split(',').pop()?.trim() || '';
  
  // Convert services to test types if needed
  const testTypes = data.services || ['HIV', 'Sifilide'];
  
  // Convert opening hours to our application format if present
  let hours;
  if (data.opening_hours) {
    try {
      // If opening_hours is a JSONB field, it might already be an object
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
  
  // Convert coordinates to [lat, lng] format if needed
  let coordinates;
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
