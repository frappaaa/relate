
import React from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface WeekHeaderProps {
  currentDate: Date;
  nextWeek: () => void;
  prevWeek: () => void;
  isLoading?: boolean;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({
  currentDate,
  nextWeek,
  prevWeek,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    );
  }

  const weekStart = format(
    currentDate, 
    'd', 
    { locale: it }
  );
  
  const weekEnd = format(
    currentDate, 
    'd MMMM yyyy', 
    { locale: it }
  );

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">
        {weekStart + ' - ' + weekEnd}
      </h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeekHeader;
