'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    setMessages(prev => [...prev, `🧑: ${query}`]);
    setQuery('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, `🤖: ${data.answer}`]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold text-[#155e75]">Sarkari Sahayog AI 🤖</h2>
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <p key={i} className="text-sm whitespace-pre-wrap">{msg}</p>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
