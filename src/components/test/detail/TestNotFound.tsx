
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TestDetailHeader from './TestDetailHeader';

const TestNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <TestDetailHeader isLoading={false} />
      <p className="text-muted-foreground">Test non trovato</p>
      <Button onClick={() => navigate('/app/calendar')}>Torna al calendario</Button>
    </div>
  );
};

export default TestNotFound;
