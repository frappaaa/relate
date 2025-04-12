
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationDetailBookButtonProps {
  onBookAppointment: () => void;
}

const LocationDetailBookButton: React.FC<LocationDetailBookButtonProps> = ({ 
  onBookAppointment 
}) => {
  return (
    <Button 
      onClick={onBookAppointment} 
      className="w-full mt-6"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Prenota un test
    </Button>
  );
};

export default LocationDetailBookButton;
