import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { generateWeatherInsights } from '../services/ai.service';
import type { ChatMessage } from '../types/weather.types';

export const ChatBox = () => {
  const { weatherData, chatMessages, setChatMessages } = useWeatherContext();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSending]);

  if (!weatherData) return null;

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...chatMessages, userMessage];

    setChatMessages(updatedMessages);
    setInput('');
    setIsSending(true);
    setChatError(null);

    try {
      const reply = await generateWeatherInsights(updatedMessages, weatherData);
      setChatMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      console.error(err);
      setChatError(
        err?.message || 'Failed to generate AI insights. Please check your Gemini API key.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/10 border border-white/15 rounded-2xl
                    backdrop-blur-sm flex flex-col h-[450px] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <span className="text-2xl animate-pulse">🤖</span>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">WeatherMind AI Assistant</h3>
          <p className="text-white/40 text-xs">Ask clothing tips, outdoor plans, or general queries for {weatherData.city}</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 space-y-3">
            <span className="text-4xl text-sky-400">✨</span>
            <h4 className="text-white font-medium text-sm">Ask anything about weather in {weatherData.city}</h4>
            <p className="text-white/40 text-xs max-w-md">
              Need clothing advice? Wondering if you should carry an umbrella? Ask me anything about current conditions or the forecast!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <button
                onClick={() => setInput(`What should I wear in ${weatherData.city} today?`)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs text-white/70 transition-all duration-200 cursor-pointer"
              >
                👕 What should I wear?
              </button>
              <button
                onClick={() => setInput(`Is it a good day for outdoor activities in ${weatherData.city}?`)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs text-white/70 transition-all duration-200 cursor-pointer"
              >
                ⚽ Outdoor activities?
              </button>
            </div>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md
                           ${
                             msg.role === 'user'
                               ? 'bg-sky-500 text-white rounded-tr-none'
                               : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                           }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 text-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-md flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-300" />
              </span>
              <span className="text-xs text-white/40">Thinking...</span>
            </div>
          </div>
        )}

        {chatError && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-2 text-xs text-center">
            {chatError}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about the weather in ${weatherData.city}...`}
          disabled={isSending}
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white
                     placeholder-white/30 text-sm outline-none focus:border-sky-500 focus:bg-white/10
                     transition-all duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/30 disabled:text-white/30
                     active:scale-95 text-white rounded-xl text-sm font-medium transition-all duration-200
                     flex items-center gap-1.5 cursor-pointer"
        >
          Send
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h5.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.087l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};