
import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

const mockData = {
  lastTest: { date: '2023-09-15', result: 'Negativo' },
  riskLevel: 'low' as const,
  nextTestDue: '2023-12-15',
  recentEncounters: [
    { id: '1', date: '2023-10-10', type: 'Rapporto orale', risk: 'low' as const },
    { id: '2', date: '2023-09-28', type: 'Rapporto vaginale', risk: 'medium' as const },
  ],
  upcomingTests: [
    { id: '1', date: '2023-12-15', type: 'Test completo IST' },
  ]
};

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState(mockData);
  
  // In a real app, you'd fetch this data from an API or local storage
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setDashboardData(mockData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Dashboard 
      lastTest={dashboardData.lastTest}
      riskLevel={dashboardData.riskLevel}
      nextTestDue={dashboardData.nextTestDue}
      recentEncounters={dashboardData.recentEncounters}
      upcomingTests={dashboardData.upcomingTests}
    />
  );
};

export default DashboardPage;
