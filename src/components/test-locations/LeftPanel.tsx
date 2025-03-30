
import React from 'react';
import LocationSearch from './LocationSearch';
import LocationListContainer from './LocationListContainer';
import { TestLocation } from '@/services/locationService';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  isLoading: boolean;
  filteredLocations: TestLocation[];
  handleViewDetails: (locationId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableCategories,
  selectedCategories,
  handleCategoryToggle,
  isLoading,
  filteredLocations,
  handleViewDetails
}) => {
  const isMobile = useIsMobile();
  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);

  if (isMobile) {
    return (
      <Drawer
        open={true}
        modal={false}
        onOpenChange={() => {}}
      >
        <DrawerContent className={`max-h-[${isDrawerExpanded ? '80' : '15'}vh] transition-all duration-300 pb-0 pt-2`}>
          <div className="flex justify-center mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-12 rounded-full"
              onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
            >
              {isDrawerExpanded ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>

          <div className="px-4 pb-2">
            <LocationSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <LocationListContainer
              isLoading={isLoading}
              filteredLocations={filteredLocations}
              handleViewDetails={handleViewDetails}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="absolute top-0 left-0 bottom-0 z-10 w-[400px] bg-white/95 shadow-lg rounded-r-lg flex flex-col">
      {/* Search and filters section - fixed at the top */}
      <div className="p-6 pb-4">
        <LocationSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
        />
      </div>
      
      {/* Location list - scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <LocationListContainer
          isLoading={isLoading}
          filteredLocations={filteredLocations}
          handleViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
