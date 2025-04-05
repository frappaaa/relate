
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Heart, Beaker } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';
import { CalendarEvent } from '@/types/calendar';

interface EventRowProps {
  event: CalendarEvent;
  onViewEvent: (event: CalendarEvent) => void;
}

const EventRow: React.FC<EventRowProps> = ({ event, onViewEvent }) => {
  return (
    <TableRow 
      key={event.id}
      className="cursor-pointer hover:bg-secondary/20"
      onClick={() => onViewEvent(event)}
    >
      <TableCell>{formatDate(event.date)}</TableCell>
      <TableCell className="max-w-[250px]">
        <div className="flex items-center gap-2">
          {event.type === 'encounter' ? (
            <Heart className="h-4 w-4 text-pink-500 flex-shrink-0" />
          ) : (
            <Beaker className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
          <span className="truncate">
            {event.type === 'encounter' 
              ? (event.details?.customName || event.details?.encounterType || 'Rapporto')
              : (event.details?.testType || 'Test')
            }
          </span>
        </div>
      </TableCell>
      <TableCell>
        {event.type === 'encounter' ? (
          <Badge 
            variant="outline" 
            className={`${getRiskColor(event.details?.risk || 'low')} bg-opacity-15`}
          >
            {getRiskLabel(event.details?.risk || 'low')}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-500 bg-opacity-15 text-blue-700">
            {event.details?.result || 'In attesa'}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EventRow;
