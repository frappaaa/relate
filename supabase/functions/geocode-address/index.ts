
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retrieve the Mapbox token from environment variables
const MAPBOX_TOKEN = Deno.env.get('TOKEN_MAPBOX');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    }

    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not configured');
      return new Response(
        JSON.stringify({ error: 'Mapbox token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    }

    // Migliorata la formattazione dell'indirizzo per aumentare la probabilità di match
    const enhancedAddress = address.includes('Italy') ? address : `${address}, Italy`;
    const encodedAddress = encodeURIComponent(enhancedAddress);
    
    // Make request to Mapbox Geocoding API with improved parameters
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=it&types=address,place&language=it`;
    
    console.log(`Geocoding address: ${enhancedAddress}`);
    
    const response = await fetch(mapboxUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mapbox API error (${response.status}): ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Mapbox API error: ${response.status}` }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    }
    
    const data = await response.json();
    
    // Check if we got valid coordinates
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      
      console.log(`Found coordinates for "${address}": [${lat}, ${lng}]`);
      console.log(`Place name: ${data.features[0].place_name}`);
      
      return new Response(
        JSON.stringify({ 
          coordinates: [lat, lng],
          address: data.features[0].place_name
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    } else {
      console.log(`No coordinates found for address: ${address}`);
      
      // Prova con una ricerca più generica se non ci sono risultati
      const cityMatch = address.match(/(?:,\s*)([^,]+?)(?:,|\s+\(|\s+[A-Z]{2}|$)/);
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim();
        const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=it&types=place&language=it`;
        
        console.log(`Trying fallback geocoding with city: ${city}`);
        
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.features && fallbackData.features.length > 0) {
          const [fLng, fLat] = fallbackData.features[0].center;
          
          console.log(`Found city coordinates for "${city}": [${fLat}, ${fLng}]`);
          
          return new Response(
            JSON.stringify({ 
              coordinates: [fLat, fLng],
              address: fallbackData.features[0].place_name,
              approximated: true
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            },
          );
        }
      }
      
      return new Response(
        JSON.stringify({ error: 'No coordinates found for this address' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    
    return new Response(
      JSON.stringify({ error: 'Error geocoding address' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      },
    );
  }
});
