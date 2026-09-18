import { useState, type FormEvent } from 'react';
import { useWeather } from '../hooks/useWeather';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  const [input, setInput] = useState('');
  const { searchCity } = useWeather();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    searchCity(input.trim());
  };

  return (  
    <form onSubmit={handleSubmit} className="flex w-full sm:w-auto max-w-md items-center gap-2">
      <div className="relative flex-1 sm:w-56 md:w-64 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-app-text-muted pointer-events-none" />
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          className="pl-8.5 pr-3 h-9 text-base sm:text-xs"
          aria-label="Search city"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="h-9 px-3 shrink-0 flex items-center gap-1.5 font-semibold cursor-pointer"
        aria-label="Submit search"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search</span>
      </Button>
    </form>
  );
};