
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PrivacySecurityCard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  const handleDeleteUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Delete all encounters
      const { error: encountersError } = await supabase
        .from('encounters')
        .delete()
        .eq('user_id', user.id);
      
      if (encountersError) throw encountersError;
      
      // Delete all tests
      const { error: testsError } = await supabase
        .from('tests')
        .delete()
        .eq('user_id', user.id);
      
      if (testsError) throw testsError;
      
      toast({
        title: "Dati eliminati",
        description: "Tutti i tuoi dati sono stati eliminati con successo",
      });
    } catch (error) {
      console.error('Error deleting user data:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dei dati",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsDataDialogOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Delete all encounters
      const { error: encountersError } = await supabase
        .from('encounters')
        .delete()
        .eq('user_id', user.id);
      
      if (encountersError) throw encountersError;
      
      // Delete all tests
      const { error: testsError } = await supabase
        .from('tests')
        .delete()
        .eq('user_id', user.id);
      
      if (testsError) throw testsError;
      
      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Delete user account (will sign the user out)
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (authError) throw authError;
      
      toast({
        title: "Account eliminato",
        description: "Il tuo account è stato eliminato con successo",
      });
      
      // The user will be signed out automatically when their account is deleted
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAccountDialogOpen(false);
    }
  };

  return (
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
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          I tuoi dati sono crittografati e protetti. Relate non condivide mai le tue informazioni con terze parti.
        </p>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsDataDialogOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina tutti i dati
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={() => setIsAccountDialogOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina account e dati
          </Button>
        </div>
      </CardContent>

      {/* Alert Dialog for Data Deletion */}
      <AlertDialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà permanentemente tutti i tuoi dati relativi a test e rapporti. Non sarà possibile recuperarli.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUserData}
              disabled={isLoading}
              className="bg-secondary"
            >
              {isLoading ? "Eliminazione in corso..." : "Elimina i dati"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Account Deletion */}
      <AlertDialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare l'account?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà permanentemente il tuo account e tutti i dati associati. Non sarà possibile recuperare queste informazioni.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Eliminazione in corso..." : "Elimina account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PrivacySecurityCard;
