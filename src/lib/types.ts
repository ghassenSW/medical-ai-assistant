export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lat: number;
  lng: number;
  phone: string;
  address: string;
  governorate?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
