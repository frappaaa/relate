
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

export const formSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  type: z.enum(['oral', 'vaginal', 'anal'], { required_error: "Il tipo è obbligatorio" }),
  protection: z.enum(['none', 'partial', 'full'], { required_error: "Il livello di protezione è obbligatorio" }),
  partnerStatus: z.enum(['unknown', 'negative', 'positive']).default('unknown'),
  symptoms: z.record(z.boolean()).default({}),
  notes: z.string().max(500, "Le note non possono superare 500 caratteri").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface EncounterFormProps {
  onSubmit: (data: FormData & { riskScore: number; riskLevel: 'low' | 'medium' | 'high' }) => void;
  initialDate?: Date;
  isSubmitting?: boolean;
}
