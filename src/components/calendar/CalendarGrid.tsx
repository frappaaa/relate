
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { CalendarDayEvent } from './CalendarDayEvent';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  events,
  onDateClick,
  onViewEvent,
}) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = getDay(startOfMonth(currentMonth));

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  return (
    <>
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
              onClick={() => onDateClick(date)}
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
                  <CalendarDayEvent 
                    key={event.id} 
                    event={event} 
                    onClick={() => onViewEvent(event)} 
                  />
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
    </>
  );
};

export default CalendarGrid;
