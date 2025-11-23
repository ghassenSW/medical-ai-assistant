import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Message } from '@/lib/types';
import { MOCK_DOCTORS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export const useChatStream = () => {
  const { addMessage, setIsStreaming, addRecommendedDoctors } = useAppStore();
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

      const responses = [
        "I'm analyzing your request for doctors in Tunis...",
        "\n\nBased on your location and needs, I've found several qualified medical professionals.",
        "\n\nI'm now displaying them on the map for you.",
        "\n\nYou can click on any marker to see more details about each doctor.",
      ];

      let fullResponse = '';

      // Simulate streaming by adding text gradually
      for (const response of responses) {
        for (const char of response) {
          await sleep(20); // Simulate typing effect
          fullResponse += char;
          setStreamingMessage(fullResponse);
        }
      }

      // Finish streaming
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };
      addMessage(assistantMsg);
      setStreamingMessage('');
      setIsStreaming(false);

      // Add recommended doctors to the store
      const recommendedDocs = MOCK_DOCTORS.slice(0, 3);
      addRecommendedDoctors(recommendedDocs);
    },
    [addMessage, setIsStreaming, addRecommendedDoctors]
  );

  return {
    sendMessage,
    streamingMessage,
  };
};
