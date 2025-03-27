
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TestLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  testTypes: string[];
  distance?: string;
}

const testLocations: TestLocation[] = [
  {
    id: '1',
    name: 'Centro Medico Salute',
    address: 'Via Roma 123',
    city: 'Milano',
    testTypes: ['HIV', 'Clamidia', 'Gonorrea'],
    distance: '1.2 km',
  },
  {
    id: '2',
    name: 'Laboratorio Analisi Moderno',
    address: 'Corso Italia 45',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'HPV'],
    distance: '2.5 km',
  },
  {
    id: '3',
    name: 'Ospedale San Raffaele',
    address: 'Via Olgettina 60',
    city: 'Milano', 
    testTypes: ['HIV', 'Epatite B', 'Epatite C', 'Clamidia', 'Gonorrea', 'Sifilide'],
    distance: '5.8 km',
  },
  {
    id: '4',
    name: 'Centro IST AIED',
    address: 'Via Vitruvio 42',
    city: 'Milano',
    testTypes: ['HIV', 'Sifilide', 'Gonorrea', 'Clamidia'],
    distance: '3.1 km',
  },
  {
    id: '5',
    name: 'Poliambulatorio San Donato',
    address: 'Piazza Bobbio 1',
    city: 'San Donato Milanese',
    testTypes: ['HIV', 'HPV'],
    distance: '7.4 km',
  },
];

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<TestLocation[]>(testLocations);
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
          <Button size="sm" variant="secondary" className="shadow-md">
            <MapPin className="mr-2 h-4 w-4" />
            Trova vicino a me
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
