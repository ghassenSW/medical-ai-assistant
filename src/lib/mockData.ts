import { Doctor } from './types';

// Mock doctors data around Tunis, Tunisia
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Ben Salem',
    specialty: 'Médecin dentiste',
    lat: 36.8065,
    lng: 10.1815,
    phone: '+216 71 123 456',
    address: 'Avenue Habib Bourguiba, Tunis',
    governorate: 'Tunis'
  },
  {
    id: '2',
    name: 'Dr. Fatma Mahjoub',
    specialty: 'Gynécologue Obstétricien',
    lat: 36.8189,
    lng: 10.1658,
    phone: '+216 71 234 567',
    address: 'Rue de la Liberté, Tunis',
    governorate: 'Tunis'
  },
  {
    id: '3',
    name: 'Dr. Mohamed Trabelsi',
    specialty: 'Cardiologue',
    lat: 36.7998,
    lng: 10.1732,
    phone: '+216 71 345 678',
    address: 'Avenue de Paris, Tunis',
    governorate: 'Tunis'
  },
  {
    id: '4',
    name: 'Dr. Salma Gharbi',
    specialty: 'Dermatologue',
    lat: 36.8312,
    lng: 10.1923,
    phone: '+216 71 456 789',
    address: 'Lac 2, Tunis',
    governorate: 'Tunis'
  },
  {
    id: '5',
    name: 'Dr. Karim Bouazizi',
    specialty: 'Ophtalmologue',
    lat: 36.7856,
    lng: 10.1547,
    phone: '+216 71 567 890',
    address: 'El Menzah, Tunis',
    governorate: 'Tunis'
  },
  {
    id: '6',
    name: 'Dr. Leila Messaoudi',
    specialty: 'Chirurgien Orthopédiste',
    lat: 36.8423,
    lng: 10.2087,
    phone: '+216 71 678 901',
    address: 'La Marsa, Tunis',
    governorate: 'Tunis'
  }
];

export const SPECIALTY_STATS = [
  { specialty: 'Médecin dentiste', count: 450 },
  { specialty: 'Gynécologue Obstétricien', count: 320 },
  { specialty: 'Ophtalmologue', count: 280 },
  { specialty: 'Chirurgien Orthopédiste', count: 210 },
  { specialty: 'Dermatologue', count: 195 },
  { specialty: 'Cardiologue', count: 175 },
  { specialty: 'Oto-Rhino-Laryngologiste', count: 160 },
  { specialty: 'Généraliste', count: 140 },
];

export const GOVERNORATE_STATS = [
  { name: 'Tunis', count: 1250 },
  { name: 'Ariana', count: 680 },
  { name: 'Ben Arous', count: 520 },
  { name: 'Sfax', count: 450 },
  { name: 'Sousse', count: 380 },
  { name: 'Monastir', count: 310 },
  { name: 'Nabeul', count: 290 },
  { name: 'Bizerte', count: 240 },
];
