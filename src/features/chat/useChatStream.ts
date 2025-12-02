import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Message } from '@/lib/types';
import { MOCK_DOCTORS } from '@/lib/mockData';

// Python FastAPI backend URL
const PYTHON_API_URL = 'http://localhost:8000';

export const useChatStream = () => {
  const { addMessage, setIsStreaming, addRecommendedDoctors, messages } = useAppStore();
  const [streamingMessage, setStreamingMessage] = useState('');

  const sendMessage = useCallback(
    async (userMessage: string) => {
      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };
      addMessage(userMsg);

      // Start streaming assistant response
      setIsStreaming(true);
      setStreamingMessage('');

      try {
        // Call Python FastAPI backend with Gemini 2.5 Flash
        const response = await fetch(`${PYTHON_API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            context: {
              conversationHistory: messages.map(m => ({
                role: m.role,
                content: m.content
              })),
              timestamp: new Date().toISOString()
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  fullResponse += data.text;
                  setStreamingMessage(fullResponse);
                } catch (e) {
                  console.error('Parse error:', e);
                }
              }
            }
          }
        }

        // Add final assistant message
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        };
        addMessage(assistantMsg);
        setStreamingMessage('');

        // Add recommended doctors based on the conversation
        const recommendedDocs = MOCK_DOCTORS.slice(0, 3);
        addRecommendedDoctors(recommendedDocs);

      } catch (error) {
        console.error('Python API error:', error);
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Connection Error**\n\nCouldn't connect to the medical AI service.\n\n**Please ensure:**\n1. Python backend is running on http://localhost:8000\n2. Start backend: \`cd backend && python api_server.py\`\n3. Check terminal for errors\n\n**Error details:** ${(error as Error).message}`,
          timestamp: new Date(),
        };
        addMessage(errorMsg);
        setStreamingMessage('');
      } finally {
        setIsStreaming(false);
      }
    },
    [addMessage, setIsStreaming, addRecommendedDoctors, messages]
  );

  return {
    sendMessage,
    streamingMessage,
  };
};
