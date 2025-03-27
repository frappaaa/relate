
import React, { useState } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  isToday 
} from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Heart, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/utils/riskCalculator';
import { Skeleton } from '@/components/ui/skeleton';

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

interface WeekCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  events,
  onAddEvent,
  onViewEvent,
  isLoading = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {format(weekStart, 'd', { locale: it }) + ' - ' + format(weekEnd, 'd MMMM yyyy', { locale: it })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {daysInWeek.map((date) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentDay = isToday(date);

          return (
            <div 
              key={date.toString()}
              className="flex flex-col items-center"
            >
              <div className="text-xs text-muted-foreground mb-1">
                {format(date, 'EEE', { locale: it })}
              </div>
              <button
                onClick={() => onAddEvent(date)}
                className={cn(
                  "flex flex-col items-center justify-center w-10 h-10 rounded-full",
                  isCurrentDay ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                <span className="text-sm font-medium">{format(date, 'd')}</span>
              </button>
              {dayEvents.length > 0 && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {dayEvents.length}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Event indicators */}
      <div className="grid grid-cols-7 gap-2">
        {daysInWeek.map((date) => {
          const dayEvents = getEventsForDay(date);
          
          if (dayEvents.length === 0) return (
            <div key={date.toString()} className="h-2"></div>
          );

          return (
            <div 
              key={date.toString()}
              className="flex flex-col items-center"
            >
              <div className="flex gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "h-2 w-2 rounded-full cursor-pointer",
                      event.type === 'encounter' 
                        ? getRiskColor(event.details?.risk || 'low')
                        : "bg-blue-500"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewEvent(event);
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
