import { useWeatherContext } from '../context/WeatherContext';
import { formatTemp } from '../utils/formatters';

const StatPill = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-center gap-1 bg-white/10 rounded-xl px-4 py-3 flex-1">
    <span className="text-xl">{icon}</span>
    <span className="text-white/50 text-xs uppercase tracking-wider">{label}</span>
    <span className="text-white font-medium text-sm">{value}</span>
  </div>
);

export const WeatherCard = () => {
  const { weatherData, error } = useWeatherContext();

  if (error) {
    return (
      <div
        className="w-full max-w-2xl mx-auto bg-red-500/20 border border-red-400/30
                   rounded-2xl px-6 py-4 text-red-300 text-sm text-center"
      >
        {error}
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div
        className="bg-white/10 border border-white/15 rounded-2xl px-6 py-5
                   backdrop-blur-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white text-2xl font-semibold">{weatherData.city}</h2>
            <p className="text-white/50 text-sm mt-0.5">{weatherData.condition}</p>
          </div>
          <div className="text-right">
            <span className="text-white text-5xl font-light">
              {formatTemp(weatherData.temperature)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <StatPill icon="💧" label="Humidity"  value={`${weatherData.humidity}%`} />
          <StatPill icon="💨" label="Wind"      value={`${Math.round(weatherData.windSpeed)} km/h`} />
          <StatPill icon="🔽" label="Pressure"  value={`${weatherData.pressure} hPa`} />
          <StatPill icon="☀️" label="UV Index"  value={`${weatherData.uvIndex}`} />
        </div>
      </div>

      <div className="flex gap-3">
        <div
          className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-3
                     flex items-center gap-3"
        >
          <span className="text-xl">🌅</span>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Sunrise</p>
            <p className="text-white text-sm font-medium">{weatherData.sunrise}</p>
          </div>
        </div>
        <div
          className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-3
                     flex items-center gap-3"
        >
          <span className="text-xl">🌇</span>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Sunset</p>
            <p className="text-white text-sm font-medium">{weatherData.sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
};