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
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto max-w-md items-center gap-2">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-text-muted" />
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          className="pl-9 h-9"
        />
      </div>
      <Button type="submit" variant="primary" size="sm" className="h-9 gap-1 font-semibold cursor-pointer">
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
      </Button>
    </form>
  );
};