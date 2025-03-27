
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogOut, User, Shield, Save, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  sexual_orientation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      gender: '',
      pronouns: '',
      sexual_orientation: '',
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, gender, pronouns, sexual_orientation, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData(data);
          setAvatarUrl(data.avatar_url);
          form.reset({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            gender: data.gender || '',
            pronouns: data.pronouns || '',
            sexual_orientation: data.sexual_orientation || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare il profilo utente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, form]);

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
      
      setProfileData(values);
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('È necessario selezionare un\'immagine');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Date.now()}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(avatarUrl);
      
      toast({
        title: "Immagine caricata",
        description: "La tua foto profilo è stata aggiornata con successo.",
      });
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'immagine. Riprova.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeAvatar = async () => {
    if (!user || !avatarUrl) return;
    
    try {
      setUploading(true);
      
      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(null);
      
      toast({
        title: "Immagine rimossa",
        description: "La tua foto profilo è stata rimossa con successo.",
      });
      
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'immagine. Riprova.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Impostazioni</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profilo
            </CardTitle>
            <CardDescription>
              Gestisci le informazioni del tuo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="relative">
                  <Avatar 
                    className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={handleAvatarClick}
                  >
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Foto profilo" />
                    ) : null}
                    <AvatarFallback className="text-xl">
                      {profileData?.first_name ? profileData.first_name[0] : user?.email ? user.email[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={uploadAvatar}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAvatarClick}
                      disabled={uploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Caricamento...' : 'Cambia foto'}
                    </Button>
                    {avatarUrl && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={removeAvatar}
                        disabled={uploading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Rimuovi
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Clicca sull'immagine per caricare una nuova foto profilo
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnetti
            </Button>
          </CardFooter>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy e Sicurezza
            </CardTitle>
            <CardDescription>
              Gestisci le impostazioni di privacy e sicurezza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              I tuoi dati sono crittografati e protetti. Relate non condivide mai le tue informazioni con terze parti.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
