import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Beaker, CalendarClock, MapPin, Edit, Copy } from 'lucide-react';
import TestBadges from './TestBadges';
import TestDeleteDialog from './TestDeleteDialog';

interface TestDetailCardProps {
  test: any;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const TestDetailCard: React.FC<TestDetailCardProps> = ({ test, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  
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

  const handleDuplicate = () => {
    // Create a query string with test data for the new test form
    const queryParams = new URLSearchParams();
    
    // Add date (use today's date as default)
    queryParams.set('date', new Date().toISOString());
    
    // Add test types
    if (test.test_type) {
      queryParams.set('testTypes', test.test_type);
    }
    
    // Add location if available
    if (test.location) {
      queryParams.set('location', test.location);
    }
    
    // Add notes if available
    if (test.notes) {
      queryParams.set('notes', test.notes);
    }
    
    console.log("Duplicating test with params:", queryParams.toString());
    
    // Navigate to new test page with params
    navigate(`/app/new-test?${queryParams.toString()}`);
  };

  return (
    <Card>
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
      <Separator />
      <CardFooter className="pt-6 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(`/app/edit-test/${test.id}`)}
          >
            <Edit className="h-4 w-4" />
            Modifica
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4" />
            Duplica
          </Button>
          
          <TestDeleteDialog onDelete={onDelete} isDeleting={isDeleting} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestDetailCard;
