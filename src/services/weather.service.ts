import axios from 'axios';
import type { WeatherData, ForecastDay } from '../types/weather.types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error(
      'OpenWeather API key is not configured. Please define VITE_OPENWEATHER_API_KEY in your .env file.'
    );
  }

  // Fetch current weather and 5-day / 3-hour forecast in parallel
  const [currentRes, forecastRes] = await Promise.all([
    axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    }),
    axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    }),
  ]);

  const currentData = currentRes.data;
  const forecastData = forecastRes.data;

  // Format sunrise and sunset using the local timezone offset of the city
  const timezoneOffset = currentData.timezone; // in seconds
  const formatLocalTime = (unixTimestamp: number) => {
    const localMs = (unixTimestamp + timezoneOffset) * 1000;
    const date = new Date(localMs);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const ampm = utcHours >= 12 ? 'PM' : 'AM';
    const displayHours = utcHours % 12 || 12;
    const displayMinutes = String(utcMinutes).padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const sunrise = formatLocalTime(currentData.sys.sunrise);
  const sunset = formatLocalTime(currentData.sys.sunset);

  // Get current date string in target city's timezone to filter it out from forecast
  const todayStr = new Date((currentData.dt + timezoneOffset) * 1000)
    .toISOString()
    .split('T')[0];

  interface OpenWeatherForecastItem {
    dt: number;
    dt_txt: string;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      description: string;
      main: string;
    }>;
  }

  const list: OpenWeatherForecastItem[] = forecastData.list;

  // Group forecast by local date string
  const groupedForecasts: {
    [date: string]: {
      maxTemps: number[];
      minTemps: number[];
      conditions: Array<{ timeDiff: number; desc: string }>;
    };
  } = {};

  list.forEach((item) => {
    const localDate = new Date((item.dt + timezoneOffset) * 1000)
      .toISOString()
      .split('T')[0];

    // Skip today's data to represent a true 3-day future forecast
    if (localDate === todayStr) return;

    if (!groupedForecasts[localDate]) {
      groupedForecasts[localDate] = {
        maxTemps: [],
        minTemps: [],
        conditions: [],
      };
    }

    groupedForecasts[localDate].maxTemps.push(item.main.temp_max);
    groupedForecasts[localDate].minTemps.push(item.main.temp_min);

    // Calculate how close this block is to midday (12:00:00 local time)
    const localHours = new Date((item.dt + timezoneOffset) * 1000).getUTCHours();
    const timeDiffToMidday = Math.abs(localHours - 12);

    groupedForecasts[localDate].conditions.push({
      timeDiff: timeDiffToMidday,
      desc: item.weather[0]?.description || 'clear sky',
    });
  });

  // Extract, sort, and slice the first 3 future days
  const futureDates = Object.keys(groupedForecasts).sort();
  const selectedDates = futureDates.slice(0, 3);

  const forecast: ForecastDay[] = selectedDates.map((dateStr) => {
    const dayData = groupedForecasts[dateStr];
    const high = Math.max(...dayData.maxTemps);
    const low = Math.min(...dayData.minTemps);

    // Select condition closest to midday (12 PM local time)
    dayData.conditions.sort((a, b) => a.timeDiff - b.timeDiff);
    const rawCondition = dayData.conditions[0]?.desc || 'clear sky';

    // Capitalize condition text for better presentation
    const formattedCondition = rawCondition
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      date: dateStr,
      high,
      low,
      condition: formattedCondition,
    };
  });

  // OpenWeather doesn't supply a direct UV index in current weather standard endpoints.
  // We approximate it based on temperature and cloud state.
  const isClear = currentData.weather[0]?.main?.toLowerCase().includes('clear');
  const temp = currentData.main.temp;
  let uvIndex = 1;
  if (temp > 30) uvIndex = isClear ? 8 : 5;
  else if (temp > 20) uvIndex = isClear ? 6 : 3;
  else if (temp > 10) uvIndex = isClear ? 3 : 2;

  const rawCurrentCondition = currentData.weather[0]?.description || 'clear sky';
  const formattedCurrentCondition = rawCurrentCondition
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    city: currentData.name,
    temperature: currentData.main.temp,
    condition: formattedCurrentCondition,
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed * 3.6, // Convert m/s to km/h
    pressure: currentData.main.pressure,
    uvIndex,
    sunrise,
    sunset,
    forecast,
  };
};