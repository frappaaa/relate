
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { FormData, stiOptions } from './types';

interface STISelectorProps {
  form: UseFormReturn<FormData>;
}

const STISelector: React.FC<STISelectorProps> = ({ form }) => {
  // Initialize test types if not already set
  React.useEffect(() => {
    const currentTestTypes = form.getValues().testTypes;
    
    // If testTypes is empty, initialize with all options set to false
    if (!currentTestTypes || Object.keys(currentTestTypes).length === 0) {
      const initialTestTypes = stiOptions.reduce((acc, option) => {
        acc[option.id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      form.setValue('testTypes', initialTestTypes);
    }
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="testTypes"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Tipologie di test</FormLabel>
            <FormDescription>
              Seleziona i tipi di IST per cui stai facendo il test
            </FormDescription>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stiOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name={`testTypes.${option.id}`}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default STISelector;
