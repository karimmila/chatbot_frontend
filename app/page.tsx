'use client';
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { FiSend } from "react-icons/fi";

interface Message {
  content: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const botMessage: Message = { content: data.answer || data.response || "Sorry, I couldn't process that.", isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { content: "Sorry, there was an error processing your request.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "What services does Promtior offer?",
    "When was the company founded?",
    "Tell me about GenAI Product Delivery",
    "How does GenAI Department as a Service work?",
    "Explain Customer Service Solutions",
    "What are Promtior's Finance Solutions?"
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4 gap-6">
        <div className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center">
          ID
        </div>
        <button className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center hover:bg-[#79d7d4]/20 transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center hover:bg-[#79d7d4]/20 transition-colors">
          ⌂
        </button>
        <button className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center hover:bg-[#79d7d4]/20 transition-colors">
          ↻
        </button>
        <button className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center hover:bg-[#79d7d4]/20 transition-colors">
          ⚏
        </button>
        <div className="mt-auto">
          <button className="w-8 h-8 bg-[#79d7d4]/10 text-[#79d7d4] rounded-lg flex items-center justify-center hover:bg-[#79d7d4]/20 transition-colors">
            ⚙
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {messages.length === 0 ? (
            <div className="max-w-2xl w-full space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Image src="/favicon.png" alt="Promtior" width={64} height={64} />
                </div>
                <h1 className="text-2xl font-semibold mb-2">Welcome to Promtior Assistant</h1>
                <p className="text-gray-600 mb-8">
                Ask me about our GenAI solutions and services. I&apos;m here to help you understand how we can transform your business.
              </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-4">Popular questions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="text-left p-3 text-sm border rounded-lg hover:bg-[#79d7d4]/5 hover:border-[#79d7d4]/30 transition-colors"
                      onClick={() => setInput(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-[#79d7d4] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    {message.isUser ? (
                      <div className="text-sm">{message.content}</div>
                    ) : (
                      <ReactMarkdown
                        className="prose prose-sm prose-slate max-w-none"
                        components={{
                          p: ({...props}) => <p className="mb-3 last:mb-0" {...props} />,
                          ul: ({...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                          ol: ({...props}) => <ol className="list-decimal ml-4 mb-3 space-y-1" {...props} />,
                          li: ({...props}) => <li className="mb-1" {...props} />,
                          strong: ({...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#79d7d4] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#79d7d4] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-[#79d7d4] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input form */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Promtior's GenAI solutions..."
                  className="w-full p-3 pr-20 border border-gray-200 rounded-lg focus:outline-none focus:border-[#79d7d4] focus:ring-1 focus:ring-[#79d7d4]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {input.length}/2000
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#79d7d4] text-white px-6 py-3 rounded-lg hover:bg-[#6ac2bf] disabled:bg-[#79d7d4]/50 transition-colors font-medium flex items-center gap-2"
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
