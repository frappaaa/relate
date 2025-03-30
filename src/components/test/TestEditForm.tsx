
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData } from './types';
import TestForm from './TestForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface TestEditFormProps {
  testId: string;
  initialData: FormData;
}

const TestEditForm: React.FC<TestEditFormProps> = ({ testId, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: FormData) => {
    if (!user || !testId) {
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
      
      const { error } = await supabase
        .from('tests')
        .update({
          date: data.date.toISOString(),
          test_type: testType,
          status: status,
          result: status === 'completed' ? result : null,
          specific_results: status === 'completed' ? specificResults : null,
          location: data.location || null,
          notes: data.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', testId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Test aggiornato",
        description: "I dettagli del test sono stati aggiornati correttamente.",
      });
      
      // Navigate back to test detail
      navigate(`/app/test/${testId}`);
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

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
        <p className="text-muted-foreground">Aggiorna i dettagli del test registrato</p>
      </section>

      <TestForm 
        onSubmit={handleSubmit} 
        initialData={initialData}
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default TestEditForm;
