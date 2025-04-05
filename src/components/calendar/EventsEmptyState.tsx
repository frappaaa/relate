
import React from 'react';

const EventsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 border rounded-lg">
      <p className="text-muted-foreground">Nessun evento da visualizzare</p>
    </div>
  );
};

export default EventsEmptyState;
