
import React from 'react';
import Dashboard from '@/components/Dashboard';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface AuthenticatedDashboardProps {
  userId: string;
}

const AuthenticatedDashboard: React.FC<AuthenticatedDashboardProps> = ({ userId }) => {
  const { isLoading, dashboardData } = useDashboardData(userId);

  return (
    <Dashboard 
      isLoading={isLoading}
      lastTest={dashboardData.lastTest}
      riskLevel={dashboardData.riskLevel}
      nextTestDue={dashboardData.nextTestDue}
      recentEncounters={dashboardData.recentEncounters}
      upcomingTests={dashboardData.upcomingTests}
    />
  );
};

export default AuthenticatedDashboard;
