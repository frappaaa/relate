
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import { Input } from '@/components/ui/input';

interface LocationFieldProps {
  form: UseFormReturn<FormData>;
}

const LocationField: React.FC<LocationFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Luogo del test</FormLabel>
          <FormControl>
            <Input 
              placeholder="Inserisci il nome del centro medico o laboratorio" 
              {...field}
            />
          </FormControl>
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
