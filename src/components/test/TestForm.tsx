
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formSchema, FormData } from './types';
import DateField from './DateField';
import STISelector from './STISelector';
import LocationField from './LocationField';
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
      testTypes: {},
      location: '',
      specificResults: {},
      notes: ''
    }
  });
  
  const selectedDate = form.watch('date');
  const isPastOrToday = selectedDate && new Date(selectedDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <DateField form={form} />
          
          <STISelector form={form} />
          
          {isPastOrToday && <SpecificResultsSelector form={form} />}
          
          <LocationField form={form} />
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
