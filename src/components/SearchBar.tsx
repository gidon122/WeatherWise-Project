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
  <Input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Search city..."
    className="pl-11 h-9"
  />
</div>
      <Button type="submit" variant="primary" size="sm" className="h-9 flex items-center gap-2 font-semibold cursor-pointer">
  <Search className="h-3.5 w-3.5" />
  <span>Search</span>
</Button>
    </form>
  );
};