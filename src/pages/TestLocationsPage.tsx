import React, { useState, useEffect } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import LocationList from '@/components/test-locations/LocationList';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import { useLocationData } from '@/hooks/use-location-data';
import { useNearbyLocations } from '@/hooks/use-nearby-locations';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, List, Loader2 } from 'lucide-react';
const TestLocationsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredLocations,
    isLoading,
    handleSearch,
    setFilteredLocations
  } = useLocationData();
  const {
    isLocating,
    findNearMe
  } = useNearbyLocations();
  const navigate = useNavigate();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    setIsIOS(isIOSDevice);

    // Detect if running as PWA (standalone mode)
    const isRunningAsPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsPWA(isRunningAsPWA);
  }, []);
  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
  };
  const handleFindNearMe = () => {
    findNearMe(setFilteredLocations);
  };
  return <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 -my-2 relative z-0"> 
      <div className="absolute top-2 left-0 right-0 z-10 flex justify-center">
        <div className="bg-white rounded-full shadow-md">
          <div className="flex items-center">
            <Button variant={view === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setView('map')} className="h-8 px-3 rounded-l-full">
              <MapPin className="h-4 w-4 mr-1" />
              Mappa
            </Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setView('list')} className="h-8 px-3 rounded-r-full">
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>
      </div>

      {view === 'list' && <div className="p-4 sm:p-6 pt-12 pb-2 bg-background">
          <LocationSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
          <div className="mt-2 flex justify-center">
            <Button onClick={handleFindNearMe} variant="outline" size="sm" disabled={isLocating} className="text-xs">
              {isLocating ? <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Cercando...
                </> : <>
                  <MapPin className="h-3 w-3 mr-1" />
                  Trova vicino a me
                </>}
            </Button>
          </div>
        </div>}

      {view === 'map' ? <div className="h-full min-h-[300px]">
          <LocationMap />
        </div> : <div className="p-4 sm:p-6 overflow-y-auto">
          <LocationList isLoading={isLoading || isLocating} filteredLocations={filteredLocations} handleViewDetails={handleViewDetails} />
        </div>}
    </div>;
};
export default TestLocationsPage;