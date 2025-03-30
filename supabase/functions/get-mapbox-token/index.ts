
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Recupera il token Mapbox dalle variabili di ambiente di Supabase
const MAPBOX_TOKEN = Deno.env.get('TOKEN_MAPBOX');

serve(async (req) => {
  // Gestione delle richieste preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verifica che il token esista
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox token not found in environment variables',
          status: 'error' 
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        },
      );
    }
    
    console.log('Returning Mapbox token successfully');
    
    // Ritorna il token come risposta JSON
    return new Response(
      JSON.stringify({ token: MAPBOX_TOKEN, status: 'success' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  } catch (error) {
    console.error('Error retrieving Mapbox token:', error);
    
    return new Response(
      JSON.stringify({ error: 'Error retrieving Mapbox token', status: 'error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      },
    );
  }
});
