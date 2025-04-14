
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TestDetailActionsProps {
  testId: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  test?: any;
}

const TestDetailActions: React.FC<TestDetailActionsProps> = ({ 
  testId, 
  onDelete, 
  isDeleting,
  test
}) => {
  const navigate = useNavigate();

  const handleDuplicate = () => {
    if (!test) return;
    
    // Create a query string with test data for the new test form
    const queryParams = new URLSearchParams();
    
    // Add date (use today's date as default)
    queryParams.set('date', new Date().toISOString());
    
    // Add test types
    if (test.test_type) {
      queryParams.set('testTypes', test.test_type);
    }
    
    // Add location if available
    if (test.location) {
      queryParams.set('location', test.location);
    }
    
    // Add notes if available
    if (test.notes) {
      queryParams.set('notes', test.notes);
    }
    
    // Navigate to new test page with params
    navigate(`/app/new-test?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 flex-1 min-w-[120px]" 
        onClick={() => navigate(`/app/edit-test/${testId}`)}
      >
        <Edit className="h-4 w-4" />
        <span className="whitespace-nowrap">Modifica</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 flex-1 min-w-[120px]" 
        onClick={handleDuplicate}
        disabled={!test}
      >
        <Copy className="h-4 w-4" />
        <span className="whitespace-nowrap">Duplica</span>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2 flex-1 min-w-[120px]" 
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="whitespace-nowrap">
              {isDeleting ? 'Eliminazione...' : 'Elimina'}
            </span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo test?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutti i dati relativi a questo test verranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="w-full sm:w-auto bg-destructive text-destructive-foreground">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestDetailActions;
