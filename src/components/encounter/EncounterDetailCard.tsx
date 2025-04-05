
import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, ShieldAlert, ShieldCheck, CalendarClock, AlertCircle } from 'lucide-react';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';
import { symptomsOptions } from './types';

interface EncounterDetailCardProps {
  encounter: any;
}

const EncounterDetailCard: React.FC<EncounterDetailCardProps> = ({ encounter }) => {
  const encounterDate = new Date(encounter.date);
  const formattedDate = format(encounterDate, 'd MMMM yyyy', { locale: it });
  
  const encounterTypeLabels: { [key: string]: string } = {
    oral: 'Orale',
    vaginal: 'Vaginale',
    anal: 'Anale'
  };

  // Handle multiple encounter types
  const encounterTypes = encounter.encounter_type.split(',');
  const encounterTypeDisplay = encounterTypes.map(type => 
    encounterTypeLabels[type] || (type !== 'other' ? type : 'Orale')
  ).join(', ');

  // Get symptoms from the symptoms field or parse from notes for backward compatibility
  const symptoms = encounter.symptoms || {};
  
  // Get symptom labels for active symptoms
  const activeSymptoms = Object.entries(symptoms)
    .filter(([_, active]) => active)
    .map(([id]) => symptomsOptions.find(s => s.id === id)?.label || id);
  
  // Check if there are any symptoms to display
  const hasSymptoms = activeSymptoms.length > 0;
  
  // Display custom name if available or default to encounter type
  const displayTitle = encounter.partner_name || `Rapporto ${encounterTypeDisplay}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle className="truncate">
              {displayTitle}
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`${getRiskColor(encounter.risk_level)} bg-opacity-15`}
          >
            {getRiskLabel(encounter.risk_level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h3>
          <p>{encounterTypeDisplay}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Protezione</h3>
          <div className="flex items-center gap-2">
            {encounter.protection_used ? (
              <>
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Utilizzata</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <span>Non utilizzata</span>
              </>
            )}
          </div>
        </div>

        {hasSymptoms && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Sintomi</h3>
            <div className="flex flex-wrap gap-2">
              {activeSymptoms.map((symptom) => (
                <Badge 
                  key={symptom} 
                  variant="outline" 
                  className="bg-yellow-500 bg-opacity-15 text-yellow-700 border-yellow-300"
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {encounter.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Note</h3>
            <p className="whitespace-pre-line">{encounter.notes}</p>
          </div>
        )}
      </CardContent>
      <Separator />
    </Card>
  );
};

export default EncounterDetailCard;
