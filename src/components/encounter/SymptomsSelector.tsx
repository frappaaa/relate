
import React from 'react';
import { FormLabel, FormDescription } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

// List of symptoms that can be selected
const symptomsOptions = [
  { id: "itching", label: "Prurito" },
  { id: "pain", label: "Dolore o fastidio" },
  { id: "discharge", label: "Perdite insolite" },
  { id: "rash", label: "Eruzioni cutanee" },
  { id: "fever", label: "Febbre" },
  { id: "swelling", label: "Gonfiore" },
  { id: "odor", label: "Odore insolito" },
  { id: "urination", label: "Problemi di minzione" },
] as const;

interface SymptomsSelectorProps {
  form: UseFormReturn<FormData>;
}

const SymptomsSelector: React.FC<SymptomsSelectorProps> = ({ form }) => {
  return (
    <div>
      <FormLabel className="text-base">Sintomi presenti</FormLabel>
      <FormDescription className="mt-1 mb-3">
        Seleziona tutti i sintomi che hai notato
      </FormDescription>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {symptomsOptions.map((symptom) => (
          <FormField
            key={symptom.id}
            control={form.control}
            name={`symptoms.${symptom.id}`}
            render={({ field }) => (
              <FormItem key={symptom.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal cursor-pointer">
                    {symptom.label}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default SymptomsSelector;
