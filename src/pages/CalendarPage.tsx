
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeekCalendar from '@/components/WeekCalendar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { Heart, Beaker, Plus } from 'lucide-react';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';

// Define the type to match Calendar component's expected type
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

// Mock data for the calendar with correct type annotation
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    date: new Date(2023, 9, 10), // October 10, 2023
    type: 'encounter',
    details: {
      encounterType: 'Orale',
      risk: 'low',
    },
  },
  {
    id: '2',
    date: new Date(2023, 9, 15), // October 15, 2023
    type: 'test',
    details: {
      testType: 'Test completo',
      result: 'Negativo',
    },
  },
  {
    id: '3',
    date: new Date(2023, 9, 22), // October 22, 2023
    type: 'encounter',
    details: {
      encounterType: 'Vaginale',
      risk: 'medium',
    },
  },
];

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [activeTab, setActiveTab] = useState<'all' | 'encounters' | 'tests'>('all');

  const handleAddEvent = (date: Date) => {
    navigate(`/app/new-encounter?date=${date.toISOString()}`);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    if (event.type === 'encounter') {
      alert(`Dettagli rapporto: ${event.details?.encounterType} - Rischio: ${event.details?.risk}`);
    } else {
      alert(`Dettagli test: ${event.details?.testType} - Risultato: ${event.details?.result || 'In attesa'}`);
    }
  };

  // Filter events based on the active tab
  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'encounters') return event.type === 'encounter';
    if (activeTab === 'tests') return event.type === 'test';
    return true;
  });

  // Sort events by date (most recent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Visualizza e gestisci i tuoi rapporti e test</p>
      </section>

      <WeekCalendar
        events={events}
        onAddEvent={handleAddEvent}
        onViewEvent={handleViewEvent}
      />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Eventi</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/app/new-encounter')}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Nuovo</span>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tutti</TabsTrigger>
            <TabsTrigger value="encounters">Rapporti</TabsTrigger>
            <TabsTrigger value="tests">Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
          
          <TabsContent value="encounters" className="mt-0">
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
          
          <TabsContent value="tests" className="mt-0">
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface EventsTableProps {
  events: CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, onViewEvent }) => {
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
          <TableHead>Tipo</TableHead>
          <TableHead>Dettagli</TableHead>
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
            <TableCell>
              {event.type === 'encounter' ? (
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span>Rapporto</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Beaker className="h-4 w-4 text-blue-500" />
                  <span>Test</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              {event.type === 'encounter' ? event.details?.encounterType : event.details?.testType}
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

export default CalendarPage;
