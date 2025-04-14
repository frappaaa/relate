
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
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => navigate(`/app/edit-test/${testId}`)}
      >
        <Edit className="h-4 w-4" />
        Modifica
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleDuplicate}
        disabled={!test}
      >
        <Copy className="h-4 w-4" />
        Duplica
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2" disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Eliminazione...' : 'Elimina test'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo test?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutti i dati relativi a questo test verranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestDetailActions;
