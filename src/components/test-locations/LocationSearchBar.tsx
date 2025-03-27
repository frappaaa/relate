
import React from 'react';
import { Search } from 'lucide-react';
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
  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mb-6">
      <Input
        type="text"
        placeholder="Cerca per nome, indirizzo o tipo di test"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default LocationSearchBar;
