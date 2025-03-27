
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Beaker, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';

interface RiskStatusCardProps {
  riskLevel: 'low' | 'medium' | 'high';
  lastTest?: {
    date: string;
    result: string;
  } | null;
  nextTestDue?: string | null;
}

const RiskStatusCard: React.FC<RiskStatusCardProps> = ({
  riskLevel,
  lastTest,
  nextTestDue
}) => {
  return (
    <Card className="overflow-hidden shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-relate-500" />
          Stato attuale
        </CardTitle>
        <CardDescription>La tua valutazione del rischio</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${getRiskColor(riskLevel)}`}>
            <span className="text-lg font-semibold">{getRiskLabel(riskLevel)}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Livello di rischio attuale</p>
            <p className="font-medium">
              {riskLevel === 'low' && 'Continua così!'}
              {riskLevel === 'medium' && 'Attenzione consigliata'}
              {riskLevel === 'high' && 'Attenzione necessaria'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Beaker className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Ultimo test</span>
            </div>
            <span className="text-sm font-medium">
              {lastTest ? lastTest.date : 'Non registrato'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Prossimo test consigliato</span>
            </div>
            <span className="text-sm font-medium">
              {nextTestDue ? nextTestDue : 'Non calcolato'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant="outline">
          <Link to="/app/new-encounter">Registra un nuovo rapporto</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RiskStatusCard;
