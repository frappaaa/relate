
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TabBar from './TabBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      
      <main className={cn("flex-1 overflow-y-auto", isMobile ? "pb-20" : "pb-16")}>
        <div className="page-container py-0 px-0 my-0">
          <Outlet />
        </div>
      </main>

      {/* TabBar fixed at the bottom with highest z-index */}
      <TabBar />
    </div>
  );
};

export default Layout;
