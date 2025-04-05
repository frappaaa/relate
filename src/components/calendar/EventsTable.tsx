
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Beaker } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';

export interface CalendarEvent {
  id: string;
  date: Date;
  type: 'encounter' | 'test';
  details?: {
    encounterType?: string;
    customName?: string;
    risk?: 'low' | 'medium' | 'high';
    testType?: string;
    result?: string;
    status?: string;
  };
}

interface EventsTableProps {
  events: CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, onViewEvent, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">Nessun evento da visualizzare</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Evento</TableHead>
          <TableHead>Stato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
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
        ))}
      </TableBody>
    </Table>
  );
};

export default EventsTable;
