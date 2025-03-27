
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from '@/components/Calendar';

// Define the type to match CalendarComponent's expected type
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

  const handleAddEvent = (date: Date) => {
    // In a real app, you would navigate to a form or open a modal
    // For now, let's navigate to the NewEncounterPage with the date as query param
    navigate(`/app/new-encounter?date=${date.toISOString()}`);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    // In a real app, you would open a details view
    console.log('View event:', event);
    // For demonstration, just show an alert
    if (event.type === 'encounter') {
      alert(`Dettagli rapporto: ${event.details?.encounterType} - Rischio: ${event.details?.risk}`);
    } else {
      alert(`Dettagli test: ${event.details?.testType} - Risultato: ${event.details?.result || 'In attesa'}`);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Visualizza e gestisci i tuoi rapporti e test</p>
      </section>

      <CalendarComponent 
        events={events} 
        onAddEvent={handleAddEvent} 
        onViewEvent={handleViewEvent} 
      />
    </div>
  );
};

export default CalendarPage;
