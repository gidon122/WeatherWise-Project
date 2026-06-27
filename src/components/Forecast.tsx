import { useWeatherContext } from '../context/WeatherContext';
import { formatDate, formatTemp } from '../utils/formatters';
import { Card, CardContent } from './ui/card';
import { Calendar, Sun, Cloud, CloudRain, CloudSun, Snowflake, Zap, CloudDrizzle, CloudFog, Thermometer } from 'lucide-react';

const getWeatherIcon = (condition: string) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sunny') || cond.includes('clear')) return Sun;
  if (cond.includes('partly cloudy')) return CloudSun;
  if (cond.includes('cloud') || cond.includes('overcast')) return Cloud;
  if (cond.includes('rain') || cond.includes('shower')) return CloudRain;
  if (cond.includes('drizzle')) return CloudDrizzle;
  if (cond.includes('snow') || cond.includes('sleet') || cond.includes('blizzard')) return Snowflake;
  if (cond.includes('thunder') || cond.includes('storm')) return Zap;
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) return CloudFog;
  return Thermometer;
};

export const Forecast = () => {
  const { weatherData } = useWeatherContext();

  if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-1.5 pl-1 select-none">
        <Calendar className="h-4 w-4 text-app-primary" />
        <h3 className="text-app-text font-bold text-[10px] uppercase tracking-wider">3-Day Forecast</h3>
      </div>
      <div className="flex flex-row md:grid md:grid-cols-3 gap-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-1 md:pb-0 select-none no-scrollbar">
        {weatherData.forecast.map((day) => {
          const Icon = getWeatherIcon(day.condition);
          return (
            <Card
              key={day.date}
              className="min-w-[120px] md:min-w-0 flex-1 snap-start bg-app-surface border-app-border rounded-xl"
            >
              <CardContent className="p-3 flex flex-col items-center justify-between text-center gap-2">
                <div className="space-y-0.5">
                  <p className="text-app-text font-bold text-xs">{formatDate(day.date).split(',')[0]}</p>
                  <p className="text-app-text-muted text-[10px] truncate max-w-[100px] font-semibold">{day.condition}</p>
                </div>
                
                <div className="p-2 bg-app-bg rounded-full border border-app-border/40">
                  <Icon className="h-5 w-5 text-app-primary" />
                </div>
                
                <div className="flex gap-2 text-xs font-bold">
                  <span className="text-app-text">{formatTemp(day.high)}</span>
                  <span className="text-app-text-muted">{formatTemp(day.low)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};