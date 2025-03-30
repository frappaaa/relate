
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EditEncounterNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modifica rapporto</h1>
        <p className="text-muted-foreground">Rapporto non trovato</p>
      </section>
      <Button 
        variant="default"
        onClick={() => navigate('/app/calendar')}
      >
        Torna al calendario
      </Button>
    </div>
  );
};

export default EditEncounterNotFound;
