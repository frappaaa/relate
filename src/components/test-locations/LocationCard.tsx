
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
      className="p-4 hover:shadow-md transition-shadow cursor-pointer relative mb-3 border-gray-200" 
      onClick={() => handleViewDetails(id)}
    >
      <div className="pr-6">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-1 flex-wrap">
          <span className="truncate">
            {address}{city ? `, ${city}` : ''}
          </span>
          {distance && (
            <Badge variant="outline" className="ml-2 bg-gray-100 font-normal">
              {distance}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <Badge 
          variant="outline" 
          className="rounded-full px-3 border-red-200 bg-red-50 text-red-700"
        >
          {displayCategory}
        </Badge>
      </div>

      {/* Absolutely positioned chevron vertically centered */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <ChevronRight className="h-5 w-5 text-red-800" />
      </div>
    </Card>
  );
};

export default LocationCard;
