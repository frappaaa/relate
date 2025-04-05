
import React from 'react';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/utils/riskCalculator';
import { CalendarEvent } from '@/types/calendar';

interface EventIndicatorProps {
  event: CalendarEvent;
  onClick: (event: React.MouseEvent) => void;
}

const EventIndicator: React.FC<EventIndicatorProps> = ({ event, onClick }) => {
  const indicatorColor = event.type === 'encounter'
    ? getRiskColor(event.details?.risk || 'low')
    : "bg-blue-500";

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full cursor-pointer",
        indicatorColor
      )}
      onClick={onClick}
    />
  );
};

export default EventIndicator;
