
import React, { useState, useEffect } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import LocationList from '@/components/test-locations/LocationList';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import { useLocationData } from '@/hooks/use-location-data';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, List, Loader2 } from 'lucide-react';

const TestLocationsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredLocations,
    isLocating,
    isLoading,
    handleSearch,
    findNearMe
  } = useLocationData();
  
  const navigate = useNavigate();
  const [view, setView] = useState<'map' | 'list'>('map');
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

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 -my-2 relative z-0"> 
      <div className="p-4 sm:p-6 pt-2 pb-2 flex flex-col gap-2 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant={view === 'map' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setView('map')}
              className="h-8 px-3"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Mappa
            </Button>
            <Button 
              variant={view === 'list' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setView('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={findNearMe} 
            disabled={isLocating}
            className="h-8"
          >
            {isLocating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Localizzando...
              </>
            ) : (
              <>
                <MapPin className="h-3 w-3 mr-1" />
                Vicino a me
              </>
            )}
          </Button>
        </div>

        <LocationSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch}
        />
      </div>

      {view === 'map' ? (
        <div className="h-full min-h-[300px]">
          <LocationMap />
        </div>
      ) : (
        <div className="p-4 sm:p-6 overflow-y-auto">
          <LocationList 
            isLoading={isLoading}
            filteredLocations={filteredLocations}
            handleViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default TestLocationsPage;
