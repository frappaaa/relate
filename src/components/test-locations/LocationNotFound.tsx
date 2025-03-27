
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationNotFoundProps {
  onBack: () => void;
}

const LocationNotFound: React.FC<LocationNotFoundProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <p className="text-muted-foreground mb-4">Centro test non trovato</p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Torna alla lista
      </Button>
    </div>
  );
};

export default LocationNotFound;
