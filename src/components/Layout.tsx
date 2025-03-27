
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TabBar from './TabBar';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      
      <main className={cn("flex-1 overflow-y-auto", isMobile ? "pb-20" : "pb-16")}>
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      <TabBar />
    </div>
  );
};

export default Layout;
