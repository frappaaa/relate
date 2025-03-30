import React from 'react';
import RiskStatusCard from './dashboard/RiskStatusCard';
import RecentEncountersCard from './dashboard/RecentEncountersCard';
import UpcomingTestsCard from './dashboard/UpcomingTestsCard';
import DashboardSkeleton from './dashboard/DashboardSkeleton';
import { formatDate } from '@/utils/dateUtils';
interface DashboardProps {
  isLoading?: boolean;
  lastTest?: {
    date: string;
    result: string;
  } | null;
  riskLevel: 'low' | 'medium' | 'high';
  nextTestDue?: string | null;
  recentEncounters: Array<{
    id: string;
    date: string;
    type: string;
    risk: 'low' | 'medium' | 'high';
  }>;
  upcomingTests: Array<{
    id: string;
    date: string;
    type: string;
  }>;
}
const Dashboard: React.FC<DashboardProps> = ({
  isLoading = false,
  lastTest,
  riskLevel,
  nextTestDue,
  recentEncounters,
  upcomingTests
}) => {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Format the lastTest date if it exists
  const formattedLastTest = lastTest ? {
    ...lastTest,
    date: formatDate(lastTest.date)
  } : null;

  // Limitare il numero di rapporti recenti a 3
  const limitedRecentEncounters = recentEncounters.slice(0, 3);
  return <div className="space-y-8 px-[16px] py-[12px]">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
        <p className="text-muted-foreground">Gestisci la tua salute sessuale in modo semplice e consapevole</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskStatusCard riskLevel={riskLevel} lastTest={formattedLastTest} nextTestDue={nextTestDue} />
        
        <RecentEncountersCard recentEncounters={limitedRecentEncounters} />
      </div>

      <UpcomingTestsCard upcomingTests={upcomingTests} />
    </div>;
};
export default Dashboard;