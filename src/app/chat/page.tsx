'use client';

import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🟢 Welcome message on load
  useEffect(() => {
    const loadWelcome = async () => {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });

      const data = await res.json();
      if (data.answer) {
        setMessages([{ role: 'bot', content: data.answer }]);
      }
    };

    loadWelcome();
  }, []);

  // 🔄 Auto-scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });

    const data = await res.json();
    const botMsg: ChatMessage = { role: 'bot', content: data.answer };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="max-w-2xl h-auto mx-auto p-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold text-[#155e75]">Sarkari Sahayog AI 🤖</h2>

          <div
            className="min-h-[200px] max-h-[500px] overflow-y-auto space-y-3 border p-3 rounded-md bg-gray-50"
            ref={containerRef}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm whitespace-pre-wrap p-2 rounded-md ${
                  msg.role === 'bot'
                    ? 'bg-[#e0f2f1] text-black'
                    : 'bg-[#d1e7dd] text-black text-right'
                }`}
              >
                {msg.role === 'bot' ? `🤖 ${msg.content}` : `🧑 ${msg.content}`}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your details or question here..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
