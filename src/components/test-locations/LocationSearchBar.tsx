
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="Cerca per nome, indirizzo o tipo di test"
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-9 pr-10 py-2 border bg-white/90 backdrop-blur-sm shadow-lg rounded-full focus-visible:ring-1"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationSearchBar;
