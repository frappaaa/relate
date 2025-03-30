
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EncounterForm from '@/components/encounter/EncounterForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData, symptomsOptions } from './types';

const EditEncounterPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);
  const { user } = useAuth();

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
          : data.encounter_type;
        
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
          type: encounterTypes,
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

      // Handle multiple encounter types or single type
      let encounterType = Array.isArray(data.type) 
        ? data.type.join(',') 
        : data.type;
      
      // Map symptoms to notes, only if symptoms are actually selected
      const symptomsSelected = Object.entries(data.symptoms)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      let notes = data.notes || '';
      
      // Only add symptoms to notes if any symptoms were selected
      if (symptomsSelected.length > 0) {
        const symptomsText = symptomsSelected.join(', ');
        notes = notes ? `${notes}\n\nSintomi: ${symptomsText}` : `Sintomi: ${symptomsText}`;
      }

      const { error } = await supabase
        .from('encounters')
        .update({
          date: data.date.toISOString(),
          encounter_type: encounterType,
          protection_used: protectionUsed,
          risk_level: data.riskLevel,
          notes: notes || null,
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Modifica rapporto</h1>
          <p className="text-muted-foreground">Caricamento dei dettagli in corso...</p>
        </section>
        <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Modifica rapporto</h1>
          <p className="text-muted-foreground">Rapporto non trovato</p>
        </section>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/app/calendar')}
        >
          Torna al calendario
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modifica rapporto</h1>
        <p className="text-muted-foreground">Aggiorna i dettagli del rapporto registrato</p>
      </section>

      <EncounterForm 
        onSubmit={handleSubmit} 
        initialData={initialData as FormData}
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default EditEncounterPage;

// List of symptoms that can be selected - must match the ones in the form
const symptomsOptions = [
  { id: "itching", label: "Prurito" },
  { id: "pain", label: "Dolore o fastidio" },
  { id: "discharge", label: "Perdite insolite" },
  { id: "rash", label: "Eruzioni cutanee" },
  { id: "fever", label: "Febbre" },
  { id: "swelling", label: "Gonfiore" },
  { id: "odor", label: "Odore insolito" },
  { id: "urination", label: "Problemi di minzione" },
] as const;
