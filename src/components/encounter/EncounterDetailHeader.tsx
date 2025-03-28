
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EncounterDetailHeaderProps {
  isLoading: boolean;
}

const EncounterDetailHeader: React.FC<EncounterDetailHeaderProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dettagli Rapporto</h1>
        <Button variant="outline" onClick={() => navigate('/app/calendar')}>
          Torna al calendario
        </Button>
      </div>
      <p className="text-muted-foreground">
        {isLoading 
          ? "Caricamento dei dettagli in corso..." 
          : "Visualizza i dettagli del rapporto registrato"}
      </p>
    </section>
  );
};

export default EncounterDetailHeader;
