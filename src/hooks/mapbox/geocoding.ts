
import { MAPBOX_TOKEN } from './constants';

// Funzione per geocodificare un indirizzo e ottenere le coordinate
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const query = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=it&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Errore nella richiesta di geocoding');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return [latitude, longitude]; // Restituisce [latitude, longitude]
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
