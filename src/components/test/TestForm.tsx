
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import DateField from './DateField';
import StatusField from './StatusField';
import LocationField from './LocationField';
import ResultField from './ResultField';
import STISelector from './STISelector';
import NotesField from './NotesField';
import { formSchema, FormData, TestFormProps, stiOptions } from './types';

const TestForm: React.FC<TestFormProps> = ({ 
  onSubmit, 
  initialDate = new Date(),
  isSubmitting = false 
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialDate,
      status: 'scheduled',
      result: 'pending',
      testTypes: stiOptions.reduce((acc, option) => {
        acc[option.id] = false;
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  // Show result field only if status is completed
  const showResultField = form.watch('status') === 'completed';

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DateField form={form} />
              <StatusField form={form} />
              <LocationField form={form} />
              <ResultField form={form} isVisible={showResultField} />
            </div>

            <div className="space-y-6">
              <STISelector form={form} />
              <NotesField form={form} />
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio in corso..." : "Salva test"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TestForm;
