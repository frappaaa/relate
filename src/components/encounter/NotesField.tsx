
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
          <FormLabel>Note (opzionale)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Aggiungi note o osservazioni..."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Le note sono private e visibili solo a te
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
