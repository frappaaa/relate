
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getRiskColor, getRiskLabel, getTestRecommendation } from '@/utils/riskCalculator';

interface RiskAssessmentProps {
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ riskLevel, score }) => {
  return (
    <Card className={cn(
      "border-l-4 shadow-subtle animate-fade-in",
      riskLevel === 'low' ? "border-l-green-500" : 
      riskLevel === 'medium' ? "border-l-yellow-500" : 
      "border-l-red-500"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Valutazione del rischio
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 mb-2">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-medium",
            getRiskColor(riskLevel)
          )}>
            {Math.round(score)}%
          </div>
          <div>
            <p className="font-medium text-lg">{getRiskLabel(riskLevel)}</p>
            <p className="text-sm text-muted-foreground">{getTestRecommendation(riskLevel)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Questa è una stima basata sui dati forniti. Per una valutazione accurata, consulta un professionista.
      </CardFooter>
    </Card>
  );
};

export default RiskAssessment;
