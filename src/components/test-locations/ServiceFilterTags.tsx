
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface ServiceFilterTagsProps {
  availableServices: string[];
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
}

const ServiceFilterTags: React.FC<ServiceFilterTagsProps> = ({
  availableServices,
  selectedServices,
  onServiceToggle,
}) => {
  if (!availableServices.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filtra per servizi:</span>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2 p-1">
          {availableServices.map((service) => {
            const isSelected = selectedServices.includes(service);
            return (
              <Badge
                key={service}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1"
                onClick={() => onServiceToggle(service)}
              >
                {service}
              </Badge>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServiceFilterTags;
