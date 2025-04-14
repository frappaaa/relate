
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardFooter } from '@/components/ui/card';
import TestDetailHeader from '@/components/test/detail/TestDetailHeader';
import TestDetailCard from '@/components/test/detail/TestDetailCard';
import TestDetailActions from '@/components/test/detail/TestDetailActions';
import TestLoadingSkeleton from '@/components/test/detail/TestLoadingSkeleton';
import TestNotFound from '@/components/test/detail/TestNotFound';

const TestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
        
        setTest(data);
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

  const handleDelete = async () => {
    if (!user || !id) return;

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Eliminato",
        description: "Il test è stato eliminato con successo.",
      });
      
      navigate('/app/calendar');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il test.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <TestLoadingSkeleton />;
  }

  if (!test) {
    return <TestNotFound />;
  }

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      <TestDetailHeader isLoading={false} />
      <div className="grid gap-8 max-w-full">
        <TestDetailCard test={test} />
        <Card className="shadow-md border-t-4 border-t-primary overflow-hidden">
          <CardFooter className="p-4 sm:p-6 flex justify-between max-w-full overflow-x-auto">
            <TestDetailActions 
              testId={id as string} 
              onDelete={handleDelete} 
              isDeleting={isDeleting}
              test={test}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TestDetailPage;
