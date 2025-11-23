import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useChatStream } from './useChatStream';
import { Bot } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { messages, isStreaming } = useAppStore();
  const { sendMessage, streamingMessage } = useChatStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">AI Medical Assistant</h2>
        <p className="text-sm text-gray-500">Ask me to find doctors in Tunisia</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 && !streamingMessage && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Medical AI Assistant
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              I can help you find doctors, specialists, and medical facilities across Tunisia.
              Try asking: "Find me a dentist in Tunis"
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-600" />
            </div>
            <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
              <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
              <span className="inline-block w-1 h-4 bg-gray-900 animate-pulse ml-1" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
};
