
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
      return new Response(
        JSON.stringify({ error: 'Mapbox token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        },
      );
    }

    // Encode the address for the URL
    const encodedAddress = encodeURIComponent(address + ', Italy');
    
    // Make request to Mapbox Geocoding API
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=it`;
    
    console.log(`Geocoding address: ${address}`);
    
    const response = await fetch(mapboxUrl);
    const data = await response.json();
    
    // Check if we got valid coordinates
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      
      console.log(`Found coordinates for "${address}": [${lat}, ${lng}]`);
      
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
