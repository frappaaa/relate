
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Calendar, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Errore",
        description: "Per favore inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Grazie per esserti iscritto!",
      description: "Ti terremo aggiornato sulle novità di Relate.",
    });
    setEmail('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Header with Glassmorphism Effect */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Logo variant="gradient" size="md" />
            <span className="font-medium tracking-tight text-xl">Relate</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild className="shadow-sm">
              <Link to="/login">Accedi</Link>
            </Button>
            <Button size="sm" className="bg-gradient-relate shadow-sm" asChild>
              <Link to="/register">Registrati</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-background to-secondary/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
                La tua salute sessuale, organizzata
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-relate animate-fade-in">
                Relate — Salute sessuale <br className="hidden sm:inline" />
                semplice e intelligente
              </h1>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl/relaxed animate-fade-in opacity-90">
                Un'app discreta che ti aiuta a prendersi cura della tua salute sessuale con strumenti intuitivi, 
                promemoria personalizzati e una stima immediata del rischio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in">
                <Button size="lg" className="bg-gradient-relate shadow-md hover:shadow-lg transition-all" asChild>
                  <Link to="/app/dashboard">
                    Inizia a usare Relate
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Modern Cards */}
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
              {/* Calendario Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary overflow-hidden group">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Calendario intelligente</CardTitle>
                  <CardDescription className="text-base">
                    Tieni traccia di test e appuntamenti. Ricevi promemoria personalizzati in base alla tua attività.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
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

              {/* Valutazione Rischio Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary overflow-hidden group">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Valutazione del rischio</CardTitle>
                  <CardDescription className="text-base">
                    Algoritmo che calcola il tuo livello di rischio IST e suggerisce quando fare un test.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
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

              {/* Privacy Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary overflow-hidden group">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Privacy e sicurezza</CardTitle>
                  <CardDescription className="text-base">
                    I tuoi dati sono crittografati e visibili solo a te. Massima discrezione garantita.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
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

        {/* Mission Section */}
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

        {/* New CTA Banner Section */}
        <section className="py-16 md:py-24 bg-gradient-relate text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Vuoi collaborare con noi?</h2>
                <p className="text-white/90 text-lg max-w-[500px]">
                  Unisciti a noi per migliorare Relate e contribuire a un futuro in cui la salute sessuale 
                  è accessibile, comprensibile e priva di stigma per tutti.
                </p>
              </div>
              <div className="w-full max-w-md">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="La tua email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                  />
                  <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Iscriviti
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t">
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
