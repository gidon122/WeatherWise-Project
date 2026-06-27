export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}