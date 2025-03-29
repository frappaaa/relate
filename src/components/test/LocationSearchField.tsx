
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchLocations, TestLocation } from '@/services/locationService';

interface LocationSearchFieldProps {
  form: UseFormReturn<FormData>;
}

const LocationSearchField: React.FC<LocationSearchFieldProps> = ({ form }) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<TestLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const value = form.watch('location') || '';

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const fetchedLocations = await fetchLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const filteredLocations = searchQuery 
    ? locations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : locations;

  const handleSelect = (currentValue: string) => {
    if (currentValue === value) {
      form.setValue('location', '');
    } else {
      form.setValue('location', currentValue);
    }
    setOpen(false);
  };

  const handleInputChange = (input: string) => {
    setSearchQuery(input);
    // If user is typing, update the form value
    form.setValue('location', input);
  };

  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Luogo del test</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between h-10 font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(!open)}
                >
                  {field.value || "Inserisci il nome del centro medico o laboratorio"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Cerca un centro..." 
                  value={searchQuery}
                  onValueChange={handleInputChange}
                  className="h-9"
                />
                {isLoading ? (
                  <div className="py-6 text-center text-sm">Caricamento...</div>
                ) : (
                  <>
                    <CommandEmpty>Nessun risultato. Continua a digitare per aggiungere un nuovo luogo.</CommandEmpty>
                    {filteredLocations.length > 0 && (
                      <CommandGroup heading="Centri disponibili">
                        {filteredLocations.slice(0, 5).map((location) => (
                          <CommandItem
                            key={location.id}
                            value={location.name}
                            onSelect={() => handleSelect(location.name)}
                            className="flex items-center"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === location.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div>
                              <p>{location.name}</p>
                              <p className="text-xs text-muted-foreground">{location.address}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Dove hai fatto o farai il test
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationSearchField;
