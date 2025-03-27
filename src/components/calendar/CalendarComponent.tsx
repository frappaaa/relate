
import React, { useState } from 'react';
import { addMonths, subMonths, startOfDay, isAfter } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarDialog from './CalendarDialog';

interface CalendarComponentProps {
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onAddEvent,
  onViewEvent,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = startOfDay(new Date());

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const isFutureDate = (date: Date) => {
    return isAfter(startOfDay(date), today);
  };

  const navigateToEncounterForm = () => {
    if (selectedDate) {
      window.location.href = `/app/new-encounter?date=${selectedDate.toISOString()}`;
      setIsDialogOpen(false);
    }
  };

  const navigateToTestForm = () => {
    if (selectedDate) {
      window.location.href = `/app/new-test?date=${selectedDate.toISOString()}`;
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <CalendarHeader 
        currentMonth={currentMonth} 
        onPrevMonth={prevMonth} 
        onNextMonth={nextMonth} 
      />

      <CalendarGrid 
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        events={events}
        onDateClick={handleDateClick}
        onViewEvent={onViewEvent}
      />

      <CalendarDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        isFutureDate={selectedDate ? isFutureDate(selectedDate) : false}
        onNavigateToEncounter={navigateToEncounterForm}
        onNavigateToTest={navigateToTestForm}
      />
    </div>
  );
};

export default CalendarComponent;
