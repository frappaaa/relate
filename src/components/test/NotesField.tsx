
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface NotesFieldProps {
  form: UseFormReturn<FormData>;
}

const NotesField: React.FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base md:text-sm">Note (opzionale)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Aggiungi note o osservazioni sul test..."
              className="resize-none text-base md:text-sm"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription className="text-sm">
            Le note sono private e visibili solo a te
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
