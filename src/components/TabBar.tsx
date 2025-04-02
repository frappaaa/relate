
import React, { useState, useEffect } from 'react';
import { Calendar, Home, Plus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import NewEntryModal from './NewEntryModal';
import { MobileTabItem } from './navigation/MobileTabItem';
import { MobileTabAction } from './navigation/MobileTabAction';

const TabBar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  if (!isMobile) return null;

  const navItems = [
    { path: '/app/dashboard', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/app/test-locations', label: 'Test', icon: <MapPin className="h-5 w-5" /> },
    { path: '/app/calendar', label: 'Calendario', icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background border-t",
        isIOS && "pb-[env(safe-area-inset-bottom)]"
      )}>
        <nav className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <MobileTabItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
          <MobileTabAction
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="h-5 w-5" />}
            label="Nuovo"
          />
        </nav>
      </div>
      
      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TabBar;
