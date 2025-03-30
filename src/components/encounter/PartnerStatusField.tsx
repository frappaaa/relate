
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';
import BadgeSelector, { BadgeOption } from './BadgeSelector';

interface PartnerStatusFieldProps {
  form: UseFormReturn<FormData>;
}

const partnerStatusOptions: BadgeOption[] = [
  { id: "unknown", label: "Non noto" },
  { id: "negative", label: "Negativo (test recente)" },
  { id: "positive", label: "Positivo a IST" },
];

const PartnerStatusField: React.FC<PartnerStatusFieldProps> = ({ form }) => {
  const value = form.watch('partnerStatus');
  
  const handleChange = (selected: string[]) => {
    if (selected.length > 0) {
      form.setValue('partnerStatus', selected[0] as any, { shouldValidate: true });
    }
  };

  return (
    <FormField
      control={form.control}
      name="partnerStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stato del partner</FormLabel>
          <FormControl>
            <BadgeSelector
              options={partnerStatusOptions}
              selectedValues={[value]}
              onChange={handleChange}
              multiSelect={false}
            />
          </FormControl>
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
