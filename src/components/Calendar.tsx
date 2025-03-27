
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, isAfter, startOfDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Heart, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/utils/riskCalculator';

interface CalendarEvent {
  id: string;
  date: Date;
  type: 'encounter' | 'test';
  details?: {
    encounterType?: string;
    risk?: 'low' | 'medium' | 'high';
    testType?: string;
    result?: string;
  };
}

interface CalendarComponentProps {
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onAddEvent,
  onViewEvent,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = startOfDay(new Date());

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = getDay(startOfMonth(currentMonth));

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleAddEncounter = () => {
    if (selectedDate) {
      onAddEvent(selectedDate);
      setIsDialogOpen(false);
    }
  };

  const isFutureDate = (date: Date) => {
    return isAfter(startOfDay(date), today);
  };

  const navigateToEncounterForm = () => {
    if (selectedDate) {
      window.location.href = `/app/new-encounter?date=${selectedDate.toISOString()}`;
      setIsDialogOpen(false);
    }
  };

  const navigateToTestForm = () => {
    if (selectedDate) {
      window.location.href = `/app/new-test?date=${selectedDate.toISOString()}`;
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: it })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 p-1 border rounded-md opacity-50 bg-secondary/30" />
        ))}

        {daysInMonth.map((date) => {
          const dateEvents = getEventsForDay(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, new Date());

          return (
            <div
              key={date.toString()}
              className={cn(
                "h-24 p-2 border rounded-md flex flex-col cursor-pointer transition-colors hover:bg-secondary/40",
                isToday && "border-primary/50 bg-primary/5",
                !isCurrentMonth && "opacity-50"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isToday && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                )}>
                  {format(date, 'd')}
                </span>
                {dateEvents.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {dateEvents.length}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1 overflow-hidden flex-1">
                {dateEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs rounded-sm px-1.5 py-0.5 truncate",
                      event.type === 'encounter' ? 
                        `bg-opacity-20 ${getRiskColor(event.details?.risk || 'low')} bg-opacity-15` : 
                        "bg-blue-500 bg-opacity-15 text-blue-700"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewEvent(event);
                    }}
                  >
                    {event.type === 'encounter' ? (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{event.details?.encounterType || 'Rapporto'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Beaker className="h-3 w-3" />
                        <span>{event.details?.testType || 'Test'}</span>
                      </div>
                    )}
                  </div>
                ))}
                {dateEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dateEvents.length - 2} altri
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: it })}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && isFutureDate(selectedDate) 
                ? "Pianifica un nuovo test per questa data" 
                : "Scegli cosa vuoi aggiungere per questa data"}
            </DialogDescription>
          </DialogHeader>
          
          <div className={cn(
            "grid gap-4 mt-4",
            selectedDate && isFutureDate(selectedDate) ? "grid-cols-1" : "grid-cols-2"
          )}>
            {selectedDate && !isFutureDate(selectedDate) && (
              <Button 
                className="flex items-center gap-2 h-auto py-4"
                onClick={navigateToEncounterForm}
              >
                <Heart className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Rapporto</div>
                  <div className="text-xs text-muted-foreground">Registra un nuovo rapporto</div>
                </div>
              </Button>
            )}
            
            <Button
              variant={selectedDate && isFutureDate(selectedDate) ? "default" : "outline"}
              className="flex items-center gap-2 h-auto py-4"
              onClick={navigateToTestForm}
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
    </div>
  );
};

export default CalendarComponent;
