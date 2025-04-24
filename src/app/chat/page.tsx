// src/app/chat/page.tsx
'use client';

import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

// Function to render HTML safely
const renderHTML = (html: string) => {
  return { __html: html };
};

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Welcome message
  useEffect(() => {
    fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.answer) setMessages([{ role: 'bot', content: data.answer }]);
      });
  }, []);

  // Auto-scroll
  useEffect(() => {
    const c = containerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!query.trim()) return;
    setMessages(m => [...m, { role: 'user', content: query }]);
    setQuery('');
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });
    const { answer } = await res.json();
    setMessages(m => [...m, { role: 'bot', content: answer }]);
  };

  const handleOcrAndFind = async () => {
    if (!frontFile || !backFile) {
      alert('Please select both front and back images');
      return;
    }
    const form = new FormData();
    form.append('front_image', frontFile);
    form.append('back_image', backFile);

    setMessages(m => [...m, { role: 'user', content: '📷 Uploaded Aadhaar, extracting…' }]);

    const res = await fetch('/api/ocr', {
      method: 'POST',
      body: form,
    });
    const { answer, profile } = await res.json();
    setMessages(m => [
      ...m,
      { role: 'bot', content: `Extracted profile: ${JSON.stringify(profile)}` },
      { role: 'bot', content: answer },
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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
                {msg.role === 'bot' ? (
                  <>
                    🤖 <span dangerouslySetInnerHTML={renderHTML(msg.content)} />
                  </>
                ) : (
                  `🧑 ${msg.content}`
                )}
              </div>
            ))}
          </div>

          {/* Text-chat controls */}
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type your details or question here..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <Button className='bg-[#155e75] text-white hover:text-[#155e75]' onClick={sendMessage}>Send</Button>
          </div>

          {/* OCR upload controls */}
          <div className="flex flex-col gap-2 pt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFrontFile(e.target.files?.[0] || null)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setBackFile(e.target.files?.[0] || null)}
            />
            <Button className='bg-[#155e75] text-white hover:text-[#155e75]' onClick={handleOcrAndFind}>OCR Extract &amp; Find Schemes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}