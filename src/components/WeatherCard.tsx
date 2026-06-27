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
  <div className="flex flex-col items-center justify-center gap-1 bg-app-bg border border-app-border/40 rounded-xl px-2 py-2.5 flex-1 text-center transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/20">
    <Icon className="h-4 w-4 text-app-primary" />
    <span className="text-app-text-muted text-[10px] uppercase tracking-wider font-bold">{label}</span>
    <span className="text-app-text font-bold text-xs mt-0.5">{value}</span>
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
    <Card className="w-full animate-fade-in opacity-0">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
        {/* City and Temp Main Block */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-app-text tracking-tight leading-none">{weatherData.city}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-app-primary animate-pulse" />
              <p className="text-xs text-app-text-muted font-semibold capitalize truncate max-w-[150px]">{weatherData.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-app-text to-app-text-muted">
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
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-app-bg border border-app-border/60 rounded-xl px-4 py-2 flex items-center justify-center gap-2.5 transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/10">
            <Sunrise className="h-4 w-4 text-app-primary shrink-0" />
            <div className="text-left">
              <p className="text-[9px] text-app-text-muted uppercase tracking-wider font-bold">Sunrise</p>
              <p className="text-xs text-app-text font-bold">{weatherData.sunrise}</p>
            </div>
          </div>
          <div className="bg-app-bg border border-app-border/60 rounded-xl px-4 py-2 flex items-center justify-center gap-2.5 transition-all duration-200 hover:bg-app-accent/20 hover:border-app-primary/10">
            <Sunset className="h-4 w-4 text-app-primary shrink-0" />
            <div className="text-left">
              <p className="text-[9px] text-app-text-muted uppercase tracking-wider font-bold">Sunset</p>
              <p className="text-xs text-app-text font-bold">{weatherData.sunset}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};