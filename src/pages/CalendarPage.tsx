
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
    status?: string;
  };
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'encounters' | 'tests'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch encounters
      const { data: encounters, error: encountersError } = await supabase
        .from('encounters')
        .select('id, date, encounter_type, risk_level, notes')
        .eq('user_id', user.id);

      if (encountersError) throw encountersError;

      // Fetch tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('id, date, test_type, result, status')
        .eq('user_id', user.id);

      if (testsError) throw testsError;

      // Format encounters as CalendarEvents
      const encounterEvents: CalendarEvent[] = encounters.map(encounter => ({
        id: encounter.id,
        date: new Date(encounter.date),
        type: 'encounter',
        details: {
          encounterType: encounter.encounter_type === 'oral' ? 'Orale' :
                          encounter.encounter_type === 'vaginal' ? 'Vaginale' :
                          encounter.encounter_type === 'anal' ? 'Anale' : 'Altro',
          risk: encounter.risk_level
        }
      }));

      // Format tests as CalendarEvents
      const testEvents: CalendarEvent[] = tests.map(test => ({
        id: test.id,
        date: new Date(test.date),
        type: 'test',
        details: {
          testType: test.test_type,
          result: test.result,
          status: test.status
        }
      }));

      // Combine all events
      setEvents([...encounterEvents, ...testEvents]);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento degli eventi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = (date: Date) => {
    navigate(`/app/new-encounter?date=${date.toISOString()}`);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    if (event.type === 'encounter') {
      alert(`Dettagli rapporto: ${event.details?.encounterType} - Rischio: ${event.details?.risk}`);
    } else {
      alert(`Dettagli test: ${event.details?.testType} - Stato: ${event.details?.status} - Risultato: ${event.details?.result || 'In attesa'}`);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // Set up realtime subscription for encounters and tests
    if (user) {
      const eventsChannel = supabase
        .channel('calendar-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'encounters',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchEvents();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tests',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchEvents();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(eventsChannel);
      };
    }
  }, [user]);

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

  if (!user) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">Accedi per visualizzare i tuoi eventi</p>
        </section>
      </div>
    );
  }

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
        isLoading={isLoading}
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
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="encounters" className="mt-0">
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="tests" className="mt-0">
            <EventsTable events={sortedEvents} onViewEvent={handleViewEvent} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

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
              <TableHead>Tipo</TableHead>
              <TableHead>Dettagli</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
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
