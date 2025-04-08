import React, { useState, useEffect } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import { useLocationData } from '@/hooks/use-location-data';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import LocationList from '@/components/test-locations/LocationList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, List } from 'lucide-react';

const TestLocationsPage: React.FC = () => {
  const {
    isLocating,
    isLoading,
    findNearMe,
    searchQuery,
    setSearchQuery,
    handleSearch,
    filteredLocations
  } = useLocationData();
  
  const navigate = useNavigate();
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isViewingList, setIsViewingList] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    const isRunningAsPWA = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsPWA(isRunningAsPWA);
  }, []);

  const handleViewDetails = (locationId: string) => {
    navigate(`/app/test-locations/${locationId}`);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 -my-2 relative z-0"> 
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex bg-white rounded-full shadow-md p-1">
        <Button 
          variant={isViewingList ? "ghost" : "default"} 
          className="rounded-full px-4"
          onClick={() => setIsViewingList(false)}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Mappa
        </Button>
        <Button 
          variant={isViewingList ? "default" : "ghost"} 
          className="rounded-full px-4"
          onClick={() => setIsViewingList(true)}
        >
          <List className="h-4 w-4 mr-1" />
          Lista
        </Button>
      </div>

      {!isViewingList && (
        <div className="absolute bottom-24 right-6 z-10">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="rounded-full h-14 w-14 shadow-lg" size="icon">
                <List className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] px-0">
              <div className="px-4 pt-4 pb-2">
                <LocationSearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                />
              </div>
              <ScrollArea className="h-[calc(85vh-80px)]">
                <div className="px-4 w-full max-w-full">
                  <LocationList 
                    isLoading={isLoading}
                    filteredLocations={filteredLocations}
                    handleViewDetails={handleViewDetails}
                  />
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {isViewingList && (
        <div className="absolute top-16 left-0 right-0 px-4 z-10">
          <LocationSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>
      )}

      <div className="h-full min-h-[300px]">
        {isViewingList ? (
          <div className="h-full pt-24 pb-4 px-4 overflow-auto max-w-full">
            <LocationList 
              isLoading={isLoading}
              filteredLocations={filteredLocations}
              handleViewDetails={handleViewDetails}
            />
          </div>
        ) : (
          <LocationMap />
        )}
      </div>
    </div>
  );
};

export default TestLocationsPage;
