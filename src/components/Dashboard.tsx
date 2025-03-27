
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, Beaker, Clock, Heart, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTimeAgo } from '@/utils/dateUtils';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';
import { Skeleton } from '@/components/ui/skeleton';

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

  return <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
        <p className="text-muted-foreground">Gestisci la tua salute sessuale in modo semplice e consapevole</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Assessment Card */}
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
                  {lastTest ? formatDate(lastTest.date) : 'Non registrato'}
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

        {/* Recent Encounters Card */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-relate-500" />
              Rapporti recenti
            </CardTitle>
            <CardDescription>Gli ultimi rapporti registrati</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {recentEncounters.length > 0 ? <div className="space-y-3">
                {recentEncounters.map(encounter => <div key={encounter.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getRiskColor(encounter.risk)}`} />
                      <div>
                        <p className="text-sm font-medium">{encounter.type}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(encounter.date)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${encounter.risk === 'high' ? 'border-red-500 text-red-500' : encounter.risk === 'medium' ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500'}`}>
                      {getRiskLabel(encounter.risk)}
                    </Badge>
                  </div>)}
              </div> : <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">Nessun rapporto registrato</p>
              </div>}
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild className="w-full" variant="outline">
              <Link to="/app/calendar">Visualizza tutti i rapporti</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Upcoming Tests Card */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-relate-500" />
            Prossimi appuntamenti
          </CardTitle>
          <CardDescription>Test e visite pianificate</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 py-[16px]">
          {upcomingTests.length > 0 ? <div className="space-y-3">
              {upcomingTests.map(test => <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border group hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Beaker className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{test.type}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(test.date)}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>)}
            </div> : <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">Nessun test pianificato</p>
              <Button variant="link" className="mt-2" asChild>
                <Link to="/app/new-test">Pianifica un test</Link>
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
};

// Skeleton loader for dashboard
const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
        <p className="text-muted-foreground">Gestisci la tua salute sessuale in modo semplice e consapevole</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-relate-500" />
              Rapporti recenti
            </CardTitle>
            <CardDescription>Gli ultimi rapporti registrati</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-relate-500" />
            Prossimi appuntamenti
          </CardTitle>
          <CardDescription>Test e visite pianificate</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 py-[16px]">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
