import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { generateWeatherInsights } from '../services/ai.service';
import type { ChatMessage } from '../types/weather.types';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, Sparkles, AlertCircle } from 'lucide-react';

const renderMarkdown = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-app-primary-hover">{part}</strong>;
    }
    return part;
  });
};

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
        err?.message || 'Failed to generate AI insights. Please check your Groq API key.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col flex-1 min-h-0 h-full overflow-hidden border border-app-border bg-app-surface shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2 border-b border-app-border px-4 py-3 bg-app-bg/10 flex-shrink-0">
        <Bot className="h-4 w-4 text-app-primary animate-pulse" />
        <div className="flex-1">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-app-text leading-none">WeatherMind AI</CardTitle>
          <p className="text-[9px] text-app-text-muted font-bold mt-1">Insights & apparel tips for {weatherData.city}</p>
        </div>
      </CardHeader>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0 no-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-2 select-none">
            <Sparkles className="h-5 w-5 text-app-primary animate-pulse" />
            <h4 className="text-app-text font-bold text-xs">Ask WeatherWise AI</h4>
            <p className="text-app-text-muted text-[10px] max-w-xs leading-relaxed font-semibold">
              Ask about clothing tips, outdoor activity feasibility, or forecast details for {weatherData.city}.
            </p>
            <div className="flex flex-col gap-1 w-full max-w-[240px] pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(`What should I wear in ${weatherData.city} today?`)}
                className="justify-start text-[10px] py-1.5 h-auto text-app-text-muted border-app-border bg-app-surface hover:bg-app-bg cursor-pointer font-bold"
              >
                👕 What should I wear?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(`Is it a good day for outdoor activities in ${weatherData.city}?`)}
                className="justify-start text-[10px] py-1.5 h-auto text-app-text-muted border-app-border bg-app-surface hover:bg-app-bg cursor-pointer font-bold"
              >
                ⚽ Outdoor plans?
              </Button>
            </div>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up opacity-0`}
              style={{ animationFillMode: 'forwards' }}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed shadow-sm
                           ${
                             msg.role === 'user'
                               ? 'bg-app-primary text-white font-bold rounded-tr-none'
                               : 'bg-app-bg border border-app-border/40 text-app-text rounded-tl-none font-medium'
                           }`}
              >
                {renderMarkdown(msg.content)}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-app-bg border border-app-border/40 text-app-text rounded-xl rounded-tl-none px-3.5 py-2.5 shadow-sm flex items-center gap-1">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-app-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-app-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-app-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {chatError && (
          <div className="flex items-center gap-1.5 bg-app-danger/10 border border-app-danger/20 text-app-danger rounded-xl px-3 py-2 text-[10px] justify-center">
            <AlertCircle className="h-3.5 w-3.5 text-app-danger shrink-0" />
            <span>{chatError}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-2 border-t border-app-border bg-app-bg/5 flex gap-1.5 flex-shrink-0">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about the weather in ${weatherData.city}...`}
          disabled={isSending}
          className="flex-1 h-9 px-3 py-1.5"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || isSending}
          className="h-9 px-3 cursor-pointer shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </Card>
  );
};