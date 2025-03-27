
export interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  phone?: string;
  website?: string;
  hours?: { day: string; hours: string }[];
  description?: string;
  coordinates?: [number, number];
}

export const fetchLocationById = async (id: string): Promise<TestLocation | null> => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyY_by3TUuC9f771RqXfBarbTDxDEIp9BFbqbtqtoU/dev');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const foundLocation = data.find((loc: any) => loc.id === id);
    
    if (foundLocation) {
      // Transform to match our interface
      return {
        id: foundLocation.id,
        name: foundLocation.name,
        address: foundLocation.address,
        city: foundLocation.city,
        testTypes: foundLocation.testTypes || [],
        phone: foundLocation.phone,
        website: foundLocation.website,
        hours: foundLocation.hours,
        description: foundLocation.description,
        coordinates: foundLocation.coordinates
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};
