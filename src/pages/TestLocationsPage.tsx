
import React, { useState, useEffect } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import { useLocationData } from '@/hooks/use-location-data';
import { useNavigate } from 'react-router-dom';

const TestLocationsPage: React.FC = () => {
  const {
    isLocating,
    isLoading,
    findNearMe
  } = useLocationData();
  
  const navigate = useNavigate();
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    // Detect if running as PWA (standalone mode)
    const isRunningAsPWA = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsPWA(isRunningAsPWA);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 -my-2 relative z-0"> 
      <div className="h-full min-h-[300px]">
        <LocationMap />
      </div>
    </div>
  );
};

export default TestLocationsPage;
