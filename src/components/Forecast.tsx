import { useWeatherContext } from '../context/WeatherContext';
import { formatDate, formatTemp } from '../utils/formatters';

const getWeatherIcon = (condition: string): string => {
  const cond = condition.toLowerCase();
  if (cond.includes('sunny') || cond.includes('clear')) return '☀️';
  if (cond.includes('cloud') || cond.includes('overcast')) return '☁️';
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) return '🌧️';
  if (cond.includes('snow') || cond.includes('sleet') || cond.includes('blizzard')) return '❄️';
  if (cond.includes('thunder') || cond.includes('storm')) return '⛈️';
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) return '🌫️';
  return '⛅';
};

export const Forecast = () => {
  const { weatherData } = useWeatherContext();

  if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h3 className="text-white font-medium text-lg tracking-wide pl-1">3-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {weatherData.forecast.map((day) => (
          <div
            key={day.date}
            className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4
                       flex flex-col items-center justify-between text-center gap-3
                       backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
          >
            <div className="space-y-1">
              <p className="text-white font-medium text-sm">{formatDate(day.date)}</p>
              <p className="text-white/40 text-xs truncate max-w-[150px]">{day.condition}</p>
            </div>
            
            <span className="text-3xl filter drop-shadow">{getWeatherIcon(day.condition)}</span>
            
            <div className="flex gap-3 text-sm">
              <span className="text-white font-semibold">{formatTemp(day.high)}</span>
              <span className="text-white/40">{formatTemp(day.low)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};