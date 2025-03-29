
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formSchema, FormData } from './types';
import DateField from './DateField';
import StatusField from './StatusField';
import STISelector from './STISelector';
import LocationSearchField from './LocationSearchField';
import ResultField from './ResultField';
import SpecificResultsSelector from './SpecificResultsSelector';
import NotesField from './NotesField';

interface TestFormProps {
  onSubmit: (data: FormData) => void;
  initialDate?: Date;
  initialData?: FormData | null;
  isSubmitting?: boolean;
}

const TestForm: React.FC<TestFormProps> = ({
  onSubmit,
  initialDate = new Date(),
  initialData = null,
  isSubmitting = false
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: initialDate,
      status: 'scheduled',
      testTypes: {},
      location: '',
      result: 'pending',
      specificResults: {},
      notes: ''
    }
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateField form={form} />
            <StatusField form={form} />
          </div>
          
          <STISelector form={form} />
          
          <ResultField form={form} />
          <SpecificResultsSelector form={form} />
          
          <LocationSearchField form={form} />
          <NotesField form={form} />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvataggio...' : 'Salva test'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default TestForm;
