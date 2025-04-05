
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import EventRow from './EventRow';
import EventsTableLoading from './EventsTableLoading';
import EventsEmptyState from './EventsEmptyState';
import { CalendarEvent } from '@/types/calendar';

interface EventsTableProps {
  events: CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

const EventsTable: React.FC<EventsTableProps> = ({ 
  events, 
  onViewEvent, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <EventsTableLoading />;
  }

  if (events.length === 0) {
    return <EventsEmptyState />;
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
          <EventRow 
            key={event.id} 
            event={event} 
            onViewEvent={onViewEvent} 
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default EventsTable;
