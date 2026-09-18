import { useWeatherContext } from '../context/WeatherContext';
import { SearchBar } from '../components/SearchBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherCard } from '../components/WeatherCard';
import { Forecast } from '../components/Forecast';
import { ChatBox } from '../components/ChatBox';
import { Loader } from '../components/Loader';
import { CloudSun, Sparkles } from 'lucide-react';

const WelcomeView = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 max-w-md mx-auto space-y-4 animate-fade-in my-auto">
    <div className="p-3.5 sm:p-4 bg-app-accent/30 rounded-full border border-app-primary/10 text-app-primary">
      <CloudSun className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
    </div>
    <div className="space-y-1.5 px-2">
      <h2 className="text-base sm:text-lg font-extrabold text-app-text tracking-tight">Welcome to WeatherWise AI</h2>
      <p className="text-xs text-app-text-muted leading-relaxed max-w-xs font-semibold mx-auto">
        Search for a city above to inspect atmospheric stats, forecast predictions, and get AI clothing recommendations.
      </p>
    </div>
    <div className="flex items-center gap-1.5 text-[10px] text-app-primary bg-app-accent/40 border border-app-primary/20 rounded-full px-3 py-1 font-bold">
      <Sparkles className="h-3 w-3 shrink-0" />
      <span>Type a city to get started</span>
    </div>
  </div>
);

const Home = () => {
  const { isLoading, weatherData, error } = useWeatherContext();

  return (
    <main className="min-h-[100dvh] md:h-screen md:max-h-screen w-full max-w-full bg-app-bg text-app-text flex flex-col p-3 sm:p-4 md:p-5 gap-2.5 sm:gap-3 overflow-y-auto md:overflow-hidden transition-colors duration-300">
      {/* Header bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 border-b border-app-border pb-2.5 sm:pb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between w-full sm:w-auto animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-app-accent/30 border border-app-primary/10 text-app-primary rounded-lg shrink-0">
              <CloudSun className="h-5 w-5" />
            </div>
            <h1 className="text-sm font-extrabold text-app-text tracking-wider uppercase whitespace-nowrap">
              WeatherWise <span className="text-app-primary">AI</span>
            </h1>
          </div>
          {/* Mobile Theme Toggle */}
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchBar />
          {/* Desktop/Tablet Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-grow flex flex-col min-h-0 md:overflow-hidden w-full">
        {isLoading ? (
          <Loader />
        ) : weatherData || error ? (
          <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-3 min-h-0 md:overflow-hidden w-full">
            {/* Left column - Current weather and Forecast */}
            <div className="flex flex-col gap-3 min-h-0 flex-shrink-0 md:overflow-y-auto no-scrollbar pb-1 md:pb-0 w-full">
              <WeatherCard />
              <Forecast />
            </div>
            
            {/* Right column - AI Chat widget */}
            <div className="flex flex-col min-h-[420px] sm:min-h-[460px] md:min-h-0 flex-1 md:overflow-hidden w-full mb-2 md:mb-0">
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