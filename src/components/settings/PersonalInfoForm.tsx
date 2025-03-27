
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  sexual_orientation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface PersonalInfoFormProps {
  initialData: ProfileFormValues;
  onProfileUpdate: (data: ProfileFormValues) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ initialData, onProfileUpdate }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          pronouns: values.pronouns,
          sexual_orientation: values.sexual_orientation,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profilo aggiornato",
        description: "Le tue informazioni sono state salvate con successo.",
      });
      
      onProfileUpdate(values);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Informazioni Personali
        </CardTitle>
        <CardDescription>
          Aggiorna le tue informazioni personali
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il tuo nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cognome</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il tuo cognome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genere</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il tuo genere" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ad esempio: uomo, donna, non-binario, ecc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci i tuoi pronomi" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ad esempio: lui/suo, lei/sua, loro/loro, ecc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sexual_orientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orientamento Sessuale</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il tuo orientamento sessuale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Salvataggio...' : 'Salva modifiche'}
              {!isLoading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PersonalInfoForm;
