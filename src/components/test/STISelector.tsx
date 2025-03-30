
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { FormData, stiOptions } from './types';
import { BadgeCheck } from 'lucide-react';

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
          
          <div className="flex flex-wrap gap-2">
            {stiOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name={`testTypes.${option.id}`}
                render={({ field }) => {
                  return (
                    <FormItem key={option.id} className="m-0 p-0">
                      <FormControl>
                        <div 
                          className={`cursor-pointer`}
                          onClick={() => field.onChange(!field.value)}
                        >
                          <Badge
                            variant="outline"
                            className={`py-2 px-3 flex items-center gap-2 text-sm transition-all ${
                              field.value 
                                ? 'bg-primary/70 border-primary/60 text-primary-foreground hover:bg-primary/80' 
                                : 'hover:bg-secondary/80'
                            }`}
                          >
                            {field.value && (
                              <BadgeCheck className="h-4 w-4" />
                            )}
                            <span>{option.label}</span>
                          </Badge>
                        </div>
                      </FormControl>
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
