import React from 'react';
import { SplitScreenLayout } from '@/components/layout/SplitScreenLayout';
import { ChatWindow } from '@/features/chat/ChatWindow';
import { MapView } from '@/features/map/MapView';

export const Home: React.FC = () => {
  return (
    <SplitScreenLayout
      leftPanel={<ChatWindow />}
      rightPanel={<MapView />}
    />
  );
};
