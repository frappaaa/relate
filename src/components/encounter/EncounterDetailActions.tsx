
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
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

interface EncounterDetailActionsProps {
  encounterId: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const EncounterDetailActions: React.FC<EncounterDetailActionsProps> = ({ 
  encounterId, 
  onDelete, 
  isDeleting 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => navigate(`/app/edit-encounter/${encounterId}`)}
      >
        <Edit className="h-4 w-4" />
        Modifica
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2" disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Eliminazione...' : 'Elimina rapporto'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo rapporto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutti i dati relativi a questo rapporto verranno eliminati permanentemente.
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

export default EncounterDetailActions;
