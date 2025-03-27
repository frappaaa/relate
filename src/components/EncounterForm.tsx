
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { calculateRiskScore, getRiskLevel, getRiskColor, getRiskLabel, getTestRecommendation } from '@/utils/riskCalculator';

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

const formSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  type: z.enum(['oral', 'vaginal', 'anal'], { required_error: "Il tipo è obbligatorio" }),
  protection: z.enum(['none', 'partial', 'full'], { required_error: "Il livello di protezione è obbligatorio" }),
  partnerStatus: z.enum(['unknown', 'negative', 'positive']).default('unknown'),
  symptoms: z.record(z.boolean()).default({}),
  notes: z.string().max(500, "Le note non possono superare 500 caratteri").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EncounterFormProps {
  onSubmit: (data: FormData & { riskScore: number; riskLevel: 'low' | 'medium' | 'high' }) => void;
}

const EncounterForm: React.FC<EncounterFormProps> = ({ onSubmit }) => {
  const [riskResult, setRiskResult] = useState<{ score: number; level: 'low' | 'medium' | 'high' } | null>(null);

  // Initialize symptoms with all options set to false
  const initialSymptoms = symptomsOptions.reduce((acc, symptom) => {
    acc[symptom.id] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
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
  React.useEffect(() => {
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

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data del rapporto</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: it })
                            ) : (
                              <span>Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo di rapporto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona il tipo di rapporto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="oral">Orale</SelectItem>
                          <SelectItem value="vaginal">Vaginale</SelectItem>
                          <SelectItem value="anal">Anale</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Il tipo di rapporto è importante per valutare il rischio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="partnerStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato del partner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona lo stato del partner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unknown">Non noto</SelectItem>
                        <SelectItem value="negative">Negativo (test recente)</SelectItem>
                        <SelectItem value="positive">Positivo a IST</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Se conosci lo stato del partner, aiuta a valutare meglio il rischio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (opzionale)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Aggiungi note o osservazioni..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Le note sono private e visibili solo a te
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {riskResult && (
            <Card className={cn(
              "border-l-4 shadow-subtle animate-fade-in",
              riskResult.level === 'low' ? "border-l-green-500" : 
              riskResult.level === 'medium' ? "border-l-yellow-500" : 
              "border-l-red-500"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Valutazione del rischio
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    getRiskColor(riskResult.level)
                  )}>
                    {Math.round(riskResult.score)}%
                  </div>
                  <div>
                    <p className="font-medium text-lg">{getRiskLabel(riskResult.level)}</p>
                    <p className="text-sm text-muted-foreground">{getTestRecommendation(riskResult.level)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Questa è una stima basata sui dati forniti. Per una valutazione accurata, consulta un professionista.
              </CardFooter>
            </Card>
          )}

          <Button type="submit" className="w-full md:w-auto">
            Salva rapporto
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EncounterForm;
