
import { useState } from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  isAfter,
  startOfDay 
} from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

export const useWeekCalendar = (
  events: CalendarEvent[],
  onViewEvent: (event: CalendarEvent) => void,
  navigate: (url: string) => void
) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    const today = startOfDay(new Date());
    const isFutureDate = isAfter(startOfDay(date), today);
    
    if (isFutureDate) {
      navigate(`/app/new-test?date=${date.toISOString()}`);
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handleNavigateToEncounter = () => {
    if (selectedDate) {
      navigate(`/app/new-encounter?date=${selectedDate.toISOString()}`);
      setIsDialogOpen(false);
    }
  };

  const handleNavigateToTest = () => {
    if (selectedDate) {
      navigate(`/app/new-test?date=${selectedDate.toISOString()}`);
      setIsDialogOpen(false);
    }
  };

  return {
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
  };
};
