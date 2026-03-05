import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder || 'Search...'}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>
    </form>
  );
}