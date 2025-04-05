
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import DayEventIndicators from './DayEventIndicators';

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
        
        return (
          <div 
            key={date.toString()}
            className="flex flex-col items-center"
          >
            <DayEventIndicators 
              events={dayEvents} 
              onViewEvent={onViewEvent} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default WeekEventIndicators;
