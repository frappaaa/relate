
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (!availableServices.length) return null;
  
  return (
    <div className="relative mb-6 mx-auto max-w-4xl">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10 hover:bg-gray-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      
      <div className="mx-6 overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex space-x-2 p-1 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableServices.map(service => {
            const isSelected = selectedServices.includes(service);
            return (
              <Badge 
                key={service} 
                variant={isSelected ? "default" : "outline"} 
                className={`cursor-pointer transition-colors px-4 py-2 text-sm whitespace-nowrap flex-shrink-0 ${
                  isSelected 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-white hover:bg-gray-50 border"
                }`}
                onClick={() => onServiceToggle(service)}
              >
                {service}
              </Badge>
            );
          })}
        </div>
      </div>
      
      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10 hover:bg-gray-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ServiceFilterTags;
