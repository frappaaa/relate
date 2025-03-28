
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { setMapboxToken } from '@/hooks/use-mapbox';

const MapboxTokenManager: React.FC = () => {
  const [token, setToken] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'missing' | 'saved' | 'valid'>('missing');
  
  useEffect(() => {
    // Controlla se il token è già salvato
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setToken(savedToken);
      setTokenStatus('saved');
    }
  }, []);
  
  const handleSaveToken = () => {
    if (token) {
      // Salva il token
      setMapboxToken(token);
      setTokenStatus('valid');
      setShowDialog(false);
      
      // Ricarica la pagina per applicare il nuovo token
      window.location.reload();
    }
  };
  
  if (tokenStatus === 'valid') {
    return null; // Non mostrare nulla se il token è valido
  }
  
  return (
    <>
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-semibold">Token Mapbox necessario</h3>
              <p className="text-sm text-muted-foreground mt-1">
                È necessario configurare il token Mapbox per visualizzare le mappe.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto" 
              onClick={() => setShowDialog(true)}
            >
              Configura
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configura token Mapbox</DialogTitle>
            <DialogDescription>
              Inserisci il tuo token Mapbox per abilitare le funzionalità della mappa.
              Questo token sarà salvato solo sul tuo browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Inserisci il token Mapbox"
              className="w-full"
            />
            {tokenStatus === 'saved' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Token salvato localmente</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleSaveToken} disabled={!token}>
              Salva token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapboxTokenManager;
