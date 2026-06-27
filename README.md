# ⛅ WeatherWise AI (WeatherMind)

An AI-powered, modern weather dashboard that provides real-time atmospheric metrics, a 3-day forecast, and conversational weather recommendations. Powered by React 19, TypeScript, Tailwind CSS v4, and integrated with the **OpenWeatherMap API** and the **Groq Llama 3.3 API**.

---

## ✨ Key Features

- **Live Weather Metrics**: Real-time city weather details including temperature, description, humidity, wind speed, pressure, and simulated UV index.
- **Dynamic 3-Day Forecast**: Grouped and aggregated forecast cards showing expected high/low temperatures and conditions, optimized for midday local time.
- **Witty AI Chat Assistant**: Integrated conversational assistant powered by `llama-3.3-70b-versatile` on Groq. The AI is fully context-aware of the current city's weather, allowing users to ask for clothing suggestions, outdoor plans, or travel tips.
- **Timezone-Adaptive Calculations**: Dynamic calculations to present sunrise and sunset times in the local time of the queried city, regardless of the client browser's timezone.
- **Modern Responsive Design**: Premium dark-mode interface styled with Tailwind CSS v4.0.0.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4.0.0 (using `@tailwindcss/vite` compiler plugin)
- **HTTP Client**: Axios
- **State Management**: React Context (`WeatherContext`)
- **AI Engine**: Groq Cloud API (Llama 3.3 model)
- **Weather Engine**: OpenWeatherMap API

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd "WeatherWise Ai"
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### 3. Environment Setup
Create a file named `.env` in the root directory (you can copy `.env.example` as a template):
```bash
cp .env.example .env
```

Open `.env` and add your API keys:
```env
# OpenWeather API configuration (Get your key from https://openweathermap.org/)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Groq API configuration (Get your key from https://console.groq.com/)
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Running Locally
Run the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Production Build
To build the application for deployment:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```
