
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PrivacySecurityCard: React.FC = () => {
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
      <CardContent>
        <p className="text-sm text-muted-foreground">
          I tuoi dati sono crittografati e protetti. Relate non condivide mai le tue informazioni con terze parti.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacySecurityCard;
