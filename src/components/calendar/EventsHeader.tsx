
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventsHeaderProps {
  title: string;
  buttonLabel?: string;
  buttonPath?: string;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({
  title,
  buttonLabel = "Nuovo",
  buttonPath = "/app/new-encounter"
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(buttonPath)}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>{buttonLabel}</span>
      </Button>
    </div>
  );
};

export default EventsHeader;
