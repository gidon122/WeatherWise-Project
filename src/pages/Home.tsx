import { SearchBar } from '../components/SearchBar';
import { WeatherCard } from '../components/WeatherCard';
import { Forecast } from '../components/Forecast';
import { ChatBox } from '../components/ChatBox';
import { Loader } from '../components/Loader';
import { useWeatherContext } from '../context/WeatherContext';

const Home = () => {
  const { isLoading } = useWeatherContext();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900
                     px-4 py-12 flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          WeatherMind <span className="text-sky-400">AI</span>
        </h1>
        <p className="text-white/40 text-sm">Search any city for live weather + AI insights</p>
      </div>

      <SearchBar />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <WeatherCard />
          <Forecast />
          <ChatBox />
        </>
      )}
    </main>
  );
};

export default Home;