
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface PartnerStatusFieldProps {
  form: UseFormReturn<FormData>;
}

const PartnerStatusField: React.FC<PartnerStatusFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="partnerStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stato del partner</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona lo stato del partner" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="unknown">Non noto</SelectItem>
              <SelectItem value="negative">Negativo (test recente)</SelectItem>
              <SelectItem value="positive">Positivo a IST</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Se conosci lo stato del partner, aiuta a valutare meglio il rischio
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PartnerStatusField;
