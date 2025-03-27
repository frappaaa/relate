
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
import { Beaker, Trash2, CalendarClock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const TestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setTest(data);
      } catch (error) {
        console.error('Error fetching test:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli del test.",
          variant: "destructive"
        });
        navigate('/app/calendar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!user || !id) return;

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Eliminato",
        description: "Il test è stato eliminato con successo.",
      });
      
      navigate('/app/calendar');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il test.",
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
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Test</h1>
          <p className="text-muted-foreground">Caricamento dei dettagli in corso...</p>
        </section>
        <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Test</h1>
          <p className="text-muted-foreground">Test non trovato</p>
        </section>
        <Button onClick={() => navigate('/app/calendar')}>Torna al calendario</Button>
      </div>
    );
  }

  const testDate = new Date(test.date);
  const formattedDate = format(testDate, 'd MMMM yyyy', { locale: it });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmato';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Cancellato';
      default: return 'Sconosciuto';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-500 bg-blue-500';
      case 'completed': return 'text-green-500 bg-green-500';
      case 'cancelled': return 'text-red-500 bg-red-500';
      default: return 'text-gray-500 bg-gray-500';
    }
  };

  const getResultLabel = (result: string | null) => {
    if (!result || result === 'pending') return 'In attesa';
    switch (result) {
      case 'negative': return 'Negativo';
      case 'positive': return 'Positivo';
      default: return 'Sconosciuto';
    }
  };

  const getResultColor = (result: string | null) => {
    if (!result || result === 'pending') return 'text-yellow-500 bg-yellow-500';
    switch (result) {
      case 'negative': return 'text-green-500 bg-green-500';
      case 'positive': return 'text-red-500 bg-red-500';
      default: return 'text-gray-500 bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dettagli Test</h1>
          <Button variant="outline" onClick={() => navigate('/app/calendar')}>
            Torna al calendario
          </Button>
        </div>
        <p className="text-muted-foreground">Visualizza i dettagli del test registrato</p>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-blue-500" />
              <CardTitle>Test {test.test_type}</CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(test.status)} bg-opacity-15`}
            >
              {getStatusLabel(test.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>

          {test.status === 'completed' && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Risultato</h3>
              <Badge 
                variant="outline" 
                className={`${getResultColor(test.result)} bg-opacity-15`}
              >
                {getResultLabel(test.result)}
              </Badge>
            </div>
          )}

          {test.location && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Luogo</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{test.location}</span>
              </div>
            </div>
          )}

          {test.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Note</h3>
              <p className="whitespace-pre-line">{test.notes}</p>
            </div>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2" disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Eliminazione...' : 'Elimina test'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di voler eliminare questo test?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Tutti i dati relativi a questo test verranno eliminati permanentemente.
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestDetailPage;
