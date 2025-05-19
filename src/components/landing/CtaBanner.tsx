
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const CtaBanner: React.FC = () => {
  const [email, setEmail] = useState('');

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
  );
};

export default CtaBanner;
