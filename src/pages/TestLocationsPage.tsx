
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
    <div className="h-[calc(100vh-10rem)]">
      <div className="mb-4">
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
