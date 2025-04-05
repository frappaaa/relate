
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import EventsTable, { CalendarEvent } from './EventsTable';
import TabFilter, { TabOption } from '@/components/ui/tab-filter';
import EventsHeader from './EventsHeader';

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
  const tabs: TabOption[] = [
    { value: 'all', label: 'Tutti' },
    { value: 'encounters', label: 'Rapporti' },
    { value: 'tests', label: 'Test' }
  ];

  return (
    <div className="mt-8">
      <EventsHeader title="Eventi" buttonPath="/app/new-encounter" />

      <TabFilter 
        activeTab={activeTab} 
        setActiveTab={(value) => setActiveTab(value as 'all' | 'encounters' | 'tests')}
        tabs={tabs}
      >
        <TabsContent value="all" className="mt-0">
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="encounters" className="mt-0">
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="tests" className="mt-0">
          <EventsTable events={events} onViewEvent={onViewEvent} isLoading={isLoading} />
        </TabsContent>
      </TabFilter>
    </div>
  );
};

export default CalendarTabsFilter;
