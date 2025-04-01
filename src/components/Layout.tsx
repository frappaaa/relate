
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TabBar from './TabBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      
      <main className={cn(
        "flex-1 overflow-y-auto", 
        isMobile && isIOS ? "pb-[calc(5rem+env(safe-area-inset-bottom))]" : 
        isMobile ? "pb-20" : "pb-16"
      )}>
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      <TabBar />
    </div>
  );
};

export default Layout;
