
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';

interface TestActionsProps {
  testId: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const TestActions: React.FC<TestActionsProps> = ({ testId, isSubmitting, onSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => navigate(testId ? `/app/test/${testId}` : '/app/calendar')}
        disabled={isSubmitting}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Indietro
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvataggio...' : (
          <>
            <Check className="mr-1 h-4 w-4" />
            Salva test
          </>
        )}
      </Button>
    </div>
  );
};

export default TestActions;
