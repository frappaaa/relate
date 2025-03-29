
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import TestForm from '@/components/test/TestForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData, stiOptions } from '@/components/test/types';

const EditTestPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTest = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Errore",
            description: "Test non trovato",
            variant: "destructive"
          });
          navigate('/app/calendar');
          return;
        }

        // Convert test_type string to form data test types object
        const testTypes = data.test_type.split(', ');
        const testTypesObject = stiOptions.reduce((acc, option) => {
          acc[option.id] = testTypes.includes(option.id);
          return acc;
        }, {} as Record<string, boolean>);

        // Parse specific results if available
        // Handle it as an optional field that might not be present in the data
        const specificResults = data.specific_results || {};

        setInitialData({
          date: new Date(data.date),
          status: data.status,
          testTypes: testTypesObject,
          location: data.location || '',
          result: data.result || 'pending',
          specificResults,
          notes: data.notes || ''
        });
      } catch (error) {
        console.error('Error fetching test:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli del test.",
          variant: "destructive"
        });
        navigate('/app/calendar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id, user, navigate]);

  const handleSubmit = async (data: FormData) => {
    if (!user || !id) {
      toast({
        title: "Errore",
        description: "Devi essere connesso per aggiornare un test.",
        variant: "destructive"
      });
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
      
      // Process specific results
      let specificResults = {};
      
      if (data.status === 'completed' && data.result === 'positive') {
        // Only include results for selected test types
        specificResults = selectedTestTypes.reduce((acc, typeId) => {
          const result = data.specificResults[typeId] || 'pending';
          acc[typeId] = result;
          return acc;
        }, {} as Record<string, string>);
      }
      
      const { error } = await supabase
        .from('tests')
        .update({
          date: data.date.toISOString(),
          test_type: testType,
          status: data.status,
          result: data.status === 'completed' ? data.result : null,
          specific_results: data.status === 'completed' && data.result === 'positive' ? specificResults : null,
          location: data.location || null,
          notes: data.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Test aggiornato",
        description: "I dettagli del test sono stati aggiornati correttamente.",
      });
      
      // Navigate back to test detail
      navigate(`/app/test/${id}`);
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del test.",
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
          <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
          <p className="text-muted-foreground">Test non trovato</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
        <p className="text-muted-foreground">Aggiorna i dettagli del test registrato</p>
      </section>

      {isLoading ? (
        <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
      ) : !initialData ? (
        <div className="space-y-8">
          <p className="text-muted-foreground">Test non trovato</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/app/calendar')}
          >
            Torna al calendario
          </button>
        </div>
      ) : (
        <TestForm 
          onSubmit={handleSubmit} 
          initialData={initialData as FormData}
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
};

export default EditTestPage;
