
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  handleViewDetails: (locationId: string) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  id,
  name,
  address,
  city,
  testTypes,
  distance,
  handleViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="mt-1">
              {address}{city ? `, ${city}` : ''}
            </CardDescription>
          </div>
          {distance && (
            <Badge variant="outline" className="ml-2">
              {distance}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {testTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>
        <Button 
          className="mt-4" 
          variant="outline" 
          size="sm"
          onClick={() => handleViewDetails(id)}
        >
          Vedi dettagli
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
