
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedDashboard from '@/components/dashboard/AuthenticatedDashboard';
import UnauthenticatedDashboard from '@/components/dashboard/UnauthenticatedDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard userId={user.id} />;
};

export default DashboardPage;
