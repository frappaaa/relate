
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationDetailHeaderProps {
  onBack: () => void;
}

const LocationDetailHeader: React.FC<LocationDetailHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center">
      <Button 
        onClick={onBack} 
        variant="ghost" 
        size="sm" 
        className="mr-2"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">Dettaglio centro</h1>
    </div>
  );
};

export default LocationDetailHeader;
