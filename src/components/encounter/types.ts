
import { z } from "zod";

// List of symptoms that can be selected
export const symptomsOptions = [
  { id: "itching", label: "Prurito" },
  { id: "pain", label: "Dolore o fastidio" },
  { id: "discharge", label: "Perdite insolite" },
  { id: "rash", label: "Eruzioni cutanee" },
  { id: "fever", label: "Febbre" },
  { id: "swelling", label: "Gonfiore" },
  { id: "odor", label: "Odore insolito" },
  { id: "urination", label: "Problemi di minzione" },
] as const;

// Adjusted to make type accept both string array and enum
export const formSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  type: z.union([
    z.array(z.enum(['oral', 'vaginal', 'anal'])).min(1, "Seleziona almeno un tipo di rapporto"),
    z.enum(['oral', 'vaginal', 'anal']),
  ]),
  customName: z.string().max(50, "Il nome non può superare 50 caratteri").optional(),
  protection: z.enum(['none', 'partial', 'full'], { required_error: "Il livello di protezione è obbligatorio" }),
  partnerStatus: z.enum(['unknown', 'negative', 'positive']).default('unknown'),
  symptoms: z.record(z.boolean()).default({}),
  notes: z.string().max(500, "Le note non possono superare 500 caratteri").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface EncounterFormProps {
  onSubmit: (data: FormData & { riskScore: number; riskLevel: 'low' | 'medium' | 'high' }) => void;
  initialDate?: Date;
  initialData?: FormData | null;
  isSubmitting?: boolean;
}
