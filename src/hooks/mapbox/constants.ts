
// We'll use the Mapbox token from Supabase Edge Function
export const MAPBOX_TOKEN = ''; // Token will be retrieved from edge function

// Function to get Mapbox token from edge function
export async function getMapboxToken(): Promise<string> {
  try {
    const response = await fetch('/api/get-mapbox-token');
    if (!response.ok) {
      throw new Error('Failed to fetch Mapbox token');
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching Mapbox token:', error);
    return '';
  }
}
