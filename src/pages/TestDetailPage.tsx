
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
import { Beaker, Trash2, CalendarClock, MapPin, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { stiOptions } from '@/components/test/types';

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
  
  // Parsing test types from the string
  const testTypes = test.test_type ? test.test_type.split(', ') : [];
  
  // Parsing specific results if available
  const specificResults = test.specific_results ? test.specific_results : {};
  
  const statusLabels = {
    scheduled: 'Programmato',
    completed: 'Completato',
    cancelled: 'Annullato'
  };
  
  const resultLabels = {
    negative: 'Negativo',
    positive: 'Positivo',
    pending: 'In attesa'
  };
  
  const getBadgeColor = (result: string) => {
    switch(result) {
      case 'negative':
        return 'text-green-700 bg-green-100';
      case 'positive':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  // Find STI label by ID
  const getStiLabel = (stiId: string) => {
    const sti = stiOptions.find(option => option.id === stiId);
    return sti ? sti.label : stiId;
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
              <CardTitle>Test IST</CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className={getBadgeColor(test.result || 'pending')}
            >
              {statusLabels[test.status as keyof typeof statusLabels]}
              {test.status === 'completed' && test.result !== 'positive' && 
                `: ${resultLabels[test.result as keyof typeof resultLabels]}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Test effettuati per:</h3>
            <div className="flex flex-wrap gap-2">
              {testTypes.map((type: string) => (
                <Badge key={type} variant="outline">
                  {getStiLabel(type)}
                </Badge>
              ))}
            </div>
          </div>

          {test.status === 'completed' && test.result === 'positive' && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Risultati positivi per:</h3>
              <div className="space-y-2">
                {Object.keys(specificResults).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(specificResults).map(([stiId, result]) => (
                      result === 'positive' && (
                        <Badge key={stiId} variant="outline" className={getBadgeColor('positive')}>
                          {getStiLabel(stiId)}
                        </Badge>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Risultato positivo, ma non sono specificate le IST.
                    <br />
                    Modifica il test per aggiungere dettagli sui risultati specifici.
                  </p>
                )}
              </div>
            </div>
          )}

          {test.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <span>{test.location}</span>
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
        <CardFooter className="pt-6 flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/app/edit-test/${id}`)}
            >
              <Edit className="h-4 w-4" />
              Modifica
            </Button>
            
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
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestDetailPage;
