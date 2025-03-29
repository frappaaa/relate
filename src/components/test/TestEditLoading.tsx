
import React from 'react';

const TestEditLoading: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modifica test</h1>
        <p className="text-muted-foreground">Caricamento dei dettagli in corso...</p>
      </section>
      <div className="h-64 w-full rounded-lg bg-secondary/30 animate-pulse"></div>
    </div>
  );
};

export default TestEditLoading;
