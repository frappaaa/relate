
import React from 'react';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/utils/riskCalculator';
import { CalendarEvent } from '@/types/calendar';

interface WeekEventIndicatorsProps {
  daysInWeek: Date[];
  getEventsForDay: (date: Date) => CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
}

const WeekEventIndicators: React.FC<WeekEventIndicatorsProps> = ({
  daysInWeek,
  getEventsForDay,
  onViewEvent
}) => {
  return (
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
  );
};

export default WeekEventIndicators;
