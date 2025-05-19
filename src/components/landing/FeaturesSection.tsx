
import React from 'react';
import { Shield, Calendar, Activity, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bulletPoints: string[];
}> = ({ icon, title, description, bulletPoints }) => (
  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary overflow-hidden group">
    <CardHeader className="space-y-1">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="text-base">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {bulletPoints.map((point, index) => (
          <li key={index} className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
            {point}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Calendario intelligente",
      description: "Tieni traccia di test e appuntamenti. Ricevi promemoria personalizzati in base alla tua attività.",
      bulletPoints: [
        "Visualizzazione intuitiva",
        "Promemoria personalizzati",
        "Storico completo",
      ]
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Valutazione del rischio",
      description: "Algoritmo che calcola il tuo livello di rischio IST e suggerisce quando fare un test.",
      bulletPoints: [
        "Risultati immediati",
        "Consigli personalizzati",
        "Valutazione semplice",
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Privacy e sicurezza",
      description: "I tuoi dati sono crittografati e visibili solo a te. Massima discrezione garantita.",
      bulletPoints: [
        "Dati crittografati",
        "Nessuna condivisione",
        "Interfaccia discreta",
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Funzionalità principali
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Relate ti offre gli strumenti essenziali per gestire la tua salute sessuale in modo semplice e discreto.
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bulletPoints={feature.bulletPoints}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
