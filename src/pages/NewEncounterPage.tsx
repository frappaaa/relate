
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EncounterForm from '@/components/EncounterForm';

const NewEncounterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get date from URL if available
  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  const handleSubmit = (data: any) => {
    // In a real app, you would save this data to a database/local storage
    console.log('Submitted encounter data:', data);
    
    // Show success message
    toast({
      title: "Rapporto registrato",
      description: "I dettagli del tuo rapporto sono stati salvati correttamente.",
    });
    
    // Navigate back to dashboard
    navigate('/app/dashboard');
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registra un nuovo rapporto</h1>
        <p className="text-muted-foreground">Inserisci i dettagli per valutare il rischio e ricevere raccomandazioni</p>
      </section>

      <EncounterForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewEncounterPage;
