
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  handleViewDetails: (locationId: string) => void;
  category?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({
  id,
  name,
  address,
  city,
  testTypes,
  distance,
  handleViewDetails,
  category
}) => {
  // Use the category if available, otherwise fallback to the first test type
  const displayCategory = category || (testTypes && testTypes.length > 0 ? testTypes[0] : "Test");
  
  return (
    <Card 
      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer relative flex items-center border-none shadow-sm w-full box-border max-w-full" 
      onClick={() => handleViewDetails(id)}
    >
      <div className="space-y-1 flex-1 pr-6 min-w-0 w-full overflow-hidden">
        <h3 className="font-medium text-base truncate max-w-full">{name}</h3>
        <div className="flex items-center text-muted-foreground text-xs flex-wrap">
          <span className="truncate max-w-full">
            {address}{city ? `, ${city}` : ''}
          </span>
          {distance && 
            <Badge variant="outline" className="ml-2 bg-gray-100 text-xs font-normal px-1.5 py-0 h-5 shrink-0">
              {distance}
            </Badge>
          }
        </div>
        
        <div className="pt-1">
          <Badge variant="outline" className="rounded-full text-xs px-2 border-red-200 bg-red-50 text-red-700">
            {displayCategory}
          </Badge>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Card>
  );
};

export default LocationCard;
