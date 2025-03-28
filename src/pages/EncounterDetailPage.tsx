
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heart, Trash2, Shield, ShieldAlert, ShieldCheck, CalendarClock, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';

const EncounterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [encounter, setEncounter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEncounter = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('encounters')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setEncounter(data);
      } catch (error) {
        console.error('Error fetching encounter:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli del rapporto.",
          variant: "destructive"
        });
        navigate('/app/calendar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncounter();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!user || !id) return;

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('encounters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Eliminato",
        description: "Il rapporto è stato eliminato con successo.",
      });
      
      navigate('/app/calendar');
    } catch (error) {
      console.error('Error deleting encounter:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il rapporto.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Rapporto</h1>
          <p className="text-muted-foreground">Caricamento dei dettagli in corso...</p>
        </section>
        <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Rapporto</h1>
          <p className="text-muted-foreground">Rapporto non trovato</p>
        </section>
        <Button onClick={() => navigate('/app/calendar')}>Torna al calendario</Button>
      </div>
    );
  }

  const encounterDate = new Date(encounter.date);
  const formattedDate = format(encounterDate, 'd MMMM yyyy', { locale: it });
  
  const encounterTypeLabels = {
    oral: 'Orale',
    vaginal: 'Vaginale',
    anal: 'Anale',
    other: 'Altro'
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Rapporto</h1>
          <Button variant="outline" onClick={() => navigate('/app/calendar')}>
            Torna al calendario
          </Button>
        </div>
        <p className="text-muted-foreground">Visualizza i dettagli del rapporto registrato</p>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <CardTitle>Rapporto {encounterTypeLabels[encounter.encounter_type as keyof typeof encounterTypeLabels]}</CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className={`${getRiskColor(encounter.risk_level)} bg-opacity-15`}
            >
              {getRiskLabel(encounter.risk_level)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Protezione</h3>
            <div className="flex items-center gap-2">
              {encounter.protection_used ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Utilizzata</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <span>Non utilizzata</span>
                </>
              )}
            </div>
          </div>

          {encounter.partner_name && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Partner</h3>
              <p>{encounter.partner_name}</p>
            </div>
          )}

          {encounter.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Note</h3>
              <p className="whitespace-pre-line">{encounter.notes}</p>
            </div>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="pt-6 flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={() => navigate(`/app/edit-encounter/${id}`)}
            >
              <Edit className="h-4 w-4" />
              Modifica
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2" disabled={isDeleting}>
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Eliminazione...' : 'Elimina rapporto'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro di voler eliminare questo rapporto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Tutti i dati relativi a questo rapporto verranno eliminati permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EncounterDetailPage;
