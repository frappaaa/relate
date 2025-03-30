
import React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSearchBar from '@/components/test-locations/LocationSearchBar';
import ServiceFilterTags from '@/components/test-locations/ServiceFilterTags';
import { toast } from '@/hooks/use-toast';

interface LocationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  isLocating: boolean;
  findNearMe: () => void;
}

const LocationFilters: React.FC<LocationFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableCategories,
  selectedCategories,
  handleCategoryToggle,
  isLocating,
  findNearMe
}) => {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <LocationSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
        />
      </section>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            size="sm" 
            variant="secondary" 
            className="shadow-md"
            onClick={findNearMe}
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Localizzando...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Trova vicino a me
              </>
            )}
          </Button>
        </div>
      </div>
      
      <ServiceFilterTags 
        availableServices={availableCategories} 
        selectedServices={selectedCategories} 
        onServiceToggle={handleCategoryToggle} 
      />
    </div>
  );
};

export default LocationFilters;
