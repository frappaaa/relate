
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, getNextTestDate } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

export interface DashboardData {
  lastTest: { date: string; result: string } | null;
  riskLevel: 'low' | 'medium' | 'high';
  nextTestDue: string | null;
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

export const useDashboardData = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    lastTest: null,
    riskLevel: 'low',
    nextTestDue: null,
    recentEncounters: [],
    upcomingTests: []
  });

  const fetchDashboardData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Fetch recent encounters
      const { data: encounters, error: encountersError } = await supabase
        .from('encounters')
        .select('id, date, encounter_type, risk_level, encounter_name')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5);

      if (encountersError) {
        console.error('Error fetching encounters:', encountersError);
        throw encountersError;
      }

      // Fetch tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('id, date, test_type, result, status')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (testsError) throw testsError;

      // Get the most recent completed test
      const completedTests = tests && tests.filter(test => test.status === 'completed');
      const lastTest = completedTests && completedTests.length > 0 
        ? {
            date: completedTests[0].date,
            result: completedTests[0].result || 'Sconosciuto'
          }
        : null;

      // Get upcoming tests
      const upcomingTests = tests && tests
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

      // Format encounters for display, using custom name when available
      const formattedEncounters = encounters ? encounters.map(encounter => {
        // Determine display name - use custom name if available, otherwise format encounter type
        let displayName: string;
        
        if (encounter.encounter_name) {
          displayName = encounter.encounter_name;
        } else {
          const encounterType = encounter.encounter_type;
          displayName = encounterType === 'oral' ? 'Rapporto orale' :
                        encounterType === 'vaginal' ? 'Rapporto vaginale' :
                        encounterType === 'anal' ? 'Rapporto anale' : 'Rapporto';
          
          // Handle multiple types (comma-separated)
          if (encounterType.includes(',')) {
            const types = encounterType.split(',').map(type => {
              return type === 'oral' ? 'orale' :
                     type === 'vaginal' ? 'vaginale' :
                     type === 'anal' ? 'anale' : '';
            }).filter(Boolean);
            
            displayName = `Rapporto ${types.join(', ')}`;
          }
        }

        return {
          id: encounter.id,
          date: encounter.date,
          type: displayName,
          risk: encounter.risk_level
        };
      }) : [];

      setDashboardData({
        lastTest,
        riskLevel,
        nextTestDue,
        recentEncounters: formattedEncounters || [],
        upcomingTests: upcomingTests || []
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
  }, [userId]);

  const setupRealtimeSubscriptions = () => {
    if (!userId) return { encountersChannel: null, testsChannel: null };
    
    // Set up realtime subscription for encounters
    const encountersChannel = supabase
      .channel('encounters-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'encounters',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchDashboardData();
      })
      .subscribe();
      
    // Set up realtime subscription for tests
    const testsChannel = supabase
      .channel('tests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tests',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return { encountersChannel, testsChannel };
  };

  // Set up and clean up realtime subscriptions
  useEffect(() => {
    const { encountersChannel, testsChannel } = setupRealtimeSubscriptions();
    
    return () => {
      if (encountersChannel) supabase.removeChannel(encountersChannel);
      if (testsChannel) supabase.removeChannel(testsChannel);
    };
  }, [userId]);

  return {
    isLoading,
    dashboardData,
    fetchDashboardData
  };
};
