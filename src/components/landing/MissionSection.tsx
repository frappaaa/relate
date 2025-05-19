
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            La nostra missione
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-relate">
            Normalizzare la prevenzione
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Relate nasce per aiutare le persone a prendersi cura della propria salute sessuale senza tabù, 
            riducendo l'ansia e promuovendo una sessualità libera e consapevole.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 md:grid-cols-2 md:gap-12">
          <div className="space-y-4 bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Dati informati, decisioni sicure</h3>
            <p className="text-muted-foreground">
              Relate ti aiuta a monitorare la tua attività sessuale e a prendere decisioni informate sulla tua salute.
            </p>
          </div>
          <div className="space-y-4 bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Prevenzione alla portata di tutti</h3>
            <p className="text-muted-foreground">
              Strumenti semplici e accessibili per monitorare la tua salute sessuale e prevenire le IST.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button size="lg" className="bg-gradient-relate shadow-md hover:shadow-lg transition-all" asChild>
            <Link to="/app/dashboard">
              Prova Relate ora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
