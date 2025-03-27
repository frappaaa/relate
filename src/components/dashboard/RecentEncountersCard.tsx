
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/utils/dateUtils';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';

interface RecentEncountersCardProps {
  recentEncounters: Array<{
    id: string;
    date: string;
    type: string;
    risk: 'low' | 'medium' | 'high';
  }>;
}

const RecentEncountersCard: React.FC<RecentEncountersCardProps> = ({ recentEncounters }) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-relate-500" />
          Rapporti recenti
        </CardTitle>
        <CardDescription>Gli ultimi rapporti registrati</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {recentEncounters.length > 0 ? (
          <div className="space-y-3">
            {recentEncounters.map(encounter => (
              <div key={encounter.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getRiskColor(encounter.risk)}`} />
                  <div>
                    <p className="text-sm font-medium">{encounter.type}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(encounter.date)}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${encounter.risk === 'high' ? 'border-red-500 text-red-500' : encounter.risk === 'medium' ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500'}`}>
                  {getRiskLabel(encounter.risk)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">Nessun rapporto registrato</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant="outline">
          <Link to="/app/calendar">Visualizza tutti i rapporti</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentEncountersCard;
