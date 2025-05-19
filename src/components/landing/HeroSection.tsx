
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
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
  );
};

export default HeroSection;
