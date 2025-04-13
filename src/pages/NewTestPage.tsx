
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import TestForm from '@/components/test/TestForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData, stiOptions } from '@/components/test/types';

const NewTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const { user } = useAuth();
  
  // Get date from URL if available
  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  // Process URL parameters to populate the form
  useEffect(() => {
    const testTypesParam = searchParams.get('testTypes');
    const locationParam = searchParams.get('location');
    const notesParam = searchParams.get('notes');
    
    // Only create initial data if we have parameters
    if (testTypesParam || locationParam || notesParam) {
      // Initialize with default values
      const formData: FormData = {
        date: initialDate,
        testTypes: {},
        location: locationParam || '',
        specificResults: {},
        notes: notesParam || ''
      };
      
      // Process testTypes parameter (comma-separated list)
      if (testTypesParam) {
        const testTypes = testTypesParam.split(', ');
        
        // Convert to the expected object format
        const testTypesObject = stiOptions.reduce((acc, option) => {
          acc[option.id] = testTypes.includes(option.id);
          return acc;
        }, {} as Record<string, boolean>);
        
        formData.testTypes = testTypesObject;
      }
      
      console.log("Setting initial data for test form:", formData);
      setInitialData(formData);
    }
  }, [searchParams, initialDate]);

  const handleSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere connesso per salvare un test.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get selected test types
      const selectedTestTypes = Object.entries(data.testTypes)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      if (selectedTestTypes.length === 0) {
        toast({
          title: "Errore",
          description: "Seleziona almeno un tipo di test.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // For each selected test type, create a test entry
      const testType = selectedTestTypes.join(', ');
      
      // Determina lo stato del test in base alla data
      const testDate = new Date(data.date);
      const isInFuture = testDate.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
      const status = isInFuture ? 'scheduled' : 'completed';
      
      // Process specific results
      let specificResults = {};
      let result: 'negative' | 'positive' | 'pending' = 'pending';
      
      if (!isInFuture) {
        // Solo per i test completati (data non futura)
        specificResults = selectedTestTypes.reduce((acc, typeId) => {
          const testResult = data.specificResults[typeId] || 'pending';
          acc[typeId] = testResult;
          return acc;
        }, {} as Record<string, string>);
        
        // Determina il risultato generale in base ai risultati specifici
        const hasPositive = Object.values(specificResults).includes('positive');
        result = hasPositive ? 'positive' : 'negative';
      }
      
      console.log("Saving test with data:", {
        user_id: user.id,
        date: data.date.toISOString(),
        test_type: testType,
        status: status,
        result: status === 'completed' ? result : null,
        specific_results: status === 'completed' ? specificResults : null,
        location: data.location || null,
        notes: data.notes || null
      });
      
      const { error } = await supabase
        .from('tests')
        .insert({
          user_id: user.id,
          date: data.date.toISOString(),
          test_type: testType,
          status: status,
          result: status === 'completed' ? result : null,
          specific_results: status === 'completed' ? specificResults : null,
          location: data.location || null,
          notes: data.notes || null
        });
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Test registrato",
        description: "I dettagli del test sono stati salvati correttamente.",
      });
      
      // Navigate back to dashboard
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error saving test:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del test.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registra un nuovo test</h1>
        <p className="text-muted-foreground">Inserisci i dettagli per programmare o registrare un test per IST</p>
      </section>

      <TestForm 
        onSubmit={handleSubmit} 
        initialDate={initialDate} 
        initialData={initialData}
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default NewTestPage;
