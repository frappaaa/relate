
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData, stiOptions } from '@/components/test/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useTestData = (testId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTest = async () => {
      if (!user || !testId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Errore",
            description: "Test non trovato",
            variant: "destructive"
          });
          setInitialData(null);
          return;
        }

        // Convert test_type string to form data test types object
        const testTypes = data.test_type.split(', ');
        const testTypesObject = stiOptions.reduce((acc, option) => {
          acc[option.id] = testTypes.includes(option.id);
          return acc;
        }, {} as Record<string, boolean>);

        // Parse specific results if available
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
        setInitialData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [testId, user]);

  return { isLoading, initialData };
};
