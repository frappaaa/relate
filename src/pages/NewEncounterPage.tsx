import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EncounterForm from '@/components/encounter/EncounterForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/components/encounter/types';
const NewEncounterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    user
  } = useAuth();

  // Get date from URL if available
  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const handleSubmit = async (data: FormData & {
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
  }) => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere connesso per salvare un rapporto.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    try {
      setIsSubmitting(true);

      // Map form protection level to boolean
      const protectionUsed = data.protection !== 'none';

      // Handle multiple encounter types
      const encounterType = Array.isArray(data.type) ? data.type.join(',') : data.type;

      // Store symptoms directly in the symptoms column
      const symptomsData = data.symptoms || {};
      const {
        error
      } = await supabase.from('encounters').insert({
        user_id: user.id,
        date: data.date.toISOString(),
        encounter_type: encounterType,
        protection_used: protectionUsed,
        risk_level: data.riskLevel,
        notes: data.notes || null,
        symptoms: symptomsData
      });
      if (error) throw error;

      // Show success message
      toast({
        title: "Rapporto registrato",
        description: "I dettagli del tuo rapporto sono stati salvati correttamente."
      });

      // Navigate back to dashboard
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error saving encounter:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del rapporto.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="space-y-8 px-[16px] py-[13px]">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registra un nuovo rapporto</h1>
        <p className="text-muted-foreground">Inserisci i dettagli per valutare il rischio e ricevere raccomandazioni</p>
      </section>

      <EncounterForm onSubmit={handleSubmit} initialDate={initialDate} isSubmitting={isSubmitting} />
    </div>;
};
export default NewEncounterPage;