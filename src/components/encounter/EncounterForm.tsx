
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { calculateRiskScore, getRiskLevel } from '@/utils/riskCalculator';

import DateField from './DateField';
import EncounterTypeField from './EncounterTypeField';
import ProtectionLevelField from './ProtectionLevelField';
import PartnerStatusField from './PartnerStatusField';
import SymptomsSelector from './SymptomsSelector';
import NotesField from './NotesField';
import RiskAssessment from './RiskAssessment';
import { formSchema, FormData, EncounterFormProps, symptomsOptions } from './types';

const EncounterForm: React.FC<EncounterFormProps> = ({ 
  onSubmit, 
  initialDate = new Date(),
  initialData = null,
  isSubmitting = false 
}) => {
  const [riskResult, setRiskResult] = useState<{ score: number; level: 'low' | 'medium' | 'high' } | null>(null);

  // Initialize symptoms with all options set to false
  const initialSymptoms = symptomsOptions.reduce((acc, symptom) => {
    acc[symptom.id] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: initialDate,
      partnerStatus: 'unknown',
      symptoms: initialSymptoms,
    },
  });

  const calculateRisk = (data: FormData) => {
    // Check if any symptoms are present
    const hasSymptoms = Object.values(data.symptoms).some(value => value);
    
    const score = calculateRiskScore({
      type: data.type,
      protection: data.protection,
      partnerStatus: data.partnerStatus,
      symptoms: hasSymptoms,
    });
    
    const level = getRiskLevel(score);
    
    setRiskResult({ score, level });
    
    return { score, level };
  };

  const handleSubmit = (data: FormData) => {
    const { score, level } = calculateRisk(data);
    onSubmit({
      ...data,
      riskScore: score,
      riskLevel: level,
    });
  };

  // Calculate risk on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.type && value.protection) {
        try {
          calculateRisk(form.getValues() as FormData);
        } catch (e) {
          // Form is incomplete, ignore
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Calculate initial risk when editing an existing entry
  useEffect(() => {
    if (initialData && initialData.type && initialData.protection) {
      calculateRisk(initialData);
    }
  }, [initialData]);

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DateField form={form} />
              <EncounterTypeField form={form} />
              <ProtectionLevelField form={form} />
            </div>

            <div className="space-y-6">
              <PartnerStatusField form={form} />
              <SymptomsSelector form={form} />
              <NotesField form={form} />
            </div>
          </div>
          
          {riskResult && (
            <RiskAssessment 
              riskLevel={riskResult.level} 
              score={riskResult.score} 
            />
          )}

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio in corso..." : "Salva rapporto"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EncounterForm;
