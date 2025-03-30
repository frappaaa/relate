
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import BadgeSelector, { BadgeOption } from './BadgeSelector';

interface ProtectionLevelFieldProps {
  form: UseFormReturn<FormData>;
}

const protectionOptions: BadgeOption[] = [
  { id: "none", label: "Nessuna protezione" },
  { id: "partial", label: "Protezione parziale" },
  { id: "full", label: "Protezione completa" },
];

const ProtectionLevelField: React.FC<ProtectionLevelFieldProps> = ({ form }) => {
  const value = form.watch('protection');
  
  const handleChange = (selected: string[]) => {
    if (selected.length > 0) {
      form.setValue('protection', selected[0] as any, { shouldValidate: true });
    }
  };

  return (
    <FormField
      control={form.control}
      name="protection"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Livello di protezione</FormLabel>
          <FormControl>
            <BadgeSelector
              options={protectionOptions}
              selectedValues={[value]}
              onChange={handleChange}
              multiSelect={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProtectionLevelField;
