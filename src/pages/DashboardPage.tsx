import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, getNextTestDate } from '@/utils/dateUtils';
import { getUpcomingEvents } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    lastTest: null as { date: string; result: string } | null,
    riskLevel: 'low' as 'low' | 'medium' | 'high',
    nextTestDue: null as string | null,
    recentEncounters: [] as Array<{
      id: string;
      date: string;
      type: string;
      risk: 'low' | 'medium' | 'high';
    }>,
    upcomingTests: [] as Array<{
      id: string;
      date: string;
      type: string;
    }>
  });

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch recent encounters
      const { data: encounters, error: encountersError } = await supabase
        .from('encounters')
        .select('id, date, encounter_type, risk_level')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (encountersError) throw encountersError;

      // Fetch tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('id, date, test_type, result, status')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (testsError) throw testsError;

      // Get the most recent completed test
      const completedTests = tests.filter(test => test.status === 'completed');
      const lastTest = completedTests.length > 0 
        ? {
            date: completedTests[0].date,
            result: completedTests[0].result || 'Sconosciuto'
          }
        : null;

      // Get upcoming tests
      const upcomingTests = tests
        .filter(test => new Date(test.date) >= new Date() && test.status !== 'cancelled')
        .map(test => ({
          id: test.id,
          date: test.date,
          type: test.test_type
        }));

      // Calculate risk level based on recent encounters
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (encounters && encounters.length > 0) {
        const hasHighRisk = encounters.some(e => e.risk_level === 'high');
        const hasMediumRisk = encounters.some(e => e.risk_level === 'medium');
        
        if (hasHighRisk) {
          riskLevel = 'high';
        } else if (hasMediumRisk) {
          riskLevel = 'medium';
        }
      }

      // Calculate next test due date
      const lastTestDate = lastTest ? new Date(lastTest.date) : null;
      const nextTestDueDate = getNextTestDate(lastTestDate, riskLevel);
      const nextTestDue = formatDate(nextTestDueDate);

      // Format encounters for display
      const formattedEncounters = encounters.map(encounter => ({
        id: encounter.id,
        date: encounter.date,
        type: encounter.encounter_type === 'oral' ? 'Rapporto orale' :
              encounter.encounter_type === 'vaginal' ? 'Rapporto vaginale' :
              encounter.encounter_type === 'anal' ? 'Rapporto anale' : 'Altro',
        risk: encounter.risk_level
      }));

      setDashboardData({
        lastTest,
        riskLevel,
        nextTestDue,
        recentEncounters: formattedEncounters,
        upcomingTests
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei dati.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for encounters
    const encountersChannel = supabase
      .channel('db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'encounters'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();
      
    // Set up realtime subscription for tests
    const testsChannel = supabase
      .channel('db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tests'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(encountersChannel);
      supabase.removeChannel(testsChannel);
    };
  }, [user]);

  if (!user) {
    // If not authenticated, you could redirect to login
    // or show a placeholder state
    return (
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
          <p className="text-muted-foreground">Accedi per visualizzare i tuoi dati</p>
        </section>
      </div>
    );
  }

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

export default DashboardPage;
