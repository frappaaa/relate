
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TestDeleteDialogProps {
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const TestDeleteDialog: React.FC<TestDeleteDialogProps> = ({ onDelete, isDeleting }) => {
  return (
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
  );
};

export default TestDeleteDialog;
