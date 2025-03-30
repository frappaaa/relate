
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormData, symptomsOptions } from '@/components/encounter/types';
import { User } from '@supabase/supabase-js';

export function useEncounterData(id: string | undefined, user: User | null) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);

  useEffect(() => {
    const fetchEncounter = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('encounters')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Errore",
            description: "Rapporto non trovato",
            variant: "destructive"
          });
          navigate('/app/calendar');
          return;
        }

        // Parse notes to extract symptoms if they exist
        const symptomsRegex = /Sintomi: (.*?)($|\n)/;
        const symptomsMatch = data.notes ? data.notes.match(symptomsRegex) : null;
        
        const symptoms = symptomsMatch ? symptomsMatch[1].split(', ') : [];
        const notesWithoutSymptoms = data.notes 
          ? data.notes.replace(/\n\nSintomi: .*/, '').replace(/^Sintomi: .*/, '') 
          : '';

        // Convert encounter_type to array if it contains multiple types
        const encounterTypes = data.encounter_type.includes(',')
          ? data.encounter_type.split(',')
          : [data.encounter_type];
        
        // Convert protection_used to form data protection level
        let protectionLevel: 'none' | 'partial' | 'full' = 'none';
        if (data.protection_used) {
          protectionLevel = 'full'; // Default to full when protection is used
        }

        // Initialize symptoms object
        const symptomsObject = symptomsOptions.reduce((acc, symptom) => {
          acc[symptom.id] = symptoms.includes(symptom.id);
          return acc;
        }, {} as Record<string, boolean>);

        setInitialData({
          date: new Date(data.date),
          type: encounterTypes as any,
          protection: protectionLevel,
          partnerStatus: 'unknown', // Default, as we don't store this
          symptoms: symptomsObject,
          notes: notesWithoutSymptoms.trim() // Trim any extra whitespace
        });
      } catch (error) {
        console.error('Error fetching encounter:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli del rapporto.",
          variant: "destructive"
        });
        navigate('/app/calendar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncounter();
  }, [id, user, navigate]);

  return { isLoading, initialData };
}
