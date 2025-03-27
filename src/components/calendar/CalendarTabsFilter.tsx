
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventsTable, { CalendarEvent } from './EventsTable';

interface CalendarTabsFilterProps {
  activeTab: 'all' | 'encounters' | 'tests';
  setActiveTab: (value: 'all' | 'encounters' | 'tests') => void;
  events: CalendarEvent[];
  onViewEvent: (event: CalendarEvent) => void;
  isLoading: boolean;
}

const CalendarTabsFilter: React.FC<CalendarTabsFilterProps> = ({
  activeTab,
  setActiveTab,
  events,
  onViewEvent,
  isLoading
}) => {
  const navigate = useNavigate();

  return (
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
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="encounters" className="mt-0">
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="tests" className="mt-0">
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarTabsFilter;
