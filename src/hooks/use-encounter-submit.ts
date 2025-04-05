
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormData } from '@/components/encounter/types';
import { User } from '@supabase/supabase-js';

export function useEncounterSubmit(id: string | undefined, user: User | null) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormData & { riskScore: number; riskLevel: 'low' | 'medium' | 'high' }) => {
    if (!user || !id) {
      toast({
        title: "Errore",
        description: "Devi essere connesso per aggiornare un rapporto.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Map form protection level to boolean
      const protectionUsed = data.protection !== 'none';

      // Handle multiple encounter types 
      const encounterType = Array.isArray(data.type) 
        ? data.type.join(',') 
        : data.type;
      
      // Store symptoms directly in the symptoms column
      const symptomsData = data.symptoms || {};

      const { error } = await supabase
        .from('encounters')
        .update({
          date: data.date.toISOString(),
          encounter_type: encounterType,
          protection_used: protectionUsed,
          risk_level: data.riskLevel,
          notes: data.notes || null,
          symptoms: symptomsData,
          encounter_name: data.customName || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Rapporto aggiornato",
        description: "I dettagli del tuo rapporto sono stati aggiornati correttamente.",
      });
      
      // Navigate back to encounter detail
      navigate(`/app/encounter/${id}`);
    } catch (error) {
      console.error('Error updating encounter:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del rapporto.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
