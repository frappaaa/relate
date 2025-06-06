
import React from 'react';
import { Heart, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/utils/riskCalculator';
import { CalendarEvent } from '@/types/calendar';

interface CalendarDayEventProps {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent) => void;
}

export const CalendarDayEvent: React.FC<CalendarDayEventProps> = ({ event, onClick }) => {
  // Determine event name, prioritizing customName for encounters
  const eventName = event.type === 'encounter' 
    ? (event.details?.customName || event.details?.encounterType || 'Rapporto')
    : (event.details?.testType || 'Test');
    
  return (
    <div
      className={cn(
        "text-xs rounded-sm px-1.5 py-0.5 truncate",
        event.type === 'encounter' ? 
          `bg-opacity-20 ${getRiskColor(event.details?.risk || 'low')} bg-opacity-15` : 
          "bg-blue-500 bg-opacity-15 text-blue-700"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      {event.type === 'encounter' ? (
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          <span className="truncate max-w-[80px]">{eventName}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Beaker className="h-3 w-3" />
          <span className="truncate max-w-[80px]">{eventName}</span>
        </div>
      )}
    </div>
  );
};
