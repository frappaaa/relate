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
  onServiceToggle
}) => {
  if (!availableServices.length) return null;
  return <div className="mb-6">
      

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2 p-1">
          {availableServices.map(service => {
          const isSelected = selectedServices.includes(service);
          return <Badge key={service} variant={isSelected ? "default" : "outline"} className="cursor-pointer hover:bg-secondary/80 transition-colors px-3 py-1" onClick={() => onServiceToggle(service)}>
                {service}
              </Badge>;
        })}
        </div>
      </ScrollArea>
    </div>;
};
export default ServiceFilterTags;