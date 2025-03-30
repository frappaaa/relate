
import { z } from "zod";

// List of STI types that can be tested
export const stiOptions = [
  { id: "hiv", label: "HIV" },
  { id: "syphilis", label: "Sifilide" },
  { id: "gonorrhea", label: "Gonorrea" },
  { id: "chlamydia", label: "Clamidia" },
  { id: "hpv", label: "HPV" },
  { id: "herpes", label: "Herpes genitale" },
  { id: "hepatitisB", label: "Epatite B" },
  { id: "hepatitisC", label: "Epatite C" },
] as const;

// Definizioni di tipo per i risultati specifici
export const testResultTypes = ['negative', 'positive', 'pending'] as const;
export type TestResult = typeof testResultTypes[number];

// Status del test
export const testStatusTypes = ['scheduled', 'completed', 'cancelled'] as const;
export type TestStatus = typeof testStatusTypes[number];

export const formSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  testTypes: z.record(z.boolean()).default({}),
  location: z.string().optional(),
  specificResults: z.record(z.enum(['negative', 'positive', 'pending'])).default({}),
  notes: z.string().max(500, "Le note non possono superare 500 caratteri").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface TestFormProps {
  onSubmit: (data: FormData) => void;
  initialDate?: Date;
  initialData?: FormData | null;
  isSubmitting?: boolean;
}
