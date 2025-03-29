
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { stiOptions } from '@/components/test/types';

interface TestBadgesProps {
  testTypes: string[];
  specificResults?: Record<string, string>;
  showPositiveOnly?: boolean;
}

const TestBadges: React.FC<TestBadgesProps> = ({ 
  testTypes,
  specificResults = {},
  showPositiveOnly = false
}) => {
  // Find STI label by ID
  const getStiLabel = (stiId: string) => {
    const sti = stiOptions.find(option => option.id === stiId);
    return sti ? sti.label : stiId;
  };

  const getBadgeColor = (result: string) => {
    switch(result) {
      case 'negative':
        return 'text-green-700 bg-green-100';
      case 'positive':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  if (showPositiveOnly) {
    return (
      <div className="space-y-2">
        {Object.keys(specificResults).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(specificResults).map(([stiId, result]) => (
              result === 'positive' && (
                <Badge key={stiId} variant="outline" className={getBadgeColor('positive')}>
                  {getStiLabel(stiId)}
                </Badge>
              )
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Risultato positivo, ma non sono specificate le IST.
            <br />
            Modifica il test per aggiungere dettagli sui risultati specifici.
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {testTypes.map((type: string) => (
        <Badge key={type} variant="outline">
          {getStiLabel(type)}
        </Badge>
      ))}
    </div>
  );
};

export default TestBadges;
