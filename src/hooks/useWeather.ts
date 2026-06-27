import { useCallback } from 'react';
import axios from 'axios';
import { useWeatherContext } from '../context/WeatherContext';
import { fetchWeather } from '../services/weather.service';

export const useWeather = () => {
  const { setWeatherData, setIsLoading, setError, setCity, setChatMessages } = useWeatherContext();

  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setIsLoading(true);
    setError(null);
    setCity(city);
    setChatMessages([]);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err: unknown) {
      let message = 'City not found. Please try again.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [setWeatherData, setIsLoading, setError, setCity, setChatMessages]);

  return { searchCity };
};