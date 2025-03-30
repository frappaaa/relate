
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import BadgeSelector, { BadgeOption } from './BadgeSelector';

interface EncounterTypeFieldProps {
  form: UseFormReturn<FormData>;
}

const encounterTypeOptions: BadgeOption[] = [
  { id: "oral", label: "Orale" },
  { id: "vaginal", label: "Vaginale" },
  { id: "anal", label: "Anale" },
];

const EncounterTypeField: React.FC<EncounterTypeFieldProps> = ({ form }) => {
  const value = form.watch('type') || [];
  
  const handleChange = (selectedTypes: string[]) => {
    // Ensure we have at least one selection
    if (selectedTypes.length > 0) {
      form.setValue('type', selectedTypes as any, { shouldValidate: true });
    }
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di rapporto</FormLabel>
          <FormControl>
            <BadgeSelector
              options={encounterTypeOptions}
              selectedValues={Array.isArray(value) ? value : [value]}
              onChange={handleChange}
              multiSelect={true}
            />
          </FormControl>
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
