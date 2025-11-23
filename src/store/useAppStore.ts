import { create } from 'zustand';
import { Doctor, Message, UserLocation } from '@/lib/types';

interface AppState {
  // User location
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;

  // Doctors
  recommendedDoctors: Doctor[];
  setRecommendedDoctors: (doctors: Doctor[]) => void;
  addRecommendedDoctors: (doctors: Doctor[]) => void;

  // Selected doctor
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;

  // Chat messages
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  // UI state
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Default location: Tunis, Tunisia
  userLocation: { lat: 36.8065, lng: 10.1815 },
  setUserLocation: (location) => set({ userLocation: location }),

  // Doctors
  recommendedDoctors: [],
  setRecommendedDoctors: (doctors) => set({ recommendedDoctors: doctors }),
  addRecommendedDoctors: (doctors) =>
    set((state) => ({
      recommendedDoctors: [...state.recommendedDoctors, ...doctors],
    })),

  // Selected doctor
  selectedDoctor: null,
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),

  // Chat
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // UI
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
}));
