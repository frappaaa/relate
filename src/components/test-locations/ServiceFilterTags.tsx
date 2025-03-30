
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServiceFilterTagsProps {
  availableServices: string[];
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
  isCategories?: boolean;
}

const ServiceFilterTags: React.FC<ServiceFilterTagsProps> = ({
  availableServices,
  selectedServices,
  onServiceToggle,
  isCategories = false
}) => {
  if (!availableServices.length) {
    return null;
  }

  return (
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="flex space-x-2 pb-2 min-w-max">
        {availableServices.map((service) => (
          <Badge
            key={service}
            variant="outline"
            className={`
              cursor-pointer px-3 py-1 rounded-full text-sm transition-all whitespace-nowrap
              ${selectedServices.includes(service)
                ? 'bg-red-100 border-red-200 text-red-800 hover:bg-red-200'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}
            `}
            onClick={() => onServiceToggle(service)}
          >
            {service}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ServiceFilterTags;
