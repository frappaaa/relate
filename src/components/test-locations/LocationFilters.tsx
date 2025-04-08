
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button 
          onClick={findNearMe} 
          variant="outline" 
          size="sm" 
          disabled={isLocating}
          className="text-xs"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Cercando...
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3 mr-1" />
              Trova vicino a me
            </>
          )}
        </Button>
      </div>
      
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {availableCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryToggle(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationFilters;
