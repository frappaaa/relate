
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
  coordinates?: [number, number]; // [latitude, longitude]
}

const testLocations: TestLocation[] = [
  {
    id: '1',
    name: 'Centro Medico Salute',
    address: 'Via Roma 123',
    city: 'Milano',
    testTypes: ['HIV', 'Clamidia', 'Gonorrea'],
    distance: '1.2 km',
    coordinates: [45.464664, 9.188540],
  },
  {
    id: '2',
    name: 'Laboratorio Analisi Moderno',
    address: 'Corso Italia 45',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'HPV'],
    distance: '2.5 km',
    coordinates: [45.458309, 9.186477],
  },
  {
    id: '3',
    name: 'Ospedale San Raffaele',
    address: 'Via Olgettina 60',
    city: 'Milano', 
    testTypes: ['HIV', 'Epatite B', 'Epatite C', 'Clamidia', 'Gonorrea', 'Sifilide'],
    distance: '5.8 km',
    coordinates: [45.505855, 9.264530],
  },
  {
    id: '4',
    name: 'Centro IST AIED',
    address: 'Via Vitruvio 42',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'Gonorrea', 'Clamidia'],
    distance: '3.1 km',
    coordinates: [45.484173, 9.204326],
  },
  {
    id: '5',
    name: 'Poliambulatorio San Donato',
    address: 'Piazza Bobbio 1',
    city: 'San Donato Milanese',
    testTypes: ['HIV', 'HPV'],
    distance: '7.4 km',
    coordinates: [45.418697, 9.268297],
  },
];

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>(testLocations);
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = testLocations.filter(
      location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.testTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredLocations(filtered);
  };

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const findNearMe = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Errore",
        description: "La geolocalizzazione non è supportata dal tuo browser.",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        // Calculate distance for each location
        const locationsWithDistance = testLocations.map(location => {
          if (!location.coordinates) return location;
          
          const distance = calculateDistance(
            userLat, 
            userLon, 
            location.coordinates[0], 
            location.coordinates[1]
          );
          
          return {
            ...location,
            distance: formatDistance(distance)
          };
        });
        
        // Sort by distance
        const sortedLocations = [...locationsWithDistance].sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          return parseFloat(a.distance) - parseFloat(b.distance);
        });
        
        setFilteredLocations(sortedLocations);
        setIsLocating(false);
        
        toast({
          title: "Posizione rilevata",
          description: "I centri sono stati ordinati in base alla distanza da te.",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Si è verificato un errore durante il rilevamento della posizione.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "L'accesso alla posizione è stato negato.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informazioni sulla posizione non disponibili.";
            break;
          case error.TIMEOUT:
            errorMessage = "Richiesta di posizione scaduta.";
            break;
        }
        
        toast({
          title: "Errore",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dove fare i test</h1>
        <p className="text-muted-foreground">Trova centri medici e laboratori vicino a te</p>
      </section>

      <div className="h-[300px] rounded-xl bg-gray-100 relative overflow-hidden mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Mappa dei centri di test</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button 
            size="sm" 
            variant="secondary" 
            className="shadow-md"
            onClick={findNearMe}
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Localizzando...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Trova vicino a me
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Cerca per nome, indirizzo o tipo di test"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-4">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{location.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {location.address}, {location.city}
                    </CardDescription>
                  </div>
                  {location.distance && (
                    <Badge variant="outline" className="ml-2">
                      {location.distance}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {location.testTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(location.id)}
                >
                  Vedi dettagli
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessun risultato trovato</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLocationsPage;
