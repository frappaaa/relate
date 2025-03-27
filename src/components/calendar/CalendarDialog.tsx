
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
              : "Scegli cosa vuoi aggiungere per questa data"}
          </DialogDescription>
        </DialogHeader>
        
        <div className={cn(
          "grid gap-4 mt-4",
          isFutureDate ? "grid-cols-1" : "grid-cols-2"
        )}>
          {!isFutureDate && (
            <Button 
              className="flex items-center gap-2 h-auto py-4"
              onClick={onNavigateToEncounter}
            >
              <Heart className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Rapporto</div>
                <div className="text-xs text-muted-foreground">Registra un nuovo rapporto</div>
              </div>
            </Button>
          )}
          
          <Button
            variant={isFutureDate ? "default" : "outline"}
            className="flex items-center gap-2 h-auto py-4"
            onClick={onNavigateToTest}
          >
            <Beaker className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Test</div>
              <div className="text-xs text-muted-foreground">Pianifica un test</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
