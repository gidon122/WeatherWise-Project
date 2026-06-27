import { useState, type FormEvent } from 'react';
import { useWeather } from '../hooks/useWeather';

export const SearchBar = () => {
  const [input, setInput] = useState('');
  const { searchCity } = useWeather();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    searchCity(input);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a city..."
          className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20
                     text-white placeholder-white/40 outline-none
                     focus:border-sky-400 focus:bg-white/15 transition-all duration-200
                     text-base"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 active:scale-95
                     rounded-xl font-medium text-white transition-all duration-200
                     flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          Search
        </button>
      </div>
    </form>
  );
};