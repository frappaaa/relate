
import React from 'react';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-wrap gap-2">
      {availableServices.map((service) => (
        <Badge
          key={service}
          variant="outline"
          className={`
            cursor-pointer px-3 py-1 rounded-full text-sm transition-all
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
  );
};

export default ServiceFilterTags;
