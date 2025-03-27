
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { user, signOut } = useAuth();

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
