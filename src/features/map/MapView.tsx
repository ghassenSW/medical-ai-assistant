import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MapView: React.FC = () => {
  const { userLocation, recommendedDoctors, setSelectedDoctor } = useAppStore();

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {recommendedDoctors.map((doctor) => (
          <Marker
            key={doctor.id}
            position={[doctor.lat, doctor.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => setSelectedDoctor(doctor),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                <p className="text-xs text-primary-600 mt-1">{doctor.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {recommendedDoctors.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 pointer-events-none">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors to display
            </h3>
            <p className="text-sm text-gray-500">
              Ask the AI assistant to find doctors for you
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
