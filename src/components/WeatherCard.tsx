import { useWeatherContext } from '../context/WeatherContext';
import { formatTemp } from '../utils/formatters';
import { Card, CardContent } from './ui/card';
import { Droplets, Wind, Gauge, Sun, Sunrise, Sunset, AlertCircle } from 'lucide-react';

const StatPill = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-center justify-center gap-1 bg-app-bg border border-app-border/40 rounded-xl px-1.5 sm:px-2 py-2 sm:py-2.5 flex-1 min-w-0 text-center transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/20">
    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-app-primary shrink-0" />
    <span className="text-app-text-muted text-[9px] sm:text-[10px] uppercase tracking-wider font-bold truncate max-w-full">{label}</span>
    <span className="text-app-text font-bold text-xs mt-0.5 truncate max-w-full">{value}</span>
  </div>
);

export const WeatherCard = () => {
  const { weatherData, error } = useWeatherContext();

  if (error) {
    return (
      <Card className="w-full border-app-danger/20 bg-app-danger/5 text-app-danger">
        <CardContent className="flex items-center justify-center gap-2 p-4 text-sm font-semibold">
          <AlertCircle className="h-4 w-4 text-app-danger shrink-0" />
          <span>{error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
        {/* City and Temp Main Block */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-extrabold text-app-text tracking-tight leading-snug truncate">
              {weatherData.city}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-app-primary animate-pulse shrink-0" />
              <p className="text-xs text-app-text-muted font-semibold capitalize truncate">
                {weatherData.condition}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-app-text to-app-text-muted tabular-nums">
              {formatTemp(weatherData.temperature)}
            </span>
          </div>
        </div>

        {/* 4 Stat Pills Grid (Wraps 2x2 on mobile, 4 in a row on sm) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatPill icon={Droplets} label="Humidity" value={`${weatherData.humidity}%`} />
          <StatPill icon={Wind} label="Wind" value={`${Math.round(weatherData.windSpeed)} km/h`} />
          <StatPill icon={Gauge} label="Pressure" value={`${weatherData.pressure} hPa`} />
          <StatPill icon={Sun} label="UV Index" value={`${weatherData.uvIndex}`} />
        </div>

        {/* Sunrise / Sunset Row */}
        <div className="grid grid-cols-2 gap-2 mt-0.5 sm:mt-1">
          <div className="bg-app-bg border border-app-border/60 rounded-xl px-2.5 sm:px-4 py-2 flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/10 min-w-0">
            <Sunrise className="h-4 w-4 text-app-primary shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-[9px] text-app-text-muted uppercase tracking-wider font-bold truncate">Sunrise</p>
              <p className="text-xs text-app-text font-bold truncate">{weatherData.sunrise}</p>
            </div>
          </div>
          <div className="bg-app-bg border border-app-border/60 rounded-xl px-2.5 sm:px-4 py-2 flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/10 min-w-0">
            <Sunset className="h-4 w-4 text-app-primary shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-[9px] text-app-text-muted uppercase tracking-wider font-bold truncate">Sunset</p>
              <p className="text-xs text-app-text font-bold truncate">{weatherData.sunset}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};