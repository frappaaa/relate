
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Calendar, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/logo';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 md:py-10 w-full border-b">
        <div className="container flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo variant="gradient" size="md" />
            <span className="font-medium tracking-tight text-lg">Relate</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/login">Accedi</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Registrati</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                La tua salute sessuale, organizzata
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
                Relate — Salute sessuale semplice <br className="hidden md:inline" />e intelligente
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Un'app discreta che ti aiuta a prendersi cura della tua salute sessuale con strumenti intuitivi, promemoria personalizzati e una stima immediata del rischio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:gap-4">
                <Button size="lg" className="animate-fade-in bg-gradient-relate" asChild>
                  <Link to="/app/dashboard">
                    Inizia a usare Relate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              <Card className="shadow-card card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Calendario intelligente</CardTitle>
                  <CardDescription>
                    Tieni traccia di test e appuntamenti. Ricevi promemoria personalizzati in base alla tua attività.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Visualizzazione intuitiva
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Promemoria personalizzati
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Storico completo
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-card card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Valutazione del rischio</CardTitle>
                  <CardDescription>
                    Algoritmo che calcola il tuo livello di rischio IST e suggerisce quando fare un test.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Risultati immediati
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Consigli personalizzati
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Valutazione semplice
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-card card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Privacy e sicurezza</CardTitle>
                  <CardDescription>
                    I tuoi dati sono crittografati e visibili solo a te. Massima discrezione garantita.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Dati crittografati
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Nessuna condivisione
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      Interfaccia discreta
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                La nostra missione
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Normalizzare la prevenzione
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Relate nasce per aiutare le persone a prendersi cura della propria salute sessuale senza tabù, 
                riducendo l'ansia e promuovendo una sessualità libera e consapevole.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 md:gap-12">
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dati informati, decisioni sicure</h3>
                <p className="text-muted-foreground">
                  Relate ti aiuta a monitorare la tua attività sessuale e a prendere decisioni informate sulla tua salute.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Prevenzione alla portata di tutti</h3>
                <p className="text-muted-foreground">
                  Strumenti semplici e accessibili per monitorare la tua salute sessuale e prevenire le IST.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="animate-fade-in bg-gradient-relate" asChild>
                <Link to="/app/dashboard">
                  Prova Relate ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 md:py-8 border-t">
        <div className="container px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="gradient" size="sm" />
            <span className="text-sm font-medium">Relate</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Relate. Tutti i diritti riservati. v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
