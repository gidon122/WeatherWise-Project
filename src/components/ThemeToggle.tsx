import { Sun, Moon } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { Button } from './ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useWeatherContext();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl border-app-border text-app-text-muted hover:text-app-text transition-colors duration-200 cursor-pointer"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-[18px] w-[18px] text-app-primary animate-fade-in" />
      ) : (
        <Moon className="h-[18px] w-[18px] animate-fade-in" />
      )}
    </Button>
  );
};
