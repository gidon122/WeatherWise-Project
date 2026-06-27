import { useWeatherContext } from '../context/WeatherContext';
import { SearchBar } from '../components/SearchBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherCard } from '../components/WeatherCard';
import { Forecast } from '../components/Forecast';
import { ChatBox } from '../components/ChatBox';
import { Loader } from '../components/Loader';
import { CloudSun, Sparkles } from 'lucide-react';

const WelcomeView = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto space-y-4 animate-fade-in select-none">
    <div className="p-4 bg-app-accent/30 rounded-full border border-app-primary/10 text-app-primary">
      <CloudSun className="h-10 w-10 animate-pulse" />
    </div>
    <div className="space-y-1.5">
      <h2 className="text-lg font-extrabold text-app-text tracking-tight">Welcome to WeatherMind AI</h2>
      <p className="text-xs text-app-text-muted leading-relaxed max-w-xs font-semibold">
        Search for a city above to inspect atmospheric stats, forecast predictions, and get AI clothing recommendations.
      </p>
    </div>
    <div className="flex items-center gap-1.5 text-[9px] text-app-primary bg-app-accent/40 border border-app-primary/20 rounded-full px-3 py-1 font-bold">
      <Sparkles className="h-3 w-3" />
      <span>Type a city to get started</span>
    </div>
  </div>
);

const Home = () => {
  const { isLoading, weatherData, error } = useWeatherContext();

  return (
    <main className="h-screen w-screen bg-app-bg text-app-text flex flex-col p-4 md:p-5 gap-3 md:overflow-hidden select-none transition-colors duration-300">
      {/* Header bar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-app-border pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="p-1.5 bg-app-accent/30 border border-app-primary/10 text-app-primary rounded-lg">
            <CloudSun className="h-5 w-5" />
          </div>
          <h1 className="text-sm font-extrabold text-app-text tracking-wider uppercase">
            WeatherMind <span className="text-app-primary">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchBar />
          <ThemeToggle />
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-grow flex flex-col min-h-0 md:overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : weatherData || error ? (
          <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-3 min-h-0 md:overflow-hidden">
            {/* Left column - Current weather and Forecast */}
            <div className="flex flex-col gap-3 min-h-0 flex-shrink-0 md:overflow-y-auto no-scrollbar pb-1 md:pb-0">
              <WeatherCard />
              <Forecast />
            </div>
            
            {/* Right column - AI Chat widget */}
            <div className="flex flex-col min-h-[250px] md:min-h-0 flex-1 md:overflow-hidden">
              <ChatBox />
            </div>
          </div>
        ) : (
          <WelcomeView />
        )}
      </div>
    </main>
  );
};

export default Home;