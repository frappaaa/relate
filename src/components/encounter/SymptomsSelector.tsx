
import React from 'react';
import { FormLabel, FormDescription } from '@/components/ui/form';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormData, symptomsOptions } from './types';
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SymptomsSelectorProps {
  form: UseFormReturn<FormData>;
}

const SymptomsSelector: React.FC<SymptomsSelectorProps> = ({ form }) => {
  const symptoms = form.watch('symptoms');
  
  const handleSymptomToggle = (symptomId: string) => {
    const currentValue = symptoms?.[symptomId] || false;
    const newSymptoms = { ...symptoms, [symptomId]: !currentValue };
    form.setValue('symptoms', newSymptoms, { shouldValidate: true });
  };

  return (
    <div>
      <FormLabel className="text-base">Sintomi presenti</FormLabel>
      <FormDescription className="mt-1 mb-3">
        Seleziona tutti i sintomi che hai notato
      </FormDescription>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {symptomsOptions.map((symptom) => {
          const isSelected = symptoms?.[symptom.id] || false;
          
          return (
            <Badge
              key={symptom.id}
              variant="outline"
              className={cn(
                "py-2 px-3 flex items-center gap-2 text-sm transition-all cursor-pointer",
                isSelected
                  ? "bg-primary/70 border-primary/60 text-primary-foreground hover:bg-primary/80"
                  : "hover:bg-secondary/80"
              )}
              onClick={() => handleSymptomToggle(symptom.id)}
            >
              {isSelected && <BadgeCheck className="h-4 w-4" />}
              <span>{symptom.label}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default SymptomsSelector;
