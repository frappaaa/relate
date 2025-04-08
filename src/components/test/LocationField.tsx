
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface LocationFieldProps {
  form: UseFormReturn<FormData>;
}

const LocationField: React.FC<LocationFieldProps> = ({ form }) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<{ id: string; name: string; address?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const value = form.watch('location') || '';

  // Fetch locations when search query changes
  useEffect(() => {
    if (!open || !searchQuery || searchQuery.length < 2) return;
    
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('test_locations')
          .select('id, name, address')
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .limit(5);
        
        if (error) throw error;
        
        setLocations(data || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLocations();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  const handleSelect = (currentValue: string) => {
    form.setValue('location', currentValue);
    setOpen(false);
  };

  const handleInputChange = (input: string) => {
    setSearchQuery(input);
    form.setValue('location', input);
  };

  // Reset locations when popover closes to prevent stale data
  useEffect(() => {
    if (!open) {
      // Small delay to prevent flickering during animations
      const timer = setTimeout(() => {
        if (!open) setLocations([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

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
                >
                  {field.value || "Inserisci il nome del centro medico o laboratorio"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Ricerca in corso...
                </div>
              ) : (
                <Command>
                  <CommandInput 
                    placeholder="Cerca un centro..." 
                    value={searchQuery || field.value}
                    onValueChange={handleInputChange}
                  />
                  <CommandEmpty>
                    {searchQuery 
                      ? "Nessun risultato. Continua a digitare per inserire un nuovo luogo."
                      : "Inizia a digitare per cercare luoghi disponibili."}
                  </CommandEmpty>
                  {locations && locations.length > 0 && (
                    <CommandGroup heading="Centri disponibili">
                      {locations.map((location) => (
                        <CommandItem
                          key={location.id}
                          value={location.name}
                          onSelect={() => handleSelect(location.name)}
                        >
                          <div className="flex items-center">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === location.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div>
                              <p>{location.name}</p>
                              {location.address && (
                                <p className="text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1 inline-block" />
                                  {location.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </Command>
              )}
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

export default LocationField;
