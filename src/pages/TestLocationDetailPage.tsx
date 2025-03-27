
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Calendar, Info, ArrowLeft, ExternalLink } from 'lucide-react';
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
}

// Mock data - in a real app, this would come from an API
const testLocationsData: TestLocation[] = [
  {
    id: '1',
    name: 'Centro Medico Salute',
    address: 'Via Roma 123',
    city: 'Milano',
    testTypes: ['HIV', 'Clamidia', 'Gonorrea'],
    distance: '1.2 km',
    phone: '+39 02 1234567',
    website: 'https://centromedicosalute.it',
    hours: [
      { day: 'Lunedì - Venerdì', hours: '9:00 - 18:00' },
      { day: 'Sabato', hours: '9:00 - 12:00' },
      { day: 'Domenica', hours: 'Chiuso' }
    ],
    description: 'Centro specializzato in test per malattie sessualmente trasmissibili con personale qualificato e risultati in 24-48 ore.'
  },
  {
    id: '2',
    name: 'Laboratorio Analisi Moderno',
    address: 'Corso Italia 45',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'HPV'],
    distance: '2.5 km',
    phone: '+39 02 7654321',
    website: 'https://labmoderno.it',
    hours: [
      { day: 'Lunedì - Venerdì', hours: '8:30 - 19:00' },
      { day: 'Sabato', hours: '8:30 - 12:30' },
      { day: 'Domenica', hours: 'Chiuso' }
    ],
    description: 'Laboratorio di analisi con apparecchiature all\'avanguardia e personale altamente qualificato per test IST completi.'
  },
  {
    id: '3',
    name: 'Ospedale San Raffaele',
    address: 'Via Olgettina 60',
    city: 'Milano', 
    testTypes: ['HIV', 'Epatite B', 'Epatite C', 'Clamidia', 'Gonorrea', 'Sifilide'],
    distance: '5.8 km',
    phone: '+39 02 2643651',
    website: 'https://www.hsr.it',
    hours: [
      { day: 'Lunedì - Venerdì', hours: '7:00 - 19:00' },
      { day: 'Sabato', hours: '7:00 - 13:00' },
      { day: 'Domenica', hours: 'Chiuso' }
    ],
    description: 'Ospedale universitario con centro specializzato per malattie infettive e test completi per IST con consulenza medica.'
  },
  {
    id: '4',
    name: 'Centro IST AIED',
    address: 'Via Vitruvio 42',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'Gonorrea', 'Clamidia'],
    distance: '3.1 km',
    phone: '+39 02 8901234',
    website: 'https://aied-milano.it',
    hours: [
      { day: 'Lunedì - Giovedì', hours: '9:00 - 17:00' },
      { day: 'Venerdì', hours: '9:00 - 15:00' },
      { day: 'Sabato - Domenica', hours: 'Chiuso' }
    ],
    description: 'Centro specializzato in salute sessuale con test anonimi e supporto psicologico per persone con diagnosi positive.'
  },
  {
    id: '5',
    name: 'Poliambulatorio San Donato',
    address: 'Piazza Bobbio 1',
    city: 'San Donato Milanese',
    testTypes: ['HIV', 'HPV'],
    distance: '7.4 km',
    phone: '+39 02 5276890',
    website: 'https://poliambulatoriosandonato.it',
    hours: [
      { day: 'Lunedì - Venerdì', hours: '8:00 - 20:00' },
      { day: 'Sabato', hours: '8:00 - 13:00' },
      { day: 'Domenica', hours: 'Chiuso' }
    ],
    description: 'Poliambulatorio che offre test IST con consulenza specialistica e possibilità di prenotazione online.'
  },
];

const TestLocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState<TestLocation | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundLocation = testLocationsData.find(loc => loc.id === id);
    if (foundLocation) {
      setLocation(foundLocation);
    }
  }, [id]);

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
