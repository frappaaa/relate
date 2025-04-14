
import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker, CalendarClock, MapPin } from 'lucide-react';
import TestBadges from './TestBadges';

interface TestDetailCardProps {
  test: any;
}

const TestDetailCard: React.FC<TestDetailCardProps> = ({ test }) => {
  const testDate = new Date(test.date);
  const formattedDate = format(testDate, 'd MMMM yyyy', { locale: it });
  
  // Parsing test types from the string
  const testTypes = test.test_type ? test.test_type.split(', ') : [];
  
  // Parsing specific results if available
  const specificResults = test.specific_results ? test.specific_results : {};
  
  const statusLabels = {
    scheduled: 'Programmato',
    completed: 'Completato',
    cancelled: 'Annullato'
  };
  
  const resultLabels = {
    negative: 'Negativo',
    positive: 'Positivo',
    pending: 'In attesa'
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

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-blue-500" />
            <CardTitle>Test IST</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={getBadgeColor(test.result || 'pending')}
          >
            {statusLabels[test.status as keyof typeof statusLabels]}
            {test.status === 'completed' && test.result !== 'positive' && 
              `: ${resultLabels[test.result as keyof typeof resultLabels]}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Test effettuati per:</h3>
          <TestBadges testTypes={testTypes} />
        </div>

        {test.status === 'completed' && test.result === 'positive' && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Risultati positivi per:</h3>
            <TestBadges 
              testTypes={testTypes}
              specificResults={specificResults}
              showPositiveOnly={true}
            />
          </div>
        )}

        {test.location && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <span>{test.location}</span>
          </div>
        )}

        {test.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Note</h3>
            <p className="whitespace-pre-line">{test.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestDetailCard;
