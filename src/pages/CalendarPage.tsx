
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeekCalendar from '@/components/WeekCalendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import EventsTable from '@/components/calendar/EventsTable';
import CalendarTabsFilter from '@/components/calendar/CalendarTabsFilter';
import { CalendarEvent } from '@/types/calendar';

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
        .select('id, date, encounter_type, risk_level, notes, encounter_name')
        .eq('user_id', user.id);

      if (encountersError) {
        console.error('Error fetching encounters:', encountersError);
        throw encountersError;
      }

      // Fetch tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('id, date, test_type, result, status')
        .eq('user_id', user.id);

      if (testsError) throw testsError;

      // Format encounters as CalendarEvents
      const encounterEvents: CalendarEvent[] = encounters ? encounters.map(encounter => {
        const encounterType = encounter.encounter_type.includes(',') 
          ? encounter.encounter_type.split(',').map(type => {
              if (type === 'oral') return 'Orale';
              if (type === 'vaginal') return 'Vaginale';
              if (type === 'anal') return 'Anale';
              return type;
            }).join(', ')
          : encounter.encounter_type === 'oral' ? 'Orale' :
            encounter.encounter_type === 'vaginal' ? 'Vaginale' :
            encounter.encounter_type === 'anal' ? 'Anale' : 'Rapporto';

        return {
          id: encounter.id,
          date: new Date(encounter.date),
          type: 'encounter',
          details: {
            encounterType,
            customName: encounter.encounter_name || null,
            risk: encounter.risk_level
          }
        };
      }) : [];

      // Format tests as CalendarEvents
      const testEvents: CalendarEvent[] = tests ? tests.map(test => ({
        id: test.id,
        date: new Date(test.date),
        type: 'test',
        details: {
          testType: test.test_type,
          result: test.result,
          status: test.status
        }
      })) : [];

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

  // This function is no longer used directly by WeekCalendar
  // but we keep it for compatibility with other components
  const handleAddEvent = (date: Date) => {
    navigate(`/app/new-encounter?date=${date.toISOString()}`);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    if (event.type === 'encounter') {
      navigate(`/app/encounter/${event.id}`);
    } else {
      navigate(`/app/test/${event.id}`);
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

      <CalendarTabsFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        events={sortedEvents}
        onViewEvent={handleViewEvent}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CalendarPage;
