
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './types';

interface ProtectionLevelFieldProps {
  form: UseFormReturn<FormData>;
}

const ProtectionLevelField: React.FC<ProtectionLevelFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="protection"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Livello di protezione</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="none" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Nessuna protezione
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="partial" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Protezione parziale
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="full" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Protezione completa
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProtectionLevelField;
