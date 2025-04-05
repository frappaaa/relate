
import React from 'react';

const UnauthenticatedDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
        <p className="text-muted-foreground">Accedi per visualizzare i tuoi dati</p>
      </section>
    </div>
  );
};

export default UnauthenticatedDashboard;
