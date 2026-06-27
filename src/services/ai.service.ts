import axios from 'axios';
import type { ChatMessage, WeatherData } from '../types/weather.types';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL_NAME = 'llama-3.3-70b-versatile'; // Highly performant Groq model
const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const generateWeatherInsights = async (
  messages: ChatMessage[],
  weatherData: WeatherData | null
): Promise<string> => {
  if (!API_KEY) {
    throw new Error(
      'Groq API key is not configured. Please define VITE_GROQ_API_KEY in your .env file.'
    );
  }

  let weatherContext = 'No weather data loaded yet.';
  if (weatherData) {
    weatherContext = `
The user is currently looking at the weather for: ${weatherData.city}.
Current weather statistics:
- Temperature: ${weatherData.temperature}°C
- Condition: ${weatherData.condition}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed.toFixed(1)} km/h
- UV Index: ${weatherData.uvIndex}
- Sunrise: ${weatherData.sunrise}
- Sunset: ${weatherData.sunset}
Forecast for the next days:
${weatherData.forecast
  .map(
    (f) =>
      `  * ${f.date}: High ${f.high}°C, Low ${f.low}°C, Condition: ${f.condition}`
  )
  .join('\n')}
    `.trim();
  }

  const systemPrompt = `
You are "WeatherMind AI", a helpful, witty, and intelligent weather assistant built into a modern weather dashboard.
Your goal is to provide useful insights, apparel suggestions, activity ideas, and answer general questions about the weather, utilizing the current weather data context provided below.

Current Weather Context:
${weatherContext}

Guidance:
1. Reference the current weather/forecast data naturally if relevant to the user's question.
2. Keep responses relatively concise, friendly, and structured (use bullet points or bold text if helpful).
3. If they ask about unrelated topics, politely guide them back to weather, climate, or activity planning based on the weather.
  `.trim();

  // Map messages to OpenAI / Groq compatibility format
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg) => ({
      role: msg.role, // 'user' or 'assistant'
      content: msg.content,
    })),
  ];

  try {
    const { data } = await axios.post(
      BASE_URL,
      {
        model: MODEL_NAME,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = data.choices?.[0]?.message?.content;
    if (!aiText) {
      throw new Error('Received an empty response from Groq AI.');
    }

    return aiText;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
};
