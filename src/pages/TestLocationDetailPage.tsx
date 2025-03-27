
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Calendar, Info, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  phone?: string;
  website?: string;
  hours?: { day: string; hours: string }[];
  description?: string;
  coordinates?: [number, number];
}

const TestLocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState<TestLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://script.google.com/macros/s/AKfycbyY_by3TUuC9f771RqXfBarbTDxDEIp9BFbqbtqtoU/dev');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const foundLocation = data.find((loc: any) => loc.id === id);
        
        if (foundLocation) {
          // Transform to match our interface
          setLocation({
            id: foundLocation.id,
            name: foundLocation.name,
            address: foundLocation.address,
            city: foundLocation.city,
            testTypes: foundLocation.testTypes || [],
            phone: foundLocation.phone,
            website: foundLocation.website,
            hours: foundLocation.hours,
            description: foundLocation.description,
            coordinates: foundLocation.coordinates
          });
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei dettagli del centro.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLocationDetails();
    }
  }, [id, toast]);

  const handleBookAppointment = () => {
    toast({
      title: "Prenotazione test",
      description: `Hai prenotato un test presso ${location?.name}`,
    });
    // In a real app, this would navigate to a booking form or calendar
    navigate('/app/calendar');
  };

  const handleBack = () => {
    navigate('/app/test-locations');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Caricamento dettagli...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-muted-foreground mb-4">Centro test non trovato</p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          size="sm" 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Dettaglio centro</h1>
      </div>

      {/* Map placeholder */}
      <div className="h-[200px] rounded-xl bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* Location info */}
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
            onClick={handleBookAppointment} 
            className="w-full mt-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Prenota un test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestLocationDetailPage;
