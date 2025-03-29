
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TestEditNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
        <p className="text-muted-foreground">Test non trovato</p>
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

export default TestEditNotFound;
