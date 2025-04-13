
import React, { useState } from 'react';
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

interface EncounterDetailActionsProps {
  encounterId: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  encounter?: any;
}

const EncounterDetailActions: React.FC<EncounterDetailActionsProps> = ({ 
  encounterId, 
  onDelete, 
  isDeleting,
  encounter
}) => {
  const navigate = useNavigate();

  const handleDuplicate = () => {
    if (!encounter) return;
    
    // Create a query string with encounter data for the new encounter form
    const queryParams = new URLSearchParams();
    
    // Add date (use today's date as default)
    queryParams.set('date', new Date().toISOString());
    
    // Add encounter type if available
    if (encounter.encounter_type) {
      queryParams.set('type', encounter.encounter_type);
    }
    
    // Add protection info if available
    if (encounter.protection_used !== undefined) {
      queryParams.set('protection', encounter.protection_used ? 'full' : 'none');
    }
    
    // Add custom name if available
    if (encounter.encounter_name) {
      queryParams.set('customName', encounter.encounter_name);
    }
    
    // Add symptoms if available
    if (encounter.symptoms && Object.keys(encounter.symptoms).length > 0) {
      queryParams.set('symptoms', JSON.stringify(encounter.symptoms));
    }
    
    // Add notes if available
    if (encounter.notes) {
      queryParams.set('notes', encounter.notes);
    }
    
    // Navigate to new encounter page with params
    navigate(`/app/new-encounter?${queryParams.toString()}`);
  };

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
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleDuplicate}
        disabled={!encounter}
      >
        <Copy className="h-4 w-4" />
        Duplica
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
