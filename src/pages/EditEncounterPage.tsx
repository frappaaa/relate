
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EncounterForm from '@/components/encounter/EncounterForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/components/encounter/types';

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
          ? data.notes.replace(/\n\nSintomi: .*/, '') 
          : '';

        // Convert encounter_type to form data type
        const formDataType = data.encounter_type as 'oral' | 'vaginal' | 'anal';
        
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
          type: formDataType,
          protection: protectionLevel,
          partnerStatus: 'unknown', // Default, as we don't store this
          symptoms: symptomsObject,
          notes: notesWithoutSymptoms
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

      // Map form type to encounter_type enum
      let encounterType = data.type as 'oral' | 'vaginal' | 'anal';
      
      // Map symptoms to notes
      const symptomsSelected = Object.entries(data.symptoms)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
      
      const notes = data.notes 
        ? `${data.notes}\n\nSintomi: ${symptomsSelected}` 
        : `Sintomi: ${symptomsSelected}`;

      const { error } = await supabase
        .from('encounters')
        .update({
          date: data.date.toISOString(),
          encounter_type: encounterType,
          protection_used: protectionUsed,
          risk_level: data.riskLevel,
          notes: notes,
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
