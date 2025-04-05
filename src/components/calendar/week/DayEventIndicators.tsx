
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import EventIndicator from './EventIndicator';

interface DayEventIndicatorsProps {
  events: CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
}

const DayEventIndicators: React.FC<DayEventIndicatorsProps> = ({ events, onViewEvent }) => {
  if (events.length === 0) {
    return <div className="h-2"></div>;
  }

  // Only show first 3 events with a +n indicator if there are more
  const visibleEvents = events.slice(0, 3);
  const hasMoreEvents = events.length > 3;
  const remainingCount = events.length - 3;

  return (
    <div className="flex gap-1">
      {visibleEvents.map((event) => (
        <EventIndicator
          key={event.id}
          event={event}
          onClick={(e) => {
            e.stopPropagation();
            onViewEvent(event);
          }}
        />
      ))}
      
      {hasMoreEvents && (
        <div className="text-xs text-muted-foreground">+{remainingCount}</div>
      )}
    </div>
  );
};

export default DayEventIndicators;
