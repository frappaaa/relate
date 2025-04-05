
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarEvent } from '@/types/calendar';
import { useWeekCalendar } from './week/useWeekCalendar';
import WeekHeader from './week/WeekHeader';
import WeekDays from './week/WeekDays';
import WeekEventIndicators from './week/WeekEventIndicators';
import CalendarDialog from './CalendarDialog';

interface WeekCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  events,
  onAddEvent,
  onViewEvent,
  isLoading = false
}) => {
  const navigate = useNavigate();
  
  const {
    currentDate,
    selectedDate,
    isDialogOpen,
    setIsDialogOpen,
    nextWeek,
    prevWeek,
    daysInWeek,
    getEventsForDay,
    handleDateClick,
    handleNavigateToEncounter,
    handleNavigateToTest
  } = useWeekCalendar(events, onViewEvent, navigate);

  return (
    <div className="w-full">
      <WeekHeader
        currentDate={currentDate}
        nextWeek={nextWeek}
        prevWeek={prevWeek}
        isLoading={isLoading}
      />

      <WeekDays
        daysInWeek={daysInWeek}
        getEventsForDay={getEventsForDay}
        handleDateClick={handleDateClick}
        isLoading={isLoading}
      />

      {/* Event indicators */}
      {!isLoading && (
        <WeekEventIndicators
          daysInWeek={daysInWeek}
          getEventsForDay={getEventsForDay}
          onViewEvent={onViewEvent}
        />
      )}
      
      {/* Calendar Dialog */}
      <CalendarDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        isFutureDate={false} // Always false since we only show this for non-future dates
        onNavigateToEncounter={handleNavigateToEncounter}
        onNavigateToTest={handleNavigateToTest}
      />
    </div>
  );
};

export default WeekCalendar;
