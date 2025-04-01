
import React, { useState } from 'react';
import LocationMap from '@/components/test-locations/LocationMap';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';

const TestLocationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality can be implemented later if needed
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="absolute z-10 top-4 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto">
        <LocationSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
      <LocationMap />
    </div>
  );
};

export default TestLocationsPage;
