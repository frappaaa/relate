
import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Heart, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  isFutureDate: boolean;
  onNavigateToEncounter: () => void;
  onNavigateToTest: () => void;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedDate,
  isFutureDate,
  onNavigateToEncounter,
  onNavigateToTest,
}) => {
  if (!selectedDate) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: it })}
          </DialogTitle>
          <DialogDescription>
            {isFutureDate 
              ? "Pianifica un nuovo test per questa data" 
              : "Cosa vuoi aggiungere per questa data"}
          </DialogDescription>
        </DialogHeader>
        
        <div className={cn(
          "grid gap-4 py-4",
          isFutureDate ? "grid-cols-1" : "grid-cols-2"
        )}>
          {!isFutureDate && (
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-32 gap-2"
              onClick={onNavigateToEncounter}
            >
              <Heart className="h-8 w-8 text-relate-500" />
              <span className="text-sm font-medium">Nuovo rapporto</span>
            </Button>
          )}
          
          <Button
            variant={isFutureDate ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={onNavigateToTest}
          >
            <Beaker className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Nuovo test</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
