
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Beaker } from 'lucide-react';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (type: 'encounter' | 'test') => {
    if (type === 'encounter') {
      navigate('/app/new-encounter');
    } else {
      navigate('/app/new-test');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cosa vuoi aggiungere?</DialogTitle>
          <DialogDescription>
            Scegli il tipo di elemento che vuoi registrare
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => handleSelect('encounter')}
          >
            <Heart className="h-8 w-8 text-relate-500" />
            <span className="text-sm font-medium">Nuovo rapporto</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => handleSelect('test')}
          >
            <Beaker className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Nuovo test</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryModal;
