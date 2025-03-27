
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface ResultFieldProps {
  form: UseFormReturn<FormData>;
  isVisible: boolean;
}

const ResultField: React.FC<ResultFieldProps> = ({ form, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <FormField
      control={form.control}
      name="result"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Risultato</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il risultato" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="pending">In attesa</SelectItem>
              <SelectItem value="negative">Negativo</SelectItem>
              <SelectItem value="positive">Positivo</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Il risultato del test (solo se già completato)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResultField;
