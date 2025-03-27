
import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/dateUtils';

interface UpcomingTestsCardProps {
  upcomingTests: Array<{
    id: string;
    date: string;
    type: string;
  }>;
}

const UpcomingTestsCard: React.FC<UpcomingTestsCardProps> = ({ upcomingTests }) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-relate-500" />
          Prossimi appuntamenti
        </CardTitle>
        <CardDescription>Test e visite pianificate</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 py-[16px]">
        {upcomingTests.length > 0 ? (
          <div className="space-y-3">
            {upcomingTests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border group hover:bg-secondary/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Beaker className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{test.type}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(test.date)}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">Nessun test pianificato</p>
            <Button variant="link" className="mt-2" asChild>
              <Link to="/app/new-test">Pianifica un test</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTestsCard;
