
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormData } from './types';

interface CustomNameFieldProps {
  form: UseFormReturn<FormData>;
}

const CustomNameField: React.FC<CustomNameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="customName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome personalizzato (opzionale)</FormLabel>
          <FormControl>
            <Input
              placeholder="Inserisci un nome per questo rapporto"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomNameField;
