
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface StatusFieldProps {
  form: UseFormReturn<FormData>;
}

const StatusField: React.FC<StatusFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Stato del test</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled">Programmato</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completato</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Seleziona se il test è già stato completato o è programmato per il futuro
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusField;
