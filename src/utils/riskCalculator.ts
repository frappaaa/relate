
export type EncounterType = 'oral' | 'vaginal' | 'anal';
export type ProtectionLevel = 'none' | 'partial' | 'full';
export type RiskLevel = 'low' | 'medium' | 'high';

interface EncounterData {
  type: EncounterType;
  protection: ProtectionLevel;
  partnerStatus?: 'unknown' | 'negative' | 'positive';
  symptoms?: boolean;
}

// Risk matrix based on encounter type and protection level
const riskMatrix: Record<EncounterType, Record<ProtectionLevel, number>> = {
  oral: {
    none: 30,
    partial: 20,
    full: 5
  },
  vaginal: {
    none: 70,
    partial: 40,
    full: 10
  },
  anal: {
    none: 90,
    partial: 50,
    full: 15
  }
};

// Partner status modifiers
const partnerStatusModifiers: Record<string, number> = {
  unknown: 1.0, // No change
  negative: 0.5, // Reduces risk
  positive: 2.0 // Increases risk
};

// Calculate risk score (0-100)
export const calculateRiskScore = (encounter: EncounterData): number => {
  // Base risk from the matrix
  let riskScore = riskMatrix[encounter.type][encounter.protection];
  
  // Apply partner status modifier if available
  if (encounter.partnerStatus) {
    riskScore *= partnerStatusModifiers[encounter.partnerStatus];
  }
  
  // Increase risk if symptoms are present
  if (encounter.symptoms) {
    riskScore *= 1.5;
  }
  
  // Ensure the score is between 0 and 100
  return Math.min(Math.max(riskScore, 0), 100);
};

// Convert numeric score to risk level
export const getRiskLevel = (score: number): RiskLevel => {
  if (score < 25) return 'low';
  if (score < 60) return 'medium';
  return 'high';
};

// Get risk color based on risk level
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Get risk label (in Italian)
export const getRiskLabel = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'Basso';
    case 'medium':
      return 'Medio';
    case 'high':
      return 'Alto';
    default:
      return 'Sconosciuto';
  }
};

// Get test recommendation based on risk level
export const getTestRecommendation = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'Test consigliato nei prossimi 3 mesi';
    case 'medium':
      return 'Test consigliato nelle prossime 4-6 settimane';
    case 'high':
      return 'Test urgente consigliato nelle prossime 2 settimane';
    default:
      return 'Test consigliato regolarmente';
  }
};
