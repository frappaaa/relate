
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface EncounterTypeFieldProps {
  form: UseFormReturn<FormData>;
}

const EncounterTypeField: React.FC<EncounterTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di rapporto</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il tipo di rapporto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="oral">Orale</SelectItem>
                <SelectItem value="vaginal">Vaginale</SelectItem>
                <SelectItem value="anal">Anale</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormDescription>
            Il tipo di rapporto è importante per valutare il rischio
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EncounterTypeField;
