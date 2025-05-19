
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscriptionRequest = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Indirizzo email non valido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Invia email di conferma all'utente
    const userEmailResponse = await resend.emails.send({
      from: "Relate <onboarding@resend.dev>",
      to: [email],
      subject: "Grazie per esserti iscritto a Relate",
      html: `
        <h1>Benvenuto in Relate!</h1>
        <p>Grazie per esserti iscritto alla nostra newsletter.</p>
        <p>Ti terremo aggiornato sulle novità e gli sviluppi di Relate.</p>
        <p>Saluti,<br>Il team di Relate</p>
      `,
    });

    // Invia notifica al proprietario del sito (usa la stessa email per semplicità)
    const adminEmailResponse = await resend.emails.send({
      from: "Relate <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"], // Sostituisci con la tua email
      subject: "Nuovo iscritto alla newsletter di Relate",
      html: `
        <h1>Nuovo iscritto alla newsletter!</h1>
        <p>Email: ${email}</p>
        <p>Data: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Email inviate con successo:", { userEmailResponse, adminEmailResponse });

    return new Response(
      JSON.stringify({ message: "Iscrizione completata con successo" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Errore nell'invio dell'email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
