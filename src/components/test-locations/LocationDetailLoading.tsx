
import React from 'react';
import { Loader2 } from 'lucide-react';

const LocationDetailLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Caricamento dettagli...</p>
    </div>
  );
};

export default LocationDetailLoading;
