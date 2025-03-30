
import React from 'react';
import { useParams } from 'react-router-dom';
import EncounterForm from '@/components/encounter/EncounterForm';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/components/encounter/types';
import { useEncounterData } from '@/hooks/use-encounter';
import { useEncounterSubmit } from '@/hooks/use-encounter-submit';
import EditEncounterLoading from '@/components/encounter/EditEncounterLoading';
import EditEncounterNotFound from '@/components/encounter/EditEncounterNotFound';

const EditEncounterPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const { isLoading, initialData } = useEncounterData(id, user);
  const { handleSubmit, isSubmitting } = useEncounterSubmit(id, user);

  if (isLoading) {
    return <EditEncounterLoading />;
  }

  if (!initialData) {
    return <EditEncounterNotFound />;
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
