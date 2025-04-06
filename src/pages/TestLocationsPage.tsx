
import React from 'react';
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

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] -mx-4 sm:-mx-6 -my-2 relative z-0"> {/* Added z-0 to keep the map below other elements */}
      <div className="h-full min-h-[300px]">
        <LocationMap />
      </div>
    </div>
  );
};

export default TestLocationsPage;
