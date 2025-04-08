
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtri</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={findNearMe} 
          disabled={isLocating}
          className="gap-2"
        >
          <Navigation className="h-4 w-4" />
          {isLocating ? 'Localizzando...' : 'Vicino a me'}
        </Button>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-2">Tipologia</h4>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <Badge 
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </Badge>
          ))}
          {availableCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessuna categoria disponibile</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-2">Test disponibili</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer">HIV</Badge>
          <Badge variant="outline" className="cursor-pointer">Epatite</Badge>
          <Badge variant="outline" className="cursor-pointer">Sifilide</Badge>
          <Badge variant="outline" className="cursor-pointer">Gonorrea</Badge>
          <Badge variant="outline" className="cursor-pointer">Clamidia</Badge>
        </div>
      </div>
    </div>
  );
};

export default LocationFilters;
