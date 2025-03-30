
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

import EncounterDetailHeader from '@/components/encounter/EncounterDetailHeader';
import EncounterDetailCard from '@/components/encounter/EncounterDetailCard';
import EncounterDetailActions from '@/components/encounter/EncounterDetailActions';
import EncounterDetailLoading from '@/components/encounter/EncounterDetailLoading';
import EncounterDetailNotFound from '@/components/encounter/EncounterDetailNotFound';

const EncounterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [encounter, setEncounter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
        
        setEncounter(data);
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

  const handleDelete = async () => {
    if (!user || !id) return;

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('encounters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Eliminato",
        description: "Il rapporto è stato eliminato con successo.",
      });
      
      navigate('/app/calendar');
    } catch (error) {
      console.error('Error deleting encounter:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il rapporto.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <EncounterDetailHeader isLoading={true} />
        <EncounterDetailLoading />
      </div>
    );
  }

  if (!encounter) {
    return <EncounterDetailNotFound />;
  }

  return (
    <div className="space-y-8">
      <EncounterDetailHeader isLoading={false} />
      <EncounterDetailCard encounter={encounter} />
      <Card>
        <CardFooter className="pt-6 flex justify-between">
          <EncounterDetailActions 
            encounterId={id as string} 
            onDelete={handleDelete} 
            isDeleting={isDeleting} 
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default EncounterDetailPage;
