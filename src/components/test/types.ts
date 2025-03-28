
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

export const formSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  status: z.enum(['scheduled', 'completed'], { required_error: "Lo stato è obbligatorio" }),
  testTypes: z.record(z.boolean()).default({}),
  location: z.string().optional(),
  result: z.enum(['negative', 'positive', 'pending']).default('pending'),
  notes: z.string().max(500, "Le note non possono superare 500 caratteri").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface TestFormProps {
  onSubmit: (data: FormData) => void;
  initialDate?: Date;
  initialData?: FormData | null;
  isSubmitting?: boolean;
}
