
import React from 'react';
import { format, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarEvent } from '@/types/calendar';

interface WeekDaysProps {
  daysInWeek: Date[];
  getEventsForDay: (date: Date) => CalendarEvent[];
  handleDateClick: (date: Date) => void;
  isLoading?: boolean;
}

const WeekDays: React.FC<WeekDaysProps> = ({
  daysInWeek,
  getEventsForDay,
  handleDateClick,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-4 w-8 mb-1" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
              onClick={() => handleDateClick(date)}
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
  );
};

export default WeekDays;
