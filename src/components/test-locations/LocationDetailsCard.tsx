
import React from 'react';
import { Phone, MapPin, Clock, Calendar, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LocationDetailsCardProps {
  location: {
    name: string;
    address: string;
    city: string;
    testTypes: string[];
    distance?: string;
    phone?: string;
    website?: string;
    hours?: { day: string; hours: string }[];
    description?: string;
  };
  onBookAppointment: () => void;
}

const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({
  location,
  onBookAppointment,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-2">{location.name}</h2>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{location.address}, {location.city}</span>
          {location.distance && (
            <Badge variant="outline" className="ml-2">
              {location.distance}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          {location.description && (
            <div className="flex">
              <Info className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{location.description}</p>
            </div>
          )}

          {location.phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-gray-500" />
              <a href={`tel:${location.phone}`} className="text-sm text-primary hover:underline">
                {location.phone}
              </a>
            </div>
          )}

          {location.website && (
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-3 text-gray-500" />
              <a 
                href={location.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline"
              >
                Visita il sito web
              </a>
            </div>
          )}

          {location.hours && (
            <div className="flex">
              <Clock className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Orari di apertura:</p>
                <ul className="space-y-1">
                  {location.hours.map((timeSlot, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="mr-4 text-gray-600">{timeSlot.day}:</span>
                      <span>{timeSlot.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div>
          <p className="font-medium mb-2">Test disponibili:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {location.testTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={onBookAppointment} 
          className="w-full mt-2"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Prenota un test
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationDetailsCard;
