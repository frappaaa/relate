
import React from 'react';
import { AlertCircle, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">La tua dashboard</h1>
        <p className="text-muted-foreground">Gestisci la tua salute sessuale in modo semplice e consapevole</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Assessment Card Skeleton */}
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

        {/* Recent Encounters Card Skeleton */}
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

      {/* Upcoming Tests Card Skeleton */}
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

export default DashboardSkeleton;
