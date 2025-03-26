
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve essere lungo almeno 2 caratteri.",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido.",
  }),
});

const notificationsFormSchema = z.object({
  testReminders: z.boolean().default(true),
  upcomingTests: z.boolean().default(true),
  riskAlerts: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
});

const privacyFormSchema = z.object({
  dataRetention: z.enum(["30days", "90days", "1year", "forever"]),
  anonymizeData: z.boolean().default(false),
  usePatterns: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PrivacyFormValues = z.infer<typeof privacyFormSchema>;

const SettingsPage: React.FC = () => {
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Utente Relate",
      email: "utente@example.com",
    },
  });

  // Notifications form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      testReminders: true,
      upcomingTests: true,
      riskAlerts: true,
      emailNotifications: false,
    },
  });

  // Privacy form
  const privacyForm = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      dataRetention: "90days",
      anonymizeData: false,
      usePatterns: true,
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state aggiornate con successo.",
    });
    console.log(data);
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast({
      title: "Notifiche aggiornate",
      description: "Le tue preferenze di notifica sono state aggiornate.",
    });
    console.log(data);
  }

  function onPrivacySubmit(data: PrivacyFormValues) {
    toast({
      title: "Impostazioni privacy aggiornate",
      description: "Le tue preferenze di privacy sono state aggiornate.",
    });
    console.log(data);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-muted-foreground">Gestisci le tue preferenze e impostazioni dell'account</p>
      </section>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile">Profilo</TabsTrigger>
          <TabsTrigger value="notifications">Notifiche</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Informazioni personali</h3>
            <p className="text-sm text-muted-foreground">
              Aggiorna le tue informazioni personali.
            </p>
          </div>
          
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Il tuo nome" {...field} />
                    </FormControl>
                    <FormDescription>
                      Questo è il nome che verrà mostrato nell'app.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="La tua email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Utilizziamo questa email per le notifiche importanti.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Salva modifiche</Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Preferenze di notifica</h3>
            <p className="text-sm text-muted-foreground">
              Configura quando e come ricevere notifiche.
            </p>
          </div>
          
          <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
              <FormField
                control={notificationsForm.control}
                name="testReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Promemoria test</FormLabel>
                      <FormDescription>
                        Ricevi notifiche quando è ora di fare un test.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={notificationsForm.control}
                name="upcomingTests"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Test in arrivo</FormLabel>
                      <FormDescription>
                        Notifiche su test pianificati nel calendario.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={notificationsForm.control}
                name="riskAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Avvisi di rischio</FormLabel>
                      <FormDescription>
                        Ricevi avvisi quando il rischio diventa elevato.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={notificationsForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifiche email</FormLabel>
                      <FormDescription>
                        Ricevi notifiche anche via email.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit">Salva preferenze</Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Impostazioni privacy</h3>
            <p className="text-sm text-muted-foreground">
              Gestisci come vengono trattati i tuoi dati.
            </p>
          </div>
          
          <Form {...privacyForm}>
            <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
              <FormField
                control={privacyForm.control}
                name="dataRetention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conservazione dati</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un periodo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30days">30 giorni</SelectItem>
                        <SelectItem value="90days">90 giorni</SelectItem>
                        <SelectItem value="1year">1 anno</SelectItem>
                        <SelectItem value="forever">Per sempre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Per quanto tempo conservare la cronologia dei rapporti e dei test.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={privacyForm.control}
                name="anonymizeData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Anonimizza i dati</FormLabel>
                      <FormDescription>
                        Rimuovi dettagli identificativi dai tuoi dati salvati.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={privacyForm.control}
                name="usePatterns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Analisi dei pattern</FormLabel>
                      <FormDescription>
                        Permetti all'app di analizzare pattern e fornire suggerimenti migliori.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit">Salva impostazioni</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
