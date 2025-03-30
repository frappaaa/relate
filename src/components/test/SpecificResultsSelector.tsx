
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { FormData, stiOptions } from './types';
import { Label } from '@/components/ui/label';

interface SpecificResultsSelectorProps {
  form: UseFormReturn<FormData>;
}

const SpecificResultsSelector: React.FC<SpecificResultsSelectorProps> = ({ form }) => {
  const testTypes = form.watch('testTypes');
  
  // Get selected test types
  const selectedTestTypes = Object.entries(testTypes || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);

  if (selectedTestTypes.length === 0) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="specificResults"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Risultati dei test</FormLabel>
            <FormDescription>
              Indica i risultati per ciascun test effettuato
            </FormDescription>
          </div>
          
          <div className="space-y-6">
            {selectedTestTypes.map((typeId) => (
              <FormField
                key={typeId}
                control={form.control}
                name={`specificResults.${typeId}`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>
                      Risultato per {
                        // Find the label for this test type
                        (() => {
                          const option = stiOptions.find(opt => opt.id === typeId);
                          return option ? option.label : typeId;
                        })()
                      }
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || 'pending'}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="positive" id={`${typeId}-positive`} />
                          <Label htmlFor={`${typeId}-positive`} className="text-red-600">Positivo</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="negative" id={`${typeId}-negative`} />
                          <Label htmlFor={`${typeId}-negative`} className="text-green-600">Negativo</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="pending" id={`${typeId}-pending`} />
                          <Label htmlFor={`${typeId}-pending`} className="text-blue-600">In attesa</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default SpecificResultsSelector;
