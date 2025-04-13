
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EncounterForm from '@/components/encounter/EncounterForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/components/encounter/types';

// Valid encounter types
const validEncounterTypes = ['oral', 'vaginal', 'anal'];

const NewEncounterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);
  const { user } = useAuth();
  
  // Get date from URL if available
  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  // Process URL parameters to populate the form
  useEffect(() => {
    const formData: Partial<FormData> = {
      date: initialDate
    };
    
    // Get encounter type from URL if available and validate it
    const typeParam = searchParams.get('type');
    if (typeParam) {
      if (typeParam.includes(',')) {
        // Handle multiple types
        const types = typeParam.split(',').filter(type => 
          validEncounterTypes.includes(type)
        ) as ('oral' | 'vaginal' | 'anal')[];
        
        if (types.length > 0) {
          formData.type = types;
        }
      } else if (validEncounterTypes.includes(typeParam)) {
        // Handle single type
        formData.type = typeParam as 'oral' | 'vaginal' | 'anal';
      }
    }
    
    // Get protection level from URL if available
    const protectionParam = searchParams.get('protection');
    if (protectionParam && ['none', 'partial', 'full'].includes(protectionParam)) {
      formData.protection = protectionParam as 'none' | 'partial' | 'full';
    }
    
    // Get custom name from URL if available
    const customNameParam = searchParams.get('customName');
    if (customNameParam) {
      formData.customName = customNameParam;
    }
    
    // Get symptoms from URL if available
    const symptomsParam = searchParams.get('symptoms');
    if (symptomsParam) {
      try {
        formData.symptoms = JSON.parse(symptomsParam);
      } catch (e) {
        console.error('Error parsing symptoms:', e);
      }
    }
    
    // Get notes from URL if available
    const notesParam = searchParams.get('notes');
    if (notesParam) {
      formData.notes = notesParam;
    }
    
    // Only set initialData if we have parameters beyond the date
    if (Object.keys(formData).length > 1) {
      setInitialData(formData);
    }
  }, [searchParams, initialDate]);

  const handleSubmit = async (data: FormData & { riskScore: number; riskLevel: 'low' | 'medium' | 'high' }) => {
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
      const encounterType = Array.isArray(data.type) 
        ? data.type.join(',') 
        : data.type;
      
      // Store symptoms directly in the symptoms column
      const symptomsData = data.symptoms || {};

      const { error } = await supabase
        .from('encounters')
        .insert({
          user_id: user.id,
          date: data.date.toISOString(),
          encounter_type: encounterType,
          protection_used: protectionUsed,
          risk_level: data.riskLevel,
          notes: data.notes || null,
          symptoms: symptomsData,
          encounter_name: data.customName || null
        });
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Rapporto registrato",
        description: "I dettagli del tuo rapporto sono stati salvati correttamente.",
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

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registra un nuovo rapporto</h1>
        <p className="text-muted-foreground">Inserisci i dettagli per valutare il rischio e ricevere raccomandazioni</p>
      </section>

      <EncounterForm 
        onSubmit={handleSubmit} 
        initialDate={initialDate}
        initialData={initialData} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default NewEncounterPage;
