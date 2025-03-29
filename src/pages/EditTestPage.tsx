
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FormData, stiOptions } from '@/components/test/types';
import TestEditLoading from '@/components/test/TestEditLoading';
import TestEditNotFound from '@/components/test/TestEditNotFound';
import TestEditForm from '@/components/test/TestEditForm';

const EditTestPage: React.FC = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormData | null>(null);
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
          return;
        }

        // Convert test_type string to form data test types object
        const testTypes = data.test_type.split(', ');
        const testTypesObject = stiOptions.reduce((acc, option) => {
          acc[option.id] = testTypes.includes(option.id);
          return acc;
        }, {} as Record<string, boolean>);

        // Parse specific results if available
        // TypeScript doesn't know about specific_results column, use any type assertion
        const specificResults = (data as any).specific_results || {};

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id, user]);

  if (isLoading) {
    return <TestEditLoading />;
  }

  if (!initialData) {
    return <TestEditNotFound />;
  }

  return <TestEditForm testId={id!} initialData={initialData} />;
};

export default EditTestPage;
